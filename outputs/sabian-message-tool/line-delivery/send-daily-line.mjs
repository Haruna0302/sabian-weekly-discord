import fs from "node:fs";

const signs = [
  { name: "牡羊座", seed: "始まりを恐れず、まだ形のない衝動に命を与える", mode: "自分から火を灯す" },
  { name: "牡牛座", seed: "感覚を信じ、価値あるものをゆっくり育てる", mode: "身体の納得を待つ" },
  { name: "双子座", seed: "言葉と好奇心で世界を結び直す", mode: "軽やかに試して学ぶ" },
  { name: "蟹座", seed: "心の居場所を守り、深い安心から動き出す", mode: "大切なものを包む" },
  { name: "獅子座", seed: "自分の中心から表現し、周囲に熱を灯す", mode: "喜びを隠さず示す" },
  { name: "乙女座", seed: "小さな整えを積み重ね、混沌に役割を与える", mode: "具体的に整える" },
  { name: "天秤座", seed: "関係性の鏡を通して、美しい均衡を見つける", mode: "対話で調律する" },
  { name: "蠍座", seed: "本音の奥へ潜り、古い殻を脱いで再生する", mode: "深く選び抜く" },
  { name: "射手座", seed: "遠くの意味を目指し、経験を智慧へ変える", mode: "視野を広げる" },
  { name: "山羊座", seed: "時間を味方にして、理想を現実の骨組みにする", mode: "責任を形にする" },
  { name: "水瓶座", seed: "自由な視点で常識をほどき、未来の形を招く", mode: "距離をとって眺める" },
  { name: "魚座", seed: "境界をやわらげ、見えないつながりに耳を澄ます", mode: "感じたものを祈りや表現に変える" }
];

const sabianSymbols = {
  "牡羊座28": "大きな失望した観客",
  "蟹座9": "水の中の魚へと手を伸ばす小さな裸の少女",
  "蟹座10": "カットされる途中の大きなダイヤモンド",
  "蟹座11": "有名人を風刺するピエロ",
  "蟹座12": "偉大な教師の生まれ変わりを示すオーラを持つ赤ん坊に授乳する中国人の女性",
  "蟹座13": "少し曲げられた手と、とても目立つ親指",
  "蟹座14": "北東の大きな暗い空間に向き合う、とても年老いた男",
  "蟹座15": "食べすぎて楽しんだ人々の集まり",
  "山羊座10": "手から餌をもらうアホウドリ",
  "山羊座22": "敗北を潔く受け入れる将軍",
  "水瓶座4": "ヒンドゥーの癒やし手",
  "水瓶座16": "机に向かう大きなビジネスマン",
  "水瓶座29": "さなぎから出てくる蝶",
  "魚座11": "光明を求めて狭い道を進む人々",
  "魚座12": "新参者たちの試験",
  "魚座24": "人の住んでいる島"
};

const dayThemes = ["受け取る", "整える", "試す", "深める", "話す", "選ぶ", "次へ渡す"];
const weekday = ["日", "月", "火", "水", "木", "金", "土"];

const toneMap = {
  gentle: {
    action: "無理に答えを出さず、心と身体が少し楽になる方を選んでください。"
  },
  clear: {
    action: "全部を背負わず、今日扱うものをひとつに絞ってください。"
  },
  mystic: {
    action: "見えない合図を、あなたを苦しくしない日常の一手へ降ろしてください。"
  }
};

const lifeEaseGuides = {
  "牡羊座": {
    permission: "すぐに強くならなくても、最初の一歩だけで十分です",
    boundary: "反射的に引き受ける前に、自分の熱が本当に向いているかを確認する",
    care: "短く動いて、短く休む"
  },
  "牡牛座": {
    permission: "急かされても、自分の感覚が納得する速度で大丈夫です",
    boundary: "心地よさを削ってまで期待に合わせない",
    care: "五感が落ち着くものに触れる"
  },
  "双子座": {
    permission: "ひとつに決めきる前に、試して知る時間があって大丈夫です",
    boundary: "考えすぎて疲れたら、情報を増やすより会話を減らす",
    care: "短い言葉で今の気持ちをメモする"
  },
  "蟹座": {
    permission: "守りたいものがあるからこそ、距離を置く選択も愛情です",
    boundary: "相手の感情を全部自分の責任にしない",
    care: "安心できる場所や人に戻る時間を作る"
  },
  "獅子座": {
    permission: "注目されるためではなく、自分の喜びのために表現して大丈夫です",
    boundary: "期待される役を演じ続けない",
    care: "好きだと思えることを小さく見せる"
  },
  "乙女座": {
    permission: "完璧に整う前でも、今のまま役に立てます",
    boundary: "直すべきものを探し続けて自分を消耗させない",
    care: "机、予定、持ち物のどれかひとつだけ整える"
  },
  "天秤座": {
    permission: "相手を大切にしながら、自分の本音も同じ重さで置いて大丈夫です",
    boundary: "場の空気を保つために、自分の違和感をなかったことにしない",
    care: "迷ったら、静かな場所で自分の答えを先に聞く"
  },
  "蠍座": {
    permission: "深く感じることは重さではなく、真実を選ぶ力です",
    boundary: "全部を打ち明ける相手と、まだ守っておく領域を分ける",
    care: "ひとりで深呼吸できる時間を確保する"
  },
  "射手座": {
    permission: "意味を探す旅の途中でも、今ここで休んで大丈夫です",
    boundary: "遠くの理想のために、今の身体の声を後回しにしない",
    care: "外に出る、学ぶ、視界を広げる"
  },
  "山羊座": {
    permission: "成果を出していない時間にも、あなたの価値はあります",
    boundary: "責任感だけで予定を詰めすぎない",
    care: "終わらせることをひとつ決める"
  },
  "水瓶座": {
    permission: "人と同じ感じ方をしなくても、あなたの視点はちゃんと必要です",
    boundary: "分かってもらうために自分を薄めすぎない",
    care: "距離を取って、全体像を眺め直す"
  },
  "魚座": {
    permission: "感じすぎる自分を直さなくて大丈夫です",
    boundary: "人の痛みや期待を、全部自分の中に入れない",
    care: "感じたものを言葉、音、絵、祈り、休息のどれかに逃がす"
  }
};

const norm = (n) => ((n % 360) + 360) % 360;
const degToRad = (n) => n * Math.PI / 180;
const radToDeg = (n) => n * 180 / Math.PI;
const pad = (n) => String(n).padStart(2, "0");

function formatDateJst(date) {
  const jst = new Date(date.getTime() + 9 * 3600000);
  return `${jst.getUTCFullYear()}-${pad(jst.getUTCMonth() + 1)}-${pad(jst.getUTCDate())}`;
}

function localDateTimeToUtc(dateValue, timeValue) {
  const [y, m, d] = dateValue.split("-").map(Number);
  const [hh, mm] = (timeValue || "12:00").split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh - 9, mm || 0, 0));
}

function reportDateToUtcNoon(dateValue) {
  const [y, m, d] = dateValue.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 3, 0, 0));
}

function julianDay(date) {
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}

function sunLongitude(date) {
  const jd = julianDay(date);
  const t = (jd - 2451545.0) / 36525;
  const l0 = norm(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  const m = norm(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const c = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(degToRad(m))
    + (0.019993 - 0.000101 * t) * Math.sin(degToRad(2 * m))
    + 0.000289 * Math.sin(degToRad(3 * m));
  const omega = 125.04 - 1934.136 * t;
  return norm(l0 + c - 0.00569 - 0.00478 * Math.sin(degToRad(omega)));
}

function moonLongitude(date) {
  const jd = julianDay(date);
  const d = jd - 2451545.0;
  const l = norm(218.316 + 13.176396 * d);
  const mMoon = norm(134.963 + 13.064993 * d);
  const mSun = norm(357.529 + 0.98560028 * d);
  const elong = norm(297.850 + 12.190749 * d);
  return norm(l
    + 6.289 * Math.sin(degToRad(mMoon))
    + 1.274 * Math.sin(degToRad(2 * elong - mMoon))
    + 0.658 * Math.sin(degToRad(2 * elong))
    + 0.214 * Math.sin(degToRad(2 * mMoon))
    - 0.186 * Math.sin(degToRad(mSun)));
}

function symbolFromLongitude(longitude) {
  const lon = norm(longitude);
  const signIndex = Math.floor(lon / 30);
  const degreeFloat = lon - signIndex * 30;
  const degree = Math.floor(degreeFloat) + 1;
  const sign = signs[signIndex];
  const image = sabianSymbols[`${sign.name}${degree}`] || "サビアンシンボル未登録";
  return {
    lon,
    sign,
    degree,
    label: `${sign.name}${degree}度`,
    full: image === "サビアンシンボル未登録" ? `${sign.name}${degree}度（シンボル未登録）` : `${sign.name}${degree}度「${image}」`,
    image
  };
}

function angleBetween(a, b) {
  const diff = Math.abs(norm(a - b));
  return diff > 180 ? 360 - diff : diff;
}

function relationship(natal, transit) {
  const diff = angleBetween(natal.lon, transit.lon);
  if (diff < 8) return "出生の核と今の空が重なり、自分の原点を更新するタイミング";
  if (Math.abs(diff - 60) < 8) return "自然に流れがつながり、協力や追い風を受け取りやすいタイミング";
  if (Math.abs(diff - 90) < 8) return "違和感が行動を促し、古い癖を調整するタイミング";
  if (Math.abs(diff - 120) < 8) return "持ち味が素直に出やすく、才能を使いやすいタイミング";
  if (Math.abs(diff - 180) < 8) return "他者や現実の反応を通して、自分の輪郭を見直すタイミング";
  return "小さな気づきを拾いながら、今の流れに自分の核をなじませるタイミング";
}

function dailyMessage(config, dateValue) {
  const tone = toneMap[config.tone] || toneMap.mystic;
  const name = config.name ? `${config.name}さん` : "あなた";
  const birthUtc = localDateTimeToUtc(config.birthdate, config.birthtime);
  const natalSun = symbolFromLongitude(sunLongitude(birthUtc));
  const guide = lifeEaseGuides[natalSun.sign.name];
  const date = reportDateToUtcNoon(dateValue);
  const local = new Date(date.getTime() + 9 * 3600000);
  const sun = symbolFromLongitude(sunLongitude(date));
  const moon = symbolFromLongitude(moonLongitude(date));
  const start = reportDateToUtcNoon(config.weekStartDate || dateValue);
  const dayIndex = Math.max(0, Math.floor((date - start) / 86400000)) % 7;
  const dayTheme = dayThemes[dayIndex];
  const focusByDay = [
    `今日はまず「${guide.permission}」という前提に戻る日です。`,
    `今日は境界線を整える日です。${guide.boundary}ことが、生きやすさの土台になります。`,
    "今日は小さく試す日です。正解を当てに行くより、少し楽になる選択をひとつ実験してください。",
    `今日は深く感じる日です。感じたことをすぐ結論にせず、${guide.care}ことで流れを逃がしてください。`,
    "今日は人との間で調整する日です。言葉にするなら、説明よりも「私はこう感じている」から始めてください。",
    "今日は選び直す日です。期待に合わせるより、今の暮らし方や自分の扱い方が少し楽になる方を選んでください。",
    "今日は次へ渡す日です。できなかったことより、今週少しでも楽になった扱い方をひとつ残してください。"
  ];
  const dateLabel = `${local.getUTCMonth() + 1}/${local.getUTCDate()} (${weekday[local.getUTCDay()]})`;
  const body = `${dateLabel}のサビアン週報\n\n${name}の出生太陽：${natalSun.full}\n今日の太陽：${sun.full}\n今日の月：${moon.full}\n\n${dayTheme}日。\n出生太陽は、${natalSun.sign.seed}ための核です。${relationship(natalSun, sun)}です。\n\n${focusByDay[dayIndex]}\n月の象徴「${moon.image}」は、その日の感情の入口。\n${tone.action}`;
  return body;
}

async function pushLine(text) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_TO_ID;
  if (!token || !to) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN と LINE_TO_ID を設定してください。");
  }

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

const configPath = process.argv[2] || new URL("./line-config.example.json", import.meta.url).pathname;
const dateValue = process.env.REPORT_DATE || formatDateJst(new Date());
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const text = dailyMessage(config, dateValue);

if (process.env.DRY_RUN === "1") {
  console.log(text);
} else {
  await pushLine(text);
  console.log(`LINEに送信しました: ${dateValue}`);
}
