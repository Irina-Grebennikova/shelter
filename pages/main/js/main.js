
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


async function getPetsData() {
    const response = await fetch('../source/pets.json');
    const data = await response.json();
    return data;
}

async function createSlider() {
    const petsData = await getPetsData();
    const slider = document.querySelector('.our-friends__slider');
    const shift = 1080;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        array.push(array[1]);
        return array;
    }
    function shuffleAndSlice(array) {
        array = array.filter((el, i) => el !== array[0] & el !== array[1] & el !== array[2]);

        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.slice(2);
    }
    let pets = shuffle(petsData);
    function createCards(pets, where) {
        for (let pet of pets) {
            let card = document.createElement('div');
            card.classList.add('our-friends__card', 'card');
            card.innerHTML = `
            <img class="card__image" src="${pet.img}" alt="">
            <p class="card__name">${pet.name}</p>
            <button class="card__button button button_border">Learn more</button>`;
            switch (where) {
                case 'append':
                    slider.append(card);
                    break;
                case 'prepend':
                    slider.prepend(card);
                    break;
            }
        }
    }
    createCards(pets, 'append');

    let prevBtn = document.getElementById('arrow-prev');
    let nextBtn = document.getElementById('arrow-next');
    prevBtn.addEventListener('click', function toLeft() {
        prevBtn.removeEventListener('click', toLeft);
        slider.style.marginLeft = parseInt(getComputedStyle(slider).marginLeft, 10) + shift + 'px';
        setTimeout(() => {
            prevBtn.addEventListener('click', toLeft);
        }, 1000);
        if (parseInt(slider.style.marginLeft) >= 1080) {
            petsToAdd = shuffleAndSlice(pets);
            createCards(petsToAdd, 'prepend');
            slider.style.marginLeft = '0px';
        }
    })
    nextBtn.addEventListener('click', function toRight() {
        nextBtn.removeEventListener('click', toRight);
        slider.style.marginLeft = parseInt(getComputedStyle(slider).marginLeft, 10) - shift + 'px';
        setTimeout(() => {
            nextBtn.addEventListener('click', toRight);
        }, 1000);
        
        if (parseInt(slider.style.marginLeft) <= -3240) {
            petsToAdd = shuffleAndSlice(pets);
            createCards(petsToAdd, 'append');
        }
    })
}

createSlider();
async function getData() {
    const response = await fetch('../source/pets.json');
    const data = await response.json();
    return data;
}

async function createPopups() {
    const petsData = await getData();
    let wrapper = document.getElementById('popup');
    let body = document.body;
    const lockPaddingValue = window.innerWidth - body.clientWidth + 'px';
    let name;

    document.addEventListener('click', (e) => {
        let card = e.target.closest('.card');
        if (card) {
            openPopup(card);

            let closeBtn = document.querySelector('.popup__close');
            closeBtn.addEventListener('click', () => {
                closePopup();
            })
        } else if (!e.target.closest('.popup__content') && wrapper.classList.contains('visible')){
            closePopup();
        }
    });
    let currPopup;
    function openPopup(card) {  
        if (name === card.querySelector('.card__name').innerText) {
            showPopup();
            return;
        } else if (currPopup) {
            currPopup.remove();
        }
        let newPopup = drawPopup(card);
        currPopup = newPopup;
        wrapper.append(newPopup);
        showPopup();
    }
    function showPopup() {
        wrapper.classList.add('visible');
        body.classList.add('lock');
        body.style.paddingRight = lockPaddingValue;
    }
    function drawPopup(card) {
        name = card.querySelector('.card__name').innerText;
        let pet;
        for (let el of petsData) {
            if (el.name == name) pet = el;
        }
        let src = pet.img.replace('../../assets/images/', '../../assets/images/popup/');
        src = src.replace('pets-', '');
        src = src.replace('jpg', 'png');
        let popup = document.createElement('div');
        popup.classList.add('popup__body');
        popup.innerHTML = `
            <div class="popup__content">
                <div class="popup__close"><img src="../../assets/icons/close.svg" alt=""></div>
                <div class="popup__image"><img src="${src}" alt=""></div>
                <div class="popup__text-block">
                    <h3 class="popup__title title">${name}</h3>
                    <div class="popup__subtitle">${pet.type} - ${pet.breed}</div>
                    <p class="popup__text">${pet.description}</p>
                    <ul class="popup__list">
                        <li class="popup__li"><strong>Age:</strong> ${pet.age}</li>
                        <li class="popup__li"><strong>Inoculations:</strong> ${pet.inoculations}</li>
                        <li class="popup__li"><strong>Diseases:</strong> ${pet.diseases}</li>
                        <li class="popup__li"><strong>Parasites:</strong> ${pet.parasites}</li>
                    </ul>
                </div>
            </div>`
        return popup;
    }

    function closePopup() {
        wrapper.classList.remove('visible');

        setTimeout(() => {
            document.body.classList.remove('lock');
            body.style.paddingRight = 0;
        }, 800)
    }
}
createPopups();