// eslint-disable-next-line no-unused-vars
import { ContactSelf } from 'wechaty/dist/src/user'
import { db } from '../db'

export function onLogin (user: ContactSelf) {
  db.open()
  console.log(`登录成功${user.name()}`)
}

export function onLogout () {
  db.close()
}
