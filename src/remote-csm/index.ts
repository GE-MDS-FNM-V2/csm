import axios from 'axios'

export const executeRemoteAction = (
  serializedActionObject: string,
  forwardingAddress: string
): Promise<string> => {
  // returning a promise there will be some sort of axios response
  return new Promise((resolve, reject) => {
    axios
      .post(forwardingAddress, { serializedAction: serializedActionObject })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
