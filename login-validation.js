// Handle booking form validation with red borders
const bookingForm = document.getElementById('bookingForm');
const requiredFields = ['name', 'email', 'phone', 'people', 'checkin', 'checkout', 'roomtype', 'purpose', 'terms'];

function validateBookingForm() {
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      if (!field.value) {
        field.classList.add('is-invalid');
      } else {
        field.classList.remove('is-invalid');
      }
    }
  });
}

// Validate on input change
requiredFields.forEach(fieldId => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener('change', () => {
      if (field.value) {
        field.classList.remove('is-invalid');
      } else {
        field.classList.add('is-invalid');
      }
    });
    
    field.addEventListener('blur', () => {
      if (!field.value) {
        field.classList.add('is-invalid');
      }
    });
  }
});

// Validate on form submit
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    validateBookingForm();
    let isValid = true;
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && !field.value) {
        isValid = false;
      }
    });
    if (!isValid) {
      e.preventDefault();
      alert('Please fill all required fields!');
    }
  });
}

// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
      alert(`Login successful for ${email}`);
      // You can add actual authentication here
      loginForm.reset();
      const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      if (loginModal) loginModal.hide();
    }
  });
}

// Handle signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (name && email && password) {
      alert(`Sign up successful for ${name}`);
      // You can add actual registration here
      signupForm.reset();
      const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
      if (signupModal) signupModal.hide();
    }
  });
}
