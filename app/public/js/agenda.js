
// --- ELEMENTOS PRINCIPAIS (todos os estados) ---
const estadoInicial = document.querySelector(".estado-inicial");
const estadoAgendamento = document.querySelector(".estado-agendamento");
const estadoCalendario = document.querySelector(".estado-calendario");
const estadoHorarios = document.querySelector(".estado-horarios");
const estadoConfirmOnline = document.querySelector(".estado-confirmacao-online");
const estadoConfirmDomiciliar = document.querySelector(".estado-confirmacao-domiciliar");
const estadoConfirmDomiciliarFinal = document.querySelector(".estado-confirmacao-domiciliar-final"); // tela final

const btnAgendar = document.querySelector(".btn-agendar");
const opcoes = document.querySelectorAll(".opcao");
const btnConfirmarTipo = document.querySelector(".btn-confirmar");
const btnVoltarTipo = document.querySelector(".btn-voltar-estado");
const btnProximoCalendario = document.querySelector(".btn-proximo");
const btnVoltarCalendario = document.querySelector(".btn-voltar-estado2");
const btnProximoHorario = document.querySelector(".btn-proximo-horario");
const btnVoltarHorarios = document.querySelector(".btn-voltar-estado3");

const confirmOnlineText = document.querySelector(".texto-confirmacao");
const confirmOnlineLink = document.querySelector(".confirmar-link");
const confirmDomiciliarLink = document.querySelector(".confirmar-link-domiciliar");

// inputs do formulário domiciliar
const inputsUsuario = document.querySelectorAll("#cep, #uf, #endereco, #bairro, #cidade, #numero, #complemento");
const btnAlterar = document.querySelector(".alterar");
// procura o botão confirmar do form (pode ser .confirmar-form ou .btn-confirmar-endereco)
const btnConfirmarEndereco = document.querySelector(".confirmar-form") || document.querySelector(".btn-confirmar-endereco");

// elemento de texto da confirmação domiciliar final
const confirmDomiciliarText = document.querySelector(".texto-confirmacao-domiciliar");
const btnVoltarDomiciliarFinal = document.querySelector(".btn-voltar-estado7");

// info do médico / preços
const nomeMedicoEl = document.querySelector(".info-perfil h3");
const nomeMedico = nomeMedicoEl ? nomeMedicoEl.textContent.trim() : "Profissional";
const precoOnlineEl = Array.from(document.querySelectorAll(".left-bot p")).find(p => /online/i.test(p.textContent)) || null;
const precoDomiciliarEl = Array.from(document.querySelectorAll(".left-bot p")).find(p => /domiciliar|domicíliar/i.test(p.textContent)) || null;

// estado
let selectedType = null; // 'online' ou 'domiciliar'

// helper para mostrar só um estado
function showOnly(sectionToShow) {
    const estados = [
        estadoInicial,
        estadoAgendamento,
        estadoCalendario,
        estadoHorarios,
        estadoConfirmOnline,
        estadoConfirmDomiciliar,
        estadoConfirmDomiciliarFinal
    ];
    estados.forEach(s => { if (s) s.style.display = "none"; });
    if (sectionToShow) sectionToShow.style.display = "flex";

}

function formatDateBR(isoDate) {
    if (!isoDate) return "";
    const p = isoDate.split("-");
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : isoDate;
}

function extractPrice(text) {
    if (!text) return "";
    const m = text.match(/R\$\s?([\d.,]+)/);
    return m ? "R$" + m[1] : text;
}

// converte "R$1.234,56" -> number 1234.56
function parseBRLToNumber(brl) {
    if (!brl) return 0;
    // remove tudo que não é dígito ou vírgula/point
    let s = String(brl).replace(/[^\d,.-]/g, "");
    // remover separador de milhares (pontos)
    s = s.replace(/\./g, "");
    // trocar vírgula por ponto decimal
    s = s.replace(/,/g, ".");
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
}

function formatBRL(number) {
    return Number(number).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// selecionadores (datas e horários)
const containerDatas = document.querySelector(".datas-disponiveis");
const containerHorarios = document.querySelector(".horarios-disponiveis");

// função para obter valor selecionado
function getSelectedData() {
    const checked = document.querySelector("input[name='data']:checked");
    return checked ? checked.value : null;
}
function getSelectedHorario() {
    const checked = document.querySelector("input[name='horario']:checked");
    return checked ? checked.value : null;
}

// adiciona comportamento visual para labels dentro de um container (remove selected nos irmãos)
function wireLabelSelection(containerSelector, labelClass) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const labels = container.querySelectorAll(labelClass);
    labels.forEach(lbl => {
        lbl.addEventListener("click", () => {
            labels.forEach(l => l.classList.remove("selected"));
            lbl.classList.add("selected");
            const inp = lbl.querySelector("input");
            if (inp) inp.checked = true;
        });
    });
}

wireLabelSelection(".datas-disponiveis", ".data");
wireLabelSelection(".horarios-disponiveis", ".horario");

// Escolher tipo (botões)
opcoes.forEach(btn => {
    btn.addEventListener("click", () => {
        opcoes.forEach(b => b.classList.remove("selecionado"));
        btn.classList.add("selecionado");
        selectedType = btn.dataset.tipo;
    });
});

// fluxos de navegação (mantive seu comportamento original)
if (btnAgendar) btnAgendar.addEventListener("click", () => showOnly(estadoAgendamento));
if (btnConfirmarTipo) btnConfirmarTipo.addEventListener("click", () => {
    if (!selectedType) { alert("Por favor, selecione o tipo de atendimento (Online ou Domiciliar)."); return; }
    showOnly(estadoCalendario);
});
if (btnVoltarTipo) btnVoltarTipo.addEventListener("click", () => showOnly(estadoInicial));
if (btnProximoCalendario) btnProximoCalendario.addEventListener("click", () => {
    const d = getSelectedData();
    if (!d) { alert("Escolha uma data antes de continuar."); return; }
    showOnly(estadoHorarios);
});
if (btnVoltarCalendario) btnVoltarCalendario.addEventListener("click", () => showOnly(estadoAgendamento));

if (btnProximoHorario) btnProximoHorario.addEventListener("click", () => {
    const horario = getSelectedHorario();
    const data = getSelectedData();
    if (!horario) { alert("Selecione um horário antes de continuar."); return; }
    if (!data) { alert("Escolha uma data antes de continuar."); return; }

    const dataBR = formatDateBR(data);
    const precoOnline = precoOnlineEl ? extractPrice(precoOnlineEl.textContent) : "R$0,00";
    const precoDomiciliar = precoDomiciliarEl ? extractPrice(precoDomiciliarEl.textContent) : "R$0,00";

    if (selectedType === "online") {
        const msg = `Você está prestes a agendar uma consulta com <b>${nomeMedico}</b> no dia <b>${dataBR}</b> às <b>${horario}</b>. Valor da consulta: <b>${precoOnline}</b>.`;
        if (confirmOnlineText) confirmOnlineText.innerHTML = msg;
        if (confirmOnlineLink) {
            confirmOnlineLink.href = "/consultas?" + new URLSearchParams({ medico: nomeMedico, data, horario, tipo: "online" }).toString();
        }
        showOnly(estadoConfirmOnline);
    } else if (selectedType === "domiciliar") {
        if (confirmDomiciliarLink) {
            confirmDomiciliarLink.href = "/consultas?" + new URLSearchParams({ medico: nomeMedico, data, horario, tipo: "domiciliar" }).toString();
        }
        // bloqueia inputs ao entrar no formulário
        inputsUsuario.forEach(inp => inp.disabled = true);
        showOnly(estadoConfirmDomiciliar);
    } else {
        alert("Tipo de atendimento inválido. Volte e selecione o tipo novamente.");
        showOnly(estadoAgendamento);
    }
});

if (btnVoltarHorarios) btnVoltarHorarios.addEventListener("click", () => showOnly(estadoCalendario));

// voltar das confirmações (online -> horarios ; domiciliar(form) -> horarios)
const btnVoltarFromOnline = document.querySelector(".btn-voltar-estado4");
const btnVoltarFromDomiciliar = document.querySelector(".btn-voltar-estado6");
if (btnVoltarFromOnline) btnVoltarFromOnline.addEventListener("click", () => showOnly(estadoHorarios));
if (btnVoltarFromDomiciliar) btnVoltarFromDomiciliar.addEventListener("click", () => {
    // ao voltar, bloqueia de novo
    inputsUsuario.forEach(inp => inp.disabled = true);
    showOnly(estadoHorarios);
});

// botão Alterar → desbloqueia inputs
if (btnAlterar) {
    btnAlterar.addEventListener("click", () => {
        inputsUsuario.forEach(inp => inp.disabled = false);
        // coloca foco no primeiro campo para facilitar
        if (inputsUsuario[0]) inputsUsuario[0].focus();
    });
}

// botão Confirmar Endereço (do formulário) → monta resumo e vai para tela final
if (btnConfirmarEndereco) {
    btnConfirmarEndereco.addEventListener("click", (event) => {
        // evitar submit padrão do form
        event.preventDefault();

        // lê data/horário (valores já selecionados)
        const data = getSelectedData();
        const horario = getSelectedHorario();
        if (!data || !horario) {
            alert("Dados inválidos: confirme data e horário antes de prosseguir.");
            return;
        }
        const dataBR = formatDateBR(data);

        // lê preços
        const precoBaseStr = precoDomiciliarEl ? extractPrice(precoDomiciliarEl.textContent) : "R$0,00";
        const precoBaseNum = parseBRLToNumber(precoBaseStr);
        const taxaNum = 15.00;
        const totalNum = precoBaseNum + taxaNum;
        const precoBaseFmt = formatBRL(precoBaseNum);
        const taxaFmt = formatBRL(taxaNum);
        const totalFmt = formatBRL(totalNum);

        // lê formulário de endereço
        const cep = (document.getElementById("cep") && document.getElementById("cep").value.trim()) || "-";
        const uf = (document.getElementById("uf") && document.getElementById("uf").value.trim()) || "-";
        const endereco = (document.getElementById("endereco") && document.getElementById("endereco").value.trim()) || "-";
        const bairro = (document.getElementById("bairro") && document.getElementById("bairro").value.trim()) || "-";
        const cidade = (document.getElementById("cidade") && document.getElementById("cidade").value.trim()) || "-";
        const numero = (document.getElementById("numero") && document.getElementById("numero").value.trim()) || "-";
        const complemento = (document.getElementById("complemento") && document.getElementById("complemento").value.trim()) || "-";

        // monta mensagem HTML para a tela final (Domiciliar)
        const msg = `
              Você está prestes a agendar uma consulta <b>DOMICILIAR</b> com <b>${nomeMedico}</b> no dia <b>${dataBR}</b> às <b>${horario}</b>.<br>
              Valor da consulta: <b>${precoBaseFmt}</b> + taxa de deslocamento: <b>${taxaFmt}</b>.<br>
              <b>Total: ${totalFmt}</b>.<br><br>
              <u>Endereço informado:</u><br>
              ${endereco}${numero && endereco !== "-" ? ', ' + numero : ''} - ${bairro}<br>
              ${cidade} / ${uf}<br>
              CEP: ${cep}<br>
              Complemento: ${complemento !== "-" ? complemento : '-'}
            `;

        if (confirmDomiciliarText) confirmDomiciliarText.innerHTML = msg;

        // define link de confirmação com parâmetros (opcional)
        if (confirmDomiciliarLink) {
            const params = new URLSearchParams({
                medico: nomeMedico,
                data,
                horario,
                tipo: "domiciliar",
                preco: precoBaseFmt,
                taxa: taxaFmt,
                total: totalFmt,
                endereco,
                numero,
                bairro,
                cidade,
                uf,
                cep,
                complemento
            });
            confirmDomiciliarLink.href = "/consultas?" + params.toString();
        }

        // garante que inputs fiquem bloqueados ao ir para a tela final
        inputsUsuario.forEach(inp => inp.disabled = true);
        showOnly(estadoConfirmDomiciliarFinal);
    });
}

// voltar da tela final domiciliar para o formulário de endereço
if (btnVoltarDomiciliarFinal) {
    btnVoltarDomiciliarFinal.addEventListener("click", () => {
        // mantemos os inputs bloqueados ao retornar (usuário pode clicar "Alterar" para editar)
        inputsUsuario.forEach(inp => inp.disabled = true);
        showOnly(estadoConfirmDomiciliar);
    });
}

// inicial
showOnly(estadoInicial);