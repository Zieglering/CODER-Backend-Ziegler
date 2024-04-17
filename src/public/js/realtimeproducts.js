const socket = io()



const addProductForm = document.querySelector('#addProductForm')
const title = document.querySelector('#title')
const description = document.querySelector('#description')
const code = document.querySelector('#code')
const price = document.querySelector('#price')
const statuse = document.querySelector('#status')
const stock = document.querySelector('#stock')
const category = document.querySelector('#category')
const thumbnails = document.querySelector('#thumbnails')

statusCheck = () => {
  if (statuse.checked) return console.log('true') 
  return console.log('false') 
}



    addProductForm.addEventListener('click', async evt => {
      const newProduct = {
          title: title.value,
          description: description.value,
          code: code.value,
          price: Number.parseInt(price.value),
          status: Boolean(statusCheck()),
          stock: Number.parseInt(stock.value),
          category: category.value,
          thumbnails: thumbnails.value
          };
          socket.emit('client:newProduct', newProduct)

          

      });





socket.on('server:listProducts', async getProducts => {

  const listProducts = document.querySelector('#listProducts')
  let product = ''
  for (prod of getProducts) {
    product += `<li>${prod.title}</li>`
  }
  
  listProducts.innerHTML = product
})

