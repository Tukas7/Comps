document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password')
    };

    if (data.password !== data.confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Регистрация успешна!');
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            alert('Ошибка регистрации: ' + errorData.error);
        }
    } catch (error) {
        alert('Ошибка соединения: ' + error.message);
    }
});



