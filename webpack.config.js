// Se utilza para apuntar a rutas absolutas. En este caso lo necesita el punto de salida
const path = require('path');
// Plugin para copiar el index de la carpeta src a la carpeta dist
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =  {
  // Definición de puntos de entrada. Utilizamos el polyfill de Babel para promesas, array.from... porque los navegadores no soportan estas funcionalidades
  entry: ['babel-polyfill', './src/js/index.js'],
  // Definición de punto de salida
  output: {
    // Es una ruta absoluta
    path: path.resolve(__dirname, 'dist'),
    // El archivo inyectado en el index
    filename: 'js/bundle.js'
  },
  // Configuracion para el servidor webpack para ver los cambios en caliente --- npm run start
  devServer: {
    // Directotio al que apunta el servidor
    contentBase: './dist'
  },
  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      // Nombre del archivo creado en el destino
      filename: 'index.html',
      // Nombre del archivo de entrada
      template: './src/index.html'
    })
  ],
  // Loaders
  module: {
    rules: [
      {
        // Expresión regular para todos los arclearchivos que terminan en .js
        test: /\.js$/,
        // Expresión regular que excuye los archivos de la carpeta node_modules
        exclude: /node_modules/,
        use: {
          // Loader a utilizar
          loader: 'babel-loader'
        }
      }
    ]
  }
}