
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
// Improved Regex to find invoice items based on user feedback
// User Rule: Ignore chars before first letter. Stop after Unit.
// Standard line: "1234 LEITE INT 1L X 10,00"
// We want: Name="LEITE INT 1L", Unit="1L" (or infer unit from end of name).

function extractItemsFromText(text: string): ParsedItem[] {
    const items: ParsedItem[] = [];

    // Normalize text: remove multiple spaces
    const lines = text.split('\n');

    // Regex Explanation:
    // 1. (?:^|\s) -> Start match at start of string or whitespace
    // 2. (?![0-9]) -> Negative lookahead: Make sure we don't start matching on a number (Code)
    // 3. ([a-zA-Z].*?) -> Capture Group 1 (Name): Start with a letter, match anything lazily...
    // 4. \s+ -> Space separator
    // 5. (\d+(?:[.,]\d+)?\s*(?:KG|L|ML|G|UN|CX|PC|FD|M|LITRO|GRAMAS|MILILITRO)) -> Capture Group 2 (Qty+Unit or Unit Pattern)
    //    We look for a number followed by Unit. 
    //    CRITICAL: This patterns often appear TWICE. Once in Name (Coca 2L) and once in Qty (10 UN).

    // Simpler heuristic per user request:
    // "Ignore anything before first letter"
    // "Ignore anything after unit in the name"

    // Let's process line by line (assuming PDF.js output newline roughly correctly) or just regex the whole blob.
    // Given the previous "join space" strategy, we operate on a blob.

    // Let's refine the blob regex.
    // We look for: <Possible Code/Junk> <NAME STARTS WITH LETTER> ... <UNIT PATTERN> <Junk Prices>

    const itemRegex = /[^a-zA-Z\n]*([a-zA-Z][^0-9\n]*(?:\d+(?:[.,]\d+)?\s*(?:KG|L|ML|G|UN|CX|PC|FD|M|LITRO))?)(.*)/gi;

    // Issue: The regex above consumes the rest of the line in group 3.
    // We want to extract the Name up to the Unit.

    // Let's try finding the pattern:  "NAME ... UNIT"
    // And assume the first occurrence of a Unit pattern ENDS the name.

    const complexRegex = /([a-zA-Z][a-zA-Z0-9\s\.\-\/]*?)\s(\d+(?:[.,]\d+)?\s*(?:KG|L|ML|G|UN|CX|PC|FD|M))/gi;

    // Use normalized text with spaces
    const normalized = text.replace(/\s+/g, ' ');

    let match;
    while ((match = complexRegex.exec(normalized)) !== null) {
        let nameCandidate = match[1].trim();
        const unitCandidate = match[2].trim(); // e.g. "2L" or "10 UN"

        // Filter out very short names or headers
        if (nameCandidate.length < 3 || nameCandidate.match(/CÓDIGO|DESCRIÇÃO|QTD|VALOR|TOTAL|ICMS/i)) continue;

        // User Rule: "Ignore everything before first letter of name"
        // Our regex starts with [a-zA-Z], so it already skips leading numbers/codes.

        // User Rule: "Ignore everything after unit"
        // Our regex stops capturing Name at the unit boundary match.
        // BUT: "Coca Cola 2L" -> Name="Coca Cola", Unit="2L". 
        // We should combine them for the full Product Name.
        const fullName = `${nameCandidate} ${unitCandidate}`;

        // Naive Quantity Extraction:
        // We need the quantity which usually follows...
        // The regex `complexRegex` might have matched "Coca Cola" (Name) and "2L" (Unit).
        // Where is the Quantity? "10 UN" might be next.

        // Let's peek ahead in the string for the next number.
        const nextPartStart = complexRegex.lastIndex;
        const lookAhead = normalized.substring(nextPartStart, nextPartStart + 20); // Look at next 20 chars

        // Look for a number in the lookAhead
        const qtyMatch = lookAhead.match(/(\d+(?:[.,]\d+)?)/);
        let quantity = 1; // Default

        if (qtyMatch) {
            quantity = parseFloat(qtyMatch[1].replace(',', '.'));
        }

        // Deduplicate?
        // Sometimes "Coca Cola 2L" matches, then later "10 UN" might match as a name if we are not careful?
        // "UN" is unlikely to match [a-zA-Z] start unless strictly enforced?
        // "UN" is letters. So "UN" could be a name.
        if (nameCandidate.toUpperCase() === 'UN' || nameCandidate.toUpperCase() === 'CX') continue;

        items.push({
            name: fullName,
            quantity: quantity > 0 ? quantity : 1,
            unit: unitCandidate,
            unitPrice: 0,
            total: 0,
            originalLine: match[0] + ' ' + lookAhead,
            suggestedCategory: undefined
        });
    }

    return items;
}

