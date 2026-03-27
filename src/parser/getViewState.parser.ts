export function getViewState(document: Document){
    const viewState = document.querySelector('[name="__VIEWSTATE"]') as HTMLInputElement

    if(!viewState) throw new Error('ViewState não encontrado')

    return viewState.value
}