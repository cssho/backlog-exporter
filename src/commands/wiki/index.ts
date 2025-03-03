import {Command, Flags} from '@oclif/core'
import * as dotenv from 'dotenv'

import {downloadWikis} from '../../utils/backlog-api.js'
import {createOutputDirectory, getApiKey} from '../../utils/common.js'
import {FolderType, updateSettings} from '../../utils/settings.js'

// .envファイルを読み込む
dotenv.config()

export default class Wiki extends Command {
  static description = 'Backlogから Wiki を取得してMarkdownファイルとして保存する'
  static examples = [
    `<%= config.bin %> <%= command.id %> --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY
Wikiをダウンロードする
`,
    `<%= config.bin %> <%= command.id %> --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./my-project
指定したディレクトリにWikiを保存する
`,
  ]
  static flags = {
    apiKey: Flags.string({
      description: 'Backlog API key (環境変数 BACKLOG_API_KEY からも自動読み取り可能)',
      required: false,
    }),
    domain: Flags.string({
      description: 'Backlog domain (e.g. example.backlog.jp)',
      required: true,
    }),
    output: Flags.string({
      char: 'o',
      description: '出力ディレクトリパス',
      required: false,
    }),
    projectIdOrKey: Flags.string({
      description: 'Backlog project ID or key',
      required: true,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Wiki)

    try {
      const {domain, projectIdOrKey} = flags
      const apiKey = flags.apiKey || getApiKey(this)
      const outputDir = flags.output || './wiki'

      // 出力ディレクトリの作成
      await createOutputDirectory(outputDir)

      // Wikiの取得と保存
      await downloadWikis(this, domain, projectIdOrKey, apiKey, outputDir)

      // 設定ファイルを保存
      await updateSettings(outputDir, {
        apiKey,
        domain,
        folderType: FolderType.WIKI,
        lastUpdated: new Date().toISOString(),
        outputDir,
        projectIdOrKey,
      })

      this.log('Wikiの取得が完了しました！')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.error(`Wikiの取得に失敗しました: ${errorMessage}`)
    }
  }
}
