import { CONFIG } from '../config/constants.js';
import '../styles/editor.css';

export function EditorTabs({ activeTab, onTabChange }) {
  return (
    <div className={CONFIG.CLASSES.TABS}>
      <div
        className={`${CONFIG.CLASSES.TAB} ${activeTab === CONFIG.TAB_TYPES.HTML ? CONFIG.CLASSES.ACTIVE : ''}`}
        data-tab={CONFIG.TAB_TYPES.HTML}
        onClick={() => onTabChange(CONFIG.TAB_TYPES.HTML)}
      >
        HTML
      </div>
      <div
        className={`${CONFIG.CLASSES.TAB} ${activeTab === CONFIG.TAB_TYPES.PREVIEW ? CONFIG.CLASSES.ACTIVE : ''}`}
        data-tab={CONFIG.TAB_TYPES.PREVIEW}
        onClick={() => onTabChange(CONFIG.TAB_TYPES.PREVIEW)}
      >
        プレビュー
      </div>
    </div>
  );
}

