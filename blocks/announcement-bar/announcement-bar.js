export default function decorate(block) {
  const rows = [...block.children];

  const messageEl = rows[0]?.querySelector('p');
  const message = messageEl?.textContent?.trim() || '';

  const endTimeEl = rows[1]?.querySelector('p');
  const endTimeStr = endTimeEl?.textContent?.trim() || '';

  block.innerHTML = '';

  const bar = document.createElement('div');
  bar.className = 'announcement-bar-inner';

  const text = document.createElement('span');
  text.className = 'announcement-bar-text';
  text.textContent = message;
  bar.append(text);

  if (endTimeStr) {
    const countdown = document.createElement('span');
    countdown.className = 'announcement-bar-countdown';
    bar.append(countdown);

    const endTime = new Date(endTimeStr).getTime();
    const tick = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        countdown.textContent = '';
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      countdown.textContent = ` — ${String(days).padStart(2, '0')}d ${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
      setTimeout(tick, 1000);
    };
    tick();
  }

  block.append(bar);
}
