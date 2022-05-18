window.addEventListener('load', function () {


    /* ---------------------- obtenemos variables globales ---------------------- */
    const formulario = document.querySelector('form');
    const inputNombre = document.querySelector('#inputNombre');
    const inputApellido = document.querySelector('#inputApellido');
    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const inputPasswordRepetida = document.querySelector('#inputPasswordRepetida');

    const urlBase = 'https://ctd-todo-api.herokuapp.com/v1'

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        // preparo la data para crear usuario
        const usuario = {
            firstName: inputNombre.value,
            lastName: inputApellido.value,
            email: inputEmail.value,
            password: inputPassword.value
        }
        console.log(usuario);
        
        const settings = {
            method: 'POST',
            body: JSON.stringify(usuario),
            headers: {
                'Content-Type': 'application/json'
            }
        } 

        //   intentamos registrar nuestro usuario
        realizarRegister(settings);

    });

  

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(configuraciones) {

        // creamos la consulta a la API
        fetch(`${urlBase}/users`, configuraciones)
            .then(respuesta => respuesta.json())
            .then(data => {
                // corroboramos que nos llega un toke
                if(data.jwt){
                    // guardamos el token en storage
                    localStorage.setItem('jwt', JSON.stringify(data.jwt));

                    // redireccionamos al usuario a la pantalla de tareas
                    location.replace('./mis-tareas.html');
                }
            }).catch( error => {
                console.log("Error escuchando la promesa.");
                console.log(error);
            })

    };


});