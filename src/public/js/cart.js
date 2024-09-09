const volverBtn = document.querySelector('#volverBtn');
const ticketBtn = document.querySelector('#ticketBtn');
const cartIDElement = document.querySelector('#cartID');
const totalAmountElement = document.querySelector('#totalAmount');

const cartID = cartIDElement.textContent.split(':')[1]?.trim();

volverBtn.addEventListener('click', () => {
    window.location.href = '/index';
});

const increaseQuantityBtn = document.querySelectorAll('.increaseQuantityBtn');
const decreaseQuantityBtn = document.querySelectorAll('.decreaseQuantityBtn');
const productQuantities = document.querySelectorAll('.productQuantity');

const updateTotalAmount = () => {
  let totalAmount = 0;

  productQuantities.forEach(quantityElement => {
      const productId = quantityElement.getAttribute('data-product-id');
      const quantity = parseInt(quantityElement.value); 
      const productPriceElement = document.querySelector(`.product-price[data-product-id="${productId}"]`);
      const price = parseFloat(productPriceElement.textContent.replace('$', ''));

      totalAmount += quantity * price;
  });

  totalAmountElement.textContent = `Total: $${totalAmount.toFixed(2)}`;
};

increaseQuantityBtn.forEach(button => {
  button.addEventListener('click', async () => {
      const productId = button.getAttribute('data-product-id');
      const quantityElement = document.querySelector(`.productQuantity[data-product-id="${productId}"]`);
      let quantity = parseInt(quantityElement.value);

          quantity++;
          quantityElement.value = quantity;
          localStorage.setItem(`quantity_${productId}`, quantity);
          
          updateTotalAmount();      
          await updateProductQuantityInBackend(cartID, productId, quantity);
  });
});

decreaseQuantityBtn.forEach(button => {
  button.addEventListener('click', async () => {
      const productId = button.getAttribute('data-product-id');
      const quantityElement = document.querySelector(`.productQuantity[data-product-id="${productId}"]`);
      let quantity = parseInt(quantityElement.value);

      if (quantity > 1) { 
          quantity--;
          quantityElement.value = quantity;
          localStorage.setItem(`quantity_${productId}`, quantity);

          updateTotalAmount();
          await updateProductQuantityInBackend(cartID, productId, quantity);
      }
  });
});

productQuantities.forEach(input => {
  input.addEventListener('input', async () => {
      const productId = input.getAttribute('data-product-id');
      let quantity = parseInt(input.value);

      if (quantity < 1) {
          quantity = 1;
          input.value = 1;
      }

      updateTotalAmount();
      await updateProductQuantityInBackend(cartID, productId, quantity);
      localStorage.setItem(`quantity_${productId}`, quantity);
  });
});

async function updateProductQuantityInBackend(cartID, productID, quantity) {
  try {
      const response = await fetch(`/api/carts/${cartID}/products/${productID}`, {
          method: 'PUT', 
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
          const errorData = await response.json();
          Swal.fire({
              title: 'Error!',
              text: `Failed to update product quantity: ${errorData.error}`,
              icon: 'error',
              confirmButtonText: 'OK'
          });
      }
  } catch (error) {
      Swal.fire({
          title: 'Error!',
          text: `Failed to communicate with server: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK'
      });
  }
}


const removeProductFromCartBtn = document.querySelector('#removeProductFromCartBtn');
removeProductFromCartBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    const pid = removeProductFromCartBtn.getAttribute("data-product-id");
    const productTitle = removeProductFromCartBtn.getAttribute('data-product-title');

    const confirmDelete = await Swal.fire({
        title: `¿Estás seguro?`,
        text: `¿Quieres quitar ${productTitle} de tu carrito?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, Quitar del carrito',
        cancelButtonText: 'Cancelar'
    });

    if (confirmDelete.isConfirmed) {
        try {
            const response = await fetch(`/api/carts/${cartID}/products/${pid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Quitado',
                    text: `El producto ${productTitle} fue quitado del carrito correctamente`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    evt.target.closest('.product-card').remove();
                    updateTotalAmount(); 
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
});

ticketBtn.addEventListener('click', async () => {
    if (!cartID) {
        Swal.fire({
            title: 'Error!',
            text: 'Error: no se encuentra cart ID',
            icon: 'error',
            confirmButtonText: 'OK'
        });
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

        if (response.ok) {
            Swal.fire({
                title: 'Compra Finalizada',
                text: `Compra finalizada con éxito\nHora de la compra: ${responseData.payload.purchase_datetime}\nTicket generado con el código ${responseData.payload.code}\nComprador ${responseData.payload.purchaser}\nTotal ${responseData.payload.amount}`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/index';
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: `Error al finalizar la compra: ${responseData.error}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: 'Error al finalizar la compra',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});