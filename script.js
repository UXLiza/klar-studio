// ============================================
// KLAR STUDIO — ГЛАВНЫЙ ФАЙЛ СКРИПТОВ
// ============================================

// --- 1. ФУНКЦИЯ ЗАГРУЗКИ КОМПОНЕНТОВ (HEADER & FOOTER) ---
async function loadComponent(url, elementId, callback) {
  const placeholder = document.getElementById(elementId);
  if (!placeholder) return;

  try {
    const response = await fetch(url + '?v=' + Date.now());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    placeholder.innerHTML = html;
    
    if (url === 'header.html') {
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/svg+xml';
      favicon.href = 'favicon.svg';
      document.head.appendChild(favicon);
    }
    
    if (callback) callback();
  } catch (error) {
    console.error(`Ошибка загрузки ${url}:`, error);
  }
}

// --- 2. ЛОГИКА БУРГЕР-МЕНЮ + ФИКСИРОВАННАЯ ШАПКА ---
function initBurgerMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  // Если элементов нет на странице, выходим без ошибок
  if (!burgerBtn || !mobileMenu) return;

  const lines = burgerBtn.querySelectorAll('.burger-line');

  function toggleMenu() {
    // Проверяем состояние по классам Tailwind, а не по кастомному классу
    const isOpen = mobileMenu.classList.contains('opacity-100');

    if (isOpen) {
      // === ЗАКРЫВАЕМ МЕНЮ ===
      mobileMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      mobileMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-3');
      
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = ''; // Возвращаем скролл страницы

      // Сброс анимации бургера в исходное состояние
      lines[0].style.transform = '';
      lines[1].style.opacity = '1';
      lines[2].style.transform = '';
    } else {
      // === ОТКРЫВАЕМ МЕНЮ ===
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-3');
      mobileMenu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      
      burgerBtn.setAttribute('aria-expanded', 'true');
      burgerBtn.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden'; // Блокируем скролл страницы при открытом меню

      // Анимация бургера в крестик
      lines[0].style.transform = 'translateY(7px) rotate(45deg)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    }
  }

  burgerBtn.addEventListener('click', toggleMenu);

  // Закрываем меню при клике на любую ссылку или кнопку внутри него
  mobileMenu.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('opacity-100')) {
        toggleMenu();
      }
    });
  });

  // Логика шапки при скролле
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
    
    // Проверка при загрузке (если страница уже проскроллена)
    if (window.pageYOffset > 50) {
      siteHeader.classList.add('scrolled');
    }
  }
}

// --- 3. ЗАПУСК ПОСЛЕ ЗАГРУЗКИ СТРАНИЦЫ ---
document.addEventListener("DOMContentLoaded", function () {
  
  loadComponent('header.html', 'header-placeholder', initBurgerMenu);
  loadComponent('footer.html', 'footer-placeholder');

  // АНИМАЦИЯ ЗАГОЛОВКОВ
  const animatedHeaders = document.querySelectorAll(".fade-in-up");
  if (animatedHeaders.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    animatedHeaders.forEach((header) => observer.observe(header));
  }

  // АНИМАЦИЯ ЦИФР
  const counters = document.querySelectorAll(".counter");
  if (counters.length > 0) {
    const speed = 60;
    const startCounter = (counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;
        const inc = Math.ceil(target / speed);
        if (count < target) {
          counter.innerText = Math.min(count + inc, target);
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    };
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  // КАЛЬКУЛЯТОР
  const areaSlider = document.getElementById('area-slider');
  if (areaSlider) {
    let currentBuildingType = 'new';
    let currentPackage = 'capital';
    let currentArea = 65;
    const rates = { cosmetic: 4500, capital: 8500, design: 15000 };

    window.setBuildingType = function(type) {
      currentBuildingType = type;
      const activeClass = 'calc-btn p-5 border border-[#1C1D21] bg-[#1C1D21] text-white text-left font-bold sm:text-xl transition-colors';
      const inactiveClass = 'calc-btn p-5 border border-gray-200 bg-white text-black text-left font-bold sm:text-xl transition-colors hover:border-black';
      document.getElementById('btn-type-new').className = type === 'new' ? activeClass : inactiveClass;
      document.getElementById('btn-type-old').className = type === 'old' ? activeClass : inactiveClass;
      calculateTotal();
    };

    window.setPackage = function(pkg) {
      currentPackage = pkg;
      const activeClass = 'calc-btn p-5 border border-[#1C1D21] bg-[#1C1D21] text-white text-left font-bold sm:text-xl transition-colors';
      const inactiveClass = 'calc-btn p-5 border border-gray-200 bg-white text-black text-left font-bold sm:text-xl transition-colors hover:border-black';
      ['cosmetic', 'capital', 'design'].forEach(p => {
        const btn = document.getElementById(`btn-pkg-${p}`);
        if (p === pkg) {
          btn.className = activeClass;
          btn.querySelector('.text-gray-400')?.classList.replace('text-gray-400', 'text-gray-300');
        } else {
          btn.className = inactiveClass;
          btn.querySelector('.text-gray-300')?.classList.replace('text-gray-300', 'text-gray-400');
        }
      });
      calculateTotal();
    };

    window.updateArea = function(val) {
      currentArea = parseInt(val);
      document.getElementById('area-val').innerText = `${val} m²`;
      calculateTotal();
    };

    function calculateTotal() {
      let pricePerMeter = rates[currentPackage];
      if (document.getElementById('opt-design').checked) pricePerMeter += 1200;
      let total = pricePerMeter * currentArea;
      if (currentBuildingType === 'old') total *= 1.15;
      if (document.getElementById('opt-demolition').checked) total *= 1.12;
      const priceElement = document.getElementById('total-price');
      if (priceElement) priceElement.innerText = Math.round(total).toLocaleString('en-US') + ' €';
    }
    calculateTotal();
  }

  // СЛАЙДЕР ДО/ПОСЛЕ
  const sBox = document.getElementById('before-after-slider');
  if (sBox) {
    const sLayer = document.getElementById('after-wrap');
    const sHandle = document.getElementById('slider-handle');
    const sImg = document.getElementById('img-after');

    function fixSliderWidth() {
      if (sBox && sImg) { sImg.style.width = sBox.offsetWidth + 'px'; }
    }
    window.addEventListener('resize', fixSliderWidth);
    setTimeout(fixSliderWidth, 300);

    let activeDrag = false;
    sBox.addEventListener('mousedown', () => activeDrag = true);
    window.addEventListener('mouseup', () => activeDrag = false);
    sBox.addEventListener('touchstart', () => activeDrag = true, { passive: true });
    window.addEventListener('touchend', () => activeDrag = false);

    const moveAction = (clientX) => {
      const bounds = sBox.getBoundingClientRect();
      let currentX = clientX - bounds.left;
      if (currentX < 0) currentX = 0;
      if (currentX > bounds.width) currentX = bounds.width;
      const percent = (currentX / bounds.width) * 100;
      sLayer.style.width = percent + '%';
      sHandle.style.left = percent + '%';
    };

    window.addEventListener('mousemove', (e) => { if (activeDrag) moveAction(e.clientX); });
    window.addEventListener('touchmove', (e) => { if (activeDrag && e.touches) moveAction(e.touches[0].clientX); }, { passive: true });
  }

     // ==========================================
  // ФИЛЬТРАЦИЯ + ПОСТЕПЕННАЯ ЗАГРУЗКА ПРОЕКТОВ
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const viewMoreBtn = document.getElementById('view-more-btn');
  const projectsEnd = document.getElementById('projects-end');

  if (projectCards.length > 0) {
    const MAX_PAGES = 4;          // всего 4 группы по 4 проекта
    let currentPage = 2;          // ✅ Начинаем с 2 (показываем 8 проектов сразу)
    let currentFilter = 'all';

    function updateProjects() {
      projectCards.forEach(card => {
        const page = parseInt(card.dataset.page || '1');
        const types = card.dataset.type || '';
        const withinPage = page <= currentPage;
        const matchesFilter = currentFilter === 'all' || types.includes(currentFilter);
        card.style.display = (withinPage && matchesFilter) ? 'block' : 'none';
      });

      // Конец списка
      if (currentPage >= MAX_PAGES) {
        if (viewMoreBtn) viewMoreBtn.style.display = 'none';
        if (projectsEnd) projectsEnd.classList.remove('hidden');
      } else {
        if (viewMoreBtn) viewMoreBtn.style.display = 'inline-flex';
        if (projectsEnd) projectsEnd.classList.add('hidden');
      }
    }

    // Фильтры
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        updateProjects();
      });
    });

    // View more
    if (viewMoreBtn) {
      viewMoreBtn.addEventListener('click', () => {
        if (currentPage < MAX_PAGES) {
          currentPage++;
          updateProjects();
          // Плавный скролл к новым проектам
          setTimeout(() => {
            const newCards = document.querySelectorAll(`.project-card[data-page="${currentPage}"]`);
            if (newCards.length > 0) {
              newCards[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      });
    }

    // Плавное появление карточек при загрузке
    projectCards.forEach((card, index) => {
      if (card.style.display !== 'none') {
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease';
          card.style.opacity = '1';
        }, index * 80);
      }
    });

    // Первоначальная инициализация
    updateProjects();
  }

  // COOKIES
  function loadCookieBanner() {
    const bannerContainer = document.createElement('div');
    bannerContainer.id = 'cookie-banner-container';
    document.body.appendChild(bannerContainer);
    fetch('cookies.html')
      .then(response => response.text())
      .then(html => {
        bannerContainer.innerHTML = html;
        initCookieBanner();
      })
      .catch(error => console.error('Ошибка загрузки cookies.html:', error));
  }

  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    if (!banner) return;
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setTimeout(() => { banner.classList.add('visible'); }, 1000);
    }
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.remove('visible');
        setTimeout(() => { banner.classList.add('hidden-banner'); }, 400);
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'rejected');
        banner.classList.remove('visible');
        setTimeout(() => { banner.classList.add('hidden-banner'); }, 400);
      });
    }
  }
  loadCookieBanner();

    // ==========================================
  // МОДАЛЬНОЕ ОКНО + ОТПРАВКА ЧЕРЕЗ WEB3FORMS
  // ==========================================
  function loadModal() {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);

    // Добавлен ?v=Date.now() чтобы браузер не брал старую версию из кэша
    fetch('modal.html?v=' + Date.now())
      .then(response => response.text())
      .then(html => {
        modalContainer.innerHTML = html;
        initModal();
      })
      .catch(error => console.error('Ошибка загрузки modal.html:', error));
  }

  function initModal() {
    const modal = document.getElementById('quote-modal');
    const overlay = modal?.querySelector('.modal-overlay');
    const closeBtn = modal?.querySelector('[data-modal-close]');

    if (!modal) return;

    let isSubmitting = false; // <-- ЗАЩИТА 1: Флаг отправки

    function openModal() {
      modal.classList.add('visible');
      document.body.classList.add('modal-open');
    }

    function closeModal() {
      modal.classList.remove('visible');
      document.body.classList.remove('modal-open');
      
      setTimeout(() => {
        const successMsg = document.getElementById('success-message');
        if (successMsg) {
          successMsg.remove();
        }
        
        const formSection = document.getElementById('form-section');
        if (formSection) {
          formSection.style.display = 'block';
        }
        
        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
          quoteForm.reset();
          const submitBtn = quoteForm.querySelector('button[type="submit"]');
          submitBtn.innerHTML = `send request <svg class="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`;
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-green-600', 'bg-red-600', 'opacity-50', 'cursor-not-allowed');
        }
        
        isSubmitting = false; // <-- СБРОС ФЛАГА ПРИ ЗАКРЫТИИ
      }, 300);
    }

    // Делегирование событий для кнопок открытия
    document.addEventListener('click', function(e) {
      const openBtn = e.target.closest('[data-modal-open]');
      if (openBtn) {
        e.preventDefault();
        openModal();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('visible')) {
        closeModal();
      }
    });

    // === ОТПРАВКА ФОРМЫ ЧЕРЕЗ WEB3FORMS ===
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
      quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // <-- ЗАЩИТА 2: Если уже отправляется, игнорируем клик
        if (isSubmitting) return;
        isSubmitting = true;
        
        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const formData = new FormData(quoteForm);
        const firstName = formData.get('firstName') || '';
        const lastName = formData.get('lastName') || '';
        const email = formData.get('email') || '';
        const phone = formData.get('phone') || '';
        const message = formData.get('message') || 'Без сообщения';

        const accessKey = 'f5cafa53-60a5-45f2-ab7c-859d9ebdc24f';

        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: accessKey,
              subject: 'Новая заявка с сайта Klar Studio',
              from_name: `${firstName} ${lastName}`,
              name: `${firstName} ${lastName}`,
              email: email,
              phone: phone,
              message: message,
              replyto: email
            })
          });

          const result = await response.json();

          if (result.success) {
            quoteForm.reset();
            
            const modalContent = modal.querySelector('.modal-content');
            
            // <-- ЗАЩИТА 3: Гарантированное удаление старого сообщения перед созданием нового
            const existingSuccessMsg = modalContent.querySelector('#success-message');
            if (existingSuccessMsg) {
              existingSuccessMsg.remove();
            }
            
            const successMessage = document.createElement('div');
            successMessage.id = 'success-message';
            successMessage.className = 'text-center py-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg';
            successMessage.innerHTML = `
              <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg class="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-ink mb-3">Thank you!</h3>
              <p class="text-muted text-sm leading-relaxed">
                Thank you for your request.<br>
                We will get back to you within 24 hours.
              </p>
              <p class="mt-6 text-xs text-gray-400 uppercase tracking-wider">(Click anywhere or on ✕ to close)</p>
            `;
            
            const formSection = document.getElementById('form-section');
            if (formSection) {
              formSection.style.display = 'none';
            }
            
            modalContent.appendChild(successMessage);
            successMessage.addEventListener('click', closeModal);

          } else {
            throw new Error('Form submission failed');
          }
        } catch (error) {
          console.error('Form error:', error);
          submitBtn.innerHTML = 'Error. Try again';
          submitBtn.classList.add('bg-red-600');
          
          setTimeout(() => {
            submitBtn.innerHTML = `send request <svg class="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`;
            submitBtn.disabled = false;
            submitBtn.classList.remove('bg-red-600');
            isSubmitting = false; // <-- РАЗБЛОКИРОВКА ПРИ ОШИБКЕ
          }, 3000);
        }
      });
    }
  }

  loadModal();

  // ==========================================
  // КАРУСЕЛЬ ОТЗЫВОВ + DRAG-TO-SCROLL С ИНЕРЦИЕЙ
  // ==========================================
  const carousel = document.getElementById('testimonials-carousel');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (carousel && prevBtn && nextBtn) {
    const getScrollAmount = () => {
      const card = carousel.querySelector('.min-w-\\[300px\\]');
      if (!card) return 300;
      const style = window.getComputedStyle(card);
      return card.offsetWidth + parseInt(style.marginRight || 0) + 24;
    };

    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let animationId = null;

    function applyInertia() {
      if (Math.abs(velocity) < 0.5) {
        carousel.classList.remove('dragging');
        return;
      }
      velocity *= 0.95;
      carousel.scrollLeft -= velocity;
      animationId = requestAnimationFrame(applyInertia);
    }

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      hasDragged = false;
      carousel.classList.add('dragging');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      lastX = e.pageX;
      lastTime = Date.now();
      velocity = 0;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });

    carousel.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        if (Math.abs(velocity) > 0.5) {
          applyInertia();
        } else {
          carousel.classList.remove('dragging');
        }
      }
    });

    carousel.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        if (Math.abs(velocity) > 0.5) {
          applyInertia();
        } else {
          carousel.classList.remove('dragging');
        }
      }
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.2;
      
      if (Math.abs(walk) > 5) {
        hasDragged = true;
      }
      
      carousel.scrollLeft = scrollLeft - walk;

      const now = Date.now();
      const timeDelta = now - lastTime;
      if (timeDelta > 0) {
        const currentX = e.pageX;
        velocity = (lastX - currentX) / timeDelta * 15;
        lastX = currentX;
        lastTime = now;
      }
    });

    let touchStartX = 0;
    let touchScrollLeft = 0;
    let touchVelocity = 0;
    let touchLastX = 0;
    let touchLastTime = 0;
    let touchAnimationId = null;

    function applyTouchInertia() {
      if (Math.abs(touchVelocity) < 0.5) return;
      touchVelocity *= 0.95;
      carousel.scrollLeft -= touchVelocity;
      touchAnimationId = requestAnimationFrame(applyTouchInertia);
    }

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX - carousel.offsetLeft;
      touchScrollLeft = carousel.scrollLeft;
      touchLastX = e.touches[0].pageX;
      touchLastTime = Date.now();
      touchVelocity = 0;
      if (touchAnimationId) {
        cancelAnimationFrame(touchAnimationId);
        touchAnimationId = null;
      }
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - touchStartX) * 1.2;
      carousel.scrollLeft = touchScrollLeft - walk;

      const now = Date.now();
      const timeDelta = now - touchLastTime;
      if (timeDelta > 0) {
        const currentX = e.touches[0].pageX;
        touchVelocity = (touchLastX - currentX) / timeDelta * 15;
        touchLastX = currentX;
        touchLastTime = now;
      }
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      if (Math.abs(touchVelocity) > 0.5) {
        applyTouchInertia();
      }
    });

    const updateButtons = () => {
      prevBtn.style.opacity = carousel.scrollLeft > 0 ? '1' : '0.3';
      prevBtn.style.pointerEvents = carousel.scrollLeft > 0 ? 'auto' : 'none';
      
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      nextBtn.style.opacity = carousel.scrollLeft < maxScroll - 10 ? '1' : '0.3';
      nextBtn.style.pointerEvents = carousel.scrollLeft < maxScroll - 10 ? 'auto' : 'none';
    };

    carousel.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

        // ==========================================
  // ОТПРАВКА ФОРМЫ "TELL US ABOUT YOUR APARTMENT"
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    let isSubmitting = false;

    // ✅ Сохраняем ОРИГИНАЛЬНЫЙ HTML кнопки ОДИН РАЗ при загрузке
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      const formFields = document.getElementById('form-fields');
      const formHeader = document.getElementById('form-header');
      const formData = new FormData(contactForm);

      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: 'f5cafa53-60a5-45f2-ab7c-859d9ebdc24f',
            subject: 'Новая заявка "Tell us about your apartment" — Klar Studio',
            from_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
            name: `${formData.get('firstName')} ${formData.get('lastName')}`,
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message') || 'Без сообщения',
            replyto: formData.get('email')
          })
        });

        const result = await response.json();

        if (result.success) {
          contactForm.reset();

          // Скрываем заголовок, поля и кнопку
          if (formHeader) formHeader.style.display = 'none';
          if (formFields) formFields.style.display = 'none';
          submitBtn.style.display = 'none';

          // Убираем старое сообщение (защита от дублей)
          const oldMsg = contactForm.querySelector('#contact-success');
          if (oldMsg) oldMsg.remove();

          // Создаём сообщение Thank you
          const successMessage = document.createElement('div');
          successMessage.id = 'contact-success';
          successMessage.className = 'text-center py-6';
          successMessage.innerHTML = `
            <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <svg class="h-8 w-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">Thank you!</h3>
            <p class="text-neutral-400 text-sm leading-relaxed sm:text-base">
              Thank you for your request.<br>
              We will get back to you within 24 hours.
            </p>
            <button type="button" id="send-another" class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white underline hover:opacity-70 transition-opacity">
              send another message
            </button>
          `;
          contactForm.appendChild(successMessage);

          // Кнопка "send another message" возвращает ВСЁ обратно
          document.getElementById('send-another').addEventListener('click', () => {
            successMessage.remove();
            if (formHeader) formHeader.style.display = 'block';
            if (formFields) formFields.style.display = 'block';
            submitBtn.style.display = 'inline-flex';
            submitBtn.innerHTML = originalBtnHTML; // ✅ Используем сохранённый оригинал
            submitBtn.disabled = false;
            isSubmitting = false;
          });

        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Form error:', error);
        submitBtn.innerHTML = '<span class="text-red-400">Error. Try again</span>';
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.disabled = false;
          isSubmitting = false;
        }, 3000);
      }
    });
  }
// ==========================================
// FAQ АККОРДЕОН
// ==========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const toggle = item.querySelector('.faq-toggle');
  const content = item.querySelector('.faq-content');
  const icon = item.querySelector('.faq-icon');
  const verticalLine = icon?.querySelector('span:last-child');

  toggle.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Закрываем все остальные пункты
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('open');
        const otherContent = otherItem.querySelector('.faq-content');
        const otherIcon = otherItem.querySelector('.faq-icon span:last-child');
        if (otherContent) otherContent.style.maxHeight = null;
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      }
    });

    // Открываем/закрываем текущий
    if (isOpen) {
      item.classList.remove('open');
      content.style.maxHeight = null;
      verticalLine.style.transform = 'rotate(0deg)';
    } else {
      item.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
      verticalLine.style.transform = 'rotate(90deg)';
    }
  });
});


// ==========================================
// ПРОГРЕСС-БАР СКРОЛЛА
// ==========================================
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  if (docHeight > 0) {
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }
});

// ==========================================
// АВТОМАТИЧЕСКИЙ LAZY LOADING ДЛЯ ВСЕХ IMG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img:not([loading])');
  
  images.forEach((img, index) => {
    // Пропускаем первые 2 изображения на странице (обычно это hero и логотип)
    if (index < 2) return;
    
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });
});

    // ==========================================
  // ДИНАМИЧЕСКАЯ ГАЛЕРЕЯ ПРОЕКТОВ (АБСОЛЮТНО ЗАЩИЩЁННАЯ ВЕРСИЯ)
  // ==========================================
  (function initGallery() {
    const galleryImagesData = [
      { src: 'img/Project-1/project-1.webp', alt: '85 m² Altbau – Wiedikon 2024' },
      { src: 'img/Project-2/project-2.webp', alt: '1920s apartment – Enge 2023' },
      { src: 'img/Project-3/project-3.webp', alt: '3.5-room attic – Kreis 4 2025' },
      { src: 'img/Project-4/project-4.webp', alt: '22 m² Master Bedroom – Seefeld 2024' }
    ];

    const galleryContainer = document.getElementById('gallery-images');
    if (!galleryContainer) {
      console.warn('⚠️ Галерея: контейнер не найден');
      return;
    }

    // ✅ УБИВАЕМ ВСЁ СТАРОЕ
    if (window.galleryAutoPlayInterval) {
      clearInterval(window.galleryAutoPlayInterval);
      window.galleryAutoPlayInterval = null;
      console.log('🗑️ Старый интервал удалён');
    }

    // Очищаем контейнер
    galleryContainer.innerHTML = '';

    let currentIndex = 0;
    let isPlaying = false; // Флаг: играет ли автоплей

    // Создаём изображения
    galleryImagesData.forEach((img, index) => {
      const imgElement = document.createElement('img');
      imgElement.src = img.src;
      imgElement.alt = img.alt;
      imgElement.className = `absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${index === 0 ? 'opacity-100' : 'opacity-0'}`;
      imgElement.loading = 'lazy';
      imgElement.decoding = 'async';
      galleryContainer.appendChild(imgElement);
    });

    const images = galleryContainer.querySelectorAll('img');

    function goToSlide(index) {
      if (index === currentIndex) return;
      images[currentIndex].classList.remove('opacity-100');
      images[currentIndex].classList.add('opacity-0');
      currentIndex = index;
      images[currentIndex].classList.remove('opacity-0');
      images[currentIndex].classList.add('opacity-100');
      console.log(`🖼️ Слайд ${currentIndex + 1} из ${galleryImagesData.length}`);
    }

    function nextSlide() {
      goToSlide((currentIndex + 1) % galleryImagesData.length);
    }

    function prevSlide() {
      goToSlide((currentIndex - 1 + galleryImagesData.length) % galleryImagesData.length);
    }

    function startAutoPlay() {
      if (isPlaying) {
        console.log('⏸️ Автоплей уже играет, пропускаем');
        return;
      }
      
      // Убиваем старый интервал
      if (window.galleryAutoPlayInterval) {
        clearInterval(window.galleryAutoPlayInterval);
      }
      
      window.galleryAutoPlayInterval = setInterval(() => {
        console.log('⏰ Автоплей: следующий слайд');
        nextSlide();
      }, 2000);
      
      isPlaying = true;
      console.log('▶️ Автоплей запущен, ID:', window.galleryAutoPlayInterval);
    }

    function stopAutoPlay() {
      if (!isPlaying) {
        console.log('⏸️ Автоплей уже остановлен');
        return;
      }
      
      if (window.galleryAutoPlayInterval) {
        clearInterval(window.galleryAutoPlayInterval);
        window.galleryAutoPlayInterval = null;
      }
      
      isPlaying = false;
      console.log('⏹️ Автоплей остановлен');
    }

    // Обработчики мыши (только один раз)
    const gallerySection = document.getElementById('project-gallery');
    if (gallerySection && !gallerySection.dataset.galleryBound) {
      gallerySection.dataset.galleryBound = 'true';
      
      gallerySection.addEventListener('mouseenter', () => {
        console.log('🖱️ Mouse enter — пауза');
        stopAutoPlay();
      });
      
      gallerySection.addEventListener('mouseleave', () => {
        console.log('🖱️ Mouse leave — старт');
        startAutoPlay();
      });

      // Пауза при неактивной вкладке
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          console.log('👁️ Вкладка неактивна — пауза');
          stopAutoPlay();
        } else {
          console.log('👁️ Вкладка активна — старт');
          startAutoPlay();
        }
      });
    }

    // Кнопки навигации
    const galleryNext = document.getElementById('gallery-next');
    const galleryPrev = document.getElementById('gallery-prev');

    if (galleryNext && !galleryNext.dataset.bound) {
      galleryNext.dataset.bound = 'true';
      galleryNext.addEventListener('click', () => {
        console.log('👉 Клик: следующий слайд');
        nextSlide();
        stopAutoPlay();
        setTimeout(() => startAutoPlay(), 2000); // Перезапуск через 3 сек
      });
    }

    if (galleryPrev && !galleryPrev.dataset.bound) {
      galleryPrev.dataset.bound = 'true';
      galleryPrev.addEventListener('click', () => {
        console.log('👈 Клик: предыдущий слайд');
        prevSlide();
        stopAutoPlay();
        setTimeout(() => startAutoPlay(), 2000);
      });
    }

    // Запускаем автоплей
    startAutoPlay();
    console.log('✅ Галерея полностью инициализирована');
  })();

}); // <-- ЭТА скобка закрывает главный document.addEventListener("DOMContentLoaded", ...)
// ==========================================
// 🔧 ТОЧЕЧНЫЙ FIX КНОПКИ "НАВЕРХ"
// ==========================================
console.log("🔍 Скрипт кнопки наверх запущен");

window.addEventListener('scroll', function() {
    const btn = document.getElementById('scrollToTop');
    
    if (!btn) {
        console.log("⚠️ Кнопка с id='scrollToTop' не найдена в HTML");
        return;
    }

    if (window.scrollY > 300) {
        console.log("✅ Скролл > 300px, показываем кнопку");
        btn.classList.remove('opacity-0', 'pointer-events-none');
        btn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
        console.log("⬇️ Скролл < 300px, скрываем кнопку");
        btn.classList.remove('opacity-100', 'pointer-events-auto');
        btn.classList.add('opacity-0', 'pointer-events-none');
    }
});

document.addEventListener('click', function(e) {
    if (e.target.closest('#scrollToTop')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
});
initBurgerMenu();