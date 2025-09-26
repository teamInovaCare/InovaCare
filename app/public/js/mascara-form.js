/*máscara de formulário para os campos de cadastro_inicial*/ 

function mascara(input, padrao){
        input.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '')
            let formatado = ''
            let i = 0
 
            for(let caractere of padrao){
                if(i >= valor.length) break
                if(caractere == '0') {
                    formatado += valor[i]
                    i++
                }else {
                    formatado += caractere
                }
            }
            e.target.value = formatado
        })
       }
 
       //Aplicando Máscaras
       mascara(document.getElementById('cpf'), '000.000.000-00')
       mascara(document.getElementById('dt_nasc'), '00/00/0000')
       