const addToCartBtn = document.querySelector('#addToCartBtn');

addToCartBtn.addEventListener('click', async () => {
    const cartId = addToCartBtn.dataset.cartId;
    const productId = addToCartBtn.dataset.productId;
    const productTitle = addToCartBtn.dataset.productTitle;
    let quantity = 1;

    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: quantity })
        });
        alert(`Agregado ${productTitle}`);
        return response
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
    }
});