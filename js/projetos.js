
/* =========================================================
   FILTRO DE PROJETOS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const totalProjects = document.getElementById("totalProjects");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;

            // Remove o estado ativo de todos os botões
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            // Ativa o botão clicado
            button.classList.add("active");

            let visibleCount = 0;

            // Percorre todos os projetos
            projectCards.forEach(card => {

                const categories = card.dataset.category.split(" ");

                const shouldShow =
                    filter === "all" ||
                    categories.includes(filter);

                if (shouldShow) {

                    card.classList.remove("is-hidden");
                    visibleCount++;

                } else {

                    card.classList.add("is-hidden");

                }

            });

            // Atualiza contador de projetos visíveis
            if (totalProjects) {
                totalProjects.textContent =
                    String(visibleCount).padStart(2, "0");
            }

        });

    });

});
