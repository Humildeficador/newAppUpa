import { auth } from "./services/auth.services.js"
import { loadFullSituacao } from "./services/situacao.services.js"

async function init() {
    await auth()
    await loadFullSituacao()
}

init()