function nextPage(currentPageId, nextPageId) {
    document.getElementById(currentPageId).style.display = 'none';
    document.getElementById(nextPageId).style.display = 'block';
}

function prevPage(currentPageId, prevPageId) {
    document.getElementById(currentPageId).style.display = 'none';
    document.getElementById(prevPageId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    const totalAmountElement = document.getElementById('total-amount');
    const quantityControls = document.querySelectorAll('.quantity-controls');

    let totalAmount = 2000;

    function updateTotalAmount() {
        let productTotal = 800 * parseInt(quantityControls[0].querySelector('.quantity-number').textContent) +
                           1200 * parseInt(quantityControls[1].querySelector('.quantity-number').textContent);

        totalAmount = productTotal;
        totalAmountElement.textContent = totalAmount;
    }

    quantityControls.forEach(function(control) {
        const quantityNumber = control.querySelector('.quantity-number');

        control.querySelector('.plus').addEventListener('click', function() {
            let value = parseInt(quantityNumber.textContent);
            value++;
            quantityNumber.textContent = value;
            updateTotalAmount();
        });

        control.querySelector('.minus').addEventListener('click', function() {
            let value = parseInt(quantityNumber.textContent);
            if (value > 1) {
                value--;
                quantityNumber.textContent = value;
                updateTotalAmount();
            }
        });
    });

    updateTotalAmount();
});

document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('payment-form');
    const cardDetails = document.getElementById('card-details');
    const netbankingDetails = document.getElementById('netbanking-details');
    const upiDetails = document.getElementById('upi-details');
    const paypalDetails = document.getElementById('paypal-details');
    const cashDetails = document.getElementById('cash-details');

    paymentForm.addEventListener('change', function() {
        const selectedMethod = this.elements['payment-method'].value;
        cardDetails.style.display = selectedMethod === 'card' ? 'block' : 'none';
        netbankingDetails.style.display = selectedMethod === 'netbanking' ? 'block' : 'none';
        upiDetails.style.display = selectedMethod === 'upi' ? 'block' : 'none';
        paypalDetails.style.display = selectedMethod === 'paypal' ? 'block' : 'none';
        cashDetails.style.display = selectedMethod === 'cash' ? 'block' : 'none';
    });
});
function nextPage(currentPageId, nextPageId) {
    document.getElementById(currentPageId).style.display = 'none';
    document.getElementById(nextPageId).style.display = 'block';
}

function prevPage(currentPageId, prevPageId) {
    document.getElementById(currentPageId).style.display = 'none';
    document.getElementById(prevPageId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    const totalAmountElement = document.getElementById('total-amount');
    const quantityControls = document.querySelectorAll('.quantity-controls');

    let totalAmount = 2000;

    function updateTotalAmount() {
        let productTotal = 800 * parseInt(quantityControls[0].querySelector('.quantity-number').textContent) +
                           1200 * parseInt(quantityControls[1].querySelector('.quantity-number').textContent);

        totalAmount = productTotal;
        totalAmountElement.textContent = totalAmount;
    }

    quantityControls.forEach(function(control) {
        const quantityNumber = control.querySelector('.quantity-number');

        control.querySelector('.plus').addEventListener('click', function() {
            let value = parseInt(quantityNumber.textContent);
            value++;
            quantityNumber.textContent = value;
            updateTotalAmount();
        });

        control.querySelector('.minus').addEventListener('click', function() {
            let value = parseInt(quantityNumber.textContent);
            if (value > 1) {
                value--;
                quantityNumber.textContent = value;
                updateTotalAmount();
            }
        });
    });

    updateTotalAmount();
});

document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('payment-form');
    const cardDetails = document.getElementById('card-details');
    const netbankingDetails = document.getElementById('netbanking-details');
    const upiDetails = document.getElementById('upi-details');
    const paypalDetails = document.getElementById('paypal-details');
    const cashDetails = document.getElementById('cash-details');

    paymentForm.addEventListener('change', function() {
        const selectedMethod = this.elements['payment-method'].value;
        cardDetails.style.display = selectedMethod === 'card' ? 'block' : 'none';
        netbankingDetails.style.display = selectedMethod === 'netbanking' ? 'block' : 'none';
        upiDetails.style.display = selectedMethod === 'upi' ? 'block' : 'none';
        paypalDetails.style.display = selectedMethod === 'paypal' ? 'block' : 'none';
        cashDetails.style.display = selectedMethod === 'cash' ? 'block' : 'none';
    });
});
