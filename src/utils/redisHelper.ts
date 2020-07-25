import redisConfig from './../../config/redis'
const redis = require('redis')

const client = redis.createClient(redisConfig.port, redisConfig.host, {
  auth_pass: redisConfig.password
})

client.on('ready', (res: any) => {
  console.log('ready')
})

client.on('end', (err: any) => {
  console.log(err)
  console.log('end')
})

client.on('error', (err: any) => {
  console.log(err)
})

client.on('connect', () => {
  console.log('redis connect success!')
})

export const getStringValue = async (key: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.get(key, (err: any, res: any) => {
      if (err !== null) reject(err)
      resolve(res)
    })
  })
}

export const setStringValue = async (key: string, value: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    client.set(key, value, (err: any, res: any) => {
      if (err !== null) reject(err)
      resolve(true)
    })
  })
}
