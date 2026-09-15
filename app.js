const ESTADOS_ORDEN = ["Retrasado", "En curso", "Pendiente", "Completado"];

function formatearFecha(fechaISO) {
  if (!fechaISO) return "Sin definir";
  const fecha = new Date(fechaISO + "T00:00:00");
  if (Number.isNaN(fecha.getTime())) return fechaISO;
  return fecha.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function crearLista(items) {
  const ul = document.createElement("ul");
  if (!items || items.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Sin registros";
    ul.appendChild(li);
    return ul;
  }
  items.forEach((texto) => {
    const li = document.createElement("li");
    li.textContent = texto;
    ul.appendChild(li);
  });
  return ul;
}

function crearSeccion(titulo, items) {
  const section = document.createElement("div");
  section.className = "phase-section";
  const h3 = document.createElement("h3");
  h3.textContent = titulo;
  section.appendChild(h3);
  section.appendChild(crearLista(items));
  return section;
}

function crearTarjetaFase(fase) {
  const card = document.createElement("article");
  card.className = "phase-card";
  card.dataset.estado = fase.estado;

  const bodyId = `phase-body-${fase.id}`;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "phase-toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", bodyId);

  const toggleMain = document.createElement("span");
  toggleMain.className = "phase-toggle-main";

  const h2 = document.createElement("h2");
  h2.textContent = fase.nombre;
  toggleMain.appendChild(h2);

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.dataset.estado = fase.estado;
  badge.textContent = fase.estado;
  toggleMain.appendChild(badge);

  const chevron = document.createElement("span");
  chevron.className = "chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = "⌄";

  toggle.appendChild(toggleMain);
  toggle.appendChild(chevron);
  card.appendChild(toggle);

  const body = document.createElement("div");
  body.className = "phase-body";
  body.id = bodyId;
  body.hidden = true;

  if (fase.descripcion) {
    const desc = document.createElement("p");
    desc.className = "phase-desc";
    desc.textContent = fase.descripcion;
    body.appendChild(desc);
  }

  const meta = document.createElement("div");
  meta.className = "phase-meta";
  meta.innerHTML = `
    <span><strong>Responsable:</strong> ${fase.responsable || "Por definir"}</span>
    <span><strong>Fecha reunión:</strong> ${formatearFecha(fase.fechaReunion)}</span>
  `;
  body.appendChild(meta);

  body.appendChild(crearSeccion("Flujo encontrado", fase.flujo));
  body.appendChild(crearSeccion("Logros", fase.logros));
  body.appendChild(crearSeccion("Pendientes", fase.pendientes));

  card.appendChild(body);

  toggle.addEventListener("click", () => {
    const abrir = body.hidden;
    body.hidden = !abrir;
    toggle.setAttribute("aria-expanded", String(abrir));
    card.classList.toggle("is-open", abrir);
  });

  return card;
}

function renderLegend() {
  const legend = document.getElementById("legend");
  if (!legend) return;
  legend.innerHTML = "";
  ESTADOS_ORDEN.forEach((estado) => {
    const item = document.createElement("span");
    item.className = "legend-item";
    const dot = document.createElement("span");
    dot.className = "legend-dot";
    dot.dataset.estado = estado;
    dot.style.background = getComputedStyle(document.documentElement)
      .getPropertyValue(
        {
          Completado: "--accent-green",
          "En curso": "--accent-blue",
          Pendiente: "--accent-terracotta",
          Retrasado: "--accent-red",
        }[estado]
      )
      .trim();
    item.appendChild(dot);
    item.appendChild(document.createTextNode(estado));
    legend.appendChild(item);
  });
}

async function cargarTablero() {
  const board = document.getElementById("board");
  const updatedEl = document.getElementById("updated-date");

  try {
    const respuesta = await fetch("data.json", { cache: "no-store" });
    if (!respuesta.ok) throw new Error("No se pudo cargar data.json");
    const datos = await respuesta.json();

    if (updatedEl) {
      updatedEl.textContent = `Actualizado: ${formatearFecha(datos.actualizado)}`;
    }

    board.innerHTML = "";
    (datos.fases || []).forEach((fase) => {
      board.appendChild(crearTarjetaFase(fase));
    });
  } catch (error) {
    board.innerHTML = "";
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "#ffffff";
    errorMsg.textContent =
      "No se pudo cargar data.json. Si estás abriendo el archivo directamente desde el disco, sírvelo con un servidor local (por ejemplo: npx serve).";
    board.appendChild(errorMsg);
    console.error(error);
  }
}

renderLegend();
cargarTablero();
