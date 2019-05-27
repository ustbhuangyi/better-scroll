const execa = require('execa')
const semver = require('semver')
const inquirer = require('inquirer')
const chalk = require('chalk')

const curVersion = require('../lerna.json').version

const release = async () => {
  console.log(chalk.yellow(`Current version: ${curVersion}`))

  const bumps = ['patch', 'minor', 'major', 'prerelease', 'premajor']
  const versions = {}
  bumps.forEach(b => {
    versions[b] = semver.inc(curVersion, b)
  })

  const bumpChoices = bumps.map(b => ({ name: `${b} (${versions[b]})`, value: b }))

  function getVersion (answers) {
    return answers.customVersion || versions[answers.bump]
  }

  function getNpmTags (version) {
    if (isPreRelease(version)) {
      return ['next']
    }
    return ['latest', 'next']
  }

  function isPreRelease (version) {
    return !!semver.prerelease(version)
  }

  const { bump, customVersion, npmTag } = await inquirer.prompt([
    {
      name: 'bump',
      message: 'Select release type:',
      type: 'list',
      choices: [
        ...bumpChoices,
        { name: 'custom', value: 'custom' }
      ]
    },
    {
      name: 'customVersion',
      message: 'Input version:',
      type: 'input',
      when: answers => answers.bump === 'custom'
    },
    {
      name: 'npmTag',
      message: 'Input npm tag:',
      type: 'list',
      choices: answers => getNpmTags(getVersion(answers))
    }
  ])

  const version = customVersion || versions[bump]

  const { yes } = await inquirer.prompt([{
    name: 'yes',
    message: `Confirm releasing ${version} (${npmTag})?`,
    type: 'list',
    choices: ['Y', 'N']
  }])

  if (yes === 'N') {
    console.log(chalk.red('[release] cancelled.'))
    return
  }

  const releaseArguments = [
    'publish',
    version,
    '--force-publish',
    '--npm-tag',
    npmTag,
    '*'
  ]

  console.log(chalk.grey(`lerna ${releaseArguments.join(' ')}`))

  await execa(require.resolve('lerna/cli'), releaseArguments, { stdio: 'inherit' })
}

release().catch(err => {
  console.error(err)
  process.exit(1)
})
