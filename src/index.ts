import { builderMain } from './builders/builderMain.js'
import { authService } from './services/authService.js'
import { procedimentoService } from './services/procedimentoService.js'
import { situacaoService } from './services/situacaoService.js'

async function init() {
	await authService()
	const situacaoDocument = await situacaoService()
	const pacientesData = await procedimentoService(situacaoDocument)
	builderMain(pacientesData)
}

init()
