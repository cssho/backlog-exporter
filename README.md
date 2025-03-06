# backlog-exporter

Backlog のデータをエクスポートするためのコマンドラインツール

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/backlog-exporter.svg)](https://npmjs.org/package/backlog-exporter)
[![Downloads/week](https://img.shields.io/npm/dw/backlog-exporter.svg)](https://npmjs.org/package/backlog-exporter)

<!-- toc -->
* [backlog-exporter](#backlog-exporter)
* [概要](#概要)
* [インストール](#インストール)
* [使用方法](#使用方法)
* [課題のエクスポート](#課題のエクスポート)
* [Wikiのエクスポート](#wikiのエクスポート)
* [課題とWikiの一括エクスポート](#課題とwikiの一括エクスポート)
* [データの更新](#データの更新)
* [npxを使った課題のエクスポート](#npxを使った課題のエクスポート)
* [npxを使ったデータの更新](#npxを使ったデータの更新)
* [課題のエクスポート](#課題のエクスポート)
* [基本的な使用方法](#基本的な使用方法)
* [出力先を指定](#出力先を指定)
* [Wiki のエクスポート](#wiki-のエクスポート)
* [基本的な使用方法](#基本的な使用方法)
* [出力先を指定](#出力先を指定)
* [課題と Wiki の一括エクスポート](#課題と-wiki-の一括エクスポート)
* [基本的な使用方法](#基本的な使用方法)
* [出力先を指定](#出力先を指定)
* [データの更新](#データの更新)
* [カレントディレクトリとそのサブディレクトリのデータを更新](#カレントディレクトリとそのサブディレクトリのデータを更新)
* [指定したディレクトリとそのサブディレクトリのデータを更新](#指定したディレクトリとそのサブディレクトリのデータを更新)
* [確認プロンプトをスキップして更新](#確認プロンプトをスキップして更新)
* [課題のみを更新](#課題のみを更新)
* [Wikiのみを更新](#wikiのみを更新)
* [APIキーを指定して更新](#apiキーを指定して更新)
* [コマンド](#コマンド)
* [出力形式](#出力形式)
* [課題のタイトル](#課題のタイトル)
* [Wiki のタイトル](#wiki-のタイトル)
* [その他の特徴](#その他の特徴)
<!-- tocstop -->

# 概要

backlog-exporter は、Backlog のデータをローカルにエクスポートするためのコマンドラインツールです。
現在、以下の機能をサポートしています：

- **課題（Issue）のエクスポート**：Backlog の課題を Markdown ファイルとして保存
- **Wiki 記事のエクスポート**：Backlog の Wiki 記事を Markdown ファイルとして保存
- **一括エクスポート**：課題と Wiki を同時に取得する機能
- **データの更新**：既存のエクスポートデータを最新の状態に更新する機能

# インストール

<!-- usage -->
```sh-session
$ npm install -g backlog-exporter
$ backlog-exporter COMMAND
running command...
$ backlog-exporter (--version)
backlog-exporter/0.2.3 linux-x64 node-v20.18.3
$ backlog-exporter --help [COMMAND]
USAGE
  $ backlog-exporter COMMAND
...
```
<!-- usagestop -->

# 使用方法

backlog-exporter を使用するには、Backlog のドメイン、プロジェクト ID（またはキー）、API キーが必要です。

API キーは以下の方法で指定できます：

1. コマンドラインオプションとして指定
2. 環境変数 `BACKLOG_API_KEY` に設定
3. `.env` ファイルに `BACKLOG_API_KEY=あなたのAPIキー` として設定

## 基本的な使用例

```sh
# 課題のエクスポート
$ backlog-exporter issue --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./issues

# Wikiのエクスポート
$ backlog-exporter wiki --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./wiki

# 課題とWikiの一括エクスポート
$ backlog-exporter all --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./backlog-data

# データの更新
$ backlog-exporter update
```

npx を使用する場合は、コマンドの前に`npx`を付けるだけです：

```sh
# npxを使った課題のエクスポート
$ npx backlog-exporter issue --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./issues

# npxを使ったデータの更新
$ npx backlog-exporter update
```

# 課題のエクスポート

`issue`コマンドを使用すると、Backlog の課題を Markdown ファイルとしてエクスポートできます。

```sh
# 基本的な使用方法
$ backlog-exporter issue --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY

# 出力先を指定
$ backlog-exporter issue --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./issues
```

エクスポートされた課題は、指定したディレクトリ内に Markdown ファイルとして保存されます。ファイル名は課題のキーに基づいて自動的に生成されます。

# Wiki のエクスポート

`wiki`コマンドを使用すると、Backlog の Wiki ページを Markdown ファイルとしてエクスポートできます。

```sh
# 基本的な使用方法
$ backlog-exporter wiki --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY

# 出力先を指定
$ backlog-exporter wiki --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./wiki
```

エクスポートされた Wiki は、指定したディレクトリ内に Markdown ファイルとして保存されます。Wiki の階層構造は保持され、ディレクトリ構造として再現されます。

# 課題と Wiki の一括エクスポート

`all`コマンドを使用すると、課題と Wiki を一度に取得できます。

```sh
# 基本的な使用方法
$ backlog-exporter all --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY

# 出力先を指定
$ backlog-exporter all --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./backlog-data
```

一括エクスポートでは、課題は`issues`ディレクトリに、Wiki は`wiki`ディレクトリに保存されます。

# データの更新

`update`コマンドを使用すると、既存のエクスポートデータを最新の状態に更新できます。このコマンドは、ディレクトリ内の`backlog-settings.json`ファイルを探索し、見つかったディレクトリでデータを更新します。

```sh
# カレントディレクトリとそのサブディレクトリのデータを更新
$ backlog-exporter update

# 指定したディレクトリとそのサブディレクトリのデータを更新
$ backlog-exporter update ./my-project

# 確認プロンプトをスキップして更新
$ backlog-exporter update --force

# 課題のみを更新
$ backlog-exporter update --issuesOnly

# Wikiのみを更新
$ backlog-exporter update --wikisOnly

# APIキーを指定して更新
$ backlog-exporter update --apiKey YOUR_API_KEY
```

更新コマンドは、各ディレクトリの設定ファイルに基づいて、課題や Wiki を自動的に更新します。設定ファイルが見つかったディレクトリでは、そのディレクトリ内のファイルが直接更新されます（サブフォルダは作成されません）。

# コマンド

<!-- commands -->
* [`backlog-exporter help [COMMAND]`](#backlog-exporter-help-command)
* [`backlog-exporter plugins`](#backlog-exporter-plugins)
* [`backlog-exporter plugins add PLUGIN`](#backlog-exporter-plugins-add-plugin)
* [`backlog-exporter plugins:inspect PLUGIN...`](#backlog-exporter-pluginsinspect-plugin)
* [`backlog-exporter plugins install PLUGIN`](#backlog-exporter-plugins-install-plugin)
* [`backlog-exporter plugins link PATH`](#backlog-exporter-plugins-link-path)
* [`backlog-exporter plugins remove [PLUGIN]`](#backlog-exporter-plugins-remove-plugin)
* [`backlog-exporter plugins reset`](#backlog-exporter-plugins-reset)
* [`backlog-exporter plugins uninstall [PLUGIN]`](#backlog-exporter-plugins-uninstall-plugin)
* [`backlog-exporter plugins unlink [PLUGIN]`](#backlog-exporter-plugins-unlink-plugin)
* [`backlog-exporter plugins update`](#backlog-exporter-plugins-update)

## `backlog-exporter help [COMMAND]`

Display help for backlog-exporter.

```
USAGE
  $ backlog-exporter help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for backlog-exporter.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.26/src/commands/help.ts)_

## `backlog-exporter plugins`

List installed plugins.

```
USAGE
  $ backlog-exporter plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ backlog-exporter plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.34/src/commands/plugins/index.ts)_

## `backlog-exporter plugins add PLUGIN`

Installs a plugin into backlog-exporter.

```
USAGE
  $ backlog-exporter plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into backlog-exporter.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the BACKLOG_EXPORTER_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the BACKLOG_EXPORTER_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ backlog-exporter plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ backlog-exporter plugins add myplugin

  Install a plugin from a github url.

    $ backlog-exporter plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ backlog-exporter plugins add someuser/someplugin
```

## `backlog-exporter plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ backlog-exporter plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ backlog-exporter plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.34/src/commands/plugins/inspect.ts)_

## `backlog-exporter plugins install PLUGIN`

Installs a plugin into backlog-exporter.

```
USAGE
  $ backlog-exporter plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into backlog-exporter.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the BACKLOG_EXPORTER_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the BACKLOG_EXPORTER_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ backlog-exporter plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ backlog-exporter plugins install myplugin

  Install a plugin from a github url.

    $ backlog-exporter plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ backlog-exporter plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.34/src/commands/plugins/install.ts)_

## `backlog-exporter plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ backlog-exporter plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ backlog-exporter plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.34/src/commands/plugins/link.ts)_

## `backlog-exporter plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ backlog-exporter plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ backlog-exporter plugins unlink
  $ backlog-exporter plugins remove

EXAMPLES
  $ backlog-exporter plugins remove myplugin
```

## `backlog-exporter plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ backlog-exporter plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.34/src/commands/plugins/reset.ts)_

## `backlog-exporter plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ backlog-exporter plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ backlog-exporter plugins unlink
  $ backlog-exporter plugins remove

EXAMPLES
  $ backlog-exporter plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.34/src/commands/plugins/uninstall.ts)_

## `backlog-exporter plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ backlog-exporter plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ backlog-exporter plugins unlink
  $ backlog-exporter plugins remove

EXAMPLES
  $ backlog-exporter plugins unlink myplugin
```

## `backlog-exporter plugins update`

Update installed plugins.

```
USAGE
  $ backlog-exporter plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.34/src/commands/plugins/update.ts)_
<!-- commandsstop -->

# 出力形式

## 課題の出力形式

課題は以下の形式で Markdown ファイルとして保存されます：

```markdown
# 課題のタイトル

## 基本情報

- 課題キー: PROJ-123
- ステータス: 処理中
- 優先度: 高
- 担当者: 山田太郎
- 作成日時: 2023/01/01 10:00:00
- 更新日時: 2023/01/02 15:30:45
- [Backlog Issue Link](https://example.backlog.jp/view/PROJ-123)

## 詳細

ここに課題の詳細説明が入ります。

## コメント

### コメント 1

- **投稿者**: 佐藤次郎
- **日時**: 2023/01/01 11:15:30

コメントの内容がここに表示されます。

---

### コメント 2

- **投稿者**: 鈴木三郎
- **日時**: 2023/01/02 09:45:12

返信コメントの内容がここに表示されます。
```

## Wiki の出力形式

Wiki は以下の形式で Markdown ファイルとして保存されます：

```markdown
# Wiki のタイトル

[Backlog Wiki Link](https://example.backlog.jp/alias/wiki/12345)

ここに Wiki の本文内容が入ります。
Backlog の書式がそのまま保持されます。
```

# その他の特徴

- **環境変数サポート**: 環境変数 `BACKLOG_API_KEY` を使用して API キーを設定可能
- **自動ディレクトリ作成**: 出力ディレクトリが存在しない場合は自動的に作成
- **並列処理**: 並列処理による高速なダウンロード
- **ファイル名サニタイズ**: ファイル名の自動サニタイズ（不正な文字の除去）
- **階層構造の保持**: Wiki の階層構造を保持したエクスポート
