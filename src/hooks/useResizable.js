import { useEffect, useRef } from 'react';
import { findElementByClass } from '../utils/domUtils.js';
import { CONFIG } from '../config/constants.js';

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
 * 要素をリサイズ可能にするカスタムフック
 * @param {Object} options - オプション
 * @param {boolean} options.enabled - リサイズを有効にするか
 * @param {string} options.direction - リサイズ方向 ('horizontal', 'vertical', 'both')
 * @returns {Object} refオブジェクト
 */
export function useResizable({ enabled = true, direction = 'both' } = {}) {
  const elementRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // handleRefが設定されるまで待つ（最大10回試行）
    let retryCount = 0;
    const maxRetries = 10;
    let cleanup = null;

    const setupResizeHandler = () => {
      if (!elementRef.current || !handleRef.current) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(setupResizeHandler, 50);
        }
        return;
      }

      const element = elementRef.current;
      const handle = handleRef.current;
      
      console.log('useResizable: Setting up resize handler', { direction, hasElement: !!element, hasHandle: !!handle });
      
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;
      let startLeft = 0;
      let startTop = 0;

      const handleResize = (e) => {
        if (direction === 'horizontal' || direction === 'both') {
          const deltaX = e.clientX - startX;
          const width = startWidth - deltaX;
          if (width > 300) {
            element.style.width = width + 'px';
            element.style.right = 'auto';
            const newLeft = startLeft + deltaX;
            element.style.left = newLeft + 'px';
          }
        }
        
        if (direction === 'vertical' || direction === 'both') {
          const height = startHeight + (e.clientY - startY);
          if (height > 200) {
            element.style.height = height + 'px';
            element.style.maxHeight = 'none';
          }
        }
      };

      const stopResize = () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
        
        requestAnimationFrame(() => {
          updateEditorAreaHeight(element);
        });
      };

      const handleMouseDown = (e) => {
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
      };

      handle.addEventListener('mousedown', handleMouseDown);

      cleanup = () => {
        handle.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      };
    };

    setupResizeHandler();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [enabled, direction]);

  return { elementRef, handleRef };
}

