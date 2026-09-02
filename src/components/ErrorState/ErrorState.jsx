import { CloudOff } from "lucide-react";

import { Button } from "../Button/Button";
import { StateMessage } from "../StateMessage/StateMessage";
import "./ErrorState.css";

export function ErrorState({
  title = "No pudimos actualizar la información",
  description = "Mostramos la última información disponible. Probá de nuevo en unos segundos.",
  onRetry,
}) {
  return (
    <StateMessage
      icon={CloudOff}
      tone="warn"
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        ) : null
      }
    />
  );
}
