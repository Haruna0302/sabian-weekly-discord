# GitHub Actionsで毎朝Discordへ送る

この設定は、Macが寝ていてもGitHub側で毎朝8:00頃にDiscordへ投稿するためのものです。

## 1. GitHubにリポジトリを作る

GitHubで新しいリポジトリを作り、このフォルダの中身をアップロードします。

## 2. Webhook URLをSecretに保存する

GitHubのリポジトリ画面で、次を開きます。

`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

名前：

```text
DISCORD_WEBHOOK_URL
```

値：

```text
DiscordのWebhook URL
```

## 3. Actionsを有効化する

`Actions` タブでワークフローを有効化します。

ワークフロー名：

```text
Sabian Discord Daily
```

## 4. テスト実行する

`Actions` → `Sabian Discord Daily` → `Run workflow` を押すと、手動でDiscordへ送れます。

## 配信時間

毎日 08:00 日本時間に実行されます。

GitHub側の都合で、数分遅れることがあります。
