class GerenciadorPausas {
    constructor() {
        this.contadorPausas = 0;
        this.container = document.getElementById('pausas-container');
        this.botaoAdicionar = document.getElementById('adicionar-pausa');

        this.inicializarEventos();
        this.adicionarPausa(); // Adiciona a primeira pausa automaticamente
    }

    inicializarEventos() {
        this.botaoAdicionar.addEventListener('click', () => {
            this.adicionarPausa();
        });

        // Delegation para os botões de remover
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remover')) {
                this.removerPausa(e.target.closest('.pausa'));
            }
        });
    }

    adicionarPausa() {
    this.contadorPausas++;
    const idPausa = `pausa-${this.contadorPausas}`;

    const pausaHTML = `
        <section class="pausa " id="${idPausa}">
            <h3>Pausa ${this.contadorPausas}</h3>

            <section class="hora ">
                <label for="pausa_inicio-${idPausa}" class="pausa-item">Horário de Início</label>
                <input type="time" class="pausa_hr" name="pausa_inicio" id="pausa_inicio-${idPausa}" required>
            </section>

            <section class="hora">
                <label for="pausa_fim-${idPausa}" class="pausa-item" >Horário de Término</label>
                <input type="time" class="pausa_hr" name="pausa_fim" id="pausa_fim-${idPausa}" required>
            </section>

            ${this.contadorPausas > 1 ? `
                <button type="button" class="btn-remover hora">Remover Pausa</button>
            ` : ''}
        </section>
    `;

    this.container.insertAdjacentHTML('beforeend', pausaHTML);
}


    removerPausa(container) {
    if (this.contadorPausas > 1) {
        container.remove(); // agora container é o bloco inteiro .pausa
        this.contadorPausas--;
        this.atualizarNumeracao();
    }
}

    atualizarNumeracao() {
        const containers = this.container.querySelectorAll('.hora');
        containers.forEach((container, index) => {
            const titulo = container.querySelector('h3');
            titulo.textContent = `Pausa ${index + 1}`;
        });
    }

    // Método para obter todos os dados das pausas
    obterDadosPausas() {
        const dados = [];
        const containers = this.container.querySelectorAll('.hora');

        containers.forEach(container => {
            const id = container.id;
            dados.push({
                pausaInicio: document.getElementById(`pausa_inicio-${id}`).value,
                pausaFim: document.getElementById(`pausa_fim-${id}`).value,
                
            });
        });

        return dados;
    }
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.gerenciadorPausas = new GerenciadorPausas();
});