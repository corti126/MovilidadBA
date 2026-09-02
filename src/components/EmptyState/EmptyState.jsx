import { Inbox } from "lucide-react";

import { StateMessage } from "../StateMessage/StateMessage";
import "./EmptyState.css";

export function EmptyState({ title, description, action, icon = Inbox }) {
  return <StateMessage icon={icon} title={title} description={description} action={action} />;
}
