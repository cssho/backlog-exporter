import {Command, Flags} from '@oclif/core'
import * as dotenv from 'dotenv'
import path from 'node:path'

import {downloadIssues, downloadWikis} from '../../utils/backlog-api.js'
import {validateAndGetProjectId} from '../../utils/backlog.js'
import {createOutputDirectory, getApiKey} from '../../utils/common.js'
import {FolderType, updateSettings} from '../../utils/settings.js'

// .envファイルを読み込む
dotenv.config()

export default class All extends Command {
  static description = 'Backlogから課題とWikiを取得してMarkdownファイルとして保存する'
  static examples = [
    `<%= config.bin %> <%= command.id %> --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY
課題とWikiをMarkdownファイルとして保存する
`,
    `<%= config.bin %> <%= command.id %> --domain example.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./my-project
指定したディレクトリに課題とWikiを保存する
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
    const {flags} = await this.parse(All)

    try {
      const {domain, projectIdOrKey} = flags
      const apiKey = flags.apiKey || getApiKey(this)
      const outputRoot = flags.output || './backlog-data'

      // 出力ディレクトリの作成
      await createOutputDirectory(outputRoot)

      // プロジェクトキーからプロジェクトIDを取得
      const projectId = await validateAndGetProjectId(domain, projectIdOrKey, apiKey)
      this.log(`プロジェクトID: ${projectId} を使用します`)

      // 課題の出力ディレクトリ
      const issueOutput = path.join(outputRoot, 'issues')
      await createOutputDirectory(issueOutput)

      // Wikiの出力ディレクトリ
      const wikiOutput = path.join(outputRoot, 'wiki')
      await createOutputDirectory(wikiOutput)

      // 課題の取得と保存
      this.log('課題の取得を開始します...')
      await downloadIssues(this, {
        apiKey,
        count: 100,
        domain,
        outputDir: issueOutput,
        projectId,
      })

      // 課題フォルダに設定ファイルを保存
      await updateSettings(issueOutput, {
        apiKey,
        domain,
        folderType: FolderType.ISSUE,
        lastUpdated: new Date().toISOString(),
        outputDir: issueOutput,
        projectIdOrKey,
      })
      this.log('課題の取得が完了しました')

      // Wikiの取得と保存
      this.log('Wikiの取得を開始します...')
      await downloadWikis(this, {
        apiKey,
        domain,
        outputDir: wikiOutput,
        projectIdOrKey,
      })

      // Wikiフォルダに設定ファイルを保存
      await updateSettings(wikiOutput, {
        apiKey,
        domain,
        folderType: FolderType.WIKI,
        lastUpdated: new Date().toISOString(),
        outputDir: wikiOutput,
        projectIdOrKey,
      })
      this.log('Wikiの取得が完了しました')

      this.log('すべてのデータの取得が完了しました！')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.error(`データの取得に失敗しました: ${errorMessage}`)
    }
  }
}
