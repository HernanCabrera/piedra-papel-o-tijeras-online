# piedra-papel-o-tijera-online

Una aplicacion para jugar al piedra, papel o tijeras online con tus amigos

## Configurando firebase

``` bash
# agregando tu coneccion a firebase en main.js
firebase.initializeApp({
  // tu configuracion a firebase
})

# cambiando las reglas en firebase (database - realtime)
{
  "rules": {
    ".read": "true",
    ".write": "auth != null"
  }
}
```


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
