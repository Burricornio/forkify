export const elements = {
  searchInput: document.querySelector('.search__field'),
  searchForm: document.querySelector('.search'),
  searchResultsList: document.querySelector('.results__list'),
  searchResultsListParent: document.querySelector('.results'),
  searchResultsPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shoppingList: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
  loader: 'loader'
}

// Crea el loader
export const renderLoader = parentElement => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `
  parentElement.insertAdjacentHTML('afterbegin', loader);
};

// Elimina el loader
export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`)
  if (loader) loader.parentElement.removeChild(loader);
};