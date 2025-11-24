// 設定定数
export const CONFIG = {
  // パネル設定
  PANEL_ID: 'custom-html-editor-panel',
  PANEL_WIDTH: '500px',
  PANEL_MAX_HEIGHT: '80vh',
  PANEL_TOP: '10px',
  PANEL_RIGHT: '10px',
  PANEL_Z_INDEX: 99999,
  EDITOR_HEIGHT: '350px',
  
  // 最小化アイコン設定
  MINIMIZE_ICON_ID: 'html-editor-minimize-icon',
  MINIMIZE_ICON_SIZE: '40px',
  MINIMIZE_ICON_TOP: '20px',
  MINIMIZE_ICON_RIGHT: '20px',
  
  // リサイズハンドル設定
  RESIZE_HANDLE_SIZE: '10px',
  RESIZE_HANDLE_CORNER_SIZE: '15px',
  
  // タイムアウト
  DIALOG_RENDER_DELAY: 300,
  
  // CSSクラス名
  CLASSES: {
    HEADER: 'editor-header',
    BODY: 'editor-body',
    BUTTONS: 'editor-buttons',
    BUTTON: 'editor-btn',
    APPLY: 'btn-apply',
    REFRESH: 'btn-refresh',
    CLOSE: 'btn-close',
    RESIZE: 'btn-resize',
    MAXIMIZE: 'btn-maximize',
    AUTO_INDENT: 'btn-auto-indent',
    TABS: 'editor-tabs',
    TAB: 'editor-tab',
    ACTIVE: 'active',
    CONTENT: 'editor-content',
    TEXTAREA: 'html-textarea',
    PREVIEW: 'preview-area',
    STATUS_BAR: 'status-bar',
    TITLE: 'title',
    RESIZE_HANDLE: 'resize-handle',
    RESIZE_HANDLE_LEFT: 'resize-handle-left',
    RESIZE_HANDLE_BOTTOM: 'resize-handle-bottom',
    RESIZE_HANDLE_CORNER: 'resize-handle-corner',
    MAXIMIZED: 'maximized'
  },
  
  // タブタイプ
  TAB_TYPES: {
    HTML: 'html',
    PREVIEW: 'preview'
  },
  
  // エディタセレクタ
  EDITOR_SELECTORS: [
    '.ocean-ui-editor-field',
    '.ocean-ui-editor',
    '[contenteditable="true"]',
    '.gaia-argoui-app-edit-content-editor',
    'iframe.ocean-ui-editor-frame'
  ],
  
  // ダイアログクラス名
  DIALOG_BG_CLASS: 'ocean-ui-dialog-bg',
  
  // イベント名
  EVENTS: {
    INPUT: 'input',
    CHANGE: 'change'
  },
  
  // HTML整形設定
  HTML_FORMAT: {
    INDENT_SIZE: 2,
    INDENT_CHAR: ' '
  },
  
  // メッセージ
  MESSAGES: {
    EDITOR_NOT_FOUND: 'リッチエディタが見つかりません',
    IFRAME_ACCESS_ERROR: 'iframe内のコンテンツにアクセスできません',
    IFRAME_WRITE_ERROR: 'iframe内のコンテンツに書き込めません',
    APPLIED: '✓ 適用しました',
    REFRESHED: '↻ 再取得しました',
    EDITOR_DETECTED: 'エディタを検出しました',
    EDITOR_NOT_DETECTED: '⚠ リッチエディタが見つかりません',
    DIALOG_OPENED: '📝 ダイアログが開きました - HTMLエディタを起動',
    DIALOG_CLOSED: '✕ ダイアログが閉じました - HTMLエディタを終了',
    STARTUP: '🚀 HTML Editor for kintone 掲示板が起動しました'
  },
  
  // ボタンテキスト
  BUTTON_TEXTS: {
    REFRESH: '↻ 再取得',
    APPLY: '✓ 適用',
    CLOSE: '−',
    RESIZE: '⇱',
    MAXIMIZE: '□',
    RESTORE: '❐',
    AUTO_INDENT: '⇥ 自動インデント',
    READY: 'Ready'
  },
  
  // ボタンタイトル
  BUTTON_TITLES: {
    REFRESH: 'リッチエディタから再取得',
    APPLY: '変更を適用',
    CLOSE: '最小化',
    RESIZE: 'リサイズ',
    MAXIMIZE: '最大化',
    RESTORE: '元に戻す',
    AUTO_INDENT: 'HTMLを自動整形（インデント付与）'
  },
  
  // プレースホルダー
  PLACEHOLDER: 'HTMLを入力...'
};

