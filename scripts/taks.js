// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

const token = localStorage.getItem('jwt');

if (!token) {
  location.replace('./index.html')
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */

  const urlBase = 'https://ctd-todo-api.herokuapp.com/v1';

  const formulario = document.querySelector('form');
  const nuevaTarea = document.querySelector('#nuevaTarea');
  const btnCerrarSesion = document.querySelector('#closeApp');
  const nombreUsuario = document.querySelector('.user-info p');
  const tareasPendientes = document.querySelector('.tareas-pendientes');
  const tareasTerminadas = document.querySelector('.tareas-terminadas');
  const cantidadFinalizadas = document.querySelector('#cantidad-finalizadas')

  consultarTareas();

  // ejecutamos el nombre de usuario en parrafo
  obtenerNombreUsuario();

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    //  preguntar si desea cerrar sesion y limpiar el localStorage si confirma
    const confirma = confirm("¿Desea cerrar sesión?");

    if (confirma) {
      localStorage.clear();
      location.replace('./index.html')
    }

  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const configuraciones = {
      method: 'GET',
      headers: {
        authorization: JSON.parse(token)
      }
    }


    fetch(`${urlBase}/users/getMe`, configuraciones)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        nombreUsuario.innerText = data.firstName;
        nombreUsuario.style.textTransform = 'capitalize'
      })
      .catch(error => {
        mostrarPosibleError(error);
      })

  };



  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {

    console.log("Consultando tareas...");

    const configuraciones = {
      method: 'GET',
      headers: {
        authorization: JSON.parse(token)
      }
    }

    fetch(`${urlBase}/tasks`, configuraciones)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        // le mando el listado a renderizar las tareas
        renderizarTareas(data);
      })
      .catch(error => {
        mostrarPosibleError(error);
      })



  };



  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formulario.addEventListener('submit', function (evento) {

    evento.preventDefault();
    console.log("Creando nueva tarea...");
    const validacion = validarTarea(nuevaTarea.value);

    if(validacion){
      // armamos el objeto que pide la API
      const payload = {
        description: nuevaTarea.value,
        completed: false
      }
  
      // configuramos el fetch
      const configuraciones = {
        method: 'POST',
        headers: {
          authorization: JSON.parse(token),
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
  
      // hacemos el POST en la api
      fetch(`${urlBase}/tasks`, configuraciones)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          // consulto las tareas para que se pinten nuevamente
          consultarTareas();
        })
        .catch(error => {
          mostrarPosibleError(error);
        })

    } else{
      alert("No puedes crear una tarea vacía.")
    }



    // limpio el form
    formulario.reset();
  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    console.log("Renderizando listados de tareas...");

    // limpiamos las listas antes de volver a pintar
    tareasPendientes.innerHTML = "";
    tareasTerminadas.innerHTML = "";

    
    listado.forEach(tarea => {
      // variable intermedia para manipular el dia
      const fecha = new Date(tarea.createdAt);

      if (tarea.completed) {

        tareasTerminadas.innerHTML += `
        <li class="tarea">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
        `
      } else {
        //lo mandamos al listado de tareas sin terminar
        tareasPendientes.innerHTML += `
          <li class="tarea">
            <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <p class="timestamp">${fecha.toLocaleDateString()}</p>
            </div>
          </li>
                        `
      }

    })

    const itemsTerminados = document.querySelectorAll('.tareas-terminadas li');
    cantidadFinalizadas.innerText = itemsTerminados.length;

    // finalizado el recorrido
    // ahora le doy funcionalidad a los botones de cambio de estado y los de borrar tarea
    botonesCambioEstado();
    botonBorrarTarea();


  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    console.log("Le agregamos funcionalidad a los botones de cambio de estado...");

    const botonesDeUpdate = document.querySelectorAll('.change');

    // le agregamos a cada boton la escucha del click
    botonesDeUpdate.forEach(boton => {

      boton.addEventListener('click', function (evento) {
        console.log("Cambiando estado de la tarea...");
        const idCapturado = evento.target.id;

        // segun si la tarea está terminada o no, invierto su estado de completed
        const tareaTerminada = evento.target.classList.contains('incompleta');

        /* --------------- disparo la peticion para cambiar el estado --------------- */
        // armamos el objeto que pide la API
        const payload = {
          completed: !tareaTerminada
        }

        // configuramos el fetch
        const configuraciones = {
          method: 'PUT',
          headers: {
            authorization: JSON.parse(token),
            'Content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        }

        // hacemos el POST en la api
        fetch(`${urlBase}/tasks/${idCapturado}`, configuraciones)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            // consulto las tareas para que se pinten nuevamente
            consultarTareas();
          })
          .catch(error => {
            mostrarPosibleError(error);
          })

      })

    })




  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {

    const botonesDelete = document.querySelectorAll('.borrar');

    botonesDelete.forEach(boton => {
      boton.addEventListener('click', function (evento) {

        const idCapturado = evento.target.id;

        console.log("Borrando tarea...");

        // configuramos el fetch
        const configuraciones = {
          method: 'DELETE',
          headers: {
            authorization: JSON.parse(token),
          }
        }

        // hacemos el POST en la api
        fetch(`${urlBase}/tasks/${idCapturado}`, configuraciones)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            // consulto las tareas para que se pinten nuevamente
            consultarTareas();
          })
          .catch(error => {
            mostrarPosibleError(error);
          })


      })
    })





  };

});

/* -------------------------------------------------------------------------- */
/*                               FUNCIONES Extra                              */
/* -------------------------------------------------------------------------- */
function mostrarPosibleError(mensaje) {
  alert(`Hubo un error: ${mensaje}`)
}