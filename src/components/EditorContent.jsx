import { useRef, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html as htmlLang } from '@codemirror/lang-html';
import { lineNumbers, keymap } from '@codemirror/view';
import { bracketMatching, foldGutter, indentOnInput, indentUnit, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import { indentSelection } from '@codemirror/commands';
import { CONFIG } from '../config/constants.js';
import '../styles/editor.css';

export const EditorContent = forwardRef(function EditorContent({ html, setHtml, activeTab }, ref) {
  const previewRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (activeTab === CONFIG.TAB_TYPES.PREVIEW && previewRef.current) {
      previewRef.current.innerHTML = html;
    }
  }, [activeTab, html]);

  // CodeMirrorの拡張機能を設定
  const extensions = useMemo(() => [
    htmlLang(), // HTML言語サポート（シンタックスハイライトを含む）
    lineNumbers(), // 行番号
    bracketMatching(), // 括弧マッチング
    foldGutter(), // コード折りたたみ
    indentOnInput(), // 自動インデント
    indentUnit.of(CONFIG.HTML_FORMAT.INDENT_CHAR.repeat(CONFIG.HTML_FORMAT.INDENT_SIZE)), // インデント単位
    syntaxHighlighting(defaultHighlightStyle), // シンタックスハイライト（デフォルトスタイル）
    keymap.of(searchKeymap) // 検索・置換
  ], []);

  // 自動インデント関数を親コンポーネントに公開
  useImperativeHandle(ref, () => ({
    autoIndent: () => {
      const view = viewRef.current;
      if (!view) return;

      const doc = view.state.doc;
      const docLength = doc.length;
      if (docLength === 0) return;

      // ドキュメント全体を選択してから自動インデントを適用
      const transaction = view.state.update({
        selection: { anchor: 0, head: docLength }
      });
      view.dispatch(transaction);

      // 選択範囲全体に自動インデントを適用
      indentSelection({ state: view.state, dispatch: view.dispatch });
    }
  }));

  return (
    // エディタコンテンツエリア
    <div className={CONFIG.CLASSES.CONTENT}>
      <div
        className={CONFIG.CLASSES.TEXTAREA}
        style={{ 
          display: activeTab === CONFIG.TAB_TYPES.HTML ? 'flex' : 'none',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <CodeMirror
          value={html}
          onChange={(value) => setHtml(value)}
          extensions={extensions}
          placeholder={CONFIG.PLACEHOLDER}
          basicSetup={false}
          height="100%"
          onCreateEditor={(view) => {
            viewRef.current = view;
          }}
        />
      </div>
      <div
        ref={previewRef}
        className={CONFIG.CLASSES.PREVIEW}
        style={{ display: activeTab === CONFIG.TAB_TYPES.PREVIEW ? 'block' : 'none' }}
      />
    </div>
  );
});

