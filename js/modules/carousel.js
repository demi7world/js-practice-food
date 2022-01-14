function carousel() {
    const slides = document.querySelectorAll('.offer__slide'),
          btnPrev = document.querySelector('.offer__slider-prev'),
          btnNext = document.querySelector('.offer__slider-next'),
          currentCounter = document.querySelector('#current'),
          totalCounter = document.querySelector('#total'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          carouselWidth = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        offset = 0;

    if (slides.length < 10) {
        totalCounter.textContent = `0${slides.length}`;
        currentCounter.textContent = `0${slideIndex}`;
    } else {
        totalCounter.textContent = slides.length;
        currentCounter.textContent = slideIndex;
    };
    
    slidesWrapper.style.overflow = 'hidden';
    
    slidesField.style.cssText = `
        width: ${100 * slides.length}%;
        display: flex;
        transition: 0.5s all;
    `;
    
    slides.forEach(slide => {
        slide.style.width = carouselWidth;
    });

    function getDigits(str) {
        return +str.replace(/\D/g, ''); 
    };

    function setNavElements() {
        if (slides.length < 10) {
            currentCounter.textContent = `0${slideIndex}`;
        } else {
            currentCounter.textContent = slideIndex;
        };

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    };

    btnNext.addEventListener('click', () => {
        if (offset == getDigits(carouselWidth) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += getDigits(carouselWidth);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        };

        setNavElements();
    });

    btnPrev.addEventListener('click', () => {
        if (offset == 0) {
            offset = getDigits(carouselWidth) * (slides.length - 1);
        } else {
            offset -= getDigits(carouselWidth);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        };

        setNavElements();
    });


    //Slider navigation
    const slider = document.querySelector('.offer__slider'),
          dots = [];

    slider.style.position = 'relative';

    const indicators = document.createElement('ol');
    indicators.classList.add('carousel-indicators');

    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');

        if (i == 0) {
            dot.style.opacity = 1;
        }

        indicators.append(dot);
        dots.push(dot);
    };

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = getDigits(carouselWidth) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;

            setNavElements();
        });
    });
}

module.exports = carousel;