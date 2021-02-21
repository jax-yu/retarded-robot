import axios from 'axios'

interface smartChatType {
  userSayContent: string,
  userId?: string,
  origin: string
}
interface apiWrapTyp<T> {
  'code': number,
  'msg': string,
  'data': T
}
interface smartChatResponseType {
  'session': string,
  'answer': string
}

export async function smartChat (params: smartChatType): Promise<apiWrapTyp<smartChatResponseType>> {
  const res = await axios.post('https://api.xajeyu.com/api/SmartChat', params)
  return res.data
}
