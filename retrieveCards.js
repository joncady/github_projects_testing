const Octokit = require('@octokit/rest');
const fs = require("fs");
const { apiKey } = require('./apikey');

const octokit = new Octokit({
    auth: apiKey
});

const { owner, templateRepo } = JSON.parse(fs.readFileSync("projectConfig.json"));

octokit.projects.listForRepo({
    // owner of repo (could be an organization)
    owner: owner,
    // the repo's name
    repo: templateRepo
}).then(({ data }) => {
    // downloads the first project cards, will have be tailored to which one to download
    let project = data[0];
    octokit.projects.listColumns({
        project_id: project.id
    }).then(({ data: columnData }) => {
        // downloads all cards in the first column, normally to-do
        let toDoColumn = columnData[0];
        octokit.projects.listCards({
            column_id: toDoColumn.id
        }).then(({ data: cardData }) => {
            let filteredData = [];
            cardData.forEach(card => {
                filteredData.push({
                    body: card.note
                });
            });
            let fullCardObj = {
                cards: filteredData
            }
            let cards = JSON.stringify(fullCardObj, null, "\t");
            fs.writeFileSync('studentCards.json', cards);
        });
    });
}).catch((err) => {
    console.log(err);
});