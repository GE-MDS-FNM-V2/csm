import { Executer } from '@ge-fnm/perform-action-module'

export class LocalExecuter {
  private static instance: Executer

  public static getExecuter(): Executer {
    if (!LocalExecuter.instance) {
      LocalExecuter.instance = new Executer()
    }
    return LocalExecuter.instance
  }
}
