
document.addEventListener('DOMContentLoaded', () => {
    // Add item to cart when clicking "Order now"
    const orderButtons = document.querySelectorAll('.ord-btn');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Disable button to prevent multiple clicks
            this.disabled = true;
            this.textContent = 'Added to Cart';

            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            // Create order item object
            const orderItem = {
                id: id,
                name: name,
                price: price,
                image: image,
                quantity: 1 // Default quantity
            };
            
            // Retrieve current orders from localStorage
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            
            // Check if item already exists in the cart
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

    // Display orders in orders.html
    const ordersContainer = document.getElementById('orders-container');
    const orderItems = JSON.parse(localStorage.getItem('orders')) || [];

    if (orderItems.length === 0) {
        ordersContainer.innerHTML = '<p>No items in your order yet!</p>';
    } else {
        // Clear "No items" message
        ordersContainer.innerHTML = '';

        // Add each item to the orders container
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

        // Remove item from cart
        if (event.target.classList.contains('remove-btn')) {
            const index = event.target.getAttribute('data-index');
            orders.splice(index, 1);
            localStorage.setItem('orders', JSON.stringify(orders));
            event.target.closest('.order-item').remove();

            // If cart is empty, show message
            if (orders.length === 0) {
                ordersContainer.innerHTML = '<p>No items in your order yet!</p>';
            }
        }
    });

    // Confirm order
    ordersContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('confirm-btn')) {
            const itemName = event.target.closest('.order-item').querySelector('.order-details h3').textContent;
            alert(`Order Confirmed for ${itemName}!`);
        }
    });
});



  