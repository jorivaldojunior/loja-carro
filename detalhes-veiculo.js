// ===== VARIÁVEIS GLOBAIS =====
let veiculoAtual = null;
let veiculoId = null;
let fotos = [];
let slideAtual = 0;
let editMode = false;

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
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}

// ===== NAVEGAÇÃO =====
function voltar() { 
    window.location.href = 'estoque.html'; 
}

// ===== MODO DE EDIÇÃO INLINE =====
function toggleEdit() {
    editMode = !editMode;
    
    const editBtn = document.getElementById('editBtn');
    const displayFields = document.querySelectorAll('.display-field');
    const editFields = document.querySelectorAll('.edit-field');
    
    if (editMode) {
        editBtn.innerHTML = '<i class="fas fa-check"></i>';
        editBtn.classList.add('success');
        
        displayFields.forEach(f => f.classList.add('hidden'));
        editFields.forEach(f => f.classList.remove('hidden'));
        
        sincronizarCamposParaEdicao();
    } else {
        salvar();
        
        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
        editBtn.classList.remove('success');
        
        displayFields.forEach(f => f.classList.remove('hidden'));
        editFields.forEach(f => f.classList.add('hidden'));
    }
}

function sincronizarCamposParaEdicao() {
    document.getElementById('marcaEdit').value = veiculoAtual?.marca || '';
    document.getElementById('modeloEdit').value = veiculoAtual?.modelo || '';
    document.getElementById('anoEdit').value = veiculoAtual?.ano || '';
    document.getElementById('corEdit').value = veiculoAtual?.cor || '';
    document.getElementById('kmEdit').value = veiculoAtual?.km || '';
    document.getElementById('placaEdit').value = veiculoAtual?.placa || '';
    document.getElementById('combustivelEdit').value = veiculoAtual?.combustivel || 'Flex';
    document.getElementById('dataCompraEdit').value = veiculoAtual?.dataCompra || '';
    document.getElementById('compraEdit').value = veiculoAtual?.compra || '';
    document.getElementById('vendaEdit').value = veiculoAtual?.venda || '';
    document.getElementById('fipeEdit').value = veiculoAtual?.fipe || '';
    document.getElementById('obsEdit').value = veiculoAtual?.observacoes || '';
}

function selectField(element) {
    if (!editMode) return;
    const id = element.id.replace('Display', 'Edit');
    document.getElementById(id)?.focus();
}

// ===== CARREGAR DADOS =====
function carregarVeiculo() {
    veiculoId = localStorage.getItem('veiculoId');
    if (!veiculoId) {
        Swal.fire({ 
            icon: 'error', 
            title: 'Erro', 
            text: 'Nenhum veículo selecionado', 
            background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
            color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff'
        }).then(() => voltar());
        return;
    }

    const dados = JSON.parse(localStorage.getItem('gmRepasses') || '{}');
    const veiculo = dados.cars?.find(c => c.id == veiculoId);
    
    if (veiculo) {
        veiculoAtual = veiculo;
        fotos = veiculo.fotos?.length ? veiculo.fotos : ['https://via.placeholder.com/800x600/1a1a1a/666?text=Sem+Imagem'];
        preencherTudo(veiculo);
        renderizarGaleria();
    }
}

function preencherTudo(v) {
    document.getElementById('veiculoTitulo').innerText = `${v.marca || ''} ${v.modelo || ''} ${v.ano || ''}`.trim() || 'Detalhes';
    
    document.getElementById('marcaDisplay').innerText = v.marca || '-';
    document.getElementById('modeloDisplay').innerText = v.modelo || '-';
    document.getElementById('anoDisplay').innerText = v.ano || '-';
    document.getElementById('corDisplay').innerText = v.cor || '-';
    document.getElementById('kmDisplay').innerText = v.km ? parseInt(v.km).toLocaleString() + ' km' : '-';
    document.getElementById('placaDisplay').innerText = v.placa || '-';
    document.getElementById('combustivelDisplay').innerText = v.combustivel || '-';
    document.getElementById('dataCompraDisplay').innerText = v.dataCompra ? new Date(v.dataCompra).toLocaleDateString('pt-BR') : '-';
    document.getElementById('obsDisplay').innerText = v.observacoes || 'Sem observações';
    
    document.getElementById('compraDisplay').innerHTML = formatarMoeda(v.compra || 0);
    document.getElementById('vendaDisplay').innerHTML = formatarMoeda(v.venda || 0);
    
    const fipeValor = v.fipe || 0;
    document.getElementById('fipeDisplay').innerHTML = formatarMoeda(fipeValor);
    
    atualizarStatusUI(v.status || 'Disponível');
    
    calcularLucro(v.compra || 0, v.venda || 0);
    atualizarComparativoFIPE(fipeValor, v.venda || 0);
}

// ===== STATUS =====
function mudarStatus(status) {
    veiculoAtual.status = status;
    atualizarStatusUI(status);
    salvar(true);
}

function atualizarStatusUI(status) {
    const container = document.getElementById('statusContainer');
    
    if (status === 'Disponível') {
        container.innerHTML = '<span class="status-badge badge-disponivel"><i class="fas fa-check-circle"></i> Disponível</span>';
    } else if (status === 'Reservado') {
        container.innerHTML = '<span class="status-badge badge-reservado"><i class="fas fa-clock"></i> Reservado</span>';
    } else {
        container.innerHTML = '<span class="status-badge badge-vendido"><i class="fas fa-check-double"></i> Vendido</span>';
    }
}

// ===== FORMATAÇÃO =====
function formatarMoeda(valor) {
    if (!valor && valor !== 0) return 'R$ 0,00';
    return 'R$ ' + Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcularLucro(compra, venda) {
    const lucro = venda - compra;
    document.getElementById('lucroDisplay').innerHTML = formatarMoeda(lucro);
    document.getElementById('lucroDisplay').className = lucro >= 0 ? 'text-xs sm:text-sm font-bold text-green-400' : 'text-xs sm:text-sm font-bold text-red-400';
}

function atualizarComparativoFIPE(fipe, venda) {
    const comparativo = document.getElementById('fipeComparativo');
    
    if (!fipe || fipe === 0) {
        comparativo.innerHTML = 'Digite o valor da Tabela FIPE';
        return;
    }
    
    if (!venda || venda === 0) {
        comparativo.innerHTML = 'Informe valor de venda';
        return;
    }
    
    const diff = ((venda - fipe) / fipe * 100).toFixed(1);
    
    if (venda > fipe) {
        comparativo.innerHTML = `<span class="text-green-400">+${diff}% acima da FIPE</span>`;
    } else if (venda < fipe) {
        comparativo.innerHTML = `<span class="text-yellow-400">${diff}% abaixo da FIPE</span>`;
    } else {
        comparativo.innerHTML = '<span class="text-gray-400">Igual à FIPE</span>';
    }
}

// ===== SALVAR =====
function salvar(silencioso = false) {
    const compra = Number(document.getElementById('compraEdit').value) || 0;
    const venda = Number(document.getElementById('vendaEdit').value) || 0;
    const fipe = Number(document.getElementById('fipeEdit').value) || 0;
    
    const veiculo = {
        id: veiculoId,
        marca: document.getElementById('marcaEdit').value || '',
        modelo: document.getElementById('modeloEdit').value || '',
        ano: document.getElementById('anoEdit').value || '',
        cor: document.getElementById('corEdit').value || '',
        km: document.getElementById('kmEdit').value || '',
        placa: (document.getElementById('placaEdit').value || '').toUpperCase(),
        combustivel: document.getElementById('combustivelEdit').value || 'Flex',
        dataCompra: document.getElementById('dataCompraEdit').value || '',
        compra: compra,
        venda: venda,
        fipe: fipe,
        observacoes: document.getElementById('obsEdit').value || '',
        status: veiculoAtual?.status || 'Disponível',
        fotos: fotos
    };
    
    const dados = JSON.parse(localStorage.getItem('gmRepasses') || '{}');
    if (!dados.cars) dados.cars = [];
    
    const index = dados.cars.findIndex(c => c.id == veiculoId);
    if (index >= 0) dados.cars[index] = veiculo;
    
    localStorage.setItem('gmRepasses', JSON.stringify(dados));
    veiculoAtual = veiculo;
    
    preencherTudo(veiculo);
    
    if (!silencioso) {
        Swal.fire({ 
            icon: 'success', 
            title: 'Salvo!', 
            timer: 1000, 
            showConfirmButton: false, 
            background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
            color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff'
        });
    }
}

// ===== EXCLUIR =====
function excluir() {
    Swal.fire({
        title: 'Excluir?',
        text: 'Esta ação não pode ser desfeita',
        icon: 'warning',
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar'
    }).then((r) => {
        if (r.isConfirmed) {
            const dados = JSON.parse(localStorage.getItem('gmRepasses') || '{}');
            dados.cars = dados.cars.filter(c => c.id != veiculoId);
            localStorage.setItem('gmRepasses', JSON.stringify(dados));
            voltar();
        }
    });
}

// ===== GALERIA =====
function renderizarGaleria() {
    const main = document.getElementById('galleryMain');
    const thumbs = document.getElementById('galleryThumbs');
    
    let slides = '';
    let thumbsHtml = '';
    
    fotos.forEach((foto, index) => {
        slides += `<img src="${foto}" class="${index === 0 ? 'active' : ''}" style="display: ${index === 0 ? 'block' : 'none'}; width:100%; height:100%; object-fit:contain;">`;
        thumbsHtml += `<img src="${foto}" onclick="irParaSlide(${index})" class="${index === 0 ? 'active' : ''}">`;
    });
    
    const prevBtn = main.querySelector('.gallery-nav.prev');
    const nextBtn = main.querySelector('.gallery-nav.next');
    main.innerHTML = slides;
    main.appendChild(prevBtn);
    main.appendChild(nextBtn);
    
    thumbs.innerHTML = thumbsHtml;
}

function mudarSlide(delta) {
    const slides = document.querySelectorAll('#galleryMain img');
    if (!slides.length) return;
    
    slides[slideAtual].style.display = 'none';
    slideAtual = (slideAtual + delta + slides.length) % slides.length;
    slides[slideAtual].style.display = 'block';
    
    document.querySelectorAll('#galleryThumbs img').forEach((thumb, i) => {
        if (i === slideAtual) thumb.classList.add('active');
        else thumb.classList.remove('active');
    });
}

function irParaSlide(index) {
    const slides = document.querySelectorAll('#galleryMain img');
    if (!slides.length) return;
    
    slides[slideAtual].style.display = 'none';
    slideAtual = index;
    slides[slideAtual].style.display = 'block';
    
    document.querySelectorAll('#galleryThumbs img').forEach((thumb, i) => {
        if (i === index) thumb.classList.add('active');
        else thumb.classList.remove('active');
    });
}

// ===== AJUSTAR LAYOUT =====
function ajustarLayout() {
    const grid = document.querySelector('.info-grid');
    if (window.innerWidth <= 768) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else if (window.innerWidth <= 1024) {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else {
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    ajustarLayout();
    carregarVeiculo();
    
    window.addEventListener('resize', ajustarLayout);
});