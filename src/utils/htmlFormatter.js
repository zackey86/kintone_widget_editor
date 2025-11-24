import { CONFIG } from '../config/constants.js';

/**
 * HTMLを整形（インデント付与）
 * @param {string} html - 整形するHTML文字列
 * @returns {string} 整形されたHTML文字列
 */
export function formatHtml(html) {
  if (!html || !html.trim()) {
    return html;
  }
  
  let indentLevel = 0;
  const indentString = CONFIG.HTML_FORMAT.INDENT_CHAR.repeat(CONFIG.HTML_FORMAT.INDENT_SIZE);
  
  // タグの間に改行を挿入
  let formatted = html
    .replace(/></g, '>\n<')
    .split('\n');
  
  formatted = formatted.map(line => {
    const trimmed = line.trim();
    
    // 空行はそのまま返す
    if (!trimmed) {
      return '';
    }
    
    // 閉じタグ（</tag>）の場合
    if (/^<\/[\w-]+/.test(trimmed)) {
      // まずインデントレベルを減らす
      indentLevel = Math.max(0, indentLevel - 1);
      const indent = indentString.repeat(indentLevel);
      return indent + trimmed;
    }
    
    // 自己終了タグ（<tag/>）の場合
    if (/^<[\w-]+[^>]*\/\s*>/.test(trimmed)) {
      const indent = indentString.repeat(indentLevel);
      return indent + trimmed;
    }
    
    // 開きタグ（<tag>）の場合
    if (/^<[\w-]+/.test(trimmed)) {
      const indent = indentString.repeat(indentLevel);
      // インデントを適用してからレベルを増やす
      indentLevel++;
      return indent + trimmed;
    }
    
    // その他の行（テキストなど）
    const indent = indentString.repeat(indentLevel);
    return indent + trimmed;
  });
  
  return formatted.join('\n');
}

