# Simple REST API
This is the simple REST API for shop. You can create users, add products, make orders.

Build with:
- Node.js
- Express
- Mongoose
- JWT

## Install
1. Clone and install dependencies:
```
git clone https://github.com/pytnik23/node-rest-shop.git
cd node-rest-shop
npm install
```

2. In root directory create file `.env` and define `JWT_KEY` variable:
```
JWT_KEY=superpoopersecret
```
In this file you can also define `HOST`(default: `http://localhost`) and `PORT`(default `3000`) variables.

3. Start the server:
```
npm start
```

## Usage

### User
```javascript
const userId = 'user_id'; // _id from DB
const JWT = 'JSON_WEB_TOKEN';

// User signup
const user = {
    email: String, // required
    password: String // required
};

fetch('http://localhost:3000/user/signup', {
    method: 'POST',
    body: JSON.stringify(user)
});

// User login
const user = {
    email: String, // required
    password: String // required
};

fetch('http://localhost:3000/user/login', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: { "Authorization": `Bearer ${JWT}` }
});

// Delete user by ID
fetch(`http://localhost:3000/products/${userId}`, {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${JWT}` }
});
```

### Products
```javascript
const productId = 'product_id'; // _id from DB
const JWT = 'JSON_WEB_TOKEN';

// Get all products
fetch('http://localhost:3000/products');

// Get product by ID
fetch(`http://localhost:3000/products/${productId}`);

// Create product
const formData = new FormData();

formData.append('name', String); // required
formData.append('price', Number); // required
formData.append('productImage', file); // optional, support formats jpeg|jpg|png

fetch(`http://localhost:3000/products/${productId}`, {
    method: 'POST',
    body: formData,
    headers: { "Authorization": `Bearer ${JWT}` }
});

// Update product
const formData = new FormData();

formData.append('price', Number);

fetch(`http://localhost:3000/products/${productId}`, {
    method: 'PATCH',
    body: formData,
    headers: { "Authorization": `Bearer ${JWT}` }
});

// Delete product by ID
fetch(`http://localhost:3000/products/${productId}`, {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${JWT}` }
});
```

### Orders
```javascript
const orderId = 'order_id'; // _id from DB
const JWT = 'JSON_WEB_TOKEN';

// Get all orders
fetch('http://localhost:3000/orders', {
    headers: { "Authorization": `Bearer ${JWT}` }
});

// Get order by ID
fetch(`http://localhost:3000/orders/${orderId}`, {
    headers: { "Authorization": `Bearer ${JWT}` }
});

// Create order
const order = {
    product: productId, // required
    quantity: Number // optional, (default: 1)
};

fetch('http://localhost:3000/orders', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: { "Authorization": `Bearer ${JWT}` }
});

// Delete order by ID
fetch(`http://localhost:3000/orders/${orderId}`, {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${JWT}` }
});
```
