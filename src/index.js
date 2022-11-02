const axios = require('axios').default;
const baseUrl = 'https://6362a4b537f2167d6f69cb2a.mockapi.io/reciept';

const list = document.querySelector('.receipts_list');
const formEl = document.querySelector('.form');

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.elements.name.value;
  const amount = e.currentTarget.elements.amount.value;
  const date = getDate();
  postReceipt(name, amount, date);
}

function getDate() {
  return new Date().toUTCString();
}

async function postReceipt(name, amount, date) {
  console.log(date);
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
  } catch (error) {
    console.error(error);
  }
}

function markupData(res) {
  const data = res.data;
  console.log(data);
  if (data.length === 0) {
    alert('There is nothing in the list');
  }
  const markup = data
    .map(
      item =>
        `<li class='receipt_item'><p>${item.name}</p><p>${item.amount}</p><p>${item.date}</p></li>`
    )
    .join('');
  list.innerHTML = markup;
}

getReceipt(baseUrl);
