import axios from 'axios'

const baseURL = axios.create({
  baseURL: 'https://reqres.in/api/',
  method: 'post'
})

async function requestApi(endpoint: string, params: any) {
  try {
    return await baseURL.post(endpoint, {
      params: params,
      method: 'post'
    })
    //return await baseURL.request({
    //baseURL: 'https://api.production.starting11.io/',
    //url: endpoint,
    //method: 'post'
    //})
  } catch (error) {
    throw error
  }
}

export default requestApi
