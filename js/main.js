/* ===== Scroll Progress Bar ===== */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + '%';
}

/* ===== Navbar Scroll ===== */
const navbar = document.querySelector('.navbar');
function updateNavbar() {
  if (!navbar) return;
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ===== Back to Top ===== */
const backToTop = document.getElementById('back-to-top');
function updateBackToTop() {
  if (!backToTop) return;
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

window.addEventListener('scroll', () => {
  updateProgress();
  updateNavbar();
  updateBackToTop();
}, { passive: true });

updateNavbar();

/* ===== Hamburger Menu ===== */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    if (isOpen) {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ===== Dark Mode Toggle ===== */
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}

/* ===== Scroll Reveal (IntersectionObserver) ===== */
const revealSelectors = '.reveal, .reveal-left, .reveal-right, .stagger';
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(revealSelectors).forEach(el => revealObserver.observe(el));

/* ===== Tabs ===== */
document.querySelectorAll('.tabs').forEach(tabsEl => {
  const buttons = tabsEl.querySelectorAll('.tab-btn');
  const panels  = tabsEl.querySelectorAll('.tab-panel');

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      panels[i]?.classList.add('active');
    });
  });
});

/* ===== Accordion ===== */
document.querySelectorAll('.accordion-item').forEach(item => {
  const header = item.querySelector('.accordion-header');
  const body   = item.querySelector('.accordion-body');
  const icon   = item.querySelector('.accordion-icon');

  if (!header || !body) return;

  header.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0';
  });
});

/* ===== Sidebar Active Link (InnerPages) ===== */
const sidebarLinks = document.querySelectorAll('.sidebar-links a');
const sections = document.querySelectorAll('.main-content [id]');

if (sidebarLinks.length && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        sidebarLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

/* ===== Counter Animation ===== */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = (target % 1 !== 0)
      ? start.toFixed(1)
      : Math.floor(start).toLocaleString();
    if (start >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseFloat(entry.target.dataset.count);
      if (!isNaN(target)) animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ===== Active nav link highlight ===== */
const currentPath = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
  const href = a.getAttribute('href')?.split('/').pop();
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});
