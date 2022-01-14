function modal() {
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
}

module.exports = modal;