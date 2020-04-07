import { executeRemoteAction } from './index'
import {
  v1,
  ActionTypeV1,
  CommunicationMethodV1,
  ProtocolV1,
  GEErrors,
} from '@ge-fnm/action-object'
import axios from 'axios'
jest.mock('axios')
const mockAxios = axios as jest.Mocked<typeof axios>

const SAMPLE_ACTION_OBJECT = v1.create({
  version: 1,
  actionType: ActionTypeV1.GET,
  commData: {
    commMethod: CommunicationMethodV1.HTTP,
    protocol: ProtocolV1.JSONRPC,
    username: '',
    password: '',
  },
  modifyingValue: '',
  path: [],
  response: undefined,
  uri: '192.168.1.117',
})

const SAMPLE_ERROR_RESPONSE_ACTION_OBJECT = v1.create({
  version: 1,
  actionType: ActionTypeV1.GET,
  commData: {
    commMethod: CommunicationMethodV1.HTTP,
    protocol: ProtocolV1.JSONRPC,
    username: '',
    password: '',
  },
  modifyingValue: '',
  path: [],
  response: {
    error: new GEErrors.GECSMError('SOME ERROR', GEErrors.GECSMErrorCodes.NO_FORWARDING_ADDRESS),
    data: null,
  },
  uri: '192.168.1.117',
})

const SAMPLE_AXIOS_RESPONSE = {
  data: 'SOMETHING IMPORTANT', // Faking a valid action object response
}

const SAMPLE_CONNECTION_ERROR = {
  response: {
    data: 'ERROR: URL NOT FOUND',
  },
}

const SAMPLE_REMOTE_CSM_ERROR = {
  response: {
    data: SAMPLE_ERROR_RESPONSE_ACTION_OBJECT.serialize(),
  },
}

describe('Test executeRemoteAction', () => {
  it('Successful Axios response and returns Promise with parsed data', () => {
    mockAxios.post.mockResolvedValue(SAMPLE_AXIOS_RESPONSE)
    return expect(
      executeRemoteAction(SAMPLE_ACTION_OBJECT.serialize(), 'http://fake.api')
    ).resolves.toMatch(SAMPLE_AXIOS_RESPONSE.data)
  })

  it('Axios error (in serialized Action Object format) resolves with serialized Action Object', () => {
    mockAxios.post.mockRejectedValue(SAMPLE_REMOTE_CSM_ERROR)
    return expect(
      executeRemoteAction(SAMPLE_ACTION_OBJECT.serialize(), 'http://fake.api')
    ).rejects.toEqual(SAMPLE_REMOTE_CSM_ERROR.response.data)
  })

  it('Axios error (not in serialized Action Object format) results in Action Object error field populated with error.response.data', async () => {
    expect.assertions(2)
    mockAxios.post.mockRejectedValue(SAMPLE_CONNECTION_ERROR)
    executeRemoteAction(SAMPLE_ACTION_OBJECT.serialize(), 'http://fake.api').catch(
      (errorResponse) => {
        const deserializedActionObj = v1.deserialize(errorResponse)
        expect(deserializedActionObj.id).toMatch(SAMPLE_ACTION_OBJECT.id) // Should be the same object
        expect(deserializedActionObj.information.response?.error.status).toBe(
          GEErrors.GECSMErrorCodes.REMOTE_CSM_CONNECTION_FAILURE
        ) // There should be an error now
      }
    )
  })
})
