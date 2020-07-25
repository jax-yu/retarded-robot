// eslint-disable-next-line no-unused-vars
import { Message } from 'wechaty'
import robotConfig from '../../../config/robot'
import { robot } from '../index'
// eslint-disable-next-line no-unused-vars
import { EmailUserInfo } from '../../utils/email'
import { getStringValue, setStringValue } from '../../utils/redisHelper'

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
    if (robotConfig.runConfig.sendAllGroup.length > 0) {
      await robotConfig.runConfig.sendAllGroup.map(async item => {
        const room = await robot.Room.find({ id: item })
        room?.say(sendMsg)
      })
    } else {
      const groupList = await robot.Room.findAll()
      groupList.map(async item => {
        const room = await robot.Room.find({ id: item.id })
        room?.say(sendMsg)
      })
    }
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
