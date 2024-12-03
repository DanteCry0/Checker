const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let uploadedImage = new Image();

// Variável para armazenar a cor do contorno selecionada
let borderColor = 'black'; // Cor padrão

// Configura o tamanho do canvas para 455x700px
canvas.width = 455;
canvas.height = 700;

// Função para desenhar um retângulo com cantos arredondados
function desenharRetanguloArredondado(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); // Começa no canto superior esquerdo
    ctx.lineTo(x + width - radius, y); // Linha para o canto superior direito
    ctx.arcTo(x + width, y, x + width, y + radius, radius); // Canto superior direito
    ctx.lineTo(x + width, y + height - radius); // Linha para o canto inferior direito
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // Canto inferior direito
    ctx.lineTo(x + radius, y + height); // Linha para o canto inferior esquerdo
    ctx.arcTo(x, y + height, x, y + height - radius, radius); // Canto inferior esquerdo
    ctx.lineTo(x, y + radius); // Linha para o canto superior esquerdo
    ctx.arcTo(x, y, x + radius, y, radius); // Canto superior esquerdo
    ctx.closePath(); // Fecha o caminho
    ctx.stroke(); // Desenha o contorno
}

// Função para desenhar as marcas de sangria, corte e segurança com cantos arredondados
function desenharMarcas() {
    const radius = 10; // Define o raio dos cantos arredondados

    // Sangria (Ciano)
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 3;
    desenharRetanguloArredondado(ctx, 0, 0, 455, 700, radius);

    // Corte (Vermelho)
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    desenharRetanguloArredondado(ctx, 11.5, 14, 432, 672, radius);

    // Segurança (Verde)
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 3;
    desenharRetanguloArredondado(ctx, 23, 34, 404, 629, radius);
}

// Função para desenhar furos no canvas com base na escolha
function desenharFuro(tipo) {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a imagem carregada (se houver)
    if (uploadedImage.src) {
        const x = (canvas.width - uploadedImage.width) / 2;
        const y = (canvas.height - uploadedImage.height) / 2;
        ctx.drawImage(uploadedImage, x, y, uploadedImage.width, uploadedImage.height);
    }

    // Desenha as marcas de sangria, corte e segurança
    desenharMarcas();

    // Ajuste de posição para garantir que os furos fiquem centralizados no topo da marca de segurança
    const furoY = 34;  // Y fixo para os furos, alinhado ao topo da área de segurança

    // Baseado no tipo de furo escolhido, desenha o furo correspondente
    ctx.lineWidth = 3; // Espessura da linha

    // Alterando a cor do contorno conforme a escolha
    ctx.strokeStyle = borderColor; // Usa a cor escolhida pelo usuário para o contorno

    if (tipo === "ovalCenter") {
        // Furo ovoide centralizado
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeRect(227 - 34, furoY, 68, 15); // Furo ovoide centralizado
    } else if (tipo === "ovalDouble") {
        // Furo ovoide duplo, agora com a mesma posição dos furos redondos duplos
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        // Furo ovoide lateral 1
        ctx.strokeRect(33, furoY, 68, 15); 
        // Furo ovoide lateral 2, alinhado com a posição X do furo redondo
        ctx.strokeRect(350, furoY, 68, 15);
    } else if (tipo === "roundCenter") {
        // Furo redondo centralizado
        ctx.beginPath();
        ctx.arc(227, furoY + 7.5, 9, 0, 2 * Math.PI); // Furo redondo centralizado
        ctx.stroke();
    } else if (tipo === "roundDouble") {
        // Furo redondo duplo (sem o traço no meio, apenas círculos)
        ctx.fillStyle = borderColor; // Usamos a cor selecionada para preencher os círculos
        ctx.beginPath();
        ctx.arc(414, furoY + 7.5, 9, 0, 2 * Math.PI); // Furo redondo 1
        ctx.arc(41, furoY + 7.5, 9, 0, 2 * Math.PI); // Furo redondo 2
        ctx.fill(); // Preenche os círculos com a cor selecionada
    }
}

// Função para centralizar a imagem no canvas
function centralizarImagem(img) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const x = (canvasWidth - img.width) / 2;
    const y = (canvasHeight - img.height) / 2;

    // Limpa o canvas e desenha a imagem centralizada
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, canvasWidth, canvasHeight);
    desenharFuro(document.getElementById('holeType').value); // Desenha o furo após a imagem
}

// Função para carregar a imagem
document.getElementById('upload').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        uploadedImage.src = event.target.result;
        uploadedImage.onload = function() {
            uploadedImage.width = 455;  // Ajustado para 455px
            uploadedImage.height = 700;
            desenharFuro(document.getElementById('holeType').value); // Atualiza o furo após o upload
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Atualiza o furo com base na seleção
document.getElementById('holeType').addEventListener('change', function(e) {
    desenharFuro(e.target.value); // Atualiza o furo com a nova seleção
});

// Atualiza a cor do contorno com base na seleção
document.getElementById('borderColor').addEventListener('change', function(e) {
    borderColor = e.target.value; // Atualiza a cor com a escolha do usuário
    desenharFuro(document.getElementById('holeType').value); // Atualiza o furo com a nova cor
});

// Botão para excluir a imagem carregada
document.getElementById('delete-image').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    uploadedImage = new Image(); // Reseta a imagem carregada
    desenharMarcas(); // Redesenha as marcas de sangria, corte e segurança
});


// Botão para baixar o canvas como imagem
document.getElementById('download-canvas').addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'verificacao-arte.png'; // Nome do arquivo
    link.href = canvas.toDataURL('image/png'); // Exporta o canvas como PNG
    link.click();
});

