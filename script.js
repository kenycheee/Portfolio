/* Theme Toggle (Dark/Light Mode) */
const themeToggle = document.getElementById('themeToggle');
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '🌞' : '🌙';
} catch (e) {
  themeToggle.textContent = '🌙';
}
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '🌞' : '🌙';
  try {
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  } catch (e) {}
});

/* Modal (Projects) */
function openModal(card) {
  const modal = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = card.dataset.title || '';
  document.getElementById('modalDesc').textContent = card.dataset.desc || '';
  document.getElementById('modalImg').src = card.dataset.img || '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
document.getElementById('modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

/* Modal (Experience) */
function openImageModal(src, title, desc) {
  const modal = document.getElementById('imageModal');
  document.getElementById('modalImage').src = src;
  document.getElementById('imageTitle').textContent = title;
  document.getElementById('imageDesc').textContent = desc;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeImageModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
document.getElementById('imageModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeImageModal();
});

/* Typing animation (Name) */
(function typingLoop() {
  const el = document.getElementById('name');
  const text = 'Khenichi Kuolimpo';
  let pos = 0;
  let forward = true;

  function tick() {
    if (forward) {
      pos++;
      el.textContent = text.slice(0, pos);
      if (pos >= text.length) {
        forward = false;
        return setTimeout(tick, 5000);
      }
    } else {
      pos--;
      el.textContent = text.slice(0, pos);
      if (pos <= 0) {
        forward = true;
        return setTimeout(tick, 400);
      }
    }
    setTimeout(tick, forward ? 90 : 40);
  }

  el.textContent = '';
  el.classList.add('typing');
  tick();
})();

/* Role Loop Animation */
(function roleLooper() {
  const roles = ['Web Development', 'Mobile Development', 'UI/UX Designer'];
  const el = document.getElementById('role');
  let idx = 0;

  el.textContent = roles[0];
  el.style.transition = 'opacity .45s ease, transform .45s ease';

  function swap() {
    el.style.opacity = 0;
    el.style.transform = 'translateY(6px)';
    setTimeout(() => {
      idx = (idx + 1) % roles.length;
      el.textContent = roles[idx];
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 420);
  }

  setInterval(swap, 3000);
})();

/* Skills Bar Animation */
(function prepareSkillBars() {
  const bars = document.querySelectorAll('.bar > i');
  bars.forEach(b => {
    const inline = b.getAttribute('style') || '';
    const m = inline.match(/width\s*:\s*(\d+%)/);
    const target = (m && m[1]) ? m[1] : '80%';
    b.dataset.w = target;
    b.style.width = '0%';
  });
})();

const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const bars = document.querySelectorAll('.bar > i');
      if (entry.isIntersecting) {
        bars.forEach((b, i) => {
          setTimeout(() => { b.style.width = b.dataset.w || '80%'; }, i * 120);
        });
      } else {
        bars.forEach(b => b.style.width = '0%');
      }
    });
  }, { threshold: 0.25 });
  skillsObserver.observe(skillsSection);
}

/* Fade-up Animation */
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('in', entry.isIntersecting);
  });
}, { threshold: 0.18 });
fadeEls.forEach(e => fadeObserver.observe(e));


/* Fade-in Animation */
const projectCards = document.querySelectorAll('.grid .card');
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      const idx = Array.from(projectCards).indexOf(el);
      setTimeout(() => el.classList.add('in'), idx * 90);
    } else {
      el.classList.remove('in');
    }
  });
}, { threshold: 0.22 });
projectCards.forEach(c => projectObserver.observe(c));


/* Close Esc Modal Project */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* Close Esc Modal Experience */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeImageModal();
});


/* Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 100; // tinggi header sticky
        window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
      }
    }
  });
});

/* Hamburger */
const hamburger = document.querySelector('.hamburger');
const navlinks = document.querySelector('.navlinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navlinks.classList.toggle('show');
});