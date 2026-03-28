import type { PacienteData } from '../services/procedimentoService.js'
import { ageRangeOne } from '../utils/ageRange.js'
import { structureOne } from '../utils/buildStructure.js'
import { cidVerify } from '../utils/cidVerify.js'

export function gecaBuilder(pacientesData: PacienteData[]) {
	const geca = {
		pacientes: structureOne(),
		bairros: {} as Record<string, number>,
		medicado: 0,
		naoMedicado: 0,
		ev: 0,
	}

	let totalMedicado: number = 0

	for (const { idade, cid, bairro, medicado } of pacientesData) {
		const faixa = ageRangeOne(idade)
		if (cidVerify(cid) !== 'geca') continue

		geca.pacientes[faixa] += 1

		geca.bairros[bairro] = (geca.bairros[bairro] ?? 0) + 1

		if (medicado) totalMedicado++

		geca.naoMedicado++
	}

	geca.ev = Math.floor(totalMedicado / 5) * 2
	geca.medicado = totalMedicado - geca.ev

	return geca
}
