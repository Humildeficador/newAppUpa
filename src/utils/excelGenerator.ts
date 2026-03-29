import fs from 'node:fs'
import path from 'node:path'
import ExcelJS from 'exceljs'
import type { GecaPadrao, RelatorioPadrao } from './csvFormatters.js'

function formatStandardSheet(
	worksheet: ExcelJS.Worksheet,
	dados: RelatorioPadrao,
) {
	worksheet.addRow(['Faixa Etaria', 'Masculino', 'Feminino', 'Total'])

	const faixas = Object.keys(dados.m)
	let rowIndex = 2

	for (const faixa of faixas) {
		const qtdM = dados.m[faixa]
		const qtdF = dados.f[faixa]

		worksheet.addRow([
			faixa,
			qtdM,
			qtdF,
			{ formula: `=B${rowIndex}+C${rowIndex}` },
		])
		rowIndex++
	}

	worksheet.addRow([
		't',
		{ formula: `=SUM(B2:B${rowIndex - 1})` },
		{ formula: `=SUM(C2:C${rowIndex - 1})` },
		{ formula: `=SUM(D2:D${rowIndex - 1})` },
	])
}

function formatGecaSheet(worksheet: ExcelJS.Worksheet, dados: GecaPadrao) {
	worksheet.addRow([
		'Faixa Etaria',
		'Quantidade',
		'',
		'Categoria',
		'Total',
		'',
		'Bairro',
		'Quantidade',
	])

	const faixas = Object.entries(dados.pacientes)
	const totais = [
		['Medicado', dados.medicado],
		['Nao Medicado', dados.naoMedicado],
		['EV (Endovenosa)', dados.ev],
	]
	const bairros = Object.entries(dados.bairros).sort((a, b) => b[1] - a[1])

	const maxRows = Math.max(faixas.length, totais.length, bairros.length)
	let rowIndex = 2

	for (let i = 0; i < maxRows; i++) {
		const faixa = faixas[i] || ['', '']
		const total = totais[i] || ['', '']
		const bairro = bairros[i] || ['', '']

		worksheet.addRow([
			faixa[0],
			faixa[1],
			'',
			total[0],
			total[1],
			'',
			bairro[0],
			bairro[1],
		])
		rowIndex++
	}

	worksheet.addRow([
		'Total',
		{ formula: `=SUM(B2:B${rowIndex - 1})` },
		'',
		'',
		'',
		'',
		'',
		'',
	])
}

export async function saveExcelReport(
	consultaDiaria: RelatorioPadrao,
	ivas: RelatorioPadrao,
	conjuntivite: RelatorioPadrao,
	ivasOthers: RelatorioPadrao,
	geca: GecaPadrao,
) {
	const workbook = new ExcelJS.Workbook()

	formatStandardSheet(workbook.addWorksheet('Consulta Diaria'), consultaDiaria)
	formatStandardSheet(workbook.addWorksheet('IVAS'), ivas)
	formatStandardSheet(workbook.addWorksheet('Conjuntivite'), conjuntivite)
	formatStandardSheet(workbook.addWorksheet('IVAS Outros'), ivasOthers)
	formatGecaSheet(workbook.addWorksheet('GECA'), geca)

	const dirPath = path.resolve(process.cwd(), 'relatorios')
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}

	const filePath = path.join(dirPath, 'Estatisticas_UPA.xlsx')
	await workbook.xlsx.writeFile(filePath)
	console.log(
		'\x1b[32m%s\x1b[0m',
		'Planilha gerada com sucesso e fórmulas aplicadas.',
	)
}
