(() => {
  const $ = s => document.querySelector(s);

  const nav = $('#nav');
  const burger = $('#burger');
  const menu = $('#menu');
  const form = $('#form');
  const status = $('#status');

  // Mobile menu
  const closeMenu = () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.onclick = () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  };

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Reveal animations
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.rv').forEach(el => {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.rv').forEach(el => {
      el.classList.add('in');
    });
  }

  // Navigation and scroll progress
  const links = [...menu.querySelectorAll('a')];
  const sections = links.map(a =>
    document.querySelector(a.getAttribute('href'))
  );

  const updateScroll = () => {
    if (nav) nav.classList.toggle('scrolled', scrollY > 20);

    const pageHeight =
      document.documentElement.scrollHeight - innerHeight;

    $('#progress').style.width =
      (pageHeight > 0 ? scrollY / pageHeight * 100 : 0) + '%';

    let activeIndex = 0;

    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top < innerHeight * 0.4) {
        activeIndex = index;
      }
    });

    links.forEach((link, index) => {
      if (index === activeIndex) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Footer year and back-to-top
  $('#year').textContent = new Date().getFullYear();

  $('#top').onclick = () => {
    scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Contact form validation
  form.addEventListener('submit', event => {
    let valid = true;

    form.querySelectorAll('[required]').forEach(input => {
      const invalid =
        !input.value.trim() ||
        (input.type === 'email' &&
         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));

      input.classList.toggle('bad', invalid);

      if (invalid) valid = false;
    });

    if (!valid) {
      event.preventDefault();
      status.textContent =
        'Please complete all fields with a valid email.';
    } else {
      status.textContent =
        'Sending your message...';
      // Allow the browser to submit the form to FormSubmit.
    }
  });

  // Clear validation error while typing
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) input.classList.remove('bad');
    });

    input.addEventListener('change', () => {
      if (input.value.trim()) input.classList.remove('bad');
    });
  });
})();