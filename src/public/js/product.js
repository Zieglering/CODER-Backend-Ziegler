const addToCartBtn = document.querySelector('#addToCartBtn');
const cartIDElement = document.querySelector('#cartID');
const volverBtn = document.querySelector('#volverBtn');

const increaseQuantityBtn = document.querySelector('#increaseQuantityBtn');
const decreaseQuantityBtn = document.querySelector('#decreaseQuantityBtn');
const productQuantityElement = document.querySelector('#productQuantity');

let quantity = 1;

increaseQuantityBtn.addEventListener('click', () => {
    quantity++;
    productQuantityElement.textContent = quantity;
});

decreaseQuantityBtn.addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        productQuantityElement.textContent = quantity;
    }
});

addToCartBtn.addEventListener('click', async () => {
    const productId = addToCartBtn.dataset.productId;
    const productTitle = addToCartBtn.dataset.productTitle;

    try {
        const cartID = cartIDElement.textContent.split(':')[1].trim();
        const response = await fetch(`/api/carts/${cartID}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: quantity })
        });

        if (response.ok) {
            Swal.fire({
                title: 'Producto agregado',
                text: `Agregado ${quantity} x ${productTitle} al carrito`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: `No se pudo agregar ${productTitle} al carrito`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        return response;
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al agregar el producto al carrito',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

volverBtn.addEventListener('click', () => {
    window.location.href = '/index';
});
