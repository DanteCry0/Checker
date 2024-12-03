const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let uploadedImage = new Image();

// Configura o tamanho do canvas para 10630x342px
canvas.width = 10630;
canvas.height = 342;

// Função para desenhar as marcas de sangria, corte e segurança com bordas arredondadas
function desenharMarcas() {
    // Cor de sangria (cyan) - 10630x342px
    ctx.strokeStyle = '#00FFFF'; // Ciano
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round'; // Bordas arredondadas
    ctx.lineCap = 'round';  // Extremidades arredondadas
    ctx.strokeRect(0, 0, 10630, 342); // Marca de sangria

    // Cor de corte (vermelho) - 10238x318px (proporcional)
    ctx.strokeStyle = '#FF0000'; // Vermelho
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round'; // Bordas arredondadas
    ctx.lineCap = 'round';  // Extremidades arredondadas
    ctx.strokeRect(192, 24, 10238, 318); // Marca de corte (proporcional ao canvas)

    // Cor de segurança (verde) - 9902x298px (proporcional)
    ctx.strokeStyle = '#00FF00'; // Verde
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round'; // Bordas arredondadas
    ctx.lineCap = 'round';  // Extremidades arredondadas
    ctx.strokeRect(380, 44, 9902, 298); // Marca de segurança (proporcional ao canvas)
}

// Função para desenhar a imagem no canvas
function centralizarImagem(img) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const x = (canvasWidth - img.width) / 2;
    const y = (canvasHeight - img.height) / 2;

    // Limpa o canvas e desenha a imagem centralizada
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, canvasWidth, canvasHeight);
    desenharMarcas(); // Desenha as marcas de sangria, corte e segurança
}

// Função para carregar a imagem
document.getElementById('upload').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        uploadedImage.src = event.target.result;
        uploadedImage.onload = function() {
            uploadedImage.width = 10630;  // Novo tamanho para o canvas
            uploadedImage.height = 342;
            centralizarImagem(uploadedImage);
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Botão para excluir a imagem carregada
document.getElementById('delete-image').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    desenharMarcas(); // Redesenha as marcas de sangria, corte e segurança
});

// Botão para baixar o canvas como imagem
document.getElementById('download-canvas').addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'verificacao-cordao.png'; // Nome do arquivo
    link.href = canvas.toDataURL('image/png'); // Exporta o canvas como PNG
    link.click();
});
