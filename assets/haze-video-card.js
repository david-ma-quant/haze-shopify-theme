/**
 * Haze Video Card — hover/viewport video playback for product grid cards.
 * Loaded only on homepage via request.page_type == 'index' guard in haze-product-grid.liquid.
 *
 * Requirements: VIDEO-01 through VIDEO-05
 * - VIDEO-01: No video element = static image only (handled by Liquid — nothing for JS to do)
 * - VIDEO-02: mouseenter/mouseleave on desktop; IntersectionObserver off-screen pause
 * - VIDEO-03: IntersectionObserver autoplay at 50% threshold on touch devices
 * - VIDEO-04: prefers-reduced-motion: bail out entirely — no JS initialization
 * - VIDEO-05: Script loaded only on homepage (Liquid guard in section file)
 */
(function () {
  'use strict';

  // VIDEO-04: bail out entirely if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var HOVER_CLASS = 'haze-card--video-playing';

  function initCard(card) {
    var video = card.querySelector('.haze-card__video');
    if (!video) return; // VIDEO-01: no video element means static image only

    var isTouch = window.matchMedia('(hover: none)').matches;

    if (isTouch) {
      // VIDEO-03: touch devices — IntersectionObserver autoplay at 50% viewport
      var touchObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              video.play().catch(function () {});
              card.classList.add(HOVER_CLASS);
            } else {
              video.pause();
              card.classList.remove(HOVER_CLASS);
            }
          });
        },
        { threshold: 0.5 }
      );
      touchObserver.observe(card);
    } else {
      // VIDEO-02: desktop — mouseenter starts, mouseleave pauses
      card.addEventListener('mouseenter', function () {
        video.play().catch(function () {});
        card.classList.add(HOVER_CLASS);
      });
      card.addEventListener('mouseleave', function () {
        video.pause();
        card.classList.remove(HOVER_CLASS);
      });

      // VIDEO-02: off-screen pause via IntersectionObserver (threshold 0)
      var offScreenObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              video.pause();
              card.classList.remove(HOVER_CLASS);
            }
          });
        },
        { threshold: 0 }
      );
      offScreenObserver.observe(card);
    }
  }

  // Initialize all cards on page load
  document.querySelectorAll('[data-card-video]').forEach(initCard);
})();
