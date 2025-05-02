function leer(){

	var nom=document.forms["formulario"].elements[0].value;

	var clave=document.getElementById("pass").value;
	var carrera1=document.getElementsByTagName("select")[0].value;
	var gen=document.getElementsByName("genero");
	var g,i;
	for(i=0;i<gen.length;i++)
	{
		if(gen[i].checked)
		{
			g=gen[i].value;
		}
	}
	var ok=document.getElementById("casilla").checked;
	document.getElementById("resultado").innerHTML="Tu nombre es:"+nom+"\<br>Tu password es:"
	+clave+"\<br>Tu carrera es: "+carrera1+"\<br>Tu genero es:"+g+"\<br>Aceptacion de los acuerdos: "
	+ok;

}