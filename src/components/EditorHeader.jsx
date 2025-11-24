import { CONFIG } from '../config/constants.js';
import { EditorButtons } from './EditorButtons.jsx';
import '../styles/editor.css';

export function EditorHeader({ onApply, onRefresh, onAutoIndent, onMaximize, onClose, isMaximized }) {
  return (
    <div className={CONFIG.CLASSES.HEADER}>
      <span className={CONFIG.CLASSES.TITLE}>HTML Editor</span>
      <EditorButtons
        onApply={onApply}
        onRefresh={onRefresh}
        onAutoIndent={onAutoIndent}
        onMaximize={onMaximize}
        onClose={onClose}
        isMaximized={isMaximized}
      />
    </div>
  );
}

