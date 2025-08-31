var swiper = new Swiper(".swiper", {
    loop: true,
    loopedSlides: 4,
    watchSlidesProgress: true,
    grabCursor: true,
    centeredSlides: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    },
    slidesPerView: 1,
    spaceBetween: 30,
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 30,
            centeredSlides: false
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
            centeredSlides: false
        }
    }
});