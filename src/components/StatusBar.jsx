import { CONFIG } from '../config/constants.js';
import '../styles/editor.css';

export function StatusBar({ message }) {
  return (
    <div className={CONFIG.CLASSES.STATUS_BAR}>
      {message || CONFIG.BUTTON_TEXTS.READY}
    </div>
  );
}

