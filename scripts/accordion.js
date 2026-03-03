

document.addEventListener('DOMContentLoaded', function () {
const PLUS_ICON = './img/collapse.svg';
  const CLOSE_ICON = './img/collapse.svg';

  // Function to initialize a single accordion container
  function initAccordion(container) {
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.accordion-item'));
    const answers = items.map(i => i.querySelector('.accordion-answer')).filter(Boolean);
    const useRotateIcon = container.classList.contains('rotate-icon');

    // Check if first item should be open by default
    const openFirst = container.classList.contains('accordion-open-first');

    // Initialize collapsed
    answers.forEach((ans, index) => {
      if (openFirst && index === 0) {
        // First item should be open - set height to scrollHeight first, then to auto
        ans.style.height = ans.scrollHeight + 'px';
        ans.setAttribute('aria-hidden', 'false');
        // Use requestAnimationFrame to ensure proper rendering before setting to auto
        requestAnimationFrame(() => {
          ans.style.height = 'auto';
        });
        const firstItem = items[0];
        if (firstItem) {
          const firstBtn = firstItem.querySelector('.accordion-question');
          const firstIcon = firstItem.querySelector('.accordion-icon');
          if (firstBtn) firstBtn.setAttribute('aria-expanded', 'true');
          if (firstIcon) setIconState(firstIcon, true);
          firstItem.classList.add('active');
        }
      } else {
        // All other items collapsed
        ans.style.height = '0px';
        ans.setAttribute('aria-hidden', 'true');
      }
    });

    // Ensure initial icons are correct
    items.forEach((item, index) => {
      const icon = item.querySelector('.accordion-icon');
      if (icon) {
        setIconState(icon, openFirst && index === 0);
      }
    });

    function setIconState(icon, isOpen) {
      if (!icon) return;
      if (useRotateIcon) {
        icon.style.transition = icon.style.transition || 'transform 0.02s ease';
        icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        return;
      }
      icon.src = isOpen ? CLOSE_ICON : PLUS_ICON;
    }

    function closeItem(item) {
      if (!item) return;
      const btn = item.querySelector('.accordion-question');
      const ans = item.querySelector('.accordion-answer');
      const icon = item.querySelector('.accordion-icon');
      if (!ans) return;
      // If height is auto, lock to current height then collapse
      if (ans.style.height === 'auto') {
        ans.style.height = ans.scrollHeight + 'px';
        void ans.offsetHeight;
      }
      ans.style.height = '0px';
      ans.setAttribute('aria-hidden', 'true');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (icon) setIconState(icon, false);
      item.classList.remove('active');

      ans.addEventListener('transitionend', function onCloseEnd(e) {
        if (e.propertyName !== 'height') return;
        if (window.updateStickyButtonPosition) {
          window.updateStickyButtonPosition();
          if (window.updateStickyButtonVisibility) {
            window.updateStickyButtonVisibility();
          }
        }
        ans.removeEventListener('transitionend', onCloseEnd);
      });
    }

    function openItem(item) {
      const btn = item.querySelector('.accordion-question');
      const ans = item.querySelector('.accordion-answer');
      const icon = item.querySelector('.accordion-icon');
      if (!ans) return;
      ans.style.height = ans.scrollHeight + 'px';
      ans.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName !== 'height') return;
        ans.style.height = 'auto';
        if (window.updateStickyButtonPosition) {
          window.updateStickyButtonPosition();
          if (window.updateStickyButtonVisibility) {
            window.updateStickyButtonVisibility();
          }
        }
        ans.removeEventListener('transitionend', onEnd);
      });
      ans.setAttribute('aria-hidden', 'false');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (icon) setIconState(icon, true);
      item.classList.add('active');

      if (window.updateStickyButtonPosition) {
        requestAnimationFrame(() => {
          window.updateStickyButtonPosition();
          if (window.updateStickyButtonVisibility) {
            window.updateStickyButtonVisibility();
          }
        });
      }
    }

    items.forEach(item => {
      const btn = item.querySelector('.accordion-question');
      const ans = item.querySelector('.accordion-answer');
      if (!btn || !ans) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close all others in the same accordion container
        items.forEach(other => {
          if (other !== item) closeItem(other);
        });
        // Toggle current
        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);
        }

        if (window.updateStickyButtonPosition) {
          requestAnimationFrame(() => {
            window.updateStickyButtonPosition();
            if (window.updateStickyButtonVisibility) {
              window.updateStickyButtonVisibility();
            }
          });
        }
      });
    });

    // Keep open panels responsive if window resizes
    const handleResize = () => {
      items.forEach(item => {
        const ans = item.querySelector('.accordion-answer');
        if (item.classList.contains('active') && ans) {
          ans.style.height = 'auto';
        }
      });
    };

    // Store resize handler on container for potential cleanup
    container._faqResizeHandler = handleResize;
    window.addEventListener('resize', handleResize);
  }

  // Find all accordion containers (supports multiple selectors)
  const containers = document.querySelectorAll('[data-accordion], .accordion-container');

  // Initialize each accordion independently
  containers.forEach(container => {
    initAccordion(container);
  });
});
