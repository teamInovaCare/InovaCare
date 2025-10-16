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
// Seleção de horários dinâmicos com FETCH
// -----------------------------
const horariosSection = document.querySelector('.form-section.horarios');
const horariosContainer = horariosSection.querySelector('.horarios-disponiveis');
horariosSection.style.display = 'none';

// Ativa labels de datas
ativarLabels('.datas-disponiveis');

// Pega parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);
const idEspecialista = urlParams.get('id_especialista');
const tipoAtendimento = urlParams.get('tipo_atendimento');

// Inputs de datas
const dataInputs = document.querySelectorAll('.datas-disponiveis input[type="radio"]');

dataInputs.forEach(input => {
  input.addEventListener('change', async () => {
    const dataSelecionada = input.value;
    
    console.log('=== DEBUG FRONTEND ===');
    console.log('Data selecionada:', dataSelecionada);
    console.log('ID Especialista:', idEspecialista);
    console.log('Tipo Atendimento:', tipoAtendimento);

    // Mostrar a seção de horários
    horariosSection.style.display = 'block';
    horariosContainer.innerHTML = '<p>Carregando horários...</p>';

    try {
      // Converte data DD/MM/YYYY para YYYY-MM-DD para o backend
      let dataFormatada = dataSelecionada;
      if (dataSelecionada.includes('/')) {
        const [dia, mes, ano] = dataSelecionada.split('/');
        dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
      
      console.log('Data formatada para backend:', dataFormatada);
      
      // Chama o backend
      const url = `/gerar-horarios?data=${encodeURIComponent(dataFormatada)}&id_especialista=${encodeURIComponent(idEspecialista)}&tipo_atendimento=${encodeURIComponent(tipoAtendimento)}`;
      console.log('URL da requisição:', url);
      
      const response = await fetch(url);
      const dados = await response.json();
      
      console.log('Resposta do backend:', dados);

      // Limpa container
      horariosContainer.innerHTML = '';

      // Caso não haja horários
      if (!dados.horarios_disponiveis || dados.horarios_disponiveis.length === 0) {
        horariosContainer.innerHTML = '<p>Nenhum horário disponível para esta data.</p>';
        console.log('Nenhum horário disponível');
        return;
      }

      // Atualiza o preço com base na resposta da API
      if (dados.preco_total) {
        precoConsulta = dados.preco_total;
        console.log('Preço atualizado da API:', precoConsulta);
      }

      // Cria os botões de horário dinamicamente
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

      console.log('Horários criados com sucesso');
      console.log('=== FIM DEBUG FRONTEND ===');

      // Ativa labels de horários recém-criados
      ativarLabels('.horarios-disponiveis');

    } catch (erro) {
      console.error('Erro ao buscar horários:', erro);
      horariosContainer.innerHTML = '<p>Erro ao carregar horários. Tente novamente.</p>';
    }
  });
});

// -----------------------------
// Modal e formulário
// -----------------------------
const btnAvancar = document.querySelector(".btn-avancar");
const modal = document.getElementById("modal");
const btnVoltarModal = document.getElementById("modal-voltar");

// Inputs ocultos no formulário do modal
const inputMedico = document.getElementById("input-medico");
const inputData = document.getElementById("input-data");
const inputHorario = document.getElementById("input-horario");
const inputPreco = document.getElementById("input-preco");

// Pega os parâmetros da URL
const medicoSelecionado = urlParams.get('medico') || 'Profissional';
let precoConsulta = urlParams.get('preco') || '100.00'; // preço vindo da URL ou padrão

// Converte preço para formato numérico se vier com vírgula
if (typeof precoConsulta === 'string') {
  precoConsulta = precoConsulta.replace(',', '.');
}
precoConsulta = parseFloat(precoConsulta) || 100.00;

// Formata data para o padrão brasileiro
function formatarData(data) {
  const partes = data.split('-');
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// -----------------------------
// Abrir modal ao clicar em confirmar
// -----------------------------
btnAvancar.addEventListener("click", () => {
  const dataSelecionada = document.querySelector('input[name="data"]:checked')?.value;
  const horarioSelecionado = document.querySelector('input[name="horario"]:checked')?.value;

  if (!dataSelecionada || !horarioSelecionado) {
    alert("Por favor, selecione a data e o horário antes de confirmar.");
    return;
  }

  // Preenche o modal visual
  document.getElementById("modal-medico").textContent = medicoSelecionado;
  document.getElementById("modal-data").textContent = formatarData(dataSelecionada);
  document.getElementById("modal-horario").textContent = horarioSelecionado;
  document.getElementById("modal-preco").textContent = `R$ ${parseFloat(precoConsulta).toFixed(2).replace('.', ',')}`;

  // Preenche os inputs ocultos do form
  inputMedico.value = medicoSelecionado;
  inputData.value = dataSelecionada; // YYYY-MM-DD
  inputHorario.value = horarioSelecionado;
  inputPreco.value = parseFloat(precoConsulta).toFixed(2);

  // Exibe o modal
  modal.style.display = "flex";
});

// -----------------------------
// Botão voltar → fecha modal
// -----------------------------
btnVoltarModal.addEventListener("click", () => {
  modal.style.display = "none";
});
