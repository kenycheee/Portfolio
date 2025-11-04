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
let currentSlide = 0;

function openModal(card) {
  const title = card.dataset.title;
  const desc = card.dataset.desc;
  const imgs = card.dataset.img.split(','); // bisa lebih dari 1 gambar

  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent = desc;

  const carouselInner = document.getElementById('carouselInner');
  carouselInner.innerHTML = ''; // hapus isi sebelumnya

  imgs.forEach(src => {
    const img = document.createElement('img');
    img.src = src.trim();
    img.style.display = 'none'; // semua disembunyikan dulu
    carouselInner.appendChild(img);
  });

  currentSlide = 0;
  updateCarousel();

  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function changeSlide(n) {
  const imgs = document.querySelectorAll('#carouselInner img');
  currentSlide = (currentSlide + n + imgs.length) % imgs.length;
  updateCarousel();
}

function updateCarousel() {
  const imgs = document.querySelectorAll('#carouselInner img');
  imgs.forEach((img, i) => {
    img.style.display = i === currentSlide ? 'block' : 'none';
  });
}

window.onclick = function(e) {
  const modal = document.getElementById('modal');
  if (e.target === modal) closeModal();
}

/* Modal (Experience) */
function openImageModal(imgSrc, title, desc) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("imageTitle");
  const modalDesc = document.getElementById("imageDesc");

  modal.style.display = "flex";
  modalImg.src = imgSrc;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modal.setAttribute("aria-hidden", "false");
}

function closeImageModal() {
  const modal = document.getElementById("imageModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

window.addEventListener("click", function(e) {
  const modal = document.getElementById("imageModal");
  if (e.target === modal) {
    closeImageModal();
  }
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