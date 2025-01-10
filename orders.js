document.addEventListener('DOMContentLoaded', () => {
    // Handle "Order now" button click (in `maharashtrian.html`)
    const orderButtons = document.querySelectorAll('.ord-btn');

    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Disable the button to prevent further clicks
            this.disabled = true;
            this.textContent = 'Added to Cart'; // Change text after click

            // Get food item details from data attributes
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');

            // Create an order object
            const orderItem = {
                id: id,
                name: name,
                price: price,
                image: image,
                quantity: 1 // Default quantity
            };

            // Retrieve current orders from localStorage
            let orders = JSON.parse(localStorage.getItem('orders')) || [];

            // Check if the item already exists in the cart
            const existingOrderIndex = orders.findIndex(item => item.id === id);

            if (existingOrderIndex !== -1) {
                // If item exists, increase the quantity
                orders[existingOrderIndex].quantity += 1;
            } else {
                // If item doesn't exist, add it to the orders
                orders.push(orderItem);
            }

            // Save updated orders to localStorage
            localStorage.setItem('orders', JSON.stringify(orders));

            alert(`${name} added to your order!`);
        });
    });

    // Handle order display, quantity changes, and item removal (in `orders.html`)
    const ordersContainer = document.getElementById('orders-container');
    const orderItems = JSON.parse(localStorage.getItem('orders')) || [];

    if (orderItems.length === 0) {
        ordersContainer.innerHTML = '<p>No items in your order yet!</p>';
    } else {
        // Clear default "No items" message
        ordersContainer.innerHTML = '';

        // Add each item to the DOM
        orderItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');

            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="order-image">
                <div class="order-details">
                    <h3>${item.name}</h3>
                    <p>Price: Rs.${item.price}</p>
                    <div class="quantity">
                        <button class="decrease-btn" data-index="${index}">-</button>
                        <span class="quantity-text" data-index="${index}">${item.quantity}</span>
                        <button class="increase-btn" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="order-buttons">
                    <button class="confirm-btn">Confirm Order</button>
                    <button class="remove-btn" data-index="${index}">Remove Item</button>
                </div>
            `;

            ordersContainer.appendChild(itemElement);
        });
    }

    // Handle Increase/Decrease Quantity
    ordersContainer.addEventListener('click', (event) => {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];

        // Increase quantity
        if (event.target.classList.contains('increase-btn')) {
            const index = event.target.getAttribute('data-index');
            orders[index].quantity += 1;
            document.querySelector(`[data-index="${index}"]`).textContent = orders[index].quantity;
            localStorage.setItem('orders', JSON.stringify(orders));
        }

        // Decrease quantity
        if (event.target.classList.contains('decrease-btn')) {
            const index = event.target.getAttribute('data-index');
            if (orders[index].quantity > 1) {
                orders[index].quantity -= 1;
                document.querySelector(`[data-index="${index}"]`).textContent = orders[index].quantity;
                localStorage.setItem('orders', JSON.stringify(orders));
            }
        }

        // Handle Remove Item
        if (event.target.classList.contains('remove-btn')) {
            const index = event.target.getAttribute('data-index');
            orders.splice(index, 1);
            localStorage.setItem('orders', JSON.stringify(orders));
            event.target.closest('.order-item').remove();

            // Check if there are any items left, and update message
            if (orders.length === 0) {
                ordersContainer.innerHTML = '<p>No items in your order yet!</p>';
            }
        }
    });

    // Handle Confirm Order
    ordersContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('confirm-btn')) {
            const itemName = event.target.closest('.order-item').querySelector('.order-details h3').textContent;
            alert(`Order Confirmed for ${itemName}!`);
        }
    });
});


