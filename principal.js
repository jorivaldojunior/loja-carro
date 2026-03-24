// ===== VARIÁVEIS GLOBAIS =====
let cars = [];
let investimento = 0;
let investimentoVisivel = true;
let lucroVisivel = true;
const SENHA_ADMIN = "1234";

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

// ===== FUNÇÕES DO MENU MOBILE =====
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
    if (!document.fullscreenElement && indicator) {
        indicator.classList.remove('visible');
    }
}

// ===== FUNÇÕES DE NAVEGAÇÃO =====
function showPage(page) {
    const pages = ['dashboard', 'clientes', 'financeiro'];
    pages.forEach(p => {
        const element = document.getElementById(p);
        if (element) {
            if (p === page) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    });
}

function abrirCadastro() {
    window.location.href = 'cadastro-veiculo.html';
}

function abrirEstoquePublico() {
    window.location.href = 'estoque-publico.html';
}

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

// ===== FUNÇÕES DE DADOS =====
function carregarDados() {
    const dadosSalvos = localStorage.getItem('gmRepasses');
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            cars = dados.cars || [];
            investimento = dados.investimento || 0;
            investimentoVisivel = dados.investimentoVisivel !== undefined ? dados.investimentoVisivel : true;
            lucroVisivel = dados.lucroVisivel !== undefined ? dados.lucroVisivel : true;
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
        }
    }
    
    atualizarDashboard();
    atualizarIconesOlho();
}

function salvarDados() {
    localStorage.setItem('gmRepasses', JSON.stringify({
        cars: cars,
        investimento: investimento,
        investimentoVisivel: investimentoVisivel,
        lucroVisivel: lucroVisivel
    }));
}

function atualizarIconesOlho() {
    const eyeIconInvestimento = document.getElementById('eyeIconInvestimento');
    if (eyeIconInvestimento) {
        if (investimentoVisivel) {
            eyeIconInvestimento.classList.remove('fa-eye-slash');
            eyeIconInvestimento.classList.add('fa-eye');
        } else {
            eyeIconInvestimento.classList.remove('fa-eye');
            eyeIconInvestimento.classList.add('fa-eye-slash');
        }
    }
    
    const eyeIconLucro = document.getElementById('eyeIconLucro');
    if (eyeIconLucro) {
        if (lucroVisivel) {
            eyeIconLucro.classList.remove('fa-eye-slash');
            eyeIconLucro.classList.add('fa-eye');
        } else {
            eyeIconLucro.classList.remove('fa-eye');
            eyeIconLucro.classList.add('fa-eye-slash');
        }
    }
}

// ===== FUNÇÕES DE INVESTIMENTO E LUCRO =====
function verificarSenhaInvestimento() {
    const modal = document.getElementById('modalSenha');
    const input = document.getElementById('senhaInput');
    if (modal && input) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        input.value = '';
        input.focus();
    }
}

function fecharModalSenha() {
    const modal = document.getElementById('modalSenha');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function verificarSenha() {
    let senha = document.getElementById('senhaInput').value;
    if (senha === SENHA_ADMIN) {
        fecharModalSenha();
        abrirModalInvestimento();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Acesso Negado',
            text: 'Senha incorreta!',
            background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
            color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
            confirmButtonColor: '#a855f7'
        });
    }
}

function abrirModalInvestimento() {
    const input = document.getElementById('investimentoInput');
    const modal = document.getElementById('modalInvestimento');
    if (input && modal) {
        input.value = investimento > 0 ? formatarMoedaBrasileira(investimento).replace('R$ ', '') : '';
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function fecharModalInvestimento() {
    const modal = document.getElementById('modalInvestimento');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function salvarInvestimento() {
    let valorFormatado = document.getElementById('investimentoInput').value;
    let valor = converterParaNumero(valorFormatado);
    
    if (isNaN(valor) || valor < 0) {
        Swal.fire({ 
            icon: 'error', 
            title: 'Erro', 
            text: 'Digite um valor válido!', 
            background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
            color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
            confirmButtonColor: '#a855f7'
        });
        return;
    }
    investimento = valor;
    salvarDados();
    fecharModalInvestimento();
    atualizarDashboard();
    
    Swal.fire({
        icon: 'success',
        title: 'Investimento atualizado!',
        text: `Novo investimento: ${formatarMoedaBrasileira(investimento)}`,
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
        timer: 2000,
        showConfirmButton: false
    });
}

function toggleInvestimentoVisivel() {
    investimentoVisivel = !investimentoVisivel;
    atualizarIconesOlho();
    salvarDados();
    atualizarDashboard();
}

function toggleLucroVisivel() {
    console.log('toggleLucroVisivel chamado - estado atual:', lucroVisivel);
    lucroVisivel = !lucroVisivel;
    console.log('novo estado lucroVisivel:', lucroVisivel);
    atualizarIconesOlho();
    salvarDados();
    atualizarDashboard();
}

function mostrarExplicacaoLucro() {
    let ind = calcularIndicadores();
    let status = ind.saldo >= 0 ? '✅ LUCRO' : '⚠️ PREJUÍZO';
    let cor = ind.saldo >= 0 ? '#10b981' : '#ef4444';
    
    Swal.fire({
        title: 'Análise de Lucro/Prejuízo',
        html: `
            <div style="text-align: left;">
                <p style="color: ${cor}; font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px;">
                    ${status}
                </p>
                <p><span style="color: #6b7280;">Investimento total:</span> <strong>${formatarMoedaBrasileira(investimento)}</strong></p>
                <p><span style="color: #6b7280;">Lucro realizado:</span> <strong>${formatarMoedaBrasileira(ind.lucroRealizado)}</strong></p>
                <p><span style="color: #6b7280;">Lucro potencial (estoque):</span> <strong>${formatarMoedaBrasileira(ind.lucroPotencial)}</strong></p>
                <p><span style="color: #6b7280;">Valor em estoque:</span> <strong>${formatarMoedaBrasileira(ind.valorEstoque)}</strong></p>
                <hr style="border-color: ${document.body.classList.contains('light-theme') ? '#e5e7eb' : '#2a2a2a'}; margin: 15px 0;">
                <p><span style="color: #6b7280;">Saldo atual:</span> <strong style="color: ${cor};">${formatarMoedaBrasileira(ind.saldo)}</strong></p>
                <p style="font-size: 0.85rem; color: #6b7280; margin-top: 15px;">
                    ${ind.saldo >= 0 
                        ? '✅ Seu negócio está lucrativo! O retorno sobre o investimento é positivo.' 
                        : '⚠️ Você está com prejuízo no momento. Revise seus preços ou custos.'}
                </p>
                <p style="font-size: 0.75rem; color: #6b7280; margin-top: 10px;">
                    * Lucro realizado: vendas já concretizadas<br>
                    * Lucro potencial: lucro estimado dos veículos disponíveis<br>
                    * Saldo = Lucro realizado - (Investimento - Valor em estoque)
                </p>
            </div>
        `,
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
        confirmButtonColor: '#a855f7',
        confirmButtonText: 'Entendi'
    });
}

function calcularIndicadores() {
    let totalCars = cars.length;
    let soldCars = cars.filter(c => c && c.status === 'Vendido').length;
    let valorEstoque = cars.filter(c => c && c.status !== 'Vendido').reduce((acc, c) => acc + (c.compra || 0), 0);
    let lucroRealizado = cars.filter(c => c && c.status === 'Vendido').reduce((acc, c) => acc + ((c.venda || 0) - (c.compra || 0)), 0);
    let lucroPotencial = cars.filter(c => c && c.status !== 'Vendido').reduce((acc, c) => acc + ((c.venda || 0) - (c.compra || 0)), 0);
    
    let lucroTotal = lucroRealizado;
    let saldo = lucroTotal - (investimento - valorEstoque);
    
    return { totalCars, soldCars, valorEstoque, lucroRealizado, lucroPotencial, lucroTotal, saldo };
}

function atualizarDashboard() {
    let ind = calcularIndicadores();
    
    const totalCarsElem = document.getElementById('totalCars');
    const soldCarsElem = document.getElementById('soldCars');
    const investimentoElem = document.getElementById('investimentoTotal');
    const lucroElem = document.getElementById('lucroPrejuizo');
    const lucroRealizadoElem = document.getElementById('lucroRealizado');
    const lucroPotencialElem = document.getElementById('lucroPotencial');
    const valorEstoqueElem = document.getElementById('valorEstoque');
    const saudeElem = document.getElementById('saudeIndicador');
    const saudeMsg = document.getElementById('saudeMensagem');
    const margemMediaElem = document.getElementById('margemMedia');
    const margemBarElem = document.getElementById('margemBar');
    
    if (totalCarsElem) totalCarsElem.innerText = ind.totalCars;
    if (soldCarsElem) soldCarsElem.innerText = ind.soldCars;
    
    if (investimentoElem) {
        if (investimentoVisivel) {
            investimentoElem.innerHTML = formatarMoedaBrasileira(investimento);
        } else {
            investimentoElem.innerHTML = 'R$ •••••••';
        }
    }
    
    let lucroClass = ind.saldo >= 0 ? 'text-green-400' : 'text-red-400';
    
    if (lucroElem) {
        if (lucroVisivel) {
            lucroElem.innerHTML = `<span class="${lucroClass}">${formatarMoedaBrasileira(ind.saldo)}</span>`;
        } else {
            lucroElem.innerHTML = `<span class="${lucroClass}">R$ •••••••</span>`;
        }
    }
    
    if (lucroRealizadoElem) lucroRealizadoElem.innerText = formatarMoedaBrasileira(ind.lucroRealizado);
    if (lucroPotencialElem) lucroPotencialElem.innerText = formatarMoedaBrasileira(ind.lucroPotencial);
    if (valorEstoqueElem) valorEstoqueElem.innerText = formatarMoedaBrasileira(ind.valorEstoque);
    
    if (saudeElem && saudeMsg) {
        if (ind.totalCars === 0) {
            saudeElem.innerHTML = '📊 Sem dados';
            saudeMsg.innerText = 'Cadastre veículos para começar';
        } else if (investimento === 0) {
            saudeElem.innerHTML = '⚠️ Defina o investimento';
            saudeMsg.innerText = 'Clique no card de investimento para configurar';
        } else {
            let percentual = ((ind.lucroRealizado - (investimento - ind.valorEstoque)) / investimento) * 100;
            if (ind.saldo >= 0) {
                saudeElem.innerHTML = `✅ Saudável (${percentual.toFixed(1).replace('.', ',')}% de retorno)`;
                saudeMsg.innerText = 'Lucro positivo, negócio rentável';
            } else {
                saudeElem.innerHTML = `⚠️ Atenção (${percentual.toFixed(1).replace('.', ',')}% negativo)`;
                saudeMsg.innerText = 'Prejuízo atual, revise seus preços';
            }
        }
    }
    
    let carsComMargem = cars.filter(c => c && c.compra > 0);
    if (carsComMargem.length > 0 && margemMediaElem && margemBarElem) {
        let margemMedia = carsComMargem.reduce((acc, c) => acc + (((c.venda || 0) - (c.compra || 0)) / (c.compra || 1) * 100), 0) / carsComMargem.length;
        margemMediaElem.innerHTML = margemMedia.toFixed(1).replace('.', ',') + '%';
        margemBarElem.style.width = Math.min(Math.abs(margemMedia), 100) + '%';
    } else if (margemMediaElem && margemBarElem) {
        margemMediaElem.innerHTML = '0,0%';
        margemBarElem.style.width = '0%';
    }
    
    atualizarGraficos();
}

function atualizarGraficos() {
    let disponivel = cars.filter(c => c && c.status === 'Disponível').length;
    let vendido = cars.filter(c => c && c.status === 'Vendido').length;
    let reservado = cars.filter(c => c && c.status === 'Reservado').length;
    
    if (window.statusChart) {
        window.statusChart.data.datasets[0].data = [disponivel, vendido, reservado];
        window.statusChart.update();
    }
    
    if (window.salesChart) {
        window.salesChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
        window.salesChart.update();
    }
}

function sair() {
    Swal.fire({
        title: 'Deseja sair?',
        text: 'Você será redirecionado para a página de login',
        icon: 'question',
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
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

// ===== INICIALIZAÇÃO DOS EVENT LISTENERS =====
function inicializarEventListeners() {
    // Ícone de olho do investimento
    const eyeIconInvestimento = document.getElementById('eyeIconInvestimento');
    if (eyeIconInvestimento) {
        eyeIconInvestimento.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleInvestimentoVisivel();
            return false;
        };
    }
    
    // Ícone de olho do lucro - CORRIGIDO USANDO onclick DIRETO
    const eyeIconLucro = document.getElementById('eyeIconLucro');
    if (eyeIconLucro) {
        console.log('Ícone do lucro encontrado:', eyeIconLucro);
        eyeIconLucro.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clique no olho do lucro detectado!');
            toggleLucroVisivel();
            return false;
        };
    } else {
        console.error('Ícone do lucro não encontrado!');
    }
    
    // Ícone de lápis do investimento
    const editIcon = document.querySelector('.investimento-card .fa-pen');
    if (editIcon) {
        editIcon.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            verificarSenhaInvestimento();
            return false;
        };
    }
    
    // Ícone de informação do lucro
    const infoIcon = document.querySelector('.lucro-card .fa-info-circle');
    if (infoIcon) {
        infoIcon.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            mostrarExplicacaoLucro();
            return false;
        };
    }
}

// ===== INICIALIZAÇÃO =====
window.onload = function() {
    // Inicializar gráfico de vendas
    const salesCanvas = document.getElementById("salesChart");
    if (salesCanvas) {
        const ctx1 = salesCanvas.getContext('2d');
        window.salesChart = new Chart(ctx1, {
            type: "line",
            data: {
                labels: ["Mês 1", "Mês 2", "Mês 3", "Mês 4", "Mês 5", "Mês 6"],
                datasets: [{
                    label: "Vendas",
                    data: [0,0,0,0,0,0],
                    borderColor: "#a855f7",
                    backgroundColor: "rgba(168, 85, 247, 0.1)",
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#a855f7",
                    pointBorderColor: "#fff",
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: { 
                    legend: { 
                        labels: { color: document.body.classList.contains('light-theme') ? '#4b5563' : '#9ca3af' } 
                    } 
                },
                scales: {
                    y: {
                        grid: { color: document.body.classList.contains('light-theme') ? '#e5e7eb' : '#2a2a2a' },
                        ticks: { color: document.body.classList.contains('light-theme') ? '#4b5563' : '#9ca3af' }
                    },
                    x: {
                        grid: { color: document.body.classList.contains('light-theme') ? '#e5e7eb' : '#2a2a2a' },
                        ticks: { color: document.body.classList.contains('light-theme') ? '#4b5563' : '#9ca3af' }
                    }
                }
            }
        });
    }

    // Inicializar gráfico de status
    const statusCanvas = document.getElementById("statusChart");
    if (statusCanvas) {
        const ctx2 = statusCanvas.getContext('2d');
        window.statusChart = new Chart(ctx2, {
            type: "doughnut",
            data: {
                labels: ["Disponíveis", "Vendidos", "Reservados"],
                datasets: [{
                    data: [0,0,0],
                    backgroundColor: ["#10b981", "#ef4444", "#a855f7"],
                    borderColor: document.body.classList.contains('light-theme') ? '#ffffff' : '#111',
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                cutout: "60%",
                plugins: {
                    legend: { 
                        position: "bottom", 
                        labels: { color: document.body.classList.contains('light-theme') ? '#4b5563' : '#9ca3af', font: { size: 12 } } 
                    }
                }
            }
        });
    }
    
    loadTheme();
    carregarDados();
    inicializarEventListeners();
};