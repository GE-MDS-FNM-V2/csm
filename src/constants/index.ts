import { CommunicationMethodV1 } from '@ge-fnm/action-object'

/**
 * NOTE TO DEVELOPERS:
 * If the browser is ever capable of making calls to the radio, put the methods here.
 * In the current state of the project, the browser is unable to make any type of calls to
 * the radio, including JSON-RPC calls with HTTP, due to CORS issues. We want to leave this
 * here in case some protocols are unblocked in the future.
 */
export const BROWSER_ENABLED_COMM_METHODS: CommunicationMethodV1[] = []
export const NEEDS_FORWARDING_ADDRESS_ERROR =
  'BROWSER ENVIRONMENT CANNOT EXECUTE THIS ACTION, NEEDS A FORWARDING ADDRESS FOR A REMOTE EXECUTOR'
