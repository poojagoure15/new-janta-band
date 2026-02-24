// Initialize Lucide Icons
lucide.createIcons();

// Set Current Year
document.getElementById('year').textContent = new Date().getFullYear();

// Hero Image Carousel
const heroImages = [
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80"
];

const carouselContainer = document.getElementById('hero-carousel');
let currentImageIndex = 0;

// Initialize Images
heroImages.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Hero Background ${index + 1}`;
    img.className = `absolute inset-0 w-full h-full object-cover carousel-image ${index === 0 ? 'opacity-30' : 'opacity-0'}`;
    carouselContainer.insertBefore(img, carouselContainer.firstChild); // Insert before overlays
});

const images = carouselContainer.querySelectorAll('img');

setInterval(() => {
    images[currentImageIndex].classList.remove('opacity-30');
    images[currentImageIndex].classList.add('opacity-0');
    
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    
    images[currentImageIndex].classList.remove('opacity-0');
    images[currentImageIndex].classList.add('opacity-30');
}, 5000);

// Package Selection
function selectPackage(pkgName) {
    const bookingInput = document.getElementById('booking-package');
    if(bookingInput) {
        bookingInput.value = pkgName;
        updateAdvanceLimits(); // Update limits when package is selected via buttons
        document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
    }
}

function updateAdvanceLimits() {
    const pkg = document.getElementById('booking-package').value;
    const amountInput = document.getElementById('booking-amount');
    const label = document.getElementById('advance-amount-label');
    
    let min = 1;
    let max = 5000;
    
    if (pkg === 'Premium Package') {
        min = 10;
        max = 10000;
    }
    
    amountInput.min = min;
    amountInput.max = max;
    amountInput.placeholder = `Enter amount (₹${min} - ₹${max})`;
    label.textContent = `Advance Amount / अग्रिम राशि (₹${min} - ₹${max})`;
}

// Share Functionality
function shareLink() {
    if (navigator.share) {
        navigator.share({
            title: 'New Janta Band',
            text: 'Check out New Janta Band!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
}

// Inquiry Form Handler
// Form submission is now handled by Formspree via HTML action attribute

// Booking Form Handler
// Intercepts form submission to show payment modal first
async function initiatePayment(e) {
    e.preventDefault();
    
    // Basic Validation
    const mobile = document.getElementById('booking-mobile').value;
    const amount = document.getElementById('booking-amount').value;
    const totalAmount = document.getElementById('booking-total-amount').value;
    const pkg = document.getElementById('booking-package').value;
    
    if(mobile.length !== 10) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    let min = 1;
    let max = 5000;
    
    if (pkg === 'Premium Package') {
        min = 10;
        max = 10000;
    }
    
    if(amount < min || amount > max) {
        alert(`Advance amount must be between ₹${min} and ₹${max} for ${pkg || 'selected package'}`);
        return;
    }

    if(!totalAmount || Number(totalAmount) < Number(amount)) {
        alert('Total amount must be greater than or equal to advance amount');
        return;
    }

    // Call Backend to Create Order
    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency: 'INR' })
        });
        
        const order = await response.json();
        
        if (order.id) {
            // Open Razorpay Checkout
            const options = {
                "key": "rzp_test_YourKeyHere", // Enter the Key ID generated from the Dashboard
                "amount": order.amount, // Amount is in currency subunits. Default currency is INR.
                "currency": order.currency,
                "name": "New Janta Band",
                "description": "Booking Advance Payment",
                "image": "https://example.com/your_logo",
                "order_id": order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": function (response){
                    // Verify Payment
                    verifyPayment(response);
                },
                "prefill": {
                    "name": document.getElementById('booking-name').value,
                    "email": "customer@example.com",
                    "contact": mobile
                },
                "notes": {
                    "address": document.getElementById('booking-location').value
                },
                "theme": {
                    "color": "#F59E0B"
                }
            };
            const rzp1 = new Razorpay(options);
            rzp1.open();
        } else {
            alert('Failed to initiate payment. Please try again.');
        }
    } catch (error) {
        console.error('Error initiating payment:', error);
        alert('Failed to initiate payment. Please try again.');
    }
}

async function verifyPayment(response) {
    try {
        const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
            })
        });
        
        const result = await verifyResponse.json();
        
        if (result.status === 'success') {
            confirmPayment(response.razorpay_payment_id);
        } else {
            alert('Payment verification failed.');
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        alert('Payment verification failed.');
    }
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    const modalContent = document.getElementById('payment-modal-content');
    
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

async function confirmPayment(txnId) {
    // 1. Generate Transaction Details
    const timestamp = Date.now();
    const dateObj = new Date(timestamp);
    const dateStr = dateObj.toLocaleDateString('en-IN');
    const timeStr = dateObj.toLocaleTimeString('en-IN');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const refNumber = `INV-${timestamp.toString().slice(-6)}${random}`;
    // Use actual Razorpay Payment ID if available, otherwise fallback
    const finalTxnId = txnId || `TXN${timestamp}${random}`; 

    // Get Form Values
    const name = document.getElementById('booking-name').value;
    const mobile = document.getElementById('booking-mobile').value;
    const eventDate = document.getElementById('booking-date').value;
    const location = document.getElementById('booking-location').value;
    const pkg = document.getElementById('booking-package').value;
    const advanceAmount = document.getElementById('booking-amount').value;
    const totalAmount = document.getElementById('booking-total-amount').value;
    const remainingAmount = Number(totalAmount) - Number(advanceAmount);

    // 2. Set Hidden Form Fields
    document.getElementById('booking-reference').value = refNumber;
    document.getElementById('booking-transaction-id').value = finalTxnId;
    document.getElementById('booking-remaining-amount').value = remainingAmount;
    document.getElementById('booking-payment-time').value = `${dateStr} ${timeStr}`;
    
    // 3. Populate Invoice Modal
    document.getElementById('inv-number').textContent = refNumber;
    document.getElementById('inv-date').textContent = `${dateStr} ${timeStr}`;
    document.getElementById('inv-txn').textContent = finalTxnId;
    document.getElementById('inv-name').textContent = name;
    document.getElementById('inv-event-date').textContent = eventDate;
    document.getElementById('inv-package').textContent = pkg || 'Custom Package';
    document.getElementById('inv-total').textContent = `₹${totalAmount}`;
    document.getElementById('inv-advance').textContent = `₹${advanceAmount}`;
    document.getElementById('inv-remaining').textContent = `₹${remainingAmount}`;

    // 4. Submit Form to Formspree via AJAX
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);
    
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // 5. Hide Payment Modal & Show Success Modal (Invoice)
            // Note: With Razorpay, the modal closes automatically on success, so we just show the success modal
            closePaymentModal(); // Just in case
            setTimeout(() => {
                showSuccessModal();
                
                // 6. Send WhatsApp Message to Owner
                const message = encodeURIComponent(
                    `*New Booking Confirmed*\n\n` +
                    `Invoice No: ${refNumber}\n` +
                    `Txn ID: ${finalTxnId}\n` +
                    `Name: ${name}\n` +
                    `Mobile: ${mobile}\n` +
                    `Event Date: ${eventDate}\n` +
                    `Location: ${location}\n` +
                    `Package: ${pkg || 'Not selected'}\n` +
                    `Total Amount: ₹${totalAmount}\n` +
                    `Advance Paid: ₹${advanceAmount}\n` +
                    `Remaining: ₹${remainingAmount}\n` +
                    `Payment Status: Paid via Razorpay`
                );
                
                const ownerPhone = "918982069314"; 
                window.open(`https://wa.me/${ownerPhone}?text=${message}`, '_blank');

                form.reset();
            }, 300);
        } else {
            alert("Oops! There was a problem submitting your form");
        }
    } catch (error) {
        alert("Oops! There was a problem submitting your form");
    }
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    const modalContent = document.getElementById('success-modal-content');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
        lucide.createIcons();
    }, 10);
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    const modalContent = document.getElementById('success-modal-content');
    
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function downloadInvoice() {
    const invoiceContent = document.getElementById('invoice-content').innerHTML;
    const originalContent = document.body.innerHTML;

    // Create a print-friendly view
    document.body.innerHTML = `
        <div style="padding: 40px; max-width: 800px; margin: 0 auto; font-family: sans-serif;">
            ${invoiceContent}
        </div>
    `;
    
    window.print();
    
    // Restore original content
    document.body.innerHTML = originalContent;
    
    // Re-attach event listeners (since we replaced body HTML)
    // In a real app, we'd avoid replacing body. For this static site, reloading is safer to restore state
    location.reload(); 
}
