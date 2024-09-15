const searchInput = document.querySelector('#searchInput');
const filterLinks = document.querySelectorAll('.filter-link');
const searchForm = document.querySelector('#searchForm');

const productButtons = document.querySelectorAll(".product-btn");

const isAuthenticated = document.querySelector('section').dataset.authenticated === "true";

productButtons.forEach(button => {
    button.addEventListener("click", function () {
        
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Logueate',
                text: 'Debe estar logueado para realizar esa operación',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ir a Login',
                cancelButtonText: 'Continuar Navegando',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `/login`;
                }
            });
            return;
        }

        const productId = button.getAttribute("data-product-id");
        window.location.href = `/product/${productId}`;
    });
});



function updateUrl() {
    const params = new URLSearchParams(window.location.search);

    const searchValue = searchInput.value.trim();
    if (searchValue) {
        params.set('product', searchValue);
    } else {
        params.delete('product');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.location.href = newUrl;
}

function removeDiacritics(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filterProducts() {
    const inputValue = removeDiacritics(searchInput.value.trim().toLowerCase());
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(productCard => {
        const productTitle = removeDiacritics(productCard.querySelector('.product-title').textContent.trim().toLowerCase());

        if (productTitle.includes(inputValue)) {
            productCard.style.display = 'block';
        } else {
            productCard.style.display = 'none';
        }
    });
}

searchInput.addEventListener('input', filterProducts);

filterLinks.forEach(link => {
    link.addEventListener('click', (evt) => {
        evt.preventDefault();
        const filter = evt.target.getAttribute('data-filter');
        const value = evt.target.getAttribute('data-value');
        const params = new URLSearchParams(window.location.search);

        if (value) {
            params.set(filter, value);
        } else {
            params.delete(filter);
        }

        const dropdownButton = evt.target.closest('.dropdown').querySelector('.dropdown-toggle');
        dropdownButton.textContent = evt.target.textContent;

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.location.href = newUrl;
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    const category = params.get('category');
    const status = params.get('status');
    const sortByPrice = params.get('sortByPrice');

    if (category) {
        document.getElementById('categoryDropdownButton').textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }

    if (status) {
        document.getElementById('statusDropdownButton').textContent = status === 'true' ? 'Disponibles' : 'No disponibles';
    }

    if (sortByPrice) {
        document.getElementById('sortByPriceDropdownButton').textContent = sortByPrice === '1' ? 'Ordenar ascendente' : 'Ordenar descendente';
    }
});