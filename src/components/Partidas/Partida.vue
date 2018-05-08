<template>
  <main>
    <!-- Si el otro jugador no existe. no se muestra el tablero -->
    <div class="tablero-de-puntos" v-show="elOtroJugador.jugadorId !== ''">
      <div class="contenedor-puntos-jugador izquierda">
        <div class="palito izquierda"></div>
        <div class="barra izquierda"></div>
        <div class="contenedor-puntos izquierda">
          <p class="puntos izquierda">{{ jugador.puntos }}</p>
        </div>
      </div>
      <div class="contenedor-puntos-jugador derecha">
        <div class="palito derecha"></div>
        <div class="barra derecha"></div>
        <div class="contenedor-puntos derecha">
          <p class="puntos derecha">{{ elOtroJugador.puntos }}</p>
        </div>
      </div>
    </div>

    <section class="area-de-juego contenedor" v-if="primeraCarga && elOtroJugador.jugadorId !== ''">
      <div v-if="!jugador.yaJugue" class="jugadas">
        <div v-if="!cargando" class="contenedor-mensaje-jugar">
          <p class="mensaje-juega">Juega!</p>
        </div>
        <div class="piedra contenedor-jugada" @click="cargarJugada('piedra')">
          <img src="/static/jugadas/piedra.png">
        </div>
        <div class="papel contenedor-jugada" @click="cargarJugada('papel')">
          <img src="/static/jugadas/papel.png" >
        </div>
        <div class="tijera contenedor-jugada" @click="cargarJugada('tijera')">
          <img src="/static/jugadas/tijera.png" >
        </div>
      </div>
      <div v-else class="mensaje-final">
        <div class="jugadas">
          <img v-if="jugador.jugada !== ''" class="jugada-img" :src="'/static/jugadas/' + jugador.jugada + '.png'" alt="">
          <p class="jugada-texto-vs">Vs</p>
          <v-progress-circular
            v-show="cargando"
            indeterminate
            class="primary--text"
            :width="7"
            :size="70">
          </v-progress-circular>
          <img v-if="elOtroJugador.jugada !== ''" class="jugada-img" :src="'/static/jugadas/' + elOtroJugador.jugada + '.png'" alt="">
          <p class="mensaje-del-ganador" v-if="!hayGanador">{{ mensajeDelGanador | MaysPrimera }}</p>
          <p class="mensaje-del-ganador padding" v-else>{{ mensajeFinal }} {{ mensajeDelGanador | MaysPrimera }}</p>
        </div>
        <v-btn v-show="!cargando" v-if="!hayGanador" color="primary" dark @click="reiniciarJuego()">
          !Volver a jugar!
        </v-btn>
        <v-btn v-show="!cargando" v-else color="primary" dark @click="inicializarJuego()">
          !Jugar de nuevo!
        </v-btn>
      </div>
    </section>
    <div class="contenedor-spinner contenedor" v-else>
      <v-progress-circular
        indeterminate
        class="primary--text"
        :width="7"
        :size="70">
      </v-progress-circular>
      <p class="texto-esperando">Esperando al rival...</p>
    </div>
  </main>
</template>


<script>
import * as firebase from 'firebase'
export default {
  props: ['id'],
  data () {
    return {
      primeraCarga: false,
      partida: firebase.database().ref('partidas/' + this.id),
      jugador: {
        jugada: '',
        jugadorId: '',
        yaJugue: false,
        puntos: 0
      },
      elOtroJugador: {
        jugada: '',
        jugadorId: '',
        yaJugue: false,
        puntos: 0
      },
      nombreObj: '',
      nombreObj2: '',
      mensajeDelGanador: '',
      cargando: false,
      error: false,
      intervalo: null,
      checkbox: true,
      radioGroup: 1,
      switch1: true
    }
  },
  created () {
    this.partida.once('value')
    .then((data) => {
      const obj = data.val()
      // determinar si el usuario puede o no jugar
      if (obj.jugador1.jugadorId === '' || obj.jugador1.jugadorId === this.user.id) {
        this.nombreObj = 'jugador1'
      } else if (obj.jugador2.jugadorId === '' || obj.jugador2.jugadorId === this.user.id) {
        this.nombreObj = 'jugador2'
      } else {
        this.error = true
        this.$router.push('/partidas')
      }
      // si el usuario puede jugar se carga las funciones para real time
      if (this.nombreObj !== '') {
        if (this.nombreObj === 'jugador1') {
          this.nombreObj2 = 'jugador2'
        } else {
          this.nombreObj2 = 'jugador1'
        }
        this.partida.child(this.nombreObj).update({
          jugadorId: this.user.id
        })
        this.partida.on('child_added', snapshot => {
          // Cargar jugadas del otro jugador al iniciar la coneccion
          if (typeof snapshot.val().jugadorId !== 'undefined') {
            if (snapshot.val().jugadorId !== this.user.id) {
              this.elOtroJugador.jugada = snapshot.val().jugada
              this.elOtroJugador.jugadorId = snapshot.val().jugadorId
              this.elOtroJugador.yaJugue = snapshot.val().yaJugue
              this.elOtroJugador.puntos = snapshot.val().puntos
            } else {
              this.jugador.jugada = snapshot.val().jugada
              this.jugador.jugadorId = snapshot.val().jugadorId
              this.jugador.yaJugue = snapshot.val().yaJugue
              this.jugador.puntos = snapshot.val().puntos
            }
          }
        })
        this.partida.on('child_removed', snapshot => {
          if (typeof snapshot.key !== 'undefined') {
            if (typeof snapshot.key === 'string') {
              firebase.database().ref('partidas').child(this.id).remove()
            }
          }
        })
        this.partida.on('child_changed', snapshot => {
          // Actualizar jugadas de ambos jugadores
          if (typeof snapshot.val().jugadorId !== 'undefined') {
            if (snapshot.val().jugadorId !== this.user.id) {
              this.elOtroJugador.jugada = (typeof snapshot.val().jugada === 'undefined') ? '' : snapshot.val().jugada
              this.elOtroJugador.jugadorId = (typeof snapshot.val().jugadorId === 'undefined') ? '' : snapshot.val().jugadorId
              this.elOtroJugador.yaJugue = (typeof snapshot.val().yaJugue === 'undefined') ? false : snapshot.val().yaJugue
              this.elOtroJugador.puntos = (typeof snapshot.val().puntos === 'undefined') ? false : snapshot.val().puntos
            } else {
              this.jugador.jugada = snapshot.val().jugada
              this.jugador.jugadorId = snapshot.val().jugadorId
              this.jugador.yaJugue = snapshot.val().yaJugue
              this.jugador.puntos = snapshot.val().puntos
            }
          }
        })
        this.primeraCarga = true
      }
    })
    .catch(
      () => {
        this.error = true
        this.$router.push('/partidas')
      }
    )
  },
  destroyed () {
    if (!this.error) {
      this.partida.child(this.nombreObj).update({
        jugadorId: '',
        jugada: '',
        yaJugue: false,
        puntos: 0
      })
      this.partida.child(this.nombreObj2).update({
        jugada: '',
        yaJugue: false,
        puntos: 0
      })
      this.partida.once('value')
      .then((data) => {
        const obj = data.val()
        /* Si las id de los jugadores no existe se elimina la partida */
        if (obj.jugador1.jugadorId === '' && obj.jugador2.jugadorId === '') {
          setTimeout(() => {
            firebase.database().ref('partidas').child(this.id).remove()
          }, 100)
        }
      })
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    hayGanador () {
      return this.jugador.puntos === 10 || this.elOtroJugador.puntos === 10
    },
    mensajeFinal () {
      if (this.jugador.puntos === 10 || this.elOtroJugador.puntos === 10) {
        return '!Fin de la partida!'
      }
    }
  },
  watch: {
    'jugador.yaJugue' (val) {
      if (val) {
        this.cargando = true
      }
      if (this.elOtroJugador.yaJugue && val) {
        this.cargando = false
        this.devolverMensajeDelGanador()
        this.actualizarPuntos()
      }
      if (!this.elOtroJugador.yaJugue && !val) {
        this.mensajeDelGanador = ''
      }
    },
    'elOtroJugador.yaJugue' (val) {
      if (val) {
        this.cargando = true
      }
      if (this.jugador.yaJugue && val) {
        this.cargando = false
        this.devolverMensajeDelGanador()
        this.actualizarPuntos()
      }
      if (!this.jugador.yaJugue && !val) {
        this.mensajeDelGanador = ''
      }
    },
    'jugador.jugadorId' (val) {
      /* Si ambos existen se cierra la partida al publico */
      if (val !== '' && this.elOtroJugador.jugadorId !== '') {
        this.partida.update({ yaEmpezo: true })
      }
    },
    'elOtroJugador.jugadorId' (val) {
      // Sino existe el otro jugador se abre la partida al publico
      if (val === '') {
        this.partida.update({ yaEmpezo: false })
      }
    }
  },
  filters: {
    MaysPrimera (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  methods: {
    cargarJugada (str) {
      this.partida.child(this.nombreObj).update({
        jugada: str,
        yaJugue: true
      })
    },
    devolverJugadaEnNumero (str) {
      if (str === 'piedra') {
        return 0
      } else if (str === 'papel') {
        return 1
      } else {
        return 2
      }
    },
    devolverMensajeDelGanador () {
      const jugadas = [['empataste', 'perdiste', 'ganaste'], ['ganaste', 'empataste', 'perdiste'], ['perdiste', 'ganaste', 'empataste']]
      this.mensajeDelGanador = jugadas[this.devolverJugadaEnNumero(this.jugador.jugada)][this.devolverJugadaEnNumero(this.elOtroJugador.jugada)]
    },
    actualizarPuntos () {
      if (this.mensajeDelGanador === 'ganaste') {
        this.partida.child(this.nombreObj).update({
          puntos: this.jugador.puntos + 1
        })
      } else if (this.mensajeDelGanador === 'perdiste') {
        this.partida.child(this.nombreObj2).update({
          puntos: this.elOtroJugador.puntos + 1
        })
      }
    },
    inicializarJuego () {
      this.partida.child('jugador1').update({
        jugada: '',
        yaJugue: false,
        puntos: 0
      })
      this.partida.child('jugador2').update({
        jugada: '',
        yaJugue: false,
        puntos: 0
      })
    },
    reiniciarJuego () {
      this.partida.child('jugador1').update({
        jugada: '',
        yaJugue: false
      })
      this.partida.child('jugador2').update({
        jugada: '',
        yaJugue: false
      })
    },
    copiarId () {
      const textArea = document.createElement('textarea')
      textArea.value = this.id
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }
}
</script>

<style>

p {
  margin: 0;
}
/*PUNTOS*/
.tablero-de-puntos {
  opacity: 0;
  animation: aparecer 1s ease-in forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
}
.tablero-de-puntos .contenedor-puntos-jugador {
  width: 64px;
  position: relative;
}
.tablero-de-puntos .contenedor-puntos-jugador .palito {
  width: 12px;
  height: 36px;
  border-radius: 15px;
  position: absolute;
  top: -17px;
  border: 3px solid #333333;
}
.tablero-de-puntos .contenedor-puntos-jugador .barra {
  width: 100%;
  height: 31px;
}
.tablero-de-puntos .contenedor-puntos-jugador .contenedor-puntos {
  width: 100%;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tablero-de-puntos .contenedor-puntos-jugador .contenedor-puntos .puntos {
  font-size: 44px;
  line-height: 1;
}
/*PUNTOS*/

/*IZQUIERDA*/
.tablero-de-puntos .contenedor-puntos-jugador.izquierda {
}
.tablero-de-puntos .contenedor-puntos-jugador .palito.izquierda {
  background: #ff7876;
  right: 15px;
}
.tablero-de-puntos .contenedor-puntos-jugador .barra.izquierda {
  background: #ffe49c;
  border-top-left-radius: 10px;
  border-top: 3px solid #333333;
  border-right: 1.5px solid #333333;
  border-bottom: 3px solid #333333;
  border-left: 3px solid #333333;
}
.tablero-de-puntos .contenedor-puntos-jugador .contenedor-puntos.izquierda {
  background: #d1d3d4;
  border-bottom-left-radius: 10px;
  border-top: 0px solid #333333;
  border-right: 1.5px solid #333333;
  border-bottom: 3px solid #333333;
  border-left: 3px solid #333333;
}
.tablero-de-puntos .contenedor-puntos-jugador .contenedor-puntos .puntos.izquierda {
  color: #a7a9ac;
}
/*IZQUIERDA*/

/*DERECHA*/
.tablero-de-puntos .contenedor-puntos-jugador.derecha {
}
.tablero-de-puntos .contenedor-puntos-jugador .palito.derecha {
  background: #ff5e5b;
  left: 15px;
}
.tablero-de-puntos .contenedor-puntos-jugador .barra.derecha {
  background: #ffc72d;
  border-top-right-radius: 10px;
  border-top: 3px solid #333333;
  border-right: 3px solid #333333;
  border-bottom: 3px solid #333333;
  border-left: 1.5px solid #333333;
}
.tablero-de-puntos .contenedor-puntos-jugador .contenedor-puntos.derecha {
  background: #bfc1c2;
  border-bottom-right-radius: 10px;
  border-top: 0px solid #333333;
  border-right: 3px solid #333333;
  border-bottom: 3px solid #333333;
  border-left: 1.5px solid #333333;
}
.tablero-de-puntos .contenedor-puntos-jugador .contenedor-puntos .puntos.derecha {
  color: #909293;
}
/*DERECHA*/


.area-de-juego {
  display: flex;
  justify-content: center;
  align-items: center;
}
.area-de-juego .jugadas {
  display: flex;
  margin: 30px 0;
  position: relative;
}
.area-de-juego .jugadas .contenedor-mensaje-jugar {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.area-de-juego .jugadas .contenedor-mensaje-jugar .mensaje-juega {
  font-size: 64px;
  line-height: 1.2;
  width: 100%;
  text-align: center;
  color: #fafafa;
  background: rgba(0,0,0,.8);
  transform: translateY(-200px);
  animation: entrada-mensaje-juega 1.2s ease-in 1s forwards;
}

.area-de-juego .jugadas .contenedor-jugada {
  max-width: 33%;
}

.area-de-juego .jugadas .contenedor-jugada img {
  cursor: pointer;
  transition: .3s;
  margin: 0 5px;
  max-width: 100%;
}
.area-de-juego .jugadas .contenedor-jugada img:hover {
  transform: scale(1.05);
}
.area-de-juego .jugadas .contenedor-jugada img {
  z-index: 2;
}
.area-de-juego .jugadas .piedra {
  animation: piedra .5s ease-in forwards;
}
.area-de-juego .jugadas .papel {
  animation: papel .5s ease-in forwards;
}
.area-de-juego .jugadas .tijera {
  animation: tijera .5s ease-in forwards;
}
.area-de-juego .mensaje-final {
  text-align: center;
  font-size: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.area-de-juego .mensaje-final .mensaje-del-ganador {
  position: absolute;
  background: rgb(33,33,33, 0.95);
  color: white;
  width: 100%;
  font-size: 40px;
  animation: entrada-mensaje-ganador .2s ease-out forwards;
}
.area-de-juego .mensaje-final .mensaje-del-ganador.padding {
  padding: 10px 0;
}
.area-de-juego .mensaje-final .jugadas {
  display: flex;
  align-items: center;
}
.area-de-juego .mensaje-final .jugadas .jugada-img {
  max-width: 40%;
}
.area-de-juego .mensaje-final .jugadas .jugada-texto-vs {
  margin: 0 20px;
  font-weight: 900;
  font-size: 48px;
}

.contenedor-spinner {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}


.contenedor-spinner .texto-esperando {
  font-size: 32px;
  text-align: center;
}
.contenedor {
  max-width: 800px;
  margin: 0 auto;
}
.progress-circular{
  margin: 32px;
}


@keyframes aparecer {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes piedra {
  0% {
    transform: translateY(-300px) rotate(180deg);
  }
  95% {
    transform: translateY(20px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}
@keyframes papel {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes tijera {
  0% {
    transform: translateY(300px) rotate(0);
  }
  95% {
    transform: translateY(0) rotate(0);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes entrada-mensaje-juega {
  0% {
    transform: translateY(-200px);
    opacity: 1;
    z-index: 3;
  }
  20%, 80% {
    transform: translateY(0px);
    opacity: 1;
    z-index: 3;
  }
  95% {
    transform: translateY(200px);
    opacity: 1;
    z-index: 3;
  }
  100% {
    transform: translateY(200px);
    opacity: 0;
    z-index: 1;
    display: none;
  }
}

@keyframes entrada-mensaje-ganador {
  0% {
    transform: translateY(300px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-width: 370px) {
  .tablero-y-tiempo {
    padding-top: 10px;
  }
  .area-de-juego .mensaje-final .jugadas .jugada-texto-vs {
    margin: 0;
    font-size: 32px;
  }
  .area-de-juego .jugadas {
    display: flex;
    margin: 10px 0;
    position: relative;
  }
  .tablero-de-puntos {
    transform: scale(0.8);
  }
  .contenedor-spinner .texto-esperando {
    font-size: 24px;
    text-align: center;
  }
  .tiempo {
    right: 10px;
  }
}
</style>
