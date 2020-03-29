import debug from 'debug'
import { isNode } from 'browser-or-node'
import { LocalExecuter } from './pam-singleton'
import { v1 } from '@ge-fnm/action-object'
import { executeRemoteAction } from './remote-csm'
import { BROWSER_ENABLED_COMM_METHODS, NEEDS_FORWARDING_ADDRESS_ERROR } from './constants'

const log = debug('ge-fnm:csm')
const localExecuter = LocalExecuter.getExecuter()

export const executeCommunication = (
  serializedActionObject: string,
  forwardingAddress?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    log(
      'CSM communication execution starting with forwarding address,',
      forwardingAddress,
      ', and action object,',
      serializedActionObject
    )
    let deserializedObj
    try {
      // If an invalid object string is passed in, reject the request
      deserializedObj = v1.deserialize(serializedActionObject)
    } catch (e) {
      log(
        'Following error occurred while deserializing action object,',
        serializedActionObject,
        ':',
        e
      )
      reject(e)
      return
    }
    let protocol = deserializedObj.information.commData.commMethod
    // Check to see if current environment is unable to perform the communication
    if (!isNode && !BROWSER_ENABLED_COMM_METHODS.includes(protocol)) {
      log('Protocol,', protocol, ', is not supported by browser. Making remote execute call.')
      if (forwardingAddress) {
        executeRemoteAction(serializedActionObject, forwardingAddress)
          .then(data => {
            log('Remote Execution responded with following data,', data)
            resolve(data)
          })
          .catch(err => {
            log('Remote Execution responded with following error,', err)
            reject(err)
          })
      } else {
        log(
          'Error calling remote execution, executeCommunication needs forwardingAddress for remote calls'
        )
        reject(new Error(NEEDS_FORWARDING_ADDRESS_ERROR))
      }
    } else {
      log('Executing Communication locally')
      // The current environment should support a local action
      localExecuter
        .execute(serializedActionObject)
        .then(data => {
          log('Local PAM Executer responded with following data,', data)
          resolve(data)
        })
        .catch(err => {
          log('Local PAM Executer rejected with following error,', err)
          reject(err)
        })
    }
  })
}
