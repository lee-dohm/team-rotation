import { getFinalMembers, getNext, splitUsernameList, teamSlugToParams } from '../src/main'
import User from '../src/user'

const [fooUser, barUser, bazUser] = [new User('foo'), new User('bar'), new User('baz')]

describe('getFinalMembers', () => {

  it('returns an empty list when all lists are empty', () => {
    const list = getFinalMembers([], [], [])

    expect(list).toStrictEqual([])
  })

  it('returns the original members list when include and exclude are empty', () => {
    const list = getFinalMembers([fooUser, barUser, bazUser], [], [])

    expect(list).toStrictEqual([fooUser, barUser, bazUser])
  })

  it('returns the include list when members and exclude are empty', () => {
    const list = getFinalMembers([], [fooUser, barUser, bazUser], [])

    expect(list).toStrictEqual([fooUser, barUser, bazUser])
  })

  it('returns the union of the members and include list', () => {
    const list = getFinalMembers([fooUser], [barUser, bazUser], [])

    expect(list).toStrictEqual([fooUser, barUser, bazUser])
  })

  it('does not return duplicate entries', () => {
    const list = getFinalMembers([fooUser], [fooUser], [])

    expect(list).toStrictEqual([fooUser])
  })

  it('returns the list of members excluding the entries from the exclude list', () => {
    const list = getFinalMembers([fooUser, barUser, bazUser], [], [fooUser])

    expect(list).toStrictEqual([barUser, bazUser])
  })
})

describe('getNext', () => {
  it('returns next element when last is in the member list', () => {
    const next = getNext([fooUser, barUser, bazUser], 'bar')

    expect(next).toBe(bazUser)
  })

  it('returns the first item in the list when last is the last member', () => {
    const next = getNext([fooUser, barUser, bazUser], 'baz')

    expect(next).toBe(fooUser)
  })

  it('returns the first item in the list when last is null', () => {
    const next = getNext([fooUser, barUser, bazUser], null)

    expect(next).toBe(fooUser)
  })

  it('returns the first item in the list when last is undefined', () => {
    const next = getNext([fooUser, barUser, bazUser], undefined)

    expect(next).toBe(fooUser)
  })

  it('returns the first item in the list when last is empty', () => {
    const next = getNext([fooUser, barUser, bazUser], '')

    expect(next).toBe(fooUser)
  })

  it('returns the first item in the list when last is not found', () => {
    const next = getNext([fooUser, barUser, bazUser], 'bamboozle')

    expect(next).toBe(fooUser)
  })
})

describe('splitUsernameList', () => {
  it('splits on whitespace', () => {
    const members = splitUsernameList('foo bar baz')

    expect(members).toStrictEqual([fooUser, barUser, bazUser])
  })

  it('strips at-signs from names', () => {
    const members = splitUsernameList('@foo @bar @baz')

    expect(members).toStrictEqual([fooUser, barUser, bazUser])
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
