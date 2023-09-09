import {BOOKS_PER_PAGE, authors, genres, books} from './data.js';

/**
 * CONTANTS USED IN THE APP
 */
let page = 1;
const css = {
    day: ['255, 255, 255', '10, 10, 20'],
    night: ['10, 10, 20', '255, 255, 255'],
}
/**
 * An object literal that contains references to all the HTML elements
 * referenced through the operation of the app either upon initialisation or
 * while its running (via event listeners). This ensure that all UI elements can
 * be accessed and seen in a structured manner in a single data structure.
 */
const html = {
    header: {
        search: document.querySelector('[data-header-search]'),
        settings: document.querySelector('[data-header-settings]') ,
    },
    main: {
        mainContainer: document.querySelector('.list'),
        list: document.querySelector('[data-list-items]'),
        message: document.querySelector('[data-list-message]'),
        button: document.querySelector('[data-list-button]'),
    },
    active: {
        overlay: document.querySelector('[data-list-active]'),
        close: document.querySelector('[data-list-close]'),
        image: document.querySelector('[data-list-image]'),
        imageBlur: document.querySelector('[data-list-blur]'),
        title: document.querySelector('[data-list-title]'),
        subtitle: document.querySelector('[data-list-subtitle]'),
        summary: document.querySelector('[data-list-description]'),
    },
    search: {
        overlay: document.querySelector('[data-search-overlay]'),
        form: document.querySelector('[data-search-form]'),
        title: document.querySelector('[data-search-title]'),
        genres: document.querySelector('[data-search-genres]'),
        authors: document.querySelector('[data-search-authors]'),
        cancel: document.querySelector('[data-search-cancel]'),
        save: document.querySelector('[form="search"]')
    },
    settings: {
        overlay: document.querySelector('[data-settings-overlay]'),
        form:  document.querySelector('[data-settings-form]'),
        cancel: document.querySelector('[data-settings-cancel'),
        save: document.querySelector('[form="settings"]'),
        theme: document.querySelector('[data-settings-theme]'),
    },
}

/**
 * An arranged book array that contains all the books with their
 * respective infromation
 * bookArray is created filter only the required information that will be used in the app  
 */
let bookArray = [];
const bookLength = books.length;
 for (let i=0; i < bookLength; i++){
    const book = {
        id: books[i].id,
        title: books[i].title,
        author: authors[books[i].author],
        image: books[i].image,
        summary: books[i].description,
        genre: books[i].genres,
        published: books[i].published,
     };
    bookArray.push(book);
}

/**
 * This function dynamically adds genre <select> options to the HTML DOM
 * the genres are generated from the data.js API converted into an an array,
 * that contains only it's values, not the keys.
 * This enables the user to easily search or filter books by genre.
 * @return {HTMLElement}
 */
const createGenresHtmlOptions = () =>{
    const fragment = document.createDocumentFragment()
    const genresArray = ['All Genres'].concat(Object.values(genres))
    const {search: {genres: genresElement}} = html;    
    for (const genre of genresArray) {
        const option = document.createElement('option')
        option.value = genre;
        option.innerHTML = genre;
        fragment.appendChild(option)
    }
    genresElement.appendChild(fragment);
    return fragment
}
createGenresHtmlOptions();

/**
 * This function dynamically adds author <select> options to the HTML DOM
 * the genres are generated from the data.js API converted into an an array,
 * that contains only it's values, not the keys.
 * This enables the user to easily search or filter books by genre.
 * @return {HTMLElement}
 */
const createAuthorsHtmlOptions = () => {
    const authorsArray =['All Authors'].concat(Object.values(authors));
    const fragment =  document.createDocumentFragment();
    const {search: {authors: authorsElement}} = html;
    for (const author of authorsArray){
        const option = document.createElement('option');
        option.value = author;
        option.innerHTML = author;
        fragment.appendChild(option);
    }
    authorsElement.appendChild(fragment);
    return fragment;
} 
createAuthorsHtmlOptions();


const extracted = bookArray.slice(0, BOOKS_PER_PAGE)
/**
 * createPreview takes a book and create an object that only contains title,
 * author, id, image.
 * This is used when rendering the books to be added in HTML DOM
 * @param {object} book
 * @return {HTMLElement}
 */
const createPreview = (book) =>{
    fragment = document.createDocumentFragment()

    for ({ author, image, title, id }; extracted; i++) {
        const preview = createPreview({
            author,
            id,
            image,
            title
        })

        fragment.appendChild(preview)
    }
    return fragment;
}
/**
 * Takes any book as an object literal and converts it a
 * HTML element that can be appended to the DOM. Creating book elements
 * individually prevents the JavaScript having to re-render the entire DOM every
 * time a book is created.
 *
 * @param {object} booksToShow
 * @returns {HTMLElement}
 */
const renderPreview = (booksToShow) => {
    const {main: {list, button}} = html;  
    const fragment = document.createDocumentFragment();

    for (const book of booksToShow){
            const image = book.image;
            const title = book.title;
            const author = book.author;
            const id = book.id;

            const bookList = document.createElement('button');
            bookList.classList = 'preview';
            bookList.setAttribute('id', `${id}`);
            
            bookList.innerHTML = `
            <img class = "preview__image"
                    src = ${image}
            />
            <div class="preview__info">
            <h3 class="preview_title">${title}</h3>
            <div class="preview__author">${author}</div>
            </div>`;

            fragment.appendChild(bookList);
            list.appendChild(fragment);            
        } 
        return list;       
}

/**
 * The function calculates the remaining books to be rendred and 
 * also creates an inner HTML for the update button
 * the button is disabled when there are no more books to show
 */
    
const updateShowMoreButton = () => {
    const remainingBooks = bookArray.length - (page* BOOKS_PER_PAGE);
    html.main.button.disabled = remainingBooks <= 0;
    html.main.button.innerHTML = /* html */`
        <span>Show more</span>
        <span class="list__remaining">${remainingBooks > 0 ? remainingBooks: 0}</span>`;
}

/**
 * This function handles what happens the user wants to display more books
 * The page is increamented by 1 everytime the user clicks on the button
 * and the function calls the renderPreview function and the updateShowMoreButton functions
 */
const handleShowMoreClick = () =>{
    page = page +1;
    renderPreview(bookArray.slice(((page -1) *BOOKS_PER_PAGE), (page*BOOKS_PER_PAGE)));
    updateShowMoreButton();
}

/**
 * Initial rendering of the books when the page is loaded
 * The first page will have the first 36 books and the double that as
 * the user continues to show more books
 */
renderPreview(bookArray.slice((page -1), BOOKS_PER_PAGE));
updateShowMoreButton();

/**
 * This handler fires when the user clicks on the clicks on a specific book,
 * the function gets the book element using its class name and 
 * searches in bookArray to retrive book information
 * A dialog overlay is show which contains information about the book
 * and if a close button is closed, the overlay will close;
 * @param {Event} event 
 */
function activeHandle (event){
    const {active: {overlay, image, imageBlur, title, summary, subtitle, close}} = html; 

    const bookElement = event.target.closest('.preview').id
    let currentBook = []
    for (const book of bookArray) {
        if (bookElement === book.id){
            currentBook = book;
        }
    }
    title.innerHTML = currentBook.title;
    subtitle.innerHTML = `${currentBook.author} (${new Date((currentBook.published)).getFullYear()})`;
    summary.innerHTML = currentBook.summary;
    image.src = currentBook.image;
    imageBlur.src = currentBook.image;
    overlay.show();
    close.addEventListener('click', function(event){
        event.preventDefault();
        overlay.close();
    })
}

/**
 * This handler fires when the user clicks on the clicks on the settings button,
 * a dialog overlay will show that consists of theme options a user can choose from
 * A cancel button is availiable if the user decides to not change the settings
 * @param {Event} event 
 */
function handlerSettings(event){
    const {settings: {overlay, cancel}} = html;
    overlay.show();
  
    cancel.addEventListener('click', function(){
        overlay.close();
    })
} 

/**
 * This handler fires when the user clicks on the save button to change theme settings,
 * This allows the user to toggle between dark and light mode,
 * the function also determines if the user preverence from their desktop is dark or light modes,
 * and adapts accordingly
 * @param {Event} event
 */

 const handlerSaveSettings = (event) => {
    const {settings: {overlay, theme, form, save}} = html;
    event.preventDefault();
    const selectedTheme = theme.value; 

     const v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';

    if (selectedTheme === 'night'){
        document.documentElement.style.setProperty('--color-light', `rgb(${css[selectedTheme][0]})`);
        document.documentElement.style.setProperty('--color-dark', `rgb(${css[selectedTheme][1]})`);
    }
    
    if (selectedTheme === 'day'){
        document.documentElement.style.setProperty('--color-light', `rgb(${css[selectedTheme][1]})`);
        document.documentElement.style.setProperty('--color-dark', `rgb(${css[selectedTheme][0]})`);

    }
    overlay.close();
    form.reset()
}
  
/**
 * This handler fires when a user clicks on the seach button 
 * A dialog overlay is shown to allow the user to search a book,
 * either by title, author or genres
 * the cancel button is used to close the overlay and resets the dialog or form.
 * @param {Event} event
 */
const handlerSearch = (event) => {
    const {search: {overlay, form, cancel}} = html;
    overlay.show();
    cancel.addEventListener('click', function(){
        overlay.close();
        form.reset();
    })
}

/**
 * This handler fires when the user clicks on search on the search dialog overlay
 * The books are filtered based on the user input or options selected
 * The books which do not match the searched are hidden and
 * only books matching the search will be displayed
 * If no match if found, a message will be displayed for the user to narrow their search;
 * @param {Event} event
 */
const handlerSearchSave = (event) => {
    const {search: {overlay, title, form, authors, genres:genresValue}} = html;
    const {main: {list}} = html;
    event.preventDefault();
    const titleFilter = html.search.title.value.toLowerCase();
    const authorFilter = authors.value;
    const genreFilter = genresValue.value;

    const searchedBooks = bookArray.filter((book) =>{
        let genreArray = [];
        for (let i=0; i < book.genre.length; i++){
            let genreItem1 = '';
            for (const genreItem of book.genre){
                genreItem1 = genres[genreItem];  
            }
            genreArray.push(genreItem1);
        }

        const titleMatch = book.title.toLowerCase().includes(titleFilter);
        const authorMatch = authorFilter === 'All Authors' || book.author.includes(authorFilter);
        const genreMatch = genreFilter === 'All Genres' || genreArray.includes(genreFilter);
        return titleMatch && authorMatch && genreMatch;
    })
    if (searchedBooks.length < 1){
        overlay.close();
        form.reset();
        const allBook = renderPreview(bookArray);
        const allBookButtons = allBook.querySelectorAll('button')
        for (const book of allBookButtons){
            html.main.button.style.display = 'none'
            book.classList.replace('preview', 'preview_hidden');
         }
        html.main.button.style.display = 'none'
        html.main.message.style.display = 'block';
        html.header.search.addEventListener('click', function (event){
            html.main.message.style.display = 'none';
        });

    }else{
        const allBook = renderPreview(bookArray);
        const a = allBook.querySelectorAll('button')
        for (const book of a){
            html.main.button.style.display = 'none'
            book.classList.replace('preview', 'preview_hidden');
         }
        
        for (let i = 0; i < searchedBooks.length; i++) {
            const bookId = searchedBooks[i].id;
            const matchingBook = document.getElementById(`${bookId}`);
            if (matchingBook) {
                matchingBook.classList.replace('preview_hidden', 'preview');
            }
            overlay.close();
            form.reset();
        }
    }
}
/**
 * Event listeners for fire up the handlers for the full functionality of the application
 */
html.main.button.addEventListener('click', handleShowMoreClick)

html.main.list.addEventListener('click', activeHandle);

html.header.settings.addEventListener('click', handlerSettings);

html.settings.save.addEventListener('click', handlerSaveSettings);

html.header.search.addEventListener('click', handlerSearch);

html.search.save.addEventListener('click', handlerSearchSave);