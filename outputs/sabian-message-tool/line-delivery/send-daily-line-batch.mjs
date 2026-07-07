import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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

function validateUser(user, index) {
  const label = user.name || `users[${index}]`;
  for (const key of ["lineToId", "birthdate", "birthtime"]) {
    if (!user[key]) throw new Error(`${label} の ${key} が未設定です。`);
  }
}

async function generateMessage(user, reportDate) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sabian-line-user-"));
  const tempConfigPath = path.join(tempDir, "line-config.json");
  const { lineToId, ...messageConfig } = user;
  fs.writeFileSync(tempConfigPath, JSON.stringify(messageConfig, null, 2));

  try {
    const env = {
      ...process.env,
      DRY_RUN: "1",
      REPORT_DATE: reportDate || process.env.REPORT_DATE || ""
    };

    const { stdout } = await execFileAsync(
      "node",
      [
        "outputs/sabian-message-tool/line-delivery/send-daily-line.mjs",
        tempConfigPath
      ],
      { env, cwd: process.cwd(), maxBuffer: 1024 * 1024 }
    );

    return stdout.trim();
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function validateMessage(text, user) {
  if (!text || text.length < 80) {
    throw new Error(`${user.name || user.lineToId} の本文が短すぎるため、送信を止めました。`);
  }
  if (text.includes("undefined") || text.includes("null")) {
    throw new Error(`${user.name || user.lineToId} の本文に不正な値が含まれるため、送信を止めました。`);
  }
}

async function pushLine(to, text) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN を設定してください。");

  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ to, messages: [{ type: "text", text }] })
  });

  if (!response.ok) {
    throw new Error(`LINE送信に失敗しました: ${response.status} ${await response.text()}`);
  }
}

const usersPath = process.argv[2] || new URL("./line-users.example.json", import.meta.url).pathname;
const reportDate = process.env.REPORT_DATE || "";
const data = JSON.parse(fs.readFileSync(usersPath, "utf8"));
const users = data.users || [];

if (!users.length) {
  throw new Error("配信対象ユーザーが登録されていません。");
}

for (const [index, user] of users.entries()) {
  validateUser(user, index);
  const text = await generateMessage(user, reportDate);
  validateMessage(text, user);

  if (process.env.DRY_RUN === "1") {
    console.log(`--- ${user.name || user.lineToId} ---`);
    console.log(text);
    console.log("");
  } else {
    await pushLine(user.lineToId, text);
    console.log(`${user.name || user.lineToId} にLINE送信しました。`);
  }
}
