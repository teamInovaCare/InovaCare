document.addEventListener('DOMContentLoaded', () => {
    const atuaisTab = document.getElementById('atuaisTab');
    const passadasTab = document.getElementById('passadasTab');
    const atuais = document.getElementById('atuais');
    const passadas = document.getElementById('passadas');

    function showAtuais() {
        atuais.style.display = 'flex';
        passadas.style.display = 'none';
        atuaisTab.classList.add('active-tab');
        passadasTab.classList.remove('active-tab');
    }

    function showPassadas() {
        atuais.style.display = 'none';
        passadas.style.display = 'flex';
        passadasTab.classList.add('active-tab');
        atuaisTab.classList.remove('active-tab');
    }

    atuaisTab.addEventListener('click', showAtuais);
    passadasTab.addEventListener('click', showPassadas);

    // Inicialmente, mostrar os retângulos "Atuais"
    showAtuais();

    // Retângulos expansíveis
    const retangCg1 = document.getElementById('retangCg-1');
    const expandableContent1 = document.getElementById('expandable-content-1');

    const retangCg2 = document.getElementById('retangCg-2');
    const expandableContent2 = document.getElementById('expandable-content-2');

    const retangCg3 = document.getElementById('retangCg-3');
    const expandableContent3 = document.getElementById('expandable-content-3');

    const retangCg4 = document.getElementById('retangCg-4');
    const expandableContent4 = document.getElementById('expandable-content-4');

    function toggleExpand(event) {
        event.currentTarget.classList.toggle('expanded');
    }

    retangCg1.addEventListener('click', toggleExpand);
    retangCg2.addEventListener('click', toggleExpand);
    retangCg3.addEventListener('click', toggleExpand);
    retangCg4.addEventListener('click', toggleExpand);
});


/* Avaliar Profissional */

const popup = document.getElementById("popup");
    const estrelas = document.querySelectorAll(".star");
    const commentBox = document.getElementById("comment-box");
    let avaliacao = 0;

    function abrirPopup() {
      popup.style.display = "flex";
    }

    function fecharPopup() {
      popup.style.display = "none";
      limpar();
    }

    function limpar() {
      estrelas.forEach(e => e.classList.remove("selected"));
      avaliacao = 0;
      commentBox.style.display = "none";
      document.getElementById("comentario").value = "";
    }

    estrelas.forEach((estrela, index) => {
      estrela.addEventListener("click", () => {
        avaliacao = index + 1;
        atualizarEstrelas(avaliacao);
        commentBox.style.display = "block";
      });
    });

    function atualizarEstrelas(valor) {
      estrelas.forEach((estrela, i) => {
        estrela.classList.toggle("selected", i < valor);
      });
    }

    function enviar() {
      const comentario = document.getElementById("comentario").value.trim();

      if (avaliacao === 0) {
        alert("Por favor, selecione uma avaliação.");
        return;
      }

      if (!comentario) {
        alert("Por favor, escreva um comentário.");
        return;
      }

      // Aqui você pode enviar para backend com fetch/AJAX, etc.
      alert(`Avaliação: ${avaliacao} estrela(s)\nComentário: ${comentario}`);
      fecharPopup();
    }