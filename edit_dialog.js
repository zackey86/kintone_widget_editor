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
      MINIMIZE_ICON_BOTTOM: '20px',
      MINIMIZE_ICON_RIGHT: '20px',
      
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
        TABS: 'editor-tabs',
        TAB: 'editor-tab',
        ACTIVE: 'active',
        CONTENT: 'editor-content',
        TEXTAREA: 'html-textarea',
        PREVIEW: 'preview-area',
        STATUS_BAR: 'status-bar',
        TITLE: 'title'
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
        READY: 'Ready'
      },
      
      // ボタンタイトル
      BUTTON_TITLES: {
        REFRESH: 'リッチエディタから再取得',
        APPLY: '変更を適用',
        CLOSE: '最小化'
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
            bottom: ${CONFIG.MINIMIZE_ICON_BOTTOM};
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
      const header = findElementByClass(panel, CONFIG.CLASSES.HEADER);
  
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
  
      // 閉じるボタン（最小化）
      closeButton.addEventListener('click', function() {
        minimizeHtmlEditorPanel();
      });
  
      // ドラッグ移動機能
      makeDraggable(panel, header);
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
  
      // iframeの場合
      if (targetEditor.tagName === 'IFRAME') {
        try {
          return targetEditor.contentDocument.body.innerHTML;
        } catch (error) {
          console.error(CONFIG.MESSAGES.IFRAME_ACCESS_ERROR, error);
          return null;
        }
      }
  
      return targetEditor.innerHTML;
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
      let formatted = html;
      let indentLevel = 0;
      const indentString = CONFIG.HTML_FORMAT.INDENT_CHAR.repeat(CONFIG.HTML_FORMAT.INDENT_SIZE);
      
      formatted = formatted
        .replace(/></g, '>\n<')
        .split('\n')
        .map(line => {
          line = line.trim();
          if (line.match(/^<\/\w/)) indentLevel--;
          const indent = indentString.repeat(Math.max(0, indentLevel));
          if (line.match(/^<\w[^>]*[^\/]>.*$/)) indentLevel++;
          if (line.match(/^<\w[^>]*\/>$/)) { /* 自己終了タグ */ }
          return indent + line;
        })
        .join('\n');
      
      return formatted;
    }
  
    /**
     * パネルを表示
     */
    function showHtmlEditorPanel() {
      if (!htmlEditorPanel) {
        htmlEditorPanel = createHtmlEditorPanel();
      }
  
      if (!document.body.contains(htmlEditorPanel)) {
        document.body.appendChild(htmlEditorPanel);
      }
  
      // パネルを表示
      htmlEditorPanel.style.display = 'flex';
      
      // 最小化アイコンを非表示
      const minimizeIcon = document.getElementById(CONFIG.MINIMIZE_ICON_ID);
      if (minimizeIcon) {
        minimizeIcon.style.display = 'none';
      }
  
      // エディタの内容を取得して表示
      setTimeout(() => {
        const html = getEditorHtml();
        const textarea = findElementByClass(htmlEditorPanel, CONFIG.CLASSES.TEXTAREA);
        const statusBar = findElementByClass(htmlEditorPanel, CONFIG.CLASSES.STATUS_BAR);
        
        if (html !== null) {
          textarea.value = formatHtml(html);
          statusBar.textContent = `${CONFIG.MESSAGES.EDITOR_DETECTED} - ${new Date().toLocaleTimeString()}`;
        } else {
          statusBar.textContent = CONFIG.MESSAGES.EDITOR_NOT_DETECTED;
        }
      }, CONFIG.DIALOG_RENDER_DELAY);
    }
  
    /**
     * パネルを最小化（非表示）
     */
    function minimizeHtmlEditorPanel() {
      if (htmlEditorPanel && document.body.contains(htmlEditorPanel)) {
        htmlEditorPanel.style.display = 'none';
        // 最小化アイコンを表示
        const minimizeIcon = document.getElementById(CONFIG.MINIMIZE_ICON_ID);
        if (minimizeIcon) {
          minimizeIcon.style.display = 'flex';
        }
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
              minimizeHtmlEditorPanel();
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