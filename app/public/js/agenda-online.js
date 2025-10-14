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
// Horários disponíveis por data
// -----------------------------
const horariosPorData = {
  "2025-09-21": ["08:00", "09:00", "10:00"],
  "2025-09-22": ["09:00", "11:00", "14:00", "16:00"],
  "2025-09-23": ["08:00", "12:00", "15:00"],
  "2025-09-24": ["10:00", "11:00", "13:00", "17:00"],
  "2025-09-25": ["08:00", "09:00", "10:00", "12:00", "14:00"],
  "2025-09-26": ["09:00", "10:00", "13:00"],
  "2025-09-27": ["08:00", "09:00", "11:00", "16:00"],
  "2025-09-28": ["08:00", "12:00", "15:00"],
  "2025-09-29": ["10:00", "11:00", "14:00"],
  "2025-09-30": ["09:00", "10:00", "13:00", "15:00", "17:00"]
};

// -----------------------------
// Seleção de horários
// -----------------------------
const horariosSection = document.querySelector('.form-section.horarios');
const horariosContainer = horariosSection.querySelector('.horarios-disponiveis');

// Inicialmente esconde horários
horariosSection.style.display = 'none';

// Ativa labels de datas
ativarLabels('.datas-disponiveis');

// Inputs de datas
const dataInputs = document.querySelectorAll('.datas-disponiveis input[type="radio"]');
dataInputs.forEach(input => {
  input.addEventListener('change', () => {
      const dataSelecionada = input.value;

      // Mostrar a seção de horários
      horariosSection.style.display = 'block';

      // Limpar horários antigos
      horariosContainer.innerHTML = '';

      // Criar novos horários para a data selecionada
      horariosPorData[dataSelecionada].forEach(horario => {
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

      // Ativar labels de horários recém-criados
      ativarLabels('.horarios-disponiveis');
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
const urlParams = new URLSearchParams(window.location.search);
const medicoSelecionado = urlParams.get('medico') || 'Profissional';
const precoConsulta = urlParams.get('preco') || '00,01'; // preço vindo da URL ou padrão

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
  document.getElementById("modal-preco").textContent = precoConsulta;

  // Preenche os inputs ocultos do form
  inputMedico.value = medicoSelecionado;
  inputData.value = dataSelecionada; // YYYY-MM-DD
  inputHorario.value = horarioSelecionado;
  inputPreco.value = precoConsulta;

  // Exibe o modal
  modal.style.display = "flex";
});

// -----------------------------
// Botão voltar → fecha modal
// -----------------------------
btnVoltarModal.addEventListener("click", () => {
  modal.style.display = "none";
});
