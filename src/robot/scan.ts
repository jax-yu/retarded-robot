import Qrterminal from 'qrcode-terminal'
import { log, ScanStatus } from 'wechaty-puppet'

export default function (qrCode: string, status: ScanStatus) {
  Qrterminal.generate(qrCode, { small: true })
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    Qrterminal.generate(qrCode, { small: true })
    const qrcodeImageUrl = [
      'https://wechaty.github.io/qrcode/',
      encodeURIComponent(qrCode)
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}
