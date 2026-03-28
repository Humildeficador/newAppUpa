import type { PacienteData } from '../services/procedimentoService.js'
import { ageRangeTwo } from '../utils/ageRange.js'
import { structureTwo } from '../utils/buildStructure.js'
import { cidVerify } from '../utils/cidVerify.js'
import type { consultaDiariaBuilder } from './consultaDiariaBuilder.js'

export function ivasBuilder(pacientesData: PacienteData[]) {
	const ivas = {
		m: structureTwo(),
		f: structureTwo(),
	}

	for (const { idade, sexo, cid } of pacientesData) {
		const faixa = ageRangeTwo(idade)
		if (cidVerify(cid) !== 'ivas') continue

		if (sexo === 'm') {
			ivas.m[faixa] += 1
		} else if (sexo === 'f') {
			ivas.f[faixa] += 1
		}
	}

	return ivas
}

export function ivasOthersBuilder(
	ivas: ReturnType<typeof ivasBuilder>,
	consultasDiarias: ReturnType<typeof consultaDiariaBuilder>,
) {
	const ivasOthers = {
		m: structureTwo(),
		f: structureTwo(),
	}

	const generos = ['m', 'f'] as const

	for (const genero of generos) {
		const faixas = Object.keys(ivasOthers[genero]) as Array<
			keyof ReturnType<typeof structureTwo>
		>

		for (const faixa of faixas) {
			ivasOthers[genero][faixa] =
				consultasDiarias[genero][faixa] - ivas[genero][faixa]
		}
	}

	return ivasOthers
}
