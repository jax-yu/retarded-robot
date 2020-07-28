// eslint-disable-next-line no-unused-vars
import { Contact, log, Message, Room } from 'wechaty'
import { fetchJobInfo } from './features/job'
import { clearNextHandleSend, sendAllByGroup } from './features/sendAll'
import { privateMenu, roomMenu } from './features/featureMenu'
import {
  getGroupExcludeStatus,
  getGroupList,
  setGroupExcludeStatus,
  setGroupList,
  setRobotAdmin
} from '../utils/redisHelper'
import { robot } from './index'

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
  try {
    if (content === '功能列表') {
      await privateMenu(content, message)
      return
    }
    if (content.substr(0, 2) === '群发') {
      await sendAllByGroup(content, message)
      return
    }
    if (content === '设置管理员') {
      const adminContact = message.from()
      await setRobotAdmin([adminContact?.weixin() as string])
      await message.say(`${await adminContact?.alias()}管理员设置成功！`)
      return
    }
    if (content.substr(0, 5) === '增加特殊群') {
      const roomName = content.substring(5, content.length)
      const roomInfo = await robot.Room.find({ topic: roomName })
      if (roomInfo !== null) {
        await setGroupList([roomInfo?.id as string])
        await message.say(`${await roomInfo?.topic()}特殊群设置成功！`)
      } else {
        await message.say('特殊群设置失败，请联系开发人员！')
      }
      return
    }
    if (content === '查看特殊群') {
      const groupList = await getGroupList()
      const groupListMsg: any[] = []
      await message.say('特殊群查询中...')
      for await (const item of groupList) {
        // const room = await robot.Room.find({ id: item })
        const room = robot.Room.load(item)
        await room.sync()
        const roomName = await room?.topic()
        groupListMsg.push(roomName)
      }
      await message.say(`当前特殊群列表:
${groupListMsg.join('\n')}`)
      return
    }
    if (content === '查看群发排除状态') {
      const status = await getGroupExcludeStatus()
      await message.say(`当前群发排除状态: ${status ? '是' : '否'}`)
      return
    }
    if (content.substr(0, 8) === '设置群发排除状态') {
      const status = content.substr(8, content.length)
      await setGroupExcludeStatus(status === '是' ? '1' : '0')
      await message.say('群发状态设置成功')
      return
    }
    if (content === '停止群发') {
      await message.say(clearNextHandleSend())
      return
    }
    // await message.say(content)
  } catch (e) {
    await message.say(e.message)
  }
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
