import { WifiOff } from "lucide-react";

import "./OfflineState.css";

export function OfflineState() {
  return (
    <div className="mba-offline" role="status">
      <WifiOff size={16} aria-hidden="true" />
      <span>Sin conexión. Mostramos lo último que guardamos.</span>
    </div>
  );
}
