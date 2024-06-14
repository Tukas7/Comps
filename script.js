document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('theme-toggle');
    const scrollUpButton = document.getElementById('scrollUp');

    // Load the user's theme preference from local storage if it exists
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        toggleSwitch.checked = currentTheme === 'dark-theme';
    }

    toggleSwitch.addEventListener('change', function () {
        if (toggleSwitch.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.removeItem('theme');
        }
    });

    // Show or hide the scroll-up button based on the scroll position
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollUpButton.style.display = 'block';
        } else {
            scrollUpButton.style.display = 'none';
        }
    });

    // Smooth scroll to top on button click
    scrollUpButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartContainer = document.querySelector('.mini-cart-content');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = this.dataset.price;
            const productImage = this.dataset.image;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            const product = cart.find(item => item.id === productId);
            if (product) {
                product.quantity++;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, image: productImage, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Товар добавлен в корзину');
            updateCartDisplay();
        });
    });

    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartContainer.innerHTML = '';

        cart.forEach(product => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-img-details');
            cartItem.innerHTML = `
                <div class="cart-img-photo">
                    <a href="#"><img src="${product.image}" alt="#"></a>
                </div>
                <div class="cart-img-content">
                    <a href="#"><h4>${product.name}</h4></a>
                    <span>
                        <strong class="text-right">${product.quantity} x</strong>
                        <strong class="cart-price text-right">₽${product.price}</strong>
                    </span>
                </div>
                <div class="pro-del">
                    <a href="#" class="remove-from-cart" data-id="${product.id}"><i class="fa fa-times"></i></a>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        const totalAmount = cart.reduce((total, product) => total + product.price * product.quantity, 0);
        const cartInnerBottom = document.createElement('div');
        cartInnerBottom.classList.add('cart-inner-bottom');
        cartInnerBottom.innerHTML = `
            <span class="total">
                Итого:
                <span class="amount">₽${totalAmount.toFixed(2)}</span>
            </span>
            <span class="cart-button-top">
                <a href="cart.html">Корзина</a>
                <a href="checkout.html">Рассчитать</a>
            </span>
        `;
        cartContainer.appendChild(cartInnerBottom);

        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                removeFromCart(productId);
            });
        });
    }

    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(product => product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар удален из корзины');
        updateCartDisplay();
    }

    updateCartDisplay();
});

document.addEventListener('DOMContentLoaded', function() {
    const cartContainer = document.getElementById('cart-items');

    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartContainer.innerHTML = '';

        cart.forEach(product => {
            const cartItem = document.createElement('tr');
            cartItem.innerHTML = `
                <td class="text-center">
                    <a href="#"><img class="img-thumbnail" src="${product.image}" alt="#" /></a>
                </td>
                <td class="text-left">
                    <a href="#">${product.name}</a>
                </td>
                <td class="text-left">
                    <input class="form-control" type="number" value="${product.quantity}" min="1" data-id="${product.id}" />
                </td>
                <td class="text-right">₽${product.price}</td>
                <td class="text-right">₽${(product.price * product.quantity).toFixed(2)}</td>
                <td class="text-right">
                    <button class="btn btn-danger remove-from-cart" data-id="${product.id}">
                        <i class="fa fa-times-circle"></i>
                    </button>
                </td>
            `;
            cartContainer.appendChild(cartItem);
        });

        const totalAmount = cart.reduce((total, product) => total + product.price * product.quantity, 0);
        const cartInnerBottom = document.createElement('tr');
        cartInnerBottom.innerHTML = `
            <td colspan="4" class="text-right"><strong>Итого:</strong></td>
            <td class="text-right">₽${totalAmount.toFixed(2)}</td>
            <td></td>
        `;
        cartContainer.appendChild(cartInnerBottom);

        // Обновление количества товара
        const quantityInputs = cartContainer.querySelectorAll('input[type="number"]');
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.dataset.id;
                const newQuantity = parseInt(this.value);
                updateProductQuantity(productId, newQuantity);
            });
        });

        // Удаление товара из корзины
        const removeButtons = cartContainer.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                removeFromCart(productId);
            });
        });
    }

    function updateProductQuantity(productId, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }

    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(product => product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар удален из корзины');
        updateCartDisplay();
    }

    updateCartDisplay();
});
document.getElementById('place-order-btn').addEventListener('click', async function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const userId = 1; // Замените на текущий userId
    const totalPrice = cart.reduce((total, product) => total + product.price * product.quantity, 0);

    const orderData = {
        userId,
        products: cart,
        totalPrice
    };

    try {
        const response = await fetch('http://localhost:3000/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert('Заказ успешно оформлен');
            localStorage.removeItem('cart');
            window.location.href = 'my-account.html';
        } else {
            const errorData = await response.json();
            alert('Ошибка оформления заказа: ' + errorData.error);
        }
    } catch (error) {
        alert('Ошибка соединения: ' + error.message);
    }
});
