import qs from 'qs'
import { api } from '../lib/axios.js'
import { getViewStateByHtml } from '../parsers/viewStateParser.js'
import { getDocument } from '../utils/getDocument.js'
import { rl } from '../utils/readline.js'

export async function authService() {
	let hasLogged: { error: boolean; message: string }

	const html = await api.get('Seguranca/Identificacao.aspx')
	const viewState = getViewStateByHtml(html.data)

	hasLogged = await login(viewState)

	while (hasLogged.error) {
		console.clear()
		console.log(`\x1b[31m[ERRO]: ${hasLogged.message}\x1b[0m`)
		hasLogged = await login(viewState)
	}

	console.clear()
	console.log('Logado.')
}

async function login(viewState: string) {
	const cUsuario = (await rl.question('Usuario: ')).trim()
	const cSenha = (await rl.question('Senha: ')).trim()

	const body = qs.stringify({
		__EVENTTARGET: '',
		__EVENTARGUMENT: '',
		__lastfocus: '',
		__VIEWSTATE: viewState,
		cUsuario,
		cSenha,
		'bt_Entrar.x': 87,
		'bt_Entrar.y': 22,
	})

	const resHtml = await api.post('Seguranca/Identificacao.aspx', body, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Referer: 'http://saudeweb/hygiaweb/Seguranca/Identificacao.aspx',
		},
	})

	const resDocument = getDocument(resHtml.data)

	const msg = resDocument.querySelector('#cMsg')

	if (!msg) {
		return {
			error: false,
			message: '',
		}
	}
	return {
		error: true,
		message: msg.textContent || '',
	}
}
