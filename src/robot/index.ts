import { Wechaty } from 'wechaty'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import robotConfig from '../../config/robot'
import onScan from './scan'
import { onLogin, onLogout } from './loginStatus'
import onMessage from './message'

console.log(robotConfig)

const robot = new Wechaty({
  puppet: new PuppetPadplus({
    token: robotConfig.token
  }),
  name: robotConfig.name
})

robot
  .on('scan', onScan)
  .on('login', onLogin)
  .on('message', onMessage)
  .on('logout', onLogout)
  .start()
