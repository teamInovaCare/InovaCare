// -----------------------------
// Função para ativar efeito de 'ativo' nos labels
// -----------------------------
function ativarLabels(containerSelector) {
    const labels = document.querySelectorAll(containerSelector + ' label');
    labels.forEach(label => {
        const input = label.querySelector('input[type="radio"]');
        input.addEventListener('change', () => {
            const groupName = input.name;
            document.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
                radio.parentElement.classList.remove('ativo');
            });
            if (input.checked) {
                label.classList.add('ativo');
            }
        });
    });
}

// -----------------------------
// Seção de horários
// -----------------------------
const horariosSection = document.querySelector('.form-section.horarios');
const horariosContainer = horariosSection.querySelector('.horarios-disponiveis');
horariosSection.style.display = 'none'; // esconde inicialmente

ativarLabels('.datas-disponiveis'); // ativa efeito de seleção das datas

// Pega parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);
const idEspecialista = urlParams.get('id_especialista');
const tipoAtendimento = urlParams.get('tipo_atendimento');

const dataInputs = document.querySelectorAll('.datas-disponiveis input[type="radio"]');

dataInputs.forEach(input => {
    input.addEventListener('change', async () => {
        const dataSelecionada = input.value;
        horariosSection.style.display = 'block';
        horariosContainer.innerHTML = '<p>Carregando horários...</p>';

        try {
            // Fetch para o backend
            const response = await fetch(`/gerar-horarios?data=${dataSelecionada}&id_especialista=${idEspecialista}&tipo_atendimento=${tipoAtendimento}`);
            const dados = await response.json();

            horariosContainer.innerHTML = '';

            if (!dados.horarios_disponiveis || dados.horarios_disponiveis.length === 0) {
                horariosContainer.innerHTML = '<p>Nenhum horário disponível.</p>';
                return;
            }

            // Cria inputs radio para os horários recebidos
            dados.horarios_disponiveis.forEach(horario => {
                const label = document.createElement('label');
                const inputRadio = document.createElement('input');
                inputRadio.type = 'radio';
                inputRadio.name = 'horario';
                inputRadio.value = horario;

                const span = document.createElement('span');
                span.textContent = horario;

                label.appendChild(inputRadio);
                label.appendChild(span);
                horariosContainer.appendChild(label);
            });

            ativarLabels('.horarios-disponiveis');

        } catch (erro) {
            console.error('Erro ao buscar horários:', erro);
            horariosContainer.innerHTML = '<p>Erro ao carregar horários. Tente novamente.</p>';
        }
    });
});

// -----------------------------
// Modal e formulário (permanece igual)
// -----------------------------
const btnAvancar = document.querySelector(".btn-avancar");
const modal = document.getElementById("modal");
const btnVoltarModal = document.getElementById("modal-voltar");

// Inputs ocultos
const inputMedico = document.getElementById("input-medico");
const inputData = document.getElementById("input-data");
const inputHorario = document.getElementById("input-horario");
const inputPreco = document.getElementById("input-preco");
const inputCep = document.getElementById("input-cep");
const inputUf = document.getElementById("input-uf");
const inputEndereco = document.getElementById("input-endereco");
const inputBairro = document.getElementById("input-bairro");
const inputCidade = document.getElementById("input-cidade");
const inputNumero = document.getElementById("input-numero");
const inputComplemento = document.getElementById("input-complemento");

// Inputs visíveis do endereço
const inputCepVisivel = document.getElementById("cep");
const inputUfVisivel = document.getElementById("uf");
const inputEnderecoVisivel = document.getElementById("endereco");
const inputBairroVisivel = document.getElementById("bairro");
const inputCidadeVisivel = document.getElementById("cidade");
const inputNumeroVisivel = document.getElementById("numero");
const inputComplementoVisivel = document.getElementById("complemento");

// Nome e preço do médico
const medicoSelecionado = urlParams.get('medico') || 'Profissional';
const precoConsulta = "100,00"; // valor domiciliar

// Formata data para padrão brasileiro
function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Campos de endereço bloqueados inicialmente
const inputsEndereco = [
    inputCepVisivel, inputUfVisivel, inputEnderecoVisivel, inputBairroVisivel,
    inputCidadeVisivel, inputNumeroVisivel, inputComplementoVisivel
];
inputsEndereco.forEach(inp => inp.disabled = true);

// Botão Alterar endereço
const btnAlterarEndereco = document.querySelector(".btn-alterar-endereco");
if (btnAlterarEndereco) {
    btnAlterarEndereco.addEventListener("click", () => {
        inputsEndereco.forEach(inp => inp.disabled = false);
        if (inputsEndereco[0]) inputsEndereco[0].focus();
    });
}

// Abrir modal ao clicar em confirmar
btnAvancar.addEventListener("click", () => {
    const dataSelecionada = document.querySelector('input[name="data"]:checked')?.value;
    const horarioSelecionado = document.querySelector('input[name="horario"]:checked')?.value;

    if (!dataSelecionada || !horarioSelecionado) {
        alert("Por favor, selecione a data e o horário antes de confirmar.");
        return;
    }

    // Validação de endereço usando campos visíveis
    const cep = inputCepVisivel.value.trim();
    const uf = inputUfVisivel.value.trim();
    const endereco = inputEnderecoVisivel.value.trim();
    const bairro = inputBairroVisivel.value.trim();
    const cidade = inputCidadeVisivel.value.trim();
    const numero = inputNumeroVisivel.value.trim();
    const complemento = inputComplementoVisivel.value.trim();

    if (!cep || !uf || !endereco || !bairro || !cidade || !numero) {
        alert("Por favor, preencha todos os campos obrigatórios do endereço.");
        return;
    }

    // Preenche os inputs ocultos apenas depois da validação
    inputMedico.value = medicoSelecionado;
    inputData.value = dataSelecionada;
    inputHorario.value = horarioSelecionado;
    inputPreco.value = precoConsulta;
    inputCep.value = cep;
    inputUf.value = uf;
    inputEndereco.value = endereco;
    inputBairro.value = bairro;
    inputCidade.value = cidade;
    inputNumero.value = numero;
    inputComplemento.value = complemento;

    // Preenche o modal
    document.getElementById("modal-medico").textContent = medicoSelecionado;
    document.getElementById("modal-data").textContent = formatarData(dataSelecionada);
    document.getElementById("modal-horario").textContent = horarioSelecionado;
    document.getElementById("modal-preco").textContent = precoConsulta;
    document.getElementById("modal-cep").textContent = cep;
    document.getElementById("modal-uf").textContent = uf;
    document.getElementById("modal-endereco").textContent = endereco;
    document.getElementById("modal-bairro").textContent = bairro;
    document.getElementById("modal-cidade").textContent = cidade;
    document.getElementById("modal-numero").textContent = numero;
    document.getElementById("modal-complemento").textContent = complemento;

    // Mostra modal
    modal.style.display = "flex";

    // Bloqueia inputs novamente
    inputsEndereco.forEach(inp => inp.disabled = true);
});

// Botão Voltar → fecha modal
btnVoltarModal.addEventListener("click", () => {
    modal.style.display = "none";
});
