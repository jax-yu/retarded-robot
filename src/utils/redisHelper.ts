import redisConfig from './../../config/redis'
const redis = require('redis')

const client = redis.createClient(redisConfig.port, redisConfig.host, {
  auth_pass: redisConfig.password
})

const WECHAT_ROBOT_ADMIN_KEY = 'WECHAT_ROBOT_ADMIN_KEY'
const WECHAT_ROBOT_GROUP_LIST_KEY = 'WECHAT_ROBOT_GROUP_LIST_KEY'
const WECHAT_ROBOT_EXCLUDE_GROUP_KEY = 'WECHAT_ROBOT_EXCLUDE_GROUP_KEY'

client.on('ready', (res: any) => {
  console.log('redis ready')
})

client.on('end', (err: any) => {
  console.log(err)
  console.log('redis end')
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

export const getRobotAdmin = async () => {
  return getSetValue(WECHAT_ROBOT_ADMIN_KEY)
}
export const setRobotAdmin = async (value: string[]) => {
  return setSetValue(WECHAT_ROBOT_ADMIN_KEY, value)
}

export const getGroupList = async () => {
  return getSetValue(WECHAT_ROBOT_GROUP_LIST_KEY)
}
export const setGroupList = async (value: string[]) => {
  return setSetValue(WECHAT_ROBOT_GROUP_LIST_KEY, value)
}

/**
 * getIsGroupExclude value: 1 or 0
 * true: Turn on list exclusion
 * false: Turn off list exclusion
 */
export const getGroupExcludeStatus = async (): Promise<boolean> => {
  const value = await getStringValue(WECHAT_ROBOT_EXCLUDE_GROUP_KEY)
  return value === '1'
}
export const setGroupExcludeStatus = async (value: '1' | '0') => {
  return setStringValue(WECHAT_ROBOT_EXCLUDE_GROUP_KEY, value)
}

export const checkRobotRunConfig = async () => {
  const robotAdmin = await getRobotAdmin()
  const groupList = await getGroupList()
  const groupExcludeStatus = await getGroupExcludeStatus()
}

export const getSetValue = async (key: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    client.smembers(key, (err: any, res: any) => {
      if (err !== null) reject(err)
      resolve(res)
    })
  })
}
export const setSetValue = async (key: string, value: string[]): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    client.sadd(key, value, (err: any, res: any) => {
      if (err !== null) reject(err)
      resolve(true)
    })
  })
}
