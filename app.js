const ESTADOS_ORDEN = ["Retrasado", "En curso", "Pendiente", "Completado"];

let FASES = [];

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

function crearLista(items, claseVacio = "empty") {
  const ul = document.createElement("ul");
  if (!items || items.length === 0) {
    const li = document.createElement("li");
    li.className = claseVacio;
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

/* Vista: tablero (tarjetas compactas, navegables) */

function crearTarjetaNav(fase) {
  const card = document.createElement("a");
  card.className = "phase-nav-card";
  card.href = `#fase-${fase.id}`;
  card.dataset.estado = fase.estado;

  const main = document.createElement("span");
  main.className = "phase-nav-main";

  const h2 = document.createElement("h2");
  h2.textContent = fase.nombre;
  main.appendChild(h2);

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.dataset.estado = fase.estado;
  badge.textContent = fase.estado;
  main.appendChild(badge);

  const arrow = document.createElement("span");
  arrow.className = "nav-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";

  card.appendChild(main);
  card.appendChild(arrow);

  return card;
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  FASES.forEach((fase) => board.appendChild(crearTarjetaNav(fase)));
}

/* Vista: detalle de una fase (texto a la izquierda, flujo grande a la derecha) */

function crearVistaDetalle(fase) {
  const wrap = document.createElement("div");

  const header = document.createElement("div");
  header.className = "detail-header";

  const back = document.createElement("a");
  back.className = "back-link";
  back.href = "#";
  back.textContent = "← Volver al tablero";
  header.appendChild(back);
  wrap.appendChild(header);

  const titleRow = document.createElement("div");
  titleRow.className = "detail-title-row";

  const h2 = document.createElement("h2");
  h2.textContent = fase.nombre;
  titleRow.appendChild(h2);

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.dataset.estado = fase.estado;
  badge.textContent = fase.estado;
  titleRow.appendChild(badge);

  wrap.appendChild(titleRow);

  if (fase.descripcion) {
    const desc = document.createElement("p");
    desc.className = "phase-desc";
    desc.textContent = fase.descripcion;
    wrap.appendChild(desc);
  }

  const grid = document.createElement("div");
  grid.className = "detail-grid";

  const left = document.createElement("div");
  left.className = "detail-left";

  const meta = document.createElement("div");
  meta.className = "phase-meta";
  meta.innerHTML = `
    <span><strong>Responsable:</strong> ${fase.responsable || "Por definir"}</span>
    <span><strong>Fecha reunión:</strong> ${formatearFecha(fase.fechaReunion)}</span>
  `;
  left.appendChild(meta);
  left.appendChild(crearSeccion("Logros", fase.logros));
  left.appendChild(crearSeccion("Pendientes", fase.pendientes));

  const right = document.createElement("div");
  right.className = "detail-right";

  const flujoTitle = document.createElement("h3");
  flujoTitle.textContent = "Flujo encontrado";
  right.appendChild(flujoTitle);

  const flujoList = document.createElement("ol");
  flujoList.className = "flujo-list";
  if (!fase.flujo || fase.flujo.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Sin registros";
    flujoList.appendChild(li);
  } else {
    fase.flujo.forEach((paso) => {
      const li = document.createElement("li");
      li.textContent = paso;
      flujoList.appendChild(li);
    });
  }
  right.appendChild(flujoList);

  grid.appendChild(left);
  grid.appendChild(right);
  wrap.appendChild(grid);

  return wrap;
}

function renderDetalle(id) {
  const fase = FASES.find((f) => String(f.id) === String(id));
  const detail = document.getElementById("detail");
  detail.innerHTML = "";
  if (!fase) {
    router();
    return;
  }
  detail.appendChild(crearVistaDetalle(fase));
}

/* Router simple basado en el hash de la URL */

function router() {
  const board = document.getElementById("board");
  const detail = document.getElementById("detail");
  const legend = document.getElementById("legend");
  const hash = window.location.hash;
  const match = hash.match(/^#fase-(.+)$/);

  if (match) {
    board.hidden = true;
    legend.hidden = true;
    detail.hidden = false;
    renderDetalle(match[1]);
  } else {
    board.hidden = false;
    legend.hidden = false;
    detail.hidden = true;
  }
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

    FASES = datos.fases || [];
    renderBoard();
    router();
  } catch (error) {
    board.innerHTML = "";
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "#ffffff";
    errorMsg.textContent =
      "No se pudo cargar data.json. Si estás abriendo el archivo directamente desde el disco, sírvelo con un servidor local (por ejemplo: python seguimiento.py).";
    board.appendChild(errorMsg);
    console.error(error);
  }
}

window.addEventListener("hashchange", router);

renderLegend();
cargarTablero();
