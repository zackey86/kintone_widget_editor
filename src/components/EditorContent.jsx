import { useRef, useEffect } from 'react';
import { CONFIG } from '../config/constants.js';
import { handleIndent } from '../utils/indentUtils.js';
import '../styles/editor.css';

export function EditorContent({ html, setHtml, activeTab }) {
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (activeTab === CONFIG.TAB_TYPES.PREVIEW && previewRef.current) {
      previewRef.current.innerHTML = html;
    }
  }, [activeTab, html]);

  const handleKeyDown = (e) => {
    // Tabキーでインデントを追加
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const result = handleIndent(html, start, end, e.shiftKey);
        setHtml(result.text);
        setTimeout(() => {
          textarea.setSelectionRange(result.newStart, result.newEnd);
        }, 0);
      }
    }
  };

  return (
    // エディタコンテンツエリア
    <div className={CONFIG.CLASSES.CONTENT}>
      <textarea
        ref={textareaRef}
        className={CONFIG.CLASSES.TEXTAREA}
        spellCheck="false"
        placeholder={CONFIG.PLACEHOLDER}
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ display: activeTab === CONFIG.TAB_TYPES.HTML ? 'block' : 'none' }}
      />
      <div
        ref={previewRef}
        className={CONFIG.CLASSES.PREVIEW}
        style={{ display: activeTab === CONFIG.TAB_TYPES.PREVIEW ? 'block' : 'none' }}
      />
    </div>
  );
}

