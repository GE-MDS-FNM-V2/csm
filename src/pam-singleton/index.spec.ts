import { LocalExecuter } from './index'

describe('Testing the PAM Singleton', () => {
  test('Testing importing two modules returns the same object', () => {
    const ex1 = LocalExecuter.getExecuter()
    const ex2 = LocalExecuter.getExecuter()
    // jest is using Object.is, checking if ex1 and ex2 reference the same object in memory
    expect(ex1).toBe(ex2)
  })
})
