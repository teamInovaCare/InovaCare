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

/// Função 1: valida o formato e se a data existe
function isValidDate(dateString) {
    // Valida formato YYYY-MM-DD
    let pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(dateString)) {
        return false;
    }

    // Verifica se a data realmente existe
    const partes = dateString.split("-");
    const ano = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // meses em JS começam do 0
    const dia = parseInt(partes[2], 10);

    const data = new Date(ano, mes, dia);
    if (data.getFullYear() !== ano || data.getMonth() !== mes || data.getDate() !== dia) {
        return false; // data inválida
    }

    return true; // data válida
}

// Função 2: verifica se a pessoa é maior de idade (assumindo que a data é válida)
function isMaiorDeIdade(dateString) {
    

    const partes = dateString.split("-");
    const ano = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const dia = parseInt(partes[2], 10);

    const hoje = new Date();
    let idade = hoje.getFullYear() - ano;

    if (hoje.getMonth() < mes || (hoje.getMonth() === mes && hoje.getDate() < dia)) {
        idade--;
    }

    return idade >= 18;
}

// Testes
console.log(isValidDate("2020-01-01"));  // true
console.log(isValidDate("2020-02-30"));  // false (data inválida)
console.log(isValidDate("01-01-2020"));  // false (formato errado)

console.log(isMaiorDeIdade("2020-01-01"));  // false (menor de idade)
console.log(isMaiorDeIdade("2000-01-01"));  // true (maior de idade)
console.log(isMaiorDeIdade("2020-02-30"));  // false (data inválida)


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


function validarConselho(numero) {
  const regexNumero = /^\d{4,6}$/;
  return regexNumero.test(numero);
}

function validarUf(uf) {

  const ufsValidas = [

    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",

    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",

    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"

  ];

  return ufsValidas.includes(uf.toUpperCase());

}


// Converte 'DD/MM/YYYY' para 'YYYY-MM-DD'
function converterParaMysql(dateString) {
    const partes = dateString.split('/');
    if (partes.length !== 3) return null;
    // PadStart garante formato correto
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
}

// Valida formato 'YYYY-MM-DD' e se a data existe
function isValidDate(dateString) {
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(dateString)) return false;

    const [ano, mes, dia] = dateString.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return (data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia);
}

// Verifica se a pessoa tem pelo menos 18 anos
function isMaiorDeIdade(dateString) {
    if (!isValidDate(dateString)) return false; // Garante que a data é válida
    const [ano, mes, dia] = dateString.split('-').map(Number);
    const hoje = new Date();
    let idade = hoje.getFullYear() - ano;
    if (hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)) {
        idade--;
    }
    return idade >= 18;
}

 




module.exports = {validarCPF, isValidDate, isMaiorDeIdade, validarCEP, validarConselho, validarUf, converterParaMysql,
    isValidDate,
    isMaiorDeIdade}