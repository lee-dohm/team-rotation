import * as core from '@actions/core'
import * as github from '@actions/github'

function getNext(members, last) {
  const lastIndex = members.findIndex(last)

  if (lastIndex == -1 || lastIndex + 1 >= members.length) {
    return members[0]
  } else {
    return members[lastIndex + 1]
  }
}

async function getTeamMembers(token, teamName) {
  const octokit = new github.GitHub(token)
  const {data: teamData} = await octokit.teams.getByName(splitTeamName(teamName))
  const {data: data} = await octokit.teams.listMembers({team_id: teamData.id})

  return data.map(member => member.login)
}

function splitMembersList(list) {
  return list.split(/\s+/).map(member => member[0] == '@' ? member.substring(1) : member)
}

function splitTeamName(teamName) {
  const matches = teamName.match(/@?([^/]+)\/(.+)/)

  return {org: matches[0], team_slug: matches[1]}
}

async function run() {
  try {
    const exclude = core.getInput('exclude')
    const include = core.getInput('include')
    const last = core.getInput('last')
    const teamName = core.getInput('teamName')
    const token = core.getInput('token')

    let members: string[] = []

    if (teamName) {
      if (!token) {
        throw new Error('`token` is required when `teamName` is supplied')
      }

      members = members.concat(await getTeamMembers(token, teamName))
    }

    members =
      members.
        concat(splitMembersList(include)).
        filter(member => member in splitMembersList(exclude)).
        sort()

    core.setOutput('next', getNext(members, last))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
