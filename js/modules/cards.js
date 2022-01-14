function cards() {
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
}

module.exports = cards;