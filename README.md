# github_projects_testing

Best resource for github API: https://octokit.github.io/rest.js/

First, add in your api key (access token) to the apikey.js file. This token can be generated here: https://github.com/settings/tokens.

## Usage:

1. If you like to download project cards, make sure you point it at the correct `owner` and `repo`.
Use by running `node retrieveCards.js`.

2. If you would like to upload project cards, use `createCards.js`. This script will read in `studentCards.json` and upload all of the cards in the `cards` array. You can change what students to upload cards to by changing the github usernames in the `students` array in `projectConfig.json`. Feel free to alter any of the names for anything and change what the projects are called if need be. This script is ran with `node createCards.js`