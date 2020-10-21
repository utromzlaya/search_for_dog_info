function getAllBreedsPromise() {
    return superagent.get('https://api.thedogapi.com/v1/breeds')
    .then(response => response.body);
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

function createListFromBreeds(breedsArray) {
    const listInnerContainer = document.getElementById('js-list-inner-conteiner');
    breedsArray
        .map(obj => {
        let listItem = document.createElement('li');
        listItem.innerText = obj.name;
        listItem.classList.add('list-item');
        listInnerContainer.append(listItem);            
        });
    return listInnerContainer // новый елемент в котором уже создан список пород.
}

function createCardFromBreed(breed) {
   
    const breedInfoInnerContainer = document.createElement('div');
    breedInfoInnerContainer.setAttribute('class', 'dogs__info');

    const breedName = document.createElement('h5');
    breedName.setAttribute('class', 'info__name');

    const breedImageContainer = document.createElement('div');
    breedImageContainer.setAttribute('class', 'info__image');

    const breedImage = document.createElement('img');
    breedImage.setAttribute('class', 'image-dog');

    const breedText = document.createElement('div');
    breedText.setAttribute('class', 'info__text');


    breedName.innerText = (breed.breed.name);
    breedInfoInnerContainer.append(breedName);

    breedImage.src = breed.img.url;
    breedImageContainer.append(breedImage);

    breedInfoInnerContainer.append(breedImageContainer);

    breedText.innerText = `Weight: ${breed.breed.weight.metric} kg \n Height: ${breed.breed.height.metric} cm \n ${breed.breed.temperament} \n Life span: ${breed.breed.life_span}`
    breedInfoInnerContainer.append(breedText);

    return breedInfoInnerContainer; // новый елемент в котором уже создана карточка с породой.
}

$(document).ready(() => {
    const listContainer = document.getElementById('js-list-container');
    const cardsContainer = document.getElementById('cards-container');
    const searchBreedBtn = document.getElementById('js-btn-search');
    const userBreedInput = document.getElementById('js-input-search');
    const spinner = document.getElementById('js-spinner-id');

    getAllBreedsPromise()
        .then(breedsArray => listContainer.append(createListFromBreeds(breedsArray)));

    searchBreedBtn.addEventListener('click', (event) => {
        spinner.classList.remove('js-spinner');
        getBreedByStringPromise(userBreedInput.value)
            .then(breedInfo => {
            spinner.classList.add('js-spinner');
            cardsContainer.append(createCardFromBreed(breedInfo))
        })
    });
});