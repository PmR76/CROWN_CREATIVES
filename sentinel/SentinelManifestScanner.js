import fs from "fs";
import path from "path";

const ROOT = "C:/DEV/CROWN_CREATIVES/test";

function findLabs() {
  return fs.readdirSync(ROOT)
    .filter(name => name.startsWith("core-lab-"))
    .map(name => path.join(ROOT, name));
}

function checkFolder(folder) {
  return fs.existsSync(folder) ? "OK" : "Missing";
}

function readJSON(file) {
  if (!fs.existsSync(file)) return { status: "Missing", data: null };
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return { status: "OK", data };
  } catch {
    return { status: "Invalid JSON", data: null };
  }
}

function scanLab(labPath) {
  const publicPath = path.join(labPath, "public");
  const manifestsPath = path.join(publicPath, "manifests");
  const soundsPath = path.join(publicPath, "sounds");
  const galleryPath = path.join(publicPath, "gallery");

  const soundManifest = path.join(manifestsPath, "sound-manifest.json");
  const galleryManifest = path.join(manifestsPath, "gallery-manifest.json");

  const soundManifestData = readJSON(soundManifest);
  const galleryManifestData = readJSON(galleryManifest);

  const sounds = fs.existsSync(soundsPath)
    ? fs.readdirSync(soundsPath).filter(f => f.endsWith(".mp3"))
    : [];

  const gallery = fs.existsSync(galleryPath)
    ? fs.readdirSync(galleryPath).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
    : [];

  return {
    lab: path.basename(labPath),

    folders: {
      public: checkFolder(publicPath),
      manifests: checkFolder(manifestsPath),
      sounds: checkFolder(soundsPath),
      gallery: checkFolder(galleryPath)
    },

    manifests: {
      sound: soundManifestData.status,
      gallery: galleryManifestData.status
    },

    soundFiles: sounds.length ? sounds : "None",
    galleryFiles: gallery.length ? gallery : "None",

    manifestMismatch: {
      sound:
        soundManifestData.data?.tracks &&
        sounds.length &&
        !soundManifestData.data.tracks.every(t => sounds.includes(t))
          ? "Mismatch"
          : "OK",

      gallery:
        galleryManifestData.data?.images &&
        gallery.length &&
        !galleryManifestData.data.images.every(i => gallery.includes(i))
          ? "Mismatch"
          : "OK"
    }
  };
}

export function runSentinelManifestScanner() {
  const labs = findLabs();
  const results = labs.map(scanLab);

  console.log("=== SENTINEL MANIFEST SCANNER ===");
  console.log(JSON.stringify(results, null, 2));

  return results;
}
