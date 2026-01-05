import { useRef } from "react";

export default function FirmaCanvas({ onSave }) {
  const canvasRef = useRef(null);
  let drawing = false;

  const start = () => {
    drawing = true;
  };

  const end = () => {
    drawing = false;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();

    // Guarda la firma en base64
    onSave(canvasRef.current.toDataURL("image/png"));
  };

  const draw = (e) => {
    if (!drawing) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={160}
      onMouseDown={start}
      onMouseUp={end}
      onMouseLeave={end}
      onMouseMove={draw}
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        backgroundColor: "#fff",
        cursor: "crosshair"
      }}
    />
  );
}
