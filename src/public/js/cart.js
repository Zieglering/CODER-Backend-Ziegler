const volverBtn = document.querySelector('#volverBtn');
const ticketBtn = document.querySelector('#ticketBtn');
const cartIDElement = document.querySelector('#cartID');

const cartID = cartIDElement.textContent.split(':')[1]?.trim();

volverBtn.addEventListener('click', () => {
    window.location.href = '/products';
});
ticketBtn.addEventListener('click', async () => {
    console.log(cartID)
    if (!cartID) {
        alert('Error: no se encuentra cart ID');
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartID}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseData = await response.json();
        console.log(`respuesta desde el endpoint api/carts/:cid/purchase: ${responseData.payload || responseData.error}`);

        if (response.ok) {
            alert('Compra finalizada con éxito');
            window.location.href = '/products';
        } else {
            alert(`Error al finalizar la compra: ${responseData.error.message || responseData.error}`);
        }
    } catch (error) {
        console.error('Error finalizando la compra:', error);
        alert('Error al finalizar la compra');
    }
});
