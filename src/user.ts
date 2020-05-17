/**
 * Represents a GitHub user.
 */
export default class User {
  login: string

  constructor(name: string) {
    let temp = name.trim()
    temp = temp[0] == '@' ? temp.substring(1) : temp

    if (!temp.match(/^[a-z0-9]+(-[a-z0-9]+)*$/i)) {
      throw new Error(`'${name}' is not a valid GitHub username`)
    }

    this.login = temp
  }

  /**
   * Determines if the two users are the same.
   *
   * @param other User or login to compare against
   * @returns `true` if the two users are the same user; `false` otherwise
   */
  equals(other: User | string | null | undefined): boolean {
    if (!other) {
      return false
    }

    const otherLogin = other instanceof User ? other.login : other

    return this.login.localeCompare(otherLogin, 'en', { sensitivity: 'accent' }) == 0
  }
}
