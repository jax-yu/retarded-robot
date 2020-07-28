// eslint-disable-next-line no-unused-vars
import { ContactSelf } from 'wechaty/dist/src/user'
import { db } from '../db'
import { getRobotAdmin } from '../utils/redisHelper'
import { sendAdmin } from './features/sendAll'
// import fetchEmail from '../utils/email'
// import { sendEmailInfoToAdmin } from './features/sendAll'

export async function onLogin (user: ContactSelf) {
  db.open()
  const admin = await getRobotAdmin()
  await sendAdmin(`登录成功${user.name()}`, admin[0])
  console.log(`登录成功${user.name()}`)
  // setInterval(async () => {
  //   try {
  //     const info = await fetchEmail()
  //     await sendEmailInfoToAdmin(info)
  //   } catch (e) {
  //     // 暂无邮件
  //   }
  // }, 1000 * 5)
}

export function onLogout () {
  db.close()
}
