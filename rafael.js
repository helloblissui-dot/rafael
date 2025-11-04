const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  if (document.body.classList.contains('light')) {
    toggleBtn.textContent = '☀️';
  } else {
    toggleBtn.textContent = '🌙';
  }
});

// 🎠 Gallery Carousel
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.gallery-section .carousel');
  if (!carousel) return; // Exit if no gallery found

  const track = carousel.querySelector('.track');
  const slides = [...track.children];
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  const dotsWrap = document.querySelector('.gallery-section .dots');

  // Create dots dynamically
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  const slideWidth = () =>
    slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);

  const getIndex = () => Math.round(track.scrollLeft / slideWidth());

  function goTo(index) {
    index = Math.max(0, Math.min(index, slides.length - 1));
    track.scrollTo({ left: index * slideWidth(), behavior: 'smooth' });
    update(index);
  }

  function update(activeIndex = getIndex()) {
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === activeIndex));
    prev.disabled = activeIndex === 0;
    next.disabled = activeIndex === slides.length - 1;
  }

  // Button controls
  prev.addEventListener('click', () => goTo(getIndex() - 1));
  next.addEventListener('click', () => goTo(getIndex() + 1));

  // Dots controls
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(getIndex() + 1);
    if (e.key === 'ArrowLeft') goTo(getIndex() - 1);
  });

  // Mouse / touch drag functionality
  let startX = 0,
    startScroll = 0,
    isDown = false;

  const start = (clientX) => {
    isDown = true;
    startX = clientX;
    startScroll = track.scrollLeft;
    track.classList.add('dragging');
  };

  const move = (clientX) => {
    if (!isDown) return;
    const dx = clientX - startX;
    track.scrollLeft = startScroll - dx;
  };

  const end = () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');
    goTo(getIndex());
  };

  // Events for drag / touch
  track.addEventListener('mousedown', (e) => start(e.clientX));
  window.addEventListener('mousemove', (e) => move(e.clientX));
  window.addEventListener('mouseup', end);

  track.addEventListener('touchstart', (e) => start(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend', end);

  // Update on scroll
  track.addEventListener('scroll', () => requestAnimationFrame(update));

  // Initialize
  update();
  window.addEventListener('resize', update);
});