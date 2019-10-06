const Octokit = require('@octokit/rest');
const fs = require("fs");
const { apiKey } = require('./apikey');

const octokit = new Octokit({
    auth: apiKey
});

const { students, repo, owner } = JSON.parse(fs.readFileSync("projectConfig.json"));

// deletes 1st page of project cards, re-run to delte all of them
students.forEach((student, index) => {
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
                octokit.projects.listCards({
                    column_id: toDoColumn.id
                }).then(({ data, headers, status }) => {
                    let cardArray = data;
                    cardArray.forEach(card => {
                        octokit.projects.deleteCard({
                            card_id: card.id
                        });
                    });
                });
            });
        }).catch(error => {
            console.log(error);
        });
    }, 4000 * index);
});