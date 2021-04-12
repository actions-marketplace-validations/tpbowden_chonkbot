const { Octokit } = require("@octokit/rest");
const { createProbot } = require("probot");
const { createStatus } = require("./core");

const appFn = (app) => {
  app.on("pull_request", async (context) => {
    const github = context.octokit;
    await createStatus(context.payload, github);
  });
};

const probot = createProbot();

probot.load(appFn);

module.exports = async (req, res) => {
  const name = req.headers["x-github-event"];
  const id = req.headers["x-github-delivery"];

  if (!name) {
    res.status(400).json({ successful: false, error: "Invalid request" });
    console.error("Invalid request");
    return;
  }

  try {
    await probot.receive({
      name,
      id,
      payload: req.body,
    });

    res.status(200).json({ successful: true });
    console.info("Successful");
  } catch (e) {
    res
      .status(500)
      .json({ successful: false, error: "Unexpected error handling request" });
    console.error(e);
  }
};
