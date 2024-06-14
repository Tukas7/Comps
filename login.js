document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Авторизация успешна!');
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            alert('Ошибка авторизации: ' + errorData.error);
        }
    } catch (error) {
        alert('Ошибка соединения: ' + error.message);
    }
});