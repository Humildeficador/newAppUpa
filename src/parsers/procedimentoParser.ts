
export function getProcedimento(document: Document) {
	const cid =
		document.querySelector('#gridAtCID__ctl2__1_nomecid')?.parentElement
			?.previousElementSibling?.textContent || ''

	const { medicado, el, pacienteMedicado, numEspecialidade, numRe } = getMedicacao(document)

	return { cid, medicado, el, pacienteMedicado, numEspecialidade, numRe }
}

function getMedicacao(document: Document) {
	const links = document.querySelectorAll(
		'[href="http://saudeweb/hygiaweb/Ambulatorio/AtendimentoPac_Det_Proced.aspx"]',
	)

	const el = Array.from(links).find(
		(e) =>
			e.id.includes('gridProfisAtend__ctl') &&
			e.parentElement?.previousElementSibling?.textContent ===
				'TECNICO DE ENFERMAGEM',
	)

	const elMP = Array.from(links).find(
		(e) =>
			e.id.includes('gridProcLancados__ctl') &&
			e.parentElement?.nextElementSibling?.textContent ===
				'Numero de Pacientes Medicados',
	)

	if (el && elMP) {
		return {
			medicado: true,
			pacienteMedicado: true,
			el,
			numRe: null,
			numEspecialidade: null,
		}
	} else if (el) {
		const values = el.getAttribute('values')?.split(',')
		if (values) {
			return {
				medicado: true,
				pacienteMedicado: false,
				el,
				numRe: values[1],
				numEspecialidade: values[3],
			}
		}
		return {
			medicado: true,
			pacienteMedicado: false,
			el,
			numRe: null,
			numEspecialidade: null,
		}
	}
	return {
		medicado: false,
		pacienteMedicado: false,
		el: null,
		numRe: null,
		numEspecialidade: null,
	}
}

/* const cidElement = document.querySelector(
  "[validatedcontrols='gridAtCID__ctl2__3_confirmado']"
) */

/* 
	http://saudeweb/hygiaweb/Ambulatorio/AtendimentoPac_Registro.aspx?numatend=&espec=15&profis=13451&us=7169310&espec_filtro=__ALL__&profis_filtro=__ALL__&tipoat=&dataini=12/4/2024%200:0:0&datafim=12/4/2024%200:0:0
*/
