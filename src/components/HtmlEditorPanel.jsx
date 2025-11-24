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
  const { html, setHtml, statusMessage, setStatusMessage, refresh, apply, autoIndent } = useEditor();
  
  const { elementRef: dragElementRef, handleRef: dragHandleRef } = useDraggable({ enabled: true });
  const { elementRef: resizeLeftRef, handleRef: resizeLeftHandleRef } = useResizable({ enabled: true, direction: 'horizontal' });
  const { elementRef: resizeBottomRef, handleRef: resizeBottomHandleRef } = useResizable({ enabled: true, direction: 'vertical' });
  const { elementRef: resizeCornerRef, handleRef: resizeCornerHandleRef } = useResizable({ enabled: true, direction: 'both' });

  // パネルとドラッグハンドルのrefを設定
  useEffect(() => {
    if (panelRef.current) {
      dragElementRef.current = panelRef.current;
      resizeLeftRef.current = panelRef.current;
      resizeBottomRef.current = panelRef.current;
      resizeCornerRef.current = panelRef.current;
    }
  }, [dragElementRef, resizeLeftRef, resizeBottomRef, resizeCornerRef]);

  // ヘッダーをドラッグハンドルとして設定
  useEffect(() => {
    if (panelRef.current) {
      const header = findElementByClass(panelRef.current, CONFIG.CLASSES.HEADER);
      if (header) {
        dragHandleRef.current = header;
      }
    }
  }, [dragHandleRef]);

  // リサイズハンドルの設定
  useEffect(() => {
    if (panelRef.current) {
      const leftHandle = findElementByClass(panelRef.current, CONFIG.CLASSES.RESIZE_HANDLE_LEFT);
      const bottomHandle = findElementByClass(panelRef.current, CONFIG.CLASSES.RESIZE_HANDLE_BOTTOM);
      const cornerHandle = findElementByClass(panelRef.current, CONFIG.CLASSES.RESIZE_HANDLE_CORNER);
      
      if (leftHandle) resizeLeftHandleRef.current = leftHandle;
      if (bottomHandle) resizeBottomHandleRef.current = bottomHandle;
      if (cornerHandle) resizeCornerHandleRef.current = cornerHandle;
    }
  }, [resizeLeftHandleRef, resizeBottomHandleRef, resizeCornerHandleRef]);

  // 編集エリアの高さを更新
  const updateEditorAreaHeight = () => {
    const panel = panelRef.current;
    if (!panel) return;

    const textarea = findElementByClass(panel, CONFIG.CLASSES.TEXTAREA);
    const preview = findElementByClass(panel, CONFIG.CLASSES.PREVIEW);
    
    if (!textarea || !preview) return;
    
    const panelHeight = panel.offsetHeight || parseInt(document.defaultView.getComputedStyle(panel).height, 10);
    const header = findElementByClass(panel, CONFIG.CLASSES.HEADER);
    const tabs = findElementByClass(panel, CONFIG.CLASSES.TABS);
    const statusBar = findElementByClass(panel, CONFIG.CLASSES.STATUS_BAR);
    
    const headerHeight = header ? header.offsetHeight : 0;
    const tabsHeight = tabs ? tabs.offsetHeight : 0;
    const statusBarHeight = statusBar ? statusBar.offsetHeight : 0;
    
    const availableHeight = panelHeight - headerHeight - tabsHeight - statusBarHeight;
    const editorHeight = Math.max(200, availableHeight);
    
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
      setTimeout(() => {
        updateEditorAreaHeight();
      }, 0);
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
      
      setTimeout(() => {
        updateEditorAreaHeight();
      }, 0);
    }
    
    setIsMaximized(newIsMaximized);
  };

  // 初回マウント時にエディタからHTMLを取得
  useEffect(() => {
    const timer = setTimeout(() => {
      refresh();
    }, CONFIG.DIALOG_RENDER_DELAY);
    
    return () => clearTimeout(timer);
  }, []);

  // リサイズ後に高さを更新
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const resizeObserver = new ResizeObserver(() => {
      updateEditorAreaHeight();
    });

    resizeObserver.observe(panel);

    return () => {
      resizeObserver.disconnect();
    };
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
    autoIndent(html);
  };

  return (
    <div
      ref={panelRef}
      id={CONFIG.PANEL_ID}
      style={{ display: 'flex' }}
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
        <EditorContent html={html} setHtml={setHtml} activeTab={activeTab} />
      </div>
      <StatusBar message={statusMessage} />
      <div className={`${CONFIG.CLASSES.RESIZE_HANDLE} ${CONFIG.CLASSES.RESIZE_HANDLE_LEFT}`} />
      <div className={`${CONFIG.CLASSES.RESIZE_HANDLE} ${CONFIG.CLASSES.RESIZE_HANDLE_BOTTOM}`} />
      <div className={`${CONFIG.CLASSES.RESIZE_HANDLE} ${CONFIG.CLASSES.RESIZE_HANDLE_CORNER}`} />
    </div>
  );
}

