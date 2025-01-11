import type {Core} from '@strapi/strapi';
import {PLUGIN_ID} from "../../../admin/src/pluginId";
import {CheckResult, PluginConfig, RestError, WorkflowRun} from "../types"

function createHeaders(token: string): Headers {
  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + token);
  headers.append('Accept', 'application/vnd.github.v3+json');
  headers.append('Content-Type', 'application/json');
  headers.append('X-GitHub-Api-Version', '2022-11-28');
  return headers
}

async function handleError(response: Response): Promise<RestError> {
  const body = await response.json() as any;
  const error = {
    message: body.message || "Unknown error",
    details: {
      code: "generic_error",
      documentation_url: body.documentation_url || undefined,
    }
  }

  switch (response.status) {
    case 404:
      error.message = "Invalid Github configuration"
      error.details.code = "invalid-configuration";
      break

    case 403:
      error.message = "Wrong Github token permission"
      error.details.code = "wrong-token-permission";
      break;
  }

  return error;
}

const controller = ({strapi}: { strapi: Core.Strapi }) => {
  return ({
    async check(ctx: any) {
      const {owner, repo, branch, token} = strapi.config.get(`plugin.${PLUGIN_ID}`) as PluginConfig
      const headers = createHeaders(token)

      const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs?branch=${branch}&per_page=3`;
      const response = await fetch(url, {
        headers,
      });

      if (!response.ok) {
        const error = await handleError(response);
        return ctx.badRequest(error.message, error.details)
      }

      const body = await response.json() as any;
      const workflowRuns: WorkflowRun[] = body.workflow_runs.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        head_branch: workflow.head_branch,
        status: workflow.status,
        cancel_url: workflow.cancel_url,
        html_url: workflow.html_url,
        created_at: workflow.created_at,
        updated_at: workflow.updated_at
      }))
      ctx.send({
        total_count: body.total_count,
        workflow_runs: workflowRuns
      } as CheckResult)
    },

    async trigger(ctx: any) {
      const {owner, repo, workflowId, branch, token} = strapi.config.get(`plugin.${PLUGIN_ID}`) as PluginConfig
      const headers = createHeaders(token)

      const payload = {ref: branch}
      const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`;
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await handleError(response);
        return ctx.badRequest(error.message, error.details)
      } else if (response.status == 204) {
        ctx.status = 202;
        ctx.body = {accept: true}
        return
      }

      const body = await response.json() as any;
      ctx.send(body);
    }
  });
};

export default controller;
