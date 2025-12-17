/* =========================================================
   PROJECT MODAL CONTROLLER
   ========================================================= */

const modal = document.getElementById("projectModal");

function openModal(project) {
  document.getElementById("modalLinks").innerHTML = `
  ${project.github ? `<a href="${project.github}" target="_blank" class="text-blue-400 hover:underline">GitHub</a>` : ""}
  ${project.demo ? `<a href="${project.demo}" target="_blank" class="text-green-400 hover:underline">Live Demo</a>` : ""}
`;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  document.getElementById("modalImage").src = project.image;
  document.getElementById("modalTitle").innerText = project.title;
  document.getElementById("modalDesc").innerText = project.description;
  document.getElementById("modalTech").innerText = project.tech.join(", ");
  document.getElementById("modalTeam").innerText =
    project.team?.join(", ") || "—";
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

/* Close modal on outside click */
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});
