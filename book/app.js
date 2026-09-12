const form = document.querySelector('#book-form');
const titleInput = document.querySelector('#title-input');
const authorInput = document.querySelector('#author-input');
const ratingInput = document.querySelector('#rating-input');
const submitBtn = document.querySelector('#submit-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const searchInput = document.querySelector('#search-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#book-list');

let books = JSON.parse(localStorage.getItem('books') || '[]');
let editingId = null;
let keyword = '';

const save = () => localStorage.setItem('books', JSON.stringify(books));

const render = () => {
  list.innerHTML = '';

  const shown = books.filter(book => {
    const kw = keyword.trim().toLowerCase();
    return book.title.toLowerCase().includes(kw) || book.author.toLowerCase().includes(kw);
  });

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = keyword.trim() === '' ? '暂无图书' : '没有匹配的图书';
    list.appendChild(li);
    return;
  }

  shown.forEach(book => {
    const li = document.createElement('li');
    li.textContent = `${book.title} - ${book.author} - ${book.rating}分`;

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = '编辑';
    editBtn.className = 'edit';
    editBtn.addEventListener('click', () => {
      editingId = book.id;
      titleInput.value = book.title;
      authorInput.value = book.author;
      ratingInput.value = book.rating;
      submitBtn.textContent = '保存修改';
      cancelBtn.hidden = false;
      tip.textContent = '';
    });

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = '删除';
    delBtn.className = 'del';
    delBtn.addEventListener('click', () => {
      books = books.filter(item => item.id !== book.id);

      if (editingId === book.id) {
        editingId = null;
        submitBtn.textContent = '添加';
        cancelBtn.hidden = true;
        titleInput.value = '';
        authorInput.value = '';
        ratingInput.value = '';
      }

      save();
      render();
    });

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const ratingValue = ratingInput.value.trim();

  if (title === '' || author === '') {
    tip.textContent = '书名和作者不能为空';
    return;
  }

  const rating = Number(ratingValue);

  if (ratingValue === '' || Number.isNaN(rating) || rating < 0 || rating > 10) {
    tip.textContent = '评分必须是 0 到 10 之间的数字';
    return;
  }

  if (editingId !== null) {
    const book = books.find(item => item.id === editingId);

    if (book) {
      book.title = title;
      book.author = author;
      book.rating = rating;
    }

    editingId = null;
    submitBtn.textContent = '添加';
    cancelBtn.hidden = true;
    tip.textContent = '修改成功';
  } else {
    books.push({ id: Date.now(), title: title, author: author, rating: rating });
    tip.textContent = '添加成功';
  }

  save();
  titleInput.value = '';
  authorInput.value = '';
  ratingInput.value = '';
  render();
});

cancelBtn.addEventListener('click', () => {
  editingId = null;
  submitBtn.textContent = '添加';
  cancelBtn.hidden = true;
  titleInput.value = '';
  authorInput.value = '';
  ratingInput.value = '';
  tip.textContent = '';
});

searchInput.addEventListener('input', (e) => {
  keyword = e.target.value;
  render();
});

render();