import debug from 'debug'
import axios from 'axios'

const log = debug('ge-fnm:csm:remote-csm')

export const executeRemoteAction = (
  serializedActionObject: string,
  forwardingAddress: string
): Promise<string> => {
  // returning a promise there will be some sort of axios response
  log(
    'Remote executing action at',
    forwardingAddress,
    'with following action object',
    serializedActionObject
  )
  return new Promise((resolve, reject) => {
    axios
      .post(forwardingAddress, { serializedAction: serializedActionObject })
      .then(res => {
        log('Remote execute responded with following data', res.data)
        resolve(res.data)
      })
      .catch(err => {
        log('Remote execute failed with following error,', err)
        reject(err)
      })
  })
}
