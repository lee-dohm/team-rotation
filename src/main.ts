import * as core from '@actions/core'
import * as github from '@actions/github'

export function getNext(members, last) {
  core.debug(`Members: ${JSON.stringify(members)}`)
  core.debug(`Last: ${JSON.stringify(last)}`)

  const lastIndex = members.findIndex(member => member == last)

  if (lastIndex == -1 || lastIndex + 1 >= members.length) {
    return members[0]
  } else {
    return members[lastIndex + 1]
  }
}

async function getTeamMembers(token, teamName) {
  const octokit = new github.GitHub(token)
  const { data: teamData } = await octokit.teams.getByName(splitTeamName(teamName))
  const { data: data } = await octokit.teams.listMembers({ team_id: teamData.id })

  return data.map(member => member.login)
}

export function splitMembersList(list) {
  return list.split(/\s+/).map(member => (member[0] == '@' ? member.substring(1) : member))
}

export function splitTeamName(teamName) {
  const matches = teamName.match(/@?([^/]+)\/(.+)/)

  return { org: matches[1], team_slug: matches[2] }
}

async function run() {
  try {
    const exclude = core.getInput('exclude') || ''
    const include = core.getInput('include') || ''
    const last = core.getInput('last')
    const teamName = core.getInput('teamName')
    const token = core.getInput('token')

    let members: string[] = []

    if (teamName) {
      if (!token) {
        throw new Error('`token` is required when `teamName` is supplied')
      }

      members = members.concat(await getTeamMembers(token, teamName))
      core.debug(`Team members: ${JSON.stringify(members)}`)
    }

    members = members
      .concat(splitMembersList(include))
      .filter(member => member in splitMembersList(exclude))

    core.debug(`Members (after include and exclude): ${JSON.stringify(members)}`)

    members = members.filter((item, index) => members.indexOf(item) === index).sort()

    core.setOutput('next', getNext(members, last))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
