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