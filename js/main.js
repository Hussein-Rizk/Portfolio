/* ===================================================================
 * Ceevee 2.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function (html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';


    /* Preloader
     * -------------------------------------------------- */
    const ssPreloader = function () {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        window.addEventListener('load', function () {

            document.querySelector('body').classList.remove('ss-preload');
            document.querySelector('body').classList.add('ss-loaded');

            preloader.addEventListener('transitionend', function (e) {
                if (e.target.matches("#preloader")) {
                    this.style.display = 'none';
                }
            });

        });

        //force page scroll position to top at page refresh
        window.addEventListener('beforeunload', function () {
            window.scrollTo(0, 0);
        });

    }; // end ssPreloader


    /* Parallax
     * -------------------------------------------------- */
    const ssParallax = function () {

        const rellax = new Rellax('.rellax');

    }; // end ssParallax


    /* Move header menu
     * -------------------------------------------------- */
    const ssMoveHeader = function () {

        const hdr = document.querySelector('.s-header');
        const hero = document.querySelector('#hero');
        let triggerHeight;

        if (!(hdr && hero)) return;

        setTimeout(function () {
            triggerHeight = hero.offsetHeight - 170;
        }, 300);

        window.addEventListener('scroll', function () {

            let loc = window.scrollY;


            if (loc > triggerHeight) {
                hdr.classList.add('sticky');
            } else {
                hdr.classList.remove('sticky');
            }

            if (loc > triggerHeight + 20) {
                hdr.classList.add('offset');
            } else {
                hdr.classList.remove('offset');
            }

            if (loc > triggerHeight + 150) {
                hdr.classList.add('scrolling');
            } else {
                hdr.classList.remove('scrolling');
            }

        });

    }; // end ssMoveHeader


    /* Mobile Menu
     * ---------------------------------------------------- */
    const ssMobileMenu = function () {

        const toggleButton = document.querySelector('.s-header__menu-toggle');
        const headerNavWrap = document.querySelector('.s-header__nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && headerNavWrap)) return;

        toggleButton.addEventListener('click', function (event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        headerNavWrap.querySelectorAll('.s-header__nav a').forEach(function (link) {
            link.addEventListener("click", function (evt) {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function () {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


    /* Highlight active menu link on pagescroll
     * ------------------------------------------------------ */
    const ssScrollSpy = function () {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {

            // Get current scroll position
            let scrollY = window.pageYOffset;

            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function (current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");

                /* If our current scroll position enters the space where current section 
                 * on screen is, add .current class to parent element(li) of the thecorresponding 
                 * navigation link, else remove it. To know which link is active, we use 
                 * sectionId variable we are getting while looping through sections as 
                 * an selector
                 */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".s-header__nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".s-header__nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


    /* Swiper
     * ------------------------------------------------------ */
    const ssSwiper = function () {

        if (!document.querySelector('.swiper-container')) return;

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is >= 401px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is >= 801px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 48
                }
            }
        });

    }; // end ssSwiper


    /* Lightbox
     * ------------------------------------------------------ */
    const ssLightbox = function () {

        // Scoped to the sections that actually have matching modal markup
        // (#projects and #certifications cards/links now open real modals too).
        const folioLinks = document.querySelectorAll('#projects .folio-item a, #certifications .folio-item a, #gallery .folio-item a');
        const modals = [];

        folioLinks.forEach(function (link) {
            let modalbox = link.getAttribute('href');
            let target = document.querySelector(modalbox);
            if (!target) return;

            let instance = basicLightbox.create(
                target,
                {
                    onShow: function (instance) {
                        //detect Escape key press
                        document.addEventListener("keydown", function (evt) {
                            evt = evt || window.event;
                            if (evt.keyCode === 27) {
                                instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function (link, index) {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                modals[index].show();
            });
        });

    };  // end ssLightbox


    /* Full-screen photo viewer (click a photo inside a project popup to
     * open it full-screen with looping prev/next navigation)
     * ------------------------------------------------------ */
    const ssPhotoViewer = function () {

        const viewer = document.querySelector('#photo-viewer');
        if (!viewer) return;

        const imgEl = viewer.querySelector('.photo-viewer__img');
        const counterEl = viewer.querySelector('.photo-viewer__counter');
        const closeBtn = viewer.querySelector('.photo-viewer__close');
        const prevBtn = viewer.querySelector('.photo-viewer__prev');
        const nextBtn = viewer.querySelector('.photo-viewer__next');

        let photos = [];
        let index = 0;

        function render() {
            const photo = photos[index];
            imgEl.src = photo.src;
            imgEl.alt = photo.alt;
            counterEl.textContent = (index + 1) + ' / ' + photos.length;
        }

        function open(list, startIndex) {
            photos = list;
            index = startIndex;
            render();
            viewer.hidden = false;
        }

        function close() {
            viewer.hidden = true;
            imgEl.src = '';
        }

        function step(delta) {
            index = (index + delta + photos.length) % photos.length;
            render();
        }

        document.addEventListener('click', function (e) {
            const wrap = e.target.closest('.modal-popup__photo-wrap');
            if (!wrap) return;

            const row = wrap.closest('.modal-popup__photo-row');
            if (!row) return;

            const imgs = Array.from(row.querySelectorAll('.modal-popup__photo'));
            const startIndex = imgs.indexOf(wrap.querySelector('.modal-popup__photo'));

            open(imgs.map(function (img) {
                return { src: img.src, alt: img.alt };
            }), startIndex === -1 ? 0 : startIndex);
        });

        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', function () { step(-1); });
        nextBtn.addEventListener('click', function () { step(1); });

        viewer.addEventListener('click', function (e) {
            if (e.target === viewer) close();
        });

        document.addEventListener('keydown', function (e) {
            if (viewer.hidden) return;

            if (e.key === 'Escape' || e.keyCode === 27) {
                // Stop the underlying project modal's own Escape handler
                // from also closing on this same keypress.
                e.stopImmediatePropagation();
                close();
            } else if (e.key === 'ArrowLeft') {
                step(-1);
            } else if (e.key === 'ArrowRight') {
                step(1);
            }
        });

    }; // end ssPhotoViewer


    /* "Let's Talk" contact popup (email + phone, each with a copy button)
     * ------------------------------------------------------ */
    const ssContactPopup = function () {

        const trigger = document.querySelector('#contact-cta');
        const target = document.querySelector('#modal-contact');
        if (!trigger || !target) return;

        const instance = basicLightbox.create(target, {
            onShow: function (instance) {
                document.addEventListener('keydown', function onKeydown(evt) {
                    if (evt.keyCode === 27) {
                        instance.close();
                        document.removeEventListener('keydown', onKeydown);
                    }
                });
            }
        });

        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            instance.show();
        });

        function copyText(text) {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(text);
            }
            // Fallback for browsers/contexts without the async Clipboard API
            const helper = document.createElement('textarea');
            helper.value = text;
            helper.style.position = 'fixed';
            helper.style.opacity = '0';
            document.body.appendChild(helper);
            helper.select();
            document.execCommand('copy');
            document.body.removeChild(helper);
            return Promise.resolve();
        }

        target.querySelectorAll('.contact-popup__copy').forEach(function (button) {
            button.addEventListener('click', function () {
                const valueEl = document.getElementById(button.getAttribute('data-copy-target'));
                if (!valueEl) return;

                copyText(valueEl.textContent.trim()).then(function () {
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    button.classList.add('is-copied');

                    setTimeout(function () {
                        button.textContent = originalText;
                        button.classList.remove('is-copied');
                    }, 1200);
                });
            });
        });

    }; // end ssContactPopup


    /* Alert boxes
     * ------------------------------------------------------ */
    const ssAlertBoxes = function () {

        const boxes = document.querySelectorAll('.alert-box');

        boxes.forEach(function (box) {

            box.addEventListener('click', function (e) {
                if (e.target.matches(".alert-box__close")) {
                    e.stopPropagation();
                    e.target.parentElement.classList.add("hideit");

                    setTimeout(function () {
                        box.style.display = "none";
                    }, 500)
                }
            });

        })

    }; // end ssAlertBoxes


    /* Smoothscroll
     * ------------------------------------------------------ */
    const ssSmoothScroll = function () {

        const triggers = document.querySelectorAll(".smoothscroll");

        triggers.forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                const target = trigger.getAttribute("href");

                Jump(target, {
                    duration: 1200,
                });
            });
        });

    }; // end ssSmoothScroll


    /* back to top
     * ------------------------------------------------------ */
    const ssBackToTop = function () {

        const pxShow = 900;
        const goTopButton = document.querySelector(".ss-go-top");

        if (!goTopButton) return;

        // Show or hide the button
        if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

        window.addEventListener('scroll', function () {
            if (window.scrollY >= pxShow) {
                if (!goTopButton.classList.contains('link-is-visible')) goTopButton.classList.add("link-is-visible")
            } else {
                goTopButton.classList.remove("link-is-visible")
            }
        });

    }; // end ssBackToTop


    function revealScrollButton(buttonSelector) {
        const scrollDownButton = document.querySelector(buttonSelector);
    
        if (!scrollDownButton) {
            console.error(`Element with selector "${buttonSelector}" not found.`);
            return;
        }
    
        scrollDownButton.style.opacity = 0; // Initially hidden
        scrollDownButton.style.visibility = 'hidden'; // Initially hidden
    
        // Listen for scroll events
        const handleScroll = () => {
            if (window.scrollY > 25) { // Show when scrolled down more than 50px
                scrollDownButton.style.opacity = 1; // Make visible
                scrollDownButton.style.visibility = 'visible';
            } else { // Hide when scrolled back to the top
                scrollDownButton.style.opacity = 0; // Hide
                scrollDownButton.style.visibility = 'hidden';
            }
        };
    
        // Attach the scroll event listener
        document.addEventListener('scroll', handleScroll);
    }
    /* initialize
     * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssParallax();
        ssMoveHeader();
        ssMobileMenu();
        ssScrollSpy();
        ssSwiper();
        ssLightbox();
        ssPhotoViewer();
        ssContactPopup();
        ssAlertBoxes();
        ssSmoothScroll();
        ssBackToTop();

        // Reveal scroll button after the first mouse movement
        // revealScrollButton('.s-hero__scroll');

    })();

})(document.documentElement);
