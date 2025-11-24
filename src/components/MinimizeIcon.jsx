import { useEffect, useRef } from 'react';
import { CONFIG } from '../config/constants.js';
import '../styles/editor.css';

export function MinimizeIcon({ onShow, visible }) {
  const iconRef = useRef(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    const handleClick = () => {
      onShow();
    };

    icon.addEventListener('click', handleClick);

    return () => {
      icon.removeEventListener('click', handleClick);
    };
  }, [onShow]);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // アイコンをbodyに追加（まだ追加されていない場合）
    if (!document.body.contains(icon)) {
      document.body.appendChild(icon);
    }

    // 表示/非表示を制御
    icon.style.display = visible ? 'flex' : 'none';
  }, [visible]);

  return <div ref={iconRef} id={CONFIG.MINIMIZE_ICON_ID} style={{ display: 'none' }} />;
}

