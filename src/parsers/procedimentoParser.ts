export function getProcedimento(document: Document) {
	const cidElement = document.querySelector(
		'[id^="gridAtCID__ctl"][id$="_nomecid"]',
	)

	const cid =
		cidElement?.parentElement?.previousElementSibling?.textContent || ''

	const { medicado, el, pacienteMedicado, numEspecialidade, numRe } =
		getMedicacao(document)

	return { cid, medicado, el, pacienteMedicado, numEspecialidade, numRe }
}

function getMedicacao(document: Document) {
	const resultado = {
		medicado: false,
		pacienteMedicado: false,
		el: null as Element | null,
		numRe: null as string | null,
		numEspecialidade: null as string | null,
	}

	const links = Array.from(
		document.querySelectorAll(
			'[href="http://saudeweb/hygiaweb/Ambulatorio/AtendimentoPac_Det_Proced.aspx"]',
		),
	)

	resultado.el = links.find((e) => {
		if (!e.id.includes('gridProfisAtend__ctl')) return false
		const linha = e.closest('tr')
		return linha?.textContent?.includes('TECNICO DE ENFERMAGEM')
	}) || null

	const elMP = links.find((e) => {
		if (!e.id.includes('gridProcLancados__ctl')) return false
		const linha = e.closest('tr')
		return linha?.textContent?.includes('Numero de Pacientes Medicados')
	})

	if (resultado.el) {
		resultado.medicado = true

		if (elMP) {
			resultado.pacienteMedicado = true
		} else {
			const values = resultado.el.getAttribute('values')?.split(',')
			if (values && values.length >= 4) {
				resultado.numRe = values[1]
				resultado.numEspecialidade = values[3]
			}
		}
	}

	return resultado
}