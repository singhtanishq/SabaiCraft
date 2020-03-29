function showPopup() {
    document.getElementById('popup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function logout() {
    closePopup();
}

document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('popup').addEventListener('click', function(event) {
        if (event.target === this) {
            closePopup();
        }
    });

    document.querySelector('a[href="#home"]').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('home').scrollIntoView();
    });

    let banners = document.querySelectorAll('.banner');
    let currentBannerIndex = 0;

    function showBanner(index) {
        banners.forEach((banner, i) => {
            if (i === index) {
                banner.style.display = 'block';
            } else {
                banner.style.display = 'none';
            }
        });
    }

    function switchBanner() {
        currentBannerIndex = (currentBannerIndex + 1) % banners.length;
        showBanner(currentBannerIndex);
    }

    showBanner(currentBannerIndex);
    setInterval(switchBanner, 2000);

    // New code for reviews section
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

    const addToCartButtons = document.querySelectorAll('.buy-button');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const addedToCartMessage = document.createElement('div');
            addedToCartMessage.textContent = 'Added to cart';
            addedToCartMessage.classList.add('added-to-cart-message');
            document.body.appendChild(addedToCartMessage);

            setTimeout(() => {
                addedToCartMessage.remove();
            }, 3000);
        });
    });

    // New code for product image click redirect
    const productImages = document.querySelectorAll('.product img');

    productImages.forEach(image => {
        image.addEventListener('click', function(event) {
            window.location.href = 'product.html'; // Change this URL to your actual product page
        });
    });

});
