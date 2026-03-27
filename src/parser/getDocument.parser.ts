import { parseHTML } from "linkedom";

export function getDocument(strDOM: string) {
    const { document } = parseHTML(strDOM)
    return document
}