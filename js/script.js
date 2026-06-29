// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Page Loader Fade Out
  const pageLoader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (pageLoader) {
        pageLoader.classList.add('fade-out');
        setTimeout(() => {
          pageLoader.style.display = 'none';
        }, 500);
      }
    }, 400); // Small delay to guarantee smooth layout calculation
  });

  // 2. Theme Manager (Dark / Light Mode Toggle)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const body = document.body;
  const localTheme = localStorage.getItem('theme');

  // Set initial theme based on localStorage or user preferences
  if (localTheme) {
    body.setAttribute('data-theme', localTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.setAttribute('data-theme', 'dark');
  } else {
    body.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      let newTheme = 'light';
      if (currentTheme === 'light') {
        newTheme = 'dark';
      }
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // 3. Mobile Navigation Menu Drawer
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when navigation links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Sticky Header State & Scroll-to-Top Button Visibility
  const header = document.getElementById('header');
  const scrollUpBtn = document.getElementById('scrollUpBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header State
    if (header) {
      if (scrollPos > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to Top Visibility
    if (scrollUpBtn) {
      if (scrollPos > 500) {
        scrollUpBtn.classList.add('show');
      } else {
        scrollUpBtn.classList.remove('show');
      }
    }
  });

  // Scroll back to top functionality
  if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Navigation Scroll Spy & Active Indicator
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 120; // Offset for sticky headers

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // 6. Category Filtering System
  const categoryTabBtns = document.querySelectorAll('.category-tab-btn');
  const cakeCards = document.querySelectorAll('.cake-card');

  categoryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active tab button state
      categoryTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');

      // Filter grid items
      cakeCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterVal === 'all') {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else if (cardCategory === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // 7. Testimonial Reviews Slider & Google Maps Widget Logic
  const reviewsWrapper = document.getElementById('reviewsWrapper');
  const reviewsPrevBtn = document.getElementById('reviewsPrevBtn');
  const reviewsNextBtn = document.getElementById('reviewsNextBtn');
  const reviewsPagination = document.getElementById('reviewsPagination');
  const keywordTags = document.querySelectorAll('.keyword-tag');
  
  let activeKeyword = 'all';
  let currentSlideIndex = 0;
  let autoSlideInterval;

  function getVisibleSlides() {
    return Array.from(document.querySelectorAll('.review-slide')).filter(slide => {
      if (activeKeyword === 'all') return true;
      const keywords = slide.getAttribute('data-keywords') || '';
      return keywords.split(' ').includes(activeKeyword);
    });
  }

  function initSlider() {
    if (!reviewsWrapper) return;
    
    // Clear existing dots
    reviewsPagination.innerHTML = '';
    
    const visibleSlides = getVisibleSlides();
    const count = visibleSlides.length;
    
    // Toggle displays
    const allSlides = document.querySelectorAll('.review-slide');
    allSlides.forEach(slide => {
      if (visibleSlides.includes(slide)) {
        slide.style.display = 'block';
      } else {
        slide.style.display = 'none';
      }
    });

    if (count === 0) {
      reviewsPrevBtn.style.display = 'none';
      reviewsNextBtn.style.display = 'none';
      return;
    } else {
      reviewsPrevBtn.style.display = 'flex';
      reviewsNextBtn.style.display = 'flex';
    }

    // Dots
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.classList.add('reviews-page-dot');
      if (i === currentSlideIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      reviewsPagination.appendChild(dot);
    }

    updateSlider();
    resetAutoSlide();
  }

  function updateSlider() {
    const visibleSlides = getVisibleSlides();
    const count = visibleSlides.length;
    
    if (count === 0) return;
    
    if (currentSlideIndex >= count) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = count - 1;

    reviewsWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    const dots = document.querySelectorAll('.reviews-page-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });
  }

  function goToSlide(index) {
    currentSlideIndex = index;
    updateSlider();
    resetAutoSlide();
  }

  function nextSlide() {
    const count = getVisibleSlides().length;
    if (count <= 1) return;
    currentSlideIndex = (currentSlideIndex + 1) % count;
    updateSlider();
  }

  function prevSlide() {
    const count = getVisibleSlides().length;
    if (count <= 1) return;
    currentSlideIndex = (currentSlideIndex - 1 + count) % count;
    updateSlider();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (reviewsWrapper) {
    reviewsNextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    reviewsPrevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    keywordTags.forEach(tag => {
      tag.addEventListener('click', () => {
        keywordTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        activeKeyword = tag.getAttribute('data-keyword');
        currentSlideIndex = 0;
        initSlider();
      });
    });

    initSlider();
  }

  // Write a Review Modal Actions
  const btnWriteReview = document.getElementById('btnWriteReview');
  const writeReviewModal = document.getElementById('writeReviewModal');
  const writeReviewForm = document.getElementById('writeReviewForm');
  const starRatingSelector = document.getElementById('starRatingSelector');
  const ratingStars = document.querySelectorAll('#starRatingSelector .rating-star');
  const inputRatingValue = document.getElementById('inputRatingValue');

  if (btnWriteReview && writeReviewModal) {
    btnWriteReview.addEventListener('click', () => {
      writeReviewModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    window.closeReviewModal = () => {
      writeReviewModal.classList.remove('open');
      document.body.style.overflow = '';
      writeReviewForm.reset();
      ratingStars.forEach(s => s.classList.add('selected'));
      inputRatingValue.value = '5';
    };

    // Star Selection Interaction
    ratingStars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const val = parseInt(star.getAttribute('data-value'), 10);
        ratingStars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-value'), 10);
          s.classList.toggle('hover', sVal <= val);
        });
      });

      star.addEventListener('mouseout', () => {
        ratingStars.forEach(s => s.classList.remove('hover'));
      });

      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-value'), 10);
        inputRatingValue.value = val;
        ratingStars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-value'), 10);
          s.classList.toggle('selected', sVal <= val);
        });
      });
    });

    // Form Submission
    writeReviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('inputReviewName').value.trim();
      const content = document.getElementById('textareaReviewContent').value.trim();
      const rating = parseInt(inputRatingValue.value, 10);

      if (!name || !content) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Keyword tagging based on user writing
      const text = content.toLowerCase();
      let keywords = [];
      if (text.includes('hygienic') || text.includes('clean') || text.includes('hygiene')) keywords.push('hygienic');
      if (text.includes('pastries') || text.includes('pastry') || text.includes('tart') || text.includes('macaron')) keywords.push('pastries');
      if (text.includes('variety') || text.includes('options') || text.includes('selection')) keywords.push('variety');
      if (text.includes('price') || text.includes('cheap') || text.includes('moderate') || text.includes('cost')) keywords.push('price');
      if (text.includes('custom') || text.includes('design') || text.includes('birthday') || text.includes('wedding')) keywords.push('custom');
      
      const keywordsStr = keywords.join(' ');

      // Create new review slide markup
      const slide = document.createElement('div');
      slide.classList.add('review-slide');
      slide.setAttribute('data-keywords', keywordsStr);

      let starSVG = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          starSVG += `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
        } else {
          starSVG += `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21L16.54 14l5.46-4.73-7.19-.61L12 2z" opacity=".3"/></svg>`;
        }
      }

      slide.innerHTML = `
        <div class="review-card">
          <span class="review-quote-icon">“</span>
          <p class="review-content">${content}</p>
          <div class="review-author">
            <div class="review-author-name">${name}</div>
            <div class="review-rating" aria-label="${rating} out of 5 stars">
              ${starSVG}
            </div>
          </div>
        </div>
      `;

      // Prepend review
      if (reviewsWrapper.firstChild) {
        reviewsWrapper.insertBefore(slide, reviewsWrapper.firstChild);
      } else {
        reviewsWrapper.appendChild(slide);
      }

      // Update total review count
      const reviewCountEl = document.getElementById('summaryReviewCount');
      if (reviewCountEl) {
        const countText = reviewCountEl.textContent;
        const currentCount = parseInt(countText.replace(/,/g, ''), 10);
        if (!isNaN(currentCount)) {
          reviewCountEl.textContent = (currentCount + 1).toLocaleString() + ' reviews';
        }
      }

      closeReviewModal();
      showToast('Thank you! Your Google review has been posted successfully.');

      // Re-init slider and focus first slide
      activeKeyword = 'all';
      keywordTags.forEach(t => t.classList.toggle('active', t.getAttribute('data-keyword') === 'all'));
      currentSlideIndex = 0;
      initSlider();
    });
  }

  // Google Maps Listing Panel Interactions
  const mapsHoursItem = document.getElementById('mapsHoursItem');
  const btnSaveListing = document.getElementById('btnSaveListing');
  const btnShareListing = document.getElementById('btnShareListing');
  const btnSuggestEdit = document.getElementById('btnSuggestEdit');

  if (mapsHoursItem) {
    mapsHoursItem.addEventListener('click', (e) => {
      // Toggle dropdown active class
      mapsHoursItem.classList.toggle('active');
      const chevron = mapsHoursItem.querySelector('.chevron-hours');
      if (chevron) {
        chevron.textContent = mapsHoursItem.classList.contains('active') ? '▲' : '▼';
      }
    });
  }

  if (btnSaveListing) {
    btnSaveListing.addEventListener('click', () => {
      const isSaved = btnSaveListing.classList.toggle('saved');
      const bookmarkIcon = document.getElementById('bookmarkIcon');
      const txtSaveBtn = document.getElementById('txtSaveBtn');

      if (isSaved) {
        bookmarkIcon.innerHTML = `<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>`;
        btnSaveListing.style.color = 'var(--color-accent)';
        txtSaveBtn.textContent = 'Saved';
        showToast('Saved to your Google Maps list!');
      } else {
        bookmarkIcon.innerHTML = `<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>`;
        btnSaveListing.style.color = '';
        txtSaveBtn.textContent = 'Save';
        showToast('Removed from your list.');
      }
    });
  }

  if (btnShareListing) {
    btnShareListing.addEventListener('click', () => {
      const dummyText = 'La Céleste Bakery, 742 Madison Ave, New York, NY 10021';
      navigator.clipboard.writeText(dummyText).then(() => {
        showToast('Atelier location address copied to clipboard!');
      }).catch(() => {
        showToast('Atelier: 742 Madison Ave, New York, NY 10021');
      });
    });
  }

  if (btnSuggestEdit) {
    btnSuggestEdit.addEventListener('click', () => {
      showToast('Thank you! Your suggestions have been sent to the editor.');
    });
  }

  window.scrollToMap = () => {
    const inlineMap = document.getElementById('inlineMapContainer');
    if (inlineMap) {
      inlineMap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  window.showDeliveryBounds = () => {
    showToast('La Céleste hand-delivers daily to Manhattan, Brooklyn, & Queens.');
  };

  // 8. FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question-btn');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all accordion panels first to ensure exclusive expansion (accordion effect)
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 9. Intersection Observer Scroll Reveal & Counter Count-up Hooks
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1800; // 1.8 seconds transition
    let startTime = null;

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const rate = Math.min(progress / duration, 1);
      // Ease out quad formula for premium feel
      const easeRate = rate * (2 - rate);
      
      counter.textContent = Math.floor(easeRate * target);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = target;
      }
    };
    window.requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // Trigger counter animations inside this revealed block if present
          const counters = entry.target.querySelectorAll('.counter-num');
          counters.forEach(counter => animateCounter(counter));

          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: instantly reveal and populate targets
    revealElements.forEach(el => el.classList.add('active'));
    document.querySelectorAll('.counter-num').forEach(c => {
      c.textContent = c.getAttribute('data-target');
    });
  }

  // 10. Contact Form Submissions Simulator
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('inputName');
      const emailInput = document.getElementById('inputEmail');
      const msgInput = document.getElementById('inputMessage');
      const subjectVal = document.getElementById('inputSubject').value;

      // Basic HTML validation checks
      if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
        alert('Please fill in all required fields.');
        return;
      }

      if (!validateEmail(emailInput.value)) {
        alert('Please provide a valid email address.');
        return;
      }

      // Simulate API Submission Success Screen
      const originalBtnText = contactForm.querySelector('button[type="submit"]').textContent;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        submitBtn.style.backgroundColor = 'var(--color-success)';
        submitBtn.textContent = 'Message Sent Successfully!';

        // Create a premium overlay alert card
        const alertCard = document.createElement('div');
        alertCard.style.cssText = `
          position: fixed;
          top: 30px;
          right: 30px;
          background: var(--bg-card);
          color: var(--text-primary);
          padding: 20px 30px;
          border-left: 5px solid var(--color-success);
          border-radius: var(--border-radius-sm);
          box-shadow: var(--shadow-lg);
          z-index: 9999;
          font-family: var(--font-body);
          display: flex;
          flex-direction: column;
          gap: 6px;
          transform: translateY(-20px);
          opacity: 0;
          transition: var(--transition-smooth);
        `;
        alertCard.innerHTML = `
          <strong style="color:var(--color-success); font-size:1.1rem; font-family:var(--font-display);">Inquiry Submitted!</strong>
          <span>Thank you, <strong>${nameInput.value}</strong>. We will get back to you at <strong>${emailInput.value}</strong> within 12 hours regarding your "${subjectVal}" inquiry.</span>
        `;
        document.body.appendChild(alertCard);
        
        // Trigger animation show
        setTimeout(() => {
          alertCard.style.transform = 'translateY(0)';
          alertCard.style.opacity = '1';
        }, 100);

        // Hide alert card after 5 seconds
        setTimeout(() => {
          alertCard.style.transform = 'translateY(-20px)';
          alertCard.style.opacity = '0';
          setTimeout(() => alertCard.remove(), 400);
        }, 5000);

        // Reset form controls
        contactForm.reset();
        submitBtn.disabled = false;
        
        // Revert submit button back to normal style
        setTimeout(() => {
          submitBtn.style.backgroundColor = '';
          submitBtn.textContent = originalBtnText;
        }, 3000);

      }, 1200);

    });
  }

  // Email helper validator
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

});

// ==========================================
// 11. WhatsApp Order Modal & Builder Logic
// ==========================================
const orderModal = document.getElementById('orderModal');
const modalCakeImg = document.getElementById('modalCakeImg');
const modalCakeName = document.getElementById('modalCakeName');
const modalCakePrice = document.getElementById('modalCakePrice');
const orderCustomizerForm = document.getElementById('orderCustomizerForm');

// Public globally accessible functions to bind with click triggers in HTML
window.openOrderModal = function(cakeName, startingPrice, imgSrc) {
  if (!orderModal) return;

  // Set selected item summaries
  modalCakeName.textContent = cakeName;
  modalCakePrice.textContent = startingPrice;
  modalCakeImg.src = imgSrc;
  modalCakeImg.alt = cakeName;

  // Set logical default date (Minimum = Today + 2 days, for order scheduling rules)
  const deliveryDateInput = document.getElementById('inputDeliveryDate');
  if (deliveryDateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 2); // Set default to 2 days out
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    deliveryDateInput.value = `${yyyy}-${mm}-${dd}`;
    deliveryDateInput.min = `${yyyy}-${mm}-${dd}`; // Restrict picking past dates
  }

  // Open modal screen
  orderModal.classList.add('open');
  document.body.style.overflow = 'hidden'; // Lock background scroll
};

window.closeOrderModal = function() {
  if (!orderModal) return;
  orderModal.classList.remove('open');
  document.body.style.overflow = ''; // Unlock scroll
  if (orderCustomizerForm) {
    orderCustomizerForm.reset();
  }
};

// Modal close by background click
if (orderModal) {
  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      window.closeOrderModal();
    }
  });
}

// Modal Form Submit -> Open Whatsapp with formatted parameters
if (orderCustomizerForm) {
  orderCustomizerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cakeName = modalCakeName.textContent;
    const selectedSize = document.getElementById('selectSize').value;
    const egglessOption = document.getElementById('selectEggless').value;
    const cakeMessage = document.getElementById('inputCakeText').value.trim() || 'None';
    const deliveryDate = document.getElementById('inputDeliveryDate').value;
    const clientName = document.getElementById('inputClientName').value.trim();
    const deliveryAddress = document.getElementById('inputAddress').value.trim();
    const specialNotes = document.getElementById('inputSpecialNotes').value.trim() || 'None';

    // Simple validation check
    if (!clientName || !deliveryDate || !deliveryAddress) {
      showToast('Please fill in your Name, Delivery Date, and Delivery Address.');
      return;
    }

    // Save order details to local storage history
    const loggedInEmail = localStorage.getItem('laceleste_logged_in') || 'guest';
    const orderData = {
      email: loggedInEmail,
      cakeName: cakeName,
      size: selectedSize,
      eggless: egglessOption,
      message: cakeMessage,
      date: deliveryDate,
      address: deliveryAddress,
      notes: specialNotes,
      timestamp: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    const existingOrders = JSON.parse(localStorage.getItem('laceleste_orders') || '[]');
    existingOrders.unshift(orderData); // Add new order to start
    localStorage.setItem('laceleste_orders', JSON.stringify(existingOrders));

    // Pre-filled WhatsApp direct link formatting
    const whatsappBase = 'https://wa.me/15550199';
    
    // Formatting the direct-order details
    const textMsg = `Hello *La Céleste Patisserie*,

I would like to place an order for the following delicacy:
🍰 *Cake Name:* ${cakeName}
⚖️ *Size:* ${selectedSize}
🥚 *Base Option:* ${egglessOption}
✍️ *Message on Cake:* "${cakeMessage}"
📅 *Preferred Delivery:* ${deliveryDate}
📍 *Delivery Address:* ${deliveryAddress}
👤 *Client Name:* ${clientName}
📝 *Special Notes/Flavor Changes:* ${specialNotes}

Please send over the secure payment invoice link. Thank you!`;

    const encodedText = encodeURIComponent(textMsg);
    const finalWhatsAppUrl = `${whatsappBase}?text=${encodedText}`;

    // Open WhatsApp in a new tab
    window.open(finalWhatsAppUrl, '_blank');

    // Close Order modal and reset form
    window.closeOrderModal();
    showToast('Order customized successfully! Redirecting to WhatsApp...');
  });
}

// ==========================================
// 12. User Authentication System Logic
// ==========================================

const btnHeaderLogin = document.getElementById('btnHeaderLogin');
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const userProfileMenu = document.getElementById('userProfileMenu');
const profileAvatarBtn = document.getElementById('profileAvatarBtn');
const profileDropdown = document.getElementById('profileDropdown');
const btnLogout = document.getElementById('btnLogout');

const profileModal = document.getElementById('profileModal');
const orderHistoryModal = document.getElementById('orderHistoryModal');

// Check Initial Authentication Session State
function checkAuthState() {
  const loggedInEmail = localStorage.getItem('laceleste_logged_in');
  const loggedInName = localStorage.getItem('laceleste_user_name');

  if (loggedInEmail && loggedInName) {
    // Show Profile Menu, Hide Login Button
    if (btnHeaderLogin) btnHeaderLogin.style.display = 'none';
    if (userProfileMenu) userProfileMenu.style.display = 'block';

    // Set Avatar Initial Character
    const avatarInitial = document.getElementById('avatarInitial');
    if (avatarInitial) avatarInitial.textContent = loggedInName.charAt(0).toUpperCase();

    // Set dropdown info
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    if (dropdownUserName) dropdownUserName.textContent = loggedInName;
    if (dropdownUserEmail) dropdownUserEmail.textContent = loggedInEmail;
  } else {
    // Show Login Button, Hide Profile Menu
    if (btnHeaderLogin) btnHeaderLogin.style.display = 'block';
    if (userProfileMenu) userProfileMenu.style.display = 'none';
  }
}

// Open / Close Auth modal
if (btnHeaderLogin) {
  btnHeaderLogin.addEventListener('click', () => {
    if (authModal) {
      authModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      switchAuthTab('login');
    }
  });
}

window.closeAuthModal = function() {
  if (authModal) {
    authModal.classList.remove('open');
    document.body.style.overflow = '';
    loginForm.reset();
    signUpForm.reset();
  }
};

// Switch Tabs Login / Sign Up
window.switchAuthTab = function(tab) {
  const tabBtnLogin = document.getElementById('tabBtnLogin');
  const tabBtnSignUp = document.getElementById('tabBtnSignUp');

  if (tab === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (signUpForm) signUpForm.style.display = 'none';
    if (tabBtnLogin) tabBtnLogin.classList.add('active');
    if (tabBtnSignUp) tabBtnSignUp.classList.remove('active');
  } else {
    if (loginForm) loginForm.style.display = 'none';
    if (signUpForm) signUpForm.style.display = 'block';
    if (tabBtnLogin) tabBtnLogin.classList.remove('active');
    if (tabBtnSignUp) tabBtnSignUp.classList.add('active');
  }
};

// Toggle dropdown profile menu click handler
if (profileAvatarBtn) {
  profileAvatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (profileDropdown) profileDropdown.classList.toggle('open');
  });
}

// Close Dropdown when clicking outside
window.addEventListener('click', () => {
  if (profileDropdown) profileDropdown.classList.remove('open');
});

// Auth modal overlay click wrapper
if (authModal) {
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      window.closeAuthModal();
    }
  });
}

// SignUp submit handler
if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signUpName').value.trim();
    const email = document.getElementById('signUpEmail').value.trim().toLowerCase();
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;

    // Standard Validation Checks
    if (!name || !email || !password || !confirmPassword) {
      showToast('All fields are required.');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.');
      return;
    }

    // Check if account already exists
    const userKey = 'laceleste_user_' + email;
    if (localStorage.getItem(userKey)) {
      showToast('An account with this email already exists.');
      return;
    }

    // Store user account locally
    const userData = { name: name, password: password };
    localStorage.setItem(userKey, JSON.stringify(userData));

    // Sign in the user immediately
    localStorage.setItem('laceleste_logged_in', email);
    localStorage.setItem('laceleste_user_name', name);

    showToast(`Account created successfully! Welcome ${name}.`);
    window.closeAuthModal();
    checkAuthState();
  });
}

// Login submit handler
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showToast('Please enter both email and password.');
      return;
    }

    const userKey = 'laceleste_user_' + email;
    const savedUserRaw = localStorage.getItem(userKey);

    if (!savedUserRaw) {
      showToast('Invalid email or password.');
      return;
    }

    const savedUser = JSON.parse(savedUserRaw);
    if (savedUser.password !== password) {
      showToast('Invalid email or password.');
      return;
    }

    // Set Session State
    localStorage.setItem('laceleste_logged_in', email);
    localStorage.setItem('laceleste_user_name', savedUser.name);

    showToast(`Logged in successfully. Welcome back, ${savedUser.name}!`);
    window.closeAuthModal();
    checkAuthState();
  });
}

// Logout click listener
if (btnLogout) {
  btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('laceleste_logged_in');
    localStorage.removeItem('laceleste_user_name');
    showToast('Logged out successfully.');
    checkAuthState();
    if (profileDropdown) profileDropdown.classList.remove('open');
  });
}

// Forgot Password mock handler
window.handleForgotPassword = function(e) {
  e.preventDefault();
  const email = prompt('Enter your registered email address:');
  if (!email) return;

  const userKey = 'laceleste_user_' + email.trim().toLowerCase();
  if (localStorage.getItem(userKey)) {
    alert('A password reset link has been simulated and sent to your email address!');
  } else {
    alert('No account was found with that email address.');
  }
};

// Profile Modals
window.openProfileModal = function() {
  if (profileDropdown) profileDropdown.classList.remove('open');
  const loggedInEmail = localStorage.getItem('laceleste_logged_in');
  const loggedInName = localStorage.getItem('laceleste_user_name');

  if (!loggedInEmail) return;

  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileAvatarLarge = document.getElementById('profileAvatarLarge');

  if (profileName) profileName.textContent = loggedInName;
  if (profileEmail) profileEmail.textContent = loggedInEmail;
  if (profileAvatarLarge) profileAvatarLarge.textContent = loggedInName.charAt(0).toUpperCase();

  if (profileModal) {
    profileModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeProfileModal = function() {
  if (profileModal) {
    profileModal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// Order History Modals
window.openOrderHistoryModal = function() {
  if (profileDropdown) profileDropdown.classList.remove('open');
  const loggedInEmail = localStorage.getItem('laceleste_logged_in') || 'guest';

  const orderHistoryList = document.getElementById('orderHistoryList');
  if (!orderHistoryList) return;

  const allOrders = JSON.parse(localStorage.getItem('laceleste_orders') || '[]');
  const userOrders = allOrders.filter(o => o.email === loggedInEmail);

  if (userOrders.length > 0) {
    orderHistoryList.innerHTML = userOrders.map(order => `
      <div class="order-history-card">
        <div class="order-history-header">
          <span class="order-cake-title">${order.cakeName}</span>
          <span class="order-date-badge">${order.date}</span>
        </div>
        <div class="order-detail-row">
          <span class="order-detail-label">Size:</span>
          <span class="order-detail-value">${order.size}</span>
        </div>
        <div class="order-detail-row">
          <span class="order-detail-label">Base:</span>
          <span class="order-detail-value">${order.eggless}</span>
        </div>
        <div class="order-detail-row">
          <span class="order-detail-label">Message:</span>
          <span class="order-detail-value">"${order.message}"</span>
        </div>
        <div class="order-detail-row">
          <span class="order-detail-label">Address:</span>
          <span class="order-detail-value">${order.address}</span>
        </div>
        ${order.notes && order.notes !== 'None' ? `
        <div class="order-detail-row">
          <span class="order-detail-label">Notes:</span>
          <span class="order-detail-value">${order.notes}</span>
        </div>` : ''}
      </div>
    `).join('');
  } else {
    orderHistoryList.innerHTML = `
      <div class="no-orders-message" style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <svg style="width: 50px; height: 50px; fill: currentColor; margin-bottom: 15px; opacity: 0.5;" viewBox="0 0 24 24"><path d="M11 9H13V11H11V9M11 5H13V7H11V5M11 13H13V17H11V13M12 2C6.47 2 2 6.47 2 12S6.47 22 12 22 22 17.53 22 12 17.53 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z"/></svg>
        <p style="font-size: 1rem; font-weight: 600;">No orders placed yet.</p>
        <p style="font-size: 0.85rem; margin-top: 5px;">Customize a cake card and place a WhatsApp order to start your history!</p>
      </div>
    `;
  }

  if (orderHistoryModal) {
    orderHistoryModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeOrderHistoryModal = function() {
  if (orderHistoryModal) {
    orderHistoryModal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// Profile modal background click wrapper
if (profileModal) {
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) window.closeProfileModal();
  });
}

// History modal background click wrapper
if (orderHistoryModal) {
  orderHistoryModal.addEventListener('click', (e) => {
    if (e.target === orderHistoryModal) window.closeOrderHistoryModal();
  });
}

// Run auth check on DOM Load
checkAuthState();
}
