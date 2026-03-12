// ═══════════════════════════════════════════
// LANGUAGE SYSTEM
// ═══════════════════════════════════════════
var currentLang = localStorage.getItem('releted_lang') || 'en';

function applyTranslations(lang) {
  var t = translations[lang];
  if (!t) return;
  currentLang = lang;
  localStorage.setItem('releted_lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });

  var names = { en:'EN', ua:'UA', ru:'RU', pl:'PL', de:'DE' };
  var txt = document.getElementById('langCurrentText');
  if (txt) txt.textContent = names[lang] || 'EN';

  document.querySelectorAll('.lang-option').forEach(function(o) {
    o.classList.toggle('active', o.getAttribute('data-lang') === lang);
  });
  document.querySelectorAll('.mobile-lang-btn').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });
  document.documentElement.lang = lang;
}

applyTranslations(currentLang);

// Desktop switcher
var langSwitcher = document.getElementById('langSwitcher');
document.getElementById('langCurrent').addEventListener('click', function(e) {
  e.stopPropagation();
  langSwitcher.classList.toggle('open');
});
document.querySelectorAll('.lang-option').forEach(function(o) {
  o.addEventListener('click', function() {
    applyTranslations(this.getAttribute('data-lang'));
    langSwitcher.classList.remove('open');
  });
});
document.addEventListener('click', function() { langSwitcher.classList.remove('open'); });

// Mobile switcher
document.querySelectorAll('.mobile-lang-btn').forEach(function(b) {
  b.addEventListener('click', function() { applyTranslations(this.getAttribute('data-lang')); });
});

// ═══════════════════════════════════════════
// NAVBAR SCROLL + ACTIVE LINK
// ═══════════════════════════════════════════
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  var pos = window.scrollY + 100;
  document.querySelectorAll('section[id]').forEach(function(s) {
    var link = document.querySelector('.nav-link[href="#' + s.id + '"]');
    if (link) link.classList.toggle('active', pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight);
  });
}, { passive: true });

// ═══════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════
var navToggle  = document.getElementById('navToggle');
var mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', function() {
  navToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-nav-link').forEach(function(l) {
  l.addEventListener('click', function() {
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ═══════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ═══════════════════════════════════════════
// CURSOR GLOW
// ═══════════════════════════════════════════
var cursorGlow = document.getElementById('cursorGlow');
var mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });
(function tick() {
  cx += (mx - cx) * 0.08;
  cy += (my - cy) * 0.08;
  cursorGlow.style.left = cx + 'px';
  cursorGlow.style.top  = cy + 'px';
  requestAnimationFrame(tick);
})();

// ═══════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════
var pCont = document.getElementById('particles');
function spawnParticle() {
  var p = document.createElement('div');
  p.className = 'particle' + (Math.random() > 0.8 ? ' large' : '');
  var s = parseFloat(p.className.indexOf('large') > -1 ? Math.random()*12+8 : Math.random()*4+1).toFixed(1);
  p.style.cssText = 'width:'+s+'px;height:'+s+'px;left:'+Math.random()*100+'%;animation-duration:'+(Math.random()*12+8)+'s;animation-delay:'+Math.random()*8+'s';
  pCont.appendChild(p);
  setTimeout(function() { p.remove(); }, 25000);
}
for (var i = 0; i < 20; i++) spawnParticle();
setInterval(spawnParticle, 1200);

// ═══════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════
var aObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    var el = e.target;
    var d  = parseInt(el.getAttribute('data-delay') || 0);
    setTimeout(function() { el.classList.add('animated'); }, d);
    aObs.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('[data-animate]').forEach(function(el) { aObs.observe(el); });

// ═══════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════
var cObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    var el  = e.target;
    var end = parseInt(el.getAttribute('data-count'));
    var sfx = el.getAttribute('data-suffix') || '';
    var t0  = performance.now();
    (function frame(now) {
      var p   = Math.min((now - t0) / 1500, 1);
      var val = Math.floor((1 - Math.pow(1-p, 3)) * end);
      el.textContent = val + sfx;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = end + sfx;
    })(t0);
    cObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(function(el) { cObs.observe(el); });

// ═══════════════════════════════════════════
// COUNTDOWN
// ═══════════════════════════════════════════
var release = new Date('2026-07-06T00:00:00');
function updateCountdown() {
  var diff = release - Date.now();
  if (diff <= 0) {
    document.getElementById('countdownGrid').style.display = 'none';
    document.getElementById('countdownMessage').classList.add('show');
    return;
  }
  document.getElementById('cdDays').textContent    = String(Math.floor(diff / 86400000)).padStart(3,'0');
  document.getElementById('cdHours').textContent   = String(Math.floor(diff % 86400000 / 3600000)).padStart(2,'0');
  document.getElementById('cdMinutes').textContent = String(Math.floor(diff % 3600000 / 60000)).padStart(2,'0');
  document.getElementById('cdSeconds').textContent = String(Math.floor(diff % 60000 / 1000)).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ═══════════════════════════════════════════
// GALLERY + LIGHTBOX
// ═══════════════════════════════════════════
var galleryData = [
  { src: 'screenshot1.png', label: 'Screenshot 1' },
  { src: 'screenshot2.png', label: 'Screenshot 2' },
  { src: 'screenshot3.png', label: 'Screenshot 3' }
];
var lightbox   = document.getElementById('lightbox');
var lbImg      = document.getElementById('lightboxImg');
var lbCounter  = document.getElementById('lightboxCounter');
var lbIdx      = 0;

function openLB(i) {
  lbIdx = i;
  lbImg.src = galleryData[i].src;
  lbImg.alt = galleryData[i].label;
  lbCounter.textContent = (i+1) + ' / ' + galleryData.length;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLB() { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
function navLB(d) { openLB((lbIdx + d + galleryData.length) % galleryData.length); }

document.querySelectorAll('.gallery-slot').forEach(function(s) {
  s.addEventListener('click', function() { openLB(parseInt(this.getAttribute('data-gallery'))); });
});
document.getElementById('lightboxClose').addEventListener('click', closeLB);
document.getElementById('lightboxPrev').addEventListener('click', function() { navLB(-1); });
document.getElementById('lightboxNext').addEventListener('click', function() { navLB(1); });
lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLB(); });
document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLB();
  if (e.key === 'ArrowLeft')   navLB(-1);
  if (e.key === 'ArrowRight')  navLB(1);
});

// ═══════════════════════════════════════════
// ROUND CALCULATOR
// ═══════════════════════════════════════════
document.getElementById('calcBtn').addEventListener('click', function() {
  var kr = parseInt(document.getElementById('calcKillsRepair').value) || 0;
  var rep = document.getElementById('calcRepaired').value;
  var ka  = parseInt(document.getElementById('calcKillsAfter').value) || 0;

  var repTime   = Math.max(0, 165 - kr * 22.5);
  var afterTime = rep === 'yes' ? 60 + ka * 22.5 : 120 + ka * 22.5;
  var afterLabel = rep === 'yes' ? 'Hunt Phase' : 'Rage Phase';
  var total = Math.floor(repTime + afterTime);

  function fmt(s) { return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0'); }

  document.getElementById('calcResultValue').textContent = fmt(total);
  document.getElementById('calcResultDetail').innerHTML =
    '⏱ Repair: ' + fmt(repTime) + '<br>' +
    '🔥 ' + afterLabel + ': ' + fmt(afterTime) + '<br>' +
    '💀 Total kills: ' + (kr + ka);
  document.getElementById('calcResult').classList.add('show');
});

// ═══════════════════════════════════════════
// FAQ ACCORDION
// ═══════════════════════════════════════════
document.querySelectorAll('.faq-question').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item   = this.closest('.faq-item');
    var answer = item.querySelector('.faq-answer');
    var wasOpen = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(function(i) {
      i.classList.remove('active');
      i.querySelector('.faq-answer').style.maxHeight = '0';
    });

    if (!wasOpen) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ═══════════════════════════════════════════
// MUSIC PLAYER
// ═══════════════════════════════════════════
var audio       = new Audio('Normal_LMS_Music.mp3');
audio.loop      = true;
audio.volume    = 0.7;
var isPlaying   = false;
var playBtn     = document.getElementById('playBtn');
var playIcon    = document.getElementById('playIcon');
var progFill    = document.getElementById('progressFill');
var progBar     = document.getElementById('progressBar');
var curTimeEl   = document.getElementById('currentTime');
var totTimeEl   = document.getElementById('totalTime');
var volSlider   = document.getElementById('volumeSlider');
var musicBars   = document.querySelectorAll('.music-bar');

function fmtTime(s) { return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0'); }

function setPlay(state) {
  isPlaying = state;
  musicBars.forEach(function(b) { b.classList.toggle('active', state); });
  playIcon.innerHTML = state
    ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
    : '<path d="M8 5v14l11-7z"/>';
}

playBtn.addEventListener('click', function() {
  if (isPlaying) { audio.pause(); setPlay(false); }
  else { audio.play().catch(function(){}); setPlay(true); }
});
document.getElementById('restartBtn').addEventListener('click', function() {
  audio.currentTime = 0;
  if (!isPlaying) { audio.play().catch(function(){}); setPlay(true); }
});
document.getElementById('stopBtn').addEventListener('click', function() {
  audio.pause(); audio.currentTime = 0; setPlay(false);
});
audio.addEventListener('timeupdate', function() {
  if (!audio.duration) return;
  progFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
  curTimeEl.textContent = fmtTime(audio.currentTime);
});
audio.addEventListener('loadedmetadata', function() { totTimeEl.textContent = fmtTime(audio.duration); });
progBar.addEventListener('click', function(e) {
  var r = progBar.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});
volSlider.addEventListener('input', function() { audio.volume = this.value / 100; });

// ═══════════════════════════════════════════
// OBSERVER GLITCH ON SCROLL
// ═══════════════════════════════════════════
var obSection  = document.getElementById('observerSection');
var lastGlitch = 0;
window.addEventListener('scroll', function() {
  if (!obSection) return;
  var r   = obSection.getBoundingClientRect();
  var now = Date.now();
  if (r.top < window.innerHeight && r.bottom > 0 && now - lastGlitch > 3000) {
    lastGlitch = now;
    obSection.classList.add('glitch-active');
    setTimeout(function() { obSection.classList.remove('glitch-active'); }, 400);
  }
}, { passive: true });

// ═══════════════════════════════════════════
// HERO LETTERS HOVER
// ═══════════════════════════════════════════
document.querySelectorAll('.title-letter').forEach(function(l) {
  l.addEventListener('mouseenter', function() {
    var colors = ['#ff0000','#ff4444','#cc0000','#ff6666'];
    var el = this;
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    setTimeout(function() { el.style.color = ''; }, 300);
  });
});

console.log('%c🩸 RELETED', 'color:#dc2626;font-size:22px;font-weight:bold;');
console.log('%cDeveloped by Spark of Hope Games', 'color:#a3a3a3;font-size:12px;');