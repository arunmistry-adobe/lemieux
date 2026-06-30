import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const link = row.querySelector('a');
    const picture = row.querySelector('picture');
    const heading = row.querySelector('h2, h3, h4');
    const subtext = row.querySelector('p:not(.button-wrapper)');

    if (picture) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'promo-cards-image';
      const img = picture.querySelector('img');
      imageDiv.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '600' }]));
      li.append(imageDiv);
    }

    const body = document.createElement('div');
    body.className = 'promo-cards-body';

    if (heading) {
      const h = document.createElement('p');
      h.className = 'promo-cards-heading';
      h.textContent = heading.textContent;
      body.append(h);
    }

    if (subtext && subtext !== heading) {
      const s = document.createElement('p');
      s.className = 'promo-cards-subtext';
      s.textContent = subtext.textContent;
      body.append(s);
    }

    if (link) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.className = 'promo-cards-cta';
      cta.textContent = link.textContent || 'Shop Now';
      body.append(cta);
    }

    li.append(body);

    if (link) {
      li.addEventListener('click', () => { window.location.href = link.href; });
      li.style.cursor = 'pointer';
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
