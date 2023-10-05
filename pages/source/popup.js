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
      });
    } else if (
      !e.target.closest('.popup__content') &&
      wrapper.classList.contains('visible')
    ) {
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
    let src = pet.img.replace(
      '../../assets/images/',
      '../../assets/images/popup/'
    );
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
            </div>`;
    return popup;
  }

  function closePopup() {
    wrapper.classList.remove('visible');

    setTimeout(() => {
      document.body.classList.remove('lock');
      body.style.paddingRight = 0;
    }, 400);
  }
}
createPopups();
