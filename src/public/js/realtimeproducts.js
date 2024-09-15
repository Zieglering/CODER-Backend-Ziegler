const socket = io();

const createProductForm = document.querySelector("#createProductForm");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const code = document.querySelector("#code");
const price = document.querySelector("#price");
const productStatus = document.querySelector("#status");
const stock = document.querySelector("#stock");
const category = document.querySelector("#category");
const thumbnails = document.querySelector("#thumbnails");
const userData = document.querySelector("#user-data").value.split(':');
const user = {
    role: userData[0],
    email: userData[1]
};

const statusCheck = () => productStatus.checked;

socket.on("getProducts", (products) => {
    const listProducts = document.querySelector("#listProducts");
    let productHtml = "";

    products.forEach(product => {
        productHtml += `
            <div class="container" id="${product._id}">
                <li>${product.title}</li>
                <div>
                    <button class="btnDelete" data-id="${product._id}">Borrar</button>
                </div>
                <div>
                    <button class="btnUpdate" data-id="${product._id}">Actualizar</button>
                </div>
            </div>
        `;
    });

    listProducts.innerHTML = productHtml;
    attachProductListeners();
});

createProductForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const newProductData = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: Number(price.value),
        status: statusCheck(),
        stock: Number(stock.value),
        category: category.value,
        thumbnails: thumbnails.value,
        owner: user.role === 'premium' ? user.email : 'admin'
    };

    if (!newProductData.title || !newProductData.price || !newProductData.stock) {
        console.error("Missing fields!");
        return;
    }

    socket.emit("createProduct", newProductData, user);

    socket.once("productCreated", (response) => {
        if (response.success) {
            console.log('Product created successfully.');
            createProductForm.reset();
            socket.emit("getProducts");
        } else {
            console.error('Error creating product:', response.message);
        }
    });
});

const attachProductListeners = () => {
    const btnDelete = document.querySelectorAll(".btnDelete");
    const btnUpdate = document.querySelectorAll(".btnUpdate");

    btnDelete.forEach((btn) => {
        btn.addEventListener("click", (evt) => {
            evt.preventDefault();
            const productId = btn.getAttribute("data-id");
            socket.emit("deleteProduct", productId);

            socket.once("productDeleted", (response) => {
                if (response.success) {
                    console.log('Product deleted successfully.');
                    socket.emit("getProducts"); 
                } else {
                    console.error('Error deleting product:', response.message);
                }
            });
        });
    });

    btnUpdate.forEach((btn) => {
        btn.addEventListener("click", (evt) => {
            evt.preventDefault();
            const productId = btn.getAttribute("data-id");
            const productToUpdate = products.find(product => product._id === productId);

            title.value = productToUpdate.title;
            description.value = productToUpdate.description;
            code.value = productToUpdate.code;
            price.value = productToUpdate.price;
            stock.value = productToUpdate.stock;
            category.value = productToUpdate.category;
            thumbnails.value = productToUpdate.thumbnails;
            productStatus.checked = productToUpdate.status;

            socket.emit("updateProduct", productId, productToUpdate);

            socket.once("productUpdated", (response) => {
                if (response.success) {
                    console.log('Product updated successfully.');
                    socket.emit("getProducts");
                    console.error('Error updating product:', response.message);
                }
            });
        });
    });
};

attachProductListeners();