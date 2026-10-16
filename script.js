/**
 * OUR LITTLE DATE - SCRIPT.JS
 * 2-Screen Flow Architecture:
 * - Màn 1: Thiệp mời (Screen Envelope)
 * - Màn 2: Lịch trình & Tương tác bên trong (Screen Timeline)
 * Background Canvas Particles & Ambient Glowing Orbs matched from F:\timeline
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScreenTransitions();
  initScrollReveal();
  initChoiceInteractions();
});

/* ==========================================================================
   1. Canvas Particles (Hearts & Sparkles) - Matched from F:\timeline
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 1.2 + 0.4;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.opacity = Math.random() * 0.5 + 0.15;
      this.isHeart = Math.random() > 0.6; // 40% trái tim, 60% đốm sáng tròn
      this.color = this.isHeart ? "#ff8fa3" : "#ffd166";
      this.wobble = Math.random() * Math.PI;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.y -= this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.5 + this.speedX;

      if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.isHeart) {
        const size = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(
          this.x - size / 2, this.y - size / 2,
          this.x - size, this.y + size / 3,
          this.x, this.y + size
        );
        ctx.bezierCurveTo(
          this.x + size, this.y + size / 3,
          this.x + size / 2, this.y - size / 2,
          this.x, this.y
        );
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  const particleCount = 42;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ========================================================
   2. SCREEN TRANSITIONS: MÀN 1 (THIỆP) <-> MÀN 2 (TIMELINE)
======================================================== */
function initScreenTransitions() {
  const screenEnvelope = document.getElementById('screenEnvelope');
  const screenTimeline = document.getElementById('screenTimeline');
  const openBtn = document.getElementById('openInviteBtn');
  const backBtn = document.getElementById('backToEnvelopeBtn');

  if (!screenEnvelope || !screenTimeline || !openBtn) return;

  // Khi nhấn nút "Mở lời mời" ở Màn 1
  openBtn.addEventListener('click', () => {
    openBtn.textContent = 'Đang mở lời mời...';
    screenEnvelope.classList.add('exiting');

    setTimeout(() => {
      screenEnvelope.classList.remove('active');
      screenEnvelope.classList.remove('exiting');
      screenEnvelope.style.display = 'none';

      // Chuyển sang Màn 2
      screenTimeline.style.display = 'block';
      screenTimeline.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'instant' });

      // Kích hoạt animation reveal cho các phần tử trong màn 2
      const reveals = screenTimeline.querySelectorAll('.reveal');
      reveals.forEach(el => el.classList.add('is-visible'));
    }, 320);
  });

  // Khi nhấn nút "Xem lại thiệp" ở Màn 2
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      screenTimeline.classList.remove('active');

      setTimeout(() => {
        screenTimeline.style.display = 'none';

        screenEnvelope.style.display = 'flex';
        void screenEnvelope.offsetWidth;
        screenEnvelope.classList.add('active');

        openBtn.textContent = 'Mở lời mời';
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 350);
    });
  }
}

/* ========================================================
   3. SCROLL REVEAL (INTERSECTION OBSERVER)
======================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ========================================================
   4. INTERACTION: THẾ, CHỊ THẤY KẾ HOẠCH NÀY THẾ NÀO?
======================================================== */
function initChoiceInteractions() {
  const buttons = document.querySelectorAll('.choice-btn');
  const responseBox = document.getElementById('responseBox');
  const responseTitle = document.getElementById('responseTitle');
  const responseMessage = document.getElementById('responseMessage');

  const acceptBtn = document.querySelector('.choice-accept');
  const rejectBtn = document.querySelector('.choice-consider');

  if (!buttons.length || !responseBox) return;

  const responses = {
    yes: {
      title: 'Tuyệtttt! Vậy hẹn chị Chủ Nhật ạ.',
      message: 'Em háo hức lắm roiii :)))'
    },
    adjust: {
      title: 'Dạ được chứ, chị muốn đổi địa điểm, món ăn hay lịch trình? Hai chị em mình cùng chọn nhé!',
      message: 'Chị thích quán cafe khác, món ăn khác hay muốn đổi sang khung giờ hoặc ngày khác cứ nhắn em nhé. Quan trọng nhất là chị thấy thoải mái.'
    }
  };

  // ----------------------------------------------------
  // Nút từ chối không thể bấm (Runaway / Dodge Button)
  // ----------------------------------------------------
  if (rejectBtn) {
    const funnyTexts = [
      'Nút này bị kẹt rùi ạ',
      'Không được từ chối đâu nè',
      'Chị đừng né nữa mà',
      'Thôi chị đi cùng em đi',
      'Bấm nút trên thui chị ơi',
      'Em chuẩn bị chu đáo lắm đó'
    ];

    let dodgeCount = 0;
    let currentX = 0;
    let currentY = 0;

    function dodge(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      dodgeCount++;

      // Đổi chữ trên nút từ chối một cách duyên dáng
      const textIndex = (dodgeCount - 1) % funnyTexts.length;
      rejectBtn.textContent = funnyTexts[textIndex];
      rejectBtn.classList.add('dodging');

      // Nút "Đi thui nè" to dần lên để chị bấm
      if (acceptBtn) {
        const scale = Math.min(1 + dodgeCount * 0.08, 1.35);
        acceptBtn.style.setProperty('--btn-scale', scale);
        acceptBtn.style.transform = `scale(${scale})`;
        acceptBtn.classList.remove('grow-pulse');
        void acceptBtn.offsetWidth;
        acceptBtn.classList.add('grow-pulse');
      }

      // Tính toạ độ nhảy ngẫu nhiên trong vùng nhìn thấy
      const rect = rejectBtn.getBoundingClientRect();
      const origLeft = rect.left - currentX;
      const origRight = rect.right - currentX;
      const origTop = rect.top - currentY;
      const origBottom = rect.bottom - currentY;

      // Giới hạn an toàn trong viewport
      const minX = Math.max(-130, 20 - origLeft);
      const maxX = Math.min(130, (window.innerWidth - 20) - origRight);
      const minY = Math.max(-90, 80 - origTop);
      const maxY = Math.min(90, (window.innerHeight - 40) - origBottom);

      let newX = 0;
      let newY = 0;
      let attempts = 0;

      // Nhảy cách vị trí cũ tối thiểu 65px
      do {
        newX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        newY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        attempts++;
      } while (
        attempts < 15 &&
        Math.hypot(newX - currentX, newY - currentY) < 65
      );

      currentX = newX;
      currentY = newY;
      rejectBtn.style.transform = `translate(${newX}px, ${newY}px)`;
    }

    // Né khi di chuột tới (Desktop)
    rejectBtn.addEventListener('mouseenter', dodge);

    // Né khi chạm tay (Mobile / Touch)
    rejectBtn.addEventListener('touchstart', dodge, { passive: false });
    rejectBtn.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        dodge(e);
      }
    });

    // Chặn hoàn toàn click vào nút từ chối
    rejectBtn.addEventListener('click', (e) => {
      dodge(e);
    });
  }

  // ----------------------------------------------------
  // Xử lý các lựa chọn hợp lệ (Đi thui nè & Đổi một chút)
  // ----------------------------------------------------
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-choice');
      if (choice === 'think') return; // Chặn nút từ chối

      const data = responses[choice];
      if (!data) return;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (choice === 'yes' && rejectBtn) {
        rejectBtn.style.transform = 'translate(0, 0)';
      }

      responseTitle.textContent = data.title;
      responseMessage.textContent = data.message;

      responseBox.classList.add('show');

      setTimeout(() => {
        responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    });
  });
}
