# HTML Editor for kintone おしらせ

## 概要

kintoneのおしらせ（掲示板）の編集ダイアログで、リッチエディタのHTMLを直接編集できるウィジェットです。

## 機能

- リッチエディタのHTMLを直接編集
- **CodeMirror 6によるシンタックスハイライト**
- **行番号表示**
- **括弧マッチング**
- **コード折りたたみ**
- **検索・置換機能**（Ctrl+F / Cmd+F）
- **自動インデント**（Tab/Shift+Tab、ボタン押下時）
- HTMLの自動整形（インデント付与）
- プレビュー機能
- パネルのドラッグ移動・リサイズ
- 最小化機能（右下のアイコンから再表示可能）

## インストール方法

### 方法1: リリースファイルを使用（推奨）

1. [Releases](https://github.com/zackey86/kintone_widget_editor/releases) ページから最新のリリースをダウンロード
2. `edit_dialog.min.js` ファイルをダウンロード
3. kintoneの「設定」→「システム管理」→「JavaScript / CSSでカスタマイズ」にアクセス
4. 「JavaScriptファイル」セクションで「ファイルを追加」をクリック
5. ダウンロードした `edit_dialog.min.js` をアップロード
6. 「保存」をクリック

**注意**: アップロードにはシステム管理者権限が必要です。

### 方法2: ソースコードからビルド

詳細は下記の「ビルド方法」を参照してください。

## 使い方

1. おしらせ（掲示板）の編集ダイアログを開く
2. 自動的にHTMLエディタパネルが表示されます
3. パネルで以下の操作が可能です：

- **HTMLタブ**: HTMLコードを直接編集（CodeMirror 6エディタ）
  - シンタックスハイライト表示
  - 行番号表示
  - Tab/Shift+Tabでインデント調整
  - Ctrl+F / Cmd+Fで検索・置換
- **プレビュータブ**: 編集内容のプレビューを確認
- **↻ 再取得**: リッチエディタから現在のHTMLを再取得
- **✓ 適用**: 編集したHTMLをリッチエディタに適用
- **⇥ 自動インデント**: HTML全体を自動整形（CodeMirror 6の機能を使用）
- **− 最小化**: パネルを最小化（右下のアイコンから再表示可能）

4. パネルのヘッダーをドラッグして位置を移動できます
5. パネルの端をドラッグしてサイズを変更できます

## 技術スタック

- React 18
- CodeMirror 6
- Webpack 5

## ビルド方法

### 前提条件

- Node.js (v14以上推奨)
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/your-repo/kintone_widget_editor.git
cd kintone_widget_editor

# 依存関係をインストール
npm install
```

### ビルドコマンド

```bash
# 本番用ビルド（最適化・圧縮）
npm run build

# 開発用ビルド（ウォッチモード）
npm run dev

# ビルド成果物をクリーン
npm run clean
```

### ビルド成果物

ビルドが完了すると、`dist/` ディレクトリに以下のファイルが生成されます：

- `edit_dialog.min.js` - 本番用の圧縮されたJavaScriptファイル
- `edit_dialog.min.js.map` - ソースマップファイル
- `edit_dialog.min.js.LICENSE.txt` - ライセンス情報

この `edit_dialog.min.js` ファイルをkintoneのカスタマイズ設定にアップロードして使用します。

## ライセンス

MIT License

