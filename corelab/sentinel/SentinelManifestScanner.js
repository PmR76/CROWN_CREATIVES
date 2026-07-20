import fs from "fs";
import path from "path";

// NEW ROOT — your live site is now at project root
const ROOT = "C:/DEV/CROWN_CREATIVES/public";

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

export function runSentinelManifestScanner() {
  const publicPath = ROOT;
  const manifestsPath = path.join(ROOT, "manifests");
  const soundsPath = path.join(ROOT, "sounds");
  const galleryPath = path.join(ROOT, "gallery");

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

  const result = {
    site: "root-site",

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

  console.log("=== SENTINEL MANIFEST SCANNER ===");
  console.log(JSON.stringify(result, null, 2));

  return result;
}
