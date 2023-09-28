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
