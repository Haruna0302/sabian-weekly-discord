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
  "牡羊座7": "二つの領域でうまく自己表現している男",
  "牡羊座20": "冬に鳥に餌をやる若い少女",
  "牡牛座4": "虹のたもとの金の壺",
  "牡牛座18": "日光の差し込む窓から古いバッグを外へ出している女性",
  "双子座3": "パリのチュイルリー庭園",
  "牡羊座28": "大きな失望した観客",
  "蟹座9": "水の中の魚へと手を伸ばす小さな裸の少女",
  "蟹座10": "カットされる途中の大きなダイヤモンド",
  "蟹座11": "有名人を風刺するピエロ",
  "蟹座12": "偉大な教師の生まれ変わりを示すオーラを持つ赤ん坊に授乳する中国人の女性",
  "蟹座13": "少し曲げられた手と、とても目立つ親指",
  "蟹座14": "北東の大きな暗い空間に向き合う、とても年老いた男",
  "蟹座15": "食べすぎて楽しんだ人々の集まり",
  "蟹座16": "古い本を手に、目の前の曼荼羅を研究している男",
  "蟹座17": "ひとつの原型から多様な可能性が展開していく",
  "蟹座18": "ひよこのために土をほじくる雌鳥",
  "蟹座19": "結婚の儀式を執り行う司祭",
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
    action: "今日の合言葉は「少し楽になる方」です。大きな決断より、朝の支度、返信の量、予定の入れ方をひとつ軽くしてください。"
  },
  clear: {
    action: "今日の合言葉は「ひとつに絞る」です。全部を整えようとせず、連絡、片付け、仕事、体調のうち一番気になるものだけ扱ってください。"
  },
  mystic: {
    action: "今日の合言葉は「感じたことを生活に戻す」です。胸のざわつきは、予定を詰めすぎない、言葉を選ぶ、早めに休む、のどれかに変えてください。"
  }
};

const symbolPractices = {
  "牡羊座7": {
    image: "二つの場所で自分を表現している人",
    use: "仕事の顔と素の顔、外向きの言葉と内側の本音を両方扱う",
    action: "今日は相手に合わせる言葉と、自分を守る本音を分けてメモしてから話す",
    avoid: "どちらか一方の自分だけを正解にして、もう一方を消すこと"
  },
  "牡羊座20": {
    image: "寒い季節に小さな鳥へ餌を渡す少女",
    use: "弱っているもの、小さな望み、まだ育ちきらない気持ちを守る",
    action: "自分の中の小さな希望に、温かい飲み物、短い休憩、やさしい言葉をひとつ渡す",
    avoid: "まだ小さい願いを、役に立たないものとして切り捨てること"
  },
  "牡牛座4": {
    image: "虹の終わりに見える金の壺",
    use: "遠くの理想を、手に触れられる楽しみや価値へつなげる",
    action: "欲しい未来をひとつ選び、今日買うもの、食べるもの、整える場所に小さく反映する",
    avoid: "夢を見るだけで、今日の身体や財布や時間を置き去りにすること"
  },
  "牡牛座18": {
    image: "古いバッグを日の当たる窓へ出す女性",
    use: "しまい込んだ記憶や持ち物に風を通し、今の自分に合う形へ戻す",
    action: "バッグ、引き出し、スマホの中など、古いものが溜まった場所をひとつだけ開ける",
    avoid: "昔の重さを、今も同じように持ち歩くこと"
  },
  "双子座3": {
    image: "整えられた美しい庭園",
    use: "情報や会話を、散らかったままにせず見通しよく並べる",
    action: "今日の予定や連絡を、見える場所に短く並べて優先順位をつける",
    avoid: "全部を同じ重要度で抱えて、頭の中だけで処理しようとすること"
  },
  "牡羊座28": {
    image: "期待していた反応が返ってこない場面",
    use: "がっかりした気持ちを否定せず、次に見せる相手や場所を選び直す",
    action: "反応待ちのことをひとつ手放し、自分でできる次の一手を小さく進める",
    avoid: "落胆した勢いで、自分の価値まで下げて考えること"
  },
  "蟹座9": {
    image: "水の中の魚に、そっと手を伸ばす少女",
    use: "まだ言葉にならない気持ちを、急いでつかまえず近くで感じる",
    action: "人の本音を決めつける前に、お茶を飲む、深呼吸する、短く聞く、の順で近づく",
    avoid: "相手の気持ちを全部救おうとして、自分の安心を置き去りにすること"
  },
  "蟹座10": {
    image: "少しずつ形を整えられていくダイヤモンド",
    use: "大切なものほど、一度に完成させず細部を磨く",
    action: "文章、部屋、予定、身だしなみのどれかを10分だけ整える",
    avoid: "完璧にできないなら意味がない、と途中の磨きを止めること"
  },
  "蟹座11": {
    image: "有名人を風刺するピエロ",
    use: "重くなった空気を、少し距離を置いた視点で見直す",
    action: "深刻に考えすぎていることを、信頼できる人に軽く話してみる",
    avoid: "本当は傷ついているのに、冗談だけで済ませること"
  },
  "蟹座12": {
    image: "特別な気配を持つ赤ん坊を育てる人",
    use: "まだ小さい可能性を、急がせず守って育てる",
    action: "始めたばかりのことを人に評価させる前に、自分の手元で少し育てる",
    avoid: "芽が出たばかりのものを、早すぎる結果で判断すること"
  },
  "蟹座13": {
    image: "小さな手の動きと目立つ親指",
    use: "小さな意思表示で、自分の輪郭を戻す",
    action: "今日は「大丈夫です」「少し待ってください」など短い返事をはっきり使う",
    avoid: "嫌ではないふりをして、あとから苦しくなること"
  },
  "蟹座14": {
    image: "暗い空間を静かに見つめる年老いた人",
    use: "不安をすぐ明るくしようとせず、静かに観察する",
    action: "答えが出ないことはメモに置き、今日は睡眠、食事、入浴など身体の安心を優先する",
    avoid: "先が見えない不安を、無理な予定や連絡で埋めること"
  },
  "蟹座15": {
    image: "満たされすぎた集まり",
    use: "人との時間を楽しみつつ、入りすぎたものを調整する",
    action: "食べ物、情報、会話、買い物のうち多すぎるものをひとつ減らす",
    avoid: "楽しい雰囲気に合わせて、自分の限界を超えること"
  },
  "蟹座16": {
    image: "古い本を頼りに曼荼羅を読み解く人",
    use: "ばらばらに見える出来事の中に、繰り返し現れる形を見つける",
    action: "気になる出来事を三つ書き出し、共通している感情や望みをひとつ探す",
    avoid: "意味を急いで決めつけて、今見えている小さな手がかりを飛ばすこと"
  },
  "蟹座17": {
    image: "ひとつの種からいくつもの可能性が広がる様子",
    use: "今は小さな始まりでも、いくつかの道に育つ余白を残す",
    action: "予定やアイデアを一択に絞りすぎず、A案とB案を両方メモしておく",
    avoid: "早く決めなきゃと思って、育つ前の可能性を摘み取ること"
  },
  "蟹座18": {
    image: "ひよこのために土をほじくる雌鳥",
    use: "大切なものを守るために、身近なところから必要な栄養を探す",
    action: "家、食事、休憩、身近な人への連絡など、足元のケアをひとつ先に済ませる",
    avoid: "遠くの不安ばかり見て、今日の生活の土台を後回しにすること"
  },
  "蟹座19": {
    image: "結婚の儀式を執り行う司祭",
    use: "自分と誰か、自分と仕事、自分と暮らしの間で約束を結び直す",
    action: "続けたい関係や習慣に対して、今日守れる小さな約束をひとつ決める",
    avoid: "本心が追いつかない約束を、空気だけで受け入れること"
  },
  "山羊座10": {
    image: "手から餌をもらう鳥",
    use: "頼ること、頼られることの距離感を整える",
    action: "助けを求めるなら具体的にひとつだけ頼み、引き受けるなら範囲を決める",
    avoid: "感謝されたい気持ちで、必要以上に背負うこと"
  },
  "山羊座22": {
    image: "敗北を受け入れる将軍",
    use: "うまくいかなかったことを責めず、次の作戦に変える",
    action: "今日はひとつだけ撤退ラインを決め、無理な予定や役割を減らす",
    avoid: "負けを認めたら終わりだと思い込むこと"
  },
  "水瓶座4": {
    image: "静かに癒やす人",
    use: "人と同じやり方でなくても、自分に効く整え方を選ぶ",
    action: "音、香り、ストレッチ、散歩など、自分の回復方法をひとつ使う",
    avoid: "普通はこうする、に合わせて回復の仕方まで我慢すること"
  },
  "水瓶座16": {
    image: "机に向かう大きなビジネスマン",
    use: "大きな視点で、今日の段取りを組み直す",
    action: "朝のうちに、今日やることを3つまでに絞って順番を決める",
    avoid: "全体を見ないまま、目の前の用事に追われ続けること"
  },
  "水瓶座29": {
    image: "殻から出てくる蝶",
    use: "古い役割から少し抜けて、新しい姿を試す",
    action: "いつもの自分なら選ばない服、言葉、順番をひとつだけ試す",
    avoid: "変わりたいのに、前の自分を安心材料にしすぎること"
  },
  "魚座11": {
    image: "光を探して狭い道を進む人々",
    use: "小さな希望を頼りに、道幅を狭くして進む",
    action: "今日は目標を大きく広げず、今の自分が通れる細い道をひとつ選ぶ",
    avoid: "全員に分かってもらえる道でないと進めない、と思うこと"
  },
  "魚座12": {
    image: "新しい場所に入るための試験",
    use: "試されている感覚を、否定ではなく通過点として受け取る",
    action: "できる人のふりをするより、分からないことをひとつ確認して次へ進む",
    avoid: "緊張しただけで、自分は向いていないと決めること"
  },
  "魚座24": {
    image: "人が暮らしている島",
    use: "つながりながらも、自分の暮らしの輪郭を守る",
    action: "連絡を返す時間と、ひとりに戻る時間を分けておく",
    avoid: "誰かの波に合わせ続けて、自分の一日を失うこと"
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
    key: `${sign.name}${degree}`,
    label: `${sign.name}${degree}度`,
    full: image === "サビアンシンボル未登録" ? `${sign.name}${degree}度（シンボル未登録）` : `${sign.name}${degree}度「${image}」`,
    image
  };
}

function practiceFor(symbol) {
  return symbolPractices[symbol.key] || {
    image: `${symbol.label}の景色`,
    use: `${symbol.sign.seed}流れを、今日の生活の中で小さく使う`,
    action: `${symbol.sign.mode}ために、予定、言葉、休み方のどれかをひとつ調整する`,
    avoid: "抽象的に考えすぎて、身体が楽になる一手を後回しにすること"
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
  const natalPractice = practiceFor(natalSun);
  const sunPractice = practiceFor(sun);
  const moonPractice = practiceFor(moon);
  const start = reportDateToUtcNoon(config.weekStartDate || dateValue);
  const dayIndex = Math.max(0, Math.floor((date - start) / 86400000)) % 7;
  const dayTheme = dayThemes[dayIndex];
  const focusByDay = [
    `まず「${guide.permission}」という前提に戻る日です。朝の予定を見たら、今日の自分に優しくない用事をひとつ後ろへずらしてください。`,
    `境界線を整える日です。${guide.boundary}ことを、返事の速度、会う時間、引き受ける量で具体的に調整してください。`,
    "小さく試す日です。正解を当てに行くより、少し楽になる選択をひとつ実験してください。たとえば、いつもより短く伝える、先に休む、先に聞く、のどれかです。",
    `深く感じる日です。感じたことをすぐ結論にせず、${guide.care}ことで流れを逃がしてください。気持ちを抱えたまま人に合わせすぎないのがコツです。`,
    "人との間で調整する日です。言葉にするなら、説明よりも「私はこう感じている」から始めてください。相手を変えるより、自分の立ち位置を見えるようにする日です。",
    "選び直す日です。期待に合わせるより、今の暮らし方や自分の扱い方が少し楽になる方を選んでください。迷ったら、今日の夜に疲れが残りにくい方です。",
    "次へ渡す日です。できなかったことより、今週少しでも楽になった扱い方をひとつ残してください。来週の自分に渡すメモを一行だけ書くのも向いています。"
  ];
  const dateLabel = `${local.getUTCMonth() + 1}/${local.getUTCDate()} (${weekday[local.getUTCDay()]})`;
  const body = `${dateLabel}のサビアン週報

読む前提
${name}の出生太陽：${natalSun.full}
これは「${natalPractice.image}」のように、${natalPractice.use}力です。がんばり方を増やすためではなく、${name}が生きやすい場所へ戻るための土台として読みます。

今日の空
太陽：${sun.full}
月：${moon.full}

今日の流れ
今日は「${dayTheme}」の日。
出生太陽と今日の太陽の関係は、${relationship(natalSun, sun)}です。

太陽の使い方
今日の太陽は「${sunPractice.image}」の景色です。
外側の流れとしては、${sunPractice.use}ことが助けになります。
具体的には、${sunPractice.action}。

月の使い方
今日の月は「${moonPractice.image}」の景色です。
感情の入口としては、${moonPractice.use}ことが起こりやすい日です。
気持ちが揺れたら、${moonPractice.action}。

生きやすさの一手
${focusByDay[dayIndex]}
${tone.action}

今日やること
${sunPractice.action}。

やらなくていいこと
${moonPractice.avoid}。`;
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
