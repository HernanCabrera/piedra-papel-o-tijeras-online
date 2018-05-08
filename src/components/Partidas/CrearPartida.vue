<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Crear nueva partida</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="enCrearPartida">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="titulo"
                label="Titulo"
                id="titulo"
                v-model="titulo"
                required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn
                class="primary"
                :disabled="!formIsValid"
                type="submit">Crear partida</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import * as firebase from 'firebase'
  export default {
    data () {
      return {
        titulo: ''
      }
    },
    computed: {
      formIsValid () {
        return this.titulo
      },
      user () {
        return this.$store.getters.user
      }
    },
    methods: {
      enCrearPartida () {
        if (!this.formIsValid) {
          return
        }
        const partida = {
          titulo: this.titulo,
          yaEmpezo: false,
          jugador1: {
            jugada: '',
            yaJugue: false,
            jugadorId: this.user.id,
            puntos: 0
          },
          jugador2: {
            jugada: '',
            yaJugue: false,
            jugadorId: '',
            puntos: 0
          }
        }
        const llavePartida = firebase.database().ref('partidas').push().key
        let updates = {}
        updates[llavePartida] = partida
        firebase.database().ref('partidas').update(updates)
        this.$router.push('/partida/' + llavePartida)
      }
    }
  }
</script>
