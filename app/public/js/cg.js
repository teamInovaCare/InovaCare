// Função para reatribuir os eventos de clique nos pequenos retângulos
function reatribuirListenersNosPerfis() {
  document.querySelectorAll('.perfis .small-rectangle').forEach(el => {
    el.addEventListener('click', function () {
      document.getElementById('overlay').style.display = 'flex';
      document.getElementById('step1').style.display = 'block';
      document.getElementById('step2').style.display = 'none';
    });
  });
}

// Chamada inicial (caso os elementos já existam ao carregar a página)
reatribuirListenersNosPerfis();

document.getElementById('overlay').addEventListener('click', function (e) {
  if (e.target === this) {
    this.style.display = 'none';
  }
});

document.getElementById('voltarSeta').addEventListener('click', () => {
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
});

document.getElementById('confirmStep1').addEventListener('click', function () {
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
});

const sliderTable = document.getElementById('sliderTable');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentSlide = 0;

const columns = [
  ['21/08', '22/08', '23/08', '24/08'],
  ['25/08', '26/08', '27/08', '28/08']
];

const rows = [
  ['10:00', '10:00', '10:00', '10:00'],
  ['11:00', '11:00', '11:00', '11:00'],
  ['12:00', '12:00', '12:00', '12:00']
];

function updateTable() {
  const headers = sliderTable.querySelectorAll('thead th');
  const cells = sliderTable.querySelectorAll('tbody td');

  for (let i = 0; i < 4; i++) {
    headers[i].innerText = columns[currentSlide][i];
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      cells[i * 4 + j].innerText = rows[i][j];
      cells[i * 4 + j].classList.remove('selected'); // Limpa seleção ao trocar slide
    }
  }

  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === columns.length - 1;
}

prevBtn.addEventListener('click', function () {
  if (currentSlide > 0) {
    currentSlide--;
    updateTable();
  }
});

nextBtn.addEventListener('click', function () {
  if (currentSlide < columns.length - 1) {
    currentSlide++;
    updateTable();
  }
});

sliderTable.addEventListener('click', function (e) {
  if (e.target.tagName === 'TD') {
    e.target.classList.toggle('selected');
  }
});

document.getElementById('submitButton').addEventListener('click', function () {
  const selectedCells = document.querySelectorAll('#sliderTable td.selected');
  const selectedData = Array.from(selectedCells).map(cell => cell.innerText);
  alert('Horário agendado: ' + selectedData.join(', '));
});

updateTable();
