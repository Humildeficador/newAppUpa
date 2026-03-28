import qs from 'qs'
import { api } from '../lib/axios.js'
import { getViewStateByHtml } from '../parsers/viewStateParser.js'
import { getDocument } from '../utils/getDocument.js'

export async function pacienteService(numHygia: string) {
	const html = await api.get(
		'Ambulatorio/Paciente_Cad.aspx?Paciente=&mode=View&manager=RecordManager1',
	)

	const viewState = getViewStateByHtml(html.data)

	const body = qs.stringify({
		__EVENTTARGET: 'tsPac:hypSearch:ImageLink',
		__EVENTARGUMENT: '',
		__lastfocus: 'tsPac_hypSearch_ImageLink,0,0,A',
		__VIEWSTATE: viewState,
		tsPac: numHygia,
		'tsPac:__Argument__': '',
	})

	const res = await api.post(
		'Ambulatorio/Paciente_Cad.aspx?Paciente=&mode=View&manager=RecordManager1',
		body,
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Referer:
					'http://saudeweb/hygiaweb/Ambulatorio/Paciente_Cad.aspx?Paciente=&mode=View&manager=RecordManager1',
			},
		},
	)

	const document = getDocument(res.data)

	const nome =
		document.querySelector('#TtNome')?.textContent?.toLowerCase() || ''
	const sexo =
		document.querySelector('#TddSexo')?.textContent[0]?.toLowerCase() || ''
	const nasc =
		document.querySelector('#TdDataNasc')?.textContent?.toLowerCase() ||
		`${(new Date()).getFullYear()}`
	const bairro =
		document.querySelector('#tsbairro')?.nextElementSibling?.nextElementSibling
			?.textContent || 'Fora do município'
	const cidade =
		document.querySelector('#tscidade')?.nextElementSibling?.nextElementSibling
			?.textContent || 'Fora do município'

	const idade = calculateAge(nasc)


  return {
		nome,
    sexo,
    bairro,
    cidade,
    idade
  }
}

function calculateAge(nasc: string) {
	const nowYear = new Date().getFullYear()
	const nascSplited = nasc?.split('/')
	const year = Number(nascSplited[2])

	return nowYear - year
}
