/* eslint-disable no-undef */
const { fullName } = require('../../src/utilities/utils')

test('show full name', () => {
  const name = fullName('ryan', 'lauzon')
  expect(name).toBe('ryan lauzon')
})

test('output blank name', () => {
  const name = fullName('', '')
  expect(name).toBe(' ')
})
