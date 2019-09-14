const Octokit = require('@octokit/rest');
const fs = require("fs");

if (!process.argv[2]) {
    throw Error("Needs auth key!");
} else {
    const api = process.argv[2];
    const octokit = new Octokit({
        auth: api
    });
    
    const { students, projectName, columns, cards, repo } = JSON.parse(fs.readFileSync("cards.json"));
    
    students.forEach(student => {
        octokit.projects.createForRepo({
            owner: student,
            repo: repo,
            name: projectName
        }).then(({ data, headers, status }) => {
            let id = data.id;
            octokit.projects.createColumn({
                project_id: id,
                name: columns[0]
            }).then(({data, headers, status }) => {
                let colId = data.id;
                cards.forEach(card => {
                    octokit.projects.createCard({
                        column_id: colId,
                        note: card.body
                    });
                });
            });
            octokit.projects.createColumn({
                project_id: id,
                name: columns[1]
            });
            octokit.projects.createColumn({
                project_id: id,
                name: columns[2]
            })
        });
    });
}