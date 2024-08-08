const volverBtn = document.querySelector('#volverBtn');
const userDetailsButtons = document.querySelectorAll('.user-details-btn');
const deleteButtons = document.querySelectorAll('.btn-outline-danger');
const roleSwitches = document.querySelectorAll('.role-switch');


volverBtn.addEventListener('click', async () => {
    window.location.href = '/products';
});

userDetailsButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const userId = event.target.getAttribute('data-user-id');
        window.location.href = `/user/${userId}`;
    });
});


roleSwitches.forEach(switchElement => {
    switchElement.addEventListener('change', async (event) => {
        const userId = event.target.getAttribute('data-user-id');
        const newRole = event.target.checked ? 'premium' : 'user';
        
        try {
            const response = await fetch(`/api/users/premium/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                console.log(response)
                document.getElementById(`role-${userId}`).textContent = newRole;
                Swal.fire({
                    title: 'Rol actualizado',
                    text: `El rol del usuario ha sido cambiado a ${newRole}`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                const result = await response.json();
                console.log(result)
                Swal.fire({
                    title: 'Error!',
                    text: result.error.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                event.target.checked = !event.target.checked;
            }
        } catch (error) {

            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            event.target.checked = !event.target.checked;
        }
    });
});


deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
        const userId = event.target.getAttribute('data-user-id');

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
                        event.target.closest('.user-details').remove();
                    });
                } else {
                    const result = await response.json();
                    console.log(result)
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