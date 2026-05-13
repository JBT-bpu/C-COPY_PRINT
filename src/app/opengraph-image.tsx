import { ImageResponse } from "next/og";

export const alt = "C-COPY · Premium printing in Tel Aviv since 1986";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#FAFBF6";
const GREEN = "#8DC641";
const GREEN_DEEP = "#6BA82D";
const INK = "#0F1A05";
const INK_SOFT = "#2D3920";
const LINE = "#E5EAD9";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: CREAM,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Architectural green frame arc — top right */}
        <svg
          width={420}
          height={420}
          viewBox="0 0 500 500"
          fill="none"
          style={{ position: "absolute", top: -100, right: -100, opacity: 0.18 }}
        >
          <path
            d="M0 250C0 111.929 111.929 0 250 0C388.071 0 500 111.929 500 250"
            stroke={GREEN}
            strokeWidth={32}
            strokeLinecap="round"
          />
        </svg>

        {/* Soft green glow — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -160,
            width: 540,
            height: 540,
            borderRadius: "50%",
            background: GREEN,
            opacity: 0.12,
            filter: "blur(60px)",
          }}
        />

        {/* Header — brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              border: `5px solid ${GREEN}`,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 44,
              color: GREEN_DEEP,
            }}
          >
            C
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: INK, letterSpacing: -1 }}>
              C-COPY
            </div>
            <div style={{ fontSize: 18, color: INK_SOFT, marginTop: 2 }}>
              שיא קופי · Since 1986
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: INK,
              lineHeight: 1.0,
              letterSpacing: -3,
            }}
          >
            Premium printing.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 1.0,
            }}
          >
            <span style={{ color: INK }}>No</span>
            <span
              style={{
                background: "white",
                border: `5px solid ${GREEN}`,
                color: INK,
                padding: "12px 36px",
                borderRadius: 9999,
                transform: "rotate(-1deg)",
                fontStyle: "italic",
                display: "flex",
              }}
            >
              compromise.
            </span>
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            paddingTop: 24,
            borderTop: `2px solid ${LINE}`,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {["Digital print", "Wide format", "Packaging"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  background: "white",
                  border: `2px solid ${LINE}`,
                  color: INK_SOFT,
                  padding: "10px 22px",
                  borderRadius: 9999,
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", color: INK_SOFT, fontSize: 22, fontWeight: 600 }}>
            ccopy.co.il
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
