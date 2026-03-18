// ===== FUNÇÃO DE TEMA =====
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        icon.classList.add('fa-sun');
        icon.classList.remove('fa-moon');
    }
}

// ===== FUNÇÃO DE TELA CHEIA =====
function ativarTelaCheia() {
    const elemento = document.documentElement;
    const indicator = document.getElementById('fullscreenIndicator');
    
    if (elemento.requestFullscreen) {
        elemento.requestFullscreen();
    } else if (elemento.webkitRequestFullscreen) {
        elemento.webkitRequestFullscreen();
    } else if (elemento.msRequestFullscreen) {
        elemento.msRequestFullscreen();
    }
    
    if (indicator) {
        indicator.classList.add('visible');
    }
}

document.addEventListener('fullscreenchange', atualizarIndicadorFullscreen);
document.addEventListener('webkitfullscreenchange', atualizarIndicadorFullscreen);
document.addEventListener('mozfullscreenchange', atualizarIndicadorFullscreen);
document.addEventListener('MSFullscreenChange', atualizarIndicadorFullscreen);

function atualizarIndicadorFullscreen() {
    const indicator = document.getElementById('fullscreenIndicator');
    if (!document.fullscreenElement) {
        if (indicator) {
            indicator.classList.remove('visible');
        }
    }
}

// ===== FUNÇÕES DE FORMATAÇÃO =====
function formatarMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length === 0) {
        input.value = '';
        return;
    }
    valor = (parseInt(valor) / 100).toFixed(2) + '';
    valor = valor.replace('.', ',');
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    input.value = valor;
}

function converterParaNumero(valorFormatado) {
    if (!valorFormatado) return 0;
    let numero = valorFormatado.replace(/\./g, '').replace(',', '.');
    return parseFloat(numero) || 0;
}

// ===== FUNÇÕES DO FORMULÁRIO =====
function limparFormulario() {
    Swal.fire({
        title: 'Limpar campos?',
        text: 'Todos os dados preenchidos serão apagados',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#a855f7',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sim, limpar',
        cancelButtonText: 'Cancelar',
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('marca').value = '';
            document.getElementById('modelo').value = '';
            document.getElementById('ano').value = '';
            document.getElementById('placa').value = '';
            document.getElementById('cor').value = '';
            document.getElementById('km').value = '';
            document.getElementById('combustivel').value = 'Flex';
            document.getElementById('compra').value = '';
            document.getElementById('venda').value = '';
            document.getElementById('fipe').value = '';
            document.getElementById('dataCompra').value = '';
            document.getElementById('dataVenda').value = '';
            document.getElementById('status').value = 'Disponível';
            document.getElementById('observacoes').value = '';
            document.getElementById('fotosInput').value = '';
            document.getElementById('previewContainer').innerHTML = '';
            document.getElementById('fileInfo').classList.remove('active');
        }
    });
}

// ===== FUNÇÕES DE FOTOS =====
function previewFotos() {
    const input = document.getElementById('fotosInput');
    const previewContainer = document.getElementById('previewContainer');
    const fileInfo = document.getElementById('fileInfo');
    const fileCount = document.getElementById('fileCount');
    
    previewContainer.innerHTML = '';
    
    if (input.files.length > 0) {
        if (input.files.length > 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Máximo de fotos',
                text: 'Selecione no máximo 5 fotos!',
                background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
                color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
                confirmButtonColor: '#a855f7'
            });
            input.value = '';
            return;
        }
        
        fileInfo.classList.add('active');
        fileCount.innerText = input.files.length;
        
        for (let i = 0; i < input.files.length; i++) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-image';
                img.title = `Foto ${i + 1}`;
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(input.files[i]);
        }
    } else {
        fileInfo.classList.remove('active');
    }
}

async function processarFotos(files) {
    return new Promise((resolve) => {
        if (!files || files.length === 0) {
            resolve([]);
            return;
        }
        
        let fotos = [];
        let processadas = 0;
        
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function(e) {
                fotos.push(e.target.result);
                processadas++;
                if (processadas === files.length) {
                    resolve(fotos);
                }
            };
            reader.readAsDataURL(files[i]);
        }
    });
}

// ===== FUNÇÃO DE SALVAR =====
async function salvarVeiculo() {
    // Validar campos obrigatórios
    const marca = document.getElementById('marca').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    
    if (!marca || !modelo) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Marca e modelo são obrigatórios!',
            background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
            color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
            confirmButtonColor: '#a855f7'
        });
        return;
    }
    
    // Converter valores
    const compra = converterParaNumero(document.getElementById('compra').value);
    const venda = converterParaNumero(document.getElementById('venda').value);
    const fipe = converterParaNumero(document.getElementById('fipe').value);
    
    if (compra <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Valor de compra é obrigatório!',
            background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
            color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
            confirmButtonColor: '#a855f7'
        });
        return;
    }
    
    if (venda <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Valor de venda é obrigatório!',
            background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
            color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
            confirmButtonColor: '#a855f7'
        });
        return;
    }
    
    // Mostrar loading
    Swal.fire({
        title: 'Processando...',
        text: 'Salvando veículo',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff'
    });
    
    // Processar fotos
    let fotos = await processarFotos(document.getElementById('fotosInput').files);
    
    // Criar objeto do veículo
    let veiculo = {
        id: Date.now(),
        marca: marca,
        modelo: modelo,
        ano: document.getElementById('ano').value,
        placa: document.getElementById('placa').value.toUpperCase(),
        cor: document.getElementById('cor').value,
        km: document.getElementById('km').value,
        combustivel: document.getElementById('combustivel').value,
        compra: compra,
        venda: venda,
        fipe: fipe,
        dataCompra: document.getElementById('dataCompra').value,
        dataVenda: document.getElementById('dataVenda').value,
        status: document.getElementById('status').value,
        observacoes: document.getElementById('observacoes').value,
        fotos: fotos
    };
    
    // Salvar no localStorage
    const dadosSalvos = localStorage.getItem('gmRepasses');
    let dados = dadosSalvos ? JSON.parse(dadosSalvos) : { cars: [], investimento: 0, investimentoVisivel: true, lucroVisivel: true };
    if (!dados.cars) dados.cars = [];
    
    dados.cars.push(veiculo);
    localStorage.setItem('gmRepasses', JSON.stringify(dados));
    
    Swal.close();
    
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Veículo cadastrado com sucesso!',
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'principal.html';
    });
}

// ===== FUNÇÃO VOLTAR =====
function voltar() {
    Swal.fire({
        title: 'Descartar alterações?',
        text: 'Os dados não salvos serão perdidos',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sair',
        cancelButtonText: 'Cancelar',
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'principal.html';
        }
    });
}

// ===== EVENTOS =====
document.getElementById('placa').addEventListener('input', function(e) {
    this.value = this.value.toUpperCase();
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        salvarVeiculo();
    }
    
    if (e.key === 'Escape') {
        voltar();
    }
});

document.getElementById('km').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
});

// ===== INICIALIZAÇÃO =====
window.onload = function() {
    loadTheme();
};