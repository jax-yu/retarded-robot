// eslint-disable-next-line no-unused-vars
import { RoomInvitation } from 'wechaty'
import { sendAdmin } from './features/sendAll'
import { getRobotAdmin } from '../utils/redisHelper'

export default async function (roomInvitation: RoomInvitation) {
  try {
    const admin = await getRobotAdmin()
    await roomInvitation.accept()
    await sendAdmin(`${await roomInvitation.inviter()} 邀请进入 ${await roomInvitation.topic()}，已自动同意`, admin.length > 0 ? admin[0] : '')
  } catch (e) {
    console.error(e)
  }
}
