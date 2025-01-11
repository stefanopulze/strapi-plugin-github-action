export default {
  default: {},
  validator(config: any) {
    if (!config.owner) {
      throw new Error("owner is a required");
    }

    if (!config.repo) {
      throw new Error("repo is a required");
    }

    if (!config.token) {
      throw new Error("token is a required");
    }

    if (!config.branch) {
      throw new Error("branch is a required");
    }

    if (!config.workflowId) {
      throw new Error("workflowId is a required");
    }
  },
};
