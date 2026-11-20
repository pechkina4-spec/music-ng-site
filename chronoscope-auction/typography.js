(() => {
  'use strict';
  const selector = 'h1, h2, .primary, .secondary, .person-name > span, #celebration strong';
  function applyCapitals() {
    document.querySelectorAll(selector).forEach(element => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentElement.closest('.legend-initial') && /\p{Lu}/u.test(node.textContent)) nodes.push(node);
      }
      for (const node of nodes) {
        const fragment = document.createDocumentFragment();
        for (const part of node.textContent.split(/(\p{Lu}+)/u)) {
          if (!part) continue;
          if (/^\p{Lu}/u.test(part)) {
            const capital = document.createElement('span');
            capital.className = 'legend-initial';
            capital.textContent = part;
            fragment.append(capital);
          } else fragment.append(document.createTextNode(part));
        }
        node.replaceWith(fragment);
      }
    });
  }
  applyCapitals();
  // Skip decorated text so dynamic captions never acquire nested size increases.
  for (const id of ['auction', 'dice-dialog']) {
    new MutationObserver(applyCapitals).observe(document.getElementById(id), {subtree:true, childList:true, characterData:true});
  }
})();
