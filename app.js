import { projects, artworks } from './data.js';

const ul = document.querySelector(
  '#project-list');
const tpl = document.querySelector(
  '#project-card');
const previewImg = document.querySelector(
  '#preview-img');
const pic = document.querySelector(
  '#artwork-card');

// Ảnh mặc định nếu không có link_img
const fallbackImg = 'image/Zent_16t.jpg';

const track = document.querySelector('#track');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

function renderArtworksCarousel() {
  if (!track) return;
  track.innerHTML = '';

  artworks.forEach(art => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="${art.link_img}" alt="${art.title}">`;
    track.appendChild(card);
  });
}
renderArtworksCarousel();

if (track && prevBtn && nextBtn) {
  function getScrollAmount() {
    const card = track.querySelector('.card');
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card ? card.offsetWidth + gap : track.clientWidth;
  }

  nextBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount();
    const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

    if (isAtEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  });

  prevBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount();
    const isAtStart = track.scrollLeft <= 5;

    if (isAtStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  });
}

function render(list) {
  ul.textContent = ''; 

  if (list.length > 0) {
    previewImg.src = list[0].link_img || fallbackImg;
    previewImg.alt = list[0].title;
    previewImg.dataset.href = list[0].link_href || '';
  }

  for (const p of list) {
    const clone = tpl.content.cloneNode(true);
    const li = clone.querySelector('lis');
    
    // Đổ dữ liệu chữ vào khuôn
    li.querySelector('h3').textContent = p.title;
    li.querySelector('.tags').textContent = p.tags.join(', ');

    // Lắng nghe sự kiện rê chuột (Hover) để đổi ảnh bên trái
    li.addEventListener('mouseenter', () => {
      previewImg.src = p.link_img || fallbackImg;
      previewImg.alt = p.title;
      previewImg.dataset.href = p.link_href || '';
    });

    ul.append(clone);
  }
}
render(projects); //in list ra

if (previewImg) {
  previewImg.addEventListener('click', () => {
    const targetUrl = previewImg.dataset.href;
    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }
  });
}

const tags = [...new Set(
  projects.flatMap((p) => p.tags),
)]; //gom hết tags vào 1 mãng và lọc các đối tượng trùng lập

const bar = document.querySelector(
  '#filters');

for (const tag of ['all', ...tags]) {
  // tag chạy trong vòng ['all', 'python', 'data', 'web', 'css']
  const b = document.createElement(
    'button'); // tạo ra thẻ mới <button>
  b.textContent = tag;
  b.dataset.tag = tag;
  b.classList.add('filter-set'); //chỉnh sửa thẻ trong css
  bar.append(b);
}

bar.addEventListener('click', (e) => {
  const tag = e.target.dataset.tag;
  if (!tag) return;

  const filtered = tag === 'all'
    ? projects
    : projects.filter((p) =>
        p.tags.includes(tag));

  render(filtered);
});

const searchInput = document.querySelector('#project-search');

searchInput.addEventListener('input', (e) => {

  const keyword = e.target.value.toLowerCase().trim();

  const searchedProjects = projects.filter(p => {
    return p.title.toLowerCase().includes(keyword);
  });

  document.querySelectorAll('.filter-set').forEach(btn => btn.classList.remove('active'));
  
  render(searchedProjects);
});

const toggle = document.querySelector(
  '#theme-toggle');
const root = document.documentElement;

toggle.addEventListener('click', () => {
  root.classList.toggle('white');
});