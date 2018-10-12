export default class Likes {
  constructor() {
    this.likes = [];
  }

  // añade item a la lista de likes
  addLike(id, title, author, img) {
    const like = {
      id,
      title,
      author,
      img
    };
    this.likes.push(like);

    // Guardar data en el localStorag
    this.persistData();

    return like;
  }

  // Elimina like de la lista
  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);

    // Guardar data en el localStorage
    this.persistData();
  }

  // Comprueba si ya está añadido
  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  // Número de likes
  getNumLikes() {
    return this.likes.length;
  }

  // Almacenar los datos d elikes en el localStorage
  persistData () {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  // Leer el localStorage
  readStorage () {
    const storage = JSON.parse(localStorage.getItem('likes'));

    // Si existen likes en el localStorage los inicializamos en nuestra variable likes
    if (storage) {
      this.likes = storage;
    }
  }
}