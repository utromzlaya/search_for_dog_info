superagent
    .get('https://api.thedogapi.com/v1/breeds')
    .then(function (res) {
        const dogsString = res.body.map(dog => dog.name); //получаем массив объектов пород


        const dogList = document.getElementById('dog__list'); //находим куда будут сохранятся породы

        const listContainer = document.createElement('div'); //блок контейнер и его класс
        listContainer.className = "list__container";

        dogsString //прохожусь по массиву строк названий пород
            .forEach((str) => {
                let listItem = document.createElement('div'); //блок породы и его класс
                listItem.className = "list-item";

                listItem.innerText = str; //записываю элемент массива в блок и добавляю в блок контейнер
                listContainer.append(listItem);
            });
        dogList.append(listContainer); //добавляю блок контейнер в мой html
    })
    .catch(err =>
        console.log('ERROR')
    );

