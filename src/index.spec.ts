import {
  v1,
  ActionTypeV1,
  CommunicationMethodV1,
  ProtocolV1,
  ActionObjectInformationV1,
  GEErrors,
} from '@ge-fnm/action-object'

const REMOTE_PAM_SUCCESS_STRING = 'SUCCESS CALLED REMOTE PAM'
const LOCAL_PAM_SUCCESS_STRING = 'SUCCESS CALLED LOCAL PAM'
const REMOTE_PAM_FAILURE_STRING = 'FAILURE CALLED REMOTE PAM'
const LOCAL_PAM_FAILURE_STRING = 'FAILURE CALLED LOCAL PAM'
const NEEDS_FORWARDING_ADDRESS_ERROR_MOCK =
  'Failure message in case of browser with no forwarding address'

// BUILDING THE OPTIONS FOR CREATING AN ACTION OBJECT
const objJson: ActionObjectInformationV1 = {
  version: 1,
  actionType: ActionTypeV1.GET,
  commData: {
    commMethod: CommunicationMethodV1.HTTP,
    protocol: ProtocolV1.JSONRPC,
  },
  modifyingValue: 'test',
  path: ['hello', 'world'],
  response: {
    data: null,
    error: null,
  },
  uri: 'http://localhost:8000',
}

const httpSerializedAction = v1.create(objJson).serialize()
objJson.commData.commMethod = CommunicationMethodV1.SERIAL
const serialSerializedAction = v1.create(objJson).serialize()

describe('Communication Selector Test', () => {
  describe('In browser - local and remote resolve', () => {
    let executeCommunication: any
    // Run before every single it() block within this describe block. Using
    // this as a means of manipulating mock responses from imported packages.
    beforeEach(() => {
      jest.mock('./remote-csm', () => {
        return {
          executeRemoteAction: () => Promise.resolve(REMOTE_PAM_SUCCESS_STRING),
        }
      })
      jest.mock('@ge-fnm/perform-action-module', () => {
        return {
          Executer: jest.fn().mockImplementation(() => {
            return { execute: () => Promise.resolve(LOCAL_PAM_SUCCESS_STRING) }
          }),
        }
      })
      jest.mock('browser-or-node', () => {
        return {
          isNode: false,
        }
      })
      jest.mock('./constants', () => {
        return {
          BROWSER_ENABLED_COMM_METHODS: [CommunicationMethodV1.HTTP],
          NEEDS_FORWARDING_ADDRESS_ERROR: NEEDS_FORWARDING_ADDRESS_ERROR_MOCK,
        }
      })

      const { executeCommunication: exComm } = require('./index')
      executeCommunication = exComm
    })

    it('Invalid serialized object responds with an error', async () => {
      // CSM execution responsible for creating and returning a serialized ActionObject
      try {
        let randomSerializedObject = JSON.stringify({ hello: 'world' })
        let _ = await executeCommunication(randomSerializedObject, 'fake.api')
        fail('Invalid serialized object should respond with an error')
      } catch (responseObj) {
        let deserializedObj = v1.deserialize(responseObj)
        expect(deserializedObj.information.response?.error).toBeDefined()
      }
    })

    it('Unsupported protocol calls remote executor', () => {
      return expect(
        executeCommunication(serialSerializedAction, 'http://fakeapi.io/')
      ).resolves.toEqual(REMOTE_PAM_SUCCESS_STRING)
    })
    it('Supported protocol calls local PAM and does not need a forwarding address', async () => {
      try {
        const result = await executeCommunication(
          v1.create({
            version: 1,
            actionType: ActionTypeV1.GET,
            commData: {
              commMethod: CommunicationMethodV1.HTTP,
              protocol: ProtocolV1.JSONRPC,
            },
            modifyingValue: 'test',
            path: ['hello', 'world'],
            response: {
              data: null,
              error: null,
            },
            uri: 'http://localhost:8000',
          })
        )
        expect(result).toEqual(LOCAL_PAM_SUCCESS_STRING)
      } catch (error) {
        expect(error).toEqual(null)
      }
      // return expect().resolves.toEqual({})
    })
    afterAll(() => {
      jest.resetModules()
    })
  })
  describe('In browser - local and remote reject', () => {
    let executeCommunication: any
    // Run before every single it() block within this describe block. Using
    // this as a means of manipulating mock responses from imported packages.
    beforeEach(() => {
      jest.mock('./remote-csm', () => {
        return {
          executeRemoteAction: () => Promise.reject(REMOTE_PAM_FAILURE_STRING),
        }
      })
      jest.mock('@ge-fnm/perform-action-module', () => {
        return {
          Executer: jest.fn().mockImplementation(() => {
            return { execute: () => Promise.reject(LOCAL_PAM_FAILURE_STRING) }
          }),
        }
      })
      jest.mock('browser-or-node', () => {
        return {
          isNode: false,
        }
      })
      jest.mock('./constants', () => {
        return {
          BROWSER_ENABLED_COMM_METHODS: [CommunicationMethodV1.HTTP],
          NEEDS_FORWARDING_ADDRESS_ERROR: NEEDS_FORWARDING_ADDRESS_ERROR_MOCK,
        }
      })

      const { executeCommunication: exComm } = require('./index')
      executeCommunication = exComm
    })

    it('Unsupported protocol calls remote executor', () => {
      return expect(
        executeCommunication(serialSerializedAction, 'http://fakeapi.io/')
      ).rejects.toEqual(REMOTE_PAM_FAILURE_STRING)
    })
    it('Supported protocol calls local PAM and does not need a forwarding address', async () => {
      try {
        const result = await executeCommunication(
          v1.create({
            version: 1,
            actionType: ActionTypeV1.GET,
            commData: {
              commMethod: CommunicationMethodV1.HTTP,
              protocol: ProtocolV1.JSONRPC,
            },
            modifyingValue: 'test',
            path: ['hello', 'world'],
            response: {
              data: null,
              error: null,
            },
            uri: 'http://localhost:8000',
          })
        )
        expect(result).toEqual(null)
      } catch (error) {
        expect(error).toEqual(LOCAL_PAM_FAILURE_STRING)
      }
    })
    it('Unsupported protocol rejects', async () => {
      try {
        const _ = await executeCommunication(serialSerializedAction)
        fail('Unsupported protocol should have failed without forwarding address')
      } catch (erroObj) {
        const deserializedObj = v1.deserialize(erroObj)
        expect(deserializedObj.information.response?.error.status).toEqual(
          GEErrors.GECSMErrorCodes.NO_FORWARDING_ADDRESS
        )
      }
    })
    afterAll(() => {
      jest.resetModules()
    })
  })
  describe('In Node', () => {
    let executeCommunication: any
    // Run before every single it() block within this describe block. Using
    // this as a means of manipulating mock responses from imported packages.
    beforeEach(() => {
      jest.mock('browser-or-node', () => {
        return {
          isNode: true,
        }
      })
      jest.mock('@ge-fnm/perform-action-module', () => {
        return {
          Executer: jest.fn().mockImplementation(() => {
            return { execute: () => Promise.resolve(LOCAL_PAM_SUCCESS_STRING) }
          }),
        }
      })
      jest.mock('./remote-csm', () => {
        return {
          executeRemoteAction: () => Promise.resolve(REMOTE_PAM_SUCCESS_STRING),
        }
      })
      jest.mock('./constants', () => {
        return {
          BROWSER_ENABLED_COMM_METHODS: [CommunicationMethodV1.HTTP],
          NEEDS_FORWARDING_ADDRESS_ERROR: NEEDS_FORWARDING_ADDRESS_ERROR_MOCK,
        }
      })

      const { executeCommunication: exComm } = require('./index')
      executeCommunication = exComm
    })

    it('Protocol supported by the browser executes locally', () => {
      return expect(executeCommunication(httpSerializedAction)).resolves.toMatch(
        LOCAL_PAM_SUCCESS_STRING
      )
    })

    it('Protocol not supported by the browser executes locally', () => {
      return expect(executeCommunication(serialSerializedAction)).resolves.toMatch(
        LOCAL_PAM_SUCCESS_STRING
      )
    })
    afterAll(() => {
      jest.resetModules()
    })
  })
})
