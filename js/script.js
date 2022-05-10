let headerMenu = document.querySelector('.header__menu');
let navToggle = document.querySelector('.header__button-toggle');
headerMenu.classList.remove('active');


navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    headerMenu.classList.toggle('active');
});
