<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Crear nueva partida</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="crearPartida">
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
                :disabled="!formularioValido"
                type="submit">Crear partida</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        titulo: ''
      }
    },
    watch: {
      llavePartida (val) {
        if (val !== '') {
          const llavePartida = val
          this.$store.commit('setLlavePartida', null)
          this.$router.push('/partida/' + llavePartida)
        }
      }
    },
    computed: {
      formularioValido () {
        return this.titulo
      },
      llavePartida () {
        return this.$store.getters.llavePartida
      }
    },
    methods: {
      crearPartida () {
        if (!this.formularioValido) {
          return
        }
        const partidaDatos = {
          titulo: this.titulo
        }
        this.$store.dispatch('crearPartida', partidaDatos)
      }
    }
  }
</script>
