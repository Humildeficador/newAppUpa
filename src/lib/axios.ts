import axios from "axios"
import { CookieJar } from "tough-cookie"
import { wrapper } from "axios-cookiejar-support"

const jar = new CookieJar()

export const api = wrapper(
  axios.create({
    baseURL: "http://saudeweb/hygiaweb/",
    withCredentials: true,
    jar,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "*/*",
    },
  })
)
