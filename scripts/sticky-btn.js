document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.sticky-btn-wrap');
    const footer = document.querySelector('footer');
    const productBlock = document.querySelector('#product-block');
  
    if (!btn || !footer) return;
  
    function updateButtonPosition() {
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
  
      if (footerRect.top < windowHeight) {
        // Футер з'явився у видимості → піднімаємо кнопку над футером
        const overlap = windowHeight - footerRect.top;
        btn.style.bottom = `${overlap - 20}px`; // 20px відступ
      } else {
        // Футер ще не видно → кнопка принизу екрану
        btn.style.bottom = '0px';
      }
    }
  
    function updateStickyVisibility() {
      if (!productBlock) return;
      const productBottom = productBlock.offsetTop + productBlock.offsetHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      const btnHeight = btn.offsetHeight || 0;
      const safeOffset = 12;
      const shouldShow = viewportBottom >= productBottom + btnHeight + safeOffset;
      btn.classList.toggle('is-visible', shouldShow);
    }
  
    // Робимо функцію доступною глобально для виклику з інших скриптів
    window.updateStickyButtonPosition = updateButtonPosition;
    window.updateStickyButtonVisibility = updateStickyVisibility;
  
    window.addEventListener('scroll', updateButtonPosition);
    window.addEventListener('resize', updateButtonPosition);
    window.addEventListener('scroll', updateStickyVisibility);
    window.addEventListener('resize', updateStickyVisibility);
  
    // Виставимо початкове положення
    updateButtonPosition();
    updateStickyVisibility();
  });