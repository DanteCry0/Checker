const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let uploadedImage = new Image();

// Variável para armazenar a cor do contorno selecionada
let borderColor = 'black'; // Cor padrão

// Configura o tamanho do canvas para 456x700px
canvas.width = 456;
canvas.height = 700;

// Função para desenhar um retângulo com cantos arredondados
function desenharRetanguloArredondado(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.stroke();
}

// Função para desenhar as margens de sangria, corte e segurança com cantos arredondados
function desenharMarcas() {
    const radius = 10;

    // Sangria (Ciano)
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 3;
    desenharRetanguloArredondado(ctx, 0, 0, 456, 700, radius);

    // Corte (Vermelho)
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    desenharRetanguloArredondado(ctx, 9.5, 10.5, 437, 679, radius);

    // Segurança (Verde)
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 3;
    desenharRetanguloArredondado(ctx, 29, 32, 398, 637, radius);
}

// Função para desenhar furos no canvas com base na escolha
function desenharFuro(tipo) {
    const furoOvoideY = 32 + 18; // 18px de distância da margem de segurança
    const furoRedondoY = 32 + 10; // 10px de distância da margem de segurança

    // Alterando a cor do contorno conforme a escolha
    ctx.strokeStyle = borderColor;

    if (tipo === "ovalCenter") {
        // Furo ovoide centralizado - 72x14px
        ctx.strokeRect((canvas.width - 72) / 2, furoOvoideY, 72, 14);
    } else if (tipo === "ovalDouble") {
        // Furo ovoide duplo - 72x14px (sem traço no meio)
        ctx.strokeRect(33, furoOvoideY, 72, 14); // Furo esquerdo
        ctx.strokeRect(canvas.width - 105, furoOvoideY, 72, 14); // Furo direito
    } else if (tipo === "roundCenter") {
        // Furo redondo centralizado - 24x26px
        ctx.beginPath();
        ctx.arc(canvas.width / 2, furoRedondoY + 13, 12, 0, 2 * Math.PI);
        ctx.stroke();
    } else if (tipo === "roundDouble") {
        // Furo redondo duplo - 24x26px (sem linha no meio, apenas círculos)
        ctx.fillStyle = borderColor; // Usamos a cor selecionada para preencher os círculos
        ctx.beginPath();
        ctx.arc(40, furoRedondoY + 13, 12, 0, 2 * Math.PI); // Furo esquerdo
        ctx.arc(canvas.width - 40, furoRedondoY + 13, 12, 0, 2 * Math.PI); // Furo direito
        ctx.fill(); // Preenche os círculos com a cor selecionada
    }
}

// Função para carregar a imagem
document.getElementById('upload').addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        uploadedImage.src = event.target.result;
        uploadedImage.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height); // Redimensiona a imagem para 456x700px
            desenharMarcas(); // Desenha as margens
            desenharFuro(document.getElementById('holeType').value); // Atualiza o furo após o upload
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Atualiza o furo com base na seleção
document.getElementById('holeType').addEventListener('change', function (e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height); // Redesenha a imagem carregada
    desenharMarcas(); // Redesenha as margens
    desenharFuro(e.target.value); // Atualiza o furo com a nova seleção
});

// Atualiza a cor do contorno com base na seleção
document.getElementById('borderColor').addEventListener('change', function (e) {
    borderColor = e.target.value; // Atualiza a cor com a escolha do usuário
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height); // Redesenha a imagem carregada
    desenharMarcas(); // Redesenha as margens
    desenharFuro(document.getElementById('holeType').value); // Atualiza o furo com a nova cor
});

// Botão para excluir a imagem carregada
document.getElementById('delete-image').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    uploadedImage = new Image(); // Reseta a imagem carregada
    desenharMarcas(); // Redesenha as marcas de sangria, corte e segurança
});

// Botão para baixar o canvas como imagem
document.getElementById('download-canvas').addEventListener('click', function () {
    const link = document.createElement('a');
    link.download = 'verificacao-arte.png'; // Nome do arquivo
    link.href = canvas.toDataURL('image/png'); // Exporta o canvas como PNG
    link.click();
});
