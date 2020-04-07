import { generateBlankActionObject } from './index'
import { ActionObjectV1 } from '@ge-fnm/action-object'

describe('Testing Util Functions', () => {
  it('Testing generateBlankActionObject() creates blank ActionObject with no response', () => {
    const obj: ActionObjectV1 = generateBlankActionObject()
    expect(obj.information.response).toBeUndefined()
  })
})
