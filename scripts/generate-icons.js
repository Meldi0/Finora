import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height) {
  // Simple PNG generator with gradient and rounded square
  const buffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate normalized coords
      const nx = x / width;
      const ny = y / height;
      
      // Gradient from Coral (#FF6584) to Orange (#FFA94D)
      const r = Math.round(255);
      const g = Math.round(101 + (169 - 101) * (nx * 0.5 + ny * 0.5));
      const b = Math.round(132 + (77 - 132) * (nx * 0.5 + ny * 0.5));
      
      // Rounded corner calculation
      const rx = Math.min(x, width - x);
      const ry = Math.min(y, height - y);
      const cornerRadius = width * 0.22;
      
      let alpha = 255;
      if (rx < cornerRadius && ry < cornerRadius) {
        const dist = Math.hypot(cornerRadius - rx, cornerRadius - ry);
        if (dist > cornerRadius) {
          alpha = 0;
        } else if (dist > cornerRadius - 1) {
          alpha = Math.round(255 * (cornerRadius - dist));
        }
      }

      // Draw stylized white F in center
      const inFVertical = x >= width * 0.35 && x <= width * 0.47 && y >= height * 0.25 && y <= height * 0.75;
      const inFTopHorizontal = x >= width * 0.35 && x <= width * 0.68 && y >= height * 0.25 && y <= height * 0.37;
      const inFMidHorizontal = x >= width * 0.35 && x <= width * 0.60 && y >= height * 0.44 && y <= height * 0.54;

      if ((inFVertical || inFTopHorizontal || inFMidHorizontal) && alpha > 0) {
        buffer[idx] = 255;
        buffer[idx + 1] = 255;
        buffer[idx + 2] = 255;
        buffer[idx + 3] = alpha;
      } else {
        buffer[idx] = r;
        buffer[idx + 1] = g;
        buffer[idx + 2] = b;
        buffer[idx + 3] = alpha;
      }
    }
  }

  // Build raw IDAT chunk with filter byte 0 per scanline
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    scanlines[y * (width * 4 + 1)] = 0; // Filter None
    buffer.copy(scanlines, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    crc = crc ^ byte;
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Generate 192x192 and 512x512 PNGs
const png192 = createPNG(192, 192);
fs.writeFileSync('./public/icon-192.png', png192);

const png512 = createPNG(512, 512);
fs.writeFileSync('./public/icon-512.png', png512);

console.log('Successfully generated public/icon-192.png and public/icon-512.png');
