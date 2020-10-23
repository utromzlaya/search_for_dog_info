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
    return listInnerContainer;
}

function createCardFromBreed(breed) {

    const breedName = document.getElementById('info__name');
    const breedImage = document.getElementById('image-dog');
    const breedText = document.getElementById('info__text');

    breedName.innerText = (breed.breed.name);
    breedImage.src = breed.img.url;
    breedText.innerText = `Weight: ${breed.breed.weight.metric} kg \n Height: ${breed.breed.height.metric} cm \n ${breed.breed.temperament} \n Life span: ${breed.breed.life_span}`
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
            (createCardFromBreed(breedInfo));
            cardsContainer.classList.remove('js-display-none');
        })
    });
});