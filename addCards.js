const Octokit = require('@octokit/rest');
const fs = require("fs");
const { apiKey } = require('./apikey');

const octokit = new Octokit({
    auth: apiKey
});

const { students, repo, owner } = JSON.parse(fs.readFileSync("projectConfig.json"));
const { cards } = JSON.parse(fs.readFileSync("studentCards.json"));

students.forEach(student => {
    octokit.projects.listForRepo({
        // owner of repo (could be an organization)
        owner: owner,
        // the repo's name
        repo: `${repo}-${student}`
    }).then(({ data, headers, status }) => {
        let studentProj = data[0];
        octokit.projects.listColumns({
            project_id: studentProj.id
        }).then(({ data, headers, status }) => {
            let toDoColumn = data[0];
            cards.forEach(card => {
                octokit.projects.createCard({
                    column_id: toDoColumn.id,
                    note: card.body
                });
            });
        });
    }).catch(error => {
        console.log(error);
    });
});