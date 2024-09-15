const registerBtn = document.querySelector('#registerBtn');
const forgotPasswordBtn = document.querySelector('#forgotPasswordBtn');
const githubLoginBtn = document.querySelector('#githubLoginBtn');

registerBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    window.location.href = '/register';
});

const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            window.location.href = '/index';

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
            text: `Ocurrió un error, porfavor intentalo nuevamente: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

forgotPasswordBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    window.location.href = '/password-recovery';
});

githubLoginBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    window.location.href = '/api/sessions/github';
});