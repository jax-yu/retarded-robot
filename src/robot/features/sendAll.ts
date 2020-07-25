// eslint-disable-next-line no-unused-vars
import { log, Message } from 'wechaty'
import robotConfig from '../../../config/robot'
import { robot } from '../index'
// eslint-disable-next-line no-unused-vars
import { EmailUserInfo } from '../../utils/email'
import { getStringValue, setStringValue } from '../../utils/redisHelper'
import {delay, delayValue} from "../../utils/delay";
const fs = require('fs')

const SEND_MSG_KEY = 'SEND_MSG_KEY'

export const sendAllByGroup = async (msg: string, message: Message) => {
  try {
    await setStringValue(SEND_MSG_KEY, msg.substring(2, msg.length))
    await message.say('已存储, 此次已发送, 一小时后自动发送')
    await handleSend()
  } catch (e) {
    await message.say('群发存储失败，请联系开发人员！')
  }
}

const handleSend = async () => {
  const sendMsg = await getStringValue(SEND_MSG_KEY)
  if (sendMsg !== '') {
    if (robotConfig.runConfig.groupSendMode) {
      await robotConfig.runConfig.groupList.map(async item => {
        const room = await robot.Room.find({ id: item })
        room?.say(sendMsg)
      })
    } else {
      const groupList = await robot.Room.findAll()
      const sendList = groupList.map(item => item.id).filter((item) => {
        return robotConfig.runConfig.groupList.findIndex(mItem => mItem === item) === -1
      })
      sendList.map(async item => {
        const room = await robot.Room.find({ id: item })
        await room?.sync()
        room?.say(sendMsg)
        await delay(delayValue.sendRoomMsg)
      })
    }
    await sendAdmin('群发完成', robotConfig.runConfig.admin[0])
  } else {
    await sendAdmin('群发内容为空', robotConfig.runConfig.admin[0])
  }
  setTimeout(() => {
    handleSend()
  }, 1000 * 60 * 60) // 一小时发送一次
}

export const sendEmailInfoToAdmin = async (userInfo: EmailUserInfo) => {
  await sendAdmin(`🆕58简历自动筛选:
姓名: ${userInfo.name}
性别: ${userInfo.sex}
年龄: ${userInfo.age}
手机: ${userInfo.phone}`, robotConfig.runConfig.admin[0])
}

export const sendAdmin = async (msg: string, adminAlias: string) => {
  const contact = await robot.Contact.find({ alias: adminAlias })
  contact?.say(msg)
}

export const loadGroupList = async (isWriteFile: boolean = false) => {
  const list = await robot.Room.findAll()
  const data: any[] = []
  await list.map(async item => {
    data.push({
      id: item.id,
      topic: await item.topic()
    })
  })
  if (isWriteFile) {
    fs.writeFile('./group.txt', JSON.stringify(data), () => {
    })
  }
  return data
}
