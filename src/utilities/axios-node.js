import axios from 'axios'
import { getBaseURL } from '../utilities/enviornment'

const node = axios.create({
  baseURL: getBaseURL('NODE'),
  timeout: 8000,
  headers: {
    'Authorization': 'Basic dXNlcjpub2RlLWFwaS1yZWFkd3JpdGU='
  }
})

export { node }
