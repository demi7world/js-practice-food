window.addEventListener('DOMContentLoaded', () => {
    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    const hideTabContent = () => {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    };

    const showTabContent = (i = 0) => {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    };

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', event => {
        const target = event.target; 

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((tab, i) => {
                if (target == tab) {
                    hideTabContent();
                    showTabContent(i);
                };
            });
        };
    });

    //Timer
    const deadline = '2021-12-30';

    const getTimeRemaining = (endtime) => {
        const t = Date.parse(endtime) - Date.parse(new Date),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60)) % 24),
              min = Math.floor((t / (1000 * 60)) % 60),
              sec = Math.floor((t / 1000) % 60);

        return {
            total: t,
            days: days,
            hours: hours,
            minutes: min,
            seconds: sec
        };
    };

    const getZero = (num) => {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        };
    };

    const setClock = (selector, endtime) => {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            };
        };
    };

    setClock('.timer', deadline);


    //Modal window
    const modalWindow = document.querySelector('.modal'),
          modalBtn = document.querySelectorAll('[data-modal]');

    modalBtn.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function openModal() {
        modalWindow.classList.toggle('show');
        document.body.style.overflow = 'hidden'; //removes scrolling of modal
        clearInterval(modalTimerId);
    };

    function closeModal() {
        modalWindow.classList.toggle('show');
        document.body.style.overflow = '';
    };

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || 
            e.target.classList.contains('modal__close')) {
            closeModal();
        };
    });

    document.addEventListener('keydown', (e) => {
        if (modalWindow.classList.contains('show') && e.code === 'Escape') {
            closeModal();
        };
    });

    const modalTimerId = setTimeout(openModal, 500000);

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= 
            document.documentElement.scrollHeight -1) {//-1px because the bug in some brousers
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
        };
    };

    window.addEventListener('scroll', showModalByScroll);

    //Menu with cards
    class MenuCard {
        constructor(img, alt, title, descr, price, container, ...classes) {
            this.img = img;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.transfer = 27;
            this.container = document.querySelector(container);
            this.classes = classes;
            this.changeToUAH();
        };

        changeToUAH() {
            this.price = this.price * this.transfer;
        };

        render() {
            const card = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                card.classList.add(this.element);
            };

            this.classes.forEach(className => card.classList.add(className));
            card.innerHTML = `
            <img src=${this.img} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>`;
            this.container.append(card);
        };
    };

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });


    //Forms
    const forms = document.querySelectorAll('form'),
          message = {
              loading: 'img/form/spinner.svg',
              success: 'Спасибо! Скоро мы с вами свяжемся',
              failure: 'Что-то пошло не так...',
          };

    forms.forEach(form => {
        bindPostData(form);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    };

    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__dialog');
        prevModal.classList.add('hide');
        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close">&times;</div>
            <div class="modal__title">${message}</div>
        </div>`;

        modalWindow.append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModal.classList.add('show');
            prevModal.classList.remove('hide');
            closeModal();
        }, 4000);
    };


    //Carousel
    const slides = document.querySelectorAll('.offer__slide'),
          btnPrev = document.querySelector('.offer__slider-prev'),
          btnNext = document.querySelector('.offer__slider-next'),
          currentCounter = document.querySelector('#current'),
          totalCounter = document.querySelector('#total'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          carouselWidth = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        offset = 0; //отступ

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
});




