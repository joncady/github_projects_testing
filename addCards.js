const Octokit = require('@octokit/rest');
const fs = require("fs");
const { apiKey } = require('./apikey');

const octokit = new Octokit({
    auth: apiKey
});

const { students, repo, owner } = JSON.parse(fs.readFileSync("projectConfig.json"));
const { cards } = JSON.parse(fs.readFileSync("studentCards.json"));

students.forEach((student, index) => {
    // add in spacing in between to not trigger abuse detection from github
    setTimeout(() => {
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
                let count = cards.length - 1;
                addCard(count, toDoColumn.id);
            });
        }).catch(error => {
            console.log(error);
        });
    }, 7000 * index);
});

function addCard(count, id) {
    if (0 <= count) {
        octokit.projects.createCard({
            column_id: id,
            note: cards[count].body
        }).then(() => {
            addCard(count - 1, id);
        }).catch(error => {
            console.log(error);
        });
    }
}