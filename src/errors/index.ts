import { GEErrors, ActionObjectV1 } from '@ge-fnm/action-object'
import { GEError } from '@ge-fnm/action-object/dist/types/GEError'
const GECSMError = GEErrors.GECSMError
const GECSMErrorCodes = GEErrors.GECSMErrorCodes

export const packageError = (
  actionObj: ActionObjectV1,
  errorResponse: any /* TODO determine a clean way to do this */
) => {
  actionObj.information.response = { error: errorResponse }
  const serializedActionObj = actionObj.serialize()
  return serializedActionObj
}

// Error object for the case that there is no forwarding address
export const serializeNoForwardingAddressError = (actionObj: ActionObjectV1, message: string) => {
  const geError = new GECSMError(message, GECSMErrorCodes.NO_FORWARDING_ADDRESS)
  return packageError(actionObj, geError)
}

// Error object for the case that there is a problem during POST request
export const serializeRemoteCSMError = (actionObj: ActionObjectV1, message: string) => {
  const geError = new GECSMError(message, GECSMErrorCodes.REMOTE_CSM_CONNECTION_FAILURE)
  return packageError(actionObj, geError)
}

export const serializePAMError = (actionObj: ActionObjectV1, message: string) => {
  // TODO
  return ''
}
