function calcularPuntaje() {
  let total = 0;
  const preguntas = ['p1', 'p2', 'p3', 'p4', 'p5'];
  const puntajes = [];

  preguntas.forEach(pregunta => {
    const opciones = document.getElementsByName(pregunta);
    let puntos = 0;
    for (let opcion of opciones) {
      if (opcion.checked) {
        puntos = parseInt(opcion.value);
        total += puntos;
        break;
      }
    }
    puntajes.push(puntos);
  });

  // Mostrar resultado
  document.getElementById('resultado').textContent = "Puntaje total: " + total + " / 10";

  // Crear o actualizar la gráfica
  mostrarGrafica(puntajes);
}
let grafica = null;

function mostrarGrafica(puntajes) {
  const ctx = document.getElementById('grafica').getContext('2d');

  // Si ya existe una gráfica, la destruimos para evitar superposición
  if (grafica) {
    grafica.destroy();
  }

  grafica = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4', 'Pregunta 5'],
      datasets: [{
        label: 'Puntos obtenidos',
        data: puntajes,
        backgroundColor: 'lightseagreen',
        borderColor: 'darkslategray',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 2
        }
      }
    }
  });
}
function generar() {
  const canvas = document.getElementById("grafica");
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Texto de título
  doc.setFontSize(16);
  doc.text("Resultados del Cuestionario", 20, 20);

  // Imagen de la gráfica
  doc.addImage(imgData, 'PNG', 20, 30, 160, 90);

  // Puntaje total
  const resultadoTexto = document.getElementById("resultado").textContent;
  doc.setFontSize(12);
  doc.text(resultadoTexto, 20, 130);

  // En vez de descargarlo, lo mostramos en el iframe
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Insertamos el PDF generado en el iframe
  const iframe = document.querySelector("iframe");
  iframe.src = pdfUrl;
}

