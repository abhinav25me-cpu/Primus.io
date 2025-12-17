
/*
  Global Scroll Reveal Animation
  --------------------------------
  Reusable for:
  - Timeline
  - Project cards
  - Event cards
  - Any future section

  API-ready: Replace animation logic with library or backend triggers later
*/

const scrollRevealElements = document.querySelectorAll('.data-reveal');

const scrollRevealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-6');
                entry.target.classList.add('opacity-100', 'translate-y-0');
                scrollRevealObserver.unobserve(entry.target); // Animate once
            }
        });
    },
    { threshold: 0.15 }
);

scrollRevealElements.forEach(el => scrollRevealObserver.observe(el));

/* =====================================================
   MAIN JS - GLOBAL
   Used across all pages
===================================================== */

/* ===== Load Navbar & Footer ===== */
// Load Navbar
fetch("components/navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar-container").innerHTML = data;

        initNavbar();
    });

function initNavbar() {

    /* ---------- Mobile Menu ---------- */
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });

    /* ---------- Active Link ---------- */
    const links = document.querySelectorAll(".nav-link");
    const currentPage = location.pathname.split("/").pop();

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("text-cyan-400", "font-semibold");
        } else {
            link.classList.add(
                "hover:text-cyan-400",
                "transition",
                "relative",
                "after:absolute",
                "after:left-0",
                "after:-bottom-1",
                "after:h-[2px]",
                "after:w-0",
                "after:bg-cyan-400",
                "after:transition-all",
                "hover:after:w-full"
            );
        }
    });

    /* ---------- Scroll Effect ---------- */
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("bg-slate-900", "shadow-lg");
            navbar.classList.remove("bg-slate-900/80");
        } else {
            navbar.classList.remove("bg-slate-900", "shadow-lg");
            navbar.classList.add("bg-slate-900/80");
        }
    });

    /* ---------- Dark Mode ---------- */
    const themeToggle = document.getElementById("theme-toggle");
    const themeToggleMobile = document.getElementById("theme-toggle-mobile");

    function setTheme(mode) {
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
        }
    }

    if (localStorage.theme === "dark") {
        setTheme("dark");
    }

    themeToggle?.addEventListener("click", () => {
        setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
    });

    themeToggleMobile?.addEventListener("click", () => {
        setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
    });
}

/*Global Glassmorphism Setup*/
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            backdropBlur: {
                xs: '2px'
            }
        }
    }
}

/**
 * footer.js
 * -----------------------------
 * Purpose:
 * - Dynamically load footer.html on all pages
 * - Ensures consistency across website
 * - Makes future updates easy
 *
 * How it works:
 * - Fetches footer component
 * - Injects it into #footer-placeholder
 *
 * Future Ready:
 * - API-based footer content can be injected here later
 */

document.addEventListener("DOMContentLoaded", () => {
    fetch("components/footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Footer failed to load");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading footer:", error);
        });
});

/**
 * Scroll To Top Button Logic
 * --------------------------
 * - Button appears after scrolling 300px
 * - Smooth scroll to top
 */

document.addEventListener("scroll", () => {
    const btn = document.getElementById("scrollToTopBtn");

    if (!btn) return;

    if (window.scrollY > 300) {
        btn.classList.remove("hidden");
    } else {
        btn.classList.add("hidden");
    }
});

// Smooth scroll
document.addEventListener("click", (e) => {
    if (e.target.closest("#scrollToTopBtn")) {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});

/* ===== Event Category Filter ===== */
function filterCategory(category) {
    document.querySelectorAll(".event-card").forEach(card => {
        if (category === "all" || card.classList.contains(category)) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });
}

/* ===== Sort Upcoming Events ===== */
function sortUpcomingEvents() {
    const container = document.getElementById("upcomingEvents");
    if (!container) return;

    const cards = Array.from(container.children);
    const type = document.getElementById("sortEvents").value;

    cards.sort((a, b) => {
        return type === "date"
            ? new Date(a.dataset.date) - new Date(b.dataset.date)
            : a.dataset.name.localeCompare(b.dataset.name);
    });

    cards.forEach(card => container.appendChild(card));
}

/* ===== Scroll Reveal Animation ===== */
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    { threshold: 0.15 }
);

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});

// -------------------------
// THEME MANAGEMENT (DARK MODE)
// -------------------------

// Apply saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    // Optional: sync toggle button state if you have a switch
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
        themeToggleBtn.checked = theme === "dark";
    }
});

// Toggle theme function (call this from navbar button)
function toggleTheme() {
    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

    // Optional: update toggle button state
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
        themeToggleBtn.checked = document.documentElement.classList.contains("dark");
    }
}

// -------------------------

tailwind.config = { darkMode: 'class' }

/**
 * achievements.js
 * -------------------------
 * Handles:
 * - Animated statistics counters
 * - Future API integration hooks
 */

// Counter animation
const counters = document.querySelectorAll(".stat-number");

const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let count = 0;
    const increment = target / 100;

    const update = () => {
      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });
};


/**
 * 🔮 FUTURE API:
 * fetch('/api/achievements')
 *   .then(res => res.json())
 *   .then(data => renderAchievements(data))
 */

// Contact Form (Frontend Only)
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // API-READY: send form data to backend here

        formSuccess.classList.remove("hidden");
        contactForm.reset();

        setTimeout(() => {
            formSuccess.classList.add("hidden");
        }, 4000);
    });
}

/*
  team.js
  ---------------------------------
  - Loads team from JSON
  - Filters by specialization
  - Modal profile view
  - Scroll reveal animation
*/

let teamData = {};
let currentFilter = "All";

fetch("data/team.json")
  .then(res => res.json())
  .then(data => {
    teamData = data;
    renderMembers();
    scrollReveal();
  });

/* ================= Render Members ================= */
function renderMembers() {
  const container = document.getElementById("teamMembers");
  container.innerHTML = "";

  teamData.members
    .filter(m => currentFilter === "All" || m.group === currentFilter)
    .forEach(member => {
      const card = document.createElement("div");
      card.className =
        "glass-card p-5 cursor-pointer reveal hover:scale-105 transition";

      card.innerHTML = `
        <h4 class="font-semibold">${member.name}</h4>
        <p class="text-sm text-slate-500">${member.role}</p>
        <span class="text-xs text-cyan-500">${member.group}</span>
      `;

      container.appendChild(card);
    });
}

/* ================= Filter Buttons ================= */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderMembers();
    scrollReveal();
  });
});

/* ================= Scroll Reveal ================= */
function scrollReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

