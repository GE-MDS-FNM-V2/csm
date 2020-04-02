import debug from 'debug'
import { isNode } from 'browser-or-node'
import { LocalExecuter } from './pam-singleton'
import { v1, CommunicationMethodV1 } from '@ge-fnm/action-object'
import { executeRemoteAction } from './remote-csm'
import { BROWSER_ENABLED_COMM_METHODS, NEEDS_FORWARDING_ADDRESS_ERROR } from './constants'

/**
 * Initializing the debug logger for 'ge-fnm:csm'
 */
const log = debug('ge-fnm:csm')
/** @hidden */
const localExecuter = LocalExecuter.getExecuter()

/**
 * This is the main interface for communicating with a GE radio via the
 * perform-action-module, with reverse proxy capabilities.
 *
 * The main sequence events followed by this function are as follows:
 * 1. Unpack an action object and determine what protocol should be used to
 *    perform the action.
 * 2. Determine if that protocol can be performed in the current runtime environment
 *    a. If it can, perform the action with an instance of the perform-action-module
 *       Executer class.
 *    b. If it cannot, make a remote call to another CSM hosted at an address
 *       (forwardingAddress) and environment where it can perform the action
 * 3. Return the response object to the consumer of this module
 * @param serializedActionObject String that adheres to a serialized Action Object schema as defined in this repo: https://github.com/GE-MDS-FNM-V2/action-object.
 * This is a command object with all the information regarding a radio communication action.
 * @param forwardingAddress String URI for a remote hosted version of this module. If you are in a frontend
 * environment, then make sure to know where the Node, remote hosted CSM is in the case you are trying to execute communications
 * that cannot be performed in a browser environment.
 * @returns Serialized ActionObject with the original information, as well as the response/error from
 * the communication attempt with the radio.
 */
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
    // If the procol specified in the action object cannot be performed in the
    // current runtime environment, a remote hosted CSM needs to be used to
    // reach the radio
    if (!protocolEnabledInCurrentEnvironment(protocol)) {
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
    }
    // This block is only hit if the current environment supports
    // communications with the radio
    else {
      log('Executing Communication locally')
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

/**
 * This is a private function as is.
 *
 * There are two scenarios where communications with the radio are enabled
 * in the current runtime environment:
 *
 * 1. This CSM module is being run in a Node environment (all protocols are
 *    enabled in Node)
 * 2. Developers have determined that there are protocols that a browser can
 *    safely communicate with a radio directly (ie, HTTP)
 * @param protocol CommunicationMethodV1 string (as specified in this repo https://github.com/GE-MDS-FNM-V2/action-object).
 * Examples might be HTTP, SERIAL, or SSH.
 * @returns True if the protocol can be performed in the current JavaScript runtime environment, False if
 * the protocol cannot be performed in the current JavaScript runtime environment.
 */
const protocolEnabledInCurrentEnvironment = (protocol: CommunicationMethodV1): boolean => {
  return isNode || BROWSER_ENABLED_COMM_METHODS.includes(protocol)
}
