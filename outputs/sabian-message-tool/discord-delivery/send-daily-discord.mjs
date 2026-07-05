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

function validateMessage(text) {
  if (!text || text.length < 80) {
    throw new Error("生成された本文が短すぎるため、Discord送信を止めました。");
  }
  if (text.includes("undefined") || text.includes("null")) {
    throw new Error("生成された本文に不正な値が含まれるため、Discord送信を止めました。");
  }
}

function splitMessage(text) {
  const limit = 1850;
  if (text.length <= limit) return [text];

  const chunks = [];
  let remaining = text;
  while (remaining.length > limit) {
    const slice = remaining.slice(0, limit);
    const breakAt = Math.max(slice.lastIndexOf("\n\n"), slice.lastIndexOf("\n"));
    const cutAt = breakAt > 500 ? breakAt : limit;
    chunks.push(remaining.slice(0, cutAt).trim());
    remaining = remaining.slice(cutAt).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks.map((chunk, index) => chunks.length === 1 ? chunk : `${chunk}\n\n(${index + 1}/${chunks.length})`);
}

async function postDiscord(text) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL を設定してください。");
  }

  const chunks = splitMessage(text);
  for (const chunk of chunks) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: chunk,
        allowed_mentions: { parse: [] }
      })
    });

    if (!response.ok) {
      throw new Error(`Discord送信に失敗しました: ${response.status} ${await response.text()}`);
    }
  }
}

const configPath = process.argv[2] || "outputs/sabian-message-tool/discord-delivery/discord-config.example.json";
const reportDate = process.env.REPORT_DATE || "";
const text = await generateMessage(configPath, reportDate);
validateMessage(text);

if (process.env.DRY_RUN === "1") {
  console.log(text);
} else {
  await postDiscord(text);
  console.log("Discordに送信しました。");
}
