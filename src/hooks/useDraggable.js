import { useEffect, useRef } from 'react';

/**
 * 要素をドラッグ可能にするカスタムフック
 * @param {Object} options - オプション
 * @param {boolean} options.enabled - ドラッグを有効にするか
 * @returns {Object} refオブジェクト
 */
export function useDraggable({ enabled = true } = {}) {
  const elementRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    if (!enabled || !elementRef.current || !handleRef.current) {
      return;
    }

    const element = elementRef.current;
    const handle = handleRef.current;
    
    let deltaX = 0;
    let deltaY = 0;
    let initialMouseX = 0;
    let initialMouseY = 0;

    const handleDragStart = (event) => {
      if (event.target.tagName === 'BUTTON') return;
      event.preventDefault();
      initialMouseX = event.clientX;
      initialMouseY = event.clientY;
      document.onmouseup = handleDragEnd;
      document.onmousemove = handleDragMove;
    };

    const handleDragMove = (event) => {
      event.preventDefault();
      deltaX = initialMouseX - event.clientX;
      deltaY = initialMouseY - event.clientY;
      initialMouseX = event.clientX;
      initialMouseY = event.clientY;
      element.style.top = (element.offsetTop - deltaY) + "px";
      element.style.left = (element.offsetLeft - deltaX) + "px";
      element.style.right = 'auto';
    };

    const handleDragEnd = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    handle.onmousedown = handleDragStart;

    return () => {
      handle.onmousedown = null;
      document.onmouseup = null;
      document.onmousemove = null;
    };
  }, [enabled]);

  return { elementRef, handleRef };
}

