import { getDocument } from '../utils/getDocument.js'

/**
 * Extrai o ViewState de um objeto Document já processado.
 * Útil quando você já transformou o HTML em DOM para outras operações.
 */
export function getViewState(document: Document): string {
	const viewState = document.querySelector(
		'input[name="__VIEWSTATE"]',
	) as HTMLInputElement

	if (!viewState) {
		throw new Error('ViewState não encontrado no documento.')
	}

	return viewState.value
}

/**
 * Extrai o ViewState diretamente de uma string HTML.
 * @param html - A string bruta do HTML (geralmente res.data do axios)
 */
export function getViewStateByHtml(html: string): string {
	const document = getDocument(html)
	return getViewState(document)
}
