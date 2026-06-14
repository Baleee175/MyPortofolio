// ═══════════════════════════════════════════════
//   IQBAL JULYANSYAH — Portfolio Script v2.0
// ═══════════════════════════════════════════════

// ─── 1. Open Project Link ───────────────────────
function openProject(url) {
  if (url) window.open(url, '_blank');
}

// ─── 2. Auto Year ───────────────────────────────
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ─── 4. Hero Canvas Background ──────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const NEON  = '#00ffaa';
  const BLUE  = '#00c8ff';
  const PINK  = '#ff2d78';
  const COLS  = [NEON, BLUE, PINK];

  let W, H, pts, hexNodes, t;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
  }

  function initParticles() {
    const N = Math.floor((W * H) / 18000);
    pts = Array.from({ length: N }, () => ({
      x    : Math.random() * W,
      y    : Math.random() * H,
      vx   : (Math.random() - 0.5) * 0.35,
      vy   : (Math.random() - 0.5) * 0.35,
      r    : Math.random() * 1.6 + 0.5,
      col  : COLS[Math.floor(Math.random() * 3)],
      pulse: Math.random() * Math.PI * 2
    }));

    hexNodes = Array.from({ length: 10 }, () => ({
      x   : Math.random() * W,
      y   : Math.random() * H,
      size: Math.random() * 20 + 8,
      rot : Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.006,
      alpha: Math.random() * 0.25 + 0.05,
      col : Math.random() > 0.5 ? NEON : BLUE
    }));

    t = 0;
  }

  function drawHex(x, y, s, rot, color, alpha) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = rot + i * Math.PI / 3;
      if (i === 0) ctx.moveTo(x + s * Math.cos(a), y + s * Math.sin(a));
      else         ctx.lineTo(x + s * Math.cos(a), y + s * Math.sin(a));
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth   = 0.7;
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    // Ambient glow blobs
    const g1 = ctx.createRadialGradient(W * 0.85, H * 0.1, 0, W * 0.85, H * 0.1, W * 0.55);
    g1.addColorStop(0, 'rgba(0,255,170,0.05)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    const g2 = ctx.createRadialGradient(W * 0.1, H * 0.85, 0, W * 0.1, H * 0.85, W * 0.45);
    g2.addColorStop(0, 'rgba(0,200,255,0.04)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    // Grid
    const gs = 60;
    ctx.strokeStyle = 'rgba(0,255,170,0.035)';
    ctx.lineWidth   = 0.5;
    for (let x = 0; x < W; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Hex nodes
    hexNodes.forEach(h => {
      h.rot += h.vrot;
      drawHex(h.x, h.y, h.size, h.rot, h.col, h.alpha * (0.7 + 0.3 * Math.sin(t * 0.018 + h.x * 0.01)));
    });

    // Move particles
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.pulse += 0.025;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });

    // Connections
    const DIST = Math.min(W, H) * 0.18;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const grad = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
          grad.addColorStop(0, pts[i].col);
          grad.addColorStop(1, pts[j].col);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = (1 - d / DIST) * 0.3;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    // Particles
    pts.forEach(p => {
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
      glow.addColorStop(0, p.col);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle  = glow;
      ctx.globalAlpha = 0.35 + 0.15 * Math.sin(p.pulse);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle   = p.col;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Scanline sweep
    const sy = (t * 0.5) % H;
    const sg = ctx.createLinearGradient(0, sy - 50, 0, sy + 50);
    sg.addColorStop(0, 'transparent');
    sg.addColorStop(0.5, 'rgba(0,255,170,0.03)');
    sg.addColorStop(1, 'transparent');
    ctx.fillStyle   = sg;
    ctx.globalAlpha = 1;
    ctx.fillRect(0, sy - 50, W, 100);

    t++;
    requestAnimationFrame(frame);
  }

  resize();
  initParticles();
  frame();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
}

initHeroCanvas();
document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger Menu ──────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  const navLinks  = document.querySelectorAll('.nav-menu a');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Tutup jika klik di luar
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // ── Toggle Show More Projects ────────────────
  const toggleProjectBtn = document.getElementById('toggleProjects');
  const hiddenProjects   = document.querySelectorAll('.hidden-project');
  let projectExpanded    = false;

  if (toggleProjectBtn) {
    toggleProjectBtn.addEventListener('click', () => {
      projectExpanded = !projectExpanded;

      hiddenProjects.forEach((card, i) => {
        if (projectExpanded) {
          card.style.display = 'block';
          setTimeout(() => card.classList.add('show'), i * 60);
        } else {
          card.classList.remove('show');
          card.style.display = 'none';
        }
      });

      toggleProjectBtn.textContent = projectExpanded ? 'Show Less' : 'See All Projects';

      if (!projectExpanded) {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ── Toggle Show More Certificates ───────────
  const toggleCertBtn  = document.getElementById('toggleCertificateBtn');
  const extraCerts     = document.querySelectorAll('.extra-certificate');
  let certExpanded     = false;

  if (toggleCertBtn) {
    toggleCertBtn.addEventListener('click', () => {
      certExpanded = !certExpanded;

      extraCerts.forEach((card, i) => {
        if (certExpanded) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('show'), i * 60);
        } else {
          card.classList.remove('show');
          setTimeout(() => card.style.display = 'none', 300);
        }
      });

      toggleCertBtn.textContent = certExpanded ? '↑ Show Less' : '↓ View More';

      if (!certExpanded) {
        document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ── Back to Top ─────────────────────────────
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 400);
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Scroll Reveal ───────────────────────────
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));

  // ── Active Nav Highlight on Scroll ──────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-menu a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
    });
    navAnchors.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? '#00ffaa' : '';
    });
  });

  // ── Glitch Effect on Logo ───────────────────
  const logo = document.querySelector('.logo');

  if (logo) {
    setInterval(() => {
      logo.style.textShadow = `
        ${(Math.random() - 0.5) * 6}px 0 #00ffaa,
        ${(Math.random() - 0.5) * 6}px 0 #00c8ff
      `;
      setTimeout(() => logo.style.textShadow = '', 80);
    }, 4000);
  }

});