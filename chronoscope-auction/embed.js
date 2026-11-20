(() => {
  'use strict';
  const script = document.currentScript;
  const base = new URL('./', script.src);
  const host = document.createElement('div');
  host.style.cssText = 'width:100%;background:#100b02;min-height:640px';
  const status = document.createElement('p');
  status.textContent = 'Загружаем аукцион…';
  status.style.cssText = 'margin:0;padding:24px;color:#dfc98b;text-align:center';
  host.append(status);
  script.before(host);
  const frame = document.createElement('iframe');
  frame.title = 'Хроноскоп судьбы — Аукцион подарков';
  frame.style.cssText = 'display:block;width:100%;border:0;background:#100b02';
  frame.height = String(Math.max(640, window.innerHeight));
  let observer;
  const fit = () => {
    const auction = frame.contentDocument?.getElementById('auction');
    if (!auction) return;
    const height = Math.max(640, window.innerHeight, Math.ceil(auction.scrollHeight));
    if (Number(frame.height) !== height) frame.height = String(height);
  };
  frame.addEventListener('load', () => {
    const auction = frame.contentDocument?.getElementById('auction');
    if (!auction) return;
    observer?.disconnect();
    observer = new ResizeObserver(fit);
    observer.observe(auction);
    fit();
  });
  window.addEventListener('resize', () => {
    frame.height = String(Math.max(640, window.innerHeight));
    requestAnimationFrame(fit);
  });
  async function load() {
    status.textContent = 'Загружаем аукцион…';
    try {
      const response = await fetch(new URL('index.html', base));
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const html = await response.text();
      if (!html.includes('id="auction"')) throw new Error('Invalid auction file');
      // srcdoc keeps storage on the Tilda page's origin; base resolves all assets.
      const document = new DOMParser().parseFromString(html, 'text/html');
      const baseElement = document.createElement('base');
      baseElement.href = base.href;
      document.head.prepend(baseElement);
      frame.srcdoc = '<!doctype html>' + document.documentElement.outerHTML;
      host.replaceChildren(frame);
    } catch (error) {
      status.textContent = 'Не удалось загрузить аукцион. Проверьте подключение и ссылку на файлы. ';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Повторить';
      retry.addEventListener('click', load, {once:true});
      status.append(retry);
      console.error('Auction loading failed:', error);
    }
  }
  load();
})();
