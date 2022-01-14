window.addEventListener('DOMContentLoaded', () => {

    const tabs = require('./modules/tabs'),
          modal = require('./modules/modal'),
          timer = require('./modules/timer'),
          cards = require('./modules/cards'),
          calc = require('./modules/calc'),
          forms = require('./modules/forms'),
          carousel = require('./modules/carousel');

    tabs();
    modal();
    timer();
    cards();
    calc();
    forms();
    carousel();
});  

