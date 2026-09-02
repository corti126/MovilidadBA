import { MapPin } from "lucide-react";

import { Button } from "../Button/Button";
import { StateMessage } from "../StateMessage/StateMessage";
import "./PermissionState.css";

export function PermissionState({ onAllow, onManual, denied = false }) {
  return (
    <StateMessage
      icon={MapPin}
      tone="brand"
      title={denied ? "No pudimos usar tu ubicación" : "Necesitamos tu ubicación"}
      description={
        denied
          ? "Podés escribir una dirección para ver qué transporte tenés cerca."
          : "La usamos solo para mostrarte qué transporte tenés cerca tuyo."
      }
      action={
        <div className="mba-permission__actions">
          {!denied ? <Button onClick={onAllow}>Usar mi ubicación</Button> : null}
          <Button variant="secondary" onClick={onManual}>
            Elegir dirección
          </Button>
        </div>
      }
    />
  );
}
