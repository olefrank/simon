import * as simon from './simon';

document.addEventListener("DOMContentLoaded", () => {
    var el = document.getElementById('simon');
    simon.createDom(el);
});
