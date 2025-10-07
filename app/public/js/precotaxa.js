document.addEventListener('DOMContentLoaded', function () {
        const radioOnline = document.getElementById('online');
        const radioDomiciliar = document.getElementById('domiciliar');
        const campoTaxa = document.getElementById('taxa');
        const campoPreco = document.getElementById('preco');

        // Máscara para formato R$ 0,00
        function aplicarMascaraMoeda(input) {
            input.addEventListener('input', function (e) {
                let valor = e.target.value;

                // Remove tudo que não for dígito
                valor = valor.replace(/\D/g, '');

                // Converte para centavos (duas casas)
                valor = (valor / 100).toFixed(2);

                // Formata para padrão brasileiro com R$
                valor = valor
                    .toString()
                    .replace('.', ',')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                e.target.value = 'R$ ' + valor;
            });
        }

        aplicarMascaraMoeda(campoPreco);
        aplicarMascaraMoeda(campoTaxa);

        // Controle de habilitar/desabilitar o campo "taxa"
        function atualizarCampoTaxa() {
            if (radioOnline.checked) {
                campoTaxa.disabled = true;
                campoTaxa.value = '';
            } else if (radioDomiciliar.checked) {
                campoTaxa.disabled = false;
            }
        }

        atualizarCampoTaxa();

        radioOnline.addEventListener('change', atualizarCampoTaxa);
        radioDomiciliar.addEventListener('change', atualizarCampoTaxa);
    });