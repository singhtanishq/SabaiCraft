const images = ["Images/p1.jpg", "Images/p2.jpg", "Images/p3.jpg"];
const descriptions = ["Side View of the Basket", "Top View of the Basket", "Large Cap Basket"];
let currentIndex = 0;

function changeImage(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    document.getElementById('product-image').src = images[currentIndex];
    document.getElementById('image-description').innerText = descriptions[currentIndex];
}

function redirectTo(page) {
    window.location.href = page;
}

let reviewIndex = 0;
    const reviews = document.querySelectorAll('.review-box');

    function showReview(index) {
        reviews.forEach(review => review.style.transform = `translateX(${-index * 100}%)`);
    }

    function nextReview() {
        reviewIndex = (reviewIndex + 1) % reviews.length;
        showReview(reviewIndex);
    }

    setInterval(nextReview, 3000);

document.addEventListener('DOMContentLoaded', function() {
    const buyNowButton = document.querySelector('.buy-now-button');
    const addToCartButton = document.querySelector('.add-to-cart-button');

    function redirectToCart() {
        window.location.href = 'cart.html';
    }

    function showAddedToCartMessage() {
        const messageBox = document.createElement('div');
        messageBox.textContent = 'Added to cart';
        messageBox.className = 'added-to-cart-message';
        document.body.appendChild(messageBox);

        setTimeout(function() {
            messageBox.remove();
        }, 3000);
    }

    buyNowButton.addEventListener('click', redirectToCart);
    addToCartButton.addEventListener('click', showAddedToCartMessage);
});
