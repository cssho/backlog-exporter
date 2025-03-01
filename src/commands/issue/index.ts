import {Args, Command, Flags} from '@oclif/core'
import * as dotenv from 'dotenv'

import {downloadIssues} from '../../utils/backlog-api.js'
import {validateAndGetProjectId} from '../../utils/backlog.js'
import {createOutputDirectory, getApiKey} from '../../utils/common.js'

// .envファイルを読み込む
dotenv.config()

export default class DownloadIssue extends Command {
  static args = {
    url: Args.string({description: 'URL to download from', required: false}),
  }
  static description = 'Backlogから課題をダウンロードする'
  static examples = [
    `<%= config.bin %> <%= command.id %> --domain cm1.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./issue-data
BacklogからAPIキーを使用して課題をダウンロードする
`,
  ]
  static flags = {
    apiKey: Flags.string({
      description: 'Backlog API key (環境変数 BACKLOG_API_KEY からも自動読み取り可能)',
      required: false,
    }),
    count: Flags.integer({char: 'c', default: 100, description: '一度に取得する課題数', required: false}),
    domain: Flags.string({description: 'Backlog domain (e.g. example.backlog.jp)', required: true}),
    output: Flags.string({
      char: 'o',
      default: './backlog-issues',
      description: '出力ディレクトリパス',
      required: false,
    }),
    projectIdOrKey: Flags.string({description: 'Backlog project ID or key', required: true}),
    statusId: Flags.string({description: 'Filter issues by status ID', required: false}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(DownloadIssue)

    const {count, domain, output: outputDir, projectIdOrKey, statusId} = flags
    const apiKey = getApiKey(this, flags.apiKey)

    this.log(`Backlogから ${domain} のプロジェクト ${projectIdOrKey} の課題を取得しています...`)

    try {
      // プロジェクトキーからプロジェクトIDを取得
      const projectId = await validateAndGetProjectId(domain, projectIdOrKey, apiKey)
      this.log(`プロジェクトID: ${projectId} を使用します`)

      // 出力ディレクトリの作成
      await createOutputDirectory(outputDir)

      // 課題のダウンロード
      await downloadIssues(this, domain, projectId, apiKey, outputDir, count, statusId)

      this.log('ダウンロードが完了しました！')
    } catch (error) {
      this.error(`ダウンロードに失敗しました: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
