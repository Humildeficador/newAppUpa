export function dateVerify(date: string) {
	const now = new Date()

	if (date.length !== 10) {
		return {
			error: true,
			message: 'Data no formato incorreto. Ex: 01/01/2000',
		}
	}

	const dateSplited = date.split('/')

	const onlyNumbers = dateSplited.every((v) => /^\d+$/.test(v))

	if (!onlyNumbers || dateSplited.length !== 3) {
		return {
			error: true,
			message: 'A data deve conter apenas números e barras.',
		}
	}
	const [d, m, y] = dateSplited.map(Number)
	const typedDate = new Date(y, m - 1, d)
	now.setHours(0, 0, 0, 0)

	if (typedDate.getDate() !== d || typedDate.getMonth() !== m - 1) {
		return {
			error: true,
			message: `Data inexistente (dia ${d} ou mês ${m}).`,
		}
	}

	if (typedDate > now) {
		return {
			error: true,
			message: 'A data digitada é maior do que a data atual.',
		}
	}

	return {
		error: false,
		message: '',
	}
}
