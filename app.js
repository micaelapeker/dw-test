/* ------------------- ARRAY DE BASE DE DATOS QUE VA A SER ------------------ */
/* ------------------------ COMPLETADO LUEGO CON AJAX ----------------------- */

let baseDeDatos = [];

document.addEventListener('DOMContentLoaded', cargaInicial);

/* -------------------------------------------------------------------------- */
/*             FUNCION CON AJAX PARA RENDERIZAR LA DB Y EL CARRITO            */
/* -------------------------------------------------------------------------- */

function cargaInicial() {
    $.ajax({
        url: 'db.json',
        success: function (data) {
            console.log(data)
            baseDeDatos = data;
            renderbaseDeDatos();
            renderCarrito();
        },
        error: function (error, jqXHR, status) {
            console.log(error);
        }
    }
    )
}


/* ---------------- CREO LAS VARIABLES QUE VAN A CONTENER LOS --------------- */
/* --------------------- DIV CREADOS EN HTML CON SUS ID --------------------- */

let $productContainerLatas = document.querySelector('#productContainerLatas')
let $produtsContainerPet = document.querySelector('#productContainerPet')

let carrito = localStorage.carrito ? JSON.parse(localStorage.carrito) : [];

/* -------------------------------------------------------------------------- */
/*                      FUNCION QUE ME DIAGRAMA LAS CARDS                     */
/* -------------------------------------------------------------------------- */

function renderbaseDeDatos() {
    baseDeDatos.forEach(function (producto) {
        var miNodo = document.createElement('div')
        miNodo.classList.add('col', 'mb-4')
        miNodo.innerHTML = `
        <div class="card item" style="opacity:0">
            <h5 class="card-title text-center item-title">${producto.nombre}</h5>
            <p class="card-t1ext text-center precioCard item-price">$${producto.precio}</p>
            <img src="${producto.imagen}" class="card-img-top item-image" alt="...">
            <div class="card-body">
                <div class="d-flex justify-content-center">
                    <button type="button" class="addToCart item-button" onclick="agregarAlCarritoLatas(${baseDeDatos.indexOf(producto)})"><b>Agregar al Carrito</b></button>
                </div>
            </div>
        </div>
        `
        if ((producto.codigo) < 2) {
            $productContainerLatas.appendChild(miNodo)
        }
        else if ((producto.codigo < 3) && (producto.codigo >= 2)) {
            $produtsContainerPet.appendChild(miNodo)
        }
    })

}
renderbaseDeDatos();


/* ------------- VARIABLE SELECCIONADA PARA LA DIAGRAMAR CARRITO ------------ */

let sectorCompraDeProductos = document.querySelector('#compras')

/* -------------------------------------------------------------------------- */
/*                   FUNCION QUE ME DIAGRAMA SECTOR CARRITO                   */
/* -------------------------------------------------------------------------- */

function sectorCompraCervezas() {
    let miNodoCervezas1 = document.createElement('div')
    miNodoCervezas1.classList.add('col-6')
    miNodoCervezas1.innerHTML = `
        <div class='shopping-cart-header'>
            <h5>Producto</h5>
        </div>
    `

    let miNodoCervezas2 = document.createElement('div')
    miNodoCervezas2.classList.add('col-2')
    miNodoCervezas2.innerHTML = `
        <div class='shopping-cart-header'>
            <h5 class='text-truncate'>Precio</h5>
        </div>
    `

    let miNodoCervezas3 = document.createElement('div')
    miNodoCervezas3.classList.add('col-4')
    miNodoCervezas3.innerHTML = `
        <div class='shopping-cart-header'>
            <h5>Cantidad</h5>
        </div>
    `

    sectorCompraDeProductos.appendChild(miNodoCervezas1)
    sectorCompraDeProductos.appendChild(miNodoCervezas2)
    sectorCompraDeProductos.appendChild(miNodoCervezas3)
}
sectorCompraCervezas()

/* -------------------------------------------------------------------------- */
/*                   FUNCION QUE ME PUSHEA AL ARRAY CARRITO                   */
/* -------------------------------------------------------------------------- */

function agregarAlCarritoLatas(index) {

    var producto = baseDeDatos[index];
    if (carrito.length > 0) {
        var noExiste = true;
        for (var i = 0; i < carrito.length; i++) {
            if (producto.nombre === carrito[i].nombre) {
                carrito[i].cantidad++;
                noExiste = false;
            }
        }
        if (noExiste) {
            producto.cantidad = 1;
            carrito.push(producto);
        }
    }
    else {
        producto.cantidad = 1;
        carrito.push(producto);
    }
    sumadorDePrecios();
    renderCarrito();
    localStorage.carrito = JSON.stringify(carrito);
    Swal.fire({
        position: 'top-end',
        toast: true,
        icon: 'success',
        title: 'El producto se agrego al carrito',
        showConfirmButton: false,
        timer: 1500
      })
}

const compraBirras = document.querySelector('.shoppingCartBirraContainer');

/* -------------------------------------------------------------------------- */
/*        FUNCION QUE ME DIAGRAMA EL ARRAY CARRITO EN EL SECTOR CARRITO       */
/* -------------------------------------------------------------------------- */

function renderCarrito() {
    localStorage.carrito = JSON.stringify(carrito)
    compraBirras.innerHTML = ''
    if (carrito.length > 0) {
        carrito.forEach(cerveza => {
            compraBirras.innerHTML += `
            <div class="row shoppingCartItem">
           <div class="col-6">
               <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                   <img src=${cerveza.imagen} class="shopping-cart-image">
                 <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${cerveza.nombre}</h6>
               </div>
          </div>
           <div class="col-2">
               <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                   <p class="item-price mb-0 shoppingCartItemPrice">${cerveza.precio}</p>
               </div>
           </div>
           <div class="col-4">
               <div
                   class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                   x${cerveza.cantidad}
                   <button class="btn btn-danger buttonDelete" onclick='borradoDeProducto(${carrito.indexOf(cerveza)})' type="button">X</button>
               </div>
           </div>
       </div>
            `
        })
    }
    sumadorDePrecios()
}
// renderCarrito();

/* ------------------ FUNCION PARA BORRAR PROD DEL CARRITO ------------------ */

function borradoDeProducto(index) {
    carrito[index].cantidad = carrito[index].cantidad - 1
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1)
    }
    localStorage.carrito = JSON.stringify(carrito);
    restadorDePrecio();
    renderCarrito();
}

/* ------------------------ FUNCION QUE SUMA EL TOTAL ----------------------- */

function sumadorDePrecios() {
    let total = 0;
    let precioTotal = document.querySelector('.shoppingCartTotal');

    carrito.forEach(latita => {
        const precio = Number(latita.precio)
        const cantidad = Number(latita.cantidad)
        return total = total + precio * cantidad
    })
    localStorage.carrito = JSON.stringify(carrito);
    precioTotal.innerHTML = `$${total.toFixed(2)}`
}

/* ----------------------- FUNCION QUE RESTA EL TOTAL ----------------------- */

function restadorDePrecio() {
    carrito.forEach(dejarDeComprar => {
        total = sumadorDePrecios() - dejarDeComprar.precio
    })
    localStorage.carrito = JSON.stringify(carrito);
}

/* ----------- FUNCION QUE ME VACIA EL CARRITO AL CONFIRMAR COMPRA ---------- */

function terminarCompra(){
    carrito = []
    sumadorDePrecios()
    compraBirras.innerHTML = '';
}

/* ---------------------- FUNCION QUE DIAGRAMA EL MODAL --------------------- */

function sectorModal() {
    let miNodoModal = document.createElement('div')
    miNodoModal.classList.add('row')
    miNodoModal.innerHTML = `
    <div class="modal fade" id="comprarModal" tabindex="-1" aria-labelledby="comprarModalLabel"
    aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="comprarModalLabel">Gracias por su compra</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="#" method="POST" id="my-form">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="inputEmail4">Email</label>
                                <input type="email" class="form-control" id="inputEmail4" name="_replayto">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="inputPassword4">Nombre y Apellido</label>
                                <input type="text" class="form-control" id="inputPassword4" name="name">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputAddress">Address</label>
                                <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St">
                        </div>
                        <div class="form-group">
                            <label for="inputAddress2">Address 2</label>
                                <input type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-success" onclick="terminarCompra()" data-dismiss="modal" value="Send" id="my-form-button">Confirmar Compra</button>
                    <p id="my-form-status"></p>
                </div>
            </div>
        </div>
    </div>
    `
    
    sectorCompraDeProductos.appendChild(miNodoModal)
    
}
sectorModal()

/* ------------------------- ANIMACION DE LAS CARDS ------------------------- */

$(document).ready(function () {
    $(window).scroll(function () {
      $(".card.item").each(function (i) {
        var bottom_of_object = $(this).offset().top + $(this).outerHeight();
        var bottom_of_window = $(window).scrollTop() + $(window).height();
        if (bottom_of_window > bottom_of_object) {
          $(this).animate({ opacity: "1" }, 1500);
        }
      });
    });
  });