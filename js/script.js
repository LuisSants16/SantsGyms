
const header = document.querySelector(".container_header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

});


document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  if (!menuToggle || !menu) {
    console.error("Falta #menuToggle o #menu en el HTML");
    return;
  }

  const icon = menuToggle.querySelector("i");
  const links = document.querySelectorAll(".link_menu");

  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");

    if (icon) {
      if (menu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    }
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });
  });
});

const btnCalcular = document.getElementById("calcularIMC");
const btnLimpiar = document.getElementById("limpiarIMC");
const resultado = document.getElementById("resultadoIMC");

const inputs = document.querySelectorAll(".bmi_inputs input, .bmi_inputs select");

btnCalcular.addEventListener("click", () => {
  const peso = parseFloat(document.getElementById("peso").value);
  const alturaCm = parseFloat(document.getElementById("altura").value);
  const altura = alturaCm / 100;

  if (!peso || !altura) {
    resultado.textContent = "Por favor completa todos los campos";
    resultado.classList.add("activo");
    return;
  }

  const imc = (peso / (altura * altura)).toFixed(1);

  let estado = "";
  if (imc < 18.5) estado = "Bajo peso";
  else if (imc < 25) estado = "Peso normal";
  else if (imc < 30) estado = "Sobrepeso";
  else estado = "Obesidad";

  // 🔥 RANGO DE PESO SALUDABLE
  const pesoMin = (18.5 * altura * altura).toFixed(1);
  const pesoMax = (24.9 * altura * altura).toFixed(1);

  // 🔥 PESO IDEAL PROMEDIO
  const pesoIdeal = ((Number(pesoMin) + Number(pesoMax)) / 2).toFixed(1);

  resultado.innerHTML = `
    Tu peso actual es <strong>${peso} kg</strong><br>
    Tu IMC es <strong>${imc}</strong><br>
    Estado: <strong>${estado}</strong><br><br>
    Peso recomendado: <strong>${pesoMin} kg – ${pesoMax} kg</strong><br>
    Peso ideal aproximado: <strong>${pesoIdeal} kg</strong>
  `;

  resultado.classList.add("activo");
});

btnLimpiar.addEventListener("click", () => {
  resultado.classList.remove("activo");

  setTimeout(() => {
    resultado.innerHTML = "";

    inputs.forEach(input => {
      if (input.tagName === "SELECT") {
        input.selectedIndex = 0;
      } else {
        input.value = "";
      }
    });
  }, 400);
});

/* ============================= */
/* ===== SLIDER TESTIMONIOS ==== */
/* ============================= */

document.addEventListener("DOMContentLoaded", () => {

  const testimonios = document.querySelectorAll(".testimonio_item");
  const dots = document.querySelectorAll(".dot");

  let index = 0;
  let intervalo;

  /* LIMPIAR TODO */
  testimonios.forEach(t => t.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  /* MOSTRAR */
  function mostrarTestimonio(i){

    testimonios.forEach(t => t.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    testimonios[i].classList.add("active");
    dots[i].classList.add("active");

    index = i;
  }

  /* AUTO */
  function iniciarSlider(){

    intervalo = setInterval(() => {

      index++;

      if(index >= testimonios.length){
        index = 0;
      }

      mostrarTestimonio(index);

    }, 4000);

  }

  /* CLICK DOTS */
  dots.forEach((dot, i) => {

    dot.addEventListener("click", () => {
      mostrarTestimonio(i);
      clearInterval(intervalo);
      iniciarSlider();
    });

  });

  /* HOVER PAUSE */
  const slider = document.querySelector(".testimonios_slider");

  slider.addEventListener("mouseenter", () => {
    clearInterval(intervalo);
  });

  slider.addEventListener("mouseleave", () => {
    iniciarSlider();
  });

  /* START */
  mostrarTestimonio(0);
  iniciarSlider();

});

/* ============================= */
/* SCROLL SUAVE SIN # EN URL */
/* ============================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

  link.addEventListener("click", function(e){

    e.preventDefault(); // 👈 evita que salga el #

    const id = this.getAttribute("href");
    const section = document.querySelector(id);

    if(section){

      section.scrollIntoView({
        behavior: "smooth"
      });

      // 👇 Borra el # de la URL
      history.replaceState(null, null, " ");
    }

  });

});

const yOffset = -80; // alto del header
const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

window.scrollTo({
  top: y,
  behavior: "smooth"
});