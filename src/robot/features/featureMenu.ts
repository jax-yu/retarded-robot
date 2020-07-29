// eslint-disable-next-line no-unused-vars
import { Message, Room } from 'wechaty'

export const roomMenu = async (content: string, message: Message, room: Room | null) => {
  await room?.say(`@${message.from()?.name()}
以下功能，仅为@我触发
💪 地名+工作信息
    `)
}

export const privateMenu = async (content: string, message: Message) => {
  await message.say(`私聊功能列表:
ps: 特殊说明，括号内的文字是特殊说明
1. 群发+群发内容(一小时自动群发)
2. 设置管理员(自动设置当前私聊好友为管理员)
3. 增加特殊群+群名
4. 移除特殊群+群名
5. 查看特殊群
6. 查看群发排除状态(1等于是或者0等于否，如果为否则所有群都发送)
7. 设置群发排除状态+是或者否
8. 停止群发
9. 设置群发间隔+100(单位为秒, 设置后会马上发送一次)
10. 查看群发间隔
`)
}
