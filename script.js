const products = [
    { id: 1, name: "CandleHolder", price: 1000, quantity: 5, image: "images/candle.jpg" },
    { id: 2, name: "ElephantHead", price: 2000, quantity: 3, image: "images/elephant.jpg" },
    { id: 3, name: "Giraffe", price: 2500, quantity: 10, image: "images/giraffe.jpg" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let discountApplied = false;

function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p>Price: Ksh ${product.price}</p>
            <p>Available: ${product.quantity}</p>
            <input type="number" id="quantity-${product.id}" min="1" max="${product.quantity}" value="1">
            <button onclick="addToCart(${product.id})">Add to Cart <img class="cart-icon" src="images/cart.jpeg" alt="Cart Icon"></button>
        `;
        productList.appendChild(productDiv);
    });
}
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
    if (product.quantity < quantity) {
        alert('Insufficient stock');
        return;
    }

    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({ productId: productId, quantity: quantity });
    }
    product.quantity -= quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    displayProducts();
}
function updateCartQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
        const product = products.find(p => p.id === productId);
        const delta = quantity - cartItem.quantity;
        if (product.quantity < delta) {
            alert('Insufficient stock');
            return;
        }
        cartItem.quantity = quantity;
        product.quantity -= delta;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    displayProducts();
}
function removeFromCart(productId) {
    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
        const product = products.find(p => p.id === productId);
        product.quantity += cartItem.quantity;
        cart = cart.filter(item => item.productId !== productId);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    displayProducts();
}
function displayCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p>Price: $${product.price}</p>
            <p>Quantity: <input type="number" value="${item.quantity}" min="1" max="${product.quantity + item.quantity}" onchange="updateCartQuantity(${item.productId}, this.value)"></p>
            <p>Subtotal: $${product.price * item.quantity}</p>
            <button onclick="removeFromCart(${item.productId})">Remove</button>
        `;
        cartDiv.appendChild(cartItemDiv);
    });
    displayCartSummary();
}
function applyDiscount() {
    if (discountApplied) {
        alert('Discount has already been applied');
        return;
    }

    const discountCode = document.getElementById('discount-code').value;
    let discount = 0;
    if (discountCode === 'SAVE10') {
        discount = 0.10;
    } else if (discountCode === 'SAVE20') {
        discount = 0.20;
    } else {
        alert('Invalid: use SAVE10 or SAVE20');
        return;
    }

    const totalAmountElement = document.getElementById('total-amount');
    const total = parseFloat(totalAmountElement.innerText);
    const discountedTotal = total - (total * discount);
    totalAmountElement.innerText = discountedTotal.toFixed(2);

    discountApplied = true;
}
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    localStorage.removeItem('cart');
    window.location.href = 'payment.html';
}
function displayCartSummary() {
    const totalAmountElement = document.getElementById('total-amount');
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + product.price * item.quantity;
    }, 0);
    totalAmountElement.innerText = total.toFixed(2);
}
displayProducts();
displayCart();
