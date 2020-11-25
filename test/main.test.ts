import { getFinalMembers, getNext, splitUsernameList, teamSlugToParams } from '../src/main'
import User from '../src/user'

const [fooUser, barUser, bazUser] = [new User('foo'), new User('bar'), new User('baz')]

/**
 * Converts a list of user names into a list of `User` objects.
 *
 * @param names List of user names
 */
function toUserList(...names: string[]): User[] {
  return names.map((name) => new User(name))
}

describe('getFinalMembers', () => {
  it('returns an empty list when all lists are empty', () => {
    const list = getFinalMembers([], [], [])

    expect(list).toStrictEqual([])
  })

  it('returns the original members list when include and exclude are empty', () => {
    const list = getFinalMembers(toUserList('foo', 'bar', 'baz'), [], [])

    expect(list).toStrictEqual(toUserList('foo', 'bar', 'baz'))
  })

  it('returns the include list when members and exclude are empty', () => {
    const list = getFinalMembers([], toUserList('foo', 'bar', 'baz'), [])

    expect(list).toStrictEqual(toUserList('foo', 'bar', 'baz'))
  })

  it('returns the union of the members and include list', () => {
    const list = getFinalMembers(toUserList('foo'), toUserList('bar', 'baz'), [])

    expect(list).toStrictEqual(toUserList('foo', 'bar', 'baz'))
  })

  it('does not return duplicate entries', () => {
    const list = getFinalMembers(toUserList('foo'), toUserList('foo'), [])

    expect(list).toStrictEqual(toUserList('foo'))
  })

  it('returns the list of members excluding the entries from the exclude list', () => {
    const list = getFinalMembers(toUserList('foo', 'bar', 'baz'), [], toUserList('bar'))

    expect(list).toStrictEqual(toUserList('foo', 'baz'))
  })

  it('returns the list of members when given includes and excludes', () => {
    const list = getFinalMembers(toUserList('foo', 'bar'), toUserList('baz'), toUserList('bar'))

    expect(list).toStrictEqual(toUserList('foo', 'baz'))
  })
})

describe('getNext', () => {
  it('returns next element when last is in the member list', () => {
    const next = getNext(toUserList('foo', 'bar', 'baz'), 'bar')

    expect(next).toEqual(bazUser)
  })

  it('returns the first item in the list when last is the last member', () => {
    const next = getNext(toUserList('foo', 'bar', 'baz'), 'baz')

    expect(next).toEqual(fooUser)
  })

  it('returns the first item in the list when last is null', () => {
    const next = getNext(toUserList('foo', 'bar', 'baz'), null)

    expect(next).toEqual(fooUser)
  })

  it('returns the first item in the list when last is undefined', () => {
    const next = getNext(toUserList('foo', 'bar', 'baz'), undefined)

    expect(next).toEqual(fooUser)
  })

  it('returns the first item in the list when last is empty', () => {
    const next = getNext(toUserList('foo', 'bar', 'baz'), '')

    expect(next).toEqual(fooUser)
  })

  it('returns the first item in the list when last is not found', () => {
    const next = getNext(toUserList('foo', 'bar', 'baz'), 'bamboozle')

    expect(next).toEqual(fooUser)
  })
})

describe('splitUsernameList', () => {
  it('splits on whitespace', () => {
    const members = splitUsernameList('foo bar baz')

    expect(members).toStrictEqual(toUserList('foo', 'bar', 'baz'))
  })

  it('strips at-signs from names', () => {
    const members = splitUsernameList('@foo @bar @baz')

    expect(members).toStrictEqual(toUserList('foo', 'bar', 'baz'))
  })

  it('returns an empty list when given an empty string', () => {
    const members = splitUsernameList('')

    expect(members).toStrictEqual([])
  })

  it('throws when an invalid username is in the list', () => {
    expect(() => {
      splitUsernameList('@foo @ @baz')
    }).toThrow()
  })
})

describe('teamSlugToParams', () => {
  it('returns the appropriate object', () => {
    const obj = teamSlugToParams('@foo/bar')

    expect(obj).toStrictEqual({ org: 'foo', team_slug: 'bar' })
  })

  it('returns the appropriate object when no at-sign is used', () => {
    const obj = teamSlugToParams('foo/bar')

    expect(obj).toStrictEqual({ org: 'foo', team_slug: 'bar' })
  })

  it('throws an error when a malformatted team name is given', () => {
    expect(() => {
      teamSlugToParams('')
    }).toThrow()
  })
})
