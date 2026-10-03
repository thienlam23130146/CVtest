import { projects } from './data.js';

const ul = document.querySelector(
  '#project-list');
const tpl = document.querySelector(
  '#project-card');
const previewImg = document.querySelector(
  '#preview-img');
// Ảnh mặc định nếu dự án không có link_img
const fallbackImg = 'image/Zent_16t.jpg';

function render(list) {
  ul.textContent = ''; 

  // Load ảnh của dự án ĐẦU TIÊN vào khung Review bên trái khi vừa mở web
  if (list.length > 0) {
    previewImg.src = list[0].link_img || fallbackImg;
    previewImg.alt = list[0].title;
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
    });

    ul.append(clone);
  }
}
render(projects); //in list ra

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

// artwwork
// Dữ liệu mẫu (Bạn có thể thay bằng link ảnh của bạn)
const artworksData = [
  { title: "Bức tranh 1", link_img: "image/Zent_16t.jpg" },
  { title: "Bức tranh 2", link_img: "image/GonNiuuyen.jpg" },
  { title: "Bức tranh 3", link_img: "image/my face.jpg" },
  { title: "Bức tranh 4", link_img: "image/Zent_16t.jpg" }, // Thêm nhiều ảnh để thấy rõ hiệu ứng vòng lặp
  { title: "Bức tranh 5", link_img: "image/GonNiuuyen.jpg" }
];

const artTrack = document.querySelector('#artwork-track');
let currentArt = 0; // Lưu vị trí ảnh đang ở giữa
let artElements = []; // Mảng chứa các thẻ HTML
let autoScrollTimer;

// Hàm 1: Khởi tạo các thẻ ảnh lên màn hình
function initArtwork() {
  artworksData.forEach((art, index) => {
    const div = document.createElement('div');
    div.className = 'art-item';
    div.innerHTML = `
      <img src="${art.link_img}" alt="${art.title}">
      <div class="art-caption">${art.title}</div>
    `;

    // Lắng nghe sự kiện click: Bấm vào ảnh nào thì ảnh đó ra giữa
    div.addEventListener('click', () => {
      currentArt = index; // Cập nhật lại trung tâm
      updateCarousel();   // Di chuyển các ảnh
      resetAutoScroll();  // Reset lại bộ đếm thời gian trôi tự động
    });

    artTrack.appendChild(div);
    artElements.push(div);
  });

  updateCarousel();
  startAutoScroll(); // Bắt đầu tự cuộn
}

// Hàm 2: Cập nhật vị trí và kích thước của các ảnh
function updateCarousel() {
  const len = artElements.length;
  
  // Tính toán vị trí của ảnh bên trái và bên phải
  // Công thức % len giúp tạo vòng lặp vô tận (từ cuối nhảy về đầu)
  const prevIndex = (currentArt - 1 + len) % len;
  const nextIndex = (currentArt + 1) % len;

  artElements.forEach((el, index) => {
    // Xóa hết các trạng thái cũ
    el.className = 'art-item'; 

    // Gán trạng thái mới
    if (index === currentArt) {
      el.classList.add('active'); // Ở giữa
    } else if (index === prevIndex) {
      el.classList.add('prev');   // Bên trái
    } else if (index === nextIndex) {
      el.classList.add('next');   // Bên phải
    }
  });
}

// Hàm 3: Di chuyển sang ảnh tiếp theo (Cuộn từ phải sang trái)
function slideNext() {
  currentArt = (currentArt + 1) % artElements.length;
  updateCarousel();
}

// Hàm 4: Quản lý thời gian tự động cuộn
function startAutoScroll() {
  // Cứ sau 3 giây (3000ms) sẽ tự động chạy hàm slideNext 1 lần
  autoScrollTimer = setInterval(slideNext, 3000); 
}

function resetAutoScroll() {
  clearInterval(autoScrollTimer); // Tạm dừng
  startAutoScroll(); // Khởi động lại
}

// Gọi hàm chạy lần đầu tiên
initArtwork();