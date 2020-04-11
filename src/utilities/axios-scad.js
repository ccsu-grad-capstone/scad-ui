/* eslint-disable camelcase */
import axios from 'axios'

const scad = (access_token, id_token) => {
  // id_token = undefined
  if (!id_token) {
    console.log('No id_token found.. hard coding id_token')
    id_token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjM0NjZkNTFmN2RkMGM3ODA1NjU2ODhjMTgzOTIxODE2YzQ1ODg5YWQifQ.eyJhdF9oYXNoIjoiNHQyYUUyWUIzdVpsVmZNZlFNWTBhQSIsInN1YiI6IjJPTUxDVDNDMkE0MlozRkNHV0paQ0lEWUxVIiwiYmlydGhkYXRlIjoiMTk5MCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2FwaS5sb2dpbi55YWhvby5jb20iLCJwcm9maWxlX2ltYWdlcyI6eyJpbWFnZTY0IjoiaHR0cHM6Ly9zLnlpbWcuY29tL2FnL2ltYWdlcy81ODc3LzU5NDkwMzkyNTUyX2FjOWI2YV82NHNxLmpwZyIsImltYWdlMTkyIjoiaHR0cHM6Ly9zLnlpbWcuY29tL2FnL2ltYWdlcy81ODc3LzU5NDkwMzkyNTUyX2FjOWI2YV8xOTJzcS5qcGciLCJpbWFnZTEyOCI6Imh0dHBzOi8vcy55aW1nLmNvbS9hZy9pbWFnZXMvNTg3Ny81OTQ5MDM5MjU1Ml9hYzliNmFfMTI4c3EuanBnIiwiaW1hZ2UzMiI6Imh0dHBzOi8vcy55aW1nLmNvbS9hZy9pbWFnZXMvNTg3Ny81OTQ5MDM5MjU1Ml9hYzliNmFfMzJzcS5qcGcifSwiZ2l2ZW5fbmFtZSI6IlJ5YW4iLCJsb2NhbGUiOiJlbi1VUyIsIm5vbmNlIjoiNTY3OTUxIiwicGljdHVyZSI6Imh0dHBzOi8vcy55aW1nLmNvbS9hZy9pbWFnZXMvNTg3Ny81OTQ5MDM5MjU1Ml9hYzliNmFfMTkyc3EuanBnIiwiYXVkIjoiZGoweUptazlhMXBCT0hWcGJsUnhNRTlQSm1ROVdWZHJPVnBGYURaV1ZteHlUa2N3YldOSGJ6bE5RUzB0Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtYzNZOU1DWjRQV0UzIiwiYXV0aF90aW1lIjoxNTgzNzEwNDI1LCJuaWNrbmFtZSI6IlJ5YW4iLCJuYW1lIjoiUnlhbiBMYXV6b24iLCJzZXNzaW9uX2V4cCI6MTU4NDkyMDAyNSwiZXhwIjoxNTgzNzE2OTk4LCJpYXQiOjE1ODM3MTMzOTgsImZhbWlseV9uYW1lIjoiTGF1em9uIiwiZW1haWwiOiJsYXV6b24yMzJAeWFob28uY29tIn0.wok8at4jwhWeHmCAl--tc98NtzWfa7bNVllLMhte_8RajgHEPi0UZeR8AA_A__3rPZk0jkp-2fCQfMnUy7vQZA'
  }

  return axios.create({
    baseURL: 'http://localhost:8080/scadservices/api/',
    timeout: 8000,
    headers: {
      'access_token': access_token,
      'id_token': id_token,
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Basic c2NhZC1hcGktcmVhZHdyaXRlOnNjYWQtYXBpLXJlYWR3cml0ZQ=='
    }
  })
}

export { scad }
