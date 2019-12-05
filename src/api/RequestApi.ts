import axios from 'axios'

const baseURL = axios.create({
  baseURL: 'https://us-central1-coolx-242811.cloudfunctions.net/'
  //method: 'post'
})

async function requestApi(endpoint: string, params: any) {
  try {
<<<<<<< HEAD
    return baseURL.post(endpoint, {
      params: params
=======
    return await baseURL.post(endpoint, {
      params: params,
>>>>>>> 0c7b5ac22f5782aab61ac5f761da89466658740c
    })
    // return await baseURL.request({
    //   url: endpoint,
    //   method: 'post'
    // })
  } catch (error) {
    throw error
  }
}

export default requestApi
