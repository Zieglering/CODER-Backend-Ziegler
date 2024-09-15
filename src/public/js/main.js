const logOutBtn = document.querySelector('#logOutBtn');
const viewCartBtn = document.querySelector('#viewCartBtn');
const createProductBtn = document.querySelector('#createProductBtn');
const realtimeproductsBtn = document.querySelector('#realtimeproductsBtn');
const viewUserAccountBtn = document.querySelector("#viewUserAccountBtn")
const userName = document.querySelector("#user-name")
const chatBtn = document.querySelector('#chatBtn')


const getUserName = async (userId) => {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const result = await response.json();
        const user = result.payload;
        if (user && user.first_name) {
            userName.textContent = user.first_name;
        } else {
            userName.textContent = "User";
        }
    } catch (error) {
        console.error('Error al buscar el nombde de usuario en la base de datos:', error);
        userName.textContent = "Nombre de usuario no encontrado"; 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const userId = document.querySelector('#user-name').dataset.userId;
    if (userId) {
        getUserName(userId); 
    }
});

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
        console.error('Error:', error.message);
    }
});
if (viewCartBtn){
    viewCartBtn.addEventListener('click', async (evt) => {
        const userId = evt.target.getAttribute('data-user-id');
        const response = await fetch(`/api/users/${userId}`)
        const result = await response.json();
        const cartID = result.payload.cart
        if (cartID) {
            window.location.href = `/cart/${cartID}`;
        } else {
            console.error('Cart ID no encontrado');
        }
    });
}

if (viewUserAccountBtn) {
    viewUserAccountBtn.addEventListener('click', async (evt) => {
        evt.preventDefault();
        const userId = evt.target.getAttribute('data-user-id');
        const response = await fetch(`/api/users/${userId}`);
        const result = await response.json();
        const user = result.payload;
        if (user) {
            const userId = user._id;            
            window.location.href = `/user/${userId}`;
        } else {
            console.log('Usuario no encontrado');
        }
    });
}

if (createProductBtn) {
    createProductBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        window.location.href = '/create-products';
    });
}

if (realtimeproducts) {
    realtimeproducts.addEventListener('click', (evt) => {
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

  chatBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    try {
        const response = await fetch('/chat', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            window.location.href = '/chat';
        } else {
            console.error('Error al cargar el chat');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
});