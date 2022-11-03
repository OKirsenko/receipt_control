const axios = require('axios').default;
const baseUrl = 'https://6362a4b537f2167d6f69cb2a.mockapi.io/';
let query = 'reciept';
const list = document.querySelector('.receipts_list');
const formEl = document.querySelector('.form');
const limitEl = document.querySelector('.limit');
const spendEl = document.querySelector('.spend');
const remainsEl = document.querySelector('.remains');
const audio = document.getElementById('audio');

formEl.addEventListener('submit', onFormSubmit);
list.addEventListener('click', onListClick);
function onFormSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.elements.name.value;
  const amount = +e.currentTarget.elements.amount.value;
  const date = getDate();
  if (amount >= 10) {
    audio.play();
  }
  postReceipt(name, amount, date);
  e.currentTarget.reset();
}

function getDate() {
  return new Date().toUTCString();
}

async function postReceipt(name, amount, date) {
  try {
    const id = await axios.post(`${baseUrl}${query}`, { name, amount, date });
    getReceipt(baseUrl);
  } catch (error) {
    console.error(error);
  }
}

async function getReceipt(url) {
  try {
    const response = await axios.get(`${url}${query}`);
    markupData(response);
    countStat(response);
  } catch (error) {
    console.error(error);
  }
}

function markupData(res) {
  const data = res.data;

  if (data.length === 0) {
    console.log('There is nothing in the list');
  }

  const reverseData = data.reverse();

  const markup = reverseData
    .map(
      item =>
        `<li id='${item.id}' class='receipt_item'><p class='rec_name'>${item.name}</p><p class='rec_amount'>${item.amount}</p><p class='rec_date'>${item.date}</p><button class='delete_btn'>Ой, бля</button></li>`
    )
    .join('');
  list.innerHTML = markup;
}

function onListClick(e) {
  if (!e.target.classList.contains('delete_btn')) return;
  const listItem = e.target.parentNode;
  const itemId = listItem.id;
  listItem.classList.add('receipt_item_anim');

  deleteReceipt(itemId);
}

async function deleteReceipt(id) {
  try {
    const del = await axios.delete(`${baseUrl}${query}/${id}`);
    getReceipt(baseUrl);
  } catch (error) {
    console.error(error);
  }
}

function countStat(res) {
  const data = res.data;

  const amounts = data.map(item => +item.amount);

  const total = amounts.reduce(function (sum, elem) {
    return sum + elem;
  }, 0);

  limitEl.innerHTML = 150;
  spendEl.innerHTML = total.toFixed(2);
  remainsEl.innerHTML = +limitEl.textContent - total.toFixed(2);
}
getReceipt(baseUrl);

// ///////////////////////////////////////////////////////////////////////////////
// BOOKMARKS

const bookmarks = document.querySelector('.marks_wrap');
const receiptSection = document.querySelector('.receipts-section');
const shopingListSection = document.querySelector('.shoping-list_section');
const statSection = document.querySelector('.stat-section');
bookmarks.addEventListener('click', onBookmarksClick);

function onBookmarksClick(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  if (e.target.classList.contains('bookmark_btn_active')) return;
  const arr = Array.from(e.currentTarget.children);
  const targetId = e.target.id;
  arr.forEach(el => {
    if (!el.classList.contains('bookmark_btn_active')) return;
    el.classList.remove('bookmark_btn_active');
  });
  console.log(e.target.id);
  arr.forEach(el => {
    if (el.id === targetId) {
      el.classList.add('bookmark_btn_active');
    }
  });
  switch (targetId) {
    case 'receipt':
      receiptSection.classList.remove('hidden_section');
      shopingListSection.classList.add('hidden_section');
      statSection.classList.add('hidden_section');
      break;
    case 'shoping':
      receiptSection.classList.add('hidden_section');
      shopingListSection.classList.remove('hidden_section');
      statSection.classList.add('hidden_section');
      break;
    case 'stat':
      receiptSection.classList.add('hidden_section');
      shopingListSection.classList.add('hidden_section');
      statSection.classList.remove('hidden_section');
      break;

    default:
      break;
  }
}
