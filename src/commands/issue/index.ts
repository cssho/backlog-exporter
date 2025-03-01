import {Args, Command, Flags} from '@oclif/core'
import * as dotenv from 'dotenv'
import ky from 'ky'
import * as fs from 'node:fs/promises'
import path from 'node:path'

import {validateAndGetProjectId} from '../../utils/backlog.js'

// .envファイルを読み込む
dotenv.config()

export default class DownloadIssue extends Command {
  static args = {
    url: Args.string({description: 'URL to download from', required: false}),
  }
  static description = 'Download issues from Backlog'
  static examples = [
    `<%= config.bin %> <%= command.id %> --domain cm1.backlog.jp --projectIdOrKey PROJECT_KEY --apiKey YOUR_API_KEY --output ./issue-data
Download issues from Backlog using API key
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
      description: 'Output directory path',
      required: false,
    }),
    projectIdOrKey: Flags.string({description: 'Backlog project ID or key', required: true}),
    statusId: Flags.string({description: 'Filter issues by status ID', required: false}),
  }

  // APIキーを取得する（優先順位: コマンドライン引数 > 環境変数）
  getApiKey(providedApiKey?: string): string {
    // コマンドライン引数からのAPIキー
    if (providedApiKey) {
      return providedApiKey
    }

    // 環境変数からのAPIキー
    const envApiKey = process.env.BACKLOG_API_KEY
    if (envApiKey) {
      this.log('Using API key from environment variable BACKLOG_API_KEY')
      return envApiKey
    }

    // APIキーが見つからない場合はエラー
    this.error('API key not found. Please provide it via --apiKey flag or BACKLOG_API_KEY environment variable')
    return '' // この行は実行されないが、TypeScriptのエラーを回避するために必要
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(DownloadIssue)

    const {count, domain, output: outputDir, projectIdOrKey, statusId} = flags
    const apiKey = this.getApiKey(flags.apiKey)

    const baseUrl = `https://${domain}/api/v2`

    this.log(`Downloading issues from ${domain} for project ${projectIdOrKey}...`)

    try {
      // プロジェクトキーからプロジェクトIDを取得
      const projectId = await validateAndGetProjectId(domain, projectIdOrKey, apiKey)
      this.log(`Using project ID: ${projectId}`)

      // 出力ディレクトリの作成
      await fs.mkdir(outputDir, {recursive: true})

      // 課題一覧の取得
      this.log('Fetching issues...')

      // APIパラメータの構築
      const params = new URLSearchParams({
        apiKey,
        count: count.toString(),
        'projectId[]': projectId.toString(),
      })

      // ステータスIDが指定されている場合は追加
      if (statusId) {
        params.append('statusId[]', statusId)
      }

      const issues = await ky.get(`${baseUrl}/issues?${params.toString()}`).json<
        Array<{
          assignee: null | {id: number; name: string}
          created: string
          description: string
          id: number
          issueKey: string
          priority: {id: number; name: string}
          status: {id: number; name: string}
          summary: string
          updated: string
        }>
      >()

      this.log(`Found ${issues.length} issues.`)

      // 各課題の詳細情報を取得して保存
      this.log('Saving issues...')

      // Promise.allを使用して並列処理
      const issuePromises = issues.map(async (issue) => {
        try {
          // ファイル名に使用できない文字を置換する関数
          const sanitizeFileName = (name: string): string =>
            name
              .replaceAll(/[\\/:*?"<>|]/g, '_') // Windowsで使用できない文字を置換
              .replaceAll(/\s+/g, '_') // スペースをアンダースコアに置換
              .replaceAll('.', '_') // ドットを置換
              .slice(0, 200) // 長すぎるファイル名を防ぐために200文字に制限

          // 課題の詳細情報をJSONファイルとして保存
          const issueFileName = `${sanitizeFileName(issue.summary)}.md`
          const issueFilePath = path.join(outputDir, issueFileName)

          // BacklogのIssueへのリンクを作成
          const backlogIssueUrl = `https://${domain}/view/${issue.issueKey}`

          // コメント一覧を取得
          this.log(`Fetching comments for issue ${issue.issueKey}...`)
          const commentsParams = new URLSearchParams({
            apiKey,
            count: '100', // 最大100件のコメントを取得
            order: 'asc', // 古い順に取得
          })

          const comments = await ky
            .get(`${baseUrl}/issues/${issue.issueKey}/comments?${commentsParams.toString()}`)
            .json<
              Array<{
                content: string
                created: string
                createdUser: {
                  id: number
                  name: string
                }
                id: number
              }>
            >()

          // コメントセクションを作成
          let commentsSection = ''
          if (comments.length > 0) {
            commentsSection = '\n\n## コメント\n'
            let commentIndex = 1
            for (const comment of comments) {
              const commentDate = new Date(comment.created).toLocaleString('ja-JP')
              commentsSection += `\n### コメント ${commentIndex}\n- **投稿者**: ${
                comment.createdUser.name
              }\n- **日時**: ${commentDate}\n\n${comment.content || '(内容なし)'}\n\n---\n`
              commentIndex++
            }

            // 最後の区切り線を削除
            commentsSection = commentsSection.slice(0, -5)
          }

          // Markdownファイルに書き込む
          const assigneeName = issue.assignee ? issue.assignee.name : '未割り当て'
          const markdownContent = `# ${issue.summary}

## 基本情報
- 課題キー: ${issue.issueKey}
- ステータス: ${issue.status.name}
- 優先度: ${issue.priority.name}
- 担当者: ${assigneeName}
- 作成日時: ${new Date(issue.created).toLocaleString('ja-JP')}
- 更新日時: ${new Date(issue.updated).toLocaleString('ja-JP')}
- [Backlog Issue Link](${backlogIssueUrl})

## 詳細
${issue.description || '詳細情報なし'}${commentsSection}`

          await fs.writeFile(issueFilePath, markdownContent)

          this.log(`Issue "${issue.issueKey}: ${issue.summary}" saved to ${issueFilePath}`)
        } catch (error) {
          this.warn(`Failed to save issue ${issue.issueKey}: ${error instanceof Error ? error.message : String(error)}`)
        }
      })

      await Promise.all(issuePromises)

      this.log('Download completed successfully!')
    } catch (error) {
      this.error(`Download failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
