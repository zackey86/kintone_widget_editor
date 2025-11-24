import { CONFIG } from '../config/constants.js';
import '../styles/editor.css';

export function EditorButtons({ onApply, onRefresh, onAutoIndent, onMaximize, onClose, isMaximized }) {
  return (
    <div className={CONFIG.CLASSES.BUTTONS}>
      {/* 最大化/元に戻すボタン */}
      <button
        className={`${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.MAXIMIZE}`}
        title={isMaximized ? CONFIG.BUTTON_TITLES.RESTORE : CONFIG.BUTTON_TITLES.MAXIMIZE}
        onClick={onMaximize}
      >
        {isMaximized ? CONFIG.BUTTON_TEXTS.RESTORE : CONFIG.BUTTON_TEXTS.MAXIMIZE}
      </button>
      {/* 自動整形ボタン */}
      <button
        className={`${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.AUTO_INDENT}`}
        title={CONFIG.BUTTON_TITLES.AUTO_INDENT}
        onClick={onAutoIndent}
      >
        {CONFIG.BUTTON_TEXTS.AUTO_INDENT}
      </button>
      {/* リフレッシュボタン */}
      <button
        className={`${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.REFRESH}`}
        title={CONFIG.BUTTON_TITLES.REFRESH}
        onClick={onRefresh}
      >
        {CONFIG.BUTTON_TEXTS.REFRESH}
      </button>
      {/* 適用ボタン */}
      <button
        className={`${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.APPLY}`}
        title={CONFIG.BUTTON_TITLES.APPLY}
        onClick={onApply}
      >
        {CONFIG.BUTTON_TEXTS.APPLY}
      </button>
      {/* 閉じるボタン */}
      <button
        className={`${CONFIG.CLASSES.BUTTON} ${CONFIG.CLASSES.CLOSE}`}
        title={CONFIG.BUTTON_TITLES.CLOSE}
        onClick={onClose}
      >
        {CONFIG.BUTTON_TEXTS.CLOSE}
      </button>
    </div>
  );
}

