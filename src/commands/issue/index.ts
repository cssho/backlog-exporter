import {Command, Flags} from '@oclif/core'
import * as dotenv from 'dotenv'

import {downloadIssues} from '../../utils/backlog-api.js'
import {validateAndGetProjectId} from '../../utils/backlog.js'
import {createOutputDirectory, getApiKey} from '../../utils/common.js'
import {FolderType, updateSettings} from '../../utils/settings.js'

// .envファイルを読み込む
dotenv.config()

export default class Issue extends Command {
  static description = 'Backlogから課題を取得してMarkdownファイルとして保存する'
  static examples = [
    `<%= config.bin %> <%= command.id %> --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY
課題をMarkdownファイルとして保存する
`,
    `<%= config.bin %> <%= command.id %> --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./my-project
指定したディレクトリに課題を保存する
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
    const {flags} = await this.parse(Issue)

    try {
      const {domain, projectIdOrKey} = flags
      const apiKey = flags.apiKey || getApiKey(this)
      const outputDir = flags.output || './issues'

      // 出力ディレクトリの作成
      await createOutputDirectory(outputDir)

      // プロジェクトキーからプロジェクトIDを取得
      const projectId = await validateAndGetProjectId(domain, projectIdOrKey, apiKey)
      this.log(`プロジェクトID: ${projectId} を使用します`)

      // 課題の取得と保存
      await downloadIssues(this, {
        apiKey,
        count: 100,
        domain,
        outputDir,
        projectId,
      })

      // 設定ファイルを保存
      await updateSettings(outputDir, {
        apiKey,
        domain,
        folderType: FolderType.ISSUE,
        lastUpdated: new Date().toISOString(),
        outputDir,
        projectIdOrKey,
      })

      this.log('課題の取得が完了しました！')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.error(`課題の取得に失敗しました: ${errorMessage}`)
    }
  }
}
