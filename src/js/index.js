import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * */
const state = {};

/**
* SEARCH CONTROLLER
**/
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.cleanResults();
        renderLoader(elements.searchResultsListParent);

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.recipes);

        } catch (error) {
            alert('Something wrong with the search!')
            clearLoader();
        }


    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


// Evento para los botones de paginación
elements.searchResultsPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // 10 es la base del número
        searchView.cleanResults();
        searchView.renderResults(state.search.recipes, goToPage);
    }
});

/**
* RECIPE CONTROLLER
**/
const controlRecipe = async () => {
    // capturamos el id de la url (hash)
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepara la UI para cambios
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Resalta la el elemnto seleccionado mediante una clase activa
        if (state.search) {
            searchView.highlightSelected(id);
        };

        // Crea un nuevo objeto receta
        state.recipe = new Recipe(id);

        try {
            // Recogemos los datos de la receta y parseamos los ingredientes
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calcula personas y tiempo de receta
            state.recipe.calcServings();
            state.recipe.calcTime();

            // Renderiza la receta
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            )

        } catch (error) {
            console.log(error)
            alert('Error processing recipe!')
        }

    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
/**
* Es lo mismo de arriba
* Escucha el evento en el objeto global
* window.addEventListener('hashchange', controlRecipe);
* Carga receta onload
* window.addEventListener('load', controlRecipe);
**/

/**
* LIST CONTROLLER
**/
const controlList = () => {
    // Crea una nueva lista si no existe ninguna todavía
    if (!state.list) state.list = new List();

    // Añade cada ingrediente a la lista y a la UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit || el.uni, el.ingredient);
        listView.renderItem(item);
    })
}

// Manejador para eliminar y actualizar la lista de items
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Manejamos el botón de eliminar
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Elimina del estado
        state.list.deleteItem(id);

        // Elimina de la UI
        listView.deleteItem(id);

    // Maneja el contador
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**
* LIKES CONTROLLER
**/

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;
    // El usuario n ole ha dado al me gusta de la receta actual
    if (!state.likes.isLiked(currentID)) {
        // Añade like al state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );

        // Toggle el botón de me gusta
        likesView.toggleLikeBtn(true);

        // Añade el like a la UI
        likesView.renderLike(newLike);

    // El usuario ya ha pulsado sobre me gusta
    } else {
        // Elimina like del state
        state.likes.deleteLike(currentID);

        // Toggle el botón de me gusta
        likesView.toggleLikeBtn(false);

        // Elimina el like a la UI
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Manejador para mostrar likes si existen en el localStorage en la carga de la página
window.addEventListener('load', () => {
    // Creamos el objeto likes
    state.likes = new Likes();

    // Lee el localStorage y si hay algo lo incluye en state.likes
    state.likes.readStorage();

    // Muestra o no el listado de likes en función de si hay alguno
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Renderiza los likes existentes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Manejadores botones de receta
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Botón de disminuir pulsado
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            // Actualiza la UI
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Botón de aumentar pulsado
        state.recipe.updateServings('inc');
        // Actualiza la UI
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Añade ingredientes a la lista de compra
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
})
