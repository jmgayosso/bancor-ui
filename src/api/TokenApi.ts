import RequestApi from '@/api/RequestApi'

export async function testRequest () {
 return await RequestApi("test/v1", {})
}