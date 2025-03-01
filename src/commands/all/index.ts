import {Args, Command, Flags} from '@oclif/core'
import * as dotenv from 'dotenv'
import path from 'node:path'

import {downloadIssues, downloadWikis} from '../../utils/backlog-api.js'
import {validateAndGetProjectId} from '../../utils/backlog.js'
import {createOutputDirectory, getApiKey} from '../../utils/common.js'

// .envファイルを読み込む
dotenv.config()

export default class DownloadAll extends Command {
  static args = {
    url: Args.string({description: 'URL to download from', required: false}),
  }
  static description = 'Backlogからissueとwikiを同時に取得する'
  static examples = [
    `<%= config.bin %> <%= command.id %> --domain cm1.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY -o ./output-dir
BacklogからAPIキーを使用してissueとwikiを同時に取得する
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
      description: '出力ディレクトリのルートパス（デフォルトはプロジェクトキー）',
      required: false,
    }),
    projectIdOrKey: Flags.string({description: 'Backlog project ID or key', required: true}),
    statusId: Flags.string({description: 'Filter issues by status ID', required: false}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(DownloadAll)

    const {count, domain, projectIdOrKey, statusId} = flags
    const apiKey = getApiKey(this, flags.apiKey)

    // 出力ディレクトリのルートパスを設定（デフォルトはプロジェクトキー）
    const outputRoot = flags.output || projectIdOrKey

    this.log(`Backlogから ${domain} のプロジェクト ${projectIdOrKey} の課題とWikiを取得しています...`)
    this.log(`出力ディレクトリ: ${outputRoot}`)

    try {
      // プロジェクトキーからプロジェクトIDを取得
      const projectId = await validateAndGetProjectId(domain, projectIdOrKey, apiKey)
      this.log(`プロジェクトID: ${projectId} を使用します`)

      // issueとwikiのサブディレクトリパスを作成
      const issueOutput = path.join(outputRoot, 'issues')
      const wikiOutput = path.join(outputRoot, 'wiki')

      // 出力ディレクトリの作成
      await createOutputDirectory(outputRoot)
      await createOutputDirectory(issueOutput)
      await createOutputDirectory(wikiOutput)

      // 課題とWikiを並列で取得
      await Promise.all([
        downloadIssues(this, domain, projectId, apiKey, issueOutput, count, statusId),
        downloadWikis(this, domain, projectIdOrKey, apiKey, wikiOutput),
      ])

      this.log('すべてのダウンロードが完了しました！')
    } catch (error) {
      this.error(`ダウンロードに失敗しました: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
