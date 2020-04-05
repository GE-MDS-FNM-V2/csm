import {
  v1,
  ActionTypeV1,
  CommunicationMethodV1,
  ProtocolV1,
  ActionObjectV1
} from '@ge-fnm/action-object'

export const generateBlankActionObject = (): ActionObjectV1 => {
  const actionObject = v1.create({
    version: 1,
    uri: '',
    actionType: ActionTypeV1.GET,
    path: [''],
    commData: {
      commMethod: CommunicationMethodV1.HTTP,
      protocol: ProtocolV1.JSONRPC
    },
    response: undefined
  })
  return actionObject
}
