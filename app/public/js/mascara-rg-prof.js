function mascaraUFNumeroComValidacao(input) {
    // Lista de UFs válidas do Brasil
    const ufsValidas = [
        'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
        'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
        'RS','RO','RR','SC','SP','SE','TO'
    ];
    
    input.addEventListener('input', (e) => {
        let valor = e.target.value.toUpperCase();
        
        // Mantém apenas letras, números e espaços
        valor = valor.replace(/[^A-Z0-9\s]/g, '');
        
        // Aplica máscara básica
        if (valor.length <= 2) {
            // Apenas UF (primeiras 2 letras)
            valor = valor.substring(0, 2);
        } else {
            // UF + espaço + números
            valor = valor.replace(/^([A-Z]{2})(\d{0,10})/, '$1 $2');
            
            // Se já tem espaço, formata melhor
            if (valor.includes(' ')) {
                const partes = valor.split(' ');
                const uf = partes[0].substring(0, 2);
                const numero = partes[1] ? partes[1].replace(/\D/g, '').substring(0, 10) : '';
                
                valor = uf + (numero ? ' ' + numero : '');
            }
        }
        
        // Opcional: Destacar se UF é válida (feedback visual)
        if (valor.length >= 2) {
            const ufDigitada = valor.substring(0, 2);
            if (ufsValidas.includes(ufDigitada)) {
                input.style.borderColor = 'green'; // UF válida
            } else {
                input.style.borderColor = 'red'; // UF inválida
            }
        } else {
            input.style.borderColor = ''; // Reset
        }
        
        e.target.value = valor;
    });
}