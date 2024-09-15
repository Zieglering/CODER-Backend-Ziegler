const userDetails = document.querySelector('#user-details');
const userId = userDetails.getAttribute('data-user-id');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getUserDetails = async () => {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const result = await response.json();
        
        if (response.ok) {
            const user = result.payload;

            userDetails.innerHTML = `
                <p>Nombre: ${capitalizeFirstLetter(user.first_name)} ${capitalizeFirstLetter(user.last_name)}</p>
                <p>Edad: ${user.age || 'N/A'}</p>
                <p>Email: ${user.email}</p>
                <p>Rol: ${user.role}</p>
            `;
        } else {
            console.error('Error al buscar al usuario:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    getUserDetails();

    const volverBtn = document.querySelector('#volverBtn');
    volverBtn.addEventListener('click', async () => {
        window.location.href = '/index';
    });

    const handleFileUpload = (formId, suffix) => {
        const form = document.getElementById(formId);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            formData.append('suffix', suffix);

            try {
                const response = await fetch(`/api/users/${userId}/documents`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Suffix': suffix
                    }
                });

                if (response.ok) {
                    alert('Archivo subido correctamente');
                } else {
                    const errorText = await response.text();
                    alert('El archivo no se subió: ' + errorText);
                }
            } catch (error) {
                console.error('Error al subir el archivo:', error);
                alert('El archivo no se subió');
            }
        });
    };

    handleFileUpload('uploadProfileFiles', 'Profile');
    handleFileUpload('uploadId', 'Id');
    handleFileUpload('uploadAddressDocument', 'AddressDocument');
    handleFileUpload('uploadAccountStatusDocument', 'AccountStatusDocument');
});
