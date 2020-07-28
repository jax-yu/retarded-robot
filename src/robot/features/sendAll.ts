// eslint-disable-next-line no-unused-vars
import { log, Message } from 'wechaty'
import { robot } from '../index'
// eslint-disable-next-line no-unused-vars
import { EmailUserInfo } from '../../utils/email'
import {
  getGroupExcludeStatus,
  getGroupList,
  getRobotAdmin,
  getStringValue,
  setStringValue
} from '../../utils/redisHelper'
import { delay, delayValue } from '../../utils/delay'
const fs = require('fs')

const SEND_MSG_KEY = 'SEND_MSG_KEY'
let nextHandleSend: NodeJS.Timeout | null = null

export const sendAllByGroup = async (msg: string, message: Message) => {
  try {
    await setStringValue(SEND_MSG_KEY, msg.substring(2, msg.length))
    await message.say('已存储, 此次已发送, 一小时后自动发送')
    await handleSend()
  } catch (e) {
    await message.say('群发存储失败，请联系开发人员！')
  }
}

export const clearNextHandleSend = () :string => {
  if (nextHandleSend !== null) {
    clearTimeout(nextHandleSend)
    nextHandleSend = null
    return '停止群发成功'
  }
  return '未设置群发'
}

const handleSend = async () => {
  const sendMsg = await getStringValue(SEND_MSG_KEY)
  const admin = await getRobotAdmin()
  if (sendMsg !== '') {
    if (await getGroupExcludeStatus()) {
      const excludeGroupList = await getGroupList()
      const groupList = await robot.Room.findAll()
      const sendList = groupList.map(item => item.id).filter((item) => {
        return excludeGroupList.findIndex(mItem => mItem === item) === -1
      })
      sendList.map(async item => {
        await sendGroupMsg(sendMsg, item)
      })
    } else {
      const groupList = await robot.Room.findAll()
      groupList.map(async item => {
        await sendGroupMsg(sendMsg, item.id)
      })
    }
    await sendAdmin('群发完成', admin.length > 0 ? admin[0] : '')
  } else {
    await sendAdmin(`定时群发通知:
    群发内容为空`, admin.length > 0 ? admin[0] : '')
  }
  nextHandleSend = setTimeout(() => {
    handleSend()
  }, 1000 * 60 * 60) // 一小时发送一次
}

const sendGroupMsg = async (msg: string, groupId: string) => {
  const room = await robot.Room.find({ id: groupId })
  await room?.sync()
  room?.say(msg)
  await delay(delayValue.sendRoomMsg)
}

export const sendEmailInfoToAdmin = async (userInfo: EmailUserInfo) => {
  const admin = await getRobotAdmin()
  await sendAdmin(`🆕58简历自动筛选:
姓名: ${userInfo.name}
性别: ${userInfo.sex}
年龄: ${userInfo.age}
手机: ${userInfo.phone}`, admin.length > 0 ? admin[0] : '')
}

export const sendAdmin = async (msg: string, adminId: string) => {
  const contact = await robot.Contact.find({ weixin: adminId })
  contact?.say(msg)
}

export const loadGroupList = async (isWriteFile: boolean = false) => {
  const list = await robot.Room.findAll()
  const data: any[] = []
  for await (const item of list) {
    data.push({
      id: item.id,
      topic: await item.topic()
    })
  }
  if (isWriteFile) {
    fs.writeFile('./group.txt', JSON.stringify(data), () => {
    })
  }
  return data
}
