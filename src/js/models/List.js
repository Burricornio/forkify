import uniqid from 'uniqid';

export default class List {
  constructor () {
    this.items = [];
  }

  // Añade item a la lista
  addItem (count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item
  }

  // Eliminar item
  deleteItem (id) {
    const index = this.items.findIndex(el => el.id === id);
    // [2,4,8] ---> splice(1,2) --> return [4,8], original Array is [2]
    // [2,4,8] ---> slice(1,2) --> return 4, original Array is [2,4,8] : No mofifica el array original
    this.items.splice(index, 1);
  }

  // Actualiza el contador de elemntos
  updateCount (id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }
};