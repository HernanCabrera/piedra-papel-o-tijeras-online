<template>
  <v-container>
    <v-layout row>
      <v-flex sm8 offset-sm2>
        <v-card>
          <v-list>
            <v-subheader>Redes sociales</v-subheader>
            <template v-for="redes in listaDeRedes">
              <v-list-tile 
                avatar
                :key="redes.id"
                :href="redes.url"
                target="_blank">
                <v-list-tile-action>
                  <div :class="redes.icon" class="icon"></div>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="redes.titulo"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  export default {
    data () {
      return {
        listaDeRedes: [
          {
            id: 0,
            titulo: 'Facebook',
            icon: 'icon-facebook',
            url: 'https://www.facebook.com/Hmc97'
          },
          {
            id: 1,
            titulo: 'Instagram',
            icon: 'icon-instagram',
            url: 'https://www.instagram.com/hernanmauriciocabrera/'
          },
          {
            id: 2,
            titulo: 'Twitter',
            icon: 'icon-twitter',
            url: 'https://twitter.com/hernanmc06'
          },
          {
            id: 3,
            titulo: 'Github',
            icon: 'icon-github',
            url: 'https://github.com/HernanCabrera'
          }
        ]
      }
    }
  }
</script>

<style scoped>
@font-face {
  font-family: 'icomoon';
  src:  url('./../fonts/icomoon.eot?z8zlo3');
  src:  url('./../fonts/icomoon.eot?z8zlo3#iefix') format('embedded-opentype'),
    url('./../fonts/icomoon.ttf?z8zlo3') format('truetype'),
    url('./../fonts/icomoon.woff?z8zlo3') format('woff'),
    url('./../fonts/icomoon.svg?z8zlo3#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
}

[class^="icon-"], [class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-facebook:before {
  content: "\ea90";
}
.icon-facebook2:before {
  content: "\ea91";
}
.icon-instagram:before {
  content: "\ea92";
}
.icon-twitter:before {
  content: "\ea96";
}
.icon-github:before {
  content: "\eab0";
}

.icon {
  font-size: 32px;
}
</style>
