// deploy.js
import dotenv from "dotenv";
import fetch from "node-fetch";
import { exec } from "child_process";

dotenv.config();

const token = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;

if (!token || !zoneId) {
  console.error("Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID in .env");
  process.exit(1);
}

async function fetchAnalytics() {
  const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${zoneId}" }) {
          httpRequestsAdaptiveGroups(limit: 1) {
            sum {
              requests
              bytes
              threats
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  console.log("Cloudflare Analytics:", JSON.stringify(data, null, 2));
}

function triggerWranglerDeploy() {
  console.log("Starting Wrangler publish...");
  exec("wrangler publish", (error, stdout, stderr) => {
    if (error) {
      console.error(`Wrangler error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Wrangler stderr: ${stderr}`);
    }
    console.log(`Wrangler output:\n${stdout}`);
  });
}

async function runDeployment() {
  await fetchAnalytics();
  triggerWranglerDeploy();
}

runDeployment();
