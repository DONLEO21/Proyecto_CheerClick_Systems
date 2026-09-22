import React from "react";
export default function AvisoToast({ aviso }) {
  return (
    <div className={`aviso-toast aviso-${aviso.tipo} ${aviso.visible ? "visible" : ""}`}>
      {aviso.mensaje}
    </div>
  );
}
