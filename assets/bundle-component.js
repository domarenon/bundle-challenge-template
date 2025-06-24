import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

class ProductBundle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const template = this.querySelector('template');
    if (!template) return;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    await this.injectSwiperStyles();

    requestAnimationFrame(() => {
      this.mainId = this.dataset.mainId;
      this.handle = this.dataset.handle;
      this.variantImages = JSON.parse(this.dataset.variantImages || '{}');
      this.swatchColors = JSON.parse(this.dataset.swatchColors || '{}');

      this.swiperContainer = this.shadowRoot.querySelector('.swiper');
      this.swiperWrapper = this.shadowRoot.querySelector('.swiper-wrapper');

      this.initSwiper();
      this.initAddToCart();
      this.fetchBundleProduct();
      this.applySwatchColors();
    });
  }

  applySwatchColors() {
    this.shadowRoot.querySelectorAll('.bundle-card__swatch').forEach(btn => {
      const value = btn.dataset.value;
      const color = this.swatchColors?.[value];
      if (color) btn.style.backgroundColor = color;
    });
  }

  async fetchBundleProduct() {
    try {
      const res = await fetch(`/products/${this.handle}.js`);
      this.product = await res.json();
      this.initVariantHandling();
    } catch (err) {
      console.error('Error loading product data:', err);
    }
  }

  async injectSwiperStyles() {
    try {
      const res = await fetch('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
      const cssText = await res.text();

      const styleTag = document.createElement('style');
      styleTag.textContent = cssText;
      this.shadowRoot.appendChild(styleTag);
    } catch (err) {
      console.warn('Swiper CSS not loaded:', err);
    }
  }

  initSwiper() {
    this.swiper = new Swiper(this.swiperContainer, {
      navigation: {
        nextEl: this.shadowRoot.querySelector('.swiper-button-next'),
        prevEl: this.shadowRoot.querySelector('.swiper-button-prev'),
      },
    });
  }

  initVariantHandling() {
    const optionCount = this.product.options?.length || 0;
    this.options = Array(optionCount).fill(null);
    this.priceEl = this.shadowRoot.querySelector('.bundle-card__price--discounted');
    this.addBtn = this.shadowRoot.querySelector('.bundle-card__add');

    this.shadowRoot.querySelectorAll('.bundle-card__swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('[data-option-index]');
        const index = parseInt(group.dataset.optionIndex, 10);
        group.querySelectorAll('.bundle-card__swatch').forEach(el => el.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        this.options[index] = btn.dataset.value;
        this.updateVariant();
      });
    });

    this.shadowRoot.querySelectorAll('.bundle-card__select').forEach(select => {
      select.addEventListener('change', () => {
        const index = parseInt(select.dataset.optionIndex, 10);
        this.options[index] = select.value;
        this.updateVariant();
      });
    });

    // Set default selections
    for (let i = 0; i < optionCount; i++) {
      const swatchGroup = this.shadowRoot.querySelector(`[data-option-index="${i}"].bundle-card__swatches`);
      if (swatchGroup) {
        const first = swatchGroup.querySelector('.bundle-card__swatch');
        if (first) first.click();
      } else {
        const select = this.shadowRoot.querySelector(`select[data-option-index="${i}"]`);
        if (select) this.options[i] = select.value;
      }
    }

    this.updateVariant();
  }

  updateVariant() {
    const selected = this.product.variants.find(v =>
      JSON.stringify(v.options) === JSON.stringify(this.options)
    );

    if (selected) {
      this.priceEl.textContent = `$${(selected.price / 100 * 0.9).toFixed(2)}`;
      this.addBtn.dataset.bundleId = selected.id;
      this.addBtn.disabled = !selected.available;
      this.updateSliderImages(selected);
    } else {
      this.addBtn.disabled = true;
    }
  }

  updateSliderImages(variant) {
    const variantImages = this.variantImages?.[variant.id] || [];
    const fallback = variant.featured_image?.src || this.product.images?.[0]?.src;
    const images = variantImages.length ? variantImages : [fallback];

    this.swiper.removeAllSlides();

    const slides = images.map(url => `
      <div class="swiper-slide">
        <img src="${url}" alt="${variant.title}" class="bundle-card__image" loading="lazy" />
      </div>
    `);

    this.swiper.appendSlide(slides);
    this.swiper.slideTo(0);
  }

  initAddToCart() {
    this.shadowRoot.querySelector('.bundle-card__add')?.addEventListener('click', () => {
      const mainId = this.mainId;
      const bundleId = this.shadowRoot.querySelector('.bundle-card__add')?.dataset.bundleId;

      if (!bundleId) return;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { id: Number(mainId), quantity: 1 },
            { id: Number(bundleId), quantity: 1 }
          ]
        })
      })
        .then(() => window.location.href = '/cart')
        .catch(err => console.error('Error adding to cart:', err));
    });
  }
}

customElements.define('product-bundle', ProductBundle);
