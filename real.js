function limparValorReais(valorComMascara) {
  return parseFloat(
    valorComMascara
      .replace('R$', '')       // remove o símbolo R$
      .replace(/\s/g, '')      // remove espaços
      .replace(/\./g, '')      // remove pontos dos milhares
      .replace(',', '.')       // troca vírgula por ponto decimal
  );
}


const entrada = 'R$ 1.234,56';
const valorDecimal = limparValorReais(entrada);
console.log(valorDecimal); // 1234.56


