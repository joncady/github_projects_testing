const Octokit = require('@octokit/rest');
const fs = require("fs");

if (!process.argv[2]) {
    throw Error("Needs auth key!");
} else {
    const api = process.argv[2];
    const octokit = new Octokit({
        auth: api
    });
    
    const { students, projectName, columns, cards, repo, owner, description } = JSON.parse(fs.readFileSync("cards.json"));
    
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
}