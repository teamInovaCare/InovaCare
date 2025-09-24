function showNotify(titulo, texto, tipo, posicao, duracao=3000) {
  new Notify({
    status: tipo,              // 'success', 'error', etc
    title: titulo,
    text: texto,
    effect: 'fade',
    speed: 300,
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: duracao,
    gap: 20,
    distance: 20,
    type: 'outline',
    position: posicao          // 'center', 'right top' etc
  });
}