const volverBtn = document.querySelector('#volverBtn');
const userDetailsButtons = document.querySelectorAll('.user-details-btn');
const deleteButtons = document.querySelectorAll('.btn-outline-danger');
const roleSwitches = document.querySelectorAll('.role-switch');
const userDetails = document.querySelector('#user-details');

document.addEventListener('DOMContentLoaded', function () {

    volverBtn.addEventListener('click', async () => {
        window.location.href = '/index';
    });

    userDetailsButtons.forEach(button => {
        button.addEventListener('click', async (evt) => {
            const email = evt.target.getAttribute('data-user-email');
            const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
            const result = await response.json();
            const user = result.payload[0];
    
            if (user) {
                const userId = user._id;            
                window.location.href = `/user/${userId}`;
            } else {
                console.log('Usuario no encontrado');
            }
        });
    });

    roleSwitches.forEach(switchElement => {
        switchElement.addEventListener('change', async (evt) => {
            const userId = evt.target.getAttribute('data-user-id');
            const newRole = evt.target.checked ? 'premium' : 'user';

            try {
                const response = await fetch(`/api/users/premium/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ role: newRole })
                });

                if (response.ok) {
                    document.querySelector(`#role-${userId}`).textContent = newRole;
                    Swal.fire({
                        title: 'Rol actualizado',
                        text: `El rol del usuario ha sido cambiado a ${newRole}`,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    const result = await response.json();
                    Swal.fire({
                        title: 'No se pudo cambiar el rol',
                        text: result.error,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    evt.target.checked = !evt.target.checked;
                }
            } catch (error) {

                Swal.fire({
                    title: 'Error!',
                    text: error,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                evt.target.checked = !evt.target.checked;
            }
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (evt) => {
            const userId = evt.target.getAttribute('data-user-id');

            const result = await Swal.fire({
                title: '¿Estás seguro que queres borrar este usuario?',
                text: "Esta acción es permanente y no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        Swal.fire({
                            title: 'Usuario eliminado',
                            text: 'El usuario ha sido eliminado correctamente',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            evt.target.closest('.user-details').remove();
                        });
                    } else {
                        const result = await response.json();
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
            }
        });
    });
});