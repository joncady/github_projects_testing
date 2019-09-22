const Octokit = require('@octokit/rest');
const fs = require("fs");
const { apiKey } = require('./apikey');

const octokit = new Octokit({
    auth: apiKey
});

const { students, projectName, columns, repo, owner, description } = JSON.parse(fs.readFileSync("projectConfig.json"));
const { cards } = JSON.parse(fs.readFileSync("studentCards.json"));

students.forEach(student => {
    octokit.projects.createForRepo({
        owner: owner,
        repo: `${repo}-${student}`,
        name: projectName,
        body: description
    }).then(({ data, headers, status }) => {
        let id = data.id;
        // create to do column first
        octokit.projects.createColumn({
            project_id: id,
            name: columns[0]
        }).then(({data, headers, status }) => {
            // then in progress
            octokit.projects.createColumn({
                project_id: id,
                name: columns[1]
            }).then(() => {
                // then done
                octokit.projects.createColumn({
                    project_id: id,
                    name: columns[2]
                });
            });
            let colId = data.id;
            cards.forEach(card => {
                octokit.projects.createCard({
                    column_id: colId,
                    note: card.body
                });
            });
        });
    }).catch(error => {
        console.log(error);
    });
});