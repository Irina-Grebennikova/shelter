document.addEventListener('DOMContentLoaded', function () {
    let burger = document.querySelector('.header__burger');
    let menu = document.querySelector('.header__nav');
    let mask = document.createElement('div');
    mask.classList.add('header__mask');
    document.body.querySelector('.header').prepend(mask);

    function toggleMenu() {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('lock');
        mask.classList.toggle('lock');
    }
    
    burger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });
    document.addEventListener('click', e => {
        let target = e.target;
        let link = target.closest('a'); 
        let its_menu = target == menu || menu.contains(target);
        let menu_is_active = menu.classList.contains('active');

        if (!its_menu && menu_is_active || link) {
            toggleMenu();
        }
    })
});

