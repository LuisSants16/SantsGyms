const startBtn = document.getElementById("startPlanBtn");
const wizard = document.getElementById("wizard");
const questionTitle = document.getElementById("questionTitle");
const questionDesc = document.getElementById("questionDesc");
const questionContent = document.getElementById("questionContent");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const progressFill = document.getElementById("progressFill");

const resultBox = document.getElementById("result");
const summaryBox = document.getElementById("summaryBox");
const nutritionBox = document.getElementById("nutritionBox");
const routineBox = document.getElementById("routineBox");

let step = 0;
const answers = {};

const steps = [
  {
    type: "input",
    title: "¿Cómo te llamas?",
    desc: "Usaremos tu nombre para personalizar tu plan",
    placeholder: "Ej: Luis",
  },
  {
    type: "number",
    title: "¿Qué edad tienes?",
    desc: "La edad influye en el metabolismo",
    min: 14,
    max: 80,
    placeholder: "Ej: 28",
  },
  {
    type: "option",
    title: "¿Cuál es tu sexo?",
    desc: "Necesitamos este dato para ajustar el cálculo",
    options: ["Hombre", "Mujer"],
  },
  {
    type: "number",
    title: "¿Cuál es tu peso actual?",
    desc: "Ingresa tu peso en kilogramos",
    min: 35,
    max: 200,
    placeholder: "Ej: 75",
  },
  {
    type: "number",
    title: "¿Cuál es tu estatura?",
    desc: "Ingresa tu estatura en centímetros",
    min: 130,
    max: 220,
    placeholder: "Ej: 170",
  },
  {
    type: "option",
    title: "¿Cuál es tu objetivo principal?",
    desc: "Elige el objetivo que más se ajusta a ti",
    options: ["Perder grasa", "Mantener peso", "Ganar masa muscular"],
  },
  {
    type: "option",
    title: "¿Cuál es tu nivel de actividad diaria?",
    desc: "Además del entrenamiento",
    options: ["Sedentario", "Moderadamente activo", "Activo"],
  },
  {
    type: "option",
    title: "¿Cuántos días puedes entrenar?",
    desc: "Esto define tu rutina semanal",
    options: ["3 días", "4 días", "5 días", "6 días"],
  },
  {
    type: "option",
    title: "¿Cuánto tiempo puedes entrenar por sesión?",
    desc: "Selecciona un promedio",
    options: ["30 minutos", "45 minutos", "60 minutos", "90 minutos"],
  },
];

startBtn.addEventListener("click", () => {
  wizard.style.display = "block";

  // 🔥 volver a mostrar la tarjeta
  document.querySelector(".wizard-card").style.display = "block";

  step = 0;
  renderStep();

  wizard.scrollIntoView({ behavior: "smooth" });
});

function renderStep() {
  const data = steps[step];
  questionTitle.textContent = data.title;
  questionDesc.textContent = data.desc;
  questionContent.innerHTML = "";

  // INPUTS
  if (data.type === "input" || data.type === "number") {
    const input = document.createElement("input");
    input.type = data.type === "number" ? "number" : "text";
    input.placeholder = data.placeholder || "";
    input.className = "wizard-input";

    if (data.min) input.min = data.min;
    if (data.max) input.max = data.max;

    input.value = answers[step] || "";
    input.oninput = () => {
      answers[step] = input.value;
    };

    questionContent.appendChild(input);
  }

  // OPCIONES
  if (data.type === "option") {
    data.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;

      if (answers[step] === opt) btn.classList.add("active");

      btn.onclick = () => {
        answers[step] = opt;
        document
          .querySelectorAll(".option-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      };

      questionContent.appendChild(btn);
    });
  }

  progressFill.style.width = ((step + 1) / steps.length) * 100 + "%";

  backBtn.style.display = step === 0 ? "none" : "inline-block";
}

nextBtn.onclick = () => {
  if (answers[step] === undefined) return;

  if (step < steps.length - 1) {
    step++;
    renderStep();
  } else {
    // FIN DEL WIZARD
    document.querySelector(".wizard-card").style.display = "none";

    const loading = document.getElementById("loadingPlan");
    loading.style.display = "flex";

    setTimeout(() => {
      loading.style.display = "none";
      generatePlan();

      // bajar suavemente al resultado
      setTimeout(() => {
        resultBox.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }, 2000);
  }
};

backBtn.onclick = () => {
  if (step > 0) {
    step--;
    renderStep();
  }
};

function generarRutina(objetivo, dias, nivel) {
  const rutinas = {
    "Perder grasa": {
      3: ["Full body + cardio", "Piernas + core", "Espalda + HIIT"],
      4: [
        "Pecho + cardio",
        "Piernas + core",
        "Espalda + HIIT",
        "Hombros + abdomen",
      ],
      5: [
        "Pecho + tríceps",
        "Espalda + bíceps",
        "Piernas + core",
        "Cardio + funcional",
        "Hombros + abdomen",
      ],
      6: ["Pecho", "Espalda", "Piernas", "Cardio", "Hombros", "Core"],
    },

    "Mantener peso": {
      3: ["Full body", "Piernas", "Espalda + core"],
      4: ["Pecho + tríceps", "Espalda + bíceps", "Piernas", "Core"],
      5: ["Pecho", "Espalda", "Piernas", "Hombros", "Core"],
      6: ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Core"],
    },

    "Ganar masa muscular": {
      3: ["Pecho + tríceps", "Espalda + bíceps", "Piernas"],
      4: ["Pecho", "Espalda", "Piernas", "Hombros"],
      5: ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos"],
      6: ["Pecho", "Espalda", "Piernas", "Hombros", "Bíceps", "Tríceps"],
    },
  };

  const diasNum = parseInt(dias);
  const rutinaBase = rutinas[objetivo][diasNum];

  let detalleNivel = "";
  if (nivel === "Principiante") detalleNivel = "3 series x 12 repeticiones";
  if (nivel === "Intermedio") detalleNivel = "4 series x 10 repeticiones";
  if (nivel === "Avanzado") detalleNivel = "5 series x 6–8 repeticiones";

  return rutinaBase
    .map((dia, index) => {
      return `
      <strong>Día ${index + 1}:</strong> ${dia}<br>
      Series y reps: ${detalleNivel}<br>
      Descanso: ${nivel === "Avanzado" ? "60–90 seg" : "90–120 seg"}<br><br>
    `;
    })
    .join("");
}

function generarComidas(objetivo, estadoPeso, tiempo) {
  const planes = {
    "Perder grasa": {
      rapido: {
        desayuno: "Avena con claras de huevo y una manzana",
        almuerzo: "Pollo a la plancha con ensalada y quinua",
        cena: "Pescado al horno con verduras",
      },
      normal: {
        desayuno: "Huevos con avena y plátano",
        almuerzo: "Pechuga de pollo con arroz integral y ensalada",
        cena: "Atún con verduras salteadas",
      },
    },

    "Mantener peso": {
      rapido: {
        desayuno: "Yogur natural con fruta y frutos secos",
        almuerzo: "Pollo con arroz integral y verduras",
        cena: "Omelette con ensalada",
      },
      normal: {
        desayuno: "Avena con leche y frutas",
        almuerzo: "Carne magra con papa sancochada",
        cena: "Pescado con verduras",
      },
    },

    "Ganar masa muscular": {
      rapido: {
        desayuno: "Avena con huevos y plátano",
        almuerzo: "Pollo con arroz integral y lentejas",
        cena: "Huevos con papa y palta",
      },
      normal: {
        desayuno: "Avena con leche, frutas y mantequilla de maní",
        almuerzo: "Carne o pollo con arroz y menestras",
        cena: "Pescado con papa y verduras",
      },
    },
  };

  const tipoTiempo = tiempo.includes("30") ? "rapido" : "normal";
  const plan = planes[objetivo][tipoTiempo];

  return `
    <strong>Plan de comidas diario:</strong><br><br>
    🍳 <strong>Desayuno:</strong> ${plan.desayuno}<br>
    🍽️ <strong>Almuerzo:</strong> ${plan.almuerzo}<br>
    🌙 <strong>Cena:</strong> ${plan.cena}<br>
  `;
}

function generatePlan() {
  document.querySelector(".wizard-card").style.display = "none";
  resultBox.style.display = "block";

  const nombre = answers[0];
  const edad = Number(answers[1]);
  const sexo = answers[2];
  const peso = Number(answers[3]);
  const estaturaCm = Number(answers[4]);
  const objetivo = answers[5];
  const actividad = answers[6];
  const dias = answers[7];
  const tiempo = answers[8];

  const estaturaM = estaturaCm / 100;

  // IMC
  const imc = (peso / (estaturaM * estaturaM)).toFixed(1);

  let estadoPeso = "";
  if (imc < 18.5) estadoPeso = "Bajo peso";
  else if (imc < 25) estadoPeso = "Peso saludable";
  else if (imc < 30) estadoPeso = "Sobrepeso";
  else estadoPeso = "Obesidad";

  const comidasHTML = generarComidas(objetivo, estadoPeso, tiempo);

  // Rango de peso saludable
  const pesoMin = (18.5 * estaturaM * estaturaM).toFixed(1);
  const pesoMax = (24.9 * estaturaM * estaturaM).toFixed(1);

  summaryBox.innerHTML = `
    <strong>Nombre:</strong> ${nombre}<br>
    <strong>Edad:</strong> ${edad} años<br>
    <strong>Sexo:</strong> ${sexo}<br>
    <strong>Peso actual:</strong> ${peso} kg<br>
    <strong>Estatura:</strong> ${estaturaCm} cm<br>
    <strong>IMC:</strong> ${imc} (${estadoPeso})<br>
    <strong>Rango de peso saludable:</strong> ${pesoMin} kg – ${pesoMax} kg
  `;

  // Calorías (estimación simple tipo foros fitness)
  let caloriasBase = sexo === "Hombre" ? 24 * peso : 22 * peso;

  if (actividad === "Sedentario") caloriasBase *= 1.2;
  if (actividad === "Moderadamente activo") caloriasBase *= 1.45;
  if (actividad === "Activo") caloriasBase *= 1.65;

  let ajuste = 0;
  if (objetivo === "Perder grasa") ajuste = -400;
  if (objetivo === "Ganar masa muscular") ajuste = 300;

  const caloriasFinal = Math.round(caloriasBase + ajuste);

  nutritionBox.innerHTML = `
    <strong>Calorías recomendadas:</strong> ${caloriasFinal} kcal/día<br>
    <strong>Proteínas:</strong> altas (pollo, pescado, huevos, legumbres)<br>
    <strong>Carbohidratos:</strong> moderados (arroz integral, avena, papa)<br>
    <strong>Grasas:</strong> saludables (palta, frutos secos, aceite de oliva)
  `;

  const rutinaHTML = generarRutina(objetivo, dias, actividad);

  routineBox.innerHTML = `
  <strong>Rutina personalizada:</strong><br><br>
  ${rutinaHTML}

  <strong>Duración por sesión:</strong> ${tiempo}<br>
  <strong>Frecuencia:</strong> ${dias} por semana<br><br>
`;
  routineBox.innerHTML += `
  <br>
  ${comidasHTML}

  <br><strong>Alimentos recomendados:</strong><br>
  🍎 Frutas: manzana, plátano, arándanos, naranja, papaya<br>
  🥦 Verduras: brócoli, espinaca, zanahoria, lechuga<br>
  🍚 Carbohidratos: arroz integral, avena, quinua, papa<br>
  🍗 Proteínas: pollo, pescado, huevo, lentejas, garbanzos<br>
  🥑 Grasas saludables: palta, maní, nueces, aceite de oliva
`;
}

const resetBtn = document.getElementById("resetPlanBtn");

resetBtn.addEventListener("click", () => {
  // limpiar respuestas
  for (let key in answers) {
    delete answers[key];
  }

  // reiniciar estado
  step = 0;

  // ocultar resultado
  resultBox.style.display = "none";

  // mostrar wizard
  document.querySelector(".wizard-card").style.display = "block";

  // reset progreso
  progressFill.style.width = "0%";

  renderStep();

  wizard.scrollIntoView({ behavior: "smooth" });
});

const openPlansBtns = document.querySelectorAll(".btn-nav");
const plansModal = document.getElementById("plansModal");
const closePlans = document.getElementById("closePlans");
const closePlansBtn = document.getElementById("closePlansBtn");

openPlansBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    plansModal.classList.add("active");
    document.body.classList.add("modal-open"); // 👈 CLAVE
  });
});

closePlans.addEventListener("click", () => {
  plansModal.classList.remove("active");
  document.body.classList.remove("modal-open"); // 👈 CLAVE
});

closePlansBtn.addEventListener("click", () => {
  plansModal.classList.remove("active");
  document.body.classList.remove("modal-open"); // 👈 CLAVE
});

// --- COMENZAR PLAN GRATIS ---
const heroBtn = document.querySelector(".btn-hero");
const modalGratisBtn = document.querySelector(
  ".plan-card:first-child .plan-btn",
);

if (modalGratisBtn && heroBtn) {
  modalGratisBtn.addEventListener("click", () => {
    // cerrar modal
    plansModal.classList.remove("active");

    // simular click en "Empezar Plan"
    setTimeout(() => {
      heroBtn.click();
    }, 150);
  });
}

closeWizardBtn.addEventListener("click", () => {
  // ocultar TODO el wizard
  wizard.style.display = "none";

  // limpiar respuestas
  for (let key in answers) {
    delete answers[key];
  }

  // resetear paso
  step = 0;

  // resetear barra de progreso
  progressFill.style.width = "0%";

  // volver al hero
  document.querySelector(".hero").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

const closeResultBtn = document.getElementById("closeResultBtn");

closeResultBtn.addEventListener("click", () => {
  // ocultar resultado completo
  resultBox.style.display = "none";

  // limpiar respuestas
  for (let key in answers) {
    delete answers[key];
  }

  // resetear paso
  step = 0;

  // resetear barra
  progressFill.style.width = "0%";

  // ocultar wizard por seguridad
  wizard.style.display = "none";

  // volver al hero
  document.querySelector(".hero").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

const logoHomeBtn = document.querySelector(".logo");

logoHomeBtn.addEventListener("click", () => {
  // cerrar wizard si está abierto
  wizard.style.display = "none";

  // cerrar resultado si está visible
  resultBox.style.display = "none";

  // limpiar respuestas
  for (let key in answers) {
    delete answers[key];
  }

  // resetear estado
  step = 0;
  progressFill.style.width = "0%";

  // volver al hero
  document.querySelector(".hero").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
