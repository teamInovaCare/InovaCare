

// Função para habilitar edição do perfil
document.getElementById('btn-editar-perfil').addEventListener('click', function() {
    const inputs = document.querySelectorAll('.form-input');
    const formActions = document.getElementById('form-actions');
    
    inputs.forEach(input => {
        input.readOnly = false;
        input.style.backgroundColor = 'white';
    });
    
    formActions.hidden = false;
});

// Função para cancelar edição
document.getElementById('btn-cancelar').addEventListener('click', function() {
    const inputs = document.querySelectorAll('.form-input');
    const formActions = document.getElementById('form-actions');
    
    inputs.forEach(input => {
        input.readOnly = true;
        input.style.backgroundColor = '#f8f9fa';
    });
    
    formActions.hidden = true;
});

// Upload de foto
document.getElementById('upload-photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-image').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Funções para simular a ação dos botões.

function editarPerfil() {
    alert("Ação: Editar Perfil. (Aqui você implementaria a lógica para abrir um formulário de edição ou ativar a edição in-line)");
}

function excluirConta() {
    // Uso de window.confirm para garantir que o usuário deseja executar a ação
    const confirmacao = confirm("ATENÇÃO: Você tem certeza que deseja EXCLUIR sua conta? Esta ação é IRREVERSÍVEL.");
    if (confirmacao) {
        // Implementar lógica de exclusão no backend
        alert("Ação: Conta excluída com sucesso.");
    } else {
        alert("Exclusão cancelada.");
    }
}

function adicionarColaborador() {
    alert("Ação: Adicionar Novo Colaborador. (Aqui você implementaria a lógica para abrir um formulário de cadastro de novo usuário)");
}