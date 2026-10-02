import { projects } from './data.js';

const ul = document.querySelector(
  '#project-list');
const tpl = document.querySelector(
  '#project-card');
const previewImg = document.querySelector(
  '#preview-img');
// Ảnh mặc định nếu dự án không có link_img
const fallbackImg = 'image/Zent_16t.jpg';

// hàm để hiện thỉ list
// function render(list) {
//   ul.textContent = ''; //dọn sạch các dự án cũ đang hiển thị
//   for (const p of list) {
//     const li = tpl.content
//       .cloneNode(true);// nhân bản sâu thẻ <template>
//     li.querySelector('h3')
//       .textContent = p.title;//title
//     li.querySelector('.tags')
//       .textContent = p.tags.join(', ');//tag
//     const imgElement = li.querySelector('img.image-full');
//     if (p.link_img) {
//       imgElement.src = p.link_img;
//       imgElement.alt = p.title;
//     }
//     ul.append(li);
//   }
// }
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

const toggle = document.querySelector(
  '#theme-toggle');
const root = document.documentElement;

toggle.addEventListener('click', () => {
  root.classList.toggle('white');
});


// const projectList = document.querySelector('#project-list');

// projects.forEach(project => {
//     const article = document.createElement('article');

//     article.classList.add('card');

//     article.innerHTML = `
//         <img
//             src="${project.link_img}"
//             alt="${project.title}"
//             class="image-full"
//         >

//         <h3>${project.title}</h3>

//         <p>
//             Tags: ${project.tags.join(', ')}
//         </p>
//     `;

//     projectList.appendChild(article);
// });