# Redux React Typescript Grider

- Vamos a crear un input donde el usuario/a va a escribir el nombre de un paquete y al darle al botón Submit vamos a hacer una búsqueda con la API de npm
- Instalo:

> npm i --save-exact react-redux redux @types/react-redux redux-thunk@2.3.0 axios@0.21.1
----

## Redux Store Design

- Cuando trabajes con redux, date un tiempo para pensar en el diseño
- Para hacer una búsqueda de un paquete llamado bootstrap, esta sería la url que usaríamos

> registry.npmjs.org/-/v1/search?text=bootstrap

- Puedo analizar la respuesta colocando la url en el navegador
- En el objeto objects tengo un arreglo con el nombre de los paquetes, la versión, scope, descripción, keywords....
- Vamos a hacer fetch a 'packages' de NPM
  - 'package' es una palabra reservada en TS, por lo que vamos a llamar a los NPM packages 'repositories'
- Entonces esta va a ser la Store
- **Repositories**
  - **Data**: Lista de repos en NPM
  - **Loading**: true/false mientras hacemos el fetching de la data
  - **Error**: mensaje de error si ocurre algo durante el fetching
- Tenemos una pieza de state llamada Repositories
- Esta pieza del state estará producida por un repositories reducer
- Este reducer tendrá 3 propiedades dentro
- Pensemos en los diferentes **Action Creators**. Solo necesitamos una
  - searchRepositories(name)
  - Este searchrepositories va a hacer el **dispatch** de varias **acciones**
    - Actions:
      - SearchRepositories
      - SearchRepositoriesSuccess
      - SerachRepositoriesError
    - Necesitamos los tipos para estas acciones para poder identificarlas dentro del reducer
    - Action Types:
      - 'search_repositories'
      - 'search_repositories_success'
      - 'search_repositories_error'
- Podemos estructurar el árbol de directorios con un /src y dentro la carpeta components y otra con todo lo de redux
- En la carpeta de redux añadiremos un archivo de barril index.ts para tener todo lo de redux disponible en un solo archivo 
------

## Reducer Setup

















