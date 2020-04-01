import debug from 'debug'
import { Executer } from '@ge-fnm/perform-action-module'

const log = debug('ge-fnm:csm:pam-singleton')

/**
 * This is a singleton class so there is only ever one instance of the PAM
 * Executer.
 *
 * The PAM Executer class stores session state after sessions with radios are
 * initialized. If we did not keep the Executer reference as a singleton,
 * then every import statement of CSM across a single application would
 * have separate Executer class instances. This would mean they wouldn't share
 * references to the same set of radio login sessions.
 */
export class LocalExecuter {
  private static instance: Executer

  public static getExecuter(): Executer {
    log('Retrieving PAM Executer singleton instance')
    if (!LocalExecuter.instance) {
      log('Creating fresh PAM Executer singleton instance')
      LocalExecuter.instance = new Executer()
    }
    return LocalExecuter.instance
  }
}
