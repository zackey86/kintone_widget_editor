import { CONFIG } from '../config/constants.js';

/**
 * インデントを追加/削除
 * @param {string} text - テキスト
 * @param {number} start - 選択開始位置
 * @param {number} end - 選択終了位置
 * @param {boolean} unindent - trueの場合はアンインデント
 * @returns {Object} { text: string, newStart: number, newEnd: number }
 */
export function handleIndent(text, start, end, unindent = false) {
  const lines = text.split('\n');
  
  // 選択範囲の行を特定
  let startLine = 0;
  let endLine = 0;
  let charCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length;
    const lineEnd = charCount + lineLength;
    const isLastLine = i === lines.length - 1;
    
    // 開始行の特定
    if (charCount <= start && start <= lineEnd) {
      startLine = i;
    }
    
    // 終了行の特定（最後の行の場合は改行文字がないため、<= で判定）
    if (charCount <= end && (isLastLine ? end <= lineEnd : end <= lineEnd + 1)) {
      endLine = i;
      if (end <= lineEnd) {
        break;
      }
    }
    
    // 次の行の開始位置（改行文字を含む）
    charCount += lineLength + (isLastLine ? 0 : 1);
  }
  
  const indentString = CONFIG.HTML_FORMAT.INDENT_CHAR.repeat(CONFIG.HTML_FORMAT.INDENT_SIZE);
  let newLines = [...lines];
  
  // 元のテキストでの各行の開始位置を計算
  let originalLineStartPositions = [];
  charCount = 0;
  for (let i = 0; i < lines.length; i++) {
    originalLineStartPositions[i] = charCount;
    charCount += lines[i].length + (i < lines.length - 1 ? 1 : 0);
  }
  
  // 選択範囲の開始位置と終了位置を行内の相対位置に変換
  const startOffset = start - originalLineStartPositions[startLine];
  const endOffset = end - originalLineStartPositions[endLine];
  
  // インデントの追加/削除と、各行の長さの変化を記録
  let lineLengthChanges = new Array(lines.length).fill(0);
  
  for (let i = startLine; i <= endLine; i++) {
    if (unindent) {
      // アンインデント
      const originalLine = newLines[i];
      let removed = 0;
      
      if (originalLine.startsWith(indentString)) {
        newLines[i] = originalLine.substring(indentString.length);
        removed = indentString.length;
      } else if (originalLine.match(/^\s+/)) {
        // 部分的なインデントがある場合
        const leadingSpaces = originalLine.match(/^\s*/)[0];
        const removeCount = Math.min(indentString.length, leadingSpaces.length);
        newLines[i] = originalLine.substring(removeCount);
        removed = removeCount;
      }
      
      lineLengthChanges[i] = -removed;
    } else {
      // インデント追加
      newLines[i] = indentString + newLines[i];
      lineLengthChanges[i] = indentString.length;
    }
  }
  
  // 新しいテキストを生成
  const newText = newLines.join('\n');
  
  // 新しいテキストでの各行の開始位置を計算
  let newLineStartPositions = [];
  charCount = 0;
  for (let i = 0; i < newLines.length; i++) {
    newLineStartPositions[i] = charCount;
    charCount += newLines[i].length + (i < newLines.length - 1 ? 1 : 0);
  }
  
  // 選択範囲の開始位置と終了位置を計算
  let newStart, newEnd;
  
  if (unindent) {
    // アンインデントの場合
    const startLineRemoved = Math.abs(lineLengthChanges[startLine]);
    if (startOffset >= startLineRemoved) {
      newStart = newLineStartPositions[startLine] + (startOffset - startLineRemoved);
    } else {
      newStart = newLineStartPositions[startLine];
    }
    
    const endLineRemoved = Math.abs(lineLengthChanges[endLine]);
    if (endOffset >= endLineRemoved) {
      newEnd = newLineStartPositions[endLine] + (endOffset - endLineRemoved);
    } else {
      newEnd = newLineStartPositions[endLine];
    }
  } else {
    // インデント追加の場合
    newStart = newLineStartPositions[startLine] + indentString.length + startOffset;
    newEnd = newLineStartPositions[endLine] + indentString.length + endOffset;
  }
  
  return {
    text: newText,
    newStart,
    newEnd
  };
}

