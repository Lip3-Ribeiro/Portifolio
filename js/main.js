
// =========================================================
// HYBRID / PORTFOLIO — MAIN JS
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // Inicializa ícones
    if (window.lucide) {
        lucide.createIcons();
    }


    // =====================================================
    // MENU MOBILE
    // =====================================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.innerHTML = isOpen
                ? '<i data-lucide="x"></i>'
                : '<i data-lucide="menu"></i>';

            menuToggle.setAttribute("aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );

            if (window.lucide) {
                lucide.createIcons();
            }

        });


        // Fecha menu ao clicar em um link

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                navLinks.classList.remove("open");

                menuToggle.innerHTML = '<i data-lucide="menu"></i>';

                if (window.lucide) {
                    lucide.createIcons();
                }
            });

        });


        // Fecha menu se clicar fora

        document.addEventListener("click", (event) => {

            const clickedInsideMenu = navLinks.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                navLinks.classList.remove("open");
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';

                if (window.lucide) {
                    lucide.createIcons();
                }
            }

        });

    }


    // =====================================================
    // NAVBAR AO ROLAR
    // =====================================================

    const navbar = document.querySelector(".navbar");

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    }

    updateNavbar();

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });


    // =====================================================
    // SCROLL REVEAL
    // =====================================================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        }, {
            threshold: 0.12
        });


        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        // Fallback para navegadores sem IntersectionObserver
        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    // =====================================================
    // BRILHO SEGUINDO O MOUSE
    // =====================================================

    const mouseGlow = document.querySelector(".mouse-glow");

    // Desativa em dispositivos sem mouse
    const hasMouse = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (mouseGlow && hasMouse) {

        window.addEventListener("mousemove", (event) => {

            mouseGlow.style.left = event.clientX + "px";
            mouseGlow.style.top = event.clientY + "px";

        }, {
            passive: true
        });

    } else if (mouseGlow) {

        mouseGlow.style.display = "none";

    }


    // =====================================================
    // ANO AUTOMÁTICO DO FOOTER
    // =====================================================

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // =====================================================
    // ENTRADA SUAVE DA PÁGINA
    // =====================================================

    document.body.classList.add("page-loaded");

});
