import qs from 'qs'
import { api } from '../lib/axios.js'
import { getViewStateByHtml } from '../parsers/viewStateParser.js'
import { dateVerify } from '../utils/dateVerify.js'
import { getDocument } from '../utils/getDocument.js'
import { rl } from '../utils/readline.js'

export async function situacaoService() {
	let date = await rl.question('Digite a data da situação (DD/MM/YYYY): ')

	let verify = dateVerify(date)
	while (verify.error) {
		console.clear()
		console.log(`\x1b[31m[ERRO]: ${verify.message}\x1b[0m`)
		date = await rl.question('Digite a data da situação (DD/MM/YYYY): ')
		verify = dateVerify(date)
	}

	const html = await api.get('UPA/ListaRecep_Consulta.aspx')
	const viewState = getViewStateByHtml(html.data)

	const body = qs.stringify({
		__EVENTTARGET: 'tlbOK',
		__EVENTARGUMENT: '',
		__lastfocus: 'tlbOK,0,0,A',
		__VIEWSTATE: viewState,
		ddespec: '__ALL__',
		tsCodPac: '',
		'tsCodPac:__Argument__': '',
		ddLocalAtend: '__NULL__',
		ddStatus: '__ALL__',
		txtSenha: '',
		dtbDataIni: date,
		dtbDataFim: date,
	})

	const resHtml = await api.post('UPA/ListaRecep_Consulta.aspx', body, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Referer: 'http://saudeweb/hygiaweb/UPA/ListaRecep_Consulta.aspx',
		},
	})

	const resViewState = getViewStateByHtml(resHtml.data)

	const fullBody = qs.stringify({
		__EVENTTARGET: 'EditButtons1:paging:ImageLink',
		__EVENTARGUMENT: '',
		__lastfocus: 'tlbOK,0,0,A',
		__VIEWSTATE: resViewState,
		ddespec: '__ALL__',
		tsCodPac: '',
		'tsCodPac:__Argument__': '',
		ddLocalAtend: '__NULL__',
		ddStatus: '__ALL__',
		txtSenha: '',
		dtbDataIni: date,
		dtbDataFim: date,
	})

	const full = await api.post('UPA/ListaRecep_Consulta.aspx', fullBody, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Referer: 'http://saudeweb/hygiaweb/UPA/ListaRecep_Consulta.aspx',
		},
	})

	return getDocument(full.data)
}
