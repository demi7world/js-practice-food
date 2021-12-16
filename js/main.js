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
          modalBtn = document.querySelectorAll('[data-modal]'),
          modalCloseBtn = document.querySelector('.modal__close');

    modalBtn.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function openModal() {
        modalWindow.classList.toggle('show');
        document.body.style.overflow = 'hidden'; //removes scrolling of modal
        clearInterval(modalTimerId);
    };

    modalCloseBtn.addEventListener('click', closeModal);

    function closeModal() {
        modalWindow.classList.toggle('show');
        document.body.style.overflow = '';
    };

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow) {
            closeModal();
        };
    });

    document.addEventListener('keydown', (e) => {
        if (modalWindow.classList.contains('show') && e.code === 'Escape') {
            closeModal();
        };
    });

    const modalTimerId = setTimeout(openModal, 3000);

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
        constructor(img, alt, title, descr, price, container) {
            this.img = img;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.transfer = 27;
            this.container = document.querySelector(container);
            this.changeToUAH();
        };

        changeToUAH() {
            this.price = this.price * this.transfer;
        };

        render() {
            const card = document.createElement('div');
            card.classList.add('menu__item');
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

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд',
        8,
        '.menu__field .container'
    ).render();
});



