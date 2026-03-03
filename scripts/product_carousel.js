(function () {
  // carousel-only (extracted from product_block.js slides.js)
  window.shopify = window.shopify || {};
  const uniqueClassRegex = new RegExp("^i[a-zA-Z0-9]{16}(-[a-zA-Z0-9]{16})*$");
  const isUniqueClass = (cls) => uniqueClassRegex.test(cls);
  const getPrimaryClass = (el) => {
    const classes = Array.from(el.classList || []);
    return classes.find((c) => isUniqueClass(c)) || classes[0] || "";
  };
  window.shopify.initializedSwiper = !!window.shopify?.initializedSwiper;
  window.shopify.initSwiper =
    window.shopify?.initSwiper ||
    (() => {
      if (!window.shopify.initializedSwiper) {
        window.shopify.initializedSwiper = true;
        if (window.shopify.initializedListeners && window.__shopifyInitSliders) {
          window.__shopifyInitSliders();
        }
      }
    });

  // Load carousel data from JSON and populate HTML
  async function loadCarouselFromJSON() {
    try {
      const response = await fetch('data/carousel.json');
      if (!response.ok) {
        console.error('Failed to load carousel.json');
        return;
      }
      const data = await response.json();
      
      // Populate main slider
      const mainWrapper = document.getElementById('main-slider-wrapper');
      const thumbnailsWrapper = document.getElementById('thumbnails-slider-wrapper');
      
      if (mainWrapper && data.images && data.images.length > 0) {
        mainWrapper.innerHTML = '';
        data.images.forEach((image, index) => {
          const slide = document.createElement('div');
          slide.className = 'shopify-slider-slide iytPxehuLgUqoxXQ6';
          slide.setAttribute('data-shopify-type', 'slider-slide');
          slide.setAttribute('layerId', 'ytPxehuLgUqoxXQ6');
          
          const imageDiv = document.createElement('div');
          imageDiv.setAttribute('data-shopify-type', 'image');
          imageDiv.className = 'ivkJ7tiDLPBwLMk8t';
          
          const img = document.createElement('img');
          img.width = '100%';
          img.height = '100%';
          img.alt = image.alt || 'Product image';
          img.src = image.src;
          img.className = 'shopify-image shopify-image__main';
          img.decoding = 'async';
          
          // Build srcset
          if (image.srcset) {
            const srcsetParts = [];
            Object.keys(image.srcset).forEach(width => {
              srcsetParts.push(`${image.srcset[width]} ${width}w`);
            });
            img.srcset = srcsetParts.join(', ');
            img.sizes = '(max-width: 1280px) 100vw, 1280px';
          }
          
          // Set loading attributes
          if (index === 0) {
            img.loading = 'eager';
            img.fetchPriority = 'high';
          } else {
            img.loading = 'lazy';
            img.fetchPriority = 'auto';
          }
          
          if (image.width) img.setAttribute('width', image.width);
          if (image.height) img.setAttribute('height', image.height);
          
          imageDiv.appendChild(img);
          slide.appendChild(imageDiv);
          mainWrapper.appendChild(slide);
        });
      }
      
      // Populate thumbnails slider
      if (thumbnailsWrapper && data.images && data.images.length > 0) {
        thumbnailsWrapper.innerHTML = '';
        data.images.forEach((image, index) => {
          const slide = document.createElement('div');
          slide.className = 'shopify-slider-slide iA7jBRXnSUIAbCr1c';
          slide.setAttribute('data-shopify-type', 'slider-slide');
          slide.setAttribute('layerId', 'A7jBRXnSUIAbCr1c');
          
          const imageDiv = document.createElement('div');
          imageDiv.setAttribute('data-shopify-type', 'image');
          imageDiv.className = 'i9P5R4TQc9YakHTAG';
          
          const img = document.createElement('img');
          img.width = '100%';
          img.height = '100%';
          img.alt = image.alt || 'Product thumbnail';
          img.src = image.thumbnail || image.src;
          img.className = 'shopify-image shopify-image__main';
          img.decoding = 'async';
          
          // Build srcset for thumbnails
          if (image.srcset) {
            const srcsetParts = [];
            if (image.srcset['360']) srcsetParts.push(`${image.srcset['360']} 360w`);
            if (image.srcset['640']) srcsetParts.push(`${image.srcset['640']} 640w`);
            img.srcset = srcsetParts.join(', ');
            img.sizes = '(max-width: 640px) 100vw, 640px';
          }
          
          // Set loading attributes
          if (index === 0) {
            img.loading = 'eager';
            img.fetchPriority = 'high';
          } else {
            img.loading = 'lazy';
            img.fetchPriority = 'auto';
          }
          
          if (image.width) img.setAttribute('width', image.width);
          if (image.height) img.setAttribute('height', image.height);
          
          imageDiv.appendChild(img);
          slide.appendChild(imageDiv);
          thumbnailsWrapper.appendChild(slide);
        });
      }
      
      // Set up slider configuration
      const mainConfigNode = document.getElementById('shopify-slider-ip0v3Wq2c0KULJHOO-product-carousel-section-params');
      const thumbnailsConfigNode = document.getElementById('shopify-slider-i9MuTiHFVI9qvIaSA-product-carousel-section-params');
      
      if (mainConfigNode && data.sliderConfig && data.sliderConfig.main) {
        const mainConfig = {
          ...data.sliderConfig.main,
          a11y: false,
          containerModifierClass: "shopify-slider-",
          noSwipingClass: "shopify-slider-no-swiping",
          slideClass: "shopify-slider-slide",
          slideBlankClass: "shopify-slider-slide-blank",
          slideActiveClass: "shopify-slider-slide-active",
          slideVisibleClass: "shopify-slider-slide-visible",
          slideFullyVisibleClass: "shopify-slider-slide-fully-visible",
          slideNextClass: "shopify-slider-slide-next",
          slidePrevClass: "shopify-slider-slide-prev",
          wrapperClass: "shopify-slider-wrapper",
          lazyPreloaderClass: "shopify-slider-lazy-preloader",
          on: {}
        };
        mainConfigNode.textContent = JSON.stringify(mainConfig);
      }
      
      if (thumbnailsConfigNode && data.sliderConfig && data.sliderConfig.thumbnails) {
        const thumbnailsConfig = {
          ...data.sliderConfig.thumbnails,
          a11y: false,
          containerModifierClass: "shopify-slider-",
          noSwipingClass: "shopify-slider-no-swiping",
          slideClass: "shopify-slider-slide",
          slideBlankClass: "shopify-slider-slide-blank",
          slideActiveClass: "shopify-slider-slide-active",
          slideVisibleClass: "shopify-slider-slide-visible",
          slideFullyVisibleClass: "shopify-slider-slide-fully-visible",
          slideNextClass: "shopify-slider-slide-next",
          slidePrevClass: "shopify-slider-slide-prev",
          wrapperClass: "shopify-slider-wrapper",
          lazyPreloaderClass: "shopify-slider-lazy-preloader",
          on: {}
        };
        thumbnailsConfigNode.textContent = JSON.stringify(thumbnailsConfig);
      }
      
    } catch (error) {
      console.error('Error loading carousel data:', error);
    }
  }
  function initshopifySliders(root) {
    const scope = root || document;
    if (!window.shopify.initializedSwiper) {
      if (scope.querySelector('[data-shopify-type="slider"]')) {
        // const script = document.createElement("script");
        // script.onload = window.shopify.initSwiper;
        // script.src = window.shopify.swiperScriptUrl || "scripts/swiper-bundle.min.js";
        // document.body.appendChild(script);
        const tryLoad = (urls, idx = 0) => {
          if (!urls || idx >= urls.length) return;
          const script = document.createElement("script");
          script.onload = window.shopify.initSwiper;
          script.onerror = () => tryLoad(urls, idx + 1);
          script.src = urls[idx];
          document.body.appendChild(script);
        };
        const urls = [];
        if (window.shopify.swiperScriptUrl) urls.push(window.shopify.swiperScriptUrl);
        urls.push("scripts/swiper-bundle.min.js");
        urls.push("https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js");
        tryLoad(urls, 0);
      }
      return;
    }
    const thumbnailById = {};
    const mount = (container, kind = "slider") => {
      if (!container || !container.id) return;
      const paramsNode = document.getElementById(`shopify-slider-${container.id}-params`);
      const sectionId = container.closest(".__shopify")?.getAttribute("data-section-id");
      const sliderId = container.getAttribute("data-shopify-slider-id");
      try {
        if (!paramsNode || !paramsNode.innerHTML) return;
        const config = JSON.parse(paramsNode.innerHTML);
        if (sectionId && config.navigation) {
          config.navigation.nextEl = `[data-section-id='${sectionId}'] ${config.navigation.nextEl}`;
          config.navigation.prevEl = `[data-section-id='${sectionId}'] ${config.navigation.prevEl}`;
        }
        if (config.pagination) {
          const scopedSelector = `[data-section-id='${sectionId}'] ${config.pagination.el}`;
          config.pagination.el = scopedSelector;
          const pagEl = document.querySelector(scopedSelector);
          const bullet = pagEl?.querySelector(".shopify-slider-pagination-bullet");
          if (pagEl && bullet) {
            const bulletIdClass = getPrimaryClass(bullet);
            config.pagination.renderBullet = (index, className) =>
              `<span class="${className} ${bulletIdClass}"></span>`;
          }
        }
        config.on = config.on || {};
        config.on.changeDirection = (swiper) => {
          if (swiper.params.direction === "horizontal") {
            const wrapper = container.querySelector(":scope > .shopify-slider-wrapper");
            if (wrapper) wrapper.style.height = "";
          }
        };
        if (kind === "thumbnails") {
          const thumbsSwiper = new Swiper(container, config);
          thumbnailById[`${sliderId}`] = thumbsSwiper;
        } else {
          if (config.thumbs && thumbnailById?.[`${sliderId}`]) {
            config.thumbs = { swiper: thumbnailById[`${sliderId}`], ...config.thumbs };
          }
          new Swiper(container, config);
        }
      } catch (err) {}
    };
    scope.querySelectorAll('[data-shopify-type="thumbnails"]').forEach((el) => mount(el, "thumbnails"));
    scope.querySelectorAll('[data-shopify-type="slider"]').forEach((el) => mount(el));
  }
  window.__shopifyInitSliders = function (root) {
    initshopifySliders(root || document);
  };
  function readySlides() {
    // Load carousel data from JSON first, then initialize sliders
    loadCarouselFromJSON().then(() => {
      window.shopify.initializedListeners = true;
      if (window.__shopifyInitSliders) {
        window.__shopifyInitSliders();
      }
    });
  }
  if (document.readyState !== "loading") readySlides();
  else document.addEventListener("DOMContentLoaded", readySlides);
})();


