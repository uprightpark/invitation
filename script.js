/**
 * SmoothPhysicsCarousel
 * Provides physics-based smooth drag and flick momentum swipe transitions.
 */
class SmoothPhysicsCarousel {
  constructor(containerElement) {
    this.container = containerElement;
    this.track = this.container.querySelector('.carousel-track');
    this.cards = Array.from(this.track.querySelectorAll('.photo-card'));
    this.carouselId = this.container.getAttribute('data-carousel');
    this.dotsContainer = document.querySelector(`.carousel-dots[data-dots-for="${this.carouselId}"]`);
    
    // Geometry calculations
    this.cardWidth = 280;
    this.cardGap = 14;
    this.itemOffset = this.cardWidth + this.cardGap;
    this.paddingLeft = 20;
    
    // State variables
    this.currentIndex = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    
    // Gesture tracking state
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.dragDeltaX = 0;
    this.startTime = 0;
    this.isScrollLocked = false;
    this.hasDeterminedDirection = false;

    this.init();
  }

  init() {
    this.createDots();
    this.bindEvents();
    this.updatePosition(false);
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    
    this.cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      this.dotsContainer.appendChild(dot);
    });
  }

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = Array.from(this.dotsContainer.querySelectorAll('.dot'));
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });
  }

  bindEvents() {
    // Touch Events
    this.container.addEventListener('touchstart', (e) => this.onDragStart(e), { passive: true });
    window.addEventListener('touchmove', (e) => this.onDragMove(e), { passive: false });
    window.addEventListener('touchend', (e) => this.onDragEnd(e));

    // Pointer / Mouse Events
    this.container.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return; // Handled by touch events
      this.onDragStart(e);
    });
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' || !this.isDragging) return;
      this.onDragMove(e);
    });
    window.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') return;
      this.onDragEnd(e);
    });
  }

  getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  getClientY(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
  }

  onDragStart(e) {
    this.isDragging = true;
    this.hasDeterminedDirection = false;
    this.isScrollLocked = false;
    
    this.startX = this.getClientX(e);
    this.startY = this.getClientY(e);
    this.startTime = Date.now();
    this.dragDeltaX = 0;
    
    // Disable CSS transition during active direct dragging for 1:1 movement
    this.track.style.transition = 'none';
    this.prevTranslate = -this.currentIndex * this.itemOffset;
  }

  onDragMove(e) {
    if (!this.isDragging) return;

    const currentX = this.getClientX(e);
    const currentY = this.getClientY(e);
    
    const deltaX = currentX - this.startX;
    const deltaY = currentY - this.startY;

    // Lock direction on initial drag movement
    if (!this.hasDeterminedDirection) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6) {
        this.isScrollLocked = true; // Horizontal drag locked
        this.hasDeterminedDirection = true;
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
        this.isDragging = false; // Release for vertical page scroll
        this.hasDeterminedDirection = true;
        return;
      }
    }

    if (this.isScrollLocked) {
      if (e.cancelable) e.preventDefault();
      
      this.dragDeltaX = deltaX;
      let targetTranslate = this.prevTranslate + this.dragDeltaX;

      // Rubber-banding elasticity effect at boundaries
      const maxTranslate = 0;
      const minTranslate = -(this.cards.length - 1) * this.itemOffset;

      if (targetTranslate > maxTranslate) {
        targetTranslate = maxTranslate + (targetTranslate - maxTranslate) * 0.3;
      } else if (targetTranslate < minTranslate) {
        targetTranslate = minTranslate + (targetTranslate - minTranslate) * 0.3;
      }

      this.currentTranslate = targetTranslate;
      this.track.style.transform = `translate3d(${this.currentTranslate}px, 0, 0)`;
    }
  }

  onDragEnd() {
    if (!this.isDragging && !this.isScrollLocked) return;
    
    this.isDragging = false;
    this.isScrollLocked = false;

    const dragDuration = Date.now() - this.startTime;
    const velocity = Math.abs(this.dragDeltaX) / dragDuration; // In pixels per ms

    // Determine target index using distance or swipe flick velocity
    if (velocity > 0.25 || Math.abs(this.dragDeltaX) > this.itemOffset * 0.22) {
      if (this.dragDeltaX < 0) {
        this.currentIndex = Math.min(this.currentIndex + 1, this.cards.length - 1);
      } else {
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
      }
    }

    this.updatePosition(true);
  }

  updatePosition(animate = true) {
    this.currentTranslate = -this.currentIndex * this.itemOffset;
    
    if (animate) {
      // Smooth momentum easing transition curve
      this.track.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      this.track.style.transition = 'none';
    }

    this.track.style.transform = `translate3d(${this.currentTranslate}px, 0, 0)`;

    // Update active card class states
    this.cards.forEach((card, idx) => {
      card.classList.toggle('active', idx === this.currentIndex);
    });

    this.updateDots();
  }
}

// Initialize all carousels when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel-container');
  carousels.forEach((container) => new SmoothPhysicsCarousel(container));
});
