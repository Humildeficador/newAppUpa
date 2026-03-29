export function cidVerify(cid: string) {
	if (geca.includes(cid)) return 'geca'
	if (ivas.includes(cid)) return 'ivas'
	if (conjutivite.includes(cid)) return 'conjutivite'
	return null
}

const geca = ['A09', 'A08', 'K52']
const ivas = [
	'J00',
	'J02.9',
	'J03.9',
	'J04',
	'J04.1',
	'J04.2',
	'J06',
	'J10',
	'J11',
]
const conjutivite = [
	'B30',
	'B30.0',
	'B30.9',
	'H10',
	'H10.0',
	'H10.1',
	'H10.2',
	'H10.3',
	'H10.4',
	'H10.9',
]
