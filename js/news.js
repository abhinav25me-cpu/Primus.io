const grid = document.getElementById("newsGrid");
const searchInput = document.getElementById("newsSearch");
const filterBtns = document.querySelectorAll(".news-filter-btn");

const modal = document.getElementById("newsModal");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalContent = document.getElementById("modalContent");
const modalLink = document.getElementById("modalLink");
const closeModal = document.getElementById("closeModal");

let allNews = [];
let activeCategory = "all";

// Fetch news from JSON
fetch("data/news.json")
  .then(res => res.json())
  .then(data => {
    allNews = data;
    renderNews(allNews);
  });

// Render cards
function renderNews(news) {
  grid.innerHTML = "";

  news.forEach(item => {
    const card = document.createElement("article");
    card.className = "news-card reveal";

    card.innerHTML = `
      <h3 class="news-title">${item.title}</h3>
      <p class="news-meta">${item.date} • ${item.source}</p>
      <p class="news-summary">${item.summary.slice(0, 120)}...</p>
      <button class="read-more-btn">Read More →</button>
    `;

    card.querySelector(".read-more-btn")
      .addEventListener("click", () => openModal(item));

    grid.appendChild(card);
  });

  revealOnScroll();
}

// Modal
function openModal(item) {
  modalTitle.textContent = item.title;
  modalMeta.textContent = `${item.date} • ${item.source}`;
  modalContent.textContent = item.summary;

  if (item.link) {
    modalLink.href = item.link;
    modalLink.classList.remove("hidden");
  } else {
    modalLink.classList.add("hidden");
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

closeModal.onclick = () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

// Filters
filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    applyFilters();
  };
});

// Search
searchInput.addEventListener("input", applyFilters);

function applyFilters() {
  const query = searchInput.value.toLowerCase();

  const filtered = allNews.filter(n => {
    const matchCategory =
      activeCategory === "all" || n.category === activeCategory;
    const matchSearch =
      n.title.toLowerCase().includes(query) ||
      n.summary.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  renderNews(filtered);
}

// Scroll reveal
function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.15 });

  items.forEach(i => observer.observe(i));
}