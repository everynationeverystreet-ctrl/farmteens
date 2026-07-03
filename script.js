const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('siteHeader');
const counters = document.querySelectorAll('.counter');
const buttons = document.querySelectorAll('.btn-ripple');

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  const next = !expanded;
  menuToggle.setAttribute('aria-expanded', String(next));
  siteNav.classList.toggle('open', next);

  if (!next) menuToggle.focus();
});

// Close menu on Escape (keyboard accessibility)
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const expanded = menuToggle?.getAttribute('aria-expanded') === 'true';
  if (!expanded) return;
  siteNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
});

const setActiveNavLink = () => {
  const currentPath = window.location.pathname.replace(/\/\/$/, '');
  const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPath = href.replace(/\/\/$/, '');
    const linkPage = linkPath.substring(linkPath.lastIndexOf('/') + 1) || 'index.html';
    const isActive = linkPage === currentPage || (currentPage === '' && linkPage === 'index.html');

    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

setActiveNavLink();

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');
    siteNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');

    if (window.innerWidth <= 860) {
      menuToggle?.focus();
    }
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 38) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      if (entry.target.classList.contains('counter')) {
        animateCounter(entry.target);
      }
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.animate').forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const animateCounter = (element) => {
  if (element.dataset.animated === 'true') return;
  element.dataset.animated = 'true';
  const target = Number(element.dataset.target) || 0;
  const duration = 1400;
  const step = Math.max(Math.ceil(target / (duration / 16)), 1);
  let current = 0;

  const update = () => {
    current += step;
    if (current >= target) {
      element.textContent = target;
    } else {
      element.textContent = current;
      requestAnimationFrame(update);
    }
  };
  update();
};

buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = 'ripple-effect';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

window.addEventListener('load', () => {
  document.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
});
