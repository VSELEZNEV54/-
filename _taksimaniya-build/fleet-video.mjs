// Экспорт принятого 15-секундного монтажа из пяти исходников Higgsfield, 720p / 24 fps.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, renameSync, rmSync } from "node:fs";
import path from "node:path";

const project = path.resolve(import.meta.dirname, "..");
const sources = path.resolve(process.argv[2] || path.join(project, "Медиа/Исходники Higgsfield"));
const output = path.resolve(process.argv[3] || path.join(project, "taksimaniya-demo/assets"));
const ffmpeg = process.env.TAXIMANIA_FFMPEG || "ffmpeg";
const framesPerShot = 72;

// Положение центра вертикального кадра задано долей ширины исходника.
const shots = [
  { file: "tenet-t7.mp4", first: 46, center: 0.42, pan: 0.16 },
  { file: "kia-rio.mp4", first: 21, center: 0.51, pan: 0.065 },
  { file: "driver.mp4", first: 185, center: 0.69, pan: 0 },
  { file: "geely-coolray.mp4", first: 18, center: 0.52, pan: 0 },
  { file: "hongqi-h5.mp4", first: 26, center: 0.48, pan: 0.08 }
];
const inputs = shots.flatMap(shot => ["-i", path.join(sources, shot.file)]);
const filters = [];
shots.forEach((shot, i) => {
  filters.push(
    `[${i}:v]fps=24,trim=start_frame=${shot.first}:end_frame=${shot.first + framesPerShot},` +
    `setpts=PTS-STARTPTS,setsar=1,split=2[wide${i}][uncropped${i}]`
  );
  const focus = `${shot.center}+${shot.pan}*n/${framesPerShot}`;
  filters.push(
    `[uncropped${i}]scale=540:960:force_original_aspect_ratio=increase:force_divisible_by=2:flags=lanczos,` +
    `crop=540:960:'clip(iw*(${focus})-ow/2,0,iw-ow)':(ih-oh)/2,setsar=1[vertical${i}]`
  );
});
const concat = name => shots.map((_, i) => `[${name}${i}]`).join("") + `concat=n=${shots.length}:v=1:a=0`;
filters.push(
  concat("wide") + ",split=3[desktop][phone-wide][cover]",
  "[phone-wide]crop=1280:640:0:32[landscape]",
  concat("vertical") + ",split=2[portrait][cover-portrait]"
);

const movies = [
  ["desktop", "fleet-drive.mp4"],
  ["landscape", "taksimaniya-drive-mobile.mp4"],
  ["portrait", "fleet-drive-portrait.mp4"]
];
const covers = [["cover", "fleet-drive-poster.webp"], ["cover-portrait", "fleet-drive-portrait.webp"]];

mkdirSync(path.join(output, "video"), { recursive: true });
mkdirSync(path.join(output, "img"), { recursive: true });
const stage = mkdtempSync(path.join(output, ".fleet-export-"));
try {
  const args = ["-nostdin", "-hide_banner", "-loglevel", "error", ...inputs,
    "-filter_complex_threads", "3", "-filter_complex", filters.join(";")];
  for (const [stream, filename] of movies) {
    args.push("-map", `[${stream}]`, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "14",
      "-threads", "4", "-profile:v", "high", "-level:v", "3.1", "-pix_fmt", "yuv420p", "-r", "24",
      "-g", String(framesPerShot), "-force_key_frames", "0,3,6,9,12", "-maxrate", "12M",
      "-bufsize", "24M", "-movflags", "+faststart", path.join(stage, filename));
  }
  for (const [stream, filename] of covers) {
    args.push("-map", `[${stream}]`, "-frames:v", "1", "-c:v", "libwebp", "-quality", "94",
      "-compression_level", "6", path.join(stage, filename));
  }
  execFileSync(ffmpeg, args, { stdio: "inherit" });
  for (const [, filename] of movies) renameSync(path.join(stage, filename), path.join(output, "video", filename));
  for (const [, filename] of covers) renameSync(path.join(stage, filename), path.join(output, "img", filename));
} finally {
  rmSync(stage, { recursive: true, force: true });
}
