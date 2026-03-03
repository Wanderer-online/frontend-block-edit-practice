// Smooth marquee tickers
(function () {
    // Initializes all tickers within a root element (defaults to document)
    function initShopifyTicker(root) {
      var scope = root || document;
      var tickers = scope.querySelectorAll('[data-shopify-type="ticker"]');
      if (!tickers.length) return;
  
      Array.from(tickers).reverse().forEach(function (ticker) {
        var initialContainer = ticker.querySelector('.shopify-ticker-initial-child-container');
        var primaryTrack = initialContainer && initialContainer.closest('.shopify-ticker');
        var secondaryTrack = primaryTrack && primaryTrack.nextElementSibling;
        var tracks = [primaryTrack, secondaryTrack];
        var reversed = ticker.getAttribute('data-shopify-ticker-is-reversed') === 'true';
        var speed = +(ticker.getAttribute('data-shopify-ticker-speed') || 50);
        var pause = ticker.getAttribute('data-shopify-ticker-pause') === 'true' || false;
  
        if (!(ticker && initialContainer)) return;
  
        var children = initialContainer.children;
        var multiplier = 1;
        var duration = 0;
  
        var refresh = function () {
          var tickerRect = ticker.getBoundingClientRect();
          var initialRect = initialContainer.getBoundingClientRect();
          if (tickerRect && initialRect) {
            var visibleWidth = Math.min(tickerRect.width, 9999);
            var initialWidth = initialRect.width;
            var cs = window.getComputedStyle(initialContainer);
            var rawGap = cs.getPropertyValue('column-gap') || cs.columnGap || '0px';
            var parsedGap = parseFloat(rawGap);
            var colGap = isNaN(parsedGap) ? '0px' : (parsedGap + 'px');
            ticker.style.setProperty('--gap', colGap);
  
            multiplier = (initialWidth && visibleWidth && initialWidth < visibleWidth) ? Math.ceil(visibleWidth / initialWidth) : 1;
            duration = initialWidth * multiplier / speed;
          }
  
          if (ticker.style.getPropertyValue('--multiplier') !== String(multiplier)) {
            if (primaryTrack) primaryTrack.replaceChildren(initialContainer);
            if (secondaryTrack) secondaryTrack.innerHTML = '';
  
            Array.from(tracks).forEach(function (track, trackIndex) {
              if (!track) return;
              var repeats = Math.max(0, trackIndex === 0 ? multiplier - 1 : multiplier);
              for (var r = 0; r < repeats; r++) {
                var containerClone = initialContainer.cloneNode(true);
                containerClone.classList.remove('shopify-ticker-initial-child-container');
                track.appendChild(containerClone);
              }
            });
          }
  
          ticker.style.setProperty('--play', 'running');
          ticker.style.setProperty('--direction', reversed ? 'reverse' : 'normal');
          ticker.style.setProperty('--duration', duration + 's');
          ticker.style.setProperty('--pause-on-hover', pause ? 'paused' : 'running');
          ticker.style.setProperty('--multiplier', String(multiplier));
  
          // Safari lazy loading quirk: force eager for visibility
          if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
            ticker.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
              img.loading = 'eager';
            });
          }
        };

        refresh();
        try {
          var ro = new ResizeObserver(refresh);
          ro.observe(ticker);
          ro.observe(initialContainer);
        } catch (e) {
          // ResizeObserver not available; best-effort initial sizing
        }
      });
    }
  
    // Public entrypoint
    window.__shopifyInitTicker = function (root) {
      initShopifyTicker(root || document);
    };
  
    // Auto-initialize on DOM ready
    function ready() {
      window.__shopifyInitTicker && window.__shopifyInitTicker();
    }
    if (document.readyState !== 'loading') {
      ready();
    } else {
      document.addEventListener('DOMContentLoaded', ready);
    }
  
    // Re-initialize when sections are (re)loaded in Shopify theme editor
    document.addEventListener('shopify:section:load', function (e) {
      var root = e && e.target ? e.target : document;
      window.__shopifyInitTicker && window.__shopifyInitTicker(root);
    });
  })();