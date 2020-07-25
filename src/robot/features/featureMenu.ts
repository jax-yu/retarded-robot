// eslint-disable-next-line no-unused-vars
import { Message, Room } from 'wechaty'

export const roomMenu = async (content: string, message: Message, room: Room | null) => {
  await room?.say(`@${message.from()?.name()}
以下功能，仅为@我触发
💪 地名+工作信息
    `)
}
