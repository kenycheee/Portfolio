// preserve year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle (button icon changes) - visual only (no CSS layout change)
const themeToggle = document.getElementById('themeToggle');
// try restore saved theme
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '🌞' : '🌙';
} catch(e){ themeToggle.textContent = '🌙'; }
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '🌞' : '🌙';
  try { localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light'); } catch(e){}
});

// Modal functions (unchanged behaviour)
function openModal(card){
  const modal=document.getElementById('modal');
  document.getElementById('modalTitle').textContent = card.dataset.title || '';
  document.getElementById('modalDesc').textContent = card.dataset.desc || '';
  document.getElementById('modalImg').src = card.dataset.img || '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  const modal=document.getElementById('modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}
document.getElementById('modal').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });

// Form demo (unchanged)
function sendMessage(e){
  e.preventDefault();
  const data=new FormData(e.target);
  alert('Terima kasih, '+data.get('name')+'! Pesan kamu telah terkirim (demo).');
  e.target.reset();
}

/* =========================
    Animations & Interactions
    - keep HTML/CSS exactly as you provided
    - only JS below manipulates behavior (typing loop, role fade, skill/project appear & disappear)
    ========================= */

// 1) Make skill bars animated on enter/exit.
// The HTML had inline widths (e.g. <i style="width:90%"></i>).
// We'll store those target widths into data-w, then reset inline width to 0 so animation can occur.
(function prepareSkillBars(){
  const bars = document.querySelectorAll('.bar > i');
  bars.forEach(b => {
    // read computed width from inline style if set
    let inline = b.getAttribute('style') || '';
    // try extract number%
    const m = inline.match(/width\s*:\s*(\d+%)/);
    const target = (m && m[1]) ? m[1] : '80%';
    b.dataset.w = target;
    // reset to 0 for animation (without changing CSS rules)
    b.style.width = '0%';
    // ensure transition present (was in CSS)
  });
})();

// 2) IntersectionObserver that toggles fade-up 'in' each time element enters/leaves viewport.
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
    } else {
      entry.target.classList.remove('in');
    }
  });
}, { threshold: 0.18 });
fadeEls.forEach(e => fadeObserver.observe(e));

// 3) Project cards: when visible => add slight stagger, when not visible => remove class
const projectCards = document.querySelectorAll('.grid .card');
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if(entry.isIntersecting){
      // stagger based on position
      const idx = Array.from(projectCards).indexOf(el);
      setTimeout(()=> el.classList.add('in'), idx * 90);
    } else {
      el.classList.remove('in');
    }
  });
}, { threshold: 0.22 });
projectCards.forEach(c => projectObserver.observe(c));

// 4) Skills: when skills section visible => animate bars to their data-w; when hidden => reset to 0
const skillsSection = document.getElementById('skills');
if(skillsSection){
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const bars = document.querySelectorAll('.bar > i');
      if(entry.isIntersecting){
        bars.forEach((b, i) => {
          // stagger fill
          setTimeout(()=> { b.style.width = b.dataset.w || '80%'; }, i * 120);
        });
      } else {
        bars.forEach(b => b.style.width = '0%');
      }
    });
  }, { threshold: 0.25 });
  skillsObserver.observe(skillsSection);
}

// 5) Typing loop for name (type, pause, delete, repeat)
(function typingLoop(){
  const el = document.getElementById('name');
  const text = 'Khenichi Kuolimpo';
  let pos = 0;
  let forward = true;
  let timeoutId = null;

  function tick(){
    if(forward){
      pos++;
      el.textContent = text.slice(0,pos);
      if(pos >= text.length){
        forward = false;
        timeoutId = setTimeout(tick, 5000); // pause at end
        return;
      }
    } else {
      pos--;
      el.textContent = text.slice(0,pos);
      if(pos <= 0){
        forward = true;
        timeoutId = setTimeout(tick, 400); // pause before retyping
        return;
      }
    }
    timeoutId = setTimeout(tick, forward ? 90 : 40);
  }
  // start with empty then tick
  el.textContent = '';
  tick();
  // add caret visual (CSS already applied via .typing)
  el.classList.add('typing');
})();

// 6) Role switching with smooth fade (loop)
(function roleLooper(){
  const roles = ['Web Development','Mobile Development','UI/UX Designer'];
  const el = document.getElementById('role');
  let idx = 0;
  // ensure initial role is roles[0]
  el.textContent = roles[0];
  // function to swap with fade
  function swap(){
    // fade out
    el.style.opacity = 0;
    el.style.transform = 'translateY(6px)';
    setTimeout(()=>{
      idx = (idx + 1) % roles.length;
      el.textContent = roles[idx];
      // fade in
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 420); // match CSS transitions
  }
  // set initial style
  el.style.transition = 'opacity .45s ease, transform .45s ease';
  el.style.opacity = 1;
  el.style.transform = 'translateY(0)';
  // loop
  setInterval(swap, 3000);
})();

// 7) Make fade-up elements re-appear when scrolling up and down as requested
// (Handled by fadeObserver above because we add/remove 'in' on enter/exit)

// 8) Accessibility: close modal with Esc
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

// Smooth scroll + offset agar tidak ketutup header sticky
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 100; // tinggi header sticky kamu
        const topPos = target.offsetTop - offset;

        window.scrollTo({
          top: topPos,
          behavior: "smooth"
        });
      }
    }
  });
});

// Modal Experience
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

// Modal Projects
function openModal(card){
  const modal=document.getElementById('modal');
  document.getElementById('modalTitle').textContent = card.dataset.title || '';
  document.getElementById('modalDesc').textContent = card.dataset.desc || '';
  document.getElementById('modalImg').src = card.dataset.img || '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  const modal=document.getElementById('modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}
document.getElementById('modal').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });

// end script