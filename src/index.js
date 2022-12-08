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

  limitEl.innerHTML = 200;
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
      getShopinglist(baseUrl);
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

////////////////////////////////////// SHOPING LIST
////////////////////////////////////////

const shopingListEl = document.querySelector('.shoping_list');
const shopingFormEl = document.querySelector('.shoping_form');

shopingFormEl.addEventListener('submit', onShopingFormSubmit);
shopingListEl.addEventListener('click', onShopingListClick);
shopingListEl.addEventListener('click', onDeleteShopingClick);

async function getShopinglist(url) {
  query = 'shoping';
  try {
    const response = await axios.get(`${url}${query}`);
    markupShoping(response);
  } catch (error) {
    console.error(error);
  }
}

function markupShoping(res) {
  const data = res.data;
  console.log('data', data);
  const doneProduct = data.filter(item => item.done === true);
  const undoneProduct = data.filter(item => item.done === false);
  console.log('done', doneProduct);
  const markup =
    undoneProduct
      .reverse()
      .map(
        item => `<li class="shoping_item" id='s${item.id}' data-done='${item.done}'>
        <p class="item_product">${item.product}</p>
        <div class="check " ></div>
        <p class="item_date">${item.date}</p>
        <button class="item_delete_btn">X</button>
      </li>`
      )
      .join('') +
    doneProduct
      .reverse()
      .map(
        item => `<li class="shoping_item" id='s${item.id}' data-done='${item.done}'>
        <p class="item_product">${item.product}</p>
        <div class="check check_done" ></div>
        <p class="item_date">${item.date}</p>
        <button class="item_delete_btn">X</button>
      </li>`
      )
      .join('');
  shopingListEl.innerHTML = markup;
}

let done = false;

function onShopingFormSubmit(e) {
  e.preventDefault();
  const product = e.currentTarget.elements.product.value;
  const date = getDate().slice(5, 11);

  postShopingItem(product, date, done);
  e.currentTarget.reset();
}

async function postShopingItem(product, date, done) {
  query = 'shoping';
  try {
    await axios.post(`${baseUrl}${query}`, { product, date, done });
    getShopinglist(baseUrl);
  } catch (error) {
    console.error(error);
  }
}

function onShopingListClick(e) {
  if (!e.target.classList.contains('check')) return;
  const shopingItem = e.target.parentNode;
  const shopingItemId = shopingItem.id;

  if (shopingItem.dataset.done === 'true') {
    done = false;
  } else {
    done = true;
  }
  e.target.classList.toggle('check_done');
  changeDone(shopingItemId, done);
}

async function changeDone(id, done) {
  query = 'shoping';
  try {
    await axios.put(`${baseUrl}${query}/${id.slice(1)}`, { done });
    getShopinglist(baseUrl);
  } catch (error) {
    console.error(error);
  }
}

function onDeleteShopingClick(e) {
  if (!e.target.classList.contains('item_delete_btn')) return;
  const itemId = e.target.parentNode.id.slice(1);
  e.target.parentNode.classList.add('shoping_item_anim');
  deleteShopingItem(itemId);
}

async function deleteShopingItem(id) {
  query = 'shoping';
  try {
    const del = await axios.delete(`${baseUrl}${query}/${id}`);
    getShopinglist(baseUrl);
  } catch (error) {
    console.error(error);
  }
}
