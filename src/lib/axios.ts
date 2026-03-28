import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'

const jar = new CookieJar()

export const api = wrapper(
	axios.create({
		baseURL: 'http://saudeweb/hygiaweb/',
		withCredentials: true,
		jar,
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
			Accept: '*/*',
		},
		timeout: 20000
	}),
)
