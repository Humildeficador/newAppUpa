import type { PacienteData } from '../services/procedimentoService.js'
import { ageRangeTwo } from '../utils/ageRange.js'
import { structureTwo } from '../utils/buildStructure.js'

export function consultaDiariaBuilder(pacientesData: PacienteData[]) {
	const consultaDiaria = {
		m: structureTwo(),
		f: structureTwo(),
	}

	for (const { idade, sexo } of pacientesData) {
		const faixa = ageRangeTwo(idade)

		if (sexo === 'm') {
			consultaDiaria.m[faixa] += 1
		} else if(sexo === 'f') {
			consultaDiaria.f[faixa] += 1
		}
	}

  return consultaDiaria
}
