import {Alert, Box, Flex, Link, Tag, Typography} from '@strapi/design-system';
import {Layouts} from '@strapi/admin/strapi-admin';
import {useIntl} from 'react-intl';
import {PLUGIN_ID} from "../pluginId";
import {useFetchClient} from '@strapi/strapi/admin';
import {useEffect, useState} from "react";
import PublishButton from "../components/PublishButton";
import {CheckResult, RestError} from "../types";
import {Upload} from "@strapi/icons";
import Workflow from "../components/Workflow";

const HomePage = () => {
  const {formatMessage} = useIntl();
  const {get, post} = useFetchClient();
  const [error, setError] = useState(false);
  const [restError, setRestError] = useState({} as RestError);
  const [busy, setBusy] = useState(false);
  const [check, setCheck] = useState({} as CheckResult);

  const handleError = (e: any) => {
    const restError = e.response.data.error;
    console.log(restError);
    setError(true);
    setRestError(restError);
  }

  const handleTrigger = async () => {
    try {
      setBusy(true);
      const response = await post(`/${PLUGIN_ID}/trigger`, {})
      console.log('aaaa', response)
      setBusy(false);
    } catch (error) {
      handleError(error);
    }
  }

  const handleCloseAlert = () => {
    setError(false);
    setBusy(false);
  }

  useEffect(() => {

    const checkWorkflows = async () => {
      const response = await get(`/${PLUGIN_ID}/check`)
      console.log(response)
      setCheck(response.data)
      // timeout = setTimeout(checkWorkflows, 3000);
    }

    checkWorkflows().catch(console.error);
  }, [])

  return (
    <Box>
      <Layouts.Header
        title={formatMessage({
          id: 'github-action.header.title',
          defaultMessage: 'Github Action',
        })}
        subtitle={formatMessage({
          id: 'github-action.header.subtitle',
          defaultMessage: 'Trigger action',
        })}
        as="h2"
      />

      <Layouts.Content>
        {error ? (
          <Alert variant="danger" title={formatMessage({
            id: `github-action.${restError.details.code}.title`,
            defaultMessage: restError.message,
          })} action={<Link to={restError.details.documentation_url}>{restError.details.documentation_url}</Link>}
                 onClose={handleCloseAlert}>
            {formatMessage({
              id: `github-action.${restError.details.code}.description`,
              defaultMessage: restError.message,
            })}
          </Alert>
        ) : (
          <PublishButton loading={busy} onClick={handleTrigger}></PublishButton>
        )}

        {check &&
          <Flex gap={4} marginTop={8} direction="column" alignItems="flex-start">
            <Typography variant="beta" as="h3">Workflows</Typography>
            <Tag label={"Total Runs"} icon={<Upload/>}>{check.total_count}</Tag>
            {check.workflow_runs && check.workflow_runs.map((run) => (
              <Workflow run={run}/>
            ))
            }
          </Flex>
        }

      </Layouts.Content>
    </Box>
  )
};

export {HomePage};
