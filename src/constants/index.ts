import { CommunicationMethodV1 } from '@ge-fnm/action-object'

// if the browser is ever capable of making calls to the radio, put the methods here
export const BROWSER_ENABLED_COMM_METHODS: [CommunicationMethodV1?] = []
export const NEEDS_FORWARDING_ADDRESS_ERROR =
  'BROWSER ENVIRONMENT CANNOT EXECUTE THIS ACTION, NEEDS A FORWARDING ADDRESS FOR A REMOTE EXECUTOR'
