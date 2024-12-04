// Seleciona os elementos do DOM
const fileInput = document.getElementById('file-upload');
const previewSection = document.getElementById('file-preview');
const convertButton = document.getElementById('convert-file');

// Evento para visualizar o arquivo
fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.type;
    previewSection.innerHTML = "Carregando prévia...";

    if (fileType === "application/pdf") {
        renderPDF(file);
    } else {
        previewSection.innerHTML = "Prévia não suportada para este tipo de arquivo.";
    }
});

// Função para renderizar PDFs
function renderPDF(file) {
    const url = URL.createObjectURL(file);
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    previewSection.innerHTML = '';
    previewSection.appendChild(iframe);
}

// Evento para converter o arquivo para JPG
convertButton.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
        alert("Nenhum arquivo selecionado para conversão.");
        return;
    }

    alert("A funcionalidade de conversão será implementada com uma API.");
});
