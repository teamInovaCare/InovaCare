document.addEventListener('DOMContentLoaded', function () {
    const btnAvaliar = document.getElementById('btnAvaliar');
    const formComentario = document.getElementById('formComentario');
    const estrelas = document.querySelectorAll('.estrela-avaliacao');
    const notaInput = document.getElementById('notaAvaliacao');
    const comentarioSection = document.getElementById('comentarioSection');
    const avaliacoesExibidas = document.getElementById('avaliacoesExibidas');
    const textareaComentario = document.getElementById('comentario');

    let comentarioEditando = null; // Guarda o comentário que está sendo editado

    // Mostrar formulário ao clicar no botão Avaliar
    btnAvaliar.addEventListener('click', function () {
        formComentario.style.display = 'block';
        btnAvaliar.style.display = 'none';
    });

    // Função para atualizar as estrelas no formulário
    function atualizarEstrelas(valor) {
        estrelas.forEach((e, index) => {
            if (index < valor) {
                e.classList.add('ativa', 'bi-star-fill');
                e.classList.remove('bi-star');
            } else {
                e.classList.remove('ativa', 'bi-star-fill');
                e.classList.add('bi-star');
            }
        });
    }

    // Clicar nas estrelas para selecionar nota
    estrelas.forEach(estrela => {
        estrela.addEventListener('click', function () {
            const valor = parseInt(this.getAttribute('data-value'));
            notaInput.value = valor;
            comentarioSection.style.display = valor > 0 ? 'block' : 'none';
            atualizarEstrelas(valor);
        });

        estrela.addEventListener('mouseover', function () {
            const valor = parseInt(this.getAttribute('data-value'));
            estrelas.forEach((e, index) => {
                if (index < valor) e.classList.add('ativa');
                else e.classList.remove('ativa');
            });
        });

        estrela.addEventListener('mouseout', function () {
            const valorAtual = parseInt(notaInput.value);
            estrelas.forEach((e, index) => {
                if (index < valorAtual) e.classList.add('ativa');
                else e.classList.remove('ativa');
            });
        });
    });

    formComentario.addEventListener('submit', function (e) {
        e.preventDefault();

        const nota = parseInt(notaInput.value);
        const comentario = textareaComentario.value.trim();

        if (nota === 0) {
            alert('Por favor, selecione uma avaliação com as estrelas.');
            return;
        }

        if (comentarioEditando) {
            // Editando avaliação existente
            const estrelasExibidas = comentarioEditando.querySelector('.estrelas');
            estrelasExibidas.innerHTML =
                [...Array(nota)].map(() => '<i class="bi bi-star-fill"></i>').join('') +
                [...Array(5 - nota)].map(() => '<i class="bi bi-star"></i>').join('');

            comentarioEditando.querySelector('.texto-comentario').textContent = comentario || 'Nenhum comentário.';

            comentarioEditando = null; // limpar estado
        } else {
            // Criar nova avaliação
            const novoComentario = document.createElement('section');
            novoComentario.classList.add('comentario');

            // HTML principal do comentário
            novoComentario.innerHTML = `
                <section class="cabecalho-comentario">
                    <section class="autor-comentario">Você</section>
                    <section class="data-comentario">${new Date().toLocaleDateString()}</section>
                </section>
                <section class="avaliacao-comentario">
                    <section class="estrelas">
                        ${[...Array(nota)].map(() => '<i class="bi bi-star-fill"></i>').join('')}
                        ${[...Array(5 - nota)].map(() => '<i class="bi bi-star"></i>').join('')}
                    </section>
                </section>
                <section class="texto-comentario">${comentario || 'Nenhum comentário.'}</section>
            `;

            // Criar botão editar dinamicamente
            const iconeEditar = document.createElement('section');
            iconeEditar.classList.add('icone-editar-comentario');
            iconeEditar.title = 'Editar';
            iconeEditar.innerHTML = `<i class="bi bi-pencil"></i>`;

            // Adicionar evento ao botão editar
            iconeEditar.addEventListener('click', function () {
                comentarioEditando = novoComentario;

                // Preencher formulário com dados para edição
                const estrelasSelecionadas = novoComentario.querySelectorAll('.bi-star-fill').length;
                notaInput.value = estrelasSelecionadas;
                atualizarEstrelas(estrelasSelecionadas);
                comentarioSection.style.display = 'block';
                textareaComentario.value = novoComentario.querySelector('.texto-comentario').textContent;

                formComentario.style.display = 'block';
                btnAvaliar.style.display = 'none';
            });

            // Colocar botão editar dentro da seção de avaliação (junto com estrelas)
            const avaliacaoComentario = novoComentario.querySelector('.avaliacao-comentario');
            avaliacaoComentario.appendChild(iconeEditar);

            // Inserir o novo comentário na lista
            avaliacoesExibidas.prepend(novoComentario);
        }

        // Resetar form depois de enviar
        formComentario.reset();
        notaInput.value = '0';
        atualizarEstrelas(0);
        comentarioSection.style.display = 'none';
        formComentario.style.display = 'none';

        // Ocultar botão Avaliar após enviar
        btnAvaliar.style.display = 'none';
    });
});
