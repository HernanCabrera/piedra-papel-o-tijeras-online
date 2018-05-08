<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center">
        <v-btn color="primary" dark to="/partida/nueva">Crear partida</v-btn>
      </v-flex>
    </v-layout>
    <br>
    <v-layout row>
      <v-flex sm8 offset-sm2>
        <v-card>
          <v-list>
            <v-subheader>Partidas</v-subheader>
            <template v-for="(partida, indiceDePartida) in listaDePartidas">
              <v-list-tile 
                avatar
                v-if="!partida.yaEmpezo"
                :key="partida.id"
                :to="'/partida/' + partida.id">
                <v-list-tile-action>
                  <v-icon>group_work</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="partida.titulo"></v-list-tile-title>
                </v-list-tile-content>
                <v-divider v-if="true" :key="indiceDePartida"></v-divider>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  import * as firebase from 'firebase'
  export default {
    data () {
      return {
        partidasRef: firebase.database().ref('partidas'),
        listaDePartidas: []
      }
    },
    created () {
      this.partidasRef.on('child_added', snapshot => {
        this.listaDePartidas.push({
          id: snapshot.key,
          titulo: snapshot.val().titulo,
          yaEmpezo: snapshot.val().yaEmpezo
        })
      })
      this.partidasRef.on('child_removed', snapshot => {
        const eliminarPartida = this.listaDePartidas.find(partida => partida.id === snapshot.key)
        const index = this.listaDePartidas.indexOf(eliminarPartida)
        this.listaDePartidas.splice(index, 1)
      })
      this.partidasRef.on('child_changed', snapshot => {
        if (typeof snapshot.key !== 'undefined') {
          if (typeof snapshot.key === 'string') {
            if (typeof snapshot.val().yaEmpezo !== 'undefined') {
              const partida = this.listaDePartidas.find(partida => partida.id === snapshot.key)
              partida.yaEmpezo = snapshot.val().yaEmpezo
            }
          }
        }
      })
    },
    destroyed () {
      this.partidasRef.off()
    }
  }
</script>
