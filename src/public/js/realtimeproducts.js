// const socket = io()
document.addEventListener("DOMContentLoaded", () => {
    const userData = document.querySelector("#user-data").value.split(':');
    const user = {
        role: userData[0],
        email: userData[1]
    };

    const socket = io({
        query: {
            role: user.role,
            email: user.email
        },
        timeout: 20000
    });

    const createProductForm = document.querySelector("#createProductForm");
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    const code = document.querySelector("#code");
    const price = document.querySelector("#price");
    const productStatus = document.querySelector("#status");
    const stock = document.querySelector("#stock");
    const category = document.querySelector("#category");
    const thumbnails = document.querySelector("#thumbnails");

    const statusCheck = () => productStatus.checked;
    const attachProductListeners = () => {
        const btnDelete = document.querySelectorAll(".btnDelete");
        const btnUpdate = document.querySelectorAll(".btnUpdate");
        
        btnDelete.forEach((btn) => {
            btn.addEventListener("click", (evt) => {
                evt.preventDefault();
                const productId = btn.getAttribute("data-id");
                socket.emit("deleteProduct", productId);
            });
        });

        btnUpdate.forEach((btn) => {
            btn.addEventListener("click", (evt) => {
                evt.preventDefault();
                const productId = btn.getAttribute("data-id");
                const updatedProductData = {
                    title: title.value.trim(),
                    description: description.value.trim(),
                    code: code.value.trim(),
                    price: parseFloat(price.value),
                    stock: parseInt(stock.value),
                    category: category.value.trim(),
                    thumbnails: thumbnails.value.trim(),
                    status: statusCheck(),
                    owner: user.role === 'premium' ? user.email : 'admin'
                };
                socket.emit("updateProduct", productId, updatedProductData);
            });
        });
    };
    socket.on("getProducts", (products) => {
        const listProducts = document.querySelector("#listProducts");
        let productHtml = "";
        products.docs.forEach(product => {
            productHtml += `
                <li class="product-item" id="${product._id}">
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.thumbnails}" alt="${product.title}" />
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${product.title}</h3>
                            <h6 class="product-price">$${product.description}</h6>
                            <p class="product-price">${product.price}</p>
                            <p class="product-price">${product.code}</p>
                            <p class="product-price">${product.status}</p>
                            <p class="product-price">${product.stock}</p>
                            <p class="product-price">${product.category}</p>
                            <p class="product-price">${product.thumbnails}</p>
                        </div>
                        <div class="product-actions">
                            <button class="btnDelete" data-id="${product._id}">Borrar</button>
                            <button class="btnUpdate" data-id="${product._id}">Actualizar</button>
                        </div>
                    </div>
                </li>
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
            price: parseFloat(price.value),
            status: statusCheck(),
            stock: parseInt(stock.value),
            category: category.value,
            thumbnails: thumbnails.value,
            owner: user.role === 'premium' ? user.email : 'admin'
        };

        if (!newProductData.title || !newProductData.description || !newProductData.code || !newProductData.price || !newProductData.status || !newProductData.stock || !newProductData.category || !newProductData.thumbnails) {
            console.error("Faltan campos para completar el producto");
            return;
        }
        socket.emit("createProduct", newProductData, user);
    });
    socket.on("productCreated", (response) => {
        if (response.success) {
            console.log('Producto Creado');
            createProductForm.reset();
        } else {
            console.error('Error al intentar crear el producto:', response.message);
        }
    });
    socket.on("productDeleted", (response) => {
        if (response.success) {
            console.log('Producto eliminado');
        } else {
            console.error('Error al intentar eliminar el producto:', response.message);
        }
    });
    socket.on("productUpdated", (response) => {
        if (response.success) {
            console.log('Product actualizado');
        } else {
            console.error('Error al intentar actualizar el producto:', response.message);
        }
    });
});