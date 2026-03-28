export interface Paciente {
	senha: string
	numAtendimento: string
	numHygia: string
}

export function getPacientes(document: Document): Paciente[] {
	const rows = document.querySelectorAll('tr.GridAlternatingItem, tr.GridItem')
	const pacientes: Paciente[] = []

	for (const row of Array.from(rows)) {
		const tds = row.querySelectorAll('td')

		const senha = tds[9]?.textContent?.trim() || ''
		if (!senha.startsWith('AT')) continue

		const numHygia = tds[10]?.querySelector('span')?.textContent?.trim()
		if (!numHygia || Number.isNaN(Number(numHygia))) continue

		const numAtendimento = tds[16]?.textContent?.trim()
		if (!numAtendimento) continue

		const status = tds[18]?.textContent?.trim()
		if (status === 'Desistente') continue

		pacientes.push({
			senha,
			numHygia,
			numAtendimento,
		})
	}

	return pacientes
}
