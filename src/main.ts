import * as core from '@actions/core'
import * as github from '@actions/github'

import User from './user'

/**
 * Calculates the final list of usernames.
 *
 * The final list consists of all usernames listed in `members` or `include` except any listed in
 * `exclude`.
 *
 * @param members Base list of usernames
 * @param include List of usernames to include
 * @param exclude List of usernames to exclude
 * @returns List of usernames to use for the team rotation
 */
export function getFinalMembers(members: User[], include: User[], exclude: User[]): User[] {
  return Array.from(new Set(members.concat(include).filter((elem) => !exclude.includes(elem))))
}

/**
 * Gets the next person in the rotation.
 *
 * @param members Array of members of the team rotation
 * @param last Username of the last person to be chosen in the rotation, if any
 * @returns Username of the next person in the rotation
 */
export function getNext(members: User[], last: string | null | undefined): User {
  core.debug(`Members: ${JSON.stringify(members)}`)
  core.debug(`Last: ${JSON.stringify(last)}`)

  const lastIndex = members.findIndex((member) => member.equals(last))

  if (lastIndex == -1 || lastIndex + 1 >= members.length) {
    return members[0]
  } else {
    return members[lastIndex + 1]
  }
}

/**
 * Gets the usernames of a GitHub team.
 *
 * @param token Token to use to retrieve the list of team members via the API
 * @param teamName Name of the GitHub team to retrieve the member list from
 * @returns List of usernames belonging to the given team
 */
async function getTeamMembers(token: string, teamName: string) {
  const octokit = new github.GitHub(token)
  const { data: teamData } = await octokit.teams.getByName(teamSlugToParams(teamName))
  const { data: data } = await octokit.teams.listMembers({ team_id: teamData.id })

  return data.map((member) => new User(member.login))
}

/**
 * Splits a text list of space-separated GitHub usernames into an array of users.
 *
 * It also normalizes them by stripping the at-sign, if any, from the beginning of the username.
 *
 * @param text List of space-separated GitHub usernames
 *
 * @returns Array of normalized GitHub usernames
 */
export function splitUsernameList(text: string): User[] {
  return text
    .split(/\s+/)
    .filter((el) => el != '')
    .map((el) => new User(el))
}

/**
 * Splits a GitHub team slug into the Octokit `teams.getByName` params.
 *
 * @param teamName Text representation of a GitHub team name
 * @returns Object representation of the team name
 */
export function teamSlugToParams(teamName: string) {
  const matches = teamName.match(/@?([^/]+)\/(.+)/)

  if (!matches) {
    throw new Error(`'${teamName}' is not a valid team name`)
  }

  return { org: matches[1], team_slug: matches[2] }
}

async function run() {
  try {
    const excludeText = core.getInput('exclude') ?? ''
    const includeText = core.getInput('include') ?? ''
    const last = core.getInput('last')
    const teamName = core.getInput('teamName')
    const token = core.getInput('token')

    const includes = splitUsernameList(includeText)
    const excludes = splitUsernameList(excludeText)

    let members: User[] = []

    if (teamName) {
      if (!token) {
        throw new Error('`token` is required when `teamName` is supplied')
      }

      members = members.concat(await getTeamMembers(token, teamName))
      core.debug(`Team members: ${JSON.stringify(members)}`)
    }

    members = getFinalMembers(members, includes, excludes)

    core.debug(`Members (after include and exclude): ${JSON.stringify(members)}`)

    members = members.filter((item, index) => members.indexOf(item) === index).sort()

    core.setOutput('next', getNext(members, last).login)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
