const logOutBtn = document.querySelector('#logOutBtn');
const viewCartBtn = document.querySelector('#viewCartBtn');
const cartIDElement = document.querySelector('#cartID');
const createProductBtn = document.querySelector('#createProductBtn');
const viewUserAccountBtn = document.querySelector("#viewUserAccountBtn")

logOutBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    try {
        const response = await fetch('/api/sessions/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            window.location.href = '/index';
        } else {
            console.error('Error al hacer logout');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
viewCartBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const cartID = cartIDElement.textContent.split(':')[1].trim();
    if (cartID) {
        window.location.href = `/cart/${cartID}`;
    } else {
        console.error('Cart ID no encontrado');
    }
});
viewUserAccountBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    const email = evt.target.getAttribute('data-user-email');
    const response = await fetch(`/api/users/${email}`);
    const result = await response.json();
    const user = result.payload;
    if (user) {
        const userId = user._id;
        console.log(userId);
        
        window.location.href = `/user/${userId}`;
    } else {
        console.log('User not found');
    }
});
if (createProductBtn) {
    createProductBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        window.location.href = '/create-products';
    });
}


document.querySelectorAll('.dropdown-toggle').forEach(item => {
    item.addEventListener('click', event => {
   
      if(event.target.classList.contains('dropdown-toggle') ){
        event.target.classList.toggle('toggle-change');
      }
      else if(event.target.parentElement.classList.contains('dropdown-toggle')){
        event.target.parentElement.classList.toggle('toggle-change');
      }
    })
  });
