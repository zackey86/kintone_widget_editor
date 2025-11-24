import { useState, useCallback } from 'react';
import { getEditorHtml, applyHtmlToEditor } from '../utils/editorUtils.js';
import { formatHtml } from '../utils/htmlFormatter.js';
import { CONFIG } from '../config/constants.js';

/**
 * エディタ操作のカスタムフック
 * @returns {Object} エディタ操作の関数と状態
 */
export function useEditor() {
  const [html, setHtml] = useState('');
  const [statusMessage, setStatusMessage] = useState(CONFIG.BUTTON_TEXTS.READY);

  /**
   * エディタからHTMLを取得
   */
  const refresh = useCallback(() => {
    const editorHtml = getEditorHtml();
    if (editorHtml !== null) {
      const formatted = formatHtml(editorHtml);
      setHtml(formatted);
      setStatusMessage(`${CONFIG.MESSAGES.REFRESHED} - ${new Date().toLocaleTimeString()}`);
    } else {
      setStatusMessage(CONFIG.MESSAGES.EDITOR_NOT_DETECTED);
    }
  }, []);

  /**
   * エディタにHTMLを適用
   */
  const apply = useCallback(() => {
    applyHtmlToEditor(html);
    setStatusMessage(`${CONFIG.MESSAGES.APPLIED} - ${new Date().toLocaleTimeString()}`);
  }, [html]);

  /**
   * HTMLを自動インデント
   */
  const autoIndent = useCallback((currentHtml) => {
    const formatted = formatHtml(currentHtml);
    setHtml(formatted);
    setStatusMessage(`✓ 自動インデント適用 - ${new Date().toLocaleTimeString()}`);
  }, []);

  return {
    html,
    setHtml,
    statusMessage,
    setStatusMessage,
    refresh,
    apply,
    autoIndent
  };
}

