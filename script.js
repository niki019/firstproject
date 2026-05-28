// ================= COUNTRY DATA =================
const countries = [
  { name: "India", flag: "🇮🇳", code: "+91", digits: 10, placeholder: "98765 43210" },
  { name: "United States", flag: "🇺🇸", code: "+1", digits: 10, placeholder: "(555) 000-0000" },
  { name: "United Kingdom", flag: "🇬🇧", code: "+44", digits: 10, placeholder: "7911 123456" },
  { name: "Canada", flag: "🇨🇦", code: "+1", digits: 10, placeholder: "(555) 000-0000" },
  { name: "United Arab Emirates", flag: "🇦🇪", code: "+971", digits: 9, placeholder: "50 123 4567" },
  { name: "Australia", flag: "🇦🇺", code: "+61", digits: 9, placeholder: "412 345 678" },
  { name: "Singapore", flag: "🇸🇬", code: "+65", digits: 8, placeholder: "8123 4567" },
  { name: "Germany", flag: "🇩🇪", code: "+49", digits: 11, placeholder: "170 1234567" },
  { name: "Saudi Arabia", flag: "🇸🇦", code: "+966", digits: 9, placeholder: "50 123 4567" },
];

let selectedCountry = countries[0]; // Default India
let activeViewIndex = 0; // 0: Phone, 1: OTP, 2: Email, 3: Success
let timerInterval = null;

// ================= DOM ELEMENTS =================
const loginCard = document.getElementById('loginCard');
const sliderWrapper = document.getElementById('sliderWrapper');
const views = document.querySelectorAll('.slide-view');

const backBtn = document.getElementById('backBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// Phone Login View elements
const phoneInputField = document.getElementById('phoneInputField');
const currentFlag = document.getElementById('currentFlag');
const currentCode = document.getElementById('currentCode');
const countrySelectorBtn = document.getElementById('countrySelectorBtn');
const sendOtpBtn = document.getElementById('sendOtpBtn');
const phoneError = document.getElementById('phoneError');

// Country list drawer elements
const countryDropdown = document.getElementById('countryDropdown');
const countrySearchField = document.getElementById('countrySearchField');
const countryList = document.getElementById('countryList');
const closeDropdownBtn = document.getElementById('closeDropdownBtn');

// OTP View elements
const displayPhoneNumber = document.getElementById('displayPhoneNumber');
const otpDigits = document.querySelectorAll('.otp-digit');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const otpError = document.getElementById('otpError');
const resendBtn = document.getElementById('resendBtn');
const timerText = document.getElementById('timerText');

// Email Login elements
const emailLoginForm = document.getElementById('emailLoginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const emailError = document.getElementById('emailError');
const continueWithEmailBtn = document.getElementById('continueWithEmailBtn');
const backToPhoneBtn = document.getElementById('backToPhoneBtn');

// Redirect Button on Success
const finishBtn = document.getElementById('finishBtn');
const successSubtitle = document.getElementById('successSubtitle');

// Toast Notification
const toastContainer = document.getElementById('toastContainer');

// ================= APPLICATION INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  setupCountryList();
  updatePhonePlaceholder();
  setView(0); // Start at phone view
  
  // Attach Event Listeners
  countrySelectorBtn.addEventListener('click', openCountryDropdown);
  closeDropdownBtn.addEventListener('click', closeCountryDropdown);
  countrySearchField.addEventListener('input', filterCountries);
  
  phoneInputField.addEventListener('input', handlePhoneInput);
  sendOtpBtn.addEventListener('click', handleSendOTP);
  
  // OTP logic setup
  setupOtpFields();
  verifyOtpBtn.addEventListener('click', handleVerifyOTP);
  resendBtn.addEventListener('click', handleResendOTP);
  
  // Email logic setup
  continueWithEmailBtn.addEventListener('click', () => setView(2));
  backToPhoneBtn.addEventListener('click', () => setView(0));
  emailLoginForm.addEventListener('submit', handleEmailLogin);
  
  // Back button functionality
  backBtn.addEventListener('click', handleBackNavigation);
  
  // Close modal button mockup
  closeModalBtn.addEventListener('click', () => {
    showToast("Modal close clicked");
  });

  finishBtn.addEventListener('click', () => {
    showToast("Opening restaurant listing...");
    setTimeout(() => {
      // Simulate dashboard load
      location.reload();
    }, 1500);
  });
});

// ================= SLIDER & VIEW CONTROL =================
function setView(viewIndex) {
  activeViewIndex = viewIndex;
  
  // Translate views wrapper
  sliderWrapper.style.transform = `translateX(-${viewIndex * 25}%)`;
  
  // Update view classes for opacity control
  views.forEach((view, idx) => {
    if (idx === viewIndex) {
      view.classList.add('active-view');
    } else {
      view.classList.remove('active-view');
    }
  });
  
  // Manage Back Button visibility
  if (viewIndex === 1 || viewIndex === 2) {
    backBtn.classList.add('visible');
  } else {
    backBtn.classList.remove('visible');
  }
  
  // Manage Close Button visibility
  if (viewIndex === 3) {
    closeModalBtn.style.display = 'none';
  } else {
    closeModalBtn.style.display = 'flex';
  }
  
  // Adjust Card Height smoothly
  setTimeout(adjustCardHeight, 50);
}

function adjustCardHeight() {
  const activeView = views[activeViewIndex];
  // Calculate exact required height (scrollHeight now includes the slide's padding)
  const height = activeView.scrollHeight;
  loginCard.style.height = `${height}px`;
}

function handleBackNavigation() {
  if (activeViewIndex === 1) { // From OTP view, go back to Phone view
    setView(0);
    clearInterval(timerInterval);
  } else if (activeViewIndex === 2) { // From Email view, go back to Phone view
    setView(0);
  }
}

// ================= COUNTRY DROPDOWN SELECTION =================
function setupCountryList() {
  countryList.innerHTML = '';
  countries.forEach(country => {
    const li = document.createElement('li');
    li.className = 'country-item';
    li.setAttribute('data-code', country.code);
    li.setAttribute('data-name', country.name);
    
    // Highlight if selected
    if (country.code === selectedCountry.code && country.name === selectedCountry.name) {
      li.classList.add('active');
    }
    
    li.innerHTML = `
      <span class="flag">${country.flag}</span>
      <span class="name">${country.name}</span>
      <span class="dial-code">${country.code}</span>
    `;
    
    li.addEventListener('click', () => selectCountry(country));
    countryList.appendChild(li);
  });
}

function openCountryDropdown() {
  countryDropdown.classList.add('open');
  countrySearchField.value = '';
  filterCountries();
  setTimeout(() => countrySearchField.focus(), 150);
}

function closeCountryDropdown() {
  countryDropdown.classList.remove('open');
}

function selectCountry(country) {
  selectedCountry = country;
  currentFlag.textContent = country.flag;
  currentCode.textContent = country.code;
  
  // Update UI active country
  const items = countryList.querySelectorAll('.country-item');
  items.forEach(item => {
    if (item.getAttribute('data-name') === country.name) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  updatePhonePlaceholder();
  handlePhoneInput(); // Trigger validation with new parameters
  closeCountryDropdown();
  phoneInputField.focus();
}

function updatePhonePlaceholder() {
  phoneInputField.placeholder = selectedCountry.placeholder;
}

function filterCountries() {
  const query = countrySearchField.value.toLowerCase().trim();
  const items = countryList.querySelectorAll('.country-item');
  
  items.forEach(item => {
    const name = item.getAttribute('data-name').toLowerCase();
    const code = item.getAttribute('data-code').toLowerCase();
    
    if (name.includes(query) || code.includes(query)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// ================= PHONE FORM & VALIDATION =================
function handlePhoneInput() {
  // Strip everything that isn't a digit
  let val = phoneInputField.value.replace(/\D/g, '');
  
  // Format visual representation slightly (optional, but keep value clean)
  phoneInputField.value = val;
  
  // Check validation rules
  if (val.length === 0) {
    phoneError.textContent = '';
    sendOtpBtn.disabled = true;
  } else if (val.length < selectedCountry.digits) {
    phoneError.textContent = `Phone number must be ${selectedCountry.digits} digits`;
    sendOtpBtn.disabled = true;
  } else if (val.length > selectedCountry.digits) {
    // Trim excess input
    phoneInputField.value = val.substring(0, selectedCountry.digits);
    phoneError.textContent = '';
    sendOtpBtn.disabled = false;
  } else {
    phoneError.textContent = '';
    sendOtpBtn.disabled = false;
  }
  
  // Ensure the card height updates if error toggles
  adjustCardHeight();
}

function handleSendOTP() {
  const number = phoneInputField.value;
  displayPhoneNumber.textContent = `${selectedCountry.code} ${number}`;
  
  showToast("OTP sent successfully!");
  
  // Go to OTP view
  setView(1);
  
  // Focus the first OTP field
  setTimeout(() => {
    otpDigits[0].focus();
  }, 350);
  
  // Start countdown timer
  startOtpTimer();
}

// ================= OTP LOGIC & TIMER =================
function setupOtpFields() {
  otpDigits.forEach((digitInput, index) => {
    
    // Numeric keyboard trigger
    digitInput.addEventListener('keydown', (e) => {
      // Prevent non-numeric key inputs except navigation keys
      if (e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && isNaN(e.key)) {
        e.preventDefault();
      }
      
      // Auto move back on backspace
      if (e.key === 'Backspace') {
        if (digitInput.value === '') {
          // Go to previous box
          if (index > 0) {
            otpDigits[index - 1].focus();
            otpDigits[index - 1].value = '';
          }
        } else {
          digitInput.value = '';
        }
        checkOtpCompletion();
        e.preventDefault();
      }
    });

    digitInput.addEventListener('input', (e) => {
      const val = digitInput.value;
      if (val.length > 0) {
        // Move to next box
        if (index < otpDigits.length - 1) {
          otpDigits[index + 1].focus();
        }
      }
      checkOtpCompletion();
    });

    // Paste code handler
    digitInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
      
      // Match exactly digits
      if (/^\d+$/.test(pasteData)) {
        const digitsArray = pasteData.split('').slice(0, 6);
        
        digitsArray.forEach((char, idx) => {
          if (otpDigits[idx]) {
            otpDigits[idx].value = char;
          }
        });
        
        // Focus the last filled box, or the next empty box
        const focusIdx = Math.min(digitsArray.length, otpDigits.length - 1);
        otpDigits[focusIdx].focus();
        checkOtpCompletion();
      }
    });
  });
}

function checkOtpCompletion() {
  let code = '';
  otpDigits.forEach(input => {
    code += input.value;
  });
  
  if (code.length === 6) {
    verifyOtpBtn.disabled = false;
    otpError.textContent = '';
  } else {
    verifyOtpBtn.disabled = true;
  }
}

function startOtpTimer() {
  clearInterval(timerInterval);
  resendBtn.classList.add('disabled');
  let timeLeft = 30;
  timerText.textContent = `${timeLeft}s`;
  
  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = `${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      resendBtn.classList.remove('disabled');
      resendBtn.innerHTML = 'Resend OTP';
    }
  }, 1000);
}

function handleResendOTP() {
  if (resendBtn.classList.contains('disabled')) return;
  
  // Clear existing inputs
  otpDigits.forEach(input => input.value = '');
  checkOtpCompletion();
  
  showToast("A new OTP has been sent!");
  startOtpTimer();
  otpDigits[0].focus();
}

function handleVerifyOTP() {
  let code = '';
  otpDigits.forEach(input => code += input.value);
  
  // Dummy check: code must be 123456 or just simple verification simulation
  // We will accept any 6-digit code for mock purpose, but if it is all zeroes, we mock fail
  if (code === '000000') {
    otpError.textContent = 'Invalid verification code. Please try again.';
    showToast("Incorrect OTP!");
    adjustCardHeight();
  } else {
    // Success flow
    otpError.textContent = '';
    successSubtitle.textContent = `You logged in with mobile ${displayPhoneNumber.textContent}.`;
    showToast("Successfully Verified!");
    setView(3); // Success Screen
  }
}

// ================= EMAIL LOGIN LOGIC =================
function handleEmailLogin(e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!email || !password) {
    emailError.textContent = 'Please fill out all fields';
    adjustCardHeight();
    return;
  }
  
  // Basic validation pass simulation
  if (password.length < 6) {
    emailError.textContent = 'Password must be at least 6 characters';
    adjustCardHeight();
    return;
  }
  
  // Success flow
  emailError.textContent = '';
  successSubtitle.textContent = `You logged in with email: ${email}`;
  showToast("Logged in successfully!");
  setView(3); // Success Screen
}

// ================= TOAST SYSTEM =================
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideUpToast 0.3s cubic-bezier(0.175, 0.885, 0.32, 1) reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2700);
}
