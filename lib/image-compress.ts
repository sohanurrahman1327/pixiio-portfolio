/**
 * Client-side image resize/re-encode so reference-image uploads comfortably
 * fit inside serverless function body limits (Vercel caps request bodies at
 * 4.5 MB) even though users can pick files up to 10 MB.
 */

const START_DIMENSION = 1800;
const START_QUALITY = 0.85;
const MIN_DIMENSION = 700;
const MIN_QUALITY = 0.4;
const MAX_ATTEMPTS = 6;

function loadImage(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file."));
    };
    img.src = url;
  });
}

function drawToJpegBlob(img: HTMLImageElement, maxDimension: number, quality: number): Promise<Blob> {
  const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image compression failed."))),
      "image/jpeg",
      quality
    );
  });
}

/** Resize + re-encode an image until it fits under `maxBytes`, or give up after a few attempts. */
export async function compressImageToLimit(file: File, maxBytes: number): Promise<Blob> {
  const { img, url } = await loadImage(file);
  try {
    let dimension = START_DIMENSION;
    let quality = START_QUALITY;
    let blob = await drawToJpegBlob(img, dimension, quality);

    let attempts = 0;
    while (blob.size > maxBytes && attempts < MAX_ATTEMPTS) {
      quality = Math.max(MIN_QUALITY, quality - 0.15);
      dimension = Math.max(MIN_DIMENSION, Math.round(dimension * 0.8));
      blob = await drawToJpegBlob(img, dimension, quality);
      attempts += 1;
    }

    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

const PREVIEW_START_DIMENSION = 480;
const PREVIEW_START_QUALITY = 0.7;
const PREVIEW_MIN_DIMENSION = 200;
const PREVIEW_MIN_QUALITY = 0.35;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read compressed image."));
    reader.readAsDataURL(blob);
  });
}

/**
 * Small, storage-friendly thumbnail (data URL) so the admin dashboard can show
 * the reference image inline, without persisting the full-resolution upload
 * (which is instead emailed as an attachment).
 */
export async function compressImageToPreviewDataUrl(file: File, maxBytes: number): Promise<string> {
  const { img, url } = await loadImage(file);
  try {
    let dimension = PREVIEW_START_DIMENSION;
    let quality = PREVIEW_START_QUALITY;
    let blob = await drawToJpegBlob(img, dimension, quality);

    let attempts = 0;
    while (blob.size > maxBytes && attempts < MAX_ATTEMPTS) {
      quality = Math.max(PREVIEW_MIN_QUALITY, quality - 0.15);
      dimension = Math.max(PREVIEW_MIN_DIMENSION, Math.round(dimension * 0.8));
      blob = await drawToJpegBlob(img, dimension, quality);
      attempts += 1;
    }

    return blobToDataUrl(blob);
  } finally {
    URL.revokeObjectURL(url);
  }
}
