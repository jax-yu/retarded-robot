import { Wechaty } from 'wechaty'
import robotConfig from '../../config/robot'
import onScan from './scan'
import { onLogin, onLogout } from './loginStatus'
import onMessage from './message'
import onRoomInvite from './roomInvite'
import { loadGroupList } from './features/sendAll'
import { PuppetPadlocal } from 'wechaty-puppet-padlocal'

export const robot = new Wechaty({
  puppet: new PuppetPadlocal({
    token: robotConfig.token
  })
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
