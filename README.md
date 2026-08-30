# tinygo-conf

TinyGo Conference 公式サイト (https://conf.tinygo-keeb.org) のリポジトリです。

## このリポジトリで管理しているもの

- `CNAME` (カスタムドメイン `conf.tinygo-keeb.org`)
- TinyGo Conference 2025 のページ (`./2025`)
- TinyGo Conference 2026 のページ (`./2026`)
- 開催するなら 2027 以降のページも同様に年度ディレクトリを追加して管理する

## 本番ページ

本番は https://conf.tinygo-keeb.org で公開されており、ルートの `index.html` / `redirect.js` によって、
その時点で最新の conf のページ (現在は `./2026`) にリダイレクトされます。

## 開発

年度ディレクトリに移動してから静的サーバーを起動し、ブラウザで確認します。

```sh
cd ./2026
python -m http.server 8888
```

http://localhost:8888/ で表示できます。
