import cliProgress from 'cli-progress'
import qs from 'qs'
import { api } from '../lib/axios.js'
import { getProcedimento } from '../parsers/procedimentoParser.js'
import { getPacientes, type Paciente } from '../parsers/situacaoParser.js'
import { getViewState } from '../parsers/viewStateParser.js'
import { getDocument } from '../utils/getDocument.js'
import { rl } from '../utils/readline.js'
import { pacienteService } from './pacienteService.js'

export interface PacienteData extends Paciente {
	nome: string
	sexo: string
	idade: number
	bairro: string
	cidade: string
	cid: string
	medicado: boolean
}

export async function procedimentoService(document: Document) {
	const bar = new cliProgress.SingleBar(
		{
			format: 'Processando |{bar}| {percentage}% | {value}/{total}',
		},
		cliProgress.Presets.shades_classic,
	)

	const pacientes = getPacientes(document)
	const pacientesData: PacienteData[] = []
	bar.start(pacientes.length, 0)
	const addMP =
		(await rl.question('[BETA]: 41999MP? (Y/n): ')).trim().toLowerCase() === 'y'
	rl.close()
	for (const data of pacientes) {
		try {
			const paciente = await pacienteConstructor(data)

			const html = await api.get(
				`Ambulatorio/AtendimentoPac_Registro.aspx?numatend=${paciente.numAtendimento}`,
			)

			const document = getDocument(html.data)

			const situacao = document.querySelector('#txtAtendStatus')

			const { cid, medicado, pacienteMedicado, numEspecialidade, numRe } =
				getProcedimento(document)

			if (addMP && !pacienteMedicado && situacao?.textContent !== 'Encerrado') {
				const viewState = getViewState(document)
				const body = qs.stringify({
					__EVENTTARGET: 'tlbReg',
					__EVENTARGUMENT: '',
					__lastfocus: '',
					__VIEWSTATE: viewState,
					txtAtendBusca: paciente.numAtendimento,
					ddEspecLancar: numEspecialidade,
					ddprofisLancar: numRe,
					ddprogLancar: '__NULL__',
					tsProc1: '41999MP',
					'tsProc1:3A__Argument__': '',
					txtquantproced1: '1',
					txtAutoriz1: '',
					tsProc2: '',
					tsProc23A__Argument__: '',
					txtquantproced2: '1',
					txtAutoriz2: '',
					tsProc3: '',
					'tsProc3:3A__Argument__': '',
					txtquantproced3: '1',
					txtAutoriz3: '',
					tsProc4: '',
					'tsProc4:3A__Argument__': '',
					txtquantproced4: '1',
					txtAutoriz4: '',
					tsProc5: '',
					'tsProc5:3A__Argument__': '',
					txtquantproced5: '1',
					txtAutoriz5: '',
					tsCid1: '',
					'tsCid1:3A__Argument__': '',
					tsCid2: '',
					'tsCid2:3A__Argument__': '',
					tsCid3: '',
					'tsCid3:3A__Argument__': '',
					tsCid4: '',
					'tsCid4:3A__Argument__': '',
					ddResolucao: '__NULL__',
					DataResolucao: '',
					HoraResolucao: '',
				})

				await api.post(
					`Ambulatorio/AtendimentoPac_Registro.aspx?numatend=${paciente.numAtendimento}`,
					body,
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							Referer: `http://saudeweb/hygiaweb/Ambulatorio/AtendimentoPac_Registro.aspx?numatend=${paciente.numAtendimento}`,
						},
					},
				)
			}

			pacientesData.push({ ...paciente, cid, medicado })
		} finally {
			bar.increment()
		}
	}
	bar.stop()
	return pacientesData
}

async function pacienteConstructor({
	senha,
	numHygia,
	numAtendimento,
}: Paciente) {
	const { nome, sexo, idade, bairro, cidade } = await pacienteService(numHygia)

	return {
		senha,
		nome,
		numHygia,
		numAtendimento,
		idade,
		sexo,
		bairro,
		cidade,
	}
}
