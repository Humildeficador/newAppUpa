import qs from "qs"
import { api } from "../lib/axios.js"
import { getDocument } from "../parser/getDocument.parser.js"
import { getViewState } from "../parser/getViewState.parser.js"
import { rl } from "../utils/readline.js"

export async function auth() {
    let hasLogged: boolean

    const html = (await api.get("Seguranca/Identificacao.aspx"))
    const document = getDocument(html.data)
    const viewState = getViewState(document)

    hasLogged = await login(viewState)

    while (!hasLogged) {
        console.clear()
        console.log('Usuário ou senha inválidos')
        hasLogged = await login(viewState)
    }

    console.clear()
    console.log('Logado.')
    
    const data = await rl.question("Data da situação: ")
}

async function login(viewState: string) {
    const cUsuario = (await rl.question("Usuario: ")).trim()
    const cSenha = (await rl.question("Senha: ")).trim()

    const body = qs.stringify({
        __EVENTTARGET: "",
        __EVENTARGUMENT: "",
        __lastfocus: "",
        __VIEWSTATE: viewState,
        cUsuario,
        cSenha,
        "bt_Entrar.x": 87,
        "bt_Entrar.y": 22,
    })

    const resHtml = (await api.post("Seguranca/Identificacao.aspx", body, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: "http://saudeweb/hygiaweb/Seguranca/Identificacao.aspx",
        },
    }))

    const resDocument = getDocument(resHtml.data)

    const msg = resDocument.querySelector('#cMsg')

    if(!msg) return true
    return false
}