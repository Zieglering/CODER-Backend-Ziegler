document.addEventListener('DOMContentLoaded', function () {
    const volverBtn = document.querySelector('#volverBtn');
    volverBtn.addEventListener('click', async () => {
        window.location.href = '/index';
    });

    const handleFileUpload = (formId, suffix) => {
        const form = document.getElementById(formId);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const uid = document.getElementById('user-details').getAttribute('data-uid');
            const formData = new FormData(form);
            formData.append('suffix', suffix);

            try {
                const response = await fetch(`/api/users/${uid}/documents`, {
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