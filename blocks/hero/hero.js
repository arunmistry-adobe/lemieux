export default function decorate(block) {
  const rows = [...block.children];

  // Support both authoring patterns:
  // 1. Two-column: [image] | [text content]  (our da.live guide format)
  // 2. Two-row:    [image row] then [text row]  (classic boilerplate format)
  const firstRow = rows[0];
  const cells = firstRow ? [...firstRow.children] : [];

  let pictureEl;
  let contentEls;

  if (cells.length >= 2) {
    // Two-column format: left cell = image, right cell = text
    pictureEl = cells[0].querySelector('picture');
    contentEls = [...cells[1].children];
  } else if (rows.length >= 2) {
    // Two-row format: first row = image, second row = text
    pictureEl = rows[0].querySelector('picture');
    contentEls = rows[1] ? [...rows[1].querySelectorAll('p, h1, h2, h3, h4')] : [];
  } else {
    // Single cell with everything
    pictureEl = block.querySelector('picture');
    contentEls = [...block.querySelectorAll('p, h1, h2, h3, h4')];
  }

  // Rebuild block: background picture + overlay content
  block.innerHTML = '';

  if (pictureEl) {
    const bg = document.createElement('div');
    bg.className = 'hero-background';
    bg.append(pictureEl);
    block.append(bg);
  }

  if (contentEls && contentEls.length) {
    const overlay = document.createElement('div');
    overlay.className = 'hero-overlay';
    contentEls.forEach((el) => overlay.append(el));
    block.append(overlay);
  }
}
