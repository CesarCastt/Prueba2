$(document).ready(function () {
  // Array para almacenar empleados
  let empleados = [];

  // Función para agregar un empleado
  let agregarEmpleado = function (nombre) {
    let id = empleados.length + 1;
    let empleado = { id, nombre };
    empleados.push(empleado);

    // Agregar el empleado a la lista visual
    $('#listaEmpleados').append(`<li class="list-group-item" data-id="${id}">${nombre}</li>`);

    // Actualizar el Autocomplete de empleados
    actualizarAutocompleteEmpleados();
  };

  // Función para actualizar el Autocomplete
  function actualizarAutocompleteEmpleados() {
    $("#asignado").autocomplete({
      source: empleados.map(e => e.nombre)
    });
  }

  // Función para agregar una tarea
  let agregarTarea = function (descripcion, empleadoAsignado, prioridad) {
    let id = $('#tabla-tareas tbody tr').length + 1;
    let estado = 'Pendiente';

    let tarea = {
      id,
      descripcion,
      empleadoAsignado,
      prioridad,
      estado,
      cambiarEstado: '', // esto será reemplazado por el botón
      eliminar: ''       // esto será reemplazado por el botón
    };

    // Usar la función de MiniTable para agregar la fila
    MiniTable.agregarFila(tarea, 'tabla-tareas');
};


  // Función para cambiar el estado de la tarea
  let cambiarEstadoTarea = function (id) {
    let $row = $('#tabla-tareas tbody tr').filter(function () {
      return $(this).find('td').first().text() === String(id);
    });

    let $estadoTd = $row.find('td').eq(4);
    let estadoActual = $estadoTd.text();
    let nuevoEstado;

    switch (estadoActual) {
      case 'Pendiente':
        nuevoEstado = 'En Proceso';
        break;
      case 'En Proceso':
        nuevoEstado = 'Finalizada';
        break;
      default:
        nuevoEstado = 'Pendiente';
    }

    $estadoTd.text(nuevoEstado);
  };

  // Validación con jQuery Validate - Formulario de empleados
  $('#form-empleado').validate({
    rules: {
      nombreEmpleado: {
        required: true,
        minlength: 2
      }
    },
    messages: {
      nombreEmpleado: {
        required: "Este campo es obligatorio.",
        minlength: "Debe tener al menos 2 caracteres."
      }
    },
    submitHandler: function () {
      let $nombreEmpleado = $('#nombreEmpleado');
      let nombre = $nombreEmpleado.val().trim();
      agregarEmpleado(nombre);
      $nombreEmpleado.val('');
      return false;
    }
  });

  // Validación con jQuery Validate - Formulario de tareas
  $('#form-tarea').validate({
    rules: {
      descripcion: {
        required: true,
        minlength: 3
      },
      asignado: {
        required: true
      },
      prioridad: {
        required: true
      }
    },
    messages: {
      descripcion: {
        required: "Ingresa una descripción.",
        minlength: "Mínimo 3 caracteres."
      },
      asignado: {
        required: "Debes asignar un empleado."
      },
      prioridad: {
        required: "Selecciona una prioridad."
      }
    },

    submitHandler: function (form) {
      let $descripcion = $('#descripcion');
      let $asignado = $('#asignado');
      let $prioridad = $('#prioridad');

      let descripcion = $descripcion.val().trim();
      let asignado = $asignado.val().trim();
      let prioridad = $prioridad.val();

      agregarTarea(descripcion, asignado, prioridad);

      $descripcion.val('');
      $asignado.val('');
      $prioridad.val('');

      alertify.success('Tarea ingresada exitosamente.');
      return false;
    }

  });

  // Limpiar formulario de tareas
  $('#btn-limpiar').click(function () {
    $('#descripcion').val('');
    $('#asignado').val('');
    $('#prioridad').val('');
  });

  // Botón para cambiar estado de la tarea
 $('#tabla-tareas').on('click', '.btn-cambiar-estado', function () {
  const $btn = $(this); // Guardamos $(this) una sola vez
  const $fila = $btn.parent().parent(); // Usamos solo una vez parent()
  const id = $fila.find('td').first().text();
  cambiarEstadoTarea(id);
});


  // Botón para eliminar una tarea
  $('#tabla-tareas').on('click', '.btn-eliminar', function () {
  const $btn = $(this); // Guardamos $(this) una vez
  const $fila = $btn.parent().parent(); // Subimos dos niveles: td → tr
  const id = $fila.find('td').first().text();
  MiniTable.eliminarFila(id, 'tabla-tareas');
  alertify.success('La tarea ha sido eliminada exitosamente.');
  });
});
