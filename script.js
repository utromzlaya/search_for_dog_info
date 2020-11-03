let favList = [];
const cardsContainer = document.querySelector('.dogs__about');
const searchBreedBtn = document.getElementById('js-btn-search');
const userBreedInput = document.getElementById('js-input-search');
const spinner = document.getElementById('js-spinner-id');
const favContainer = document.getElementById('fav-container');
const resultList = document.getElementById('result-list');

function saveRequestQueryPromise(name) {
    return getBreedByStringPromise(name)
        .then(res => {
            localStorage.setItem(res.breed.id, JSON.stringify(res));
            return res;
        });
}

function getSavedItem(idEl) {
    return JSON.parse(localStorage.getItem(idEl));
}


function deleteItemFromStorage(id) {
    localStorage.removeItem(id);
}

function getAllBreedsPromise() {
    return superagent.get('https://api.thedogapi.com/v1/breeds')
        .then(response => response.body);
}

function addbreedToFavList(obj) {
    if (obj == null || undefined) return;
    let favItem = document.createElement('li');
    favItem.classList.add('list-group-item');
    favItem.setAttribute('id', obj.breed.id);
    favItem.innerText = obj.breed.name;
    return favItem;
}

function getBreedByStringPromise(breedQuery) {
    return superagent.get(`https://api.thedogapi.com/v1/breeds/search?q=${breedQuery}`)
        .then((response) => {
            const breed = response.body[0];

            return superagent.get(`https://api.thedogapi.com/v1/images/search?breed_id=${breed.id}`);
        })
        .then((response) => {
            const fullBreedInfo = {
                breed: response.body[0].breeds[0],
                img: response.body[0]
            };
            delete fullBreedInfo.img.breeds;

            return Promise.resolve(fullBreedInfo);
        });
}

function createListOfDogsForInput(arrayOfBreedsObj) {
    let newList = [];
    arrayOfBreedsObj.forEach(obj => newList.push(obj.name));
    return newList;
}

function createResultList(breed) {
    let favBtn = document.createElement('button');
    favBtn.classList.add('form-btn', 'result-btn');
    favBtn.innerText = breed.breed.name;
    favBtn.setAttribute('id', breed.breed.id);
    return favBtn;
}

function createCardFromBreed(breed) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('style', 'width: 18rem;')

    let cardImg = document.createElement('img');
    cardImg.classList.add('card-img-top', 'img-fluid', 'img-thumbnail');

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');

    let cardInfoText = document.createElement('p');
    cardInfoText.classList.add('card-text');

    cardImg.setAttribute('src', breed.img.url);

    card.append(cardImg);

    cardTitle.innerText = breed.breed.name;
    cardInfoText.innerText = `Weight: ${breed.breed.weight.metric} kg \n Height: ${breed.breed.height.metric} cm \n ${breed.breed.temperament} \n Life span: ${breed.breed.life_span}`;

    cardBody.append(cardTitle, cardInfoText);
    card.append(cardBody);

    return card;
}

function addBreedToFav(event) {
    if (!event.target.matches('button')) return
    saveRequestQueryPromise(event.target.textContent)
        .then(obj => {
            cardsContainer.appendChild(createCardFromBreed(obj));
            favContainer.prepend(addbreedToFavList(obj));
            $('.dogs__about').slick("refresh");
        })

}

function deleteFromFav(event) {
    if (!event.target.matches('li')) return
    deleteItemFromStorage(event.target.id);
    event.target.innerText = '';
}

function fillFavListFronStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        favList.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
    favList.map(obj => addbreedToFavList(obj));
    return favList;
}
$(document).ready(() => {
    if (localStorage.length !== 0) {
        fillFavListFronStorage().map(obj => {
            favContainer.prepend(addbreedToFavList(obj));
            cardsContainer.append(createCardFromBreed(obj));
            // $('.dogs__about').slick("refresh");
        });

    }
    $('.dogs__about').slick({
        dots: true,
        arrows: false,
        infinite: true,
        speed: 300,
        fade: true,
        cssEase: 'linear'
    });

    getAllBreedsPromise()
        .then((breedsObjectsArray) => {
            autocomplete(userBreedInput, createListOfDogsForInput(breedsObjectsArray));
        });

    searchBreedBtn.addEventListener('click', (event) => {
        spinner.classList.remove('js-spinner');
        getBreedByStringPromise(userBreedInput.value)
            .then(breedInfo => {
                spinner.classList.add('js-spinner');
                resultList.append(createResultList(breedInfo));
            })
    });
    resultList.addEventListener('click', addBreedToFav);
    favContainer.addEventListener('click', deleteFromFav);
});
//for clearing all storage
// function deleteFromStorage() {
//     Object.keys(localStorage).forEach(el=>localStorage.removeItem(el));
// }