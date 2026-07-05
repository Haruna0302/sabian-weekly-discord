# Discord Daily Delivery

サビアン週報を毎日Discordへ届けるためのひな形です。

## 必要なもの

- 投稿先DiscordチャンネルのWebhook URL

Discordのチャンネル設定からWebhookを作成し、そのURLを使います。

## 設定

`discord-config.example.json` に出生情報を入れます。

Webhook URLは秘密情報なので、ファイルには書かず実行時に環境変数で渡します。

```bash
export DISCORD_WEBHOOK_URL="DiscordのWebhook URL"
```

または、このフォルダに `.env.local` を作って保存できます。`.env.local` は `.gitignore` に入れてあります。

```bash
DISCORD_WEBHOOK_URL="DiscordのWebhook URL"
```

## テスト表示

Discordへ送らず、本文だけ確認します。

```bash
DRY_RUN=1 node outputs/sabian-message-tool/discord-delivery/send-daily-discord.mjs outputs/sabian-message-tool/discord-delivery/discord-config.example.json
```

## 実際にDiscordへ送る

```bash
node outputs/sabian-message-tool/discord-delivery/send-daily-discord.mjs outputs/sabian-message-tool/discord-delivery/discord-config.example.json
```

毎日送る場合は、このコマンドを朝の決まった時間に実行する自動化へ登録します。
