import { execFile } from "node:child_process";
import fs from "node:fs";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const localEnvPath = new URL("./.env.local", import.meta.url).pathname;

if (fs.existsSync(localEnvPath)) {
  const envText = fs.readFileSync(localEnvPath, "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.replace(/^"|"$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function generateMessage(configPath, reportDate) {
  const env = {
    ...process.env,
    DRY_RUN: "1",
    REPORT_DATE: reportDate || process.env.REPORT_DATE || ""
  };

  const { stdout } = await execFileAsync(
    "node",
    [
      "outputs/sabian-message-tool/line-delivery/send-daily-line.mjs",
      configPath
    ],
    { env, cwd: process.cwd(), maxBuffer: 1024 * 1024 }
  );

  return stdout.trim();
}

async function postDiscord(text) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL を設定してください。");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: text,
      allowed_mentions: { parse: [] }
    })
  });

  if (!response.ok) {
    throw new Error(`Discord送信に失敗しました: ${response.status} ${await response.text()}`);
  }
}

const configPath = process.argv[2] || "outputs/sabian-message-tool/discord-delivery/discord-config.example.json";
const reportDate = process.env.REPORT_DATE || "";
const text = await generateMessage(configPath, reportDate);

if (process.env.DRY_RUN === "1") {
  console.log(text);
} else {
  await postDiscord(text);
  console.log("Discordに送信しました。");
}
