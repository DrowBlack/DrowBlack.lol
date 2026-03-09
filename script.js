/* ===================================================
   PORTFOLIO — JAVASCRIPT
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- NAVBAR SCROLL EFFECT ----------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ---------- MOBILE NAV TOGGLE ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // ---------- ACTIVE NAV LINK ON SCROLL ----------
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const id = entry.target.id;
        const matchingLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (matchingLink) matchingLink.classList.add('active');
      }
    });
  }, { root: null, rootMargin: '-40% 0px -60% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  // ---------- PORTFOLIO PROJECTS DATA ----------
  // images: array of filenames in the images/ folder (e.g. ['image1.png', 'image2.jpg'])
  // link: URL for "View Detail" button (leave empty '' to hide the button)
  const projects = [
    {
      title: 'Parkour Redone',
      desc: 'Main Scripter <br> A Parkour Reborn modded game made by Fynndo, New self made districts, self made announcement system, self made movement fix and way more thing. This game is private bc of being game copy but we are just making it for fun.',
      year: '2025',
      category: 'all',
      link: 'https://discord.gg/YzkKtBaDQ4',
      images: ['Redone1.png', 'Redone2.png', 'Redone3.png']
    },
    {
      title: 'Momentum',
      desc: 'Scripter <br> A parkour game with some cool movement mechanics and stuff, we are making our own maps, scripts, mechanics, lightnings and way more thing this is gonna be peak game is private for now.',
      year: '2026',
      category: 'all',
      link: '',
      images: []
    },
    {
      title: 'Discord Backup Bot',
      desc: 'A discord bot for get server backups and restore servers its storing data inside of you pc so its 100% safe and its allows you to copy one server and paste into any server its copies roles, perms, channels. <br> [Paid contact with me for buy it.]',
      year: '2025',
      category: 'bots',
      link: 'https://discord.gg/b9VK6UTD69',
      images: ['backup1.png', 'backup2.png', 'backup3.png']
    },
    {
      title: 'VFX Showcase',
      desc: 'Some VFX I made for fun. ill make more soon.',
      year: '2025',
      category: 'vfx',
      link: 'https://discord.gg/b9VK6UTD69',
      images: ['VFX1.png', 'VFX2.png', 'VFX3.png']
    }
  ];

  let currentProject = 0;
  const showcase = document.getElementById('portfolioShowcase');

  function renderProject(index, direction = 'none') {
    const p = projects[index];

    // Determine slide offsets based on direction
    const slideOut = direction === 'next' ? '-30px' : direction === 'prev' ? '30px' : '0';
    const slideIn  = direction === 'next' ? '30px'  : direction === 'prev' ? '-30px' : '0';

    // Animate out current content
    if (direction !== 'none') {
      showcase.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      showcase.style.opacity = '0';
      showcase.style.transform = `translateX(${slideOut})`;
    }

    // Build View Detail button (hidden if no link)
    const viewBtn = p.link
      ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">View Detail <span class="arrow-icon">↗</span></a>`
      : '';

    // Build images — use provided images[] array or fall back to placeholders
    let imagesHTML = '';
    if (p.images && p.images.length > 0) {
      p.images.forEach((img, i) => {
        const cls = i === 0 ? 'project-img-1' : (i <= 2 ? `project-img-${i + 1}` : '');
        imagesHTML += `<img src="images/${img}" alt="${p.title}" class="project-real-img ${cls}" />`;
      });
    } else {
      imagesHTML = `
        <div class="placeholder-image project-img-1"></div>
        <div class="placeholder-image project-img-2"></div>
        <div class="placeholder-image project-img-3"></div>
      `;
    }

    const insertContent = () => {
      showcase.innerHTML = `
        <div class="project-info">
          <span class="project-label">Project Name</span>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <span class="project-year">${p.year}</span>
          ${viewBtn}
        </div>
        <div class="project-images">
          ${imagesHTML}
        </div>
      `;
      // Start from the opposite side
      showcase.style.transition = 'none';
      showcase.style.opacity = '0';
      showcase.style.transform = `translateX(${slideIn})`;
      // Animate in
      requestAnimationFrame(() => {
        showcase.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        showcase.style.opacity = '1';
        showcase.style.transform = 'translateX(0)';
      });
      syncFilterButtons(p.category);
    };

    if (direction !== 'none') {
      setTimeout(insertContent, 250);
    } else {
      insertContent();
    }
  }

  // Map project category to filter data-filter attribute
  const categoryToFilter = { 'all': 'all', 'bots': 'bots', 'vfx': 'vfx' };

  function syncFilterButtons(category) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.filter === category) {
        btn.classList.add('active');
      }
    });
  }

  // Initial render
  renderProject(currentProject);

  // Arrow navigation
  document.getElementById('prevProject').addEventListener('click', () => {
    currentProject = (currentProject - 1 + projects.length) % projects.length;
    renderProject(currentProject, 'prev');
  });

  document.getElementById('nextProject').addEventListener('click', () => {
    currentProject = (currentProject + 1) % projects.length;
    renderProject(currentProject, 'next');
  });

  // ---------- PORTFOLIO FILTER BUTTONS ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      // Find first project matching filter
      const idx = projects.findIndex(p => filter === 'all' || p.category === filter);
      if (idx !== -1) {
        currentProject = idx;
        renderProject(currentProject);
      }
    });
  });

  // ---------- TESTIMONIALS DATA ----------
  // image: filename in images/ folder (e.g. 'client1.jpg'). Leave '' for placeholder.
  const reviews = [
    {
      quoteEn: "He's very good and talented at coding, I also like his VFX but he's a bit slow, still really good though.",
      quoteTr: "Kodlama konusunda çok iyi ve yetenekli, ayrıca VFX'lerini de çok beğeniyorum ama biraz yavaş, yine de gerçekten çok iyi.",
      author: 'Fynndo3d, Creator of Parkour Redone & Momentum',
      rating: 4,
      image: 'fynndo.webp'
    },
    {
      quoteEn: "I think you have improved yourself, and your success will likely continue. You continue to achieve success in your work in a short time.",
      quoteTr: "Bence kendini geliştirdin, büyük ihtimalle başarının devamı gelmeye devam eder. İşinde de kısa sürede başarılar elde etmeye devam ediyorsun.",
      author: 'Batusama, Owner Of Risus Network Server',
      rating: 4,
      image: 'batusama.webp'
    },
    {
      quoteEn: "The system you set up is very organized and understandable, it made working on the project much easier. You did a short but effective job, Drow.",
      quoteTr: "Kurduğun sistem çok düzenli ve anlaşılır, projede çalışmayı baya kolaylaştırdı. Kısa ama etkili bir iş çıkarmışsın Drow.",
      author: 'itsBigTR',
      rating: 4.5,
      image: 'bigtr.webp'
    }
  ];

  let currentReview = 0;
  let currentLang = 'en';

  function scrambleText(element, newText, duration = 600) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
    const steps = duration / 30;
    let step = 0;
    if (element.scrambleInterval) clearInterval(element.scrambleInterval);
    
    const startLength = element.innerText.length;
    const endLength = newText.length;
    
    element.scrambleInterval = setInterval(() => {
      let result = '';
      const progress = step / steps;
      const currentLength = Math.floor(startLength + (endLength - startLength) * progress);
      const limit = Math.floor(progress * endLength);
      
      for (let i = 0; i < currentLength; i++) {
        if (i < limit) {
          result += newText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      element.innerText = result;
      step++;
      
      if (step > steps) {
        clearInterval(element.scrambleInterval);
        element.innerText = newText;
      }
    }, 30);
  }
  const carousel = document.getElementById('testimonialCarousel');

  function getReviewIndex(offset) {
    return (currentReview + offset + reviews.length) % reviews.length;
  }

  function buildPortraitHTML(review, sizeClass) {
    if (review.image) {
      return `<div class="testimonial-frame ${sizeClass}"><img src="images/${review.image}" alt="${review.author}" class="testimonial-portrait-img" /></div>`;
    }
    return `<div class="testimonial-frame ${sizeClass}"><div class="placeholder-image"></div></div>`;
  }

  function renderReview(direction = 'none') {
    const r = reviews[currentReview];
    const prevIdx = getReviewIndex(-1);
    const nextIdx = getReviewIndex(1);

    const slideOut = direction === 'next' ? '-30px' : direction === 'prev' ? '30px' : '0';
    const slideIn  = direction === 'next' ? '30px'  : direction === 'prev' ? '-30px' : '0';

    if (direction !== 'none') {
      carousel.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      carousel.style.opacity = '0';
      carousel.style.transform = `translateX(${slideOut})`;
    }

    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (r.rating >= i) {
        stars += '★';
      } else if (r.rating > i - 1) {
        stars += '<span class="half-star">☆</span>';
      } else {
        stars += '☆';
      }
    }

    const insertContent = () => {
      carousel.innerHTML = `
        <div class="testimonial-portraits">
          ${buildPortraitHTML(reviews[prevIdx], 'small')}
          ${buildPortraitHTML(r, 'large')}
          ${buildPortraitHTML(reviews[nextIdx], 'small')}
        </div>
        <div class="stars">${stars}</div>
        <blockquote class="testimonial-quote">"<span id="quoteText">${currentLang === 'en' ? r.quoteEn : r.quoteTr}</span>"</blockquote>
        <p class="testimonial-author">– ${r.author}</p>
      `;
      carousel.style.transition = 'none';
      carousel.style.opacity = '0';
      carousel.style.transform = `translateX(${slideIn})`;
      requestAnimationFrame(() => {
        carousel.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        carousel.style.opacity = '1';
        carousel.style.transform = 'translateX(0)';
      });
    };

    if (direction !== 'none') {
      setTimeout(insertContent, 250);
    } else {
      insertContent();
    }
  }

  // Initial render
  renderReview();

  document.getElementById('prevReview').addEventListener('click', () => {
    currentReview = (currentReview - 1 + reviews.length) % reviews.length;
    renderReview('prev');
  });

  const translateBtn = document.getElementById('translateReview');
  if (translateBtn) {
    translateBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'tr' : 'en';
      const quoteEl = document.getElementById('quoteText');
      if (quoteEl) {
        const newText = currentLang === 'en' ? reviews[currentReview].quoteEn : reviews[currentReview].quoteTr;
        scrambleText(quoteEl, newText, 600);
      }
    });
  }

  document.getElementById('nextReview').addEventListener('click', () => {
    currentReview = (currentReview + 1) % reviews.length;
    renderReview('next');
  });

  // ---------- SCROLL-REVEAL ANIMATIONS ----------
  const animatableSelectors = [
    '.section-badge',
    '.section-heading',
    '.hero-subtext',
    '.hero .btn',
    '.hero-portrait-frame',
    '.about-bio',
    '.about-tagline',
    '.about-portrait-frame',
    '.about-contact',
    '.about-experience',
    '.about-left .btn',
    '.services-subtext',
    '.year-display',
    '.service-card',
    '.portfolio-header',
    '.portfolio-filters',
    '.portfolio-showcase',
    '.testimonials-subtext',
    '.testimonial-portraits',
    '.stars',
    '.testimonial-quote',
    '.testimonial-author',
    '.cta-subtext',
    '.cta-boxes',
    '.cta-bottom-text',
    '.cta-inner > .btn'
  ];

  let delayIndex = 0;
  animatableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-in');
      el.classList.add(`fade-in-delay-${(delayIndex % 4) + 1}`);
      delayIndex++;
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

  document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));

  requestAnimationFrame(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  });

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- MUSIC PLAYER ----------
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicIconPlay = document.getElementById('musicIconPlay');
  const musicIconPause = document.getElementById('musicIconPause');
  const musicVisualizer = document.getElementById('musicVisualizer');
  const volumeSlider = document.getElementById('volumeSlider');
  let isPlaying = false;

  // Set initial volume
  bgMusic.volume = 0.3;

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicIconPlay.style.display = 'block';
      musicIconPause.style.display = 'none';
      musicVisualizer.classList.remove('playing');
      isPlaying = false;
    } else {
      bgMusic.play().then(() => {
        musicIconPlay.style.display = 'none';
        musicIconPause.style.display = 'block';
        musicVisualizer.classList.add('playing');
        isPlaying = true;
      }).catch(() => {
        // Autoplay blocked — needs user gesture, toggle already is one
      });
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value / 100;
  });

  // Handle music ending (shouldn't with loop, but just in case)
  bgMusic.addEventListener('ended', () => {
    musicIconPlay.style.display = 'block';
    musicIconPause.style.display = 'none';
    musicVisualizer.classList.remove('playing');
    isPlaying = false;
  });

  // ---------- LIGHTBOX ----------
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src) {
    lightboxImg.src = src;
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Click on project images (event delegation for dynamically rendered images)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('project-real-img')) {
      openLightbox(e.target.src);
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
