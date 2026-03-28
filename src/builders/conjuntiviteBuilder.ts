import type { PacienteData } from '../services/procedimentoService.js'
import { ageRangeOne } from '../utils/ageRange.js'
import { structureOne } from '../utils/buildStructure.js'
import { cidVerify } from '../utils/cidVerify.js'

export function conjuntiviteBuilder(pacientesData: PacienteData[]) {
	const conjuntivite = {
		m: structureOne(),
		f: structureOne(),
	}

	for (const { idade, sexo, cid } of pacientesData) {
		const faixa = ageRangeOne(idade)
		if (cidVerify(cid) !== 'conjutivite') continue

		if (sexo === 'm') {
			conjuntivite.m[faixa] += 1
		} else if (sexo === 'f') {
			conjuntivite.f[faixa] += 1
		}
	}

	return conjuntivite
}
