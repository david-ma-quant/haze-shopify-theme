/**
 * Haze PDP Gallery Dot Indicator
 * Injects dot navigation below the product media gallery
 * and syncs active dot with scroll position via IntersectionObserver.
 *
 * Per D-05: IntersectionObserver, no swipe library
 * Per D-06: Dot count matches slide count (4 for placeholder images)
 */
(function () {
  'use strict';

  var gallery = document.querySelector('media-gallery');
  if (!gallery) return;

  var list = gallery.querySelector('.product__media-list');
  if (!list) return;

  var slides = gallery.querySelectorAll('.product__media-item');
  if (slides.length <= 1) return;

  // Build dot container
  var dotsContainer = document.createElement('div');
  dotsContainer.className = 'haze-gallery-dots';
  dotsContainer.setAttribute('role', 'tablist');
  dotsContainer.setAttribute('aria-label', 'Product images');

  for (var i = 0; i < slides.length; i++) {
    var dot = document.createElement('button');
    dot.className = 'haze-gallery-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('type', 'button');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Image ' + (i + 1) + ' of ' + slides.length);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.dataset.index = i;

    // Click handler — scroll to matching slide
    dot.addEventListener('click', (function (index) {
      return function () {
        slides[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      };
    })(i));

    dotsContainer.appendChild(dot);
  }

  // Insert dots after the gallery element
  gallery.after(dotsContainer);

  var dots = dotsContainer.querySelectorAll('.haze-gallery-dot');

  // Sync dots via IntersectionObserver
  // threshold 0.6 (higher than 0.5) to avoid flicker during fast scrolling (per RESEARCH Pitfall 2)
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(slides).indexOf(entry.target);
          if (idx === -1) return;
          dots.forEach(function (d, j) {
            var isActive = j === idx;
            d.classList.toggle('is-active', isActive);
            d.setAttribute('aria-selected', isActive ? 'true' : 'false');
          });
        }
      });
    },
    { root: list, threshold: 0.6 }
  );

  slides.forEach(function (slide) {
    observer.observe(slide);
  });
})();
