import {Args, Command, Flags} from '@oclif/core'
import * as dotenv from 'dotenv'

import {downloadWikis} from '../../utils/backlog-api.js'
import {createOutputDirectory, getApiKey} from '../../utils/common.js'

// .envファイルを読み込む
dotenv.config()

export default class DownloadWiki extends Command {
  static args = {
    url: Args.string({description: 'URL to download from', required: false}),
  }
  static description = 'BacklogからWikiコンテンツをダウンロードする'
  static examples = [
    `<%= config.bin %> <%= command.id %> --domain cm1.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./wiki-data
BacklogからAPIキーを使用してWikiコンテンツをダウンロードする
`,
  ]
  static flags = {
    apiKey: Flags.string({
      description: 'Backlog API key (環境変数 BACKLOG_API_KEY からも自動読み取り可能)',
      required: false,
    }),
    domain: Flags.string({description: 'Backlog domain (e.g. example.backlog.jp)', required: true}),
    output: Flags.string({char: 'o', default: './backlog-wiki', description: '出力ディレクトリパス', required: false}),
    projectIdOrKey: Flags.string({description: 'Backlog project ID or key', required: true}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(DownloadWiki)

    const {domain, output: outputDir, projectIdOrKey} = flags
    const apiKey = getApiKey(this, flags.apiKey)

    this.log(`Backlogから ${domain} のプロジェクト ${projectIdOrKey} のWikiを取得しています...`)

    try {
      // 出力ディレクトリの作成
      await createOutputDirectory(outputDir)

      // Wikiのダウンロード
      await downloadWikis(this, domain, projectIdOrKey, apiKey, outputDir)

      this.log('ダウンロードが完了しました！')
    } catch (error) {
      this.error(`ダウンロードに失敗しました: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
