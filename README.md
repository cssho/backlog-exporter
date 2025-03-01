# backlog-exporter

Backlog のデータをエクスポートするためのコマンドラインツール

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/backlog-exporter.svg)](https://npmjs.org/package/backlog-exporter)
[![Downloads/week](https://img.shields.io/npm/dw/backlog-exporter.svg)](https://npmjs.org/package/backlog-exporter)

<!-- toc -->

- [概要](#概要)
- [インストール](#インストール)
- [使い方](#使い方)
- [コマンド](#コマンド)
<!-- tocstop -->

# 概要

backlog-exporter は、Backlog のデータをローカルにエクスポートするためのコマンドラインツールです。
現在、以下の機能をサポートしています：

- 課題（Issue）のエクスポート：Backlog の課題を Markdown ファイルとして保存
- Wiki 記事のエクスポート：Backlog の Wiki 記事を Markdown ファイルとして保存

# インストール

<!-- usage -->

```sh-session
$ npm install -g backlog-exporter
$ backlog-exporter COMMAND
running command...
$ backlog-exporter (--version)
backlog-exporter/0.0.1 darwin-arm64 node-v20.18.1
$ backlog-exporter --help [COMMAND]
USAGE
  $ backlog-exporter COMMAND
...
```

<!-- usagestop -->

# コマンド

<!-- commands -->

- [`backlog-exporter issue`](#backlog-exporter-issue)
- [`backlog-exporter wiki`](#backlog-exporter-wiki)
- [`backlog-exporter help [COMMAND]`](#backlog-exporter-help-command)

## `backlog-exporter issue`

Backlog から課題をダウンロードします

```
USAGE
  $ backlog-exporter issue [--apiKey <value>] [-c <value>] --domain <value> [-o <value>] --projectIdOrKey <value> [--statusId <value>]

FLAGS
  -c, --count=<value>        [default: 100] 一度に取得する課題数
  -o, --output=<value>       [default: ./backlog-issues] 出力ディレクトリパス
  --apiKey=<value>           Backlog API key (環境変数 BACKLOG_API_KEY からも自動読み取り可能)
  --domain=<value>           (必須) Backlogドメイン (例: example.backlog.jp)
  --projectIdOrKey=<value>   (必須) BacklogプロジェクトIDまたはキー
  --statusId=<value>         ステータスIDによる課題のフィルタリング

DESCRIPTION
  Backlogから課題をダウンロードします

EXAMPLES
  $ backlog-exporter issue --domain cm1.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./issue-data
  Download issues from Backlog using API key
```

## `backlog-exporter wiki`

Backlog の Wiki コンテンツをダウンロードします

```
USAGE
  $ backlog-exporter wiki [--apiKey <value>] --domain <value> [-o <value>] --projectIdOrKey <value>

FLAGS
  -o, --output=<value>       [default: ./backlog-wiki] 出力ディレクトリパス
  --apiKey=<value>           Backlog API key (環境変数 BACKLOG_API_KEY からも自動読み取り可能)
  --domain=<value>           (必須) Backlogドメイン (例: example.backlog.jp)
  --projectIdOrKey=<value>   (必須) BacklogプロジェクトIDまたはキー

DESCRIPTION
  BacklogのWikiコンテンツをダウンロードします

EXAMPLES
  $ backlog-exporter wiki --domain cm1.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./wiki-data
  Download wiki content from Backlog using API key
```

## `backlog-exporter help [COMMAND]`

backlog-exporter のヘルプを表示します。

```
USAGE
  $ backlog-exporter help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  ヘルプを表示するコマンド

FLAGS
  -n, --nested-commands  出力にすべてのネストされたコマンドを含める

DESCRIPTION
  backlog-exporterのヘルプを表示します。
```

<!-- commandsstop -->
