// validar cpf
function validarCPF(cpf){
    cpf = cpf.replace(/[^\d]+/g,''); //troca caracteres diferentes de numeros em vazio
    if(cpf.length != 11) { //tamanho diferente de 11
        return false;
    }

    if (cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999"){
    return false;} //o cpf não pode ser um errado já conhecido

    tempMultiplicacao = 10;
    pos = 0    
    var cpfCalc = [,]
    for(let i=9; i > 0; i--){
        cpfCalc[pos] = cpf.charAt(pos) * tempMultiplicacao
        tempMultiplicacao--;
        pos++  
    } //multiplica os valores de 10-2 de ordem decrescente
    var total9primeiros = 0;
    for (let i = 0; i < cpfCalc.length; i++ ){
        total9primeiros += cpfCalc[i];        
    } //soma o array e consegue o resultado desejado

    
    primeiroDigito = (total9primeiros * 10) % 11 //consegue o primeiro digito do numero de verificacao
    if (primeiroDigito == 11 || primeiroDigito == 10) {
        primeiroDigito = 0;    
    } //se o resultado for igual a 10 ou 11, o primeiro digito é 0
    
    if(primeiroDigito == cpf.charAt(9)) {
        
        tempMultiplicacao = 11;
        pos = 0    
        var cpfCalc2 = [,]
        for(let i=10; i > 0; i--){
            cpfCalc2[pos] = cpf.charAt(pos) * tempMultiplicacao
            tempMultiplicacao--;
            pos++  
        }
        var total10digitos = 0;
        for (let i = 0; i < cpfCalc2.length; i++ ){
            total10digitos += cpfCalc2[i];
        }

        segundoDigito = (total10digitos * 10) % 11
        
        if (segundoDigito == 11 || segundoDigito == 10) {
            segundoDigito = 0;    
        }

        if(segundoDigito == cpf.charAt(10)) {
            return true;
        }
        
        } else {return false}
}

//validar data
function isValidDate(dateString) {
    let pattern = /^\d{4}-\d{2}-\d{2}$/;
    return pattern.test(dateString);
}
  console.log(isValidDate("2020-01-01"));  // true
  console.log(isValidDate("01-01-2020"));  // false


//validar cep
function validarCEP(cep) {
    // Remove possíveis caracteres não numéricos
    cep = cep.replace(/\D/g, '');
    // Verifica se o CEP tem 8 dígitos
    if (cep.length !== 8) {
        return false;
    }
    // Verifica se o CEP é numérico
    if (!/^\d+$/.test(cep)) {
        return false;
    }

    return true;
}

module.exports = {validarCPF, isValidDate, validarCEP}