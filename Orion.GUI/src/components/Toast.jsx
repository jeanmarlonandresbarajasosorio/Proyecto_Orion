import React from "react";

export default function Toast({ text }) {
  return (
    <div className="toast animate-fade">
      {text}
    </div>
  );
}
