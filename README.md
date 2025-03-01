# backlog-exporter

Backlog のデータをエクスポートするためのコマンドラインツール

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/backlog-exporter.svg)](https://npmjs.org/package/backlog-exporter)
[![Downloads/week](https://img.shields.io/npm/dw/backlog-exporter.svg)](https://npmjs.org/package/backlog-exporter)

<!-- toc -->
* [backlog-exporter](#backlog-exporter)
* [概要](#概要)
* [インストール](#インストール)
* [コマンド](#コマンド)
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
backlog-exporter/0.0.3 linux-x64 node-v20.18.3
$ backlog-exporter --help [COMMAND]
USAGE
  $ backlog-exporter COMMAND
...
```
<!-- usagestop -->

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
