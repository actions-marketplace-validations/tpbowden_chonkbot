const { Octokit } = require("@octokit/rest");
const core = require("@actions/core");
const github = require("@actions/github");
const { createStatus } = require("./core");

const run = async () => {
  try {
    const token = core.getInput("token", { required: true });
    const app = new Octokit({
      auth: token,
    });

    const status = await createStatus(github.context.payload, app);
    core.setOutput("chonkLevel", status.data.description);
  } catch (e) {
    core.setFailed(`Chonkbot failed with error: ${e}`);
  }
};

module.exports = run();
