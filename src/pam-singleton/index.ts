import debug from 'debug'
import { Executer } from '@ge-fnm/perform-action-module'

const log = debug('ge-fnm:csm:pam-singleton')

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
