const url = "http://localhost:3000/api/ubicaciones/";
const contenedor = document.querySelector("tbody")
let resultados = ""

const modalUbicacion = new bootstrap.Modal(document.getElementById('modalUbicacion'))
const formUbicacion = document.querySelector("form")
const direccion = document.getElementById("direccion")
const numero = document.getElementById("numero")
const provincia = document.getElementById("provincia")
let opcion = ""

btnCrear.addEventListener("click", () => {
    direccion.value = "";
    numero.value = "";
    provincia.value = "";
    modalUbicacion.show()
    opcion = "crear"
})

//funcion para mostrar los resultados
const mostrar = (ubicaciones) => {
    ubicaciones.forEach(ubicacion => {
        resultados += `
                        <tr>
                            <td>${ubicacion.id}</td>
                            <td>${ubicacion.direccion}</td>
                            <td>${ubicacion.numero}</td>
                            <td>${ubicacion.provincia}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a> <a class="btnBorrar btn btn-primary">Eliminar</a> </td>
                        </tr>
        `
    });
    contenedor.innerHTML = resultados
}

//procedimiento para mostrar los datos
fetch(url)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error))


//Procedimiento de conseguir pulsar en boton eliminar
const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

//Procedimiento de borrar
on(document, "click", ".btnBorrar", e => {
    const fila = e.target.parentNode.parentNode //nos selecciona toda la fila
    // console.log(fila)
    const id = fila.firstElementChild.innerHTML //nos trae el id, si no ponemos innerHTML nos dará el id pero con lo HTML tags tambien
    // console.log(id)

    alertify.confirm("This is a confirm dialog.",
        function () {
            fetch(url+id, {
                method: "DELETE"
            })
            .then(res => res.json())
            .then(() => location.reload())
            //alertify.success('Ok')
        },
        function () {
            alertify.error('Cancel')
        })
})

//Procedimiento de boton editar, solo mostrara los mismos campos en los inputs del modal, no dejara guardar esta funcion
let idForm = 0;
on(document, "click", ".btnEditar", e => {
    const fila = e.target.parentNode.parentNode //nos selecciona toda la fila
    // console.log(fila)
    idForm = fila.children[0].innerHTML //estamos capturando el child 0 que seria el id, esta es la segunda manera tambien se podria de la primera que hemos hecho en la funcion de arriba
    //console.log(idForm)
    const direccionForm = fila.children[1].innerHTML //estamos capturando el child 1 que seria la descripcion, el child 2 seria el numero, y el 3 provincia
    //console.log(direccionForm)
    const numeroForm = fila.children[2].innerHTML //estamos capturando el child 1 que seria la descripcion, el child 2 seria el numero, y el 3 provincia
    //console.log(numeroForm)
    const provinciaForm = fila.children[3].innerHTML //estamos capturando el child 1 que seria la descripcion, el child 2 seria el numero, y el 3 provincia
    //console.log(provinciaForm)
    //console.log(`ID: ${idForm} , direccion: ${direccionForm}, numero: ${numeroForm}, provincia: ${provinciaForm}`)

    direccion.value = direccionForm
    numero.value = numeroForm
    provincia.value = provinciaForm
    opcion = "editar"
    modalUbicacion.show()
})

//Procedimiento para crear y guardar inputs
formUbicacion.addEventListener("submit", (e) => {
    e.preventDefault()

    if(opcion=="crear") {
        //console.log("opcion crear")
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                direccion: direccion.value,
                numero: numero.value,
                provincia: provincia.value,

            })
        })
        .then(resp => resp.json())
        .then(data => {
            const nuevaUbicacion = []
            nuevaUbicacion.push(data)
            mostrar(nuevaUbicacion)
        })
    }

    if(opcion=="editar") {
        // console.log("opcion editar")
        fetch(url+idForm, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                direccion: direccion.value,
                numero: numero.value,
                provincia: provincia.value,

            })
        })
        .then(resp => resp.json())
        .then(resp => location.reload())
    }

    modalUbicacion.hide()
})
