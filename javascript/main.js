(function() {
  'use strict';

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  document.body.classList.add('loading');
  function hidePreloader() {
    if (preloader) {
      preloader.classList.add('hide');
      document.body.classList.remove('loading');
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      window.scrollTo(0, 0);
      setTimeout(() => preloader.remove(), 400);
    }
  }
  window.addEventListener('load', () => setTimeout(hidePreloader, 300));
  setTimeout(hidePreloader, 2500);

  // ===== HEADER SCROLL =====
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== ACTIVE NAV LINK =====
  function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // ===== SCROLL ANIMATIONS =====
  function initAnimations() {
    const animElements = document.querySelectorAll('.anim');
    if (!animElements.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-show');
          // Once animated in, lock the element so it never hides again
          // This prevents layout shifts that cause scroll jumping
          entry.target.classList.add('anim-locked');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animElements.forEach(el => observer.observe(el));
  }

  // ===== COUNTER ANIMATION (disabled - template-like) =====
  function initCounters() {
    // Counters removed per design requirements
  }

  // ===== CALENDAR =====
  function initCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const calendarMonth = document.getElementById('calendarMonth');
    const filterBtns = document.querySelectorAll('.calendar-filter');
    if (!calendarDays || !calendarMonth) return;

    const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

    let currentMonth = 5; // June (0-indexed)
    let currentYear = 2026;
    let activeFilter = 'all';

    // Training schedule data
    const schedule = {
      group: {
        1: [{name:'Кроссфит', time:'8:00'}, {name:'Бокс', time:'18:00'}],
        3: [{name:'Йога', time:'9:00'}, {name:'Кроссфит', time:'18:00'}],
        5: [{name:'Бокс', time:'8:00'}, {name:'Пилатес', time:'17:00'}, {name:'Кроссфит', time:'19:00'}],
        8: [{name:'Кроссфит', time:'8:00'}, {name:'Бокс', time:'18:00'}],
        10: [{name:'Йога', time:'9:00'}, {name:'Кроссфит', time:'18:00'}],
        12: [{name:'Бокс', time:'8:00'}, {name:'Пилатес', time:'17:00'}, {name:'Кроссфит', time:'19:00'}],
        15: [{name:'Кроссфит', time:'8:00'}, {name:'Бокс', time:'18:00'}],
        17: [{name:'Йога', time:'9:00'}, {name:'Кроссфит', time:'18:00'}],
        19: [{name:'Бокс', time:'8:00'}, {name:'Пилатес', time:'17:00'}, {name:'Кроссфит', time:'19:00'}],
        22: [{name:'Кроссфит', time:'8:00'}, {name:'Бокс', time:'18:00'}],
        24: [{name:'Йога', time:'9:00'}, {name:'Кроссфит', time:'18:00'}],
        26: [{name:'Бокс', time:'8:00'}, {name:'Пилатес', time:'17:00'}, {name:'Кроссфит', time:'19:00'}],
        29: [{name:'Кроссфит', time:'8:00'}, {name:'Бокс', time:'18:00'}],
      },
      individual: {
        2: [{name:'Персональная', time:'10:00'}],
        4: [{name:'Персональная', time:'10:00'}, {name:'Бокс инд.', time:'18:00'}],
        6: [{name:'Персональная', time:'11:00'}],
        9: [{name:'Персональная', time:'10:00'}],
        11: [{name:'Персональная', time:'10:00'}, {name:'Бокс инд.', time:'18:00'}],
        13: [{name:'Персональная', time:'11:00'}],
        16: [{name:'Персональная', time:'10:00'}],
        18: [{name:'Персональная', time:'10:00'}, {name:'Бокс инд.', time:'18:00'}],
        20: [{name:'Персональная', time:'11:00'}],
        23: [{name:'Персональная', time:'10:00'}],
        25: [{name:'Персональная', time:'10:00'}, {name:'Бокс инд.', time:'18:00'}],
        27: [{name:'Персональная', time:'11:00'}],
        30: [{name:'Персональная', time:'10:00'}],
      },
      self: {
        1: [{name:'Свободный зал', time:'6:00-23:00'}],
        2: [{name:'Свободный зал', time:'6:00-23:00'}],
        3: [{name:'Свободный зал', time:'6:00-23:00'}],
        4: [{name:'Свободный зал + Бассейн', time:'6:00-22:00'}],
        5: [{name:'Свободный зал', time:'6:00-23:00'}],
        6: [{name:'Свободный зал + Бассейн', time:'8:00-22:00'}],
        7: [{name:'Свободный зал + Бассейн + Сауна', time:'8:00-21:00'}],
        8: [{name:'Свободный зал', time:'6:00-23:00'}],
        9: [{name:'Свободный зал', time:'6:00-23:00'}],
        10: [{name:'Свободный зал', time:'6:00-23:00'}],
        11: [{name:'Свободный зал + Бассейн', time:'6:00-22:00'}],
        12: [{name:'Свободный зал', time:'6:00-23:00'}],
        13: [{name:'Свободный зал + Бассейн', time:'8:00-22:00'}],
        14: [{name:'Свободный зал + Бассейн + Сауна', time:'8:00-21:00'}],
        15: [{name:'Свободный зал', time:'6:00-23:00'}],
        16: [{name:'Свободный зал', time:'6:00-23:00'}],
        17: [{name:'Свободный зал', time:'6:00-23:00'}],
        18: [{name:'Свободный зал + Бассейн', time:'6:00-22:00'}],
        19: [{name:'Свободный зал', time:'6:00-23:00'}],
        20: [{name:'Свободный зал + Бассейн', time:'8:00-22:00'}],
        21: [{name:'Свободный зал + Бассейн + Сауна', time:'8:00-21:00'}],
        22: [{name:'Свободный зал', time:'6:00-23:00'}],
        23: [{name:'Свободный зал', time:'6:00-23:00'}],
        24: [{name:'Свободный зал', time:'6:00-23:00'}],
        25: [{name:'Свободный зал + Бассейн', time:'6:00-22:00'}],
        26: [{name:'Свободный зал', time:'6:00-23:00'}],
        27: [{name:'Свободный зал + Бассейн', time:'8:00-22:00'}],
        28: [{name:'Свободный зал + Бассейн + Сауна', time:'8:00-21:00'}],
        29: [{name:'Свободный зал', time:'6:00-23:00'}],
        30: [{name:'Свободный зал', time:'6:00-23:00'}],
      }
    };

    // Create modal element
    let modalOverlay = document.querySelector('.calendar-modal-overlay');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.className = 'calendar-modal-overlay';
      modalOverlay.innerHTML = `
        <div class="calendar-modal">
          <button class="calendar-modal-close" onclick="this.closest('.calendar-modal-overlay').classList.remove('show')">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
          <h3 id="modalTitle">Запись на тренировку</h3>
          <div class="calendar-modal-date" id="modalDate"></div>
          <div class="calendar-modal-events" id="modalEvents"></div>
        </div>
      `;
      document.body.appendChild(modalOverlay);

      // Close on overlay click
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('show');
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modalOverlay.classList.remove('show');
      });
    }

    function openBookingModal(day) {
      const monthName = months[currentMonth];
      const dateStr = `${day} ${monthName} ${currentYear}`;
      document.getElementById('modalDate').textContent = dateStr;

      let eventsHtml = '';
      const hasEvents = schedule.group[day] || schedule.individual[day] || schedule.self[day];

      if (!hasEvents) {
        eventsHtml = '<p style="color: var(--text-gray); font-size: 14px; text-align: center; padding: 20px 0;">Нет запланированных тренировок на этот день. Вы можете записаться на самостоятельную тренировку.</p>';
        eventsHtml += `<div class="calendar-modal-event" style="cursor:pointer" onclick="bookTraining('${dateStr}', 'Самостоятельная тренировка')">
          <div class="calendar-modal-event-dot" style="background: #FFE66D;"></div>
          <div class="calendar-modal-event-info">
            <div class="calendar-modal-event-name">Самостоятельная тренировка</div>
            <div class="calendar-modal-event-time">Свободный доступ 6:00–23:00</div>
          </div>
          <button class="calendar-modal-event-book">Записаться</button>
        </div>`;
      } else {
        if (activeFilter === 'all' || activeFilter === 'group') {
          if (schedule.group[day]) {
            schedule.group[day].forEach(e => {
              eventsHtml += `<div class="calendar-modal-event" style="cursor:pointer" onclick="bookTraining('${dateStr}', '${e.name}')">
                <div class="calendar-modal-event-dot" style="background: #4ECDC4;"></div>
                <div class="calendar-modal-event-info">
                  <div class="calendar-modal-event-name">${e.name}</div>
                  <div class="calendar-modal-event-time">${e.time}</div>
                </div>
                <button class="calendar-modal-event-book">Записаться</button>
              </div>`;
            });
          }
        }
        if (activeFilter === 'all' || activeFilter === 'individual') {
          if (schedule.individual[day]) {
            schedule.individual[day].forEach(e => {
              eventsHtml += `<div class="calendar-modal-event" style="cursor:pointer" onclick="bookTraining('${dateStr}', '${e.name}')">
                <div class="calendar-modal-event-dot" style="background: #FF6B6B;"></div>
                <div class="calendar-modal-event-info">
                  <div class="calendar-modal-event-name">${e.name}</div>
                  <div class="calendar-modal-event-time">${e.time}</div>
                </div>
                <button class="calendar-modal-event-book">Записаться</button>
              </div>`;
            });
          }
        }
        if (activeFilter === 'all' || activeFilter === 'self') {
          if (schedule.self[day]) {
            schedule.self[day].forEach(e => {
              eventsHtml += `<div class="calendar-modal-event" style="cursor:pointer" onclick="bookTraining('${dateStr}', '${e.name}')">
                <div class="calendar-modal-event-dot" style="background: #FFE66D;"></div>
                <div class="calendar-modal-event-info">
                  <div class="calendar-modal-event-name">${e.name}</div>
                  <div class="calendar-modal-event-time">${e.time}</div>
                </div>
                <button class="calendar-modal-event-book">Записаться</button>
              </div>`;
            });
          }
        }
      }

      document.getElementById('modalEvents').innerHTML = eventsHtml;
      modalOverlay.classList.add('show');
    }

    // Global booking function
    window.bookTraining = function(date, trainingName) {
      modalOverlay.classList.remove('show');
      showToast(`Вы записались на "${trainingName}" — ${date}. Мы свяжемся с вами для подтверждения!`, 'success');
    };

    function renderCalendar() {
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const daysInMonth = lastDay.getDate();
      let startDay = firstDay.getDay();
      startDay = startDay === 0 ? 6 : startDay - 1;

      calendarMonth.textContent = `${months[currentMonth]} ${currentYear}`;

      let html = '';
      for (let i = 0; i < startDay; i++) {
        html += '<div class="calendar-day empty"></div>';
      }

      const today = new Date();
      const todayDate = today.getDate();
      const todayMonth = today.getMonth();
      const todayYear = today.getFullYear();

      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = (day === todayDate && currentMonth === todayMonth && currentYear === todayYear);
        let events = '';
        let hasEvents = false;

        if (activeFilter === 'all' || activeFilter === 'group') {
          if (schedule.group[day]) {
            hasEvents = true;
            schedule.group[day].forEach(e => {
              events += `<div class="calendar-day-event group">${e.name} ${e.time}</div>`;
            });
          }
        }
        if (activeFilter === 'all' || activeFilter === 'individual') {
          if (schedule.individual[day]) {
            hasEvents = true;
            schedule.individual[day].forEach(e => {
              events += `<div class="calendar-day-event individual">${e.name} ${e.time}</div>`;
            });
          }
        }
        if (activeFilter === 'all' || activeFilter === 'self') {
          if (schedule.self[day]) {
            hasEvents = true;
            schedule.self[day].forEach(e => {
              events += `<div class="calendar-day-event self">${e.name}</div>`;
            });
          }
        }

        html += `<div class="calendar-day${isToday ? ' today' : ''}" data-day="${day}" onclick="openCalDay(${day})">
          <div class="calendar-day-number">${day}</div>
          ${events}
          <button class="calendar-day-book">Записаться</button>
        </div>`;
      }

      calendarDays.innerHTML = html;
    }

    // Global function to open calendar day booking
    window.openCalDay = function(day) {
      openBookingModal(day);
    };

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderCalendar();
      });
    });

    // Navigation
    const prevBtn = document.getElementById('calendarPrev');
    const nextBtn = document.getElementById('calendarNext');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar();
      });
    }

    renderCalendar();
  }

  // ===== CATALOG FILTERS =====
  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.facility-filter-card');
    const grid = document.getElementById('facilityGrid');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cards.forEach(card => {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity = '0'; card.style.transform = 'translateY(10px)';
        });
        setTimeout(() => {
          let visibleCount = 0;
          cards.forEach(card => {
            const category = card.dataset.category;
            const show = filter === 'all' || category === filter;
            card.style.display = show ? '' : 'none';
            if (show) {
              visibleCount++;
              setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, visibleCount * 60);
            }
          });
          let noResults = grid ? grid.querySelector('.no-results') : null;
          if (visibleCount === 0 && grid) {
            if (!noResults) {
              noResults = document.createElement('div'); noResults.className = 'no-results';
              noResults.innerHTML = 'Ничего не найдено.'; grid.appendChild(noResults);
            }
          } else if (noResults) { noResults.remove(); }
        }, 250);
      });
    });
    // Filter bar is NOT sticky — stays in its original position
  }

  // ===== PRICING TABS =====
  function initPricingTabs() {
    const tabs = document.querySelectorAll('.pricing-tab');
    const panels = document.querySelectorAll('.pricing-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        panels.forEach(p => {
          p.style.display = p.dataset.panel === target ? '' : 'none';
        });
      });
    });
  }

  // ===== CONTACT FORM =====
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Заявка отправлена! Мы свяжемся с вами в течение 30 минут.', 'success');
      form.reset();
    });
  }

  // ===== TOAST =====
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type || 'success'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  // ===== MAGNETIC HOVER EFFECT FOR BUTTONS =====
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .header-cta, .pricing-btn, .filter-btn.active');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.15s ease';
      });
      btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.transition = 'var(--transition)';
      });
    });
  }

  // ===== PARALLAX ON HERO =====
  function initParallax() {
    const heroImg = document.querySelector('.hero-bg img');
    if (!heroImg) return;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  // ===== CUSTOM SELECT DROPDOWNS =====
  function initCustomSelects() {
    const selects = document.querySelectorAll('.custom-select');
    if (!selects.length) return;

    selects.forEach(select => {
      const trigger = select.querySelector('.custom-select-trigger');
      const options = select.querySelectorAll('.custom-select-option');
      const hiddenInput = select.nextElementSibling;
      const triggerSpan = trigger.querySelector('span');

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other selects
        selects.forEach(s => { if (s !== select) s.classList.remove('open'); });
        select.classList.toggle('open');
      });

      options.forEach(option => {
        option.addEventListener('click', () => {
          const value = option.dataset.value;
          const text = option.textContent;
          // Update trigger text
          triggerSpan.textContent = text;
          // Update hidden input
          if (hiddenInput && hiddenInput.tagName === 'INPUT') {
            hiddenInput.value = value;
          }
          // Update selected state
          options.forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
          // Close dropdown
          select.classList.remove('open');
        });
      });
    });

    // Close all selects when clicking outside
    document.addEventListener('click', () => {
      selects.forEach(s => s.classList.remove('open'));
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initAnimations();
    initCounters();
    initCalendar();
    initFilters();
    initPricingTabs();
    initContactForm();
    initMagneticButtons();
    initParallax();
    initCustomSelects();

    // Bottom Navigation - highlight active page
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const pageMap = {
      'index.html': 'home',
      'training.html': 'home',
      'schedule.html': 'schedule',
      'facilities.html': 'home',
      'trainers.html': 'trainers',
      'pricing.html': 'pricing',
      'contacts.html': 'contacts'
    };

    bottomNavItems.forEach(item => {
      const page = item.dataset.page;
      if (pageMap[currentPage] === page) {
        item.classList.add('active');
      }
    });
  });

})();
