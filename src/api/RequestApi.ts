import axios from 'axios'

const baseURL = axios.create({
  baseURL: 'https://api.bancor.telos/0.1/'
})

async function requestApi(endpoint: string, params: any) {
  try {
    return await baseURL.post(endpoint, {
      params: params
    })
  } catch (error) {
    throw error
  }
}

export default requestApi
