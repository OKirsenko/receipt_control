const axios = require('axios').default;
const baseUrl = 'https://6362a4b537f2167d6f69cb2a.mockapi.io/reciept';

const list = document.querySelector('.receipts_list');
const formEl = document.querySelector('.form');
const limitEl = document.querySelector('.limit');
const spendEl = document.querySelector('.spend');
const remainsEl = document.querySelector('.remains');

formEl.addEventListener('submit', onFormSubmit);
list.addEventListener('click', onListClick);
function onFormSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.elements.name.value;
  const amount = e.currentTarget.elements.amount.value;
  const date = getDate();
  postReceipt(name, amount, date);
  e.currentTarget.reset();
}

function getDate() {
  return new Date().toUTCString();
}

async function postReceipt(name, amount, date) {
  try {
    const id = await axios.post(baseUrl, { name, amount, date });
    getReceipt(baseUrl);
  } catch (error) {
    console.error(error);
  }
}

async function getReceipt(url) {
  try {
    const response = await axios.get(url);
    markupData(response);
    countStat(response);
  } catch (error) {
    console.error(error);
  }
}

function markupData(res) {
  const data = res.data;
  console.log(data);
  if (data.length === 0) {
    console.log('There is nothing in the list');
  }
  const markup = data
    .map(
      item =>
        `<li id='${item.id}' class='receipt_item'><p>${item.name}</p><p>${item.amount}</p><p>${item.date}</p><button class='delete_btn'>Ой, бля</button></li>`
    )
    .join('');
  list.innerHTML = markup;
}

function onListClick(e) {
  if (!e.target.classList.contains('delete_btn')) return;
  const itemId = e.target.parentNode.id;
  console.log(e.target.parentNode.id);
  console.log('ola');
  deleteReceipt(itemId);
}

async function deleteReceipt(id) {
  console.log(typeof id);
  try {
    const del = await axios.delete(`${baseUrl}/${id}`);
    getReceipt(baseUrl);
  } catch (error) {
    console.error(error);
  }
}

function countStat(res) {
  const data = res.data;

  const amounts = data.map(item => +item.amount);
  console.log(amounts);
  const total = amounts.reduce(function (sum, elem) {
    return sum + elem;
  }, 0);
  console.log(total);
  limitEl.innerHTML = 150;
  spendEl.innerHTML = total;
  remainsEl.innerHTML = +limitEl.textContent - total;
}
getReceipt(baseUrl);
