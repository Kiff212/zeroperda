
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

// We want: Name="LEITE INT 1L", Unit="1L" (or infer unit from end of name).


function extractItemsFromText(text: string): ParsedItem[] {
    const items: ParsedItem[] = [];

    // Normalize text (join lines with space just in case, though usually input is already joined per page)
    const normalized = text.replace(/\s+/g, ' ');


    // Strategy: Match the TABULAR structure visible in screenshot.
    // Row Pattern:  [ID] [DESCRIPTION] [UNIT_COLUMN]
    // ID: Number
    // Unit Column: UN, KG, L, CX, PC, FD, M, G (Standalone)

    // Regex Captures:
    // Group 1: ID (Matches start of line or space-separated number)
    // Non-Capturing Gap: [^a-zA-Z]* -> Skips prices, dates, e.g. "5.99 ... 02/02/2026"
    // Group 2: Raw Description (Found after skipping non-letters)
    // Group 3: Unit Column (Type)

    const rowRegex = /\b(\d+)\s+[^a-zA-Z]*([a-zA-Z].*?)\s+(KG|UN|L|CX|PC|FD|M|LITRO|GRAMAS|ML|UND)\b/gi;

    let match;
    while ((match = rowRegex.exec(normalized)) !== null) {
        const id = match[1];
        let rawName = match[2].trim();
        const columnUnit = match[3];

        // Filter out headers
        if (rawName.match(/DESCRIÇÃO|PRODUTO|DETALHE/i)) continue;

        // USER RULE: "Ignore everything after the unit of measure which usually stays in the name"
        // Example: "Coca Cola 2L Promoção" -> "Coca Cola 2L"
        // We look for an "Embedded Unit" pattern inside the name.

        // Regex for Embedded Unit (e.g., 2L, 600ml, 5kg, 170g)
        // Must be a number followed immediately (or space) by unit code.
        // We capture the END of this pattern to slice the string.

        const embeddedUnitRegex = /(\d+(?:[.,]\d+)?\s*(?:KG|K|L|ML|M|G|GRAMAS|LITROS?|MILILITROS?))\b/i;
        const embeddedMatch = rawName.match(embeddedUnitRegex);

        let finalName = rawName;
        // let inferredQuantity = 1; // Default

        if (embeddedMatch) {
            // Found a unit in the name!
            // embeddedMatch[0] is the full unit string (e.g., "170g")
            // embeddedMatch.index is where it starts.

            // Cut the string immediately after this unit.
            // + match length
            const cutIndex = (embeddedMatch.index || 0) + embeddedMatch[0].length;
            finalName = rawName.substring(0, cutIndex).trim();
        }

        // Fallback: If no embedded unit found (e.g. "Pão Francês"), we keep the full name captured before the UN column.

        // QUANTITY RULE: User said "não quero que reconheça nenhum tipo de quantidade".
        // Means we should default to 0 or 1, and let user input manually or assume batch = stock entry.
        // The previous bug was "170" from "Iogurte 170g" becoming quantity.
        // This happened because we tried to parse numbers *after* the name regex.
        // Since we are NOT looking for quantity anymore, we set it to 0 (or 1 as default batch count).

        items.push({
            name: finalName,
            quantity: 1, // Default to 1 per user request (was reading "170" wrongly)
            unit: columnUnit,
            unitPrice: 0,
            total: 0,
            originalLine: `ID:${id} ${rawName} [${columnUnit}]`,
            suggestedCategory: undefined
        });
    }

    return items;
}
