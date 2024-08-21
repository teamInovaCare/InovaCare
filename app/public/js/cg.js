document.getElementById('smallRectangle').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'flex';
});

document.getElementById('overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
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
    const headers = sliderTable.querySelectorAll('th');
    const cells = sliderTable.querySelectorAll('td');

    // Atualiza os cabeçalhos da tabela
    for (let i = 0; i < 4; i++) {
        headers[i].innerText = columns[currentSlide][i];
    }

    // Atualiza as células da tabela
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            cells[i * 4 + j].innerText = rows[i][j];
        }
    }

    // Desabilita os botões se for o primeiro ou último slide
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === columns.length - 1;
}

// Navegação para o slide anterior
prevBtn.addEventListener('click', function() {
    if (currentSlide > 0) {
        currentSlide--;
        updateTable();
    }
});

// Navegação para o próximo slide
nextBtn.addEventListener('click', function() {
    if (currentSlide < columns.length - 1) {
        currentSlide++;
        updateTable();
    }
});

// Seleção de células
document.querySelectorAll('#sliderTable td').forEach(cell => {
    cell.addEventListener('click', function() {
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
        } else {
            this.classList.add('selected');
        }
    });
});

// Ação do botão de confirmação
document.getElementById('submitButton').addEventListener('click', function() {
    const selectedCells = document.querySelectorAll('#sliderTable td.selected');
    const selectedData = Array.from(selectedCells).map(cell => cell.innerText);
    alert('Horário agendado: ' + selectedData.join(', '));
});

// Atualiza a tabela na inicialização
updateTable();
