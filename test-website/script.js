// Mobile menu toggle functionality
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
function toggleMenu() {
  navMenu.classList.toggle('active');
  mobileMenu.setAttribute('aria-expanded', navMenu.classList.contains('active'));
  
  // Animate hamburger icon with smooth transitions
  const bars = mobileMenu.querySelectorAll('.bar');
  bars.forEach((bar, index) => {
    if (navMenu.classList.contains('active')) {
      if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
      if (index === 1) bar.style.opacity = '0';
      if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      bar.style.transform = 'none';
      bar.style.opacity = '1';
    }
  });
}

// Close mobile menu when clicking on a link
function closeMenu() {
  navMenu.classList.remove('active');
  mobileMenu.setAttribute('aria-expanded', 'false');
  
  // Reset hamburger icon
  const bars = mobileMenu.querySelectorAll('.bar');
  bars.forEach((bar, index) => {
    bar.style.transform = 'none';
    bar.style.opacity = '1';
  });
}

// Event listeners
mobileMenu.addEventListener('click', toggleMenu);
navLinks.forEach(link => link.addEventListener('click', closeMenu));

// Close mobile menu when clicking outside with improved detection
document.addEventListener('click', (event) => {
  if (!mobileMenu.contains(event.target) && !navMenu.contains(event.target) && !event.target.closest('.mobile-nav')) {
    closeMenu();
  }
});

// Keyboard navigation support
mobileMenu.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleMenu();
  }
});

navLinks.forEach(link => {
  link.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      link.click();
    }
  });
});

// Smooth scroll for navigation links with better error handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Quote button functionality with enhanced UX
const quoteBtn = document.getElementById('quote-btn');
const quoteText = document.getElementById('quote-text');

const quotes = [
  "The black holes of nature are the most perfect macroscopic objects there are in the universe: the only elements in their construction are our concepts of space and time.",
  "Black holes are where God divided by zero.",
  "A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it.",
  "The event horizon is the point of no return; once crossed, the black hole's gravity is too strong to escape.",
  "Black holes are the most efficient engines in the universe, converting mass into energy with near-perfect efficiency."
];

let currentQuoteIndex = 0;

function showRandomQuote() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * quotes.length);
  } while (newIndex === currentQuoteIndex);
  
  currentQuoteIndex = newIndex;
  quoteText.textContent = quotes[currentQuoteIndex];
  quoteText.style.opacity = '0';
  
  setTimeout(() => {
    quoteText.style.transition = 'opacity 0.5s';
    quoteText.style.opacity = '1';
  }, 100);
}

quoteBtn.addEventListener('click', showRandomQuote);

// Keyboard support for quote button
quoteBtn.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    showRandomQuote();
  }
});

// Initial quote with loading state
showRandomQuote();

// Slide navigation
const slideContainer = document.querySelector('.slide-container');
const prevSlide = document.getElementById('prev-slide');
const nextSlide = document.getElementById('next-slide');
const currentSlide = document.getElementById('current-slide');
const totalSlides = document.getElementById('total-slides');
const slideContent = document.getElementById('slide-content');

const slides = [
  {
    title: 'Formation of Black Holes',
    content: 'Black holes are formed through the gravitational collapse of massive stars. When a star with a mass greater than about 20 times that of our Sun exhausts its nuclear fuel, it can no longer support itself against its own gravity and collapses under its own weight.',
    image: '🌀'
  },
  {
    title: 'Types of Black Holes',
    content: 'There are several types of black holes, each with unique characteristics and formation processes. Understanding these types helps us comprehend the diversity of these cosmic phenomena.',
    image: '⚫'
  },
  {
    title: 'Effects of Black Holes',
    content: 'Black holes have profound effects on their surroundings and the universe at large. Their immense gravitational pull influences the behavior of nearby matter and light.',
    image: '💫'
  }
];

let currentSlideIndex = 0;
totalSlides.textContent = slides.length;

function showSlide(index) {
  const slide = slides[index];
  slideContent.innerHTML = `
    <div class="slide">
      <h3>${slide.title}</h3>
      <p>${slide.content}</p>
      <div class="slide-image">${slide.image}</div>
    </div>
  `;
  currentSlide.textContent = index + 1;
}

prevSlide.addEventListener('click', function() {
  currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
  showSlide(currentSlideIndex);
});

nextSlide.addEventListener('click', function() {
  currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  showSlide(currentSlideIndex);
});

showSlide(currentSlideIndex);

// Added functionality for the new buttons in test-website/index.html
// Book Activities button functionality
document.querySelector('[data-action="research"]').addEventListener('click', function() {
  // Handle access research papers action
  console.log('Research Papers button clicked');
  // Add your custom functionality here
  // Example: Show a modal or redirect to research page
  alert('Accessing research papers...');
});

// Simulations button functionality
document.querySelector('[data-action="simulations"]').addEventListener('click', function() {
  // Handle view simulations action
  console.log('Simulations button clicked');
  // Add your custom functionality here
  // Example: Show simulations or redirect to simulations page
  alert('Viewing simulations...');
});

// Webinars button functionality
document.querySelector('[data-action="webinars"]').addEventListener('click', function() {
  // Handle join webinars action
  console.log('Webinars button clicked');
  // Add your custom functionality here
  // Example: Show webinar schedule or redirect to webinars page
  alert('Joining webinars...');
});

// Send Message button functionality
document.querySelector('[data-action="message"]').addEventListener('click', function() {
  // Handle send message action
  console.log('Send Message button clicked');
  // Add your custom functionality here
  // Example: Show contact form or redirect to contact page
  alert('Sending message...');
});

// Discussion Forum button functionality
document.querySelector('[data-action="forum"]').addEventListener('click', function() {
  // Handle join discussion forum action
  console.log('Discussion Forum button clicked');
  // Add your custom functionality here
  // Example: Show discussion forum or redirect to forum page
  alert('Joining discussion forum...');
});

// FAQs button functionality
document.querySelector('[data-action="faqs"]').addEventListener('click', function() {
  // Handle view FAQs action
  console.log('FAQs button clicked');
  // Add your custom functionality here
  // Example: Show frequently asked questions or redirect to FAQ page
  alert('Showing FAQs...');
});

// Enhanced touch interactions for mobile devices
const bookingButtons = document.querySelectorAll('.booking-buttons button');
const contactButtons = document.querySelectorAll('.contact-buttons button');

bookingButtons.forEach(button => {
  button.addEventListener('touchstart', function() {
    this.style.opacity = '0.7';
  });
  
  button.addEventListener('touchend', function() {
    this.style.opacity = '1';
  });
});

contactButtons.forEach(button => {
  button.addEventListener('touchstart', function() {
    this.style.opacity = '0.7';
  });
  
  button.addEventListener('touchend', function() {
    this.style.opacity = '1';
  });
});

// Enhanced button focus states for accessibility
bookingButtons.forEach(button => {
  button.addEventListener('focus', function() {
    this.style.outline = '2px solid var(--quasar-yellow)';
    this.style.outlineOffset = '2px';
  });
  
  button.addEventListener('blur', function() {
    this.style.outline = 'none';
  });
});

contactButtons.forEach(button => {
  button.addEventListener('focus', function() {
    this.style.outline = '2px solid var(--quasar-yellow)';
    this.style.outlineOffset = '2px';
  });
  
  button.addEventListener('blur', function() {
    this.style.outline = 'none';
  });
});

// Enhanced button hover states for desktop
document.addEventListener('DOMContentLoaded', function() {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    bookingButtons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.2s';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
    
    contactButtons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.2s';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
  }
});

// Enhanced button active states for better feedback
bookingButtons.forEach(button => {
  button.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 100);
  });
});

contactButtons.forEach(button => {
  button.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 100);
  });
});

// Enhanced button keyboard navigation support
bookingButtons.forEach(button => {
  button.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  });
});

contactButtons.forEach(button => {
  button.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  });
});

// Enhanced button loading states for better UX
const bookingButtonsArray = Array.from(bookingButtons);
const contactButtonsArray = Array.from(contactButtons);

function addLoadingState(button) {
  button.disabled = true;
  button.style.opacity = '0.7';
  button.textContent = 'Loading...';
}

function removeLoadingState(button, originalText) {
  button.disabled = false;
  button.style.opacity = '1';
  button.textContent = originalText;
}

bookingButtonsArray.forEach(button => {
  button.addEventListener('click', function() {
    const originalText = this.textContent;
    addLoadingState(this);
    
    setTimeout(() => {
      removeLoadingState(this, originalText);
    }, 2000);
  });
});

contactButtonsArray.forEach(button => {
  button.addEventListener('click', function() {
    const originalText = this.textContent;
    addLoadingState(this);
    
    setTimeout(() => {
      removeLoadingState(this, originalText);
    }, 2000);
  });
});

// Helper function for random number generation
function random() {
  return Math.random();
}

// Console error handling for better debugging
window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // Scroll-related operations can go here
  }, 100);
});

// Enhanced mobile menu with improved accessibility
const mobileNav = document.querySelector('.mobile-nav');
mobileNav.setAttribute('aria-label', 'Main navigation menu');

// Enhanced focus management for better accessibility
const focusableElements = navMenu.querySelectorAll('a, button, input, select, textarea');
focusableElements.forEach(element => {
  element.addEventListener('focus', () => {
    element.style.outline = '2px solid var(--quasar-yellow)';
    element.style.outlineOffset = '2px';
  });
  
  element.addEventListener('blur', () => {
    element.style.outline = 'none';
  });
});

// Enhanced keyboard navigation support
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navMenu.classList.contains('active')) {
    closeMenu();
  }
});

// Enhanced loading state with better UX
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
  }, 100);
});

// Enhanced button interactions with better feedback
const allButtons = document.querySelectorAll('button, [role="button"]');
allButtons.forEach(button => {
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)';
    button.style.transition = 'transform 0.2s';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });
  
  button.addEventListener('click', () => {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 100);
  });
});

// Enhanced touch support for mobile devices
document.addEventListener('touchstart', (event) => {
  if (event.target.closest('.nav-link')) {
    event.target.closest('.nav-link').style.opacity = '0.7';
  }
});

document.addEventListener('touchend', (event) => {
  if (event.target.closest('.nav-link')) {
    event.target.closest('.nav-link').style.opacity = '1';
  }
});

// Enhanced console error handling for better debugging
window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
});

// Enhanced performance optimization: Debounce scroll events
scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // Scroll-related operations can go here
  }, 100);
});

// Enhanced mobile menu auto-close on window resize with debounce
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  }, 250);
});

// Slide navigation enhancements
const slides = [
  {
    title: 'Formation of Black Holes',
    content: 'Black holes are formed through the gravitational collapse of massive stars. When a star with a mass greater than about 20 times that of our Sun exhausts its nuclear fuel, it can no longer support itself against its own gravity and collapses under its own weight.',
    image: '🌀'
  },
  {
    title: 'Types of Black Holes',
    content: 'There are several types of black holes, each with unique characteristics and formation processes. Understanding these types helps us comprehend the diversity of these cosmic phenomena.',
    image: '⚫'
  },
  {
    title: 'Effects of Black Holes',
    content: 'Black holes have profound effects on their surroundings and the universe at large. Their immense gravitational pull influences the behavior of nearby matter and light.',
    image: '💫'
  }
];

// Add slide transition animations
const slideContent = document.getElementById('slide-content');
slideContent.style.transition = 'opacity 0.5s';

// Add slide navigation keyboard support
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' && currentSlideIndex > 0) {
    event.preventDefault();
    prevSlide.click();
  }
  if (event.key === 'ArrowRight' && currentSlideIndex < slides.length - 1) {
    event.preventDefault();
    nextSlide.click();
  }
});

// Add slide auto-advance feature
setInterval(() => {
  if (currentSlideIndex < slides.length - 1) {
    nextSlide.click();
  } else {
    currentSlideIndex = 0;
    showSlide(currentSlideIndex);
  }
}, 5000);

// Add slide animation effects
const slideElements = document.querySelectorAll('.slide');
slideElements.forEach((slide, index) => {
  slide.style.opacity = '0';
  slide.style.transition = 'opacity 0.5s';
  
  setTimeout(() => {
    slide.style.opacity = '1';
  }, index * 200);
});

// Add quote animation effects
const quoteTextElement = document.getElementById('quote-text');
if (quoteTextElement) {
  quoteTextElement.style.transition = 'opacity 0.5s';
}

// Add button animation effects
const buttons = document.querySelectorAll('button, [role="button"]');
buttons.forEach(button => {
  button.style.transition = 'transform 0.2s';
});

// Add mobile menu animation effects
const navToggleBars = mobileMenu.querySelectorAll('.bar');
navigationToggleBars.forEach(bar => {
  bar.style.transition = 'transform 0.3s, opacity 0.3s';
});

// Add slide indicator animation effects
const slideIndicator = document.querySelector('.slide-indicator');
if (slideIndicator) {
  slideIndicator.style.transition = 'opacity 0.5s';
}

// Add scroll animation effects
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for scroll animations
const animateElements = document.querySelectorAll('.card, .slide');
animateElements.forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'opacity 0.5s, transform 0.5s';
  observer.observe(element);
});

// Add mouse move parallax effect for hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    heroSection.style.backgroundPositionX = `${x * 10}px`;
    heroSection.style.backgroundPositionY = `${y * 10}px`;
  });
}

// Add particle animation for black hole theme
function createParticle() {
  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.style.width = '2px';
  particle.style.height = '2px';
  particle.style.background = 'var(--quasar-yellow)';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = '-10px';
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '1000';
  
  document.body.appendChild(particle);
  
  let pos = -10;
  const fallInterval = setInterval(() => {
    pos++;
    particle.style.top = pos + 'px';
    
    if (pos > window.innerHeight) {
      clearInterval(fallInterval);
      particle.remove();
    }
  }, 10);
}

setInterval(createParticle, 300);

// Add black hole gravitational pull effect for buttons
buttons.forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = Math.sqrt((rect.width / 2) * (rect.width / 2) + (rect.height / 2) * (rect.height / 2));
    const strength = 1 - distance / maxDistance;
    
    button.style.transform = `scale(${1 + strength * 0.1})`;
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });
});

// Add cosmic ray animation for background
function createCosmicRay() {
  const ray = document.createElement('div');
  ray.style.position = 'fixed';
  ray.style.width = '1px';
  ray.style.height = '100vh';
  ray.style.background = 'linear-gradient(to bottom, transparent, var(--quasar-yellow), transparent)';
  ray.style.left = Math.random() * 100 + '%';
  ray.style.top = '0';
  ray.style.pointerEvents = 'none';
  ray.style.zIndex = '999';
  ray.style.animation = 'cosmicRay 3s linear infinite';
  
  document.body.appendChild(ray);
  
  setTimeout(() => {
    ray.remove();
  }, 3000);
}

// Add cosmic ray animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes cosmicRay {
    0% { opacity: 0; transform: translateX(0); }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; transform: translateX(100vw); }
  }
`;
document.head.appendChild(style);

setInterval(createCosmicRay, 1000);

// Add wormhole animation for page transitions
function createWormhole() {
  const wormhole = document.createElement('div');
  wormhole.style.position = 'fixed';
  wormhole.style.width = '100vw';
  wormhole.style.height = '100vh';
  wormhole.style.background = 'radial-gradient(circle, transparent 50%, var(--black-hole-dark) 50%, var(--black-hole-dark) 100%)';
  wormhole.style.left = '0';
  wormhole.style.top = '0';
  wormhole.style.pointerEvents = 'none';
  wormhole.style.zIndex = '1001';
  wormhole.style.animation = 'wormhole 2s ease-in-out';
  
  document.body.appendChild(wormhole);
  
  setTimeout(() => {
    wormhole.remove();
  }, 2000);
}

// Add wormhole animation keyframes
const wormholeStyle = document.createElement('style');
wormholeStyle.textContent = `
  @keyframes wormhole {
    0% { transform: scale(0); opacity: 1; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(10); opacity: 0; }
  }
`;
document.head.appendChild(wormholeStyle);

setInterval(createWormhole, 5000);

// Add black hole event horizon effect
const eventHorizon = document.createElement('div');
eventHorizon.style.position = 'fixed';
eventHorizon.style.width = '100vw';
eventHorizon.style.height = '100vh';
eventHorizon.style.background = 'radial-gradient(circle at center, transparent 0%, var(--event-horizon) 100%)';
eventHorizon.style.left = '0';
eventHorizon.style.top = '0';
eventHorizon.style.pointerEvents = 'none';
eventHorizon.style.zIndex = '998';
eventHorizon.style.animation = 'eventHorizon 10s ease-in-out infinite';

document.body.appendChild(eventHorizon);

// Add event horizon animation keyframes
const eventHorizonStyle = document.createElement('style');
eventHorizonStyle.textContent = `
  @keyframes eventHorizon {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
document.head.appendChild(eventHorizonStyle);

// Add black hole accretion disk effect
const accretionDisk = document.createElement('div');
accretionDisk.style.position = 'fixed';
accretionDisk.style.width = '100vw';
accretionDisk.style.height = '100vh';
accretionDisk.style.background = 'radial-gradient(circle at center, transparent 0%, var(--accretion-orange) 50%, transparent 100%)';
accretionDisk.style.left = '0';
accretionDisk.style.top = '0';
accretionDisk.style.pointerEvents = 'none';
accretionDisk.style.zIndex = '997';
accretionDisk.style.animation = 'accretionDisk 6s linear infinite';

document.body.appendChild(accretionDisk);

// Add accretion disk animation keyframes
const accretionDiskStyle = document.createElement('style');
accretionDiskStyle.textContent = `
  @keyframes accretionDisk {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(accretionDiskStyle);

// Add black hole singularity effect
const singularity = document.createElement('div');
singularity.style.position = 'fixed';
singularity.style.width = '2px';
singularity.style.height = '2px';
singularity.style.background = 'var(--quasar-yellow)';
singularity.style.left = '50%';
singularity.style.top = '50%';
singularity.style.transform = 'translate(-50%, -50%)';
singularity.style.pointerEvents = 'none';
singularity.style.zIndex = '1002';
singularity.style.animation = 'singularity 4s ease-in-out infinite';

document.body.appendChild(singularity);

// Add singularity animation keyframes
const singularityStyle = document.createElement('style');
singularityStyle.textContent = `
  @keyframes singularity {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.5; }
  }
`;
document.head.appendChild(singularityStyle);

// Add cosmic background animation
const cosmicBackground = document.createElement('div');
cosmicBackground.style.position = 'fixed';
cosmicBackground.style.width = '100vw';
cosmicBackground.style.height = '100vh';
cosmicBackground.style.background = 'radial-gradient(circle at 20% 80%, var(--stellar-blue) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--neutron-purple) 0%, transparent 50%), radial-gradient(circle at 40% 40%, var(--cosmic-lavender) 0%, transparent 50%)';
cosmicBackground.style.left = '0';
cosmicBackground.style.top = '0';
cosmicBackground.style.pointerEvents = 'none';
cosmicBackground.style.zIndex = '996';
cosmicBackground.style.animation = 'cosmicBackground 20s ease-in-out infinite';

document.body.appendChild(cosmicBackground);

// Add cosmic background animation keyframes
const cosmicBackgroundStyle = document.createElement('style');
cosmicBackgroundStyle.textContent = `
  @keyframes cosmicBackground {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;
document.head.appendChild(cosmicBackgroundStyle);

// Add event listeners for enhanced user interactions
window.addEventListener('load', () => {
  // Add fade-in effect for page load
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
  }, 100);
  
  // Add hover effect for buttons
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
  });
  
  // Add click effect for buttons
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 100);
    });
  });
  
  // Add keyboard navigation support
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
});