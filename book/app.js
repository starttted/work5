const form = document.querySelector('#book-form');
const titleInput = document.querySelector('#title-input');
const authorInput = document.querySelector('#author-input');
const ratingInput = document.querySelector('#rating-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#book-list');

let books = [];

const render = () => {
  list.innerHTML = '';

  if (books.length === 0) {
    const li = document.createElement('li');
    li.textContent = '暂无图书';
    list.appendChild(li);
    return;
  }

  books.forEach(book => {
    const li = document.createElement('li');
    li.textContent = `${book.title} - ${book.author} - ${book.rating}分`;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = '删除';
    delBtn.className = 'del';
    delBtn.addEventListener('click', () => {
      books = books.filter(item => item.id !== book.id);
      render();
    });

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

  books.push({ id: Date.now(), title: title, author: author, rating: rating });
  tip.textContent = '添加成功';
  titleInput.value = '';
  authorInput.value = '';
  ratingInput.value = '';
  render();
});

render();