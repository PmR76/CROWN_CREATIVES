Sentinel & Watchkeeper — Stability Gatekeeper
Sentinel ensures that Crown Creatives is safe to deploy to Cloudflare.
Watchkeeper ensures that the local creative environment is stable.

You only deploy when both are green.

1. BEFORE YOU PUSH — Run Sentinel (CLI)
Run:

Code
node sentinel/SentinelManifestScanner.js
This checks:

gallery folder

sound folder

manifests folder

gallery-manifest.json

sound-manifest.json

file tree consistency

duplicates

missing assets

If Sentinel prints:

Code
Status: green
→ Your host environment will build safely.

If Sentinel prints:

Code
missing: [...]
→ Fix before pushing.

2. BEFORE YOU PUSH — Check Watchkeeper HUD (Browser)
Start localhost:

Code
npm run dev
Press SHIFT + A to open Watchkeeper HUD.

Check:

React root mounted

Header stable

Background3D stable

HeroCrown stable

ThemePanel visible

CorePanel visible

Diagnostics active

FPS > 0

Gallery manifest loaded

Ticker running

If HUD is green, your local creative environment is stable.

3. IF BOTH ARE GREEN — Deploy
Push to GitHub:

Code
git add .
git commit -m "Deploy"
git push
Cloudflare will build and deploy safely.

4. If Cloudflare fails
Run:

Code
node sentinel/sentinel-root-check.js
This prints the resolved root and folder paths Cloudflare will use.

Sentinel Philosophy
“Local stability + file health = safe deploy.”

Sentinel is not noise.
Sentinel is your deployment gatekeeper.