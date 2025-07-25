document.addEventListener('DOMContentLoaded', function() {
    const selectProfissao = document.getElementById('idespecialidadeprof');
    
    selectProfissao.addEventListener('change', function() {
        // Esconde todos os campos primeiro
        document.querySelectorAll('.registro-container').forEach(container => {
            container.style.display = 'none';
        });
        
        // Mostra o campo correspondente à seleção
        switch(this.value) {
            case 'Clinicogeral':
                document.getElementById('crm-container').style.display = 'block';
                break;
            case 'Psicólogo':
                document.getElementById('crp-container').style.display = 'block';
                break;
            case 'Fisioterapeuta':
                document.getElementById('crefito-container').style.display = 'block';
                break;
            case 'Fonoaudiólogo':
                document.getElementById('crfa-container').style.display = 'block';
                break;
            case 'Enfermeiro':
                document.getElementById('coren-container').style.display = 'block';
                break;
            case 'Nutricionista':
                document.getElementById('crn-container').style.display = 'block';
                
                break;
        }
    });
});