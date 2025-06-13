import {Command} from '@oclif/core'
import ky from 'ky'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import {sanitizeFileName, sanitizeWikiFileName} from './common.js'
import {appendLog} from './log.js'
import {RateLimiter} from './sleep.js'

/**
 * Backlogから課題をダウンロードする
 * @param command コマンドインスタンス
 * @param options 課題ダウンロードのオプション
 */
export async function downloadIssues(
  command: Command,
  options: {
    apiKey: string
    count?: number
    domain: string
    lastUpdated?: string
    outputDir: string
    projectId: number
    statusId?: string
  },
): Promise<void> {
  const baseUrl = `https://${options.domain}/api/v2`

  command.log('課題の取得を開始します...')

  // 全ての課題を格納する配列
  let allIssues: Array<{
    assignee: null | {id: number; name: string}
    created: string
    description: string
    id: number
    issueKey: string
    priority: {id: number; name: string}
    status: {id: number; name: string}
    summary: string
    updated: string
  }> = []

  // countのデフォルト値を5000に設定
  const count = options.count ?? 5000
  const maxCount = Math.min(count, 100) // APIの制限は100件

  // APIリクエスト数をカウントするためのRateLimiterを作成
  const rateLimiter = new RateLimiter(command)

  // 課題を取得する関数
  const fetchIssues = async (
    offset: number,
  ): Promise<
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
  > => {
    // APIリクエスト数をインクリメント
    await rateLimiter.increment()

    // APIパラメータの構築
    const params = new URLSearchParams({
      apiKey: options.apiKey,
      count: maxCount.toString(),
      offset: offset.toString(),
      'projectId[]': options.projectId.toString(),
    })

    // ステータスIDが指定されている場合は追加
    if (options.statusId) {
      params.append('statusId[]', options.statusId)
    }

    // 進捗状況を一行で更新
    process.stdout.write(`\r課題を取得中... (${allIssues.length}件取得済み)`)

    return ky.get(`${baseUrl}/issues?${params.toString()}`).json<
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
  }

  // 再帰的に全ての課題を取得
  const fetchAllIssues = async (offset: number): Promise<void> => {
    try {
      const issues = await fetchIssues(offset)

      // 取得した課題を追加
      allIssues = [...allIssues, ...issues]

      // 次のページがあるかどうかを確認
      if (issues.length === maxCount) {
        // 次のページを取得
        await fetchAllIssues(offset + maxCount)
      }
    } catch (error) {
      command.error(`課題の取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // 課題取得開始
  await fetchAllIssues(0)

  command.log(`\n合計 ${allIssues.length}件の課題が見つかりました。`)

  // 前回の更新日時より新しい課題のみをフィルタリング
  let filteredIssues = allIssues
  if (options.lastUpdated) {
    const lastUpdatedDate = new Date(options.lastUpdated)
    filteredIssues = allIssues.filter((issue) => {
      const issueUpdatedDate = new Date(issue.updated)
      return issueUpdatedDate > lastUpdatedDate
    })
    command.log(`前回の更新日時(${options.lastUpdated})以降に更新された${filteredIssues.length}件の課題を処理します。`)
  }

  if (filteredIssues.length === 0) {
    command.log('更新が必要な課題はありません。')
    return
  }

  // 各課題の詳細情報を取得して保存
  command.log('課題を保存しています...')

  // 並列処理ではなく順次処理に変更
  for (const issue of filteredIssues) {
    try {
      // 進捗状況を一行で更新
      const currentIndex = filteredIssues.indexOf(issue) + 1
      process.stdout.write(`\r課題を保存中... (${currentIndex}/${filteredIssues.length}件)`)

      // BacklogのIssueへのリンクを作成
      const backlogIssueUrl = `https://${options.domain}/view/${issue.issueKey}`

      // コメントを取得する関数を呼び出し
      // eslint-disable-next-line no-await-in-loop
      const {comments: allComments} = await fetchAllCommentsForIssue({
        apiKey: options.apiKey,
        baseUrl,
        command,
        issueKey: issue.issueKey,
        rateLimiter,
      })

      // コメントセクションを作成
      let commentsSection = ''
      if (allComments.length > 0) {
        commentsSection = '\n\n## コメント\n'
        let commentIndex = 1
        for (const comment of allComments) {
          const commentDate = new Date(comment.created).toLocaleString('ja-JP')
          commentsSection += `\n### コメント ${commentIndex}\n- **投稿者**: ${
            comment.createdUser.name
          }\n- **日時**: ${commentDate}\n\n${comment.content || '(内容なし)'}\n\n---\n`
          commentIndex++
        }

        // 最後の区切り線を削除
        commentsSection = commentsSection.slice(0, -5)
      }

      // 課題の作成年を取得
      const createdYear = new Date(issue.created).getFullYear()

      // 年ごとのフォルダパスを作成
      const yearDirPath = path.join(options.outputDir, createdYear.toString())

      // 年ごとのフォルダを作成
      // eslint-disable-next-line no-await-in-loop
      await fs.mkdir(yearDirPath, {recursive: true})

      // 年ごとのフォルダ内にMarkdownファイルを保存
      const issueFileName = `${sanitizeFileName(issue.issueKey)}.md`
      const issueFilePath = path.join(yearDirPath, issueFileName)

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

      // eslint-disable-next-line no-await-in-loop
      await fs.writeFile(issueFilePath, markdownContent)

      // ログに記録
      // eslint-disable-next-line no-await-in-loop
      await appendLog(options.outputDir, `課題「${issue.summary}」を更新しました: ${backlogIssueUrl}`)
    } catch (error) {
      command.warn(
        `課題 ${issue.issueKey} の保存に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  command.log('\n課題のダウンロードが完了しました！')
}

/**
 * 課題のコメントを全て取得する
 */
async function fetchAllCommentsForIssue({
  apiKey,
  baseUrl,
  command,
  issueKey,
  rateLimiter,
}: {
  apiKey: string
  baseUrl: string
  command: Command
  issueKey: string
  rateLimiter: RateLimiter
}): Promise<{
  comments: Array<{
    content: string
    created: string
    createdUser: {
      id: number
      name: string
    }
    id: number
  }>
}> {
  const allComments: Array<{
    content: string
    created: string
    createdUser: {
      id: number
      name: string
    }
    id: number
  }> = []

  const fetchComments = async (minId?: number): Promise<void> => {
    // APIリクエスト数をインクリメント
    await rateLimiter.increment()

    let url = `${baseUrl}/issues/${issueKey}/comments?apiKey=${apiKey}&count=100`
    if (minId) {
      url += `&minId=${minId}`
    }

    const comments = await ky.get(url).json<typeof allComments>()
    allComments.push(...comments)

    if (comments.length === 100) {
      // 取得したコメントの最後のIDを次のリクエストのminIdとして使用
      const lastCommentId = comments.at(-1)!.id
      await fetchComments(lastCommentId + 1)
    }
  }

  try {
    await fetchComments()
    // コメントを古い順（昇順）に並び替える
    allComments.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
    return {comments: allComments}
  } catch (error) {
    command.warn(
      `課題 ${issueKey} のコメント取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    )
    return {comments: allComments}
  }
}

/**
 * BacklogからWikiをダウンロードする
 * @param command コマンドインスタンス
 * @param options Wikiダウンロードのオプション
 */
export async function downloadWikis(
  command: Command,
  options: {
    apiKey: string
    domain: string
    lastUpdated?: string
    outputDir: string
    projectIdOrKey: string
  },
): Promise<void> {
  const baseUrl = `https://${options.domain}/api/v2`

  command.log('Wikiの取得を開始します...')

  // APIリクエスト数をカウントするためのRateLimiterを作成
  const rateLimiter = new RateLimiter(command)

  // Wiki一覧の取得
  command.log('Wiki一覧を取得しています...')

  // APIリクエスト数をインクリメント
  await rateLimiter.increment()

  const wikis = await ky
    .get(`${baseUrl}/wikis?apiKey=${options.apiKey}&projectIdOrKey=${options.projectIdOrKey}`)
    .json<Array<{id: string; name: string; updated: string}>>()

  command.log(`${wikis.length}件のWikiが見つかりました。`)

  // 前回の更新日時より新しいWikiのみをフィルタリング
  let filteredWikis = wikis
  if (options.lastUpdated) {
    const lastUpdatedDate = new Date(options.lastUpdated)
    filteredWikis = wikis.filter((wiki) => {
      const wikiUpdatedDate = new Date(wiki.updated)
      return wikiUpdatedDate > lastUpdatedDate
    })
    command.log(`前回の更新日時(${options.lastUpdated})以降に更新された${filteredWikis.length}件のWikiを処理します。`)
  }

  if (filteredWikis.length === 0) {
    command.log('更新が必要なWikiはありません。')
    return
  }

  // 各Wikiの詳細情報を取得
  command.log('Wiki詳細を取得しています...')

  // 並列処理ではなく順次処理に変更
  for (const wiki of filteredWikis) {
    const wikiId = wiki.id

    try {
      // APIリクエスト数をインクリメント
      // eslint-disable-next-line no-await-in-loop
      await rateLimiter.increment()

      // 進捗状況を一行で更新
      const currentIndex = filteredWikis.indexOf(wiki) + 1
      process.stdout.write(`\rWikiを取得中... (${currentIndex}/${filteredWikis.length}件)`)

      // eslint-disable-next-line no-await-in-loop
      const wikiDetail = await ky
        .get(`${baseUrl}/wikis/${wikiId}?projectIdOrKey=${options.projectIdOrKey}&apiKey=${options.apiKey}`)
        .json<Record<string, unknown>>()

      // WikiのIDをファイルパスとして使用
      const wikiName = wiki.id

      // ファイル名のサニタイズ
      const sanitizedName = sanitizeWikiFileName(wikiName)

      // ファイル名の拡張子を追加
      const wikiFileName = `${sanitizedName}.md`

      // ディレクトリ構造を作成（必要な場合）
      const dirPath = path.dirname(wikiFileName)
      if (dirPath !== '.') {
        // eslint-disable-next-line no-await-in-loop
        await fs.mkdir(path.join(options.outputDir, dirPath), {recursive: true})
      }

      // Markdownファイルを保存
      const wikiFilePath = path.join(options.outputDir, wikiFileName)

      // JSONからcontentフィールドを取得
      const content = (wikiDetail.content as string) || ''

      // BacklogのWikiへのリンクを作成
      const backlogWikiUrl = `https://${options.domain}/alias/wiki/${wikiId}`

      // Markdownファイルに書き込む（タイトルとBacklogリンクを追加）
      const markdownContent = `# ${wiki.name}\n\n[Backlog Wiki Link](${backlogWikiUrl})\n\n${content}`
      // eslint-disable-next-line no-await-in-loop
      await fs.writeFile(wikiFilePath, markdownContent)

      // ログに記録
      // eslint-disable-next-line no-await-in-loop
      await appendLog(options.outputDir, `Wiki「${wiki.name}」を更新しました: ${backlogWikiUrl}`)

      // 進捗状況を一行で更新
      const wikiIndex = filteredWikis.indexOf(wiki) + 1
      process.stdout.write(`\rWikiを保存中... (${wikiIndex}/${filteredWikis.length}件)`)
    } catch (error) {
      command.warn(`Wiki ${wiki.name} の取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  command.log('\nWikiのダウンロードが完了しました！')
}
