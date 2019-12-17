import { getFinalMembers, getNext, splitMembersList, splitTeamName } from '../src/main'

describe('getFinalMembers', () => {
  it('returns an empty list when all lists are empty', () => {
    const list = getFinalMembers([], [], [])

    expect(list).toStrictEqual([])
  })

  it('returns the original members list when include and exclude are empty', () => {
    const list = getFinalMembers(['foo', 'bar', 'baz'], [], [])

    expect(list).toStrictEqual(['foo', 'bar', 'baz'])
  })

  it('returns the include list when members and exclude are empty', () => {
    const list = getFinalMembers([], ['foo', 'bar', 'baz'], [])

    expect(list).toStrictEqual(['foo', 'bar', 'baz'])
  })

  it('returns the union of the members and include list', () => {
    const list = getFinalMembers(['foo'], ['bar', 'baz'], [])

    expect(list).toStrictEqual(['foo', 'bar', 'baz'])
  })

  it('does not return duplicate entries', () => {
    const list = getFinalMembers(['foo'], ['foo'], [])

    expect(list).toStrictEqual(['foo'])
  })

  it('returns the list of members excluding the entries from the exclude list', () => {
    const list = getFinalMembers(['foo', 'bar', 'baz'], [], ['foo'])

    expect(list).toStrictEqual(['bar', 'baz'])
  })
})

describe('getNext', () => {
  it('returns next element when last is in the member list', () => {
    const next = getNext(['foo', 'bar', 'baz'], 'bar')

    expect(next).toBe('baz')
  })

  it('returns the first item in the list when last is the last member', () => {
    const next = getNext(['foo', 'bar', 'baz'], 'baz')

    expect(next).toBe('foo')
  })

  it('returns the first item in the list when last is null', () => {
    const next = getNext(['foo', 'bar', 'baz'], null)

    expect(next).toBe('foo')
  })

  it('returns the first item in the list when last is undefined', () => {
    const next = getNext(['foo', 'bar', 'baz'], undefined)

    expect(next).toBe('foo')
  })

  it('returns the first item in the list when last is empty', () => {
    const next = getNext(['foo', 'bar', 'baz'], '')

    expect(next).toBe('foo')
  })

  it('returns the first item in the list when last is not found', () => {
    const next = getNext(['foo', 'bar', 'baz'], 'bamboozle')

    expect(next).toBe('foo')
  })
})

describe('splitMembersList', () => {
  it('splits on whitespace', () => {
    const members = splitMembersList('foo bar baz')

    expect(members).toStrictEqual(['foo', 'bar', 'baz'])
  })

  it('strips at-signs from names', () => {
    const members = splitMembersList('@foo @bar @baz')

    expect(members).toStrictEqual(['foo', 'bar', 'baz'])
  })
})

describe('splitTeamName', () => {
  it('returns the appropriate object', () => {
    const obj = splitTeamName('@foo/bar')

    expect(obj).toStrictEqual({ org: 'foo', team_slug: 'bar' })
  })

  it('returns the appropriate object when no at-sign is used', () => {
    const obj = splitTeamName('foo/bar')

    expect(obj).toStrictEqual({ org: 'foo', team_slug: 'bar' })
  })
})
