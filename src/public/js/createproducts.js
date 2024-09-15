const createProductForm = document.querySelector('#createProductForm');
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const code = document.querySelector("#code");
const price = document.querySelector("#price");
const productStatus = document.querySelector("#flexSwitchCheckChecked");
const stock = document.querySelector("#stock");
const category = document.querySelector("#category");
const thumbnails = document.querySelector("#thumbnails");
const owner = document.querySelector("#owner");
const volverBtn = document.querySelector('#volverBtn');

const statusCheck = () => {
     return productStatus.checked
}

volverBtn.addEventListener('click', async () => {
    window.location.href = '/index';
});

createProductForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const data = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        status: statusCheck(),
        stock: stock.value,
        category: category.value,
        thumbnails: thumbnails.value,
        owner: owner ? owner.innerText : "admin"
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (response.ok) {
            const newProduct = result.payload;
            Swal.fire({
                title: 'Producto creado',
                text: `${data.title} creado correctamente`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            addProductToDOM(newProduct);

        } else {
            Swal.fire({
                title: 'Error!',
                text: result.error,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {

        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

document.addEventListener('click', async (evt) => {
    if (evt.target && evt.target.classList.contains('delete-product-btn')) {
        evt.preventDefault();

        const productId = evt.target.getAttribute('data-product-id');

        const result = await Swal.fire({
            title: '¿Estás seguro que queres borrar el producto permanentemente?',
            text: "Estas a punto de borrar el producto de la base de datos, esta acción es PERMANENTE y no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar permanentemente',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok) {
                    Swal.fire({
                        title: 'Producto eliminado',
                        text: 'Producto eliminado correctamente',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        evt.target.closest('.product-card').remove();
                    });
                } else {
                    const errorText = await response.json();
                    Swal.fire({
                        title: 'Error!',
                        text: errorText.error,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }
});

const addProductToDOM = (product) => {
    const productGrid = document.querySelector('.product-grid');

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
        <div class="product-image">
            <img src="/images/IMG_placeholder.jpg" alt="Product" />
        </div>
        <div class="product-info">
            <h2 class="product-title">${product.title}</h2>
            <h3 class="product-price">$${product.price}</h3>
        </div>
        <a href="/product/${product._id}"><button class="product-btn btn btn-primary btn-lg" data-product-id="${product._id}">Ver más</button></a>
        <button class="product-btn btn btn-danger btn-lg delete-product-btn" data-product-id="${product._id}">Borrar producto de la base de datos</button>
    `;

    productGrid.appendChild(productCard);
};