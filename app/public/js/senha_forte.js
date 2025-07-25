//Seleção dos campos para a senha forte
const senhaInput =document.querySelector(".label-input.senha input"),
    indicador = document.querySelector(".indicador"),
    iconText= document.querySelector(".icon-text"),
    text = document.querySelector(".text");


//seleção do campo para a confirmação de senha
    const ConfirmaSenha = document.querySelector("#repsenhad")


//método default para não permirir copiar e colar a senha
    ConfirmaSenha.addEventListener("paste", function(e){
    e.preventDefault();
})





/*Posso configurar o ocultar a senha*/
/*Precisaria adicionar o ícone*/ 


/**Validação da senha forte */

const alphabet = /[a-zA-Z]/, // letras de a a z e de A a Z
      numbers = /[0-9]/,
      scharacters = /[!,@,#,$,%,^,&,*,?,_,(,),-,+,=,~]/;

senhaInput.addEventListener("keyup", ()=>{
    indicador.classList.add("active");

    let val = senhaInput.value;

    if(val.match(alphabet) || val.match(numbers) || val.match(scharacters)){
        text.textContent= "Utilize letras, números e caracteres especiais (!,@,#,$,%)";
        senhaInput.style.borderColor= "#ff4133ff";
        iconText.style.color = "#ff4133ff";
        iconText.style.size= "50px";
    }

    if(val.match(alphabet) && val.match(numbers) && val.length <=  6 ){
        text.textContent= "Utilize, pelo menos, 6 caracteres";
        senhaInput.style.borderColor= "#ff4133ff";
        iconText.style.color = "#ff4133ff"; 


    }

    if(val.match(alphabet) && val.match(numbers) && val.match(scharacters) && val.length >= 6 ){
        text.textContent= "Senha forte";
        senhaInput.style.borderColor= "#11B81D";
        iconText.style.color = "#11B81D"; 


    }

    if(val == ""){
        indicador.classList.remove("active");
        senhaInput.style.borderColor= "#ff4133ff";
        iconText.style.color = "#ff4133ff";

    }

});


/*Validação do campo confirma senha*/

/*function verificaConfirmaSenha() {
    let campoSenha = senhaInput;
    let valorSenha = senhaInput.value;

    let campoConfirmaSenha = document.getElementById("repsenhad");
    let valorConfirmaSenha = campoConfirmaSenha.value;

    if (valorSenha === valorConfirmaSenha) {
        return true;
    } else {
        document.getElementById("mensagem").innerHTML = "Confirma Senha está errada";
        return false;
    }
}*/


/*form.addEventListener("submit", function (e) {
        if (senhaInput !== ConfirmaSenha) {
            e.preventDefault(); // Impede envio do formulário
            mensagem.innerHTML = "Erro ao confirmar a senha";
            mensagem.style.color = "red";
            confirmaSenha.focus();
        } else {
            mensagem.innerHTML = ""; // limpa mensagem se estiver correto
        }
    });*/



form.addEventListener("submit", function (e) {
    let valorSenha = senhaInput.value;
    let valorConfirmaSenha = ConfirmaSenha.value;

    if (valorSenha !== valorConfirmaSenha) {
        e.preventDefault(); // Impede envio do formulário

        // Atualiza texto e estilo com erro
        text.textContent = "Erro ao confirmar a senha";
        senhaInput.style.borderColor = "#ff4133ff";
        iconText.style.color = "#ff4133ff";
        indicador.classList.add("active");
        ConfirmaSenha.focus();
    } else {
        text.textContent = "Senha forte";
        senhaInput.style.borderColor = "#11B81D";
        iconText.style.color = "#11B81D";
        indicador.classList.add("active");
    }
});





