/* ==========================================================================
   ED-HEADS KENYA — Shared JavaScript (main.js)
   Behaviours: Nav scroll, Mobile menu, Scroll animations, Counters,
               Tab switcher, FAQ accordion, Progress bars, Exit intent,
               Places remaining, UTM capture, Smooth scroll, Payment tracking
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Nav Scroll Behaviour
     Add 'scrolled' class after 80px — CSS handles the style change
  -------------------------------------------------------------------------- */
  function initNavScroll() {
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------------------
     2. Mobile Menu
     Hamburger → slide-in panel. Close on outside click or Escape key.
  -------------------------------------------------------------------------- */
  function initMobileMenu() {
    var hamburger = document.querySelector('.hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    var overlay    = document.getElementById('menu-overlay');
    var closeBtn   = document.querySelector('.mobile-menu-close');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay)  overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* --------------------------------------------------------------------------
     3. Scroll Animations (Intersection Observer)
     .animate-on-scroll → adds 'animated' class on viewport entry
     .animate-group → children stagger via CSS delay
  -------------------------------------------------------------------------- */
  function initScrollAnimations() {
    if (!window.IntersectionObserver) return;

    var elements = document.querySelectorAll('.animate-on-scroll');
    var groups   = document.querySelectorAll('.animate-group');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
          // Free GPU layer once animation finishes
          entry.target.addEventListener('transitionend', function () {
            entry.target.style.willChange = 'auto';
          }, { once: true });
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
    groups.forEach(function (g)   { observer.observe(g); });
  }

  /* --------------------------------------------------------------------------
     4. Counter Animation
     data-counter-target="10000" → animates from 0 to value over 1.5s
     Supports suffixes: data-counter-suffix="+"
  -------------------------------------------------------------------------- */
  function easeOutQuad(t) { return t * (2 - t); }

  function animateCounter(el) {
    var target  = parseFloat(el.getAttribute('data-counter-target') || '0');
    var suffix  = el.getAttribute('data-counter-suffix') || '';
    var prefix  = el.getAttribute('data-counter-prefix') || '';
    var decimals = el.getAttribute('data-counter-decimals') ? parseInt(el.getAttribute('data-counter-decimals')) : 0;
    var duration = 1500;
    var start    = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased    = easeOutQuad(progress);
      var value    = eased * target;
      el.textContent = prefix + (decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    if (!window.IntersectionObserver) return;

    var counters = document.querySelectorAll('[data-counter-target]');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* --------------------------------------------------------------------------
     5. Tab Switcher
     .tab-btn[data-tab="X"] + .tab-content[data-tab="X"]
  -------------------------------------------------------------------------- */
  function initTabs() {
    var tabBtns     = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');
    if (!tabBtns.length) return;

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');

        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        tabContents.forEach(function (c) { c.classList.remove('active'); });

        btn.classList.add('active');
        var content = document.querySelector('.tab-content[data-tab="' + target + '"]');
        if (content) content.classList.add('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. FAQ Accordion
     Click to expand, smooth height, only one open at a time per group
  -------------------------------------------------------------------------- */
  function initAccordion() {
    var triggers = document.querySelectorAll('.accordion-trigger');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var body      = trigger.nextElementSibling;
        var isOpen    = body.classList.contains('open');
        var container = trigger.closest('.accordion-container') || document;

        // Close all in same container
        container.querySelectorAll('.accordion-body.open').forEach(function (b) {
          b.classList.remove('open');
          b.previousElementSibling.classList.remove('active');
          // GA event for close — not needed
        });
        container.querySelectorAll('.accordion-trigger.active').forEach(function (t) {
          t.classList.remove('active');
        });

        if (!isOpen) {
          body.classList.add('open');
          trigger.classList.add('active');

          // Analytics
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'faq_opened',
              question: trigger.textContent.trim()
            });
          }
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. Progress Bars
     .progress-fill[data-width="84"] → animates to width% on scroll enter
  -------------------------------------------------------------------------- */
  function initProgressBars() {
    if (!window.IntersectionObserver) return;

    var bars = document.querySelectorAll('.progress-fill[data-width]');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target.getAttribute('data-width');
          entry.target.style.width = target + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) { observer.observe(bar); });
  }

  /* --------------------------------------------------------------------------
     8. Exit Intent Popup (start.html only)
     Detect cursor leaving to top, show overlay. Session cookie prevents repeat.
  -------------------------------------------------------------------------- */
  function initExitIntent() {
    var isStartPage = document.body.getAttribute('data-page') === 'start';
    if (!isStartPage) return;

    var overlay = document.getElementById('exit-popup-overlay');
    if (!overlay) return;

    var shown = sessionStorage.getItem('edh_exit_shown');
    if (shown) return;

    var triggered = false;

    document.addEventListener('mouseleave', function (e) {
      if (e.clientY <= 5 && !triggered) {
        triggered = true;
        overlay.classList.add('visible');
        sessionStorage.setItem('edh_exit_shown', '1');
      }
    });

    // Close buttons
    overlay.querySelectorAll('[data-close-popup]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        overlay.classList.remove('visible');
      });
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.classList.remove('visible');
    });
  }

  /* --------------------------------------------------------------------------
     9. Lead Capture Modal
     btn-payment → parent form | btn-school-contact → school | btn-tutor-signup → tutor
     Submits to /api/contact (Resend → ed-heads@socialfunnel.agency + visitor confirmation)
  -------------------------------------------------------------------------- */
  var MODAL_CONFIGS = {
    parent: {
      title:   'Get started with Ed-Heads Kenya',
      sub:     'Leave your details and we\'ll be in touch within 24 hours with everything you need to get your child started.',
      fields:  [
        { name: 'name',    label: 'Full name',       type: 'text',   required: true,  placeholder: 'e.g. Wanjiku Kamau' },
        { name: 'email',   label: 'Email address',   type: 'email',  required: true,  placeholder: 'e.g. wanjiku@email.com' },
        { name: 'phone',   label: 'Phone / WhatsApp', type: 'tel',   required: true,  placeholder: 'e.g. 0712 345 678' },
        { name: 'grade',   label: 'Child\'s grade or year (optional)', type: 'text', required: false, placeholder: 'e.g. Grade 6, Form 2' },
      ],
      btnText: 'Send my details →',
      successTitle: 'We\'re on it.',
      successMsg:  'We\'ll email you within 24 hours with your subscription details and next steps.',
    },
    school: {
      title:   'Book a school demonstration',
      sub:     'Leave your details and we\'ll contact you within 24 hours to arrange a demonstration for your leadership team.',
      fields:  [
        { name: 'name',        label: 'Your name',    type: 'text',  required: true,  placeholder: 'e.g. James Otieno' },
        { name: 'school_name', label: 'School name',  type: 'text',  required: true,  placeholder: 'e.g. Nairobi Academy' },
        { name: 'role',        label: 'Your role',    type: 'text',  required: true,  placeholder: 'e.g. Head of Academics' },
        { name: 'email',       label: 'Email address', type: 'email', required: true, placeholder: 'e.g. james@school.co.ke' },
        { name: 'phone',       label: 'Phone / WhatsApp', type: 'tel', required: false, placeholder: 'e.g. 0712 345 678' },
      ],
      btnText: 'Request demonstration →',
      successTitle: 'Request received.',
      successMsg:  'Our team will contact you within 24 hours to arrange your demonstration.',
    },
    tutor: {
      title:   'Join the tutor partner programme',
      sub:     'Leave your details and we\'ll send you your referral link and commission details within 24 hours.',
      fields:  [
        { name: 'name',          label: 'Your name',     type: 'text',  required: true,  placeholder: 'e.g. Faith Njoroge' },
        { name: 'email',         label: 'Email address', type: 'email', required: true,  placeholder: 'e.g. faith@email.com' },
        { name: 'phone',         label: 'Phone / WhatsApp', type: 'tel', required: true, placeholder: 'e.g. 0712 345 678' },
        { name: 'student_count', label: 'Approx. students you teach (optional)', type: 'text', required: false, placeholder: 'e.g. 12 students' },
      ],
      btnText: 'Join the programme →',
      successTitle: 'Welcome.',
      successMsg:  'We\'ll email your referral link and full commission details within 24 hours.',
    },
  };

  function buildModalHTML() {
    return '<div class="lead-modal-overlay" id="lead-modal" role="dialog" aria-modal="true">' +
      '<div class="lead-modal">' +
        '<button class="lead-modal-close" aria-label="Close" id="lead-modal-close">&#x2715;</button>' +
        '<h3 id="modal-title"></h3>' +
        '<p class="lead-modal-sub" id="modal-sub"></p>' +
        '<form id="lead-form" novalidate></form>' +
        '<div class="lead-modal-success" id="lead-success" style="display:none">' +
          '<div class="lead-success-check">&#10003;</div>' +
          '<h4 id="success-title"></h4>' +
          '<p id="success-sub"></p>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderForm(config) {
    return config.fields.map(function (f) {
      return '<div class="lead-form-group">' +
        '<label for="lf-' + f.name + '">' + f.label + (f.required ? ' *' : '') + '</label>' +
        '<input type="' + f.type + '" id="lf-' + f.name + '" name="' + f.name + '"' +
          ' placeholder="' + f.placeholder + '"' +
          (f.required ? ' required' : '') + '>' +
      '</div>';
    }).join('') +
    '<p class="lead-modal-error" id="lead-error">Please fill in all required fields.</p>' +
    '<button type="submit" class="btn-primary lead-modal-submit" id="lead-submit">' + config.btnText + '</button>';
  }

  function initLeadModal() {
    document.body.insertAdjacentHTML('beforeend', buildModalHTML());
    var overlay   = document.getElementById('lead-modal');
    var closeBtn  = document.getElementById('lead-modal-close');
    var title     = document.getElementById('modal-title');
    var sub       = document.getElementById('modal-sub');
    var form      = document.getElementById('lead-form');
    var success   = document.getElementById('lead-success');
    var succTitle = document.getElementById('success-title');
    var succSub   = document.getElementById('success-sub');
    var currentType = null;

    function openModal(type) {
      var cfg = MODAL_CONFIGS[type];
      if (!cfg) return;
      currentType = type;
      title.textContent = cfg.title;
      sub.textContent   = cfg.sub;
      form.innerHTML    = renderForm(cfg);
      form.style.display  = '';
      success.style.display = 'none';
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      var firstInput = form.querySelector('input');
      if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);
    }

    function closeModal() {
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    // Intercept CTA buttons
    document.querySelectorAll('.btn-payment').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openModal('parent'); });
    });
    document.querySelectorAll('.btn-school-contact').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openModal('school'); });
    });
    document.querySelectorAll('.btn-tutor-signup').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openModal('tutor'); });
    });

    // Form submit
    overlay.addEventListener('submit', function (e) {
      if (e.target.id !== 'lead-form') return;
      e.preventDefault();
      var cfg       = MODAL_CONFIGS[currentType];
      var errEl     = document.getElementById('lead-error');
      var submitBtn = document.getElementById('lead-submit');
      var data      = { form_type: currentType };
      var valid     = true;

      cfg.fields.forEach(function (f) {
        var el = document.getElementById('lf-' + f.name);
        data[f.name] = el ? el.value.trim() : '';
        if (f.required && !data[f.name]) valid = false;
      });

      if (!valid) { errEl.style.display = 'block'; return; }
      errEl.style.display = 'none';
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Sending...';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) {
          form.style.display = 'none';
          succTitle.textContent = cfg.successTitle;
          succSub.textContent   = cfg.successMsg;
          success.style.display = '';
          // Analytics
          if (typeof fbq === 'function') {
            if (currentType === 'parent') fbq('track', 'Lead', { content_name: 'parent_subscribe' });
            if (currentType === 'school') fbq('track', 'Lead', { content_name: 'school_inquiry' });
            if (currentType === 'tutor')  fbq('track', 'Lead', { content_name: 'tutor_partner' });
          }
        } else {
          submitBtn.classList.remove('loading');
          submitBtn.textContent = cfg.btnText;
          errEl.textContent = 'Something went wrong. Please WhatsApp us directly.';
          errEl.style.display = 'block';
        }
      })
      .catch(function () {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = cfg.btnText;
        errEl.textContent = 'Something went wrong. Please WhatsApp us directly.';
        errEl.style.display = 'block';
      });
    });
  }

  /* --------------------------------------------------------------------------
     10. UTM Parameter Capture
     Read from URL → sessionStorage → append to payment links on click
  -------------------------------------------------------------------------- */
  function initUTMCapture() {
    var params = new URLSearchParams(window.location.search);
    var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var stored  = {};

    utmKeys.forEach(function (key) {
      var val = params.get(key);
      if (val) {
        sessionStorage.setItem(key, val);
        stored[key] = val;
      } else {
        var saved = sessionStorage.getItem(key);
        if (saved) stored[key] = saved;
      }
    });

    // Append UTMs to all payment / CTA links on click
    document.querySelectorAll('.btn-payment').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#' || href.startsWith('{{')) return;
        try {
          var url    = new URL(href, window.location.origin);
          Object.keys(stored).forEach(function (k) { url.searchParams.set(k, stored[k]); });
          link.setAttribute('href', url.toString());
        } catch (_) {}
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. Smooth Scroll
     All anchor links with 80px nav offset
  -------------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id  = anchor.getAttribute('href').slice(1);
        var el  = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        var offset = 88;
        var top    = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* --------------------------------------------------------------------------
     12. Payment Link Tracking
     Fire fbq InitiateCheckout on .btn-payment click
     Fire fbq Lead on school / tutor CTA clicks
  -------------------------------------------------------------------------- */
  function initPaymentTracking() {
    function safeFbq(event, params) {
      if (typeof fbq === 'function') fbq('track', event, params);
    }

    document.querySelectorAll('.btn-payment').forEach(function (el) {
      el.addEventListener('click', function () {
        safeFbq('InitiateCheckout', { value: 2000, currency: 'KES', content_name: 'ed-heads-kenya-subscription' });
      });
    });

    document.querySelectorAll('.btn-school-contact').forEach(function (el) {
      el.addEventListener('click', function () {
        safeFbq('Lead', { content_name: 'school_inquiry' });
      });
    });

    document.querySelectorAll('.btn-tutor-signup').forEach(function (el) {
      el.addEventListener('click', function () {
        safeFbq('Lead', { content_name: 'tutor_partner' });
      });
    });
  }


  /* --------------------------------------------------------------------------
     Boot — run all initialisers on DOMContentLoaded
  -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initNavScroll();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initTabs();
    initAccordion();
    initProgressBars();
    initExitIntent();
    initLeadModal();
    initUTMCapture();
    initSmoothScroll();
    initPaymentTracking();
  });

})();
