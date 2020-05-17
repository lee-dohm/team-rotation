import User from '../src/user'

describe('User', () => {
  describe('constructor', () => {
    it('sets the login property', () => {
      const user = new User('test-name')

      expect(user.login).toBe('test-name')
    })

    it('strips a leading at-sign', () => {
      const user = new User('@test-name')

      expect(user.login).toBe('test-name')
    })

    it('throws when the username is invalid', () => {
      expect(() => {
        new User('test@name')
      }).toThrow("'test@name' is not a valid GitHub username")
    })

    it('throws when the username is empty', () => {
      expect(() => {
        new User('')
      }).toThrow("'' is not a valid GitHub username")
    })

    it('throws when the username is functionally empty', () => {
      expect(() => {
        new User('@')
      }).toThrow("'@' is not a valid GitHub username")
    })

    it('strips leading whitespace', () => {
      const user = new User('     @test-name')

      expect(user.login).toBe('test-name')
    })

    it('strips trailing whitespace', () => {
      const user = new User('@test-name     ')

      expect(user.login).toBe('test-name')
    })
  })

  describe('equals', () => {
    const testUser = new User('test-user')

    it('returns false when given a User that does not match', () => {
      const otherUser = new User('other-user')

      expect(testUser.equals(otherUser)).toBeFalsy()
    })

    it('returns true when given a User that does match', () => {
      const otherUser = new User('test-user')

      expect(testUser.equals(otherUser)).toBeTruthy()
    })

    it('returns false when given a string that does not match', () => {
      expect(testUser.equals('other-user')).toBeFalsy()
    })

    it('returns true when given a string that does match', () => {
      expect(testUser.equals('test-user')).toBeTruthy()
    })

    it('returns true when given a User that differs only by case', () => {
      const otherUser = new User('Test-User')

      expect(testUser.equals(otherUser)).toBeTruthy()
    })

    it('returns true when given a string that differs only by case', () => {
      expect(testUser.equals('Test-User')).toBeTruthy()
    })

    it('returns false when given null', () => {
      expect(testUser.equals(null)).toBeFalsy()
    })

    it('returns false when given undefined', () => {
      expect(testUser.equals(undefined)).toBeFalsy()
    })
  })
})
