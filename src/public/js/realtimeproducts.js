const socket = io("http://localhost:8080");

const addProductForm = document.querySelector("#addProductForm");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const code = document.querySelector("#code");
const price = document.querySelector("#price");
const productStatus = document.querySelector("#status");
const stock = document.querySelector("#stock");
const category = document.querySelector("#category");
const thumbnails = document.querySelector("#thumbnails");

socket.on("connect", () => {
	console.log("Conectado al servidor Socket.IO");
});
socket.on("getProducts", async (products) => {
	const listProducts = document.querySelector("#listProducts");
	let product = "";
	for (prod of await products) {
		product += `
    <div class="container">
      <li>${prod.title}</li>
      <div>
        <button class="btnDelete" id="${prod.id}">Borrar</button>
      </div>
      <div>
        <button class="btnUpdate" id="${prod.id}">Actualizar</button>
      </div>
    </div>
    `;
	}

	listProducts.innerHTML = product;

	btnDelete = document.querySelectorAll(".btnDelete");

	btnDelete.forEach((btn) => {
		btn.addEventListener("click", async (evt) => {
			evt.preventDefault();
			socket.emit("deleteProduct", btn.id);
		});
	});

	let updatedProduct = [];
	btnUpdate = document.querySelectorAll(".btnUpdate");
	btnUpdate.forEach((btn) => {
		btn.addEventListener("click", async (evt) => {
			evt.preventDefault();

			const updatedProductData = {
				title: title.value,
				description: description.value,
				code: code.value,
				price: Number.parseInt(price.value),
				status: Boolean(statusCheck),
				stock: Number.parseInt(stock.value),
				category: category.value,
				thumbnails: thumbnails.value,
			};

			updatedProduct = updatedProductData;

			socket.emit("updateProduct", btn.id, updatedProduct);
		});
	});
});

// console.log(productID)
// socket.emit("deleteProduct", productID);

statusCheck = () => {
	if (productStatus.checked) return console.log("true");
	return console.log("false");
};

let newProduct = [];

addProductForm.addEventListener("click", async (evt) => {
	evt.preventDefault();
	const newProductData = {
		title: title.value,
		description: description.value,
		code: code.value,
		price: Number.parseInt(price.value),
		status: Boolean(statusCheck),
		stock: Number.parseInt(stock.value),
		category: category.value,
		thumbnails: thumbnails.value,
	};

	newProduct = newProductData;
	socket.emit("addNewProduct", newProduct);
});
