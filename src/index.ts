import { builderMain } from './builders/builderMain.js'
import { authService } from './services/authService.js'
import { procedimentoService } from './services/procedimentoService.js'
import { situacaoService } from './services/situacaoService.js'

async function init() {
	await authService()
	const situacaoDocument = await situacaoService()
	const pacientesData = await procedimentoService(situacaoDocument)
	await builderMain(pacientesData)
	console.log(`\x1b[32mDados processados com sucesso\x1b[0m`)
}

init()
