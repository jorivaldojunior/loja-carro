// ===== CLASSE CLIENTE =====
class Cliente {
    constructor(id, nome, email, telefone, documento, dataNascimento, status, endereco, potencial, observacoes, dataCadastro) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.documento = documento;
        this.dataNascimento = dataNascimento || '';
        this.status = status || 'ativo';
        this.endereco = endereco || '';
        this.potencial = potencial || 0;
        this.observacoes = observacoes || '';
        this.dataCadastro = dataCadastro || new Date().toISOString();
    }
}

// ===== VARIÁVEIS GLOBAIS =====
let clientes = [];
let clienteEditandoId = null;
let currentTheme = 'dark';

// ===== FUNÇÕES DE TEMA (mesmo padrão do principal) =====
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        currentTheme = 'light';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        currentTheme = 'dark';
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
        currentTheme = 'light';
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        icon.classList.add('fa-sun');
        icon.classList.remove('fa-moon');
        currentTheme = 'dark';
    }
}

// ===== FUNÇÕES DE MENU MOBILE =====
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('menuOverlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
}

function fecharMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('menuOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        fecharMenu();
    }
});

// ===== TELA CHEIA =====
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
        setTimeout(() => indicator.classList.remove('visible'), 3000);
    }
}

document.addEventListener('fullscreenchange', function() {
    const indicator = document.getElementById('fullscreenIndicator');
    if (!document.fullscreenElement && indicator) {
        indicator.classList.remove('visible');
    }
});

// ===== FUNÇÕES DE FORMATAÇÃO =====
function formatarMoedaBrasileira(valor) {
    if (valor === null || valor === undefined || isNaN(valor)) {
        return 'R$ 0,00';
    }
    valor = Number(valor);
    return valor.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });
}

function formatarMoedaInput(input) {
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

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== CRUD DE CLIENTES =====
function carregarClientes() {
    const dadosSalvos = localStorage.getItem('gmRepasses_clientes');
    if (dadosSalvos) {
        try {
            clientes = JSON.parse(dadosSalvos).map(c => new Cliente(
                c.id, c.nome, c.email, c.telefone, c.documento,
                c.dataNascimento, c.status, c.endereco, c.potencial,
                c.observacoes, c.dataCadastro
            ));
        } catch (e) {
            console.error('Erro ao carregar clientes:', e);
            clientes = [];
        }
    } else {
        clientes = []; // Começa vazio, sem dados de exemplo
    }
    
    atualizarStats();
    renderizarTabela();
}

function salvarClientes() {
    localStorage.setItem('gmRepasses_clientes', JSON.stringify(clientes));
}

function adicionarCliente(cliente) {
    const novoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
    cliente.id = novoId;
    clientes.push(cliente);
    salvarClientes();
    return cliente;
}

function atualizarCliente(cliente) {
    const index = clientes.findIndex(c => c.id === cliente.id);
    if (index !== -1) {
        clientes[index] = cliente;
        salvarClientes();
        return true;
    }
    return false;
}

function excluirCliente(id) {
    clientes = clientes.filter(c => c.id !== id);
    salvarClientes();
}

function getClienteById(id) {
    return clientes.find(c => c.id === id);
}

function getClientesFiltrados() {
    const busca = document.getElementById('searchCliente')?.value.toLowerCase() || '';
    const status = document.getElementById('filtroStatus')?.value || 'todos';
    
    let filtrados = [...clientes];
    
    if (busca) {
        filtrados = filtrados.filter(c => 
            c.nome.toLowerCase().includes(busca) ||
            c.email.toLowerCase().includes(busca) ||
            c.documento.includes(busca) ||
            c.telefone.includes(busca)
        );
    }
    
    if (status !== 'todos') {
        filtrados = filtrados.filter(c => c.status === status);
    }
    
    return filtrados;
}

function atualizarStats() {
    const total = clientes.length;
    const ativos = clientes.filter(c => c.status === 'ativo').length;
    const inativos = total - ativos;
    const potencialTotal = clientes.reduce((sum, c) => sum + (c.potencial || 0), 0);
    
    document.getElementById('totalClientes').innerText = total;
    document.getElementById('clientesAtivos').innerText = ativos;
    document.getElementById('clientesInativos').innerText = inativos;
    document.getElementById('potencialTotal').innerHTML = formatarMoedaBrasileira(potencialTotal);
}

function renderizarTabela() {
    const filtrados = getClientesFiltrados();
    const tbody = document.getElementById('tabelaClientes');
    const semClientesDiv = document.getElementById('semClientes');
    
    if (filtrados.length === 0) {
        tbody.innerHTML = '';
        semClientesDiv.classList.remove('hidden');
        return;
    }
    
    semClientesDiv.classList.add('hidden');
    
    tbody.innerHTML = filtrados.map(cliente => `
        <tr>
            <td class="font-medium">${escapeHtml(cliente.nome)}</td>
            <td>
                <div class="text-sm">${escapeHtml(cliente.email)}</div>
                <div class="text-xs text-gray-500">${cliente.telefone}</div>
            </td>
            <td class="text-sm">${cliente.documento}</td>
            <td>
                <span class="cliente-status-badge ${cliente.status === 'ativo' ? 'status-ativo' : 'status-inativo'}">
                    ${cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td class="text-sm">${formatarMoedaBrasileira(cliente.potencial)}</td>
            <td class="text-sm">${new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</td>
            <td>
                <button onclick="editarCliente(${cliente.id})" class="action-btn text-purple-400 hover:text-purple-300 mr-2" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="confirmarExcluir(${cliente.id})" class="action-btn text-red-400 hover:text-red-300" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== UI FUNCTIONS =====
function mostrarLista() {
    document.getElementById('listaSection').classList.remove('hidden');
    document.getElementById('cadastroSection').classList.add('hidden');
    document.getElementById('tabLista').classList.add('tab-active');
    document.getElementById('tabLista').classList.remove('tab-inactive');
    document.getElementById('tabCadastro').classList.remove('tab-active');
    document.getElementById('tabCadastro').classList.add('tab-inactive');
    clienteEditandoId = null;
    renderizarTabela();
}

function mostrarCadastro() {
    document.getElementById('listaSection').classList.add('hidden');
    document.getElementById('cadastroSection').classList.remove('hidden');
    document.getElementById('tabCadastro').classList.add('tab-active');
    document.getElementById('tabCadastro').classList.remove('tab-inactive');
    document.getElementById('tabLista').classList.remove('tab-active');
    document.getElementById('tabLista').classList.add('tab-inactive');
}

function limparFormulario() {
    document.getElementById('clienteForm').reset();
    document.getElementById('formTitle').innerText = 'Cadastrar Novo Cliente';
    clienteEditandoId = null;
}

function editarCliente(id) {
    const cliente = getClienteById(id);
    if (!cliente) return;
    
    clienteEditandoId = id;
    document.getElementById('formTitle').innerText = 'Editar Cliente';
    document.getElementById('nome').value = cliente.nome;
    document.getElementById('email').value = cliente.email;
    document.getElementById('telefone').value = cliente.telefone;
    document.getElementById('documento').value = cliente.documento;
    document.getElementById('dataNascimento').value = cliente.dataNascimento || '';
    document.getElementById('status').value = cliente.status;
    document.getElementById('endereco').value = cliente.endereco || '';
    document.getElementById('potencial').value = cliente.potencial ? formatarMoedaBrasileira(cliente.potencial).replace('R$ ', '') : '';
    document.getElementById('observacoes').value = cliente.observacoes || '';
    
    mostrarCadastro();
}

function salvarCliente(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const documento = document.getElementById('documento').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const status = document.getElementById('status').value;
    const endereco = document.getElementById('endereco').value;
    const potencialInput = document.getElementById('potencial').value;
    const observacoes = document.getElementById('observacoes').value;
    
    if (!nome || !email || !telefone || !documento) {
        Swal.fire({
            icon: 'error',
            title: 'Campos obrigatórios',
            text: 'Preencha todos os campos com *',
            background: currentTheme === 'light' ? '#ffffff' : '#1a1a1a',
            confirmButtonColor: '#a855f7'
        });
        return;
    }
    
    const potencial = converterParaNumero(potencialInput);
    
    if (clienteEditandoId) {
        const cliente = new Cliente(
            clienteEditandoId, nome, email, telefone, documento,
            dataNascimento, status, endereco, potencial, observacoes,
            getClienteById(clienteEditandoId)?.dataCadastro || new Date().toISOString()
        );
        atualizarCliente(cliente);
        Swal.fire({
            icon: 'success',
            title: 'Cliente atualizado!',
            text: 'Os dados foram salvos com sucesso.',
            background: currentTheme === 'light' ? '#ffffff' : '#1a1a1a',
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        const cliente = new Cliente(
            null, nome, email, telefone, documento,
            dataNascimento, status, endereco, potencial, observacoes
        );
        adicionarCliente(cliente);
        Swal.fire({
            icon: 'success',
            title: 'Cliente cadastrado!',
            text: 'O cliente foi adicionado com sucesso.',
            background: currentTheme === 'light' ? '#ffffff' : '#1a1a1a',
            timer: 1500,
            showConfirmButton: false
        });
    }
    
    limparFormulario();
    atualizarStats();
    mostrarLista();
}

function confirmarExcluir(id) {
    const cliente = getClienteById(id);
    Swal.fire({
        title: 'Excluir cliente',
        html: `Tem certeza que deseja excluir <strong>${escapeHtml(cliente?.nome)}</strong>?<br>Esta ação não pode ser desfeita.`,
        icon: 'warning',
        background: currentTheme === 'light' ? '#ffffff' : '#1a1a1a',
        color: currentTheme === 'light' ? '#1f2937' : '#fff',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            excluirCliente(id);
            atualizarStats();
            renderizarTabela();
            Swal.fire({
                icon: 'success',
                title: 'Excluído!',
                text: 'Cliente removido com sucesso.',
                background: currentTheme === 'light' ? '#ffffff' : '#1a1a1a',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

function exportarCSV() {
    const clientesExportar = getClientesFiltrados();
    if (clientesExportar.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Nenhum cliente',
            text: 'Não há clientes para exportar.',
            background: currentTheme === 'light' ? '#ffffff' : '#1a1a1a',
            confirmButtonColor: '#a855f7'
        });
        return;
    }
    
    const headers = ['Nome', 'E-mail', 'Telefone', 'CPF/CNPJ', 'Status', 'Potencial', 'Data Cadastro', 'Endereço', 'Observações'];
    const rows = clientesExportar.map(c => [
        c.nome,
        c.email,
        c.telefone,
        c.documento,
        c.status === 'ativo' ? 'Ativo' : 'Inativo',
        formatarMoedaBrasileira(c.potencial),
        new Date(c.dataCadastro).toLocaleDateString('pt-BR'),
        c.endereco,
        c.observacoes
    ]);
    
    const csvContent = [headers, ...rows].map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    Swal.fire({
        icon: 'success',
        title: 'Exportado!',
        text: `${clientesExportar.length} clientes exportados.`,
        background: currentTheme === 'light' ? '#ffffff' : '#1a1a1a',
        timer: 1500,
        showConfirmButton: false
    });
}

function sair() {
    Swal.fire({
        title: 'Deseja sair?',
        text: 'Você será redirecionado para a página de login',
        icon: 'question',
        background: currentTheme === 'light' ? '#ffffff' : '#1a1a1a',
        color: currentTheme === 'light' ? '#1f2937' : '#fff',
        showCancelButton: true,
        confirmButtonColor: '#a855f7',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "index.html";
        }
    });
}

// ===== EVENT LISTENERS =====
function inicializarEventListeners() {
    // Botões Novo Cliente (mobile e desktop)
    document.getElementById('btnNovoClienteMobile').addEventListener('click', () => {
        limparFormulario();
        mostrarCadastro();
    });
    
    document.getElementById('btnNovoClienteDesktop').addEventListener('click', () => {
        limparFormulario();
        mostrarCadastro();
    });
    
    document.getElementById('tabLista').addEventListener('click', mostrarLista);
    document.getElementById('tabCadastro').addEventListener('click', () => {
        limparFormulario();
        mostrarCadastro();
    });
    
    document.getElementById('clienteForm').addEventListener('submit', salvarCliente);
    document.getElementById('cancelarForm').addEventListener('click', () => {
        limparFormulario();
        mostrarLista();
    });
    
    document.getElementById('searchCliente').addEventListener('input', renderizarTabela);
    document.getElementById('filtroStatus').addEventListener('change', renderizarTabela);
    document.getElementById('btnExportar').addEventListener('click', exportarCSV);
    document.getElementById('btnIrCadastro').addEventListener('click', () => {
        limparFormulario();
        mostrarCadastro();
    });
}

// ===== INICIALIZAÇÃO =====
window.onload = function() {
    loadTheme();
    carregarClientes();
    inicializarEventListeners();
    mostrarLista();
    
    // Atualizar tema quando mudar
    const observer = new MutationObserver(() => {
        currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        renderizarTabela();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
};