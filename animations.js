// Progressive animation: all content remains usable without JavaScript.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !Element.prototype.animate) return;
  const easing = 'cubic-bezier(.22, 1, .36, 1)';
  const activeAnimations = new Set();
  function play(element, frames, options) {
    const animation = element.animate(frames, options);
    activeAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
    return animation;
  }
  let welcome;
  const isHome = Boolean(document.querySelector('#home'));
  let showWelcome = isHome && !location.hash;
  try {
    if (sessionStorage.getItem('mitra-welcomed')) showWelcome = false;
    if (showWelcome) sessionStorage.setItem('mitra-welcomed', 'yes');
  } catch { /* Private browsing may disable session storage. */ }
  if (showWelcome) {
    welcome = document.createElement('div');
    welcome.className = 'welcome-entrance';
    welcome.setAttribute('aria-hidden', 'true');
    welcome.innerHTML = '<div class="welcome-content"><span class="welcome-mark">M</span><span class="welcome-eyebrow">WELCOME TO MITRA</span><span class="welcome-title">Your next chapter awaits.</span><span class="welcome-line"></span><span class="welcome-location">LB NAGAR &middot; HYDERABAD</span></div>';
    document.body.append(welcome);
    play(welcome.querySelector('.welcome-content'), [
      { opacity: 0, transform: 'translateY(16px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 650, easing, fill: 'backwards' });
    // A decorative entrance, never an interaction or page-loading gate.
    play(welcome, [{ opacity: 1 }, { opacity: 0 }], {
      duration: 500, delay: 1050, easing, fill: 'forwards'
    }).finished.then(() => welcome.remove()).catch(() => welcome.remove());
    setTimeout(() => welcome.remove(), 1800);
    document.addEventListener('keydown', () => welcome.remove(), { once: true });
    document.addEventListener('pointerdown', () => welcome.remove(), { once: true });
  }
  const hero = document.querySelector('.hero-copy, .page-hero .wrap');
  if (hero) [...hero.children].forEach((element, index) => {
    play(element, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], {
      duration: 750, delay: (showWelcome ? 1150 : 80) + index * 90, easing, fill: 'backwards'
    });
  });
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (!motion.matches) play(entry.target, [
          { opacity: 0, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700, easing });
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.finder, .range > h2, .section-heading, .buyer-grid article, .about-preview, .faq, .visit-grid, .story > *, .contact-layout > *, .enquiry-heading, .enquiry-form').forEach(element => observer.observe(element));
  }
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    welcome?.remove();
    observer?.disconnect();
    activeAnimations.forEach(animation => animation.cancel());
  });
})();
