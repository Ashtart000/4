// +1. Рефактор коду
// +2. Створення placeholde'ra для картинки
// +3. Поки наша картинка вантажиться, ми показуємо placeholder, коли картинка завантажиться
// -> змінюємо наш placeholder на завантажену картинку користувача

const root = document.querySelector('#root');

function imageLoadHandler({ target }) {
    console.log('image successfully loaded');
    const parentWrapper = document.getElementById(`wrapper${target.dataset.id}`);
    parentWrapper.append(target);
}

function imageErrorHandler({ target }) {
    target.remove();
    console.log('image loading has error');
}

function createCard(user) {
    // 1 дія: створення обгортки для картинки
    const imageWrapper = createImageWrapper(user);

    // 3 дія: створення h2
    const h2 = createElement('h2', { classNames: ['username'] }, `${user.name.title} ${user.name.first} ${user.name.last}`);

    // 4 дія: створення p
    const p = createElement('p', { classNames: ['description'] }, `${user.location.country}, ${user.location.state}, ${user.location.city}`);

    // 5 дія: створення article, повертаємо створений article, чіпляємо до article img, h2, p
    return createElement('article', { classNames: ['card-wrapper'] }, imageWrapper, h2, p);
}

/**
 * 
 * @param {Object} user - об'єкт юзера, картинку для якого створюємо
 * @returns {HTMLElement} - картинка, яку ми створили
 */
function createUserImage(user) {
    // 1 дія: створюємо картинку
    const img = document.createElement('img');

    // 2 дія: додаємо атрибути і класи до картинки
    img.setAttribute('src', user.picture.large);
    img.setAttribute('alt', `${user.name.title} ${user.name.first} ${user.name.last}`);
    img.dataset.id = user.login.uuid; // data-id
    img.classList.add('card-image');

    // 3 дія: реєструємо обробники подій завантаження ресурсу
    img.addEventListener('load', imageLoadHandler);
    img.addEventListener('error', imageErrorHandler);

    return img;
}

function createImageWrapper(user) {
    // 1 дія: створення обгортки для картинки. Обгортка - placeholder
    const imgWrapper = createElement('div', { classNames: ['image-wrapper'] });
    imgWrapper.setAttribute('id', `wrapper${user.login.uuid}`);
    imgWrapper.style.backgroundColor = stringToColor(`${user.name.title} ${user.name.first} ${user.name.last}`);
    // 2 дія: створення картинки
    const img = createUserImage(user);
    return imgWrapper;
}

const uploadBtn = document.querySelector('#upload-btn');
uploadBtn.addEventListener('click', clickHandler);

function clickHandler({target}) {
    const userCount = target.nextElementSibling.value;

    fetch(`https://randomuser.me/api/?results=${userCount}`)
        .then((response) => { return response.json() })
        .then((data) => {
            const {results} = data;
            console.log(results)
            const cardArray = results.map((user) => createCard(user)); // 1
            root.append(...cardArray); // 2
        })
}



/*

<article class="card-wrapper">
            <div class="image-wrapper">
                <img src="https://www.ohchr.org/sites/default/files/styles/hero_image_2/public/2021-07/Ethiopia-UN0418425.jpg?itok=7wJB8CbZ"
                    alt="John" class="card-image">
            </div>
            <h2 class="username">John</h2>
            <p class="description">user 1</p>
        </article>

*/

/**
 * 
 * @param {String} tagName - тег елемента, який потрібно створити
 * @param {Object} options
 * @param {String[]} optins.classNames - список класів 
 * @param  {Node} children - список дочірніх вузлів
 * @returns {HTMLElement} - створений елемент
 */

function createElement(tagName, { classNames }, ...children) {
    const elem = document.createElement(tagName);
    elem.classList.add(...classNames);
    elem.append(...children);

    return elem;
}

function stringToColor(str) {
    let hash = 0;
    str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        colour += value.toString(16).padStart(2, '0')
    }
    return colour
}
