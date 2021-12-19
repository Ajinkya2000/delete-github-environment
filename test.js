const inquirer = require("inquirer");

const questions = [
  {
    type: "list",
    name: "test",
    message: "Select an Environment to delete",
    choices: ["environment-1", "environment-2", "environment-3"],
  },
];

inquirer.prompt(questions);
