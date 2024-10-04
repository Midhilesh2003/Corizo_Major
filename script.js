const bagCount = document.getElementById('bag-count');
const addToBagButtons = document.querySelectorAll('.add-to-bag');
const filterButtons = document.querySelectorAll('.filter-btn');
const products = document.querySelectorAll('.product');

// Load the bag from localStorage or initialize an empty array
let bag = JSON.parse(localStorage.getItem('bag')) || [];

// Update the bag count on page load
bagCount.textContent = bag.length;

addToBagButtons.forEach(button => {
    button.addEventListener('click', () => {
        const product = button.closest('.product');
        const productTitle = product.querySelector('.product-title').textContent;
        const productPrice = product.querySelector('.product-price').textContent.replace('₹', '').trim();

        // Check if the product is already in the bag
        const existingItem = bag.find(item => item.title === productTitle);

        if (existingItem) {
            existingItem.quantity += 1; // Increment quantity if already in the bag
        } else {
            // Add new item to the bag
            bag.push({
                title: productTitle,
                price: productPrice,
                quantity: 1
            });
        }

        // Update bag count
        bagCount.textContent = bag.length;

        // Store the updated bag in localStorage
        localStorage.setItem('bag', JSON.stringify(bag));

        alert(`${productTitle} has been added to your bag!`);
    });
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');

        products.forEach(product => {
            if (category === 'all' || product.classList.contains(category)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });

        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to the clicked button
        button.classList.add('active');
    });
});
