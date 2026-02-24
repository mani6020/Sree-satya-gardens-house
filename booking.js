// Booking system with slot management and WhatsApp integration
class BookingSystem {
  constructor() {
    this.phoneNumber = '919440048833'; // WhatsApp number with country code
    this.bookings = this.loadBookings();
    this.initializeBookingSystem();
  }

  // Load bookings from localStorage
  loadBookings() {
    const saved = localStorage.getItem('bookings');
    return saved ? JSON.parse(saved) : [];
  }

  // Save bookings to localStorage
  saveBookings() {
    localStorage.setItem('bookings', JSON.stringify(this.bookings));
  }

  // Initialize the booking system
  initializeBookingSystem() {
    this.setupDatePickers();
    this.setupFormSubmission();
    this.renderCalendar();
    this.setupPriceCalculation();
  }

  // Setup Flatpickr date pickers
  setupDatePickers() {
    const today = new Date();
    
    // Check-in date picker
    flatpickr('#checkin', {
      minDate: today,
      dateFormat: 'Y-m-d',
      onChange: (selectedDates) => {
        this.updateAvailability();
        this.calculatePrice();
      }
    });

    // Check-out date picker
    flatpickr('#checkout', {
      minDate: today,
      dateFormat: 'Y-m-d',
      onChange: (selectedDates) => {
        this.updateAvailability();
        this.calculatePrice();
      }
    });
  }

  // Calculate number of days and total price
  calculatePrice() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const roomType = document.getElementById('roomtype').value;

    if (!checkin || !checkout || !roomType) return;

    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);

    if (checkOutDate <= checkInDate) {
      document.getElementById('summaryDays').textContent = '-';
      document.getElementById('summaryTotal').textContent = '0';
      return;
    }

    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Price per room type
    const prices = {
      'Full Villa (3 Bedrooms)': 5000,
      '1 Bedroom': 1500,
      '2 Bedrooms': 3000
    };

    const pricePerDay = prices[roomType] || 0;
    const totalPrice = days * pricePerDay;

    document.getElementById('summaryDays').textContent = days;
    document.getElementById('summaryPrice').textContent = '₹' + pricePerDay.toLocaleString();
    document.getElementById('summaryTotal').textContent = totalPrice.toLocaleString();
  }

  // Setup price calculation on room type change
  setupPriceCalculation() {
    document.getElementById('roomtype').addEventListener('change', () => {
      this.calculatePrice();
    });
  }

  // Check availability
  isAvailable(checkin, checkout, roomType) {
    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);

    return !this.bookings.some(booking => {
      const bookingCheckin = new Date(booking.checkin);
      const bookingCheckout = new Date(booking.checkout);

      // Check if there's any overlap
      const hasOverlap = checkInDate < bookingCheckout && checkOutDate > bookingCheckin;
      return hasOverlap && booking.roomtype === roomType;
    });
  }

  // Update availability status
  updateAvailability() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const roomType = document.getElementById('roomtype').value;
    const alertDiv = document.getElementById('availabilityAlert');

    if (!checkin || !checkout || !roomType) {
      alertDiv.style.display = 'none';
      return;
    }

    const available = this.isAvailable(checkin, checkout, roomType);
    alertDiv.style.display = 'block';

    if (available) {
      alertDiv.className = 'alert alert-success';
      document.getElementById('availabilityText').textContent = '✓ This room is available for your selected dates!';
    } else {
      alertDiv.className = 'alert alert-danger';
      document.getElementById('availabilityText').textContent = '✗ This room is not available for the selected dates. Please choose different dates.';
    }
  }

  // Format date for display
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Setup form submission
  setupFormSubmission() {
    document.getElementById('bookingForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        guests: document.getElementById('people').value,
        checkin: document.getElementById('checkin').value,
        checkout: document.getElementById('checkout').value,
        roomtype: document.getElementById('roomtype').value,
        purpose: document.getElementById('purpose').value,
        message: document.getElementById('message').value,
        bookingDate: new Date().toISOString()
      };

      // Check final availability
      if (!this.isAvailable(formData.checkin, formData.checkout, formData.roomtype)) {
        alert('⚠️ Sorry, this room is no longer available for the selected dates. Please choose different dates.');
        return;
      }

      // Add to bookings (tentative until confirmed)
      this.bookings.push(formData);
      this.saveBookings();

      // Send to WhatsApp
      this.sendToWhatsApp(formData);

      // Reset form
      document.getElementById('bookingForm').reset();
      this.calculatePrice();
      this.renderCalendar();

      alert('✓ Booking request sent! You will receive a confirmation message on WhatsApp shortly.');
    });
  }

  // Send booking details to WhatsApp
  sendToWhatsApp(formData) {
    const message = this.generateBookingMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  }

  // Generate booking message for WhatsApp
  generateBookingMessage(formData) {
    const days = Math.ceil(
      (new Date(formData.checkout) - new Date(formData.checkin)) / (1000 * 60 * 60 * 24)
    );

    const prices = {
      'Full Villa (3 Bedrooms)': 5000,
      '1 Bedroom': 1500,
      '2 Bedrooms': 3000
    };

    const pricePerDay = prices[formData.roomtype] || 0;
    const totalPrice = days * pricePerDay;

    return `
*🏡 SREE SATYA GARDEN HOUSE - BOOKING REQUEST* 

*Guest Details:*
👤 Name: ${formData.name}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}
👥 Guests: ${formData.guests}

*Booking Details:*
📅 Check-in: ${this.formatDate(formData.checkin)}
📅 Check-out: ${this.formatDate(formData.checkout)}
🏠 Room Type: ${formData.roomtype}
🎯 Purpose: ${formData.purpose}
📊 Number of Days: ${days}

*Pricing:*
💰 Rate per day: ₹${pricePerDay}
💰 Total Amount: ₹${totalPrice}

*Special Requests:*
${formData.message || 'None'}

*Please confirm this booking and proceed with payment.*
Thank you for choosing Sree Satya Garden House! 🌿
    `.trim();
  }

  // Render calendar with booked dates
  renderCalendar() {
    const container = document.getElementById('calendarContainer');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let html = '';

    // Display next 3 months
    for (let month = 0; month < 3; month++) {
      const date = new Date(currentYear, currentMonth + month);
      const monthName = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      
      html += `<div class="calendar-month"><h6>${monthName}</h6><div class="calendar-grid">`;

      // Get first day of month
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      // Empty cells
      for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
      }

      // Date cells
      for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(date.getFullYear(), date.getMonth(), day);
        const isToday = cellDate.toDateString() === today.toDateString();
        const isBooked = this.isDateBooked(cellDate);

        let classNames = 'calendar-day';
        if (isToday) classNames += ' today';
        if (isBooked) classNames += ' booked';

        html += `<div class="${classNames}" title="${cellDate.toDateString()}">${day}</div>`;
      }

      html += '</div></div>';
    }

    container.innerHTML = html;
  }

  // Check if date is booked
  isDateBooked(date) {
    return this.bookings.some(booking => {
      const checkin = new Date(booking.checkin);
      const checkout = new Date(booking.checkout);
      return date >= checkin && date < checkout;
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BookingSystem();

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler.offsetParent !== null) {
          navbarToggler.click();
        }
      }
    });
  });

  // Active nav link on scroll
  window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
});
