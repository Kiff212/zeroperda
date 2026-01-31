
import * as pdfjsLib from 'pdfjs-dist';

// Define the structure for parsed items
export interface ParsedItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    unit: string;
    originalLine: string;
    suggestedCategory?: string; // Can be filled by heuristics later
}

// Worker Configuration
// In Vite, we usually need to import the worker script URL explicitly or let it resolve from CDN
// For simplest local setup without copy plugins, we use unpkg cdn for the worker matching the version.
// However, 'pdfjs-dist' installed via npm usually includes build/pdf.worker.mjs
// We'll try to use the local worker first, but sometimes in Dev it's tricky.
// Strategy: Use the worker from the installed package using standard import if possible, or CDN as fallback.

// NOTE: For robust production, you should use: import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
// But let's start simple. If it fails, we set global worker.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
).toString();

export async function parseInvoicePDF(file: File): Promise<ParsedItem[]> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';

        // Loop through all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Extract string tokens and join them loosely
            // Note: PDF text extraction is non-linear. Better to sort by Y position if complex.
            // For simple invoices, usually items are line by line.
            const pageText = textContent.items
                // @ts-ignore
                .map((item) => item.str)
                .join(' ');

            fullText += pageText + '\n';
        }

        return extractItemsFromText(fullText);

    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Falha ao ler o PDF. Verifique o arquivo.");
    }
}

// Heuristic Regex to find invoice items
// Patterns vary wildy. We look for common patterns in Brazilian NFe / NFCe 
// Example Line: "001 789100005010 LEITE INTEGRAL 1L    UN   10,0000   5,99   59,90"
function extractItemsFromText(text: string): ParsedItem[] {
    const items: ParsedItem[] = [];

    // Strategy: Split by "token soup" and try to find sequences that look like:
    // [Code?] [Name] [Qty] [Unit] [Price] [Total]
    // This is very hard with just raw text join. 
    // Let's rely on standard NFe layouts often having "Qtde" or similar headers, but raw text often loses columns.

    // FALLBACK STRATEGY: 
    // Look for numeric patterns that denote Quantity and Price near a text description.
    // Regex for "Something Text  X.XX  X.XX"

    // Common separator in text dump is space.

    // We will assume a "Line" approach won't work perfectly because PDF.js often outputs tokens "Code" "Name" "Qty" separately.
    // BUT the .join(' ') above creates a big string.

    // Heuristic: Look for patterns:  <Quantity> <Unit> X <UnitPrice>

    // Mocking more robust logic for specific "Danfe" or "Cupom" layouts requires more complex coordinate mapping.
    // For this MVP, we will try to find lines with currencies.

    // IMPROVED parsing: PDF.js `items` has `transform` (x,y). 
    // Ideally we would sort by Y to reconstruct lines.
    // For now, let's try a regex that matches common item lines if they appear roughly together.

    // Regex to match:  (Name usually uppercase) (Qty numeric) (Price numeric)
    // Example: "LEITE 10 UN 5,99"

    const regex = /([A-Za-z0-9\s\.\-]+?)\s+(\d+(?:[.,]\d+)?)\s+(UN|CX|KG|L|PC|M|FD)\s+x?\s*(\d+(?:[.,]\d+)?)/gi;

    // Since raw join is messy, let's rely on the user to correct data in the Staging Area.
    // We will try to extract just "Name" and "Qty" at minimum.

    // Better approach for MVP:
    // Normalize text
    const normalized = text.replace(/\s+/g, ' ');

    let match;
    // Regex explanation:
    // Group 1: Name (Greedy until numbers)
    // Group 2: Qty (Number)
    // Group 3: Unit (Common units)
    // Group 4: Unit Price (Number)

    // This regex is experimental. User will likely need to adjust.
    // We can also allow the user to just see Raw text and pick? No, too hard.

    // Let's loop through lines if the PDF extracted newlines correctly?
    // Our join above added \n only per page.
    // Let's rely on the fact that headers usually differ from items.

    // Simpler Regex based on typical "Product Name ... Qty ... Total" flow
    // We'll capture any string sequence followed by numbers.

    const simpleItemRegex = /([A-Za-z\s\.\-\/]+)\s+(\d{1,4}[.,]?\d{0,3})\s*(UN|KG|L|CX|PC|FD)/gi;

    while ((match = simpleItemRegex.exec(normalized)) !== null) {
        const name = match[1].trim();
        // Skip common headers
        if (name.length < 3 || name.match(/CÓDIGO|DESCRIÇÃO|QTD|VALOR/i)) continue;

        const qtyStr = match[2].replace(',', '.');
        const unit = match[3];

        const quantity = parseFloat(qtyStr);

        if (!isNaN(quantity) && quantity > 0) {
            items.push({
                name: name,
                quantity: quantity,
                unit: unit,
                unitPrice: 0, // Placeholder
                total: 0, // Placeholder
                originalLine: match[0],
                suggestedCategory: undefined
            });
        }
    }

    return items;
}
