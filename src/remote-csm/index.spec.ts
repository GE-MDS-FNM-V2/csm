import { executeRemoteAction } from './index'
import axios from 'axios'
jest.mock('axios')
const mockAxios = axios as jest.Mocked<typeof axios>

const SAMPLE_AXIOS_RESPONSE = {
  data: 'SOMETHING IMPORTANT'
}
const SAMPLE_ERROR = 'ERROR: URL NOT FOUND'

describe('Test executeRemoteAction', () => {
  it('Successful Axios response and returns Promise with parsed data', () => {
    mockAxios.post.mockResolvedValue(SAMPLE_AXIOS_RESPONSE)
    return expect(executeRemoteAction('some string', 'http://fake.api')).resolves.toMatch(
      SAMPLE_AXIOS_RESPONSE.data
    )
  })

  it('Errored Axios response rejects Promise with an error', () => {
    mockAxios.post.mockRejectedValue(SAMPLE_ERROR)
    return expect(executeRemoteAction('some string', 'http://fake.api')).rejects.toMatch(
      SAMPLE_ERROR
    )
  })
})
