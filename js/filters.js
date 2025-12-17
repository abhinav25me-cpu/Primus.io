/* =========================================================
   PROJECTS – FETCH, FILTER, SEARCH, RENDER
   ========================================================= */

let projects = [];

const grid = document.getElementById("projectsGrid");
const yearFilter = document.getElementById("yearFilter");
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");

/* Fetch JSON data */
async function loadProjects() {
  try {
    const res = await fetch("data/projects.json");
    projects = await res.json();
    populateFilters();
    renderProjects();
  } catch (err) {
    console.error(err);
    grid.innerHTML =
      "<p class='text-center text-red-400'>Failed to load projects.</p>";
  }
}

/* Auto-generate filter options */
function populateFilters() {
  const years = [...new Set(projects.map(p => p.year))].sort().reverse();
  const types = [...new Set(projects.map(p => p.type))].sort();

  yearFilter.innerHTML =
    '<option value="all">All Years</option>' +
    years.map(y => `<option value="${y}">${y}</option>`).join("");

  typeFilter.innerHTML =
    '<option value="all">All Domains</option>' +
    types.map(t => `<option value="${t}">${t}</option>`).join("");
}

/* Render cards */
function renderProjects() {
  const year = yearFilter.value;
  const type = typeFilter.value;
  const query = searchInput.value.toLowerCase();

  grid.innerHTML = "";

  const filtered = projects.filter(p =>
    (year === "all" || p.year === year) &&
    (type === "all" || p.type === type) &&
    (
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tech.join(" ").toLowerCase().includes(query)
    )
  );

  if (!filtered.length) {
    grid.innerHTML =
      "<p class='col-span-full text-center text-gray-400'>No projects found.</p>";
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className =
      "bg-slate-900 rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 transition";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="h-48 w-full object-cover" />

      <div class="p-5">
        <h3 class="text-xl font-semibold">${p.title}</h3>
        <p class="text-sm text-gray-400 mb-2">${p.year} • ${p.type}</p>
        <p class="text-sm text-gray-400 line-clamp-3">${p.description}</p>

        <div class="mt-4 flex gap-3 text-sm">
          ${p.github ? `<a href="${p.github}" target="_blank" class="text-blue-400 hover:underline"><i class="fa-brands fa-github"></i> GitHub</a>` : ""}
          ${p.demo ? `<a href="${p.demo}" target="_blank" class="text-green-400 hover:underline"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ""}
          <button class="ml-auto text-primary hover:underline" onclick='openModal(${JSON.stringify(p)})'>
            Details
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* Event listeners */
yearFilter.addEventListener("change", renderProjects);
typeFilter.addEventListener("change", renderProjects);
searchInput.addEventListener("input", renderProjects);

/* Init */
loadProjects();