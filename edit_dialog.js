(function() {
    'use strict';
  
    // 設定定数
    const CONFIG = {
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
  
    let htmlEditorPanel = null;
    let targetEditor = null;
  
    /**
     * 要素内でクラス名で要素を検索
     * @param {HTMLElement} parent - 親要素
     * @param {string} className - クラス名
     * @returns {HTMLElement|null} 見つかった要素、見つからない場合はnull
     */
    function findElementByClass(parent, className) {
      return parent.querySelector(`.${className}`);
    }
  
    /**
     * 要素内でクラス名で複数の要素を検索
     * @param {HTMLElement} parent - 親要素
     * @param {string} className - クラス名
     * @returns {NodeList} 見つかった要素のリスト
     */
    function findElementsByClass(parent, className) {
      return parent.querySelectorAll(`.${className}`);
    }
  
    /**
     * パネルのCSSスタイルを生成
     * @returns {string} CSSスタイル文字列
     */
    function getPanelStyles() {
      const panelId = `#${CONFIG.PANEL_ID}`;
      return `
        <style>
          ${panelId} {
            position: fixed;
            top: ${CONFIG.PANEL_TOP};
            right: ${CONFIG.PANEL_RIGHT};
            width: ${CONFIG.PANEL_WIDTH};
            max-height: ${CONFIG.PANEL_MAX_HEIGHT};
            background: #1e1e1e;
            border: 1px solid #444;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            z-index: ${CONFIG.PANEL_Z_INDEX};
            font-family: monospace;
            display: flex;
            flex-direction: column;
            resize: none;
            overflow: hidden;
          }
          ${panelId}.${CONFIG.CLASSES.MAXIMIZED} {
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            border-radius: 0;
          }
          ${panelId} .${CONFIG.CLASSES.HEADER} {
            background: #333;
            color: #fff;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
          }
          ${panelId} .${CONFIG.CLASSES.HEADER} .${CONFIG.CLASSES.TITLE} {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          ${panelId} .${CONFIG.CLASSES.HEADER} .${CONFIG.CLASSES.TITLE}::before {
            content: '</>';
            color: #61afef;
          }
          ${panelId} .${CONFIG.CLASSES.BUTTONS} {
            display: flex;
            gap: 5px;
          }
          ${panelId} .${CONFIG.CLASSES.BUTTON} {
            padding: 5px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
          }
          ${panelId} .${CONFIG.CLASSES.APPLY} {
            background: #4CAF50;
            color: white;
          }
          ${panelId} .${CONFIG.CLASSES.APPLY}:hover {
            background: #45a049;
          }
          ${panelId} .${CONFIG.CLASSES.REFRESH} {
            background: #2196F3;
            color: white;
          }
          ${panelId} .${CONFIG.CLASSES.REFRESH}:hover {
            background: #1976D2;
          }
          ${panelId} .${CONFIG.CLASSES.CLOSE} {
            background: #f44336;
            color: white;
          }
          ${panelId} .${CONFIG.CLASSES.CLOSE}:hover {
            background: #d32f2f;
          }
          ${panelId} .${CONFIG.CLASSES.RESIZE} {
            background: #9C27B0;
            color: white;
          }
          ${panelId} .${CONFIG.CLASSES.RESIZE}:hover {
            background: #7B1FA2;
          }
          ${panelId} .${CONFIG.CLASSES.MAXIMIZE} {
            background: #607D8B;
            color: white;
          }
          ${panelId} .${CONFIG.CLASSES.MAXIMIZE}:hover {
            background: #455A64;
          }
          ${panelId} .${CONFIG.CLASSES.BODY} {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
          }
          ${panelId} .${CONFIG.CLASSES.TABS} {
            display: flex;
            background: #2d2d2d;
          }
          ${panelId} .${CONFIG.CLASSES.TAB} {
            padding: 8px 16px;
            color: #888;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            font-size: 12px;
          }
          ${panelId} .${CONFIG.CLASSES.TAB}.${CONFIG.CLASSES.ACTIVE} {
            color: #fff;
            border-bottom-color: #61afef;
          }
          ${panelId} .${CONFIG.CLASSES.CONTENT} {
            flex: 1;
            overflow: hidden;
          }
          ${panelId} .${CONFIG.CLASSES.TEXTAREA} {
            width: 100%;
            height: ${CONFIG.EDITOR_HEIGHT};
            background: #1e1e1e;
            color: #d4d4d4;
            border: none;
            padding: 15px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            line-height: 1.5;
            resize: none;
            box-sizing: border-box;
          }
          ${panelId} .${CONFIG.CLASSES.TEXTAREA}:focus {
            outline: none;
          }
          ${panelId} .${CONFIG.CLASSES.AUTO_INDENT} {
            background: #FF9800;
            color: white;
          }
          ${panelId} .${CONFIG.CLASSES.AUTO_INDENT}:hover {
            background: #F57C00;
          }
          ${panelId} .${CONFIG.CLASSES.PREVIEW} {
            width: 100%;
            height: ${CONFIG.EDITOR_HEIGHT};
            background: #fff;
            padding: 15px;
            overflow: auto;
            box-sizing: border-box;
            display: none;
          }
          ${panelId} .${CONFIG.CLASSES.STATUS_BAR} {
            background: #007acc;
            color: #fff;
            padding: 4px 10px;
            font-size: 11px;
            border-radius: 0 0 8px 8px;
          }
          #${CONFIG.MINIMIZE_ICON_ID} {
            position: fixed;
            top: ${CONFIG.MINIMIZE_ICON_TOP};
            right: ${CONFIG.MINIMIZE_ICON_RIGHT};
            width: ${CONFIG.MINIMIZE_ICON_SIZE};
            height: ${CONFIG.MINIMIZE_ICON_SIZE};
            background: #61afef;
            border: 2px solid #fff;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            display: none;
            z-index: ${CONFIG.PANEL_Z_INDEX};
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #fff;
            font-weight: bold;
            transition: all 0.2s ease;
          }
          #${CONFIG.MINIMIZE_ICON_ID}:hover {
            background: #4a9eff;
            transform: scale(1.1);
          }
          #${CONFIG.MINIMIZE_ICON_ID}::before {
            content: '</>';
          }
          ${panelId} .${CONFIG.CLASSES.RESIZE_HANDLE} {
            position: absolute;
            background: transparent;
            z-index: 100000;
          }
          ${panelId} .${CONFIG.CLASSES.RESIZE_HANDLE_LEFT} {
            top: 0;
            left: 0;
            width: ${CONFIG.RESIZE_HANDLE_SIZE};
            height: 100%;
            cursor: ew-resize;
          }
          ${panelId} .${CONFIG.CLASSES.RESIZE_HANDLE_BOTTOM} {
            bottom: 0;
            left: 0;
            width: 100%;
            height: ${CONFIG.RESIZE_HANDLE_SIZE};
            cursor: ns-resize;
          }
          ${panelId} .${CONFIG.CLASSES.RESIZE_HANDLE_CORNER} {
            bottom: 0;
            left: 0;
            width: ${CONFIG.RESIZE_HANDLE_CORNER_SIZE};
            height: ${CONFIG.RESIZE_HANDLE_CORNER_SIZE};
            cursor: nesw-resize;
            background: rgba(97, 175, 239, 0.3);
            border-radius: 0 0 0 8px;
          }
          ${panelId} .${CONFIG.CLASSES.RESIZE_HANDLE_CORNER}:hover {
            background: rgba(97, 175, 239, 0.6);
          }
          ${panelId}.${CONFIG.CLASSES.MAXIMIZED} .${CONFIG.CLASSES.RESIZE_HANDLE} {
            display: none;
          }
        </style>
      `;
    }
  
    /**
     * HTMLエディタパネルを作成
     * @returns {HTMLElement} 作成されたパネル要素
     */
    function createHtmlEditorPanel() {
      const panel = document.createElement('div');
      panel.id = CONFIG.PANEL_ID;
      panel.innerHTML = `
        ${getPanelStyles()}
        <div class="${CONFIG.CLASSES.HEADER}">
          <span class="${CONFIG.CLASSES.TITLE}">HTML Editor</span>
          <div class="${CONFIG.CLASSES.BUTTONS}">
            <button class="${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.MAXIMIZE}" title="${CONFIG.BUTTON_TITLES.MAXIMIZE}">${CONFIG.BUTTON_TEXTS.MAXIMIZE}</button>
            <button class="${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.AUTO_INDENT}" title="${CONFIG.BUTTON_TITLES.AUTO_INDENT}">${CONFIG.BUTTON_TEXTS.AUTO_INDENT}</button>
            <button class="${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.REFRESH}" title="${CONFIG.BUTTON_TITLES.REFRESH}">${CONFIG.BUTTON_TEXTS.REFRESH}</button>
            <button class="${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.APPLY}" title="${CONFIG.BUTTON_TITLES.APPLY}">${CONFIG.BUTTON_TEXTS.APPLY}</button>
            <button class="${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.CLOSE}" title="${CONFIG.BUTTON_TITLES.CLOSE}">${CONFIG.BUTTON_TEXTS.CLOSE}</button>
          </div>
        </div>
        <div class="${CONFIG.CLASSES.BODY}">
          <div class="${CONFIG.CLASSES.TABS}">
            <div class="${CONFIG.CLASSES.TAB} ${CONFIG.CLASSES.ACTIVE}" data-tab="${CONFIG.TAB_TYPES.HTML}">HTML</div>
            <div class="${CONFIG.CLASSES.TAB}" data-tab="${CONFIG.TAB_TYPES.PREVIEW}">プレビュー</div>
          </div>
          <div class="${CONFIG.CLASSES.CONTENT}">
            <textarea class="${CONFIG.CLASSES.TEXTAREA}" spellcheck="false" placeholder="${CONFIG.PLACEHOLDER}"></textarea>
            <div class="${CONFIG.CLASSES.PREVIEW}"></div>
          </div>
        </div>
        <div class="${CONFIG.CLASSES.STATUS_BAR}">${CONFIG.BUTTON_TEXTS.READY}</div>
        <div class="${CONFIG.CLASSES.RESIZE_HANDLE} ${CONFIG.CLASSES.RESIZE_HANDLE_LEFT}"></div>
        <div class="${CONFIG.CLASSES.RESIZE_HANDLE} ${CONFIG.CLASSES.RESIZE_HANDLE_BOTTOM}"></div>
        <div class="${CONFIG.CLASSES.RESIZE_HANDLE} ${CONFIG.CLASSES.RESIZE_HANDLE_CORNER}"></div>
      `;
  
      // イベント設定
      setupPanelEventHandlers(panel);
  
      return panel;
    }
  
    /**
     * 最小化アイコンを作成
     * @returns {HTMLElement} 作成されたアイコン要素
     */
    function createMinimizeIcon() {
      const icon = document.createElement('div');
      icon.id = CONFIG.MINIMIZE_ICON_ID;
      icon.style.display = 'flex';
      return icon;
    }
  
    /**
     * パネルのイベントハンドラーを設定
     * @param {HTMLElement} panel - パネル要素
     */
    function setupPanelEventHandlers(panel) {
      const textarea = findElementByClass(panel, CONFIG.CLASSES.TEXTAREA);
      const preview = findElementByClass(panel, CONFIG.CLASSES.PREVIEW);
      const statusBar = findElementByClass(panel, CONFIG.CLASSES.STATUS_BAR);
      const tabs = findElementsByClass(panel, CONFIG.CLASSES.TAB);
      const applyButton = findElementByClass(panel, CONFIG.CLASSES.APPLY);
      const refreshButton = findElementByClass(panel, CONFIG.CLASSES.REFRESH);
      const closeButton = findElementByClass(panel, CONFIG.CLASSES.CLOSE);
      const maximizeButton = findElementByClass(panel, CONFIG.CLASSES.MAXIMIZE);
      const autoIndentButton = findElementByClass(panel, CONFIG.CLASSES.AUTO_INDENT);
      const header = findElementByClass(panel, CONFIG.CLASSES.HEADER);
      const resizeHandleLeft = findElementByClass(panel, CONFIG.CLASSES.RESIZE_HANDLE_LEFT);
      const resizeHandleBottom = findElementByClass(panel, CONFIG.CLASSES.RESIZE_HANDLE_BOTTOM);
      const resizeHandleCorner = findElementByClass(panel, CONFIG.CLASSES.RESIZE_HANDLE_CORNER);

      // タブ切り替え
      tabs.forEach(tab => {
        tab.addEventListener('click', function() {
          handleTabSwitch(this, tabs, textarea, preview);
        });
      });

      // 適用ボタン
      applyButton.addEventListener('click', function() {
        handleApply(textarea, statusBar);
      });

      // 再取得ボタン
      refreshButton.addEventListener('click', function() {
        handleRefresh(textarea, statusBar);
      });

      // 自動インデントボタン
      autoIndentButton.addEventListener('click', function() {
        handleAutoIndent(textarea, statusBar);
      });

      // 閉じるボタン（最小化）
      closeButton.addEventListener('click', function() {
        minimizeHtmlEditorPanel();
      });

      // 最大化ボタン
      maximizeButton.addEventListener('click', function() {
        toggleMaximize(panel, maximizeButton);
      });

      // インデント機能（Tab/Shift+Tab）
      if (textarea) {
        textarea.addEventListener('keydown', function(e) {
          if (e.key === 'Tab') {
            e.preventDefault();
            handleIndent(textarea, e.shiftKey);
          }
        });
      }

      // リサイズハンドル
      makeResizable(panel, resizeHandleLeft, 'horizontal');
      makeResizable(panel, resizeHandleBottom, 'vertical');
      makeResizable(panel, resizeHandleCorner, 'both');

      // ドラッグ移動機能
      makeDraggable(panel, header);
    }
  
    /**
     * インデントを追加
     * @param {HTMLElement} textarea - テキストエリア要素
     * @param {boolean} unindent - trueの場合はアンインデント
     */
    function handleIndent(textarea, unindent = false) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const lines = text.split('\n');
      
      // 選択範囲の行を特定
      let startLine = 0;
      let endLine = 0;
      let charCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const lineLength = lines[i].length;
        const lineEnd = charCount + lineLength;
        const isLastLine = i === lines.length - 1;
        
        // 開始行の特定
        if (charCount <= start && start <= lineEnd) {
          startLine = i;
        }
        
        // 終了行の特定（最後の行の場合は改行文字がないため、<= で判定）
        if (charCount <= end && (isLastLine ? end <= lineEnd : end <= lineEnd + 1)) {
          endLine = i;
          if (end <= lineEnd) {
            break;
          }
        }
        
        // 次の行の開始位置（改行文字を含む）
        charCount += lineLength + (isLastLine ? 0 : 1);
      }
      
      const indentString = CONFIG.HTML_FORMAT.INDENT_CHAR.repeat(CONFIG.HTML_FORMAT.INDENT_SIZE);
      let newLines = [...lines];
      
      // 元のテキストでの各行の開始位置を計算
      let originalLineStartPositions = [];
      charCount = 0;
      for (let i = 0; i < lines.length; i++) {
        originalLineStartPositions[i] = charCount;
        charCount += lines[i].length + (i < lines.length - 1 ? 1 : 0);
      }
      
      // 選択範囲の開始位置と終了位置を行内の相対位置に変換
      const startOffset = start - originalLineStartPositions[startLine];
      const endOffset = end - originalLineStartPositions[endLine];
      
      // インデントの追加/削除と、各行の長さの変化を記録
      let lineLengthChanges = new Array(lines.length).fill(0);
      
      for (let i = startLine; i <= endLine; i++) {
        if (unindent) {
          // アンインデント
          const originalLine = newLines[i];
          let removed = 0;
          
          if (originalLine.startsWith(indentString)) {
            newLines[i] = originalLine.substring(indentString.length);
            removed = indentString.length;
          } else if (originalLine.match(/^\s+/)) {
            // 部分的なインデントがある場合
            const leadingSpaces = originalLine.match(/^\s*/)[0];
            const removeCount = Math.min(indentString.length, leadingSpaces.length);
            newLines[i] = originalLine.substring(removeCount);
            removed = removeCount;
          }
          
          lineLengthChanges[i] = -removed;
        } else {
          // インデント追加
          newLines[i] = indentString + newLines[i];
          lineLengthChanges[i] = indentString.length;
        }
      }
      
      // 新しいテキストを生成
      const newText = newLines.join('\n');
      
      // 新しいテキストでの各行の開始位置を計算
      let newLineStartPositions = [];
      charCount = 0;
      for (let i = 0; i < newLines.length; i++) {
        newLineStartPositions[i] = charCount;
        charCount += newLines[i].length + (i < newLines.length - 1 ? 1 : 0);
      }
      
      // 選択範囲の開始位置と終了位置を計算
      let newStart, newEnd;
      
      if (unindent) {
        // アンインデントの場合
        const startLineRemoved = Math.abs(lineLengthChanges[startLine]);
        if (startOffset >= startLineRemoved) {
          newStart = newLineStartPositions[startLine] + (startOffset - startLineRemoved);
        } else {
          newStart = newLineStartPositions[startLine];
        }
        
        const endLineRemoved = Math.abs(lineLengthChanges[endLine]);
        if (endOffset >= endLineRemoved) {
          newEnd = newLineStartPositions[endLine] + (endOffset - endLineRemoved);
        } else {
          newEnd = newLineStartPositions[endLine];
        }
      } else {
        // インデント追加の場合
        newStart = newLineStartPositions[startLine] + indentString.length + startOffset;
        newEnd = newLineStartPositions[endLine] + indentString.length + endOffset;
      }
      
      textarea.value = newText;
      textarea.setSelectionRange(newStart, newEnd);
    }

    /**
     * タブ切り替えを処理
     * @param {HTMLElement} clickedTab - クリックされたタブ要素
     * @param {NodeList} allTabs - すべてのタブ要素
     * @param {HTMLElement} textarea - テキストエリア要素
     * @param {HTMLElement} preview - プレビュー要素
     */
    function handleTabSwitch(clickedTab, allTabs, textarea, preview) {
      allTabs.forEach(t => t.classList.remove(CONFIG.CLASSES.ACTIVE));
      clickedTab.classList.add(CONFIG.CLASSES.ACTIVE);
      
      if (clickedTab.dataset.tab === CONFIG.TAB_TYPES.HTML) {
        textarea.style.display = 'block';
        preview.style.display = 'none';
      } else {
        textarea.style.display = 'none';
        preview.style.display = 'block';
        preview.innerHTML = textarea.value;
      }
    }
  
    /**
     * 適用ボタンの処理
     * @param {HTMLElement} textarea - テキストエリア要素
     * @param {HTMLElement} statusBar - ステータスバー要素
     */
    function handleApply(textarea, statusBar) {
      applyHtmlToEditor(textarea.value);
      statusBar.textContent = `${CONFIG.MESSAGES.APPLIED} - ${new Date().toLocaleTimeString()}`;
    }
  
    /**
     * 再取得ボタンの処理
     * @param {HTMLElement} textarea - テキストエリア要素
     * @param {HTMLElement} statusBar - ステータスバー要素
     */
    function handleRefresh(textarea, statusBar) {
      const html = getEditorHtml();
      if (html !== null) {
        textarea.value = formatHtml(html);
        statusBar.textContent = `${CONFIG.MESSAGES.REFRESHED} - ${new Date().toLocaleTimeString()}`;
      }
    }

    /**
     * 自動インデントボタンの処理
     * @param {HTMLElement} textarea - テキストエリア要素
     * @param {HTMLElement} statusBar - ステータスバー要素
     */
    function handleAutoIndent(textarea, statusBar) {
      const formatted = formatHtml(textarea.value);
      textarea.value = formatted;
      statusBar.textContent = `✓ 自動インデント適用 - ${new Date().toLocaleTimeString()}`;
    }
  
    // 最大化前の状態を保存
    let savedPanelState = null;
  
    /**
     * 最大化/復元を切り替え
     * @param {HTMLElement} panel - パネル要素
     * @param {HTMLElement} button - 最大化ボタン要素
     */
    function toggleMaximize(panel, button) {
      const isMaximized = panel.classList.contains(CONFIG.CLASSES.MAXIMIZED);
      
      if (isMaximized) {
        // 復元
        panel.classList.remove(CONFIG.CLASSES.MAXIMIZED);
        if (savedPanelState) {
          panel.style.width = savedPanelState.width;
          panel.style.height = savedPanelState.height;
          panel.style.top = savedPanelState.top;
          panel.style.left = savedPanelState.left;
          panel.style.right = savedPanelState.right;
          panel.style.maxHeight = savedPanelState.maxHeight;
        }
        
        // エディタの高さを更新（パネルの高さに基づいて自動計算）
        setTimeout(() => {
          updateEditorAreaHeight(panel);
        }, 0);
        
        button.textContent = CONFIG.BUTTON_TEXTS.MAXIMIZE;
        button.title = CONFIG.BUTTON_TITLES.MAXIMIZE;
      } else {
        // 最大化
        const computedStyle = document.defaultView.getComputedStyle(panel);
        savedPanelState = {
          width: panel.style.width || computedStyle.width,
          height: panel.style.height || computedStyle.height,
          top: panel.style.top || computedStyle.top,
          left: panel.style.left || computedStyle.left,
          right: panel.style.right || computedStyle.right,
          maxHeight: panel.style.maxHeight || computedStyle.maxHeight
        };
        
        const textarea = findElementByClass(panel, CONFIG.CLASSES.TEXTAREA);
        const preview = findElementByClass(panel, CONFIG.CLASSES.PREVIEW);
        if (textarea && preview) {
          const textareaStyle = document.defaultView.getComputedStyle(textarea);
          const previewStyle = document.defaultView.getComputedStyle(preview);
          savedPanelState.textareaHeight = textarea.style.height || textareaStyle.height;
          savedPanelState.previewHeight = preview.style.height || previewStyle.height;
        }
        
        panel.classList.add(CONFIG.CLASSES.MAXIMIZED);
        
        // エディタの高さを調整（パネルの高さに基づいて自動計算）
        setTimeout(() => {
          updateEditorAreaHeight(panel);
        }, 0);
        
        button.textContent = CONFIG.BUTTON_TEXTS.RESTORE;
        button.title = CONFIG.BUTTON_TITLES.RESTORE;
      }
    }
  
    /**
     * 編集エリアの高さを更新
     * @param {HTMLElement} panel - パネル要素
     */
    function updateEditorAreaHeight(panel) {
      const textarea = findElementByClass(panel, CONFIG.CLASSES.TEXTAREA);
      const preview = findElementByClass(panel, CONFIG.CLASSES.PREVIEW);
      
      if (!textarea || !preview) return;
      
      // パネルの現在の高さを取得
      const panelHeight = panel.offsetHeight || parseInt(document.defaultView.getComputedStyle(panel).height, 10);
      
      // ヘッダー、タブ、ステータスバーの高さを取得
      const header = findElementByClass(panel, CONFIG.CLASSES.HEADER);
      const tabs = findElementByClass(panel, CONFIG.CLASSES.TABS);
      const statusBar = findElementByClass(panel, CONFIG.CLASSES.STATUS_BAR);
      
      const headerHeight = header ? header.offsetHeight : 0;
      const tabsHeight = tabs ? tabs.offsetHeight : 0;
      const statusBarHeight = statusBar ? statusBar.offsetHeight : 0;
      
      // 編集エリアの利用可能な高さを計算
      const availableHeight = panelHeight - headerHeight - tabsHeight - statusBarHeight;
      
      // 最小高さを確保（200px）
      const editorHeight = Math.max(200, availableHeight);
      
      // textareaとpreviewの高さを更新
      textarea.style.height = editorHeight + 'px';
      preview.style.height = editorHeight + 'px';
    }

    /**
     * 要素をリサイズ可能にする
     * @param {HTMLElement} element - リサイズ可能にする要素
     * @param {HTMLElement} handle - リサイズハンドル要素
     * @param {string} direction - リサイズ方向 ('horizontal', 'vertical', 'both')
     */
    function makeResizable(element, handle, direction) {
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;
      let startLeft = 0;
      let startTop = 0;
      
      handle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
        startLeft = element.offsetLeft;
        startTop = element.offsetTop;
        
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
      });
      
      function handleResize(e) {
        if (direction === 'horizontal' || direction === 'both') {
          // 左端からのリサイズ: 左方向にドラッグすると幅が増える
          const deltaX = e.clientX - startX;
          const width = startWidth - deltaX;
          if (width > 300) {
            element.style.width = width + 'px';
            element.style.right = 'auto';
            // 左端の位置を調整
            const newLeft = startLeft + deltaX;
            element.style.left = newLeft + 'px';
          }
        }
        
        if (direction === 'vertical' || direction === 'both') {
          const height = startHeight + (e.clientY - startY);
          if (height > 200) {
            element.style.height = height + 'px';
            element.style.maxHeight = 'none';
            // リサイズ中に編集エリアの高さを更新
            updateEditorAreaHeight(element);
          }
        }
      }
      
      function stopResize() {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
        
        // リサイズ後に編集エリアの高さを更新
        updateEditorAreaHeight(element);
      }
    }
  
    /**
     * 要素をドラッグ可能にする
     * @param {HTMLElement} element - ドラッグ可能にする要素
     * @param {HTMLElement} handle - ドラッグハンドル要素
     */
    function makeDraggable(element, handle) {
      let deltaX = 0;
      let deltaY = 0;
      let initialMouseX = 0;
      let initialMouseY = 0;
      
      handle.onmousedown = handleDragStart;
  
      /**
       * ドラッグ開始を処理
       * @param {MouseEvent} event - マウスイベント
       */
      function handleDragStart(event) {
        if (event.target.tagName === 'BUTTON') return;
        event.preventDefault();
        initialMouseX = event.clientX;
        initialMouseY = event.clientY;
        document.onmouseup = handleDragEnd;
        document.onmousemove = handleDragMove;
      }
  
      /**
       * ドラッグ移動を処理
       * @param {MouseEvent} event - マウスイベント
       */
      function handleDragMove(event) {
        event.preventDefault();
        deltaX = initialMouseX - event.clientX;
        deltaY = initialMouseY - event.clientY;
        initialMouseX = event.clientX;
        initialMouseY = event.clientY;
        element.style.top = (element.offsetTop - deltaY) + "px";
        element.style.left = (element.offsetLeft - deltaX) + "px";
        element.style.right = 'auto';
      }
  
      /**
       * ドラッグ終了を処理
       */
      function handleDragEnd() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  
    /**
     * リッチエディタの要素を探す
     * @returns {HTMLElement|null} 見つかったエディタ要素、見つからない場合はnull
     */
    function findRichEditor() {
      for (const selector of CONFIG.EDITOR_SELECTORS) {
        const editor = document.querySelector(selector);
        if (editor) {
          return editor;
        }
      }
      return null;
    }
  
    /**
     * エディタからHTMLを取得
     * @returns {string|null} HTML文字列、取得できない場合はnull
     */
    function getEditorHtml() {
      targetEditor = findRichEditor();
      
      if (!targetEditor) {
        console.warn(CONFIG.MESSAGES.EDITOR_NOT_FOUND);
        return null;
      }
  
      let html = '';
      
      // iframeの場合
      if (targetEditor.tagName === 'IFRAME') {
        try {
          html = targetEditor.contentDocument.body.innerHTML;
        } catch (error) {
          console.error(CONFIG.MESSAGES.IFRAME_ACCESS_ERROR, error);
          return null;
        }
      } else {
        html = targetEditor.innerHTML;
      }
  
      // プレースホルダー（<p>本文</p>）の場合は空文字列を返す
      const trimmedHtml = html.trim();
      if (trimmedHtml === '<p>本文</p>' || /^<p>本文<\/p>[\s\n\r]*$/.test(trimmedHtml)) {
        return '';
      }
  
      return html;
    }
  
    /**
     * エディタにHTMLを適用
     * @param {string} html - 適用するHTML文字列
     */
    function applyHtmlToEditor(html) {
      if (!targetEditor) {
        targetEditor = findRichEditor();
      }
  
      if (!targetEditor) {
        alert(CONFIG.MESSAGES.EDITOR_NOT_FOUND);
        return;
      }
  
      // iframeの場合
      if (targetEditor.tagName === 'IFRAME') {
        try {
          targetEditor.contentDocument.body.innerHTML = html;
        } catch (error) {
          console.error(CONFIG.MESSAGES.IFRAME_WRITE_ERROR, error);
        }
        return;
      }
  
      targetEditor.innerHTML = html;
      
      // 変更イベントを発火（kintoneが変更を検知するため）
      targetEditor.dispatchEvent(new Event(CONFIG.EVENTS.INPUT, { bubbles: true }));
      targetEditor.dispatchEvent(new Event(CONFIG.EVENTS.CHANGE, { bubbles: true }));
    }
  
    /**
     * HTMLを整形（インデント付与）
     * @param {string} html - 整形するHTML文字列
     * @returns {string} 整形されたHTML文字列
     */
    function formatHtml(html) {
      if (!html || !html.trim()) {
        return html;
      }
      
      let indentLevel = 0;
      const indentString = CONFIG.HTML_FORMAT.INDENT_CHAR.repeat(CONFIG.HTML_FORMAT.INDENT_SIZE);
      
      // タグの間に改行を挿入
      let formatted = html
        .replace(/></g, '>\n<')
        .split('\n');
      
      formatted = formatted.map(line => {
        const trimmed = line.trim();
        
        // 空行はそのまま返す
        if (!trimmed) {
          return '';
        }
        
        // 閉じタグ（</tag>）の場合
        if (/^<\/[\w-]+/.test(trimmed)) {
          // まずインデントレベルを減らす
          indentLevel = Math.max(0, indentLevel - 1);
          const indent = indentString.repeat(indentLevel);
          return indent + trimmed;
        }
        
        // 自己終了タグ（<tag/>）の場合
        if (/^<[\w-]+[^>]*\/\s*>/.test(trimmed)) {
          const indent = indentString.repeat(indentLevel);
          return indent + trimmed;
        }
        
        // 開きタグ（<tag>）の場合
        if (/^<[\w-]+/.test(trimmed)) {
          const indent = indentString.repeat(indentLevel);
          // インデントを適用してからレベルを増やす
          indentLevel++;
          return indent + trimmed;
        }
        
        // その他の行（テキストなど）
        const indent = indentString.repeat(indentLevel);
        return indent + trimmed;
      });
      
      return formatted.join('\n');
    }
  
    /**
     * パネルを表示
     */
    function showHtmlEditorPanel() {
      const isNewPanel = !htmlEditorPanel;
      
      if (!htmlEditorPanel) {
        htmlEditorPanel = createHtmlEditorPanel();
      }

      if (!document.body.contains(htmlEditorPanel)) {
        document.body.appendChild(htmlEditorPanel);
      }

      // パネルを表示
      htmlEditorPanel.style.display = 'flex';
      
      // aria-hiddenを削除（フォーカス可能な要素があるため）
      htmlEditorPanel.removeAttribute('aria-hidden');
      
      // aria-hiddenが再設定されるのを監視して削除
      if (!htmlEditorPanel._ariaHiddenObserver) {
        htmlEditorPanel._ariaHiddenObserver = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
              if (htmlEditorPanel.style.display !== 'none' && 
                  htmlEditorPanel.getAttribute('aria-hidden') === 'true') {
                htmlEditorPanel.removeAttribute('aria-hidden');
              }
            }
          });
        });
        htmlEditorPanel._ariaHiddenObserver.observe(htmlEditorPanel, {
          attributes: true,
          attributeFilter: ['aria-hidden']
        });
      }
      
      // 最小化アイコンを非表示
      const minimizeIcon = document.getElementById(CONFIG.MINIMIZE_ICON_ID);
      if (minimizeIcon) {
        minimizeIcon.style.display = 'none';
      }

      // エディタの内容を取得して表示（初回表示時のみ、またはtextareaが空の場合のみ）
      setTimeout(() => {
        const textarea = findElementByClass(htmlEditorPanel, CONFIG.CLASSES.TEXTAREA);
        const statusBar = findElementByClass(htmlEditorPanel, CONFIG.CLASSES.STATUS_BAR);
        
        // パネルが新しく作成された場合、またはtextareaが空の場合のみエディタから内容を取得
        if (isNewPanel || !textarea.value.trim()) {
          const html = getEditorHtml();
          
          if (html !== null) {
            textarea.value = formatHtml(html);
            statusBar.textContent = `${CONFIG.MESSAGES.EDITOR_DETECTED} - ${new Date().toLocaleTimeString()}`;
          } else {
            statusBar.textContent = CONFIG.MESSAGES.EDITOR_NOT_DETECTED;
          }
        } else {
          // 既存の内容がある場合は、ステータスバーだけ更新
          statusBar.textContent = CONFIG.BUTTON_TEXTS.READY;
        }
      }, CONFIG.DIALOG_RENDER_DELAY);
    }
  
    /**
     * パネルを最小化（非表示）
     */
    function minimizeHtmlEditorPanel() {
      if (htmlEditorPanel && document.body.contains(htmlEditorPanel)) {
        htmlEditorPanel.style.display = 'none';
        // 非表示時はaria-hiddenを設定（ただし、フォーカス可能な要素がない場合のみ）
        // 実際には非表示なので、aria-hiddenは設定しない（display: noneで十分）
        // 最小化アイコンを表示
        const minimizeIcon = document.getElementById(CONFIG.MINIMIZE_ICON_ID);
        if (minimizeIcon) {
          minimizeIcon.style.display = 'flex';
        }
      }
    }
  
    /**
     * パネルを完全に非表示（ダイアログが閉じた時など）
     */
    function hideHtmlEditorPanel() {
      if (htmlEditorPanel && document.body.contains(htmlEditorPanel)) {
        htmlEditorPanel.style.display = 'none';
        // 非表示時はaria-hiddenを削除（display: noneで十分）
        htmlEditorPanel.removeAttribute('aria-hidden');
      }
      // 最小化アイコンも非表示
      const minimizeIcon = document.getElementById(CONFIG.MINIMIZE_ICON_ID);
      if (minimizeIcon) {
        minimizeIcon.style.display = 'none';
      }
    }
  
    /**
     * ダイアログの開閉を監視するMutationObserverを初期化
     */
    function initializeDialogObserver() {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          // ダイアログが開いた時
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE &&
                node.classList?.contains(CONFIG.DIALOG_BG_CLASS)) {
              console.log(CONFIG.MESSAGES.DIALOG_OPENED);
              showHtmlEditorPanel();
            }
          });
  
          // ダイアログが閉じた時
          mutation.removedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE &&
                node.classList?.contains(CONFIG.DIALOG_BG_CLASS)) {
              console.log(CONFIG.MESSAGES.DIALOG_CLOSED);
              hideHtmlEditorPanel();
            }
          });
        });
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  
    // ========================================
    // 最小化アイコンの初期化
    // ========================================
    let minimizeIcon = createMinimizeIcon();
    document.body.appendChild(minimizeIcon);
    minimizeIcon.addEventListener('click', function() {
      showHtmlEditorPanel();
    });

    // ========================================
    // MutationObserverでダイアログ監視
    // ========================================
    initializeDialogObserver();
  
    console.log(CONFIG.MESSAGES.STARTUP);
  
  })();