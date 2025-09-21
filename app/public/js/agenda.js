(function () {
    const estadoInicial = document.querySelector('.estado-inicial');
    const estadoAgendamento = document.querySelector('.estado-agendamento');

    const btnAgendar = document.getElementById('btnAgendar');
    const btnVoltarTipo = document.getElementById('btnVoltarTipo');
    const btnConfirmarTipo = document.getElementById('btnConfirmarTipo');

    const modalidadeInputs = document.querySelectorAll('.modalidade-input');
    const modalidadeLabels = document.querySelectorAll('.modalidade-label');

    // Nome do médico
    const nomeMedicoEl = document.querySelector('.info-perfil h3');
    const nomeMedico = nomeMedicoEl ? nomeMedicoEl.textContent.trim() : 'Profissional';

    // Preços
    const precoOnlineEl = document.querySelector('.left-bot p:nth-child(1)');
    const precoDomiciliarEl = document.querySelector('.left-bot p:nth-child(2)');

    const precoOnline = precoOnlineEl ? precoOnlineEl.textContent.replace("Atendimento online:", "").trim() : "0,00";
    const precoDomiciliar = precoDomiciliarEl ? precoDomiciliarEl.textContent.replace("Atendimento domiciliar:", "").trim() : "0,00";

    // mostrar estados
    function showInitial() {
        estadoInicial.style.display = 'flex';
        estadoAgendamento.style.display = 'none';
        estadoAgendamento.setAttribute('aria-hidden', 'true');
        estadoInicial.setAttribute('aria-hidden', 'false');
    }
    function showAgendamento() {
        estadoInicial.style.display = 'none';
        estadoAgendamento.style.display = 'flex';
        estadoAgendamento.setAttribute('aria-hidden', 'false');
        estadoInicial.setAttribute('aria-hidden', 'true');
        estadoAgendamento.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // inicial
    showInitial();

    // abrir formulário
    btnAgendar && btnAgendar.addEventListener('click', () => showAgendamento());

    // voltar
    btnVoltarTipo && btnVoltarTipo.addEventListener('click', () => showInitial());

    // seleção visual
    modalidadeInputs.forEach(inp => {
        inp.addEventListener('change', () => {
            modalidadeLabels.forEach(l => l.classList.remove('selecionado'));
            const lab = document.querySelector('label[for="' + inp.id + '"]');
            if (lab) lab.classList.add('selecionado');
        });
    });

    // confirmar
    btnConfirmarTipo && btnConfirmarTipo.addEventListener('click', () => {
        const checked = document.querySelector('input[name="modalidade"]:checked');
        if (!checked) {
            alert('Por favor, selecione a modalidade (Online ou Domiciliar) antes de confirmar.');
            return;
        }

        const tipo = checked.value; // "online" | "domiciliar"
        let precoSelecionado = tipo === "online" ? precoOnline : precoDomiciliar;

        // monta a URL com nome do médico e preço
        if (tipo === "online") {
            window.location.href = "/agenda-online?medico=" + encodeURIComponent(nomeMedico) + "&preco=" + encodeURIComponent(precoSelecionado);
        } else if (tipo === "domiciliar") {
            window.location.href = "/agenda-domiciliar?medico=" + encodeURIComponent(nomeMedico) + "&preco=" + encodeURIComponent(precoSelecionado);
        }
    });

})();
