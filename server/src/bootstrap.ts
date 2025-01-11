import type { Core } from '@strapi/strapi';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [{
    section: "plugins",
    displayName: "Access the plugin",
    uid: "read",
    pluginName: "github-action"
  }]

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};

export default bootstrap;
