import { someEmptyField } from '@core/application/helpers'

describe('someEmptyField', () => {
  it('should return true if at least one field is empty', () => {
    expect(someEmptyField([1, '', 3])).toBe(true)
    expect(someEmptyField([null, 'test', 42])).toBe(true)
    expect(someEmptyField([undefined, 'valid', {}])).toBe(true)
  })

  it('should return false if all fields are filled', () => {
    expect(someEmptyField(['value', 123, true])).toBe(false)
    expect(someEmptyField([{}, [], 'test'])).toBe(false)
  })

  it('should return false for an empty array', () => {
    expect(someEmptyField([])).toBe(false)
  })
})
