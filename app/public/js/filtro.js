const medicos = [
    {
        id: 1,
        nome: 'Cleber Jr.',
        crm: 'CRM - SP 284692',
        preco: 'R$ 180,00',
        nota: '4,9',
        localidades:['Barueri', 'Osasco'],
        modalidades: ['online', 'domiciliar'],
        localizacao: 'São Paulo',
        precos: {
            domiciliar: 'R$ 190,00',
            online: 'R$ 150,00'
        }
    },
    {
        id: 2,
        nome: 'Marina Silva',
        crm: 'CRM - RJ 103456',
        preco: 'R$ 120,00',
        nota: '4,8',
        localidades: [], // Adicione array vazio para consistência
        modalidades: ['online'],
        localizacao: 'Rio de Janeiro'
    },
    {
        id: 3,
        nome: 'Jorge Santos',
        crm: 'CRM - RJ 120383',
        preco: 'R$ 180,00',
        nota: '4,9',
        localidades: [], // Adicione array vazio para consistência
        modalidades: ['domiciliar'],
        localizacao: 'Rio de Janeiro'
    },
    {
        id: 4,
        nome: 'Bruno Pacheco',
        crm: 'CRM - SP 612029',
        preco: 'R$ 210,00',
        nota: '5',
        localidades: ['Alphaville', 'Jandira'], // Exemplo de mais localidades
        modalidades: ['online', 'domiciliar'],
        localizacao: 'São Paulo'
    },
    {
        id: 5,
        nome: 'Jéssica Matos',
        crm: 'CRM - SP 389237',
        preco: 'R$ 80,00',
        nota: '4,7',
        localidades: [], // Adicione array vazio para consistência
        modalidades: ['online'],
        localizacao: 'São Paulo'
    }
];

function renderizarMedicos(medicosParaExibir) {
    const container = document.querySelector('.perfis');
    container.innerHTML = '';

    if (medicosParaExibir.length === 0) {
        // ... (Código para sem resultados) ...
        return;
    }

    const imagens = ['perfil.png', 'perfil.png', 'perfil.png', 'perfil.png', 'perfil.png'];
    medicosParaExibir.forEach((medico, index) => {
        const imagemPerfil = imagens[index % imagens.length];
        
        // --- SEÇÃO DE PREÇOS (ATENDIMENTOS) ---
        let secaoPrecos = '';
        const precos = medico.precos || {};
        const chavesPrecos = Object.keys(precos);

        if (chavesPrecos.length > 0) {
            let listaPrecos = '';
            
            // Ordem preferencial: Domiciliar, Online
            if (precos.domiciliar) {
                listaPrecos += `<p class="item-preco">Domiciliar: <span class="valor-preco">${precos.domiciliar}</span></p>`;
            }
            if (precos.online) {
                listaPrecos += `<p class="item-preco">Online: <span class="valor-preco">${precos.online}</span></p>`;
            }
            
            secaoPrecos = `
                <section class="atendimentos-precos">
                    <p class="titulo-atendimentos">Atendimentos</p>
                    ${listaPrecos}
                </section>
            `;
        }
        
        // --- SEÇÃO DE LOCALIDADES (Regiões) ---
        const listaLocalidades = medico.localidades && medico.localidades.length > 0
            ? medico.localidades.map(localidade => `<li>${localidade}</li>`).join('')
            : '';

        const secaoLocalidades = listaLocalidades
            ? `
                <section class="localidades">
                    <p class="titulo-localidades">Regiões de atendimento em domicílio:</p>
                    <ul>
                        ${listaLocalidades}
                    </ul>
                </section>
              `
            : '';

        const card = `
            <section class="retangulo">
                <section class="small-rectangle">
                    <img src="imagens/${imagemPerfil}" alt="Perfil" class="perfil1">
                    
                    <section class="infos">
                        <section class="medico-info"> 
                            <p class="nome">${medico.nome}</p>
                            <p class="idnt">${medico.crm}</p>
                            <p class="nota">${medico.nota} <img src="imagens/star-l.png" alt="Estrela" class="nota-img"></p>
                        </section>
                        
                        ${secaoPrecos}
                        
                        ${secaoLocalidades}
                        
                    </section>
                    
                    <section class="btn-mod">
                        ${medico.modalidades.includes('online') ? '<a href="/agenda-online"><button class="btn">Agendar online</button></a>' : ''}
                        ${medico.modalidades.includes('domiciliar') ? '<a href="/agenda-domiciliar"><button class="btn-domiciliar">Agendar domiciliar</button></a>' : ''}
                    </section>
                </section>
            </section>
        `;
        container.insertAdjacentHTML('beforeend', card);
        const ultimoCard = container.lastElementChild;
        const botoes = ultimoCard.querySelectorAll('.btn-mod a');
        botoes.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        })
    });
}
// O restante do seu código JavaScript (aplicarFiltros, event listeners) continua abaixo...