function añadirTarea() {
      const texto = document.getElementById('barra').value.trim();
      if (texto === "") return;

      const lista = document.getElementById('tareas');

      const quitar = document.createElement('div');
      quitar.className = 'quitar';

      const parrafo = document.createElement('p');
      parrafo.textContent = texto;

      const botonEliminar = document.createElement('button');
      botonEliminar.textContent = 'Tarea completada';
      botonEliminar.onclick = () => tareas.removeChild(quitar);

      quitar.appendChild(parrafo);
      quitar.appendChild(botonEliminar);

      tareas.appendChild(quitar);

      document.getElementById('barra').value = "";
    }