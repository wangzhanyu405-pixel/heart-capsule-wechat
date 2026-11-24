import { cards, pickCard } from './cards.js';

const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const photoNotes = [
  '你出现的地方，总有一点小小的星光。','这一刻，想把时间调慢一点。','花很好看，镜头里的人更好看。',
  '偶尔也想陪你一起幼稚。','连猫咪都忍不住回头看你。','像从温柔的故事里走出来。',
  '那天的灯光很暖，你也是。','偷偷拍下的认真，特别动人。','如果可以，想一直陪你看海。',
  '这样看着镜头的你，刚好看到我心里。','可爱是会传染的，我已经中招。','这颗扭蛋，有一点小恶魔的顽皮。',
  '喜欢你的每一种样子。','把这个瞬间，悄悄留给以后。','下一次约会，也想看你这样笑。',
  '今天也值得被好好喜欢。','故事还长，我们慢慢走。'
];

const rail = $('photoRail');
photoNotes.forEach((note, index) => {
  const frame = document.createElement('article');
  frame.className = 'memory-frame';
  frame.style.setProperty('--tilt', `${[-2, 1.5, -1, 2][index % 4]}deg`);
  const visual = document.createElement('div');
  visual.className = `memory-photo${index === 0 ? ' crop-one' : ''}`;
  if (index !== 0) {
    const image = document.createElement('img');
    image.src = `./assets/${String(index + 1).padStart(2, '0')}.jpg`;
    image.alt = `回忆照片 ${index + 1}`;
    image.loading = 'lazy';
    visual.append(image);
  } else visual.setAttribute('role', 'img');
  const caption = document.createElement('p');
  caption.className = 'memory-caption';
  caption.textContent = note;
  const number = document.createElement('p');
  number.className = 'memory-index';
  number.textContent = `MOMENT ${String(index + 1).padStart(2, '0')}`;
  frame.append(visual, caption, number);
  rail.append(frame);
});

const frames = [...rail.children];
let photoIndex = 0;
let autoGallery;
let galleryInteracted = false;
function updateGalleryIndex() {
  const center = rail.scrollLeft + rail.clientWidth / 2;
  let closest = 0;
  let distance = Infinity;
  frames.forEach((frame, index) => {
    const d = Math.abs(frame.offsetLeft + frame.offsetWidth / 2 - center);
    if (d < distance) { distance = d; closest = index; }
  });
  photoIndex = closest;
  $('photoCounter').textContent = `${String(photoIndex + 1).padStart(2, '0')} / 17`;
}
function showPhoto(index) {
  const count = frames.length;
  photoIndex = (index + count) % count;
  frames[photoIndex].scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'nearest', inline: 'center' });
  $('photoCounter').textContent = `${String(photoIndex + 1).padStart(2, '0')} / 17`;
}
function stopGallery() { galleryInteracted = true; clearInterval(autoGallery); }
rail.addEventListener('scroll', updateGalleryIndex, { passive: true });
rail.addEventListener('pointerdown', stopGallery, { once: true });
$('prevPhoto').addEventListener('click', () => { stopGallery(); showPhoto(photoIndex - 1); });
$('nextPhoto').addEventListener('click', () => { stopGallery(); showPhoto(photoIndex + 1); });
if (!reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !galleryInteracted) {
      clearInterval(autoGallery);
      autoGallery = setInterval(() => showPhoto(photoIndex + 1), 5200);
    } else clearInterval(autoGallery);
  }, { threshold: 0.45 });
  observer.observe($('keepsakes'));
}

function getSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
let seen = getSaved('heart-capsule-seen-v1', []);
let history = getSaved('heart-capsule-history-v1', []);
if (!Array.isArray(seen)) seen = [];
if (!Array.isArray(history)) history = [];
function save() {
  try {
    localStorage.setItem('heart-capsule-seen-v1', JSON.stringify(seen));
    localStorage.setItem('heart-capsule-history-v1', JSON.stringify(history));
  } catch { /* The toy still works when storage is unavailable. */ }
}
function updateCount() {
  $('drawCount').textContent = history.length ? `这台手机已收下 ${history.length} 颗心动` : '轻轻点一下，看看今天属于你的那一句';
}
updateCount();

let drawing = false;
let previousFocus;
function reveal(card) {
  $('revealPhoto').className = `reveal-photo${card.photo === 1 ? ' crop-one' : ''}`;
  $('revealPhoto').style.backgroundImage = `url('./assets/${String(card.photo).padStart(2, '0')}.jpg')`;
  $('revealType').textContent = card.type;
  $('revealQuote').textContent = card.quote;
  $('revealTranslation').textContent = card.translation || '';
  $('revealTranslation').hidden = !card.translation;
  $('revealAuthor').textContent = card.author;
  if (card.source) $('revealAuthor').href = card.source;
  else $('revealAuthor').removeAttribute('href');
  previousFocus = document.activeElement;
  $('reveal').hidden = false;
  document.body.style.overflow = 'hidden';
  $('closeReveal').focus();
}
function closeReveal() {
  $('reveal').hidden = true;
  document.body.style.overflow = '';
  previousFocus?.focus();
}
$('drawButton').addEventListener('click', () => {
  if (drawing) return;
  drawing = true;
  $('drawButton').disabled = true;
  $('machine').classList.add('is-drawing');
  const picked = pickCard(cards, seen);
  seen = picked.seen;
  history.push(picked.card.id);
  save();
  updateCount();
  const preload = new Image();
  preload.src = `./assets/${String(picked.card.photo).padStart(2, '0')}.jpg`;
  setTimeout(() => {
    $('machine').classList.remove('is-drawing');
    $('drawButton').disabled = false;
    drawing = false;
    reveal(picked.card);
  }, reducedMotion ? 50 : 1150);
});
$('closeReveal').addEventListener('click', closeReveal);
$('keepButton').addEventListener('click', closeReveal);
$('revealBackdrop').addEventListener('click', closeReveal);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('reveal').hidden) closeReveal();
});
$('enterButton').addEventListener('click', () => $('machineSection').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' }));
