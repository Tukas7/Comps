document.addEventListener('DOMContentLoaded', async function() {
    const userId = 1; // Замените на текущий userId
    const orderHistoryContainer = document.getElementById('order-history-items');

    try {
        const response = await fetch(`http://localhost:3000/user-orders/${userId}`);
        const orders = await response.json();

        orders.forEach(order => {
            order.details.forEach(detail => {
                const orderItem = document.createElement('tr');
                orderItem.innerHTML = `
                    <td class="text-center">
                        <a href="#"><img class="img-thumbnail" src="${detail.product_image}" alt="#"></a>
                    </td>
                    <td class="text-left">
                        <a href="#">${detail.product_name}</a>
                    </td>
                    <td class="text-left">${detail.quantity}</td>
                    <td class="text-right">₽${detail.product_price}</td>
                    <td class="text-right">₽${(detail.product_price * detail.quantity).toFixed(2)}</td>
                `;
                orderHistoryContainer.appendChild(orderItem);
            });

            const orderTotalRow = document.createElement('tr');
            const totalPrice = parseFloat(order.total_price); // Преобразование в число
            orderTotalRow.innerHTML = `
                <td class="text-right" colspan="4"><strong>Итого:</strong></td>
                <td class="text-right">₽${totalPrice.toFixed(2)}</td>
            `;
            orderHistoryContainer.appendChild(orderTotalRow);
        });
    } catch (error) {
        alert('Ошибка загрузки истории заказов: ' + error.message);
    }
});
