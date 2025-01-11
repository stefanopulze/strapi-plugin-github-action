import {WorkflowRun} from "../types";
import {Badge, Card, Flex, LinkButton, Typography} from "@strapi/design-system";
import {Eye} from "@strapi/icons";
import {useState} from "react";
import {NavLink} from "react-router-dom";

const badgeBackgroundColor = (status: string): { background: string, text: string } => {
  switch (status) {
    case "completed":
      return {
        text: "success100",
        background: "success500"
      }
    case "pending":
      return {
        text: "success100",
        background: "warning500",
      }

    case "rejected":
      return {
        text: "success100",
        background: "danger500"
      }

    default:
      return {
        text: "neutral600",
        background: "neutral150",
      }
  }
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const Workflow = ({run}: { run: WorkflowRun }) => {
  const [badgeColor, setBadgeColor] = useState(badgeBackgroundColor(run.status));

  return <Card width="100%" padding={5}>
    <Flex gap={2} justifyContent="space-between">
      <Flex gap={2} className="start">
        <Badge backgroundColor={badgeColor.background} textColor={badgeColor.text}>{run.status}</Badge>

        <Typography variant="delta">{run.head_branch}</Typography>
      </Flex>

      <Flex gap={2} className="end">
        <Typography variant="omega">Trigger: {dateFormat.format(new Date(run.created_at))}</Typography>
        <Flex gap={3} className={"actions"}>
          <LinkButton tag={NavLink} to={run.html_url} variant="tertiary"><Eye/></LinkButton>
        </Flex>
      </Flex>
    </Flex>
  </Card>
}

export default Workflow
