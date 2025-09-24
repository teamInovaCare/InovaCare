// Confirmação de email + Senha Forte + Confirmação de senha + Não pdoe copiar e colar os campos + Ocultar e mostrar a senha

// Seleção dos campos para confirma senha e email
const ConfirmaSenha = document.querySelector("#confirmasenha");
const ConfirmaEmail = document.querySelector("#confirmaemail");
const SenhaForte = document.querySelector("#senha");

//Não pode copiar e colar Senha
ConfirmaSenha.addEventListener("paste", function(e) {
    e.preventDefault();
});


//Não pode copiar e colar e-mail
ConfirmaEmail.addEventListener("paste", function(e) {
    e.preventDefault();
});


/**Função para verificar se os emails são iguais */
function verificaConfirmaEmail() {
    let campoEmail = document.getElementById("email");
    let valorEmail = campoEmail.value;

    let campoConfirmaEmail = document.getElementById("confirmaemail"); // Correção: "confirmasenha" entre aspas
    let valorConfirmaEmail = campoConfirmaEmail.value;

    if (valorEmail === valorConfirmaEmail) {
        document.getElementById("mensagem-email").innerHTML = "E-mail válido";
        document.getElementById("mensagem-email").style.color="#35ac35ff";
        return true;
    } else {
        document.getElementById("mensagem-email").innerHTML = "Os e-mails precisam ser iguais";
        document.getElementById("mensagem-email").style.color="#e93030ff";
        return false;
    }
}

// Adicionar evento para verificar quando o usuário digitar
ConfirmaSenha.addEventListener("input", verificaConfirmaEmail);
document.getElementById("confirmaemail").addEventListener("input", verificaConfirmaEmail);




/**Senha Forte */
function verificarSenhaForte(){
    let campoSenha= document.getElementById("senha")
    let val = campoSenha.value;
    

    const alphabet = /[a-zA-Z]/, // letras de a a z e de A a Z
      numbers = /[0-9]/,
      scharacters = /[!,@,#,$,%,^,&,*,?,_,(,),-,+,=,~]/;

if(val.match(alphabet) || val.match(numbers) || val.match(scharacters)){
       document.getElementById("mensagem-email").innerHTML = "";
       document.getElementById("mensagem-senha-forte").innerHTML = "Utilize letras, números e caracteres especiais";
       document.getElementById("mensagem-senha-forte").style.color="#e93030ff";

    }

    if(val.match(alphabet) && val.match(numbers) && val.length <=  8 ){
        document.getElementById("mensagem-email").innerHTML = "";
         document.getElementById("mensagem-senha-forte").innerHTML = "Utilize no mínimo 8 caracteres";
         document.getElementById("mensagem-senha-forte").style.color="#e93030ff";
        

    }

    if(val.match(alphabet) && val.match(numbers) && val.match(scharacters) && val.length >= 8 ){
        document.getElementById("mensagem-email").innerHTML = "";
        document.getElementById("mensagem-senha-forte").innerHTML = "Senha Forte!";
       document.getElementById("mensagem-senha-forte").style.color="#35ac35ff";
        
    }


};


// Adicionar evento para verificar quando o usuário digitar
document.getElementById("senha").addEventListener("input", verificarSenhaForte);





// Função para verificar se as senhas são iguais
function verificaConfirmaSenha() {
    let campoSenha = document.getElementById("senha");
    let valorSenha = campoSenha.value;

    let campoConfirmaSenha = document.getElementById("confirmasenha"); // Correção: "confirmasenha" entre aspas
    let valorConfirmaSenha = campoConfirmaSenha.value;

    if (valorSenha === valorConfirmaSenha) {
        document.getElementById("mensagem-email").innerHTML = "";
        document.getElementById("mensagem-senha-forte").innerHTML = "";
        document.getElementById("mensagem-confirma-senha").innerHTML = "Senha válida";
        document.getElementById("mensagem-confirma-senha").style.color="#35ac35ff";
        return true;
    } else {
        document.getElementById("mensagem-email").innerHTML = "";
        document.getElementById("mensagem-senha-forte").innerHTML = "";
        document.getElementById("mensagem-confirma-senha").innerHTML = "As senhas precisam ser iguais";
        document.getElementById("mensagem-confirma-senha").style.color="#e93030ff";
        return false;
    }
}

// Adicionar evento para verificar quando o usuário digitar
ConfirmaSenha.addEventListener("input", verificaConfirmaSenha);
document.getElementById("confirmasenha").addEventListener("input", verificaConfirmaSenha);


// function verificarAtividade(){
//     if(ConfirmaEmail.addEventListener("input", verificarConfirmaEmail)){
//         document.getElementById("confirmaemail").addEventListener("input", verificaConfirmaEmail);
//     }

//     if(SenhaForte.addEventListener("input", verificarSenhaForte)){
//         document.getElementById("senha").addEventListener("input", verificarSenhaForte); 
//     }

//     if(ConfirmaSenha.addEventListener("input", verificaConfirmaSenha)){
//         document.getElementById("confirmasenha").addEventListener("input", verificarSenhaForte); 
//     }
// }


/**Ocultar e mostrar as senhas */

function mostrarSenha(inputId, iconElement){
    const input = document.getElementById(inputId);
    const icon = iconElement.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}




// Adicionar verificação no envio do formulário
document.querySelector("form").addEventListener("submit", function(e) {
    if (!verificaConfirmaSenha(), !verificarSenhaForte(), !verificaConfirmaSenha()) {
        e.preventDefault(); // Impede o envio do formulário se as senhas não coincidirem
    }
});



