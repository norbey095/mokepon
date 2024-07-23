const sectionseleccionarataque = document.getElementById("seleccionar-ataque")
const sectionReiniciar = document.getElementById("reiniciar")
const botonMascotaJugador = document.getElementById("boton-mascota")
const botonreiniciar = document.getElementById("boton-reiniciar")
const spanMascotaEnemigo = document.getElementById("mascota-enemigo")
const spanvidasjugador = document.getElementById("vidas-jugador")
const spanvidasenemigo = document.getElementById("vidas-enemigo")
const sectionmensajes = document.getElementById("resultado")
const ataquesdelJugador = document.getElementById("ataques-del-jugador")
const ataquesdelenemigo = document.getElementById("ataques-del-enemigo")


const sectionseleccionarmascota = document.getElementById("seleccionar-mascota")
const spanmascotajugador = document.getElementById("mascota-jugador")
const contenedorTarjetas = document.getElementById("contenedorTarjetas")
const contenedorAtaques = document.getElementById("contenedorAtaques")

const sectionvermapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opciondemokepones
let inputtornadillo 
let inputarmasolo 
let inputfuegadientes 
let mascotajugador 
let mascotadejugadorobjeto
let ataquesmokepon
let ataquesmokeponEnemigo
let botonfuego 
let botonagua 
let botontierra
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext('2d')
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './imagenes/mapadeljuego.png'
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 50
const anchoMaximoDelMapa = 700

if (anchoDelMapa > anchoMaximoDelMapa){
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class mokepon {
    constructor(nombre,foto,vida, fotomapa, id = null){
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 80
        this.alto = 80
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.MapaFoto = new Image()
        this.MapaFoto.src = fotomapa
        this.velocidadx = 0
        this.velocidady = 0
    }

    pintarMokepon(){
        lienzo.drawImage(
            this.MapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}
let tornadillo = new mokepon('Tornadillo','./imagenes/tornadillo.png',5,'./imagenes/torna.png')
let armasolo = new mokepon('Armasolo','./imagenes/armasolo.png',5,'./imagenes/arma.png')
let fuegadientes = new mokepon('Fuegadientes','./imagenes/fuegadientes.png',5,'./imagenes/fuega.png')

const tornadillo_ataques = [
    { nombre:'💧', id:'boton-agua'},
    { nombre:'💧', id:'boton-agua'},
    { nombre:'💧', id:'boton-agua'},
    { nombre:'🔥', id:'boton-fuego'},
    { nombre:'☘', id:'boton-tierra'},
]
tornadillo.ataques.push(...tornadillo_ataques)

const armasolo_ataques = [
    { nombre:'🔥', id:'boton-fuego'},
    { nombre:'🔥', id:'boton-fuego'},
    { nombre:'🔥', id:'boton-fuego'},
    { nombre:'💧', id:'boton-agua'},
    { nombre:'☘', id:'boton-tierra'},
]
armasolo.ataques.push(...armasolo_ataques)

const fuegadientes_ataques = [
    { nombre:'☘', id:'boton-tierra'},
    { nombre:'☘', id:'boton-tierra'},
    { nombre:'☘', id:'boton-tierra'},
    { nombre:'🔥', id:'boton-fuego'},
    { nombre:'💧', id:'boton-agua'},  
]
fuegadientes.ataques.push(...fuegadientes_ataques)

mokepones.push(tornadillo,armasolo,fuegadientes)


function iniciarJuego(){
    
    
    sectionseleccionarataque.style.display = "none"
    sectionvermapa.style.display  = "none"

    mokepones.forEach((mokepon) => {
      opciondemokepones = `
            <input type="radio" name="mascota" id=${mokepon.nombre}>
            <label class="tarjeta-de-mokepon" for=${mokepon.nombre}> 
                <p>${mokepon.nombre}</p>
                <img src=${mokepon.foto} alt=${mokepon.nombre}>
            </label>
      `
    contenedorTarjetas.innerHTML += opciondemokepones  
        inputfuegadientes = document.getElementById("Fuegadientes")
        inputarmasolo = document.getElementById("Armasolo")
        inputtornadillo = document.getElementById("Tornadillo")

    })

    sectionReiniciar.style.display = "none"
    botonMascotaJugador.addEventListener("click",selecionarMascotaJugador)
    
    botonreiniciar.addEventListener("click", reiniciarjuego)

    unirseAlJuego()
}

function unirseAlJuego(){
    fetch("http://localhost:8080/unirse")
    .then(function(res){
        console.log(res)
        if (res.ok) {
            res.text()
                .then(function(respuesta){
                    console.log(respuesta)
                    jugadorId = respuesta
                })
        }
    })
}


function selecionarMascotaJugador() {
    
    sectionseleccionarmascota.style.display = "none"
    
       
    if (inputtornadillo.checked){
       spanmascotajugador.innerHTML = inputtornadillo.id
       mascotajugador = inputtornadillo.id
    }   else if (inputarmasolo.checked){ 
        spanmascotajugador.innerHTML = inputarmasolo.id
        mascotajugador = inputarmasolo.id
    }   else if (inputfuegadientes.checked) {
        spanmascotajugador.innerHTML = inputfuegadientes.id
        mascotajugador = inputfuegadientes.id
    }   else {
        alert("seleciona una mascota")
    }

    seleccionarMokepon(mascotajugador)

    extraerataques(mascotajugador)
    sectionvermapa.style.display = "flex"
    iniciarMapa()
    
}

function seleccionarMokepon(mascotajugador){
    fetch(`http://localhost:8080/2mokepon/${jugadorId}`,{
        method: "post",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            mokepon: mascotajugador
        })
    })
}

function extraerataques(mascotajugador){
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotajugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
        
    }
    mostrartaques(ataques)
}

function mostrartaques(ataques){
    ataques.forEach((ataque) => {
        ataquesmokepon = `
        <button id=${ataque.id} class="boton-de-ataque bataque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML +=ataquesmokepon
    })
    botonfuego = document.getElementById("boton-fuego")
    botonagua = document.getElementById("boton-agua")
    botontierra = document.getElementById("boton-tierra")
    botones = document.querySelectorAll(".bataque")
    
}

function secuenciaAtaque(){
    botones.forEach((boton) =>  {
        boton.addEventListener("click",(e)=>{
            if (e.target.textContent === "💧") {
                ataqueJugador.push("AGUA")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
            } else if (e.target.textContent === "🔥") {
                ataqueJugador.push("FUEGO")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
            } else{
                ataqueJugador.push("TIERRA")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
            }
            if (ataqueJugador.length === 5){
                enviarAtaques()
            }            
        })
    })
    
}

function enviarAtaques() {
   fetch(`http://localhost:8080/2mokepon/${jugadorId}/ataques` ,{
        method: "post",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques(){
    fetch(`http://localhost:8080/2mokepon/${enemigoId}/ataques`)
    .then(function (res){
        if (res.ok) {
           res.json()
            .then(function({ataques}) {
               if (ataques.length === 5) {
                ataqueEnemigo = ataques
                combate()
               } 
            })
        }
    })
}

function selecionarMascotaenemigo(){

  let mascotaAleatoria = aleatorio(0, mokepones.length -1)
  
  spanMascotaEnemigo.innerHTML = mokepones[mascotaAleatoria].nombre
  ataquesmokeponEnemigo =  mokepones[mascotaAleatoria].ataques
  secuenciaAtaque()
}


function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio(0, ataquesmokeponEnemigo.length -1)

    if (ataqueAleatorio == 0 || ataqueAleatorio == 1){
        ataqueEnemigo.push("FUEGO")
    } else if (ataqueAleatorio == 3 || ataqueAleatorio == 4){
        ataqueEnemigo.push("AGUA")
    } else {
        ataqueEnemigo.push("TIERRA")
    }
    console.log(ataqueEnemigo)
    iniciarpelea()
}

function iniciarpelea(){
    if (ataqueJugador.length === 5 ) {
        combate()
    }
}

function indexAmbosOponentes(jugador,enemigo){
    indexAtaqueJugador =  ataqueJugador[jugador]
    indexAtaqueEnemigo =  ataqueEnemigo[enemigo]
}

function combate() {
    clearInterval(intervalo)
    
    for (let index = 0; index < ataqueJugador.length; index++) {
        if (ataqueJugador[index] === ataqueEnemigo[index]) {
            indexAmbosOponentes(index,index)
            crearMensaje("EMPATE") 
            victoriasJugador++
            spanvidasjugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === "FUEGO" && ataqueEnemigo[index] === "TIERRA"){
            indexAmbosOponentes(index,index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanvidasjugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === "AGUA" && ataqueEnemigo[index] === "FUEGO"){
            indexAmbosOponentes(index,index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanvidasjugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === "TIERRA" && ataqueEnemigo[index] === "AGUA"){
            indexAmbosOponentes(index,index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanvidasjugador.innerHTML = victoriasJugador
        } else{
            indexAmbosOponentes(index,index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanvidasenemigo.innerHTML = victoriasEnemigo
        }
        
        
    }
    revisarvidas();
}

function revisarvidas(){
    if (victoriasJugador == victoriasEnemigo){
        crearMensajefinal("Esto es un Empate")
    } else if (victoriasJugador > vidasEnemigo){
        crearMensajefinal("GANASTE, HEHEEEEEE")
    } else {
        crearMensajefinal("PERDISTE,por malo")
    }
}

function crearMensaje(resultado){

    let nuevoataquedeljugador = document.createElement('P')
    let nuevoataquedelenemigo = document.createElement('P')

    sectionmensajes.innerHTML = resultado
    nuevoataquedeljugador.innerHTML = indexAtaqueJugador
    nuevoataquedelenemigo.innerHTML = indexAtaqueEnemigo
 
    ataquesdelJugador.appendChild(nuevoataquedeljugador)
    ataquesdelenemigo.appendChild(nuevoataquedelenemigo)
}

function aleatorio(min,max){
    return Math.floor(Math.random() * (max - min +1) + min)
}

window.addEventListener("load", iniciarJuego)

function crearMensajefinal(resultadofinal){
    
    let sectionmensajes = document.getElementById("resultado")

    sectionmensajes.innerHTML = resultadofinal 


    let botonfuego = document.getElementById("boton-fuego")
    botonfuego.disabled = true
    let botonagua = document.getElementById("boton-agua")
    botonagua.disabled = true
    let botontierra = document.getElementById("boton-tierra")
    botontierra.disabled = true

    let sectionReiniciar = document.getElementById("reiniciar")
    sectionReiniciar.style.display = "block"
}

function reiniciarjuego(){
    location.reload()
}

function aleatorio(min,max){
    return Math.floor(Math.random() * (max - min +1) + min)
}

function pintarcanvas(){

    mascotadejugadorobjeto.x = mascotadejugadorobjeto.x + mascotadejugadorobjeto.velocidadx
    mascotadejugadorobjeto.y = mascotadejugadorobjeto.y + mascotadejugadorobjeto.velocidady
    lienzo.clearRect(0,0,mapa.clientWidth,mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotadejugadorobjeto.pintarMokepon()

    enviarPosicion(mascotadejugadorobjeto.x,mascotadejugadorobjeto.y)

    mokeponesEnemigos.forEach(function (mokepon) {
        mokepon.pintarMokepon()
        revisarcolision(mokepon)
    })
}

function enviarPosicion(x,y){
    fetch(`http://localhost:8080/2mokepon/${jugadorId}/posicion`,{
        method: "post",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
            .then(function ({enemigos}){
                console.log(enemigos)
                let mokeponEnemigo = null
                mokeponesEnemigos = enemigos.map(function (enemigo) {
                    const mokeponNombre = (enemigo.mokepon.nombre || "");
                    if (mokeponNombre === "Tornadillo") {
                        mokeponEnemigo = new mokepon('Tornadillo','./imagenes/tornadillo.png',5,'./imagenes/torna.png',enemigo.id)
                    }
                    else if (mokeponNombre === "Armasolo") {
                        mokeponEnemigo = new mokepon('Armasolo','./imagenes/armasolo.png',5,'./imagenes/arma.png',enemigo.id)

                    }
                    else if (mokeponNombre === "Fuegadientes") {
                        mokeponEnemigo = new mokepon('Fuegadientes','./imagenes/fuegadientes.png',5,'./imagenes/fuega.png',enemigo.id)
                    }
                    mokeponEnemigo.x = enemigo.x
                    mokeponEnemigo.y = enemigo.y

                    return mokeponEnemigo

                })
            })
        }
    })
}

function Moverarriba(){
    mascotadejugadorobjeto.velocidady = -5
}

function Moverizquierda(){
    mascotadejugadorobjeto.velocidadx = -5
}

function Moverabajo(){
    mascotadejugadorobjeto.velocidady = 5
}

function Moverderecha(){
    mascotadejugadorobjeto.velocidadx = 5
}
function detenermovimiento(){
    mascotadejugadorobjeto.velocidadx = 0
    mascotadejugadorobjeto.velocidady = 0
}

function sePrecionoUnaTecla(event){
    switch (event.key) {
        case 'ArrowUp':
            Moverarriba()
            break;
        case 'ArrowDown':
            Moverabajo()
            break;
        case 'ArrowLeft':
            Moverizquierda()
            break;
        case 'ArrowRight':
        Moverderecha()
            break;    
        default:
            break;
    }

}
function iniciarMapa(){
    mascotadejugadorobjeto = obtenerobjetomascota(mascotajugador)
    intervalo = setInterval(pintarcanvas, 50)

    window.addEventListener('keydown', sePrecionoUnaTecla)
    window.addEventListener('keyup', detenermovimiento)
}

function obtenerobjetomascota(){
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotajugador === mokepones[i].nombre) {
            return mokepones[i]
        }
        
    }
}
function revisarcolision(enemigo){
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotadejugadorobjeto.y
    const abajoMascota = mascotadejugadorobjeto.y + mascotadejugadorobjeto.alto
    const derechaMascota = mascotadejugadorobjeto.x + mascotadejugadorobjeto.ancho
    const izquierdaMascota = mascotadejugadorobjeto.x
   if (
    abajoMascota < arribaEnemigo ||
    arribaMascota > abajoEnemigo ||
    derechaMascota < izquierdaEnemigo ||
    izquierdaMascota > derechaEnemigo
   ) {
        return
   } 
   detenermovimiento()
   clearInterval(intervalo)
   console.log("se detecto una colision");
   enemigoId = enemigo.id
   sectionseleccionarataque.style.display = "flex"
   sectionvermapa.style.display = "none"
   selecionarMascotaenemigo(enemigo)
   
}

window.addEventListener("load", iniciarJuego)