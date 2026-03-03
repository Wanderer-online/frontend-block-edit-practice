document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.videoCarousel-wrapper').forEach(wrapper => {
    const scrollers = wrapper.querySelectorAll('.videoCarousel-slider-blocks');
    if (!scrollers.length) return;

    const parentSection =
      wrapper.closest('.video-carousel-section') || wrapper.parentElement;

    const prevButtons = parentSection
      ? [...parentSection.querySelectorAll('.carousel-btn.prev')]
      : [];
    const nextButtons = parentSection
      ? [...parentSection.querySelectorAll('.carousel-btn.next')]
      : [];

    if (!prevButtons.length || !nextButtons.length) return;

    scrollers.forEach(scroller => {
      initScroller(scroller, prevButtons, nextButtons, wrapper);
    });
  });
});

/* =========================
   SCROLLER INITIALIZATION
========================= */

function initScroller(scroller, prevButtons, nextButtons, wrapper) {
  let isMouseDown = false;
  let isDragging = false;
  let wasDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let initialScrollLeft = 0;
  let rafId = null;

  /* ---------- Helpers ---------- */

  const getGap = () => {
    const style = getComputedStyle(scroller);
    return parseFloat(style.columnGap || style.gap || 0) || 0;
  };

  const getScrollAmount = () => {
    const first = scroller.querySelector('.positive-review-video');
    return first
      ? Math.ceil(first.getBoundingClientRect().width + getGap())
      : 300;
  };

  const atStart = () => scroller.scrollLeft <= 1;
  const atEnd = () =>
    scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 1;

  const updateButtons = () => {
    prevButtons.forEach(btn => (btn.disabled = atStart()));
    nextButtons.forEach(btn => (btn.disabled = atEnd()));
  };

  /* ---------- Mouse Down ---------- */

  scroller.addEventListener('mousedown', e => {
    if (e.target.closest('.carousel-btn')) return;

    isMouseDown = true;
    isDragging = false;
    wasDragging = false;

    startX = e.pageX;
    initialScrollLeft = scroller.scrollLeft;
    scrollLeft = scroller.scrollLeft;

    if (e.target.tagName === 'IMG') e.preventDefault();
  });

  /* ---------- Mouse Move ---------- */

  document.addEventListener('mousemove', e => {
    if (!isMouseDown) return;

    const diff = Math.abs(e.pageX - startX);

    if (!isDragging && diff > 5) {
      isDragging = true;
      wasDragging = true;
      scroller.style.cursor = 'grabbing';
      scroller.style.userSelect = 'none';
      startX = e.pageX;
      scrollLeft = initialScrollLeft;
    }

    if (!isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      const walk = (e.pageX - startX) * 2;
      scroller.scrollLeft = scrollLeft - walk;
      rafId = null;
    });
  });

  /* ---------- Mouse Up / Leave ---------- */

  const stopDragging = e => {
    if (!isDragging) {
      isMouseDown = false;
      return;
    }

    isDragging = false;
    isMouseDown = false;

    scroller.style.cursor = 'grab';
    scroller.style.userSelect = '';

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    updateButtons();

    e?.preventDefault();
    e?.stopPropagation();

    setTimeout(() => (wasDragging = false), 100);
  };

  document.addEventListener('mouseup', stopDragging);
  scroller.addEventListener('mouseleave', stopDragging);

  /* ---------- Click prevention ---------- */

  scroller.addEventListener(
    'click',
    e => {
      if (wasDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  /* ---------- Buttons ---------- */

  prevButtons.forEach(btn =>
    btn.addEventListener('click', () => {
      scroller.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth',
      });
      setTimeout(updateButtons, 300);
    })
  );

  nextButtons.forEach(btn =>
    btn.addEventListener('click', () => {
      scroller.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth',
      });
      setTimeout(updateButtons, 300);
    })
  );

  /* ---------- Misc ---------- */

  scroller.style.cursor = 'grab';

  scroller.querySelectorAll('img').forEach(img => {
    img.draggable = false;
    img.addEventListener('dragstart', e => e.preventDefault());
  });

  scroller.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);

  updateButtons();
  requestAnimationFrame(updateButtons);
}