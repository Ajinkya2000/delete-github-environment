const axios = require("axios");
const inquirer = require("inquirer");

// GLOBAL VARS
let URL, AUTH_HEADER;

// UTILITY FUNCTIONS
const getAllDeployments = async () => {
  const response = await axios.get(`${URL}`, {
    headers: { Authorization: AUTH_HEADER },
  });

  return response.data;
};

module.exports.displayEnvironments = async function ({
  githubAccessToken,
  githubRepository,
  githubUsername,
}) {
  // PARAMETERS
  const TOKEN = githubAccessToken.trim();
  const REPO = githubRepository.trim();
  const USER_OR_ORG = githubUsername.trim();

  URL = `https://api.github.com/repos/${USER_OR_ORG}/${REPO}/deployments`;
  AUTH_HEADER = `token ${TOKEN}`;

  try {
    const deployments = await getAllDeployments();
    return deployments;
  } catch (err) {
    const { response } = err;
    if (response.status === 401) {
      throw new Error("Invalid Access Token");
    } else {
      throw new Error("Github user/repository not found.");
    }
  }
};

module.exports.selectEnvironmentToDelete = async function (data) {
  const deployments = data.map((deployment) => {
    return deployment.environment;
  });

  const uniqueDeployments = new Set(deployments);

  const environmentQuestions = [
    {
      type: "list",
      name: "selectedEnvironment",
      message: "Select an Environment to delete",
      choices: [...uniqueDeployments], //Converting to Array
    },
  ];

  const { selectedEnvironment } = await inquirer.prompt(environmentQuestions);
  const getSelectedDeployments = data.filter((deployment) => {
    return deployment.environment === selectedEnvironment;
  });

  return getSelectedDeployments;
};

module.exports.makeDeploymentsInactive = function (selectedDeployments) {
  return Promise.all(
    selectedDeployments.map((deployment) => {
      return axios
        .post(
          `${URL}/${deployment.id}/statuses`,
          { state: "inactive" },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: AUTH_HEADER,
            },
          }
        )
        .then(() => {
          return deployment.id;
        });
    })
  );
};

module.exports.deleteEnvironment = (deploymentIds) => {
  return Promise.all(
    deploymentIds.map((id) => {
      console.log(`${URL}/${id}`);
      axios
        .delete(`${URL}/${id}`, {
          headers: { Authorization: AUTH_HEADER },
        })
        .then(() => id);
    })
  );
};

module.exports.success = function () {
  console.log("Environment Deleted Successfully!");
};
