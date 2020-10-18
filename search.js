const searchBreedBtn = document.getElementById('js-btn-search');  //записываю кнопку поиска
const userBreedInput = document.getElementById('js-input-search'); //записываю инпут

const infoTextAboutBreedContainer = document.getElementById('js-info__text');  //записываю див инфы
const infoTextBreedName = document.getElementById('js-info__name');  //заголовок названия породы

const infoTextAboutBreed = document.createElement('p');  //создаю абзац для текст с хар-ми

const infoText = document.getElementById('js-display-none');  //класс для скрытия/показа дива с инфой

let breedId;  //переменная для записи ид

const dogImgContainer = document.getElementById('js-info__image');  //контейнер-див для фото

const dogImg = document.createElement('img');  //фото породы  и класс
dogImg.className = 'image-dog';

searchBreedBtn.addEventListener('click', (event) => {
superagent
    .get('https://api.thedogapi.com/v1/breeds')
    .then((res) => {
        //сравнение введеной породы и даты с дог апи

        //----------------не сработал фильтр и файнд
        res.body.forEach(obj => {
            if (userBreedInput.value == obj.name) {
                infoTextBreedName.innerText = obj.name;  //добавляю имя породы в загаловок
                //добавляю описание породы в абзац инфо
                infoTextAboutBreed.innerText = `Weight: ${obj.weight.metric} kg \n Height: ${obj.height.metric} cm \n ${obj.temperament} \n Life span: ${obj.life_span}`
                infoTextAboutBreedContainer.append(infoTextAboutBreed);  //добавляю абзац инфо в див контейнер
                
                breedId = obj.id;   //сохраняю  и вовзращаю айди породы для поиска картинки
            }
        })
        return breedId;
    })
    .then((breedId) => {
        superagent
        .get('https://api.thedogapi.com/v1/images/search?breed_id=' + breedId) //поиск фото по айди
        .then((res)=>{
            dogImg.src = res.body[0].url;  //сохраняю ссылку в тег картинки и добавляю в контейнер

            dogImgContainer.append(dogImg);
            infoText.classList.remove("dogs__about"); //убираю класс скрытия
        })
    })
    .catch(err =>
        console.log('ERROR')
    );
})
