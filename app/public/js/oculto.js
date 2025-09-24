document.addEventListener('DOMContentLoaded', function () {
    const selectProfissao = document.getElementById('idespecialidadeprof');
    const containers = document.querySelectorAll('.registro-container');
    const inputs = document.querySelectorAll('.registro-container input');

    // Esconde todos os campos e desabilita todos inputs inicialmente
    containers.forEach(container => container.style.display = 'none');
    inputs.forEach(input => input.disabled = true);

    selectProfissao.addEventListener('change', function () {
        // Esconde todos os campos e desabilita todos inputs
        containers.forEach(container => container.style.display = 'none');
        inputs.forEach(input => input.disabled = true);

        // Mostra o campo correspondente à seleção e habilita o input correto
        switch (this.value) {
            case '1':
                document.getElementById('crm-container').style.display = 'block';
                document.getElementById('crm').disabled = false;
                break;
            case '2':
                document.getElementById('crefito-container').style.display = 'block';
                document.getElementById('crefito').disabled = false;
                break;
            case '3':
                document.getElementById('crfa-container').style.display = 'block';
                document.getElementById('crfa').disabled = false;
                break;
            case '4':
                document.getElementById('crn-container').style.display = 'block';
                document.getElementById('crn').disabled = false;
                break;
            case '5':
                document.getElementById('crp-container').style.display = 'block';
                document.getElementById('crp').disabled = false;
                break;
            case '6':
                document.getElementById('coren-container').style.display = 'block';
                document.getElementById('coren').disabled = false;
                break;
            case '7':
                document.getElementById('to-container').style.display = 'block';
                document.getElementById('to-crefito').disabled = false;
                break;
        }
    });
});