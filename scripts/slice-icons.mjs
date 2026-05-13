/**
 * Slice icons.png sprite into individual transparent PNGs.
 * Grid: 5 cols × 5 rows, 35px outer margin, no gap.
 * Background removal via color-distance threshold.
 *
 * Usage: node scripts/slice-icons.mjs
 * Run from: ccopy-site/
 */
import sharp from "sharp";
import { mkdir } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SOURCE = resolve(ROOT, "..", "icons.png");
const OUT_DIR = resolve(ROOT, "public", "icons");

// Grid settings (from icon_grid_cutter_alpha_html.html defaults)
const COLS = 5;
const ROWS = 5;
const MARGIN_X = 35;
const MARGIN_Y = 35;
const GAP_X = 0;
const GAP_Y = 0;
const THRESHOLD = 34; // color distance for background removal
const PADDING = 18; // extra padding around icon

// Icon names in grid order (left-to-right, top-to-bottom)
const NAMES = [
    "digital-printer",
    "wide-format-printer",
    "design-tools",
    "signage-board",
    "document-page",
    "notebook",
    "quality-shield",
    "technology-gear",
    "partnership-handshake",
    "pricing-dollar",
    "fast-service",
    "team-customers",
    "delivery-truck",
    "upload-file",
    "testimonial-quote",
    "approved-check",
    "phone-contact",
    "email-envelope",
    "location-pin",
    "facebook",
    "instagram",
    "whatsapp",
    "play-video",
    "storefront",
    "quotation-marks",
];

async function main() {
    // Get image metadata
    const meta = await sharp(SOURCE).metadata();
    const { width, height } = meta;
    console.log(`Source: ${width}×${height}`);

    // Calculate cell dimensions
    const usableW = width - MARGIN_X * 2 - GAP_X * (COLS - 1);
    const usableH = height - MARGIN_Y * 2 - GAP_Y * (ROWS - 1);
    const cellW = Math.floor(usableW / COLS);
    const cellH = Math.floor(usableH / ROWS);
    console.log(`Cell size: ${cellW}×${cellH}`);

    // Create output directory
    await mkdir(OUT_DIR, { recursive: true });

    // Sample background color from corners
    const { data: cornerData } = await sharp(SOURCE)
        .raw()
        .toBuffer({ resolveWithObject: true });

    const samplePoints = [
        [8, 8],
        [width - 9, 8],
        [8, height - 9],
        [width - 9, height - 9],
    ];
    let bgR = 0,
        bgG = 0,
        bgB = 0;
    for (const [sx, sy] of samplePoints) {
        const idx = (sy * width + sx) * 3;
        bgR += cornerData[idx];
        bgG += cornerData[idx + 1];
        bgB += cornerData[idx + 2];
    }
    bgR = Math.round(bgR / samplePoints.length);
    bgG = Math.round(bgG / samplePoints.length);
    bgB = Math.round(bgB / samplePoints.length);
    console.log(`Background color: rgb(${bgR}, ${bgG}, ${bgB})`);

    let count = 0;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const idx = row * COLS + col;
            const name = NAMES[idx];
            if (!name) continue;

            const x = MARGIN_X + col * (cellW + GAP_X);
            const y = MARGIN_Y + row * (cellH + GAP_Y);

            // Extract cell region
            const { data: cellData } = await sharp(SOURCE)
                .extract({ left: x, top: y, width: cellW, height: cellH })
                .raw()
                .toBuffer({ resolveWithObject: true });

            // Remove background: make pixels close to bg color transparent
            const outData = Buffer.alloc(cellW * cellH * 4);
            for (let i = 0; i < cellW * cellH; i++) {
                const r = cellData[i * 3];
                const g = cellData[i * 3 + 1];
                const b = cellData[i * 3 + 2];
                const dist = Math.sqrt(
                    (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
                );

                if (dist < THRESHOLD) {
                    // Transparent
                    outData[i * 4] = 0;
                    outData[i * 4 + 1] = 0;
                    outData[i * 4 + 2] = 0;
                    outData[i * 4 + 3] = 0;
                } else {
                    // Keep pixel, make fully opaque
                    outData[i * 4] = r;
                    outData[i * 4 + 1] = g;
                    outData[i * 4 + 2] = b;
                    outData[i * 4 + 3] = 255;
                }
            }

            // Add padding
            const padW = cellW + PADDING * 2;
            const padH = cellH + PADDING * 2;
            const paddedData = Buffer.alloc(padW * padH * 4);
            // Fill with transparent
            paddedData.fill(0);
            // Copy cell data into center
            for (let py = 0; py < cellH; py++) {
                for (let px = 0; px < cellW; px++) {
                    const srcIdx = (py * cellW + px) * 4;
                    const dstIdx = ((py + PADDING) * padW + (px + PADDING)) * 4;
                    paddedData[dstIdx] = outData[srcIdx];
                    paddedData[dstIdx + 1] = outData[srcIdx + 1];
                    paddedData[dstIdx + 2] = outData[srcIdx + 2];
                    paddedData[dstIdx + 3] = outData[srcIdx + 3];
                }
            }

            // Save as PNG
            const outPath = resolve(OUT_DIR, `${name}.png`);
            await sharp(paddedData, {
                raw: { width: padW, height: padH, channels: 4 },
            })
                .png()
                .toFile(outPath);

            count++;
            console.log(`  ✓ ${name}.png (${padW}×${padH})`);
        }
    }

    console.log(`\nDone! ${count} icons saved to ${OUT_DIR}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
