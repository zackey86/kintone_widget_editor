import { CONFIG } from '../config/constants.js';

// エディタ要素の参照を保持
let targetEditor = null;

/**
 * リッチエディタの要素を探す
 * @returns {HTMLElement|null} 見つかったエディタ要素、見つからない場合はnull
 */
export function findRichEditor() {
  for (const selector of CONFIG.EDITOR_SELECTORS) {
    const editor = document.querySelector(selector);
    if (editor) {
      return editor;
    }
  }
  return null;
}

/**
 * 現在のターゲットエディタを取得
 * @returns {HTMLElement|null}
 */
export function getTargetEditor() {
  return targetEditor;
}

/**
 * ターゲットエディタを設定
 * @param {HTMLElement|null} editor
 */
export function setTargetEditor(editor) {
  targetEditor = editor;
}

/**
 * エディタからHTMLを取得
 * @returns {string|null} HTML文字列、取得できない場合はnull
 */
export function getEditorHtml() {
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
export function applyHtmlToEditor(html) {
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

