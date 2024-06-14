const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const path = require('path');
const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'monorail.proxy.rlwy.net',
    database: 'railway',
    password: 'mzfBiohSdTIWjQeoqfyPYRRbLGRDLviw',
    port: 49609,
});

app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname));
  });

app.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [firstname, lastname, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Пользователь не найден' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Неверный пароль' });
        }

        res.status(200).json({ message: 'Авторизация успешна' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/add-to-cart', async (req, res) => {
    const { userId, products } = req.body;

    try {
        await pool.query('BEGIN');

        const insertCartQuery = 'INSERT INTO carts (user_id) VALUES ($1) RETURNING id';
        const result = await pool.query(insertCartQuery, [userId]);
        const cartId = result.rows[0].id;

        const insertProductQuery = 'INSERT INTO cart_products (cart_id, product_id, product_name, product_price, product_image, quantity) VALUES ($1, $2, $3, $4, $5, $6)';
        for (const product of products) {
            await pool.query(insertProductQuery, [cartId, product.id, product.name, product.price, product.image, product.quantity]);
        }

        await pool.query('COMMIT');
        res.status(200).json({ message: 'Товары добавлены в корзину' });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});
app.post('/place-order', async (req, res) => {
    const { userId, products, totalPrice } = req.body;

    try {
        await pool.query('BEGIN');

        const insertOrderQuery = 'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id';
        const result = await pool.query(insertOrderQuery, [userId, totalPrice]);
        const orderId = result.rows[0].id;

        const insertOrderDetailQuery = 'INSERT INTO order_details (order_id, product_id, product_name, product_price, product_image, quantity) VALUES ($1, $2, $3, $4, $5, $6)';
        for (const product of products) {
            await pool.query(insertOrderDetailQuery, [orderId, product.id, product.name, product.price, product.image, product.quantity]);
        }

        await pool.query('COMMIT');
        res.status(200).json({ message: 'Заказ успешно оформлен' });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

app.get('/user-orders/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const ordersQuery = 'SELECT * FROM orders WHERE user_id = $1';
        const ordersResult = await pool.query(ordersQuery, [userId]);

        const orders = await Promise.all(ordersResult.rows.map(async order => {
            const orderDetailsQuery = 'SELECT * FROM order_details WHERE order_id = $1';
            const orderDetailsResult = await pool.query(orderDetailsQuery, [order.id]);
            return {
                ...order,
                total_price: parseFloat(order.total_price), // Преобразование в число
                details: orderDetailsResult.rows
            };
        }));

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
