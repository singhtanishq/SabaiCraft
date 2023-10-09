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
});
