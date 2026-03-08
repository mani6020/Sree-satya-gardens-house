// Booking System JavaScript

// Initialize date pickers
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

if (checkinInput && checkoutInput) {
  // Check-in date picker
  flatpickr(checkinInput, {
    minDate: new Date(),
    dateFormat: 'Y-m-d',
    onChange: function(selectedDates) {
      if (selectedDates.length > 0) {
        checkinInput.classList.remove('is-invalid');
        // Set minimum checkout date to one day after check-in
        const minCheckoutDate = new Date(selectedDates[0]);
        minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
        flatpickr(checkoutInput, {
          minDate: minCheckoutDate,
          dateFormat: 'Y-m-d',
        });
        updateBookingSummary();
      }
    }
  });

  // Check-out date picker
  flatpickr(checkoutInput, {
    minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    dateFormat: 'Y-m-d',
    onChange: function(selectedDates) {
      if (selectedDates.length > 0) {
        checkoutInput.classList.remove('is-invalid');
        updateBookingSummary();
      }
    }
  });
}

// Form validation with red borders
const bookingForm = document.getElementById('bookingForm');
const requiredFields = ['name', 'email', 'phone', 'people', 'checkin', 'checkout', 'roomtype', 'purpose', 'terms'];

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    if (!field.value || (field.type === 'checkbox' && !field.checked)) {
      field.classList.add('is-invalid');
      return false;
    } else {
      field.classList.remove('is-invalid');
      return true;
    }
  }
  return true;
}

function validateBookingForm() {
  let isValid = true;
  requiredFields.forEach(fieldId => {
    if (!validateField(fieldId)) {
      isValid = false;
    }
  });
  return isValid;
}

// Real-time validation on input change
requiredFields.forEach(fieldId => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener('change', () => {
      validateField(fieldId);
      updateBookingSummary();
    });

    field.addEventListener('blur', () => {
      validateField(fieldId);
    });

    if (field.type !== 'checkbox') {
      field.addEventListener('input', () => {
        if (field.value) {
          field.classList.remove('is-invalid');
        }
        updateBookingSummary();
      });
    }
  }
});

// Update booking summary
function updateBookingSummary() {
  const name = document.getElementById('name').value || '-';
  const guests = document.getElementById('people').value || '-';
  const checkin = document.getElementById('checkin').value || '-';
  const checkout = document.getElementById('checkout').value || '-';
  const roomtype = document.getElementById('roomtype').value || '-';
  const purpose = document.getElementById('purpose').value || '-';

  document.getElementById('summarytype').textContent = name;
  document.getElementById('summaryguest').textContent = guests;
  document.getElementById('summarydate').textContent = checkin;
  
  // For checkout date display
  const checkoutSpan = document.querySelectorAll('[id="summarydate"]')[1];
  if (checkoutSpan) {
    checkoutSpan.textContent = checkout;
  }
  
  document.getElementById('summaryroomtype').textContent = roomtype;
  document.getElementById('summarystay').textContent = purpose;
}

// Form submission
if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    if (!validateBookingForm()) {
      alert('❌ Please fill all required fields (marked with *)');
      return;
    }

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      guests: document.getElementById('people').value,
      checkin: document.getElementById('checkin').value,
      checkout: document.getElementById('checkout').value,
      roomtype: document.getElementById('roomtype').value,
      purpose: document.getElementById('purpose').value,
      message: document.getElementById('message').value
    };

    // Validate phone number format (10 digits for Indian numbers)
    if (!/^\d{10}$/.test(formData.phone)) {
      alert('❌ Please enter a valid 10-digit phone number');
      document.getElementById('phone').classList.add('is-invalid');
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('❌ Please enter a valid email address');
      document.getElementById('email').classList.add('is-invalid');
      return;
    }

    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(
      `*Booking Request - Sree Satya Garden House*\n\n` +
      `*Guest Details:*\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Number of Guests: ${formData.guests}\n\n` +
      `*Booking Details:*\n` +
      `Check-in: ${formData.checkin}\n` +
      `Check-out: ${formData.checkout}\n` +
      `Room Type: ${formData.roomtype}\n` +
      `Purpose: ${formData.purpose}\n\n` +
      `*Special Requests:*\n` +
      `${formData.message || 'None'}\n\n` +
      `Sent from Sree Satya Garden House Website`
    );

    // Send via WhatsApp
    const whatsappNumber = '919440048833'; // Indian format
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    
    window.open(whatsappURL, '_blank');

    // Show success message
    alert('✅ Booking request sent! Our team will contact you shortly.');

    // Reset form
    bookingForm.reset();
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.classList.remove('is-invalid');
      }
    });

    // Reset summary
    document.getElementById('summarytype').textContent = '-';
    document.getElementById('summaryguest').textContent = '-';
    document.getElementById('summarydate').textContent = '-';
    document.getElementById('summaryroomtype').textContent = '-';
    document.getElementById('summarystay').textContent = '-';
  });
}

// Booking Calendar
function generateCalendar() {
  const container = document.getElementById('calendarContainer');
  if (!container) return;

  container.innerHTML = '';
  const today = new Date();
  const months = 3; // Show 3 months

  for (let i = 0; i < months; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const monthDiv = document.createElement('div');
    monthDiv.className = 'calendar-month';
    monthDiv.innerHTML = `<h6>${monthName}</h6>`;

    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';

    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.style.fontWeight = 'bold';
      dayHeader.style.textAlign = 'center';
      dayHeader.style.fontSize = '0.85rem';
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });

    // Get first day of month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    // Empty cells before first day
    for (let j = 0; j < firstDay; j++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDay);
    }

    // Days of month
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = document.createElement('div');
      const cellDate = new Date(date.getFullYear(), date.getMonth(), day);
      const isToday = cellDate.toDateString() === today.toDateString();
      const isPast = cellDate < today;

      dayDiv.className = 'calendar-day';
      dayDiv.textContent = day;

      if (isToday) {
        dayDiv.classList.add('today');
      } else if (isPast) {
        dayDiv.classList.add('empty');
        dayDiv.style.opacity = '0.5';
      } else {
        // Random booking simulation (in real app, fetch from server)
        const isBooked = Math.random() < 0.2;
        if (isBooked) {
          dayDiv.classList.add('booked');
        }
      }

      calendarGrid.appendChild(dayDiv);
    }

    monthDiv.appendChild(calendarGrid);
    container.appendChild(monthDiv);
  }
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', function() {
  generateCalendar();
  updateBookingSummary();
});

// Phone number input restriction (10 digits only)
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
  });
}

// Guests input restriction (1-20 only)
const guestsInput = document.getElementById('people');
if (guestsInput) {
  guestsInput.addEventListener('input', function(e) {
    if (this.value > 20) this.value = 20;
    if (this.value < 1) this.value = 1;
  });
}
