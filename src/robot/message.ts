// eslint-disable-next-line no-unused-vars
import { Contact, log, Message, Room } from 'wechaty'
import { fetchJobInfo } from './features/job'
import { sendAllByGroup } from './features/sendAll'
import { roomMenu } from './features/featureMenu'

// 处理群消息艾特机器人时的功能
const dispatchRoomAtRobotFeat = async (content: string, message: Message, room: Room | null) => {
  if (content === '功能列表') {
    await roomMenu(content, message, room)
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
  if (content.substr(0, 2) === '群发') {
    await sendAllByGroup(content, message)
    return
  }
  await message.say(content)
}

// msg type handle
const msgTypeHandle = [
  {
    type: Message.Type.Text,
    roomMsgHandle: async (room: Room, message: Message) => {
      console.log(`群名: ${await room.topic()} 发消息人: ${message.from()?.name()} 内容: ${message.text()}`)
      if (await message.mentionSelf()) {
        const content = message.text().replace(/@[^,，：:\s@]+/g, '').trim()
        // 处理艾特机器人的文本
        log.info(content)
        await dispatchRoomAtRobotFeat(content, message, message?.room())
      }
    },
    friendMsgHandle: async (message: Message) => {
      const contact = message.from() // 发消息人
      const isOfficial = contact?.type() === Contact.Type.Official
      const content = message.text()
      if (!isOfficial) {
        console.log(`发消息人${await contact?.name()}:${content}`)
        if (content.trim()) {
          await dispatchFriend(content, message)
        }
      } else {
        console.log('公众号消息')
      }
    }
  },
  {
    type: Message.Type.Emoticon,
    roomMsgHandle: async (room: Room, message: Message) => {
    },
    friendMsgHandle: async (message: Message) => {
    }
  },
  {
    type: Message.Type.Image,
    roomMsgHandle: async (room: Room, message: Message) => {
    },
    friendMsgHandle: async (message: Message) => {
    }
  },
  {
    type: Message.Type.Url,
    roomMsgHandle: async (room: Room, message: Message) => {
    },
    friendMsgHandle: async (message: Message) => {
    }
  },
  {
    type: Message.Type.Video,
    roomMsgHandle: async (room: Room, message: Message) => {
    },
    friendMsgHandle: async (message: Message) => {
    }
  },
  {
    type: Message.Type.Audio,
    roomMsgHandle: async (room: Room, message: Message) => {
    },
    friendMsgHandle: async (message: Message) => {
    }
  }
]

/**
 * 处理群消息
 */
const handleRoomMsg = async (room: Room, message: Message) => {
  msgTypeHandle.find(item => item.type === message.type())?.roomMsgHandle(room, message)
}

/**
 * 好友私聊
 */
const handleFriendMsg = async (message: Message) => {
  msgTypeHandle.find(item => item.type === message.type())?.friendMsgHandle(message)
}

export default async function (message: Message) {
  const room = message.room()
  const msgSelf = message.self()
  if (msgSelf) return
  if (room) {
    await room.sync()
    await handleRoomMsg(room, message)
  } else {
    await handleFriendMsg(message)
  }
}
