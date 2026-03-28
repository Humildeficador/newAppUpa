import { parseHTML } from 'linkedom'

export function getDocument(htmlData: string) {
	const { document } = parseHTML(htmlData)
	return document
}
