import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

import { getNext, splitMembersList } from '../src/main'

test('getNext returns next element when last is in the member list', () => {
  const next = getNext(['foo', 'bar', 'baz'], 'bar')

  expect(next).toBe('baz')
})

test('getNext returns the first item in the list when last is the last member', () => {
  const next = getNext(['foo', 'bar', 'baz'], 'baz')

  expect(next).toBe('foo')
})

test('getNext returns the first item in the list when last is null', () => {
  const next = getNext(['foo', 'bar', 'baz'], null)

  expect(next).toBe('foo')
})

test('getNext returns the first item in the list when last is undefined', () => {
  const next = getNext(['foo', 'bar', 'baz'], undefined)

  expect(next).toBe('foo')
})

test('getNext returns the first item in the list when last is not found', () => {
  const next = getNext(['foo', 'bar', 'baz'], 'bamboozle')

  expect(next).toBe('foo')
})

test('splitMembersList splits on whitespace', () => {
  const members = splitMembersList('foo bar baz')

  expect(members).toStrictEqual(['foo', 'bar', 'baz'])
})

test('splitMembersList strips at-signs from names', () => {
  const members = splitMembersList('@foo @bar @baz')

  expect(members).toStrictEqual(['foo', 'bar', 'baz'])
})
