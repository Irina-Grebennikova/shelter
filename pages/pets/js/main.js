
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
async function getData() {
    const response = await fetch('../source/pets.json');
    const data = await response.json();
    return data;
}

async function main() {
    const petsData = await getData();
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    function getPetsArray(petsData) {
        let petsArray = [];
        for (let i = 0; i < 6; i++) {
            shuffledData = shuffle(petsData);
            for (let el of shuffledData) {
                petsArray.push(el);
            }
        }
        return petsArray;
    }
    const petsArray = getPetsArray(petsData);
    let cards;
    if (window.matchMedia('(max-width: 609px)').matches) {
        cards = 3;
    } else if (window.matchMedia('(max-width: 1229px)').matches) {
        cards = 6;
    } else {
        cards = 8;
    }
    let currentPage = 1;
    let lastPage = Math.ceil(petsArray.length / cards);
    let pageNumber = document.getElementById('pagination-page');

    let nextBtn = document.getElementById('pagination-next');
    let prevBtn = document.getElementById('pagination-prev');
    let toStartBtn = document.getElementById('pagination-first');
    let toEndBtn = document.getElementById('pagination-last');

    const m_width1229 = window.matchMedia('(max-width: 1229px)');
    m_width1229.addEventListener('change', (e) => {
        if (e.matches) {
            cards = 6;
            lastPage = Math.ceil(petsArray.length / cards);
            displayCards(petsArray, cards, currentPage);
        } else {
            cards = 8;
            lastPage = Math.ceil(petsArray.length / cards);
            displayCards(petsArray, cards, currentPage);
        }
    });

    const m_width609 = window.matchMedia('(max-width: 609px)');
    m_width609.addEventListener('change', (e) => {
        if (e.matches) {
            cards = 3;
            lastPage = Math.ceil(petsArray.length / cards);
            displayCards(petsArray, cards, currentPage);
        } else {
            cards = 6;
            lastPage = Math.ceil(petsArray.length / cards);
            displayCards(petsArray, cards, currentPage);
        }
    });

    function displayCards(arrData, cardsPerPage, page) {
        const cardsEl = document.querySelector('.main__cards');
        cardsEl.innerHTML = "";
        page--;

        const start = cardsPerPage * page;
        const end = start + cardsPerPage;
        const paginatedData = arrData.slice(start, end);

        paginatedData.forEach((el) => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('main__card', 'card');
            cardEl.innerHTML = `
        <img class="card__image" src="${el.img}" alt="">
        <p class="card__name">${el.name}</p>
        <button class="card__button button button_border">Learn more</button>`;
            cardsEl.appendChild(cardEl);
        })

        if (currentPage + 1 > lastPage) {
            nextBtn.classList.add('controls-inactive');
            toEndBtn.classList.add('controls-inactive');
        } else {
            nextBtn.classList.remove('controls-inactive');
            toEndBtn.classList.remove('controls-inactive');
        }

        if (currentPage - 1 >= 1) {
            prevBtn.classList.remove('controls-inactive');
            toStartBtn.classList.remove('controls-inactive');
        } else {
            prevBtn.classList.add('controls-inactive');
            toStartBtn.classList.add('controls-inactive');
        }
    }

    nextBtn.addEventListener('click', () => {
        if (currentPage + 1 > lastPage) return;
        currentPage++;
        pageNumber.innerText = currentPage;
        displayCards(petsArray, cards, currentPage);
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage - 1 < 1) return;
        currentPage--;
        pageNumber.innerText = currentPage;
        displayCards(petsArray, cards, currentPage);
    });

    toStartBtn.addEventListener('click', () => {
        pageNumber.innerText = 1;
        currentPage = 1;
        displayCards(petsArray, cards, 1);
    });

    toEndBtn.addEventListener('click', () => {
        pageNumber.innerText = lastPage;
        currentPage = lastPage;
        displayCards(petsArray, cards, lastPage);
    });

    displayCards(petsArray, cards, currentPage);
}

main();
