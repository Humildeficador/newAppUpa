import { api } from "../lib/axios.js";
import { getDocument } from "../parser/getDocument.parser.js";
import { getViewState } from "../parser/getViewState.parser.js";
import { rl } from "../utils/readline.js";
import qs from "qs"

export async function loadFullSituacao() {
    const data = await rl.question("Digite a data da situação (DD/MM/YYYY): ")
    const html = await api.get("UPA/ListaRecep_Consulta.aspx")
    const document = getDocument(html.data)
    const viewState = getViewState(document)

    const body = qs.stringify({
        __EVENTTARGET: "tlbOK",
        __EVENTARGUMENT: "",
        __lastfocus: "tlbOK,0,0,A",
        __VIEWSTATE: viewState,
        ddespec: "__ALL__",
        tsCodPac: "",
        "tsCodPac:__Argument__": "",
        ddLocalAtend: "__NULL__",
        ddStatus: "__ALL__",
        txtSenha: "",
        dtbDataIni: data,
        dtbDataFim: data,
    });

    const resHtml = await api.post("UPA/ListaRecep_Consulta.aspx", body, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: "http://saudeweb/hygiaweb/UPA/ListaRecep_Consulta.aspx",
        },
    });

    const resDocument = getDocument(resHtml.data)
    const resViewState = getViewState(resDocument)

    const fullBody = qs.stringify({
        __EVENTTARGET: "EditButtons1:paging:ImageLink",
        __EVENTARGUMENT: "",
        __lastfocus: "tlbOK,0,0,A",
        __VIEWSTATE: resViewState,
        ddespec: "__ALL__",
        tsCodPac: "",
        "tsCodPac:__Argument__": "",
        ddLocalAtend: "__NULL__",
        ddStatus: "__ALL__",
        txtSenha: "",
        dtbDataIni: data,
        dtbDataFim: data,
    });

    const full = await api.post("UPA/ListaRecep_Consulta.aspx", fullBody, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: "http://saudeweb/hygiaweb/UPA/ListaRecep_Consulta.aspx",
        },
    })
}