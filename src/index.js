import { createRoot } from 'react-dom/client';
import { HtmlEditorPanel } from './components/HtmlEditorPanel.jsx';
import { MinimizeIcon } from './components/MinimizeIcon.jsx';
import { CONFIG } from './config/constants.js';
import './styles/editor.css';

let panelRoot = null;
let minimizeIconRoot = null;
let panelContainer = null;
let minimizeIconContainer = null;
let isMinimized = false;

/**
 * パネルを表示
 */
function showHtmlEditorPanel() {
  if (!panelContainer) {
    panelContainer = document.createElement('div');
    panelContainer.id = CONFIG.PANEL_ID + '-container';
    panelContainer.style.position = 'fixed';
    panelContainer.style.top = '0';
    panelContainer.style.left = '0';
    panelContainer.style.width = '100%';
    panelContainer.style.height = '100%';
    panelContainer.style.pointerEvents = 'none';
    panelContainer.style.zIndex = '99998';
    document.body.appendChild(panelContainer);
  }

  if (!panelRoot) {
    panelRoot = createRoot(panelContainer);
  }

  panelContainer.style.display = 'block';
  panelContainer.style.pointerEvents = 'auto';
  panelContainer.removeAttribute('aria-hidden');

  // 最小化アイコンを非表示
  isMinimized = false;
  if (minimizeIconContainer && minimizeIconRoot) {
    minimizeIconRoot.render(
      <MinimizeIcon onShow={showHtmlEditorPanel} visible={false} />
    );
  }

  panelRoot.render(
    <HtmlEditorPanel onMinimize={minimizeHtmlEditorPanel} />
  );
}

/**
 * パネルを最小化（非表示）
 */
function minimizeHtmlEditorPanel() {
  if (panelContainer) {
    panelContainer.style.display = 'none';
  }

  // 最小化アイコンを表示
  isMinimized = true;
  if (minimizeIconContainer && minimizeIconRoot) {
    minimizeIconRoot.render(
      <MinimizeIcon onShow={showHtmlEditorPanel} visible={true} />
    );
  }
}

/**
 * パネルを完全に非表示（ダイアログが閉じた時など）
 */
function hideHtmlEditorPanel() {
  if (panelContainer) {
    panelContainer.style.display = 'none';
    panelContainer.removeAttribute('aria-hidden');
  }

  // 最小化アイコンも非表示
  isMinimized = false;
  if (minimizeIconContainer && minimizeIconRoot) {
    minimizeIconRoot.render(
      <MinimizeIcon onShow={showHtmlEditorPanel} visible={false} />
    );
  }
}

/**
 * ダイアログの開閉を監視するMutationObserverを初期化
 */
function initializeDialogObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // ダイアログが開いた時
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE &&
            node.classList?.contains(CONFIG.DIALOG_BG_CLASS)) {
          console.log(CONFIG.MESSAGES.DIALOG_OPENED);
          showHtmlEditorPanel();
        }
      });

      // ダイアログが閉じた時
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE &&
            node.classList?.contains(CONFIG.DIALOG_BG_CLASS)) {
          console.log(CONFIG.MESSAGES.DIALOG_CLOSED);
          hideHtmlEditorPanel();
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * 最小化アイコンの初期化
 */
function initializeMinimizeIcon() {
  if (!minimizeIconContainer) {
    minimizeIconContainer = document.createElement('div');
    minimizeIconContainer.id = CONFIG.MINIMIZE_ICON_ID + '-container';
    document.body.appendChild(minimizeIconContainer);
  }

  if (!minimizeIconRoot) {
    minimizeIconRoot = createRoot(minimizeIconContainer);
  }

  minimizeIconRoot.render(
    <MinimizeIcon onShow={showHtmlEditorPanel} visible={false} />
  );
}

// ========================================
// 初期化
// ========================================
initializeMinimizeIcon();
initializeDialogObserver();

console.log(CONFIG.MESSAGES.STARTUP);

