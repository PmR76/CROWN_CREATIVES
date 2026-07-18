// deploy.js
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const token = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;

if (!token || !zoneId) {
  console.error("Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID in .env");
  process.exit(1);
}

async function runDeployment() {
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/analytics/dashboard`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    console.log("Cloudflare Analytics:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Deployment failed:", err);
  }
}

runDeployment();
