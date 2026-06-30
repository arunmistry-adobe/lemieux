import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const picture = row.querySelector('picture');
    const link = row.querySelector('a');
    const label = row.querySelector('p:last-of-type, h3, h4');

    if (picture) {
      const img = picture.querySelector('img');
      const opt = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '400' }]);
      li.append(opt);
    }

    const caption = document.createElement('p');
    caption.className = 'category-grid-label';
    caption.textContent = label?.textContent || link?.textContent || '';
    li.append(caption);

    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.className = 'category-grid-link';
      anchor.setAttribute('aria-label', caption.textContent);
      li.prepend(anchor);
      li.addEventListener('click', () => { window.location.href = link.href; });
      li.style.cursor = 'pointer';
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
