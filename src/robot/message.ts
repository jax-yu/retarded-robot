// eslint-disable-next-line no-unused-vars
import { Contact, log, Message, Room } from 'wechaty'
import { fetchJobInfo } from './features/job'
import { sendAllByGroup } from './features/sendAll'

// 处理群消息艾特机器人时的功能
const dispatchRoomAtRobotFeat = async (content: string, message: Message, room: Room | null) => {
  if (content === '功能列表') {
    await room?.say(`@${message.from()?.name()}
    以下功能，仅为@我触发\n
    地名+工作信息
    `)
    return
  }
  if (content.match('工作信息')) {
    await fetchJobInfo(content.substring(0, content.length - 4), message)
  }
}

const dispatchFriend = async (content: string, message: Message) => {
  // const data = await robot.Room.findAll()
  // console.log(data.map(item => {
  //   return item.id
  // }))
  // const data = await robot.Contact.findAll()
  // console.log(data)
  if (content.match('群发')) {
    await sendAllByGroup(content, message)
  }
}

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
        await dispatchRoomAtRobotFeat(content, message, message?.room())
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

/**
 * 好友私聊
 */
const handleFriend = async (message: Message) => {
  const type = message.type()
  const contact = message.from() // 发消息人
  const isOfficial = contact?.type() === Contact.Type.Official
  const content = message.text()
  switch (type) {
    case Message.Type.Text:
      if (!isOfficial) {
        console.log(`发消息人${await contact?.name()}:${content}`)
        if (content.trim()) {
          await dispatchFriend(content, message)
        }
      } else {
        console.log('公众号消息')
      }
      break
    case Message.Type.Emoticon:
      console.log(`发消息人${await contact?.name()}:发了一个表情`)
      break
    case Message.Type.Image:
      console.log(`发消息人${await contact?.name()}:发了一张图片`)
      break
    case Message.Type.Url:
      console.log(`发消息人${await contact?.name()}:发了一个链接`)
      break
    case Message.Type.Video:
      console.log(`发消息人${await contact?.name()}:发了一个视频`)
      break
    case Message.Type.Audio:
      console.log(`发消息人${await contact?.name()}:发了一个视频`)
      break
    default:
      break
  }
}

export default async function (message: Message) {
  const room = message.room()
  const msgSelf = message.self()
  if (msgSelf) return
  if (room) {
    await handleRoomMsg(room, message)
  } else {
    await handleFriend(message)
  }
}
