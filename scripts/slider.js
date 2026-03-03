// Positive reviews carousel: center overlay controls and hide at edges
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.positive-reviews-video-wrapper').forEach(wrapper => {
      const scroller = wrapper.querySelector('.positive-reviews-video-blocks');
      const prev = wrapper.querySelector('.carousel-btn.prev');
      const next = wrapper.querySelector('.carousel-btn.next');
      if (!scroller || !prev || !next) return;
      
      // Mouse drag functionality for desktop
      let isDragging = false;
      let isMouseDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let initialScrollLeft = 0;
      let wasDragging = false; // Track if dragging occurred to prevent click events
      let rafId = null;
      
      scroller.addEventListener('mousedown', (e) => {
        // Don't start dragging if clicking directly on a carousel button
        if (e.target.closest('.carousel-btn')) return;
        
        isMouseDown = true;
        wasDragging = false;
        startX = e.pageX;
        initialScrollLeft = scroller.scrollLeft;
        scrollLeft = scroller.scrollLeft;
      });
      
      scroller.addEventListener('mouseleave', () => {
        if (isDragging) {
          isDragging = false;
          scroller.style.cursor = 'grab';
          scroller.style.userSelect = '';
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          updateButtons();
        }
        isMouseDown = false;
      });
      
      const handleMouseUp = (e) => {
        if (isDragging) {
          isDragging = false;
          scroller.style.cursor = 'grab';
          scroller.style.userSelect = '';
          wasDragging = true;
          e.preventDefault();
          e.stopPropagation();
          
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          
          // Update buttons after dragging ends
          updateButtons();
          
          // Prevent click events on videos after dragging
          setTimeout(() => {
            wasDragging = false;
          }, 100);
        } else {
          wasDragging = false;
        }
        isMouseDown = false;
      };
      
      const handleMouseMove = (e) => {
        if (!isMouseDown) return;
        
        const x = e.pageX;
        const diff = Math.abs(x - startX);
        
        // Only start dragging if mouse moved more than 5px (prevents accidental drag on clicks)
        if (!isDragging && diff > 5) {
          isDragging = true;
          wasDragging = true;
          scroller.style.cursor = 'grabbing';
          scroller.style.userSelect = 'none';
          // Recalculate start position when dragging actually starts
          startX = x;
          scrollLeft = initialScrollLeft;
        }
        
        if (isDragging) {
          e.preventDefault();
          e.stopPropagation();
          
          // Cancel previous animation frame
          if (rafId) {
            cancelAnimationFrame(rafId);
          }
          
          // Use requestAnimationFrame for smooth scrolling
          rafId = requestAnimationFrame(() => {
            const walk = (x - startX) * 2; // Scroll speed multiplier
            scroller.scrollLeft = scrollLeft - walk;
            rafId = null;
          });
        }
      };
      
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
      
      // Prevent video clicks after dragging
      scroller.addEventListener('click', (e) => {
        if (wasDragging && (e.target.closest('video') || e.target.closest('.play-btn'))) {
          e.preventDefault();
          e.stopPropagation();
          wasDragging = false;
        }
      }, true); // Use capture phase to intercept before video handlers
      
      // Set initial cursor style
      scroller.style.cursor = 'grab';
      
      function getGap() {
        const style = window.getComputedStyle(scroller);
        const gap = parseFloat(style.columnGap || style.gap || '0');
        return isNaN(gap) ? 0 : gap;
      }
      function getScrollAmount() {
        const first = scroller.querySelector('.positive-review-video');
        if (first) {
          const rect = first.getBoundingClientRect();
          return Math.ceil(rect.width + getGap()) || 300;
        }
        return 300;
      }
      function atStart() { return Math.round(scroller.scrollLeft) <= 1; }
      function atEnd() {
        const maxScroll = scroller.scrollWidth - scroller.clientWidth - 1;
        return Math.round(scroller.scrollLeft) >= maxScroll;
      }
      function updateButtons() {
        const start = atStart();
        const end = atEnd();
        prev.disabled = start;
        next.disabled = end;
        prev.style.display = start ? 'none' : '';
        next.style.display = end ? 'none' : '';
      }
      prev.addEventListener('click', () => {
        const amount = getScrollAmount();
        const target = Math.max(0, scroller.scrollLeft - amount);
        scroller.scrollTo({ left: target, behavior: 'smooth' });
        setTimeout(updateButtons, 300);
      });
      next.addEventListener('click', () => {
        scroller.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        setTimeout(updateButtons, 300);
      });
      scroller.addEventListener('scroll', updateButtons, { passive: true });
      window.addEventListener('resize', updateButtons);
      try { prev.disabled = true; prev.style.display = 'none'; } catch(e) {}
      updateButtons();
      requestAnimationFrame(updateButtons);
      window.addEventListener('load', updateButtons);
    });
  });
  