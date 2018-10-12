import axios from 'axios';
import { proxy, key } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const result = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`)
      this.title = result.data.recipe.title;
      this.author = result.data.recipe.publisher;
      this.img = result.data.recipe.image_url;
      this.url = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;
    } catch (error) {
      alert('Something went wrong :(');
    }
  }

  calcTime() {
    // Se supone que se necesitan 15 minutos por cada 3 ingredientes
    const numberOfIngredients = this.ingredients.length;
    const periods = Math.ceil(numberOfIngredients / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  // Formateo de los items de la lista de ingredientes
  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map(el => {
        // 1. Uniform units
        let ingredient = el.toLowerCase();

        unitsLong.forEach((unit, index) => {
          ingredient = ingredient.replace(unit, unitsShort[index])
        });

        // 2. Remove parentheses
        ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

        // 3. Parse ingredients into count, unit and ingredient
        const arrIng = ingredient.split(' ');
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

        let objIngredient;

        if (unitIndex > -1) {
          // Existe la unidad
          // Ex 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
          // Ex 4 cups, arrCOunt is [4]
          const arrCount = arrIng.slice(0, unitIndex);

          let count;

          if (arrCount.length === 1) {
            count = eval(arrIng[0].replace('-', '+'));
          } else {
            count = eval(arrIng.slice(0, unitIndex).join('+'));
          }

          objIngredient = {
            count,
            uni: arrIng[unitIndex],
            ingredient: arrIng.slice(unitIndex + 1).join(' ')
          }

        } else if (parseInt(arrIng[0], 10)) {
          // NO hay unidad pero el primer elemnto es un número
          objIngredient = {
            count: parseInt(arrIng[0], 10),
            unit: '',
            ingredient: arrIng.slice(1).join(' ')
          }
        } else if (unitIndex === -1) {
          // No existe la unidad y no hay numero en la primera posicion
          objIngredient = {
            count: 1,
            unit: '',
            ingredient
          }
        }

        return objIngredient;
    });

    this.ingredients = newIngredients;
  }

  // Actualiza el número de comensales y los ingredientes en función de los comensales
  updateServings (type) {
    // Para cuantas personas
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredientes
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings)
    });

    this.servings = newServings;
  }
}