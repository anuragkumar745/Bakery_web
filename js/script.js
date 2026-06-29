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

  // 7. Testimonial Reviews Slider Logic
  const reviewsWrapper = document.getElementById('reviewsWrapper');
  const reviewSlides = document.querySelectorAll('.review-slide');
  const reviewsPrevBtn = document.getElementById('reviewsPrevBtn');
  const reviewsNextBtn = document.getElementById('reviewsNextBtn');
  const reviewsPagination = document.getElementById('reviewsPagination');
  
  let currentSlideIndex = 0;
  const slideCount = reviewSlides.length;
  let autoSlideInterval;

  if (reviewsWrapper && slideCount > 0) {
    // Generate Pagination Dots
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('reviews-page-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      reviewsPagination.appendChild(dot);
    }

    const dots = document.querySelectorAll('.reviews-page-dot');

    const updateSlider = () => {
      reviewsWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
      });
    };

    const goToSlide = (index) => {
      currentSlideIndex = index;
      updateSlider();
      resetAutoSlide();
    };

    const nextSlide = () => {
      currentSlideIndex = (currentSlideIndex + 1) % slideCount;
      updateSlider();
    };

    const prevSlide = () => {
      currentSlideIndex = (currentSlideIndex - 1 + slideCount) % slideCount;
      updateSlider();
    };

    reviewsNextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    reviewsPrevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    // Auto sliding interval setup
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 6000); // Switch every 6 seconds
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    startAutoSlide();
  }

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
      alert('Please fill in your Name, Delivery Date, and Delivery Address.');
      return;
    }

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
  });
}
