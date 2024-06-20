import Cookies from 'js-cookie'
import base64 from 'base64-js'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// User

const tokenKey = 'session_token'
// base64 ma hoa tu text sang du lieu nhi phan.
const encodeBase64 = (data: any) => {
  const encodedData = base64.fromByteArray(Buffer.from(data))
  console.log('Encoded:', encodedData)
  return encodedData
}
const decodeBase64 = (encodedData: any) => {
  const decodedData = Buffer.from(base64.toByteArray(encodedData)).toString('utf8')
  console.log('Decoded:', decodedData)
}

export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, encodeBase64(token))
export const removeToken = () => Cookies.remove(tokenKey)
