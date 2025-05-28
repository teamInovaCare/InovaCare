// Abrir overlay e mostrar passo 1
document.getElementById('smallRectangle').addEventListener('click', function () {
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
  });

  // Fechar overlay clicando fora
  document.getElementById('overlay').addEventListener('click', function (e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });


  const setaVoltar = document.getElementById("voltarSeta");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");

    setaVoltar.addEventListener("click", () => {
        step2.style.display = "none";
        step1.style.display = "flex"; // ou "block", dependendo do seu layout
    });



  // Avançar para o passo 2
  document.getElementById('confirmStep1').addEventListener('click', function () {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
  });

  // Slider de tabela
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

    for (let i = 0; i < 4; i++) {
      headers[i].innerText = columns[currentSlide][i];
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        cells[i * 4 + j].innerText = rows[i][j];
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

  // Seleção de células
  sliderTable.addEventListener('click', function (e) {
    if (e.target.tagName === 'TD') {
      e.target.classList.toggle('selected');
    }
  });

  // Botão de confirmação
  document.getElementById('submitButton').addEventListener('click', function () {
    const selectedCells = document.querySelectorAll('#sliderTable td.selected');
    const selectedData = Array.from(selectedCells).map(cell => cell.innerText);
    alert('Horário agendado: ' + selectedData.join(', '));
  });

  updateTable();