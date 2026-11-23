
/* =========================================================
   CONTACT FORM — PORTFOLIO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");

    if (!form || !feedback) return;


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        // =================================================
        // CAPTURA DOS CAMPOS
        // =================================================

        const nome = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const assunto = document.getElementById("contactSubject").value;
        const mensagem = document.getElementById("contactMessage").value.trim();


        // =================================================
        // VALIDAÇÃO
        // =================================================

        if (!nome || !email || !assunto || !mensagem) {

            feedback.textContent = "Preencha todos os campos.";
            feedback.className = "form-feedback error";

            return;
        }


        if (mensagem.length < 10) {

            feedback.textContent =
                "Sua mensagem precisa ter pelo menos 10 caracteres.";

            feedback.className = "form-feedback error";

            return;
        }


        // =================================================
        // MONTAGEM DO EMAIL
        // =================================================

        // SUBSTITUA PELO SEU EMAIL REAL
        const destinatario = "LipeRibeiro0509@gmail.com";

        const corpoEmail = `
Olá! Você recebeu uma nova mensagem através do seu portfólio.

Nome: ${nome}
Email: ${email}
Assunto: ${assunto}

Mensagem:
${mensagem}
        `;


        // =================================================
        // MAILTO
        // =================================================

        const mailto = `mailto:${destinatario}?subject=${
            encodeURIComponent("Contato pelo portfólio: " + assunto)
        }&body=${encodeURIComponent(corpoEmail)}`;


        // Feedback
        feedback.textContent =
            "Seu aplicativo de email será aberto para concluir o envio.";

        feedback.className = "form-feedback success";


        // Abre o aplicativo de email
        window.location.href = mailto;

    });

});
