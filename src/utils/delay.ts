export const delayValue = {
  sendMsg: 1000,
  sendRoomMsg: 2000
}

export const delay = async (time: number) => {
  return new Promise((resolve, reject) => {
    resolve(setTimeout(() => {}, time))
  })
}
