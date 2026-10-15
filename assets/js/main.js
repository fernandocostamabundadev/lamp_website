const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const mobileViewport = window.matchMedia('(max-width: 760px)');

const setMenuOpen = (isOpen) => {
  if (!menuButton || !navigation) return;
  const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar navegação' : 'Abrir navegação');
  navigation.classList.toggle('is-open', isOpen);
  navigation.setAttribute('aria-hidden', String(mobileViewport.matches && !isOpen));
  navigation.inert = mobileViewport.matches && !isOpen;
  if (isOpen && mobileViewport.matches) navigation.querySelector('a')?.focus();
  else if (wasOpen) menuButton.focus();
};

setMenuOpen(false);
menuButton?.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});
navigation?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
  }
});
mobileViewport.addEventListener('change', () => setMenuOpen(false));

const header = document.querySelector('.site-header');
const scrollTop = document.querySelector('.scroll-top');
const updateScrollState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  scrollTop?.classList.toggle('is-visible', window.scrollY > 480);
};
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const themeButton = document.querySelector('.theme-toggle');
const themeKey = 'sunlight-theme';
if (localStorage.getItem(themeKey) === 'dark') document.body.dataset.theme = 'dark';

const updateThemeButton = () => {
  const isDark = document.body.dataset.theme === 'dark';
  themeButton?.setAttribute('aria-label', `Ativar tema ${isDark ? 'claro' : 'escuro'}`);
  themeButton?.setAttribute('title', `Ativar tema ${isDark ? 'claro' : 'escuro'}`);
  themeButton?.setAttribute('aria-pressed', String(isDark));
};
updateThemeButton();
themeButton?.addEventListener('click', () => {
  const isDark = document.body.dataset.theme !== 'dark';
  document.body.dataset.theme = isDark ? 'dark' : 'light';
  localStorage.setItem(themeKey, isDark ? 'dark' : 'light');
  updateThemeButton();
});

const cartLink = document.querySelector('.cart-link');
const cartCounts = document.querySelectorAll('.cart-count');
const cartStatus = document.querySelector('.cart-status');
let cartTotal = 0;
document.querySelectorAll('[data-add]').forEach(button => {
  button.addEventListener('click', () => {
    cartTotal += 1;
    cartCounts.forEach(count => {
      count.textContent = String(cartTotal);
    });
    cartLink?.setAttribute('aria-label', `Sacola de demonstração, ${cartTotal} ${cartTotal === 1 ? 'produto' : 'produtos'}`);
    if (cartStatus) cartStatus.textContent = `${button.dataset.add} adicionado à sacola de demonstração. Total: ${cartTotal}.`;
    const originalText = button.dataset.originalText || button.textContent;
    button.dataset.originalText = originalText;
    button.textContent = 'Adicionado ✓';
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1500);
  });
});

document.querySelectorAll('[data-feedback]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = form.querySelector('.form-message');
    if (message) message.textContent = 'Obrigado! Esta demonstração confirma a subscrição apenas nesta página; nenhum dado foi enviado.';
    form.reset();
  });
});

document.querySelectorAll('[data-year]').forEach(year => {
  year.textContent = String(new Date().getFullYear());
});

const sections = [...document.querySelectorAll('main section[id]')];
const navigationLinks = [...document.querySelectorAll('.nav-links a')];
const updateActiveLink = () => {
  const current = sections.filter(section => section.getBoundingClientRect().top <= 140).at(-1);
  navigationLinks.forEach(link => {
    if (link.hash === `#${current?.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};
window.addEventListener('scroll', updateActiveLink, { passive: true });
window.addEventListener('resize', updateActiveLink);
updateActiveLink();

const revealElements = document.querySelectorAll('[data-reveal]');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
  revealElements.forEach(element => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => revealObserver.observe(element));
}
