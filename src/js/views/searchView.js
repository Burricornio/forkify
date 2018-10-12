import { elements } from './base'

// Obtiene el valor de l input del capo de búsqueda
export const getInput = () => elements.searchInput.value;

// Limpiar el campo de búsqueda
export const clearInput = () => {
  // Lo ponemos en dos lineas porquen o queremos retornar nada
  elements.searchInput.value = ''
};

// Limpiar el listado de recetas
export const cleanResults = () => {
  elements.searchResultsList.innerHTML = '';
  elements.searchResultsPages.innerHTML = '';
};

// Resalta receta activa en el listado
export const highlightSelected = id => {
  // Recorremos los selectores para eliminar el activo en este punto
  // document.querySelectorAll('.result__link').classList.remove('result__link--active')
  const arrayElements = Array.from(document.querySelectorAll('.results__link'));
  arrayElements.forEach(el => {
    el.classList.remove('results__link--active')
  })
  // Seleccina el elemento (se hace aquí el document.query... porque no existe al cargar la página)
  document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active')
};

/***** Parte privada sin export - No necesitamos exportarlas ******/
// Renderiza UNA receta
const renderRecipe = recipe => {
  const markup = `
  <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
  </li>
  `;
  elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
}

// Elipsis en los titulos de las recetas para que ocupen solo una línea
// 'Pasat with tomato and spinach' --- Split = ['Pasta', 'with', 'tomato', 'and', 'spinach']
/* Reduce
Primera vuelta = accumulator: 0 / accumulator + current.length = 5 / newTitle = ['Pasta']
Segunda vuelta = accumulator: 5 / accumulator + current.length = 9 / newTitle = ['Pasta', 'with]
Tercera vuelta = accumulator: 9 / accumulator + current.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
Cuarta vuelta = accumulator: 15 / accumulator + current.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
.... No entrarn en la condición
....
*/
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = []
  if (title.length > limit) {
    title.split(' ').reduce((accumulator, current) => {
      if (accumulator + current.length <= limit) {
        newTitle.push(current)
      }
      return accumulator + current.length
    }, 0);
    // Retornamos el resultado
    return `${newTitle.join(' ')} ...`;
  }
  return title;
};

// Pinta el botón correspondiente. Puede ser type: 'prev' o 'next'
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page -1 : page + 1}">
      <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
      </svg>
  </button>
`;

// Renderiza los botones de avance y retroceso según el número de página en el que estemos situados
const renderButtons = (page, numOfResults, resultsPerPage) => {
  const pages = Math.ceil(numOfResults / resultsPerPage);

  let button;

  if (page === 1 && pages > 1) {
    // Mostrar botón de siguiente página
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Mostrar los dos botones
    button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `
  } else if (page === pages && pages > 1) {
    // Mostrar botón de retroceso
    button = createButton(page, 'prev');
  }
  elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

// Mostrar los resultados en la UI - Para la paginación le pasamos como parámetro la página y el número de resultados a visualizar
export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
  // Muestra resultaos de la página actual.
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  // Hacemos un slice para recortar el array
  recipes.slice(start, end).forEach(renderRecipe) // === recipes.forEach(el => renderRecipe(el))

  // Renderiza los botones de paginación
  renderButtons(page, recipes.length, resultsPerPage);
};