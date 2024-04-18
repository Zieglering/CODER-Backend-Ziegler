// import { io } from 'socket.io-client';



const socket = io('http://localhost:8080');

socket.on('connect', () => {
    console.log('Conectado al servidor Socket.IO');

});

socket.on('getProducts', (products) => {
  const listProducts = document.querySelector('#listProducts')
  let product = ''
  for (prod of products) {
    product += `
    <div class="container">
      <li>${prod.title}</li>
    </div>
    `
  }
  
  listProducts.innerHTML = product
})





const addProductForm = document.querySelector('#addProductForm')
const title = document.querySelector('#title')
const description = document.querySelector('#description')
const code = document.querySelector('#code')
const price = document.querySelector('#price')
const statuse = document.querySelector('#status')
const stock = document.querySelector('#stock')
const category = document.querySelector('#category')
const thumbnails = document.querySelector('#thumbnails')
const btnBorrar = document.querySelector('#btnBorrar')

statusCheck = () => {
  if (statuse.checked) return console.log('true') 
  return console.log('false') 
}

let newProduct = []

addProductForm.addEventListener('click', async (evt) => {
  evt.preventDefault()
  const newProductData = {
      title: title.value,
      description: description.value,
      code: code.value,
      price: Number.parseInt(price.value),
      status: Boolean(statusCheck),
      stock: Number.parseInt(stock.value),
      category: category.value,
      thumbnails: thumbnails.value
      };
 
      newProduct = newProductData
      socket.emit('addNewProduct', newProduct)

      
    });
    
 


