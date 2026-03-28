import fs from 'node:fs'
import type { PacienteData } from '../services/procedimentoService.js'
import {
	formatGecaBairros,
	formatGecaPacientes,
	formatGecaTotais,
	formatStandardReport,
	saveCsv,
} from '../utils/csvFormatters.js'
import { conjuntiviteBuilder } from './conjuntiviteBuilder.js'
import { consultaDiariaBuilder } from './consultaDiariaBuilder.js'
import { gecaBuilder } from './gecaBuilder.js'
import { ivasBuilder, ivasOthersBuilder } from './ivasBuilder.js'

export function builderMain(pacientesData: PacienteData[]) {
	const consultaDiaria = consultaDiariaBuilder(pacientesData)
	const ivas = ivasBuilder(pacientesData)
	const ivasOthers = ivasOthersBuilder(ivas, consultaDiaria)
	const conjuntivite = conjuntiviteBuilder(pacientesData)
	const geca = gecaBuilder(pacientesData)

	const backupGeral = {
		consultaDiaria,
		ivas,
		conjuntivite,
		ivasOthers,
		geca,
	}

	fs.writeFileSync(
		'backup_dados.json',
		JSON.stringify(backupGeral, null, 2),
		'utf-8',
	)

	saveCsv('consulta_diaria', formatStandardReport(consultaDiaria))
	saveCsv('ivas', formatStandardReport(ivas))
	saveCsv('conjuntivite', formatStandardReport(conjuntivite))
	saveCsv('ivas_others', formatStandardReport(ivasOthers))

	saveCsv('geca_pacientes', formatGecaPacientes(geca))
	saveCsv('geca_bairros', formatGecaBairros(geca.bairros))
	saveCsv('geca_totais', formatGecaTotais(geca))
}
