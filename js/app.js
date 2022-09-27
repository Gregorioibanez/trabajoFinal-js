const cards = document.getElementById('card')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const fragment = document.createDocumentFragment()
const URL = "js/objetos.json"
let carrito = {}



document.addEventListener('DOMContentLoaded', e => { objetosFetch() });
cards.addEventListener('click', e => { agregarCarrito(e) })
items.addEventListener('click', e => { btnAccionar(e) })



const objetosFetch = async () => {
    const resultado = await fetch(URL);
    const data = await resultado.json()

    cardObjetos(data)
}


const cardObjetos = data => {
    data.forEach(tarjeta => {
        templateCard.querySelector('h3').textContent = tarjeta.nombre
        templateCard.querySelector('p').textContent = tarjeta.precio
        templateCard.querySelector('h6').textContent = tarjeta.stock
        templateCard.querySelector('img').setAttribute("src", tarjeta.img)
        templateCard.querySelector('button').dataset.id = tarjeta.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}



const agregarCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        carritoCompras(e.target.parentElement)
    }
    e.stopPropagation()
}



const carritoCompras = tarjeta => {
    const producto = {
        nombre: tarjeta.querySelector('h3').textContent,
        precio: tarjeta.querySelector('p').textContent,
        stock: tarjeta.querySelector('h6').textContent,
        id: tarjeta.querySelector('button').dataset.id,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1}

    carrito[producto.id] = { ...producto }
    pintarCarrito()
}



document.addEventListener('DOMContentLoaded', e => {
    objetosFetch()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
});


const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.nombre = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.nombre = producto.id
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}


const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }

    const xCantidad = Object.values(carrito).reduce((acumulador, {cantidad}) => acumulador + cantidad, 0)
    const xPrecio = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = xCantidad
    templateFooter.querySelector('span').textContent = xPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}


const btnAccionar = e => {

    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.nombre]
        producto.cantidad++
        carrito[e.target.dataset.nombre] = { ...producto }
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.nombre]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.nombre]
        } else {
            carrito[e.target.dataset.nombre] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}
