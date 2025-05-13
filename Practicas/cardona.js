document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('formularioPedido');
        const mensajeExito = document.getElementById('mensaje-exito');
        const btnNuevoPedido = document.getElementById('nuevo-pedido');
        const visorPDF = document.getElementById('visorPDF');
        
        // Manejar botones de cantidad
        document.querySelectorAll('.btn-cantidad').forEach(btn => {
            btn.addEventListener('click', function() {
                const operacion = this.getAttribute('data-operacion');
                const input = this.parentElement.querySelector('.cantidad');
                let valor = parseInt(input.value);
                
                if (operacion === 'sumar') {
                    valor++;
                } else if (operacion === 'restar' && valor > 0) {
                    valor--;
                }
                
                input.value = valor;
                actualizarResumen();
            });
        });
        
        // Manejar cambios en las cantidades
        document.querySelectorAll('.cantidad').forEach(input => {
            input.addEventListener('change', function() {
                if (this.value < 0) this.value = 0;
                actualizarResumen();
            });
        });
        
        // Actualizar resumen del pedido
        function actualizarResumen() {
            const listaProductos = document.getElementById('lista-productos');
            let subtotal = 0;
            
            // Limpiar lista
            listaProductos.innerHTML = '';
            
            // Recorrer todos los productos
            document.querySelectorAll('.producto-item').forEach(item => {
                const nombre = item.querySelector('h3').textContent;
                const cantidad = parseInt(item.querySelector('.cantidad').value);
                const precio = parseFloat(item.querySelector('.cantidad').getAttribute('data-precio'));
                
                if (cantidad > 0) {
                    const totalProducto = cantidad * precio;
                    subtotal += totalProducto;
                    
                    // Agregar a la lista
                    const divProducto = document.createElement('div');
                    divProducto.innerHTML = `
                        <span>${nombre} x${cantidad}</span>
                        <span>$${totalProducto.toFixed(2)}</span>
                    `;
                    listaProductos.appendChild(divProducto);
                }
            });
            
            // Calcular envío (gratis para pedidos mayores a $500)
            let envio = 50;
            if (subtotal >= 500) {
                envio = 0;
            }
            
            // Actualizar totales
            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('envio').textContent = subtotal >= 500 ? 'Gratis' : `$${envio.toFixed(2)}`;
            document.getElementById('total').textContent = `$${(subtotal + envio).toFixed(2)}`;
        }
        
        // Generar PDF con los datos del pedido
        function generarPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let y = 20;
            
            // Encabezado
            doc.setFontSize(18);
            doc.setTextColor(139, 69, 19); // Color marrón
            doc.text("Panadería la Cardona - Comprobante de Pedido", 105, y, { align: 'center' });
            y += 15;
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0); // Color negro
            
            // Información del cliente
            doc.text("Información del Cliente:", 14, y);
            y += 8;
            
            doc.text(`Nombre: ${document.getElementById('nombre').value}`, 20, y);
            y += 8;
            doc.text(`Teléfono: ${document.getElementById('telefono').value}`, 20, y);
            y += 8;
            doc.text(`Correo: ${document.getElementById('correo').value}`, 20, y);
            y += 8;
            doc.text(`Dirección: ${document.getElementById('direccion').value}`, 20, y);
            y += 8;
            doc.text(`Fecha de entrega: ${document.getElementById('fecha-entrega').value} a las ${document.getElementById('hora-entrega').value}`, 20, y);
            y += 8;
            doc.text(`Método de pago: ${document.getElementById('metodo-pago').options[document.getElementById('metodo-pago').selectedIndex].text}`, 20, y);
            y += 12;
            
            // Productos seleccionados
            doc.text("Productos:", 14, y);
            y += 8;
            
            let productosSeleccionados = false;
            
            document.querySelectorAll('.producto-item').forEach(item => {
                const nombre = item.querySelector('h3').textContent;
                const cantidad = parseInt(item.querySelector('.cantidad').value);
                const precio = parseFloat(item.querySelector('.cantidad').getAttribute('data-precio'));
                
                if (cantidad > 0) {
                    productosSeleccionados = true;
                    const totalProducto = cantidad * precio;
                    
                    doc.text(`${nombre} x${cantidad} - $${precio.toFixed(2)} c/u`, 20, y);
                    y += 8;
                    doc.text(`Total: $${totalProducto.toFixed(2)}`, 30, y);
                    y += 8;
                }
            });
            
            if (!productosSeleccionados) {
                doc.text("No se seleccionaron productos", 20, y);
                y += 8;
            }
            
            y += 5;
            
            // Totales
            doc.setFontSize(14);
            doc.text(`Subtotal: $${document.getElementById('subtotal').textContent}`, 14, y);
            y += 8;
            doc.text(`Envío: ${document.getElementById('envio').textContent}`, 14, y);
            y += 8;
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(`Total: $${document.getElementById('total').textContent}`, 14, y);
            y += 12;
            
            // Comentarios
            const comentarios = document.getElementById('comentarios').value;
            if (comentarios) {
                doc.setFont(undefined, 'normal');
                doc.setFontSize(12);
                doc.text("Comentarios adicionales:", 14, y);
                y += 8;
                doc.text(comentarios, 20, y, { maxWidth: 170 });
            }
            
            // Pie de página
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("Gracias por su compra - Panadería la Cardona", 105, 285, { align: 'center' });
            
            // Mostrar PDF en el visor
            const pdfBlob = doc.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);
            visorPDF.src = pdfUrl;
        }
        
        // Validar formulario
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar campos
            let valido = true;
            const camposRequeridos = ['nombre', 'telefono', 'correo', 'direccion', 'fecha-entrega', 'hora-entrega', 'metodo-pago'];
            
            camposRequeridos.forEach(id => {
                const campo = document.getElementById(id);
                const error = campo.parentElement.querySelector('.error-message');
                
                if (!campo.value) {
                    error.textContent = 'Este campo es requerido';
                    error.style.display = 'block';
                    valido = false;
                } else {
                    error.style.display = 'none';
                }
            });
            
            // Validar correo electrónico
            const correo = document.getElementById('correo');
            const errorCorreo = correo.parentElement.querySelector('.error-message');
            if (correo.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value)) {
                errorCorreo.textContent = 'Ingrese un correo electrónico válido';
                errorCorreo.style.display = 'block';
                valido = false;
            }
            
            // Validar términos y condiciones
            const terminos = document.getElementById('acepto-terminos');
            const errorTerminos = terminos.parentElement.querySelector('.error-message');
            if (!terminos.checked) {
                errorTerminos.textContent = 'Debe aceptar los términos y condiciones';
                errorTerminos.style.display = 'block';
                valido = false;
            } else {
                errorTerminos.style.display = 'none';
            }
            
            // Validar que se haya seleccionado al menos un producto
            const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
            if (total <= 50) { // Solo el envío
                alert('Debe seleccionar al menos un producto');
                valido = false;
            }
            
            // Si todo es válido, mostrar mensaje de éxito y generar PDF
            if (valido) {
                form.style.display = 'none';
                mensajeExito.style.display = 'block';
                generarPDF();
            }
        });
        
        // Botón para nuevo pedido
        btnNuevoPedido.addEventListener('click', function() {
            // Resetear formulario
            form.reset();
            document.querySelectorAll('.cantidad').forEach(input => {
                input.value = 0;
            });
            document.getElementById('lista-productos').innerHTML = '';
            document.getElementById('subtotal').textContent = '$0.00';
            document.getElementById('envio').textContent = '$50.00';
            document.getElementById('total').textContent = '$50.00';
            
            // Limpiar visor PDF
            visorPDF.src = '';
            
            // Mostrar formulario y ocultar mensaje
            form.style.display = 'block';
            mensajeExito.style.display = 'none';
        });
        
        // Inicializar resumen
        actualizarResumen();
    });

window.addEventListener('mouseover', initLandbot, { once: true });
window.addEventListener('touchstart', initLandbot, { once: true });

var myLandbot;

function initLandbot() {
  if (!myLandbot) {
    var s = document.createElement('script');
    s.type = "module";
    s.async = true;
    s.addEventListener('load', function () {
      myLandbot = new Landbot.Livechat({
        configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2930322-TSM5FIR7Z82CEGYY/index.json',
        cache: false 
      });
    });
    s.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  }
}
let pregunta2 = [];

  function agregarPregunta() {
    const input = document.getElementById("pregunta");
    const texto = input.value.trim();

    if (texto !== "") {
      pregunta2.unshift({
        texto: texto,
        respuestas: []
      });
      input.value = "";
      mostrarPreguntas();
    }
  }

  function mostrarPreguntas() {
    const lista = document.getElementById("listaPreguntas");
    lista.innerHTML = "";

    pregunta2.forEach((pregunta, index) => {
      const li = document.createElement("li");

      // Mostrar la pregunta
      const textoPregunta = document.createElement("p");
      textoPregunta.textContent = pregunta.texto;
      li.appendChild(textoPregunta);

      // Input de respuesta
      const inputRespuesta = document.createElement("input");
      inputRespuesta.type = "text";
      inputRespuesta.placeholder = "Escribe una respuesta";
      inputRespuesta.id = `respuesta-${index}`;
      li.appendChild(inputRespuesta);

      // Botón para agregar respuesta
      const btnResponder = document.createElement("button");
      btnResponder.textContent = "Responder";
      btnResponder.onclick = () => agregarRespuesta(index);
      li.appendChild(btnResponder);

      // Lista de respuestas
      const ulRespuestas = document.createElement("ul");
      pregunta.respuestas.forEach(respuesta => {
        const liResp = document.createElement("li");
        liResp.textContent = respuesta;
        ulRespuestas.appendChild(liResp);
      });
      li.appendChild(ulRespuestas);

      lista.appendChild(li);
    });
  }

  function agregarRespuesta(index) {
    const input = document.getElementById(`respuesta-${index}`);
    const texto = input.value.trim();

    if (texto !== "") {
      pregunta2[index].respuestas.push(texto);
      input.value = "";
      mostrarPreguntas();
    }
  }


