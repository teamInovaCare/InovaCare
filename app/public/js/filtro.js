const medicos = [
            {
                id: 1,
                nome: 'Cleber Jr.',
                crm: 'CRM - SP 284692',
                preco: 'R$ 180,00',
                nota: '4,9',
                modalidades: ['online', 'domiciliar'],
                localizacao: 'São Paulo'
            },
            {
                id: 2,
                nome: 'Marina Silva',
                crm: 'CRM - RJ 103456',
                preco: 'R$ 120,00',
                nota: '4,8',
                modalidades: ['online'],
                localizacao: 'Rio de Janeiro'
            },
            {
                id: 3,
                nome: 'Jorge Santos',
                crm: 'CRM - RJ 120383',
                preco: 'R$ 180,00',
                nota: '4,9',
                modalidades: ['domiciliar'],
                localizacao: 'Rio de Janeiro'
            },
            {
                id: 4,
                nome: 'Bruno Pacheco',
                crm: 'CRM - SP 612029',
                preco: 'R$ 210,00',
                nota: '5',
                modalidades: ['online', 'domiciliar'],
                localizacao: 'São Paulo'
            },
            {
                id: 5,
                nome: 'Jéssica Matos',
                crm: 'CRM - SP 389237',
                preco: 'R$ 80,00',
                nota: '4,7',
                modalidades: ['online'],
                localizacao: 'São Paulo'
            }
        ];

        function renderizarMedicos(medicosParaExibir) {
            const container = document.querySelector('.perfis');
            container.innerHTML = '';

            if (medicosParaExibir.length === 0) {
                container.innerHTML = `
                    <div class="sem-resultados">
                        <i class="bi bi-search"></i>
                        <p>Nenhum médico encontrado com os filtros aplicados.</p>
                    </div>
                `;
                return;
            }

            const imagens = ['perfil.png', 'perfil.png', 'perfil.png', 'perfil.png', 'perfil.png'];
            medicosParaExibir.forEach((medico, index) => {
                const imagemPerfil = imagens[index % imagens.length];
                const card = `
                    <section class="retangulo">
                        <section class="small-rectangle">
                            <img src="imagens/${imagemPerfil}" alt="Perfil" class="perfil1">
                            <section class="infos">
                                <section class="btn-mod">
                                    ${medico.modalidades.includes('online') ? '<a href="/agenda-online"><button class="btn">Agendar online</button></a>' : ''}
                                    ${medico.modalidades.includes('domiciliar') ? '<a href="/agenda-domiciliar"><button class="btn-domiciliar">Agendar domiciliar</button></a>' : ''}
                                </section>
                                <p class="nome">${medico.nome}</p>
                                <p class="idnt">${medico.crm}</p>
                                <p>${medico.preco}</p>
                                
                                <p class="nota">${medico.nota} <img src="imagens/star-l.png" alt="Estrela" class="nota-img"></p>
                                
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

        function aplicarFiltros() {
            const filtroModalidade = document.getElementById('filtro-modalidade').value;
            const filtroNome = document.getElementById('filtro-nome').value.toLowerCase();
            const filtroLocalizacao = document.getElementById('filtro-localizacao').value;

            const filtrados = medicos.filter(medico => {
                const matchModalidade = filtroModalidade === '' || medico.modalidades.includes(filtroModalidade);
                const matchNome = filtroNome === '' || medico.nome.toLowerCase().includes(filtroNome);
                const matchLocalizacao = filtroLocalizacao === '' || medico.localizacao === filtroLocalizacao;
                return matchModalidade && matchNome && matchLocalizacao;
            });

            renderizarMedicos(filtrados);
        }
        
        // Inicializar a página
        document.addEventListener('DOMContentLoaded', function() {
            renderizarMedicos(medicos);

            // Adicionar event listeners para os filtros
            document.getElementById('filtro-modalidade').addEventListener('change', aplicarFiltros);
            document.getElementById('filtro-nome').addEventListener('input', aplicarFiltros);
            document.getElementById('filtro-localizacao').addEventListener('change', aplicarFiltros);
        });
        