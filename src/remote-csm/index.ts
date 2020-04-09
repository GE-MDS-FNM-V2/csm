import debug from 'debug'
import axios from 'axios'
import { v1 } from '@ge-fnm/action-object'
import { serializeRemoteCSMError } from '../errors'
import { GECSMError } from '@ge-fnm/action-object/dist/types/GEError'

/**
 * Initializing the debug logger for 'ge-fnm:csm:remote-csm'
 */
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
 * @param serializedActionObject Serialized Action Object string, as defined in this module  https://github.com/GE-MDS-FNM-V2/action-object.
 * @param forwardingAddress URL string of location where a remote hosted CSM module is located.
 * @returns Promise containing results from POST response to forwardingAddress
 */
export const executeRemoteAction = (
  serializedActionObject: any,
  forwardingAddress: string
): Promise<any> => {
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
      .then((res) => {
        // HAPPY PATH: will have a serialized Action Object attached to
        // the .data value in the response
        log('Remote execute responded with following data', res.data)
        resolve(res.data)
      })
      .catch((err) => {
        // This is an action object with errors on the response field
        if (err.response) {
          let errorResponse = err.response.data
          log('Remote execute failed with following data,', errorResponse)
          try {
            // If there was an action object in the error response, there is no need to create a new one.
            // We know this is an ActionObejct if v1.deserialize succeeds.
            let _ = v1.deserialize(errorResponse)
            reject(errorResponse)
          } catch (e) {
            // Else, there is no action object (meaning that there needs to be an action object created)
            // This also means that this is most likely an error with not reaching the remote CSM.
            let errorObject = serializeRemoteCSMError(
              v1.deserialize(serializedActionObject),
              errorResponse
            )
            reject(errorObject)
          }
        } else {
          let errorObject = serializeRemoteCSMError(v1.deserialize(serializedActionObject), err)
          reject(errorObject)
        }
      })
  })
}
