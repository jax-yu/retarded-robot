// eslint-disable-next-line no-unused-vars
import { log, Message, Room } from 'wechaty'
import { db } from '../db'

/**
 * 处理群消息
 */
const handleRoomMsg = async (room: Room, message: Message) => {
  const contact = message.from() // 发消息人
  const roomName = await room.topic()
  const type = message.type()
  const isAtRobot = await message.mentionSelf()
  switch (type) {
    case Message.Type.Text:
      console.log(`群名: ${roomName} 发消息人: ${contact?.name()} 内容: ${message.text()}`)
      if (isAtRobot) {
        const content = message.text().replace(/@[^,，：:\s@]+/g, '').trim()
        // 处理艾特机器人的文本
        log.info(content)
        await sayJob(content, message)
      }
      break
    case Message.Type.Emoticon:
      console.log(`群名: ${roomName} 发消息人: ${contact?.name()} 发了一个表情`)
      break
    case Message.Type.Image:
      console.log(`群名: ${roomName} 发消息人: ${contact?.name()} 发了一张图片`)
      break
    case Message.Type.Url:
      console.log(`群名: ${roomName} 发消息人: ${contact?.name()} 发了一个链接`)
      break
    case Message.Type.Video:
      console.log(`群名: ${roomName} 发消息人: ${contact?.name()} 发了一个视频`)
      break
    case Message.Type.Audio:
      console.log(`群名: ${roomName} 发消息人: ${contact?.name()} 发了一个语音`)
      break
    default:
      break
  }
}

const sayJob = async (city: string, message: Message) => {
  await message.say(`${city}工作查询中...`)
  const res = await db.queryJobByCity(city)
  console.log(res)
  if (res.length) {
    res.map((item, index) => {
      message.say(`${index + 1}: ${item.job_content}`)
    })
  } else {
    await message.say(`${city}暂无工作记录，请联系管理员`)
  }
}

/**
 * 好友私聊
 */
const handleFriend = async () => {
}

export default async function (message: Message) {
  const room = message.room()
  const msgSelf = message.self()
  if (msgSelf) return
  if (room) {
    await handleRoomMsg(room, message)
  } else {
    await handleFriend()
  }
}
