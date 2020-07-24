// eslint-disable-next-line no-unused-vars
import { Message } from 'wechaty'
import robotConfig from '../../../config/robot'
import { robot } from '../index'

let sendMsg: string = ''

export const sendAllByGroup = async (msg: string, message: Message) => {
  sendMsg = msg.substring(2, msg.length)
  await message.say('已存储, 此次已发送, 一小时后自动发送')
  await handleSend()
}

const handleSend = async () => {
  if (sendMsg !== '') {
    await robotConfig.runConfig.sendAllGroup.map(async item => {
      const room = await robot.Room.find({ id: item })
      room?.say(sendMsg)
    })
  } else {
    // 如果群发内容为空，提示管理员
    const contact = await robot.Contact.find({ alias: robotConfig.runConfig.admin[0] })
    contact?.say('群发内容为空，请设置！')
  }
  setTimeout(() => {
    handleSend()
  }, 10000) // 一小时发送一次
}
