/* __divai-text-overrides */
(() => {
  const overrides = [{"nodeId":"main>section[0]>div>div[0]>h1","oldValue":"Your Next Order Should Already Be Moving","newValue":"Your Next Order Should Already Be Moving Bra"}];
  const deadline = Date.now() + 12000;
  let observer = null;
  let scheduled = false;
  const nextFrame = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : (callback) => window.setTimeout(callback, 0);
  const esc = (value) => window.CSS && CSS.escape ? CSS.escape(value) : String(value).replace(/["\\]/g, '\\$&');
  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  function findByPath(nodeId) {
    const parts = String(nodeId || '').split('>');
    let current = document.body;
    for (const part of parts) {
      const match = part.match(/^([a-z0-9-]+)(?:\[(\d+)\])?$/i);
      if (!match || !current) return null;
      const tag = match[1].toUpperCase();
      const idx = match[2] !== undefined ? Number(match[2]) : 0;
      const children = Array.from(current.children).filter((child) => child.tagName === tag);
      current = children[idx] || null;
    }
    return current === document.body ? null : current;
  }
  function findTarget(item) {
    const direct = document.querySelector('[data-ve-id="' + esc(item.nodeId) + '"]') ||
      document.querySelector('[data-node-id="' + esc(item.nodeId) + '"]') ||
      findByPath(item.nodeId);
    if (direct && (normalize(direct.textContent) === normalize(item.oldValue) || normalize(direct.textContent) === normalize(item.newValue))) {
      return direct;
    }
    const candidates = Array.from(document.querySelectorAll('p,h1,h2,h3,h4,h5,h6,span,a,li,td,th,label,button,strong,em,b,i,small,blockquote,figcaption,dt,dd'))
      .filter((node) => normalize(node.textContent) === normalize(item.oldValue));
    return candidates.length === 1 ? candidates[0] : null;
  }
  function apply() {
    let unresolved = 0;
    for (const item of overrides) {
      const target = findTarget(item);
      if (!target) {
        unresolved += 1;
        continue;
      }
      if (normalize(target.textContent) !== normalize(item.newValue)) target.textContent = item.newValue;
      target.setAttribute('data-ve-id', item.nodeId);
      target.setAttribute('data-divai-text-override', 'true');
    }
    return unresolved;
  }
  function run() {
    scheduled = false;
    if (observer) observer.disconnect();
    const unresolved = apply();
    if (Date.now() >= deadline) return;
    if (observer) observer.observe(document.documentElement, { childList: true, subtree: true });
    if (unresolved > 0) window.setTimeout(schedule, 120);
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    nextFrame(run);
  }
  observer = new MutationObserver(schedule);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
})();