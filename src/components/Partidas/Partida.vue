<template>
  <main>
    <section class="area-de-juego contenedor" v-if="cargando || elOtroJugador.jugadorId !== ''">
      <app-tablero-de-puntos
        :jugador="jugador"
        :elOtroJugador="elOtroJugador">
      </app-tablero-de-puntos>

      <div v-if="!jugador.yaJugo" class="contenedor-juega">
        <div v-if="!cargando" class="contenedor-mensaje-jugar">
          <p class="mensaje-jugar">Juega!</p>
        </div>
        <ul class="jugadas-disponibles">
          <li class="piedra jugada" @click="cargarJugada('piedra')">
            <img class="img-jugada" src="/static/jugadas/piedra.png">
          </li>
          <li class="papel jugada" @click="cargarJugada('papel')">
            <img class="img-jugada" src="/static/jugadas/papel.png" >
          </li>
          <li class="tijera jugada" @click="cargarJugada('tijera')">
            <img class="img-jugada" src="/static/jugadas/tijera.png" >
          </li>
        </ul>
      </div>

      <div v-else class="contenedor-jugadas">
        <div class="jugada-jugador">
          <img class="jugada-img" :src="'/static/jugadas/' + jugador.jugada + '.png'" alt="">
        </div>
        <p class="jugada-texto-vs">Vs</p>
        <div class="jugada-elotrojugador">
          <v-progress-circular
            v-if="!elOtroJugador.yaJugo"
            indeterminate
            class="primary--text"
            :width="7"
            :size="70">
          </v-progress-circular>
          <img 
            v-else 
            class="jugada-img" :src="'/static/jugadas/' + elOtroJugador.jugada + '.png'" 
            alt="">
        </div>
        <div class="mensaje-final" v-if="elOtroJugador.yaJugo">
          <p class="mensaje-del-ganador" v-if="!hayGanador">{{ mensajeDelGanador | MaysPrimera }}</p>
          <p class="mensaje-del-ganador padding" v-else>{{ mensajeFinal }} <br>{{ mensajeDelGanador | MaysPrimera }}</p>
        </div>
      </div>

      
      <div class="contenedor-botones" v-if="jugador.yaJugo && elOtroJugador.yaJugo">
        <v-btn v-show="!cargando" v-if="!hayGanador" color="primary" dark @click="reiniciarJuego()">
          !Volver a jugar!
        </v-btn>
        <v-btn v-show="!cargando" v-else color="primary" dark @click="inicializarJuego()">
          !Jugar de nuevo!
        </v-btn>
      </div>

    </section>

    <section v-else class="contenedor-esperando-al-rival contenedor">
      <v-progress-circular
        indeterminate
        class="primary--text"
        :width="7"
        :size="70">
      </v-progress-circular>
      <p class="texto-esperando-al-rival">Esperando al rival...</p>
    </section>

  </main>
</template>


<script>
import * as firebase from 'firebase'
import AppTableroDePuntos from './../TableroDePuntos'
export default {
  props: ['id'],
  components: { AppTableroDePuntos },
  data () {
    return {
      partidaRef: firebase.database().ref('partidas/' + this.id),
      jugador: {
        jugada: '',
        jugadorId: '',
        yaJugo: false,
        puntos: 0
      },
      elOtroJugador: {
        jugada: '',
        jugadorId: '',
        yaJugo: false,
        puntos: 0
      },
      nombreObj: '',
      nombreObj2: '',
      mensajeDelGanador: '',
      cargando: false,
      error: false,
      intervalo: null
    }
  },
  created () {
    this.partidaRef.once('value')
    .then((data) => {
      const obj = data.val()
      // determinar si el usuario puede o no jugar
      if (obj.jugador1.jugadorId === '' || obj.jugador1.jugadorId === this.user.id) {
        this.nombreObj = 'jugador1'
        this.nombreObj2 = 'jugador2'
      } else if (obj.jugador2.jugadorId === '' || obj.jugador2.jugadorId === this.user.id) {
        this.nombreObj = 'jugador2'
        this.nombreObj2 = 'jugador1'
      } else {
        this.error = true
        this.$router.push('/partidas')
      }
      // si el usuario puede jugar se carga las funciones para real time
      if (this.nombreObj !== '') {
        this.partidaRef.child(this.nombreObj).update({
          jugadorId: this.user.id
        })
        this.partidaRef.on('child_added', snapshot => {
          this.cargarDatos(snapshot)
        })
        this.partidaRef.on('child_changed', snapshot => {
          this.cargarDatos(snapshot)
        })
        this.cargando = false
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
      this.partidaRef.off()
      this.partidaRef.child(this.nombreObj).update({
        jugadorId: '',
        jugada: '',
        yaJugo: false,
        puntos: 0
      })
      this.partidaRef.child(this.nombreObj2).update({
        jugada: '',
        yaJugo: false,
        puntos: 0
      })
      this.jugador.jugada = ''
      this.jugador.jugadorId = ''
      this.jugador.yaJugo = false
      this.jugador.puntos = 0
      this.elOtroJugador.jugada = ''
      this.elOtroJugador.yaJugo = false
      this.elOtroJugador.puntos = 0
      if (this.jugador.jugadorId === '' && this.elOtroJugador.jugadorId === '') {
        firebase.database().ref('partidas').child(this.id).remove()
      }
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
    'jugador.yaJugo' (val) {
      if (this.elOtroJugador.yaJugo && val) {
        this.devolverMensajeDelGanador()
        this.actualizarPuntos()
      }
      if (!this.elOtroJugador.yaJugo && !val) {
        this.mensajeDelGanador = ''
      }
    },
    'elOtroJugador.yaJugo' (val) {
      if (this.jugador.yaJugo && val) {
        this.devolverMensajeDelGanador()
        this.actualizarPuntos()
      }
      if (!this.jugador.yaJugo && !val) {
        this.mensajeDelGanador = ''
      }
    },
    'jugador.jugadorId' (val) {
      /* Si ambos existen se cierra la partida al publico */
      if (val !== '' && this.elOtroJugador.jugadorId !== '') {
        this.partidaRef.update({ yaEmpezo: true })
      }
    },
    'elOtroJugador.jugadorId' (val) {
      // Sino existe el otro jugador se abre la partida al publico
      if (val === '') {
        this.partidaRef.update({ yaEmpezo: false })
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
      this.partidaRef.child(this.nombreObj).update({
        jugada: str,
        yaJugo: true
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
        this.partidaRef.child(this.nombreObj).update({
          puntos: this.jugador.puntos + 1
        })
      } else if (this.mensajeDelGanador === 'perdiste') {
        this.partidaRef.child(this.nombreObj2).update({
          puntos: this.elOtroJugador.puntos + 1
        })
      }
    },
    inicializarJuego () {
      this.partidaRef.child(this.nombreObj).update({
        jugada: '',
        yaJugo: false,
        puntos: 0
      })
      this.partidaRef.child(this.nombreObj2).update({
        jugada: '',
        yaJugo: false,
        puntos: 0
      })
    },
    reiniciarJuego () {
      this.partidaRef.child(this.nombreObj).update({
        jugada: '',
        yaJugo: false
      })
      this.partidaRef.child(this.nombreObj2).update({
        jugada: '',
        yaJugo: false
      })
    },
    cargarDatos (snapshot) {
      if (typeof snapshot.val().jugadorId !== 'undefined') {
        if (snapshot.val().jugadorId !== this.user.id) {
          this.elOtroJugador = {
            ...snapshot.val()
          }
        } else {
          this.jugador = {
            ...snapshot.val()
          }
        }
      }
    }
  }
}
</script>

<style>

p {
  margin: 0;
}

/* .area-de-juego {
  display: flex;
  justify-content: center;
  align-items: center;
} */
/*CONTENEDOR-JUEGA*/ 
.contenedor-juega {
  margin: 10px 0;
  position: relative;
}
.contenedor-juega .contenedor-mensaje-jugar {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.contenedor-juega .contenedor-mensaje-jugar .mensaje-jugar {
  font-size: 64px;
  line-height: 1.2;
  width: 100%;
  text-align: center;
  color: #fafafa;
  background: rgba(0,0,0,.8);
  transform: translateY(-200px);
  animation: entrada-mensaje-juega 1.2s ease-in 1s forwards;
}
.contenedor-juega .jugadas-disponibles {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
}
.contenedor-juega .jugadas-disponibles .jugada {
  max-width: 33%;
}
.contenedor-juega .jugadas-disponibles .jugada .img-jugada {
  cursor: pointer;
  transition: .3s;
  margin: 0 5px;
  max-width: 100%;
}
.contenedor-juega .jugadas-disponibles .jugada .img-jugada:hover {
  transform: scale(1.05);
}
.contenedor-juega .jugadas-disponibles .piedra {
  animation: piedra .5s ease-in forwards;
}
.contenedor-juega .jugadas-disponibles .papel {
  animation: papel .5s ease-in forwards;
}
.contenedor-juega .jugadas-disponibles .tijera {
  animation: tijera .5s ease-in forwards;
}
/*CONTENEDOR-JUEGA*/

/*CONTENEDOR JUGADAS*/
.contenedor-jugadas {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 10px 0;
}
.contenedor-jugadas .jugada-jugador {

}
.contenedor-jugadas .jugada-jugador .jugada-img,
.contenedor-jugadas .jugada-elotrojugador .jugada-img {
  max-width: 100%;
}
.contenedor-jugadas .jugada-texto-vs {
  margin: 0 20px;
  font-weight: 900;
  font-size: 48px;
}
.contenedor-jugadas .jugada-elotrojugador {

}

.contenedor-jugadas .mensaje-final {
  position: absolute;
  background: rgb(33,33,33, 0.95);
  color: white;
  /* max-width: 400px; */
  width: 100%;
  font-size: 64px;
  text-align: center;
  line-height: 1.2;
  animation: entrada-mensaje-ganador .2s ease-out forwards;
}
.contenedor-jugadas .mensaje-del-ganador {

}
.contenedor-jugadas .mensaje-del-ganador.padding {
  margin: 10px 0;
  font-size: 36px;
  line-height: 1.2;
}

/*CONTENEDOR JUGADAS*/

/*CONTENEDOR BOTONES*/
.contenedor-botones {
  text-align: center;
}
/*CONTENEDOR BOTONES*/

/*CONTENEDOR ESPERANDO AL RIVAL*/
.contenedor-esperando-al-rival {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}
.contenedor-esperando-al-rival .texto-esperando-al-rival  {
  font-size: 32px;
  text-align: center;
}
.contenedor {
  max-width: 800px;
  margin: 0 auto;
}
.progress-circular{
  margin: 10px;
}
/*CONTENEDOR ESPERANDO AL RIVAL*/



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
  .contenedor-jugadas .jugada-texto-vs {
    margin: 0;
  }
  .tablero-de-puntos {
    transform: scale(0.8);
  }
  .contenedor-jugadas .mensaje-final,
  .contenedor-juega .contenedor-mensaje-jugar .mensaje-jugar {
    font-size: 32px;
    line-height: 1.5;
  }
}
</style>
