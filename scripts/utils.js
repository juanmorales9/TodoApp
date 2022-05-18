/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
    
}

function normalizarTexto(texto) {
    
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    
}

function normalizarEmail(email) {
    
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    
}

/* ------------------------------- nueva tarea ------------------------------ */
function validarTarea(tarea) {
    let respuesta = false;

    if(tarea !== "" && tarea.length > 2){
        respuesta = true;
    }
    
    return respuesta;
}