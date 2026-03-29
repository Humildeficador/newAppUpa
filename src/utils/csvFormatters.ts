import fs from 'node:fs'
import path from 'node:path'
import type { gecaBuilder } from '../builders/gecaBuilder.js'

export type RelatorioPadrao = Record<'m' | 'f', Record<string, number>>
export type GecaPadrao = ReturnType<typeof gecaBuilder>

export function saveCsv(filename: string, rows: (string | number)[][]) {
	const content = rows.map((row) => row.join(',')).join('\n')

	const dirPath = path.resolve(process.cwd(), 'relatorios')
	const filePath = path.join(dirPath, `${filename}.csv`)

	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}

	fs.writeFileSync(filePath, content, 'utf-8')
}

export function formatStandardReport(dados: RelatorioPadrao) {
	const linhas: Array<Array<string | number>> = [
		['Sexo', 'Faixa Etaria', 'Quantidade'],
	]

	const generos = ['m', 'f'] as const

	for (const genero of generos) {
		for (const [faixa, quantidade] of Object.entries(dados[genero])) {
			linhas.push([genero.toUpperCase(), `="${faixa}"`, quantidade])
		}
	}

	return linhas
}

export function formatGecaPacientes(dados: GecaPadrao) {
	const linhas: Array<Array<string | number>> = [['Faixa Etaria', 'Quantidade']]

	for (const [faixa, quantidade] of Object.entries(dados.pacientes)) {
		linhas.push([`="${faixa}"`, quantidade])
	}
	return linhas
}

export function formatGecaBairros(bairros: Record<string, number>) {
	const linhas: (string | number)[][] = [['Bairro', 'Quantidade']]

	const ordenados = Object.entries(bairros).sort((a, b) => b[1] - a[1])
	linhas.push(...ordenados)

	return linhas
}

export function formatGecaTotais(dados: GecaPadrao) {
	return [
		['Categoria', 'Total'],
		['Medicado', dados.medicado],
		['Nao Medicado', dados.naoMedicado],
		['EV (Endovenosa)', dados.ev],
	]
}
