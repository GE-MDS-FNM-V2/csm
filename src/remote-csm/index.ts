import debug from 'debug'
import axios from 'axios'

const log = debug('ge-fnm:csm:remote-csm')

/**
 * This is a stateless function that makes a POST request to a remote hosted
 * instance of CSM, as specified by the forwardingAddress parameter, and returns
 * the data from the remotely executed communications.
 *
 * This function is essential for using a reverse proxy for radio
 * communications. There is potential for some radio communication protocols,
 * specifically JSON-RPC, to be enabled to execute from a browser environment
 * in the future. There are some communication methods, such as serial, that
 * will always need to be executed from a Node environment. This reverse
 * proxy capability enables both of those scenarios.
 */
export const executeRemoteAction = (
  serializedActionObject: string,
  forwardingAddress: string
): Promise<string> => {
  log(
    'Remote executing action at',
    forwardingAddress,
    'with following action object',
    serializedActionObject
  )
  // returning a promise there will be some sort of axios response
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
