// 机器人HR相关功能

// eslint-disable-next-line no-unused-vars
import { Message } from 'wechaty'
import { db } from '../../db'

export const fetchJobInfo = async (city: string, message: Message) => {
  try {
    await message.say(`${city}工作查询中...`)
    const res = await db.queryJobByCity(city)
    if (res.length) {
      res.map((item, index) => {
        message.say(`${index + 1}: ${item.job_content}`)
      })
    } else {
      await message.say(`${city}暂无工作记录，请联系管理员`)
    }
  } catch (e) {
    await message.say(`${city}工作查询失败，请晚点再查`)
  }
}
