import { ImageResponse } from "next/og";
import { BRAND as c } from "@/lib/theme";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: c.navy, borderRadius: 128 }}>
        <svg width="380" height="380" viewBox="0 0 48 48">
          <path d="M4 8h12l8 18 8-18h12L28 42h-8L4 8Z" fill={c.red} />
          <path d="M18 8h12l-6 13-6-13Z" fill={c.yellow} />
        </svg>
      </div>
    ),
    size,
  );
}
