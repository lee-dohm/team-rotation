# Team Rotation

A GitHub Action to determine the next team member in a rotation.

## Use

This GitHub Action is meant to be used to assist with creating issues or PRs for tasks that rotate through a team. For example:

```yaml
# .github/workflows/weekly-issue
on:
  schedule:
  - cron: 0 20 * * 2
name: Create weekly issue
jobs:
  stuff:
    steps:
      - uses: lee-dohm/last-assigned@v1
        query: 'label:weekly-issue'
        id: assigned
      - uses: lee-dohm/team-rotation@v1
        with:
          last: ${{ steps.assigned.outputs.last }}
          include: octocat lee-dohm
        id: rotation
      - uses: JasonEtco/create-an-issue@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          filename: .github/weekly-issue-template.md
          assignees: ${{ steps.rotation.outputs.next }}
```

This workflow:

1. Gets the person that was assigned to the last issue opened that matches the query `label:weekly-issue`
1. Determines the next person in the team rotation after the person found in step 1
1. Creates a new issue based on the `.github/weekly-issue-template.md` template and assigns the person found in step 2

## License

[MIT](LICENSE.md)
