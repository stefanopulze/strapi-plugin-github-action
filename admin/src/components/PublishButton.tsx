import {Button, Typography} from "@strapi/design-system";
import {Loader, Upload} from "@strapi/icons";

interface PublishButtonProps {
  loading: boolean;
  onClick: Function
}


const PublishButton = ({loading, onClick}: PublishButtonProps) => {
  return <Button size="L" startIcon={<Upload/>} disabled={loading} loading={loading} onClick={onClick}>
    Trigger
  </Button>
}

export default PublishButton
