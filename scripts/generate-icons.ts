/**
 * Builds the fallback icons from app/icon.svg (the koala):
 *   app/favicon.ico     — 16, 32 and 48 px, for browsers without SVG favicon support
 *   app/apple-icon.png  — 180 px on a leaf-green background, for iPhone/iPad home screens
 *
 *   npm run icons
 *
 * Next.js picks up all three files from /app automatically.
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const svg = readFileSync("app/icon.svg");

const png = (size: number) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

/** An .ico file is a small header plus a directory of embedded PNGs. */
function toIco(images: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

async function main() {
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) })));
  writeFileSync("app/favicon.ico", toIco(images));

  // iOS fills transparent areas with black, so give the home-screen icon a background.
  const koala = await sharp(svg, { density: 384 }).resize(144, 144).png().toBuffer();
  const apple = await sharp({
    create: { width: 180, height: 180, channels: 4, background: "#e3f3e6" },
  })
    .composite([{ input: koala, top: 18, left: 18 }])
    .png()
    .toBuffer();
  writeFileSync("app/apple-icon.png", apple);

  console.log(`Wrote app/favicon.ico (${sizes.join(", ")} px) and app/apple-icon.png (180 px).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
