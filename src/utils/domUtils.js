/**
 * 要素内でクラス名で要素を検索
 * @param {HTMLElement} parent - 親要素
 * @param {string} className - クラス名
 * @returns {HTMLElement|null} 見つかった要素、見つからない場合はnull
 */
export function findElementByClass(parent, className) {
  return parent.querySelector(`.${className}`);
}

/**
 * 要素内でクラス名で複数の要素を検索
 * @param {HTMLElement} parent - 親要素
 * @param {string} className - クラス名
 * @returns {NodeList} 見つかった要素のリスト
 */
export function findElementsByClass(parent, className) {
  return parent.querySelectorAll(`.${className}`);
}

