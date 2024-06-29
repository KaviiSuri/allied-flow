import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

import { env } from "../config/env.js";
import { fetchAdminAccessToken } from "../services/logto/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateLogtoAdminSdk() {
  try {
    const accessToken = await fetchAdminAccessToken();
    const response = await fetch(`${env.LOGTO_ENDPOINT}/api/swagger.json`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    const swaggerFilePath = path.join(__dirname, "swagger.json");
    fs.writeFileSync(swaggerFilePath, JSON.stringify(data));
    const openapiGeneratorCliPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "node_modules/.bin/openapi-generator-cli",
    );
    const generateCommand = `${openapiGeneratorCliPath} generate -i ${swaggerFilePath} -g typescript-axios --additional-properties=supportsES6 --skip-validate-spec -o ${path.join(__dirname, "..", "services", "logto", "sdk")}`;
    exec(generateCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Stdout: ${stdout}`);
    });
  } catch (error) {
    console.error(`Failed to fetch Swagger JSON: ${(error as Error).message}`);
  }
}

generateLogtoAdminSdk();
