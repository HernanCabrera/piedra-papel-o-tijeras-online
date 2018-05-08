<template>
  <div class="tablero-de-puntos">
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
</template>

<script>
export default {
  props: {
    jugador: { type: Object },
    elOtroJugador: { type: Object }
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
@keyframes aparecer {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
