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
        document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
    }
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
function handleInquirySubmit(e) {
    e.preventDefault();
    const name = document.getElementById('inquiry-name').value;
    const mobile = document.getElementById('inquiry-mobile').value;
    const message = document.getElementById('inquiry-message').value;

    const text = encodeURIComponent(
        `*New Inquiry*\n\n` +
        `Name: ${name}\n` +
        `Mobile: ${mobile}\n` +
        `Message: ${message}\n\n` +
        `Please provide more details.`
    );

    const phoneNumber = "919876543210"; 
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    
    // Show success message (simple alert for static version)
    alert('Inquiry Sent! We will contact you shortly.');
    e.target.reset();
}

// Booking Form Handler
function handleBookingSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('booking-name').value;
    const mobile = document.getElementById('booking-mobile').value;
    const date = document.getElementById('booking-date').value;
    const location = document.getElementById('booking-location').value;
    const pkg = document.getElementById('booking-package').value;
    const amount = document.getElementById('booking-amount').value;

    // Simple Validation
    if(mobile.length !== 10) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    const message = encodeURIComponent(
        `*New Booking Request*\n\n` +
        `Name: ${name}\n` +
        `Mobile: ${mobile}\n` +
        `Date: ${date}\n` +
        `Location: ${location}\n` +
        `Package: ${pkg || 'Not selected'}\n` +
        `Advance Amount: ₹${amount}\n\n` +
        `Please confirm availability.`
    );
    
    const phoneNumber = "919876543210";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    
     // Show success message
     alert('Booking Request Sent! We will confirm availability shortly.');
     e.target.reset();
}
