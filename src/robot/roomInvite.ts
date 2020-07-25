// eslint-disable-next-line no-unused-vars
import { RoomInvitation } from 'wechaty'
import { sendAdmin } from './features/sendAll'
import robotConfig from '../../config/robot'

export default async function (roomInvitation: RoomInvitation) {
  try {
    await roomInvitation.accept()
    await sendAdmin(`${await roomInvitation.inviter()} 邀请进入 ${await roomInvitation.topic()}，已自动同意`, robotConfig.runConfig.admin[0])
  } catch (e) {
    console.error(e)
  }
}
