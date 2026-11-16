import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#060b1a", borderRadius: 96 }}>
        <svg width="400" height="400" viewBox="0 0 48 48">
          <path d="M4 8h12l8 18 8-18h12L28 42h-8L4 8Z" fill="#e8002d" />
          <path d="M18 8h12l-6 13-6-13Z" fill="#ffc400" />
        </svg>
      </div>
    ),
    size,
  );
}
