import { isNode } from 'browser-or-node'
import { Executer } from '@ge-fnm/perform-action-module'
import { v1 } from '@ge-fnm/action-object'
import { executeRemoteAction } from './remote-csm'
import { BROWSER_ENABLED_COMM_METHODS, NEEDS_FORWARDING_ADDRESS_ERROR } from './constants'

const localExecuter = new Executer()

export const executeCommunication = (
  serializedActionObject: string,
  forwardingAddress?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let deserializedObj
    try {
      // If an invalid object string is passed in, reject the request
      deserializedObj = v1.deserialize(serializedActionObject)
    } catch (e) {
      reject(e)
      return
    }
    let protocol = deserializedObj.information.commData.commMethod
    // Check to see if current environment is unable to perform the communication
    if (!isNode && !BROWSER_ENABLED_COMM_METHODS.includes(protocol)) {
      if (forwardingAddress) {
        executeRemoteAction(serializedActionObject, forwardingAddress)
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      } else {
        reject(new Error(NEEDS_FORWARDING_ADDRESS_ERROR))
      }
    } else {
      // The current environment should support a local action
      localExecuter
        .execute(serializedActionObject)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}
