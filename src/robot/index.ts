import { Wechaty } from 'wechaty'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import robotConfig from '../../config/robot'
import onScan from './scan'
import { onLogin, onLogout } from './loginStatus'
import onMessage from './message'
import onRoomInvite from './roomInvite'
import { loadGroupList } from './features/sendAll'

export const robot = new Wechaty({
  puppet: new PuppetPadplus({
    token: robotConfig.token
  }),
  name: robotConfig.name
})

robot
  .on('scan', onScan)
  .on('login', onLogin)
  .on('ready', async () => {
    console.log(await loadGroupList(true))
  })
  .on('message', onMessage)
  .on('logout', onLogout)
  .on('room-invite', onRoomInvite)
  .start()
