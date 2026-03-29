import fs from 'node:fs'
import path from 'node:path'
import type { PacienteData } from '../services/procedimentoService.js'
import { saveExcelReport } from '../utils/excelGenerator.js'
import { conjuntiviteBuilder } from './conjuntiviteBuilder.js'
import { consultaDiariaBuilder } from './consultaDiariaBuilder.js'
import { gecaBuilder } from './gecaBuilder.js'
import { ivasBuilder, ivasOthersBuilder } from './ivasBuilder.js'

export async function builderMain(pacientesData: PacienteData[]) {
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

	const backupPath = path.resolve(process.cwd(), 'relatorios', 'backup.json')

	if (!fs.existsSync(path.dirname(backupPath))) {
		fs.mkdirSync(path.dirname(backupPath), { recursive: true })
	}

	fs.writeFileSync(backupPath, JSON.stringify(backupGeral, null, 2), 'utf-8')

	await saveExcelReport(consultaDiaria, ivas, conjuntivite, ivasOthers, geca)
}
