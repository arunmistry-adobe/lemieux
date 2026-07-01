import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  if (block.classList.contains('colour-swatches')) {
    // Each cell in each row is its own card (supports multi-column da.live tables)
    [...block.children].forEach((row) => {
      [...row.children].forEach((cell) => {
        const li = document.createElement('li');
        const picture = cell.querySelector('picture');
        const link = cell.querySelector('a');

        if (picture) {
          const imageDiv = document.createElement('div');
          imageDiv.className = 'cards-card-image';
          imageDiv.append(picture);
          li.append(imageDiv);
        }

        if (link) {
          const bodyDiv = document.createElement('div');
          bodyDiv.className = 'cards-card-body';
          bodyDiv.append(link);
          li.append(bodyDiv);
        }

        ul.append(li);
      });
    });
  } else {
    // Standard cards: each row is one card
    [...block.children].forEach((row) => {
      const li = document.createElement('li');
      while (row.firstElementChild) li.append(row.firstElementChild);
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
        else div.className = 'cards-card-body';
      });
      ul.append(li);
    });
  }

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
