const volverBtn = document.querySelector('#volverBtn');
const ticketBtn = document.querySelector('#ticketBtn');
const cartIDElement = document.querySelector('#cartID');

const cid = cartIDElement.textContent.split(':')[1]?.trim();

volverBtn.addEventListener('click', () => {
    window.location.href = '/products';
});
ticketBtn.addEventListener('click', async () => {
    if (!cid) {
        alert('Error: no se encuentra cart ID');
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cid}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseData = await response.json();

        if (response.ok) {
            alert(`Compra finalizada con éxito\nHora de la compra: ${responseData.payload.purchase_datetime}\nTicket generado con el codigo ${responseData.payload.code}\nComprador ${responseData.payload.purchaser}\nTotal ${responseData.payload.amount}`);
            window.location.href = '/products';
        } else {
            alert(`Error al finalizar la compra: ${responseData.error}`);
        }
    } catch (error) {
        alert('Error al finalizar la compra');
    }
});
