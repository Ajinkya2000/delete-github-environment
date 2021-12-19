const inquirer = require("inquirer");
const {
  displayEnvironments,
  selectEnvironmentToDelete,
  makeDeploymentsInactive,
  deleteEnvironment,
  success,
} = require("./src/removeEnvironment");
// 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

// Validations
const validation = require("./validations");

const questions = [
  {
    type: "input",
    name: "githubAccessToken",
    message:
      "Enter Github Personal Access Token (Must be `repo_deployments` authorized): ",
    validate: validation,
  },
  {
    type: "input",
    name: "githubRepository",
    message: "Enter Github Repository: ",
    validate: validation,
  },
  {
    type: "input",
    name: "githubUsername",
    message: "Enter Github Username: ",
    validate: validation,
  },
];

inquirer
  .prompt(questions)
  .then((answers) => {
    displayEnvironments(answers)
      .then((data) => selectEnvironmentToDelete(data))
      .then((selectedDeployments) =>
        makeDeploymentsInactive(selectedDeployments)
      )
      .then((selectedDeployments) => deleteEnvironment(selectedDeployments))
      .then(() => success())
      .catch((err) => console.log(err.message));
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      console.log("Error", error);
    }
  });
