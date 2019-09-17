const Octokit = require('@octokit/rest');
const fs = require("fs");

if (!process.argv[2]) {
    throw Error("Needs auth key!");
} else {
    const api = process.argv[2];
    const octokit = new Octokit({
        auth: api
    });
    octokit.projects.listForRepo({
        owner: "info340a-au19",
        repo: "project-joncady"
    }).then(({ data }) => {
        let project = data[0];
        octokit.projects.listColumns({
            project_id: project.id
        }).then(({ data: columnData }) => {
            let toDoColumn = columnData[0];
            octokit.projects.listCards({
                column_id: toDoColumn.id
            }).then(({ data: cardData }) => {
                let cards = JSON.stringify(cardData);
                fs.writeFileSync('studentCards.json', cards);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}



