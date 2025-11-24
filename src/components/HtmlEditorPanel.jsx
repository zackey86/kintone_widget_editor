import { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../config/constants.js';
import { useEditor } from '../hooks/useEditor.js';
import { useDraggable } from '../hooks/useDraggable.js';
import { useResizable } from '../hooks/useResizable.js';
import { EditorHeader } from './EditorHeader.jsx';
import { EditorTabs } from './EditorTabs.jsx';
import { EditorContent } from './EditorContent.jsx';
import { StatusBar } from './StatusBar.jsx';
import { findElementByClass } from '../utils/domUtils.js';
import '../styles/editor.css';

export function HtmlEditorPanel({ onMinimize }) {
  const [activeTab, setActiveTab] = useState(CONFIG.TAB_TYPES.HTML);
  const [isMaximized, setIsMaximized] = useState(false);
  const [savedPanelState, setSavedPanelState] = useState(null);
  
  const panelRef = useRef(null);
  const resizeLeftHandleRef = useRef(null);
  const resizeBottomHandleRef = useRef(null);
  const resizeCornerHandleRef = useRef(null);
  const editorContentRef = useRef(null);
  
  const { html, setHtml, statusMessage, setStatusMessage, refresh, apply } = useEditor();
  
  const { elementRef: dragElementRef, handleRef: dragHandleRef } = useDraggable({ enabled: true });
  const { elementRef: resizeLeftRef, handleRef: resizeLeftHandleRefFromHook } = useResizable({ enabled: true, direction: 'horizontal' });
  const { elementRef: resizeBottomRef, handleRef: resizeBottomHandleRefFromHook } = useResizable({ enabled: true, direction: 'vertical' });
  const { elementRef: resizeCornerRef, handleRef: resizeCornerHandleRefFromHook } = useResizable({ enabled: true, direction: 'both' });

  // パネルとドラッグハンドルのrefを設定
  useEffect(() => {
    if (panelRef.current) {
      dragElementRef.current = panelRef.current;
      resizeLeftRef.current = panelRef.current;
      resizeBottomRef.current = panelRef.current;
      resizeCornerRef.current = panelRef.current;
      
      // ヘッダーをドラッグハンドルとして設定
      const header = findElementByClass(panelRef.current, CONFIG.CLASSES.HEADER);
      if (header) {
        dragHandleRef.current = header;
      }
    }
  }, []);

  // リサイズハンドルのrefを設定（DOMがレンダリングされた後に実行）
  useEffect(() => {
    const setupResizeHandles = () => {
      if (resizeLeftHandleRef.current) {
        resizeLeftHandleRefFromHook.current = resizeLeftHandleRef.current;
      }
      if (resizeBottomHandleRef.current) {
        resizeBottomHandleRefFromHook.current = resizeBottomHandleRef.current;
      }
      if (resizeCornerHandleRef.current) {
        resizeCornerHandleRefFromHook.current = resizeCornerHandleRef.current;
      }
    };

    // DOMが完全にレンダリングされた後に実行
    const timeoutId = setTimeout(setupResizeHandles, 0);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [resizeLeftHandleRefFromHook, resizeBottomHandleRefFromHook, resizeCornerHandleRefFromHook]);

  // 編集エリアの高さを更新（手動リサイズ時のみ呼び出す）
  const updateEditorAreaHeight = () => {
    const panel = panelRef.current;
    if (!panel) return;

    const textarea = findElementByClass(panel, CONFIG.CLASSES.TEXTAREA);
    const preview = findElementByClass(panel, CONFIG.CLASSES.PREVIEW);
    
    if (!textarea || !preview) return;
    
    const panelHeight = panel.offsetHeight;
    if (!panelHeight || panelHeight === 0) return;
    
    const header = findElementByClass(panel, CONFIG.CLASSES.HEADER);
    const tabs = findElementByClass(panel, CONFIG.CLASSES.TABS);
    const statusBar = findElementByClass(panel, CONFIG.CLASSES.STATUS_BAR);
    
    const headerHeight = header ? header.offsetHeight : 0;
    const tabsHeight = tabs ? tabs.offsetHeight : 0;
    const statusBarHeight = statusBar ? statusBar.offsetHeight : 0;
    
    const availableHeight = panelHeight - headerHeight - tabsHeight - statusBarHeight;
    const editorHeight = Math.max(200, availableHeight);
    
    // 高さを設定（CSSの固定高さを上書き）
    textarea.style.height = editorHeight + 'px';
    preview.style.height = editorHeight + 'px';
  };

  // 最大化/復元の切り替え
  const handleMaximize = () => {
    const panel = panelRef.current;
    if (!panel) return;

    const newIsMaximized = !isMaximized;
    
    if (newIsMaximized) {
      // 最大化
      const computedStyle = document.defaultView.getComputedStyle(panel);
      setSavedPanelState({
        width: panel.style.width || computedStyle.width,
        height: panel.style.height || computedStyle.height,
        top: panel.style.top || computedStyle.top,
        left: panel.style.left || computedStyle.left,
        right: panel.style.right || computedStyle.right,
        maxHeight: panel.style.maxHeight || computedStyle.maxHeight
      });
      
      panel.classList.add(CONFIG.CLASSES.MAXIMIZED);
      // 最大化時は次のフレームで高さを更新
      requestAnimationFrame(() => {
        updateEditorAreaHeight();
      });
    } else {
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
      
      // 復元時は次のフレームで高さを更新
      requestAnimationFrame(() => {
        updateEditorAreaHeight();
      });
    }
    
    setIsMaximized(newIsMaximized);
  };

  // 初回マウント時にエディタからHTMLを取得と高さを設定
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // パネルの初期高さを確実に設定するため、複数回試行
    let retryCount = 0;
    const maxRetries = 10;
    
    const initHeight = () => {
      const panelHeight = panel.offsetHeight;
      // パネルの高さが取得できたら高さを設定
      if (panelHeight > 0) {
        updateEditorAreaHeight();
        // エディタからHTMLを取得
        refresh();
      } else if (retryCount < maxRetries) {
        // まだ高さが取得できない場合は再試行
        retryCount++;
        setTimeout(initHeight, 50);
      } else {
        // 最大試行回数に達した場合でも、デフォルト高さで設定
        console.warn('Panel height not detected, using default');
        updateEditorAreaHeight();
        refresh();
      }
    };

    // 最初の試行（少し遅延させてDOMが完全にレンダリングされるのを待つ）
    setTimeout(initHeight, CONFIG.DIALOG_RENDER_DELAY);
  }, []);

  // aria-hiddenの監視
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          if (panel.style.display !== 'none' && 
              panel.getAttribute('aria-hidden') === 'true') {
            panel.removeAttribute('aria-hidden');
          }
        }
      });
    });

    observer.observe(panel, {
      attributes: true,
      attributeFilter: ['aria-hidden']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleApply = () => {
    apply();
  };

  const handleRefresh = () => {
    refresh();
  };

  const handleAutoIndent = () => {
    // CodeMirrorの自動インデント機能を使用
    if (editorContentRef.current && editorContentRef.current.autoIndent) {
      editorContentRef.current.autoIndent();
      setStatusMessage(`✓ 自動インデント適用 - ${new Date().toLocaleTimeString()}`);
    }
  };

  return (
    <div
      ref={panelRef}
      id={CONFIG.PANEL_ID}
    >
      <EditorHeader
        onApply={handleApply}
        onRefresh={handleRefresh}
        onAutoIndent={handleAutoIndent}
        onMaximize={handleMaximize}
        onClose={onMinimize}
        isMaximized={isMaximized}
      />
      <div className={CONFIG.CLASSES.BODY}>
        <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <EditorContent ref={editorContentRef} html={html} setHtml={setHtml} activeTab={activeTab} />
      </div>
      <StatusBar message={statusMessage} />
      <div 
        ref={resizeLeftHandleRef}
        className={`${CONFIG.CLASSES.RESIZE_HANDLE} ${CONFIG.CLASSES.RESIZE_HANDLE_LEFT}`} 
      />
      <div 
        ref={resizeBottomHandleRef}
        className={`${CONFIG.CLASSES.RESIZE_HANDLE} ${CONFIG.CLASSES.RESIZE_HANDLE_BOTTOM}`} 
      />
      <div 
        ref={resizeCornerHandleRef}
        className={`${CONFIG.CLASSES.RESIZE_HANDLE} ${CONFIG.CLASSES.RESIZE_HANDLE_CORNER}`} 
      />
    </div>
  );
}

