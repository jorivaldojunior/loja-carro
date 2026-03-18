// ===== CONFIGURAÇÕES =====
const ITENS_POR_PAGINA = window.innerWidth < 768 ? 6 : 9;
let cars = [];
let carsFiltrados = [];
let filtroAtual = {
    texto: "",
    status: "todos",
    ordenacao: "recentes",
};
let paginaAtual = 1;
let totalPaginas = 1;

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
    
    // Atualizar título do header
    const titleElement = document.querySelector('.header-gradient h1 span');
    if (titleElement) {
        titleElement.style.color = body.classList.contains('light-theme') ? '#1f2937' : '#fff';
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
    const indicator = document.getElementById("fullscreenIndicator");

    if (elemento.requestFullscreen) {
        elemento.requestFullscreen();
    } else if (elemento.webkitRequestFullscreen) {
        elemento.webkitRequestFullscreen();
    } else if (elemento.msRequestFullscreen) {
        elemento.msRequestFullscreen();
    }

    if (indicator) {
        indicator.classList.add("visible");
    }
}

document.addEventListener("fullscreenchange", atualizarIndicadorFullscreen);
document.addEventListener("webkitfullscreenchange", atualizarIndicadorFullscreen);
document.addEventListener("mozfullscreenchange", atualizarIndicadorFullscreen);
document.addEventListener("MSFullscreenChange", atualizarIndicadorFullscreen);

function atualizarIndicadorFullscreen() {
    const indicator = document.getElementById("fullscreenIndicator");
    if (!document.fullscreenElement) {
        if (indicator) {
            indicator.classList.remove("visible");
        }
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function () {
    loadTheme();
    carregarDados();
});

function carregarDados() {
    document.getElementById("loadingSkeleton").classList.remove("hidden");
    document.getElementById("estoqueCards").classList.add("hidden");

    setTimeout(() => {
        try {
            const dadosSalvos = localStorage.getItem("gmRepasses");
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                cars = dados.cars || [];
            } else {
                cars = [];
            }

            aplicarFiltros();
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            mostrarErro("Erro ao carregar dados. Tente recarregar a página.");
        }
    }, 300);
}

// ===== FUNÇÕES DE FORMATAÇÃO =====
function formatarMoedaBrasileira(valor) {
    if (valor === null || valor === undefined || isNaN(valor)) {
        return "R$ 0,00";
    }
    valor = Number(valor);
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatarKM(km) {
    if (!km) return "KM não informado";
    let numKM = parseInt(km);
    if (isNaN(numKM)) return km;
    return numKM.toLocaleString("pt-BR") + " km";
}

// ===== FUNÇÕES DE FILTRO E ORDENAÇÃO =====
function aplicarFiltros() {
    const termoBusca = document
        .getElementById("filtroInteligente")
        .value.toLowerCase();
    filtroAtual.texto = termoBusca;

    let filtrados = cars.filter((c) => {
        if (!c) return false;

        const buscaStr = `
            ${c.marca || ""} 
            ${c.modelo || ""} 
            ${c.ano || ""} 
            ${c.cor || ""} 
            ${c.placa || ""} 
            ${c.status || ""}
        `.toLowerCase();

        return buscaStr.includes(termoBusca);
    });

    if (filtroAtual.status !== "todos") {
        const statusMap = {
            disponivel: "Disponível",
            reservado: "Reservado",
            vendido: "Vendido",
        };
        const statusBusca = statusMap[filtroAtual.status];
        if (statusBusca) {
            filtrados = filtrados.filter((c) => c.status === statusBusca);
        }
    }

    filtrados = ordenarVeiculos(filtrados, filtroAtual.ordenacao);

    carsFiltrados = filtrados;
    paginaAtual = 1;
    renderizarEstoque();
}

function filtrarPorStatus(status) {
    filtroAtual.status = status;

    document
        .querySelectorAll(".filter-chip")
        .forEach((chip) => chip.classList.remove("active"));
    document
        .getElementById(
            `filtro${status.charAt(0).toUpperCase() + status.slice(1)}`,
        )
        ?.classList.add("active");

    aplicarFiltros();
}

function ordenarPor(tipo) {
    filtroAtual.ordenacao = tipo;

    document
        .querySelectorAll(".filter-chip")
        .forEach((chip) => chip.classList.remove("active"));
    const mapaIds = {
        recentes: "ordemRecentes",
        menorPreco: "ordemMenorPreco",
        maiorPreco: "ordemMaiorPreco",
    };
    document.getElementById(mapaIds[tipo])?.classList.add("active");

    aplicarFiltros();
}

function ordenarVeiculos(veiculos, tipo) {
    const veiculosCopy = [...veiculos];

    switch (tipo) {
        case "recentes":
            return veiculosCopy.sort((a, b) => {
                return new Date(b.dataCompra || 0) - new Date(a.dataCompra || 0);
            });

        case "menorPreco":
            return veiculosCopy.sort((a, b) => (a.venda || 0) - (b.venda || 0));

        case "maiorPreco":
            return veiculosCopy.sort((a, b) => (b.venda || 0) - (a.venda || 0));

        default:
            return veiculosCopy;
    }
}

// ===== RENDERIZAÇÃO =====
function renderizarEstoque() {
    totalPaginas = Math.ceil(carsFiltrados.length / ITENS_POR_PAGINA) || 1;

    const statsEl = document.getElementById("filtroStats");
    if (statsEl) {
        if (carsFiltrados.length === 0) {
            statsEl.innerHTML = '<i class="fas fa-search mr-1"></i> Nenhum veículo encontrado';
        } else {
            statsEl.innerHTML = `
                <i class="fas fa-car mr-1"></i> 
                ${carsFiltrados.length} ${carsFiltrados.length === 1 ? "veículo encontrado" : "veículos encontrados"}
                ${filtroAtual.texto ? `para "<span class="text-purple-400">${filtroAtual.texto}</span>"` : ""}
            `;
        }
    }

    document.getElementById("loadingSkeleton").classList.add("hidden");
    const cardsContainer = document.getElementById("estoqueCards");
    cardsContainer.classList.remove("hidden");

    if (carsFiltrados.length === 0) {
        cardsContainer.innerHTML = `
            <div class="col-span-1 sm:col-span-2 lg:col-span-3">
                <div class="empty-state">
                    <i class="fas fa-car"></i>
                    <h3>Nenhum veículo encontrado</h3>
                    <p>${filtroAtual.texto ? `Nenhum resultado para "${filtroAtual.texto}"` : "Comece cadastrando seu primeiro veículo"}</p>
                    <button onclick="abrirCadastro()" class="btn-primary mt-4">
                        <i class="fas fa-plus-circle"></i>
                        Cadastrar Veículo
                    </button>
                </div>
            </div>
        `;
        document.getElementById("paginacao").classList.add("hidden");
        return;
    }

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = Math.min(inicio + ITENS_POR_PAGINA, carsFiltrados.length);
    const carsPagina = carsFiltrados.slice(inicio, fim);

    let html = "";
    for (let i = 0; i < carsPagina.length; i++) {
        const c = carsPagina[i];
        if (!c) continue;

        const compra = c.compra || 0;
        const venda = c.venda || 0;
        const lucro = venda - compra;
        const lucroClass = lucro >= 0 ? "text-green-400" : "text-red-400";

        const primeiraFoto = c.fotos && c.fotos.length > 0
            ? c.fotos[0]
            : "https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Sem+Foto";

        const qtdFotos = c.fotos ? c.fotos.length : 0;

        const statusClass = {
            Disponível: "status-disponivel",
            Vendido: "status-vendido",
            Reservado: "status-reservado",
        }[c.status] || "status-disponivel";

        html += `
            <div class="card vehicle-card p-3 sm:p-4" onclick="abrirPaginaVeiculo(${c.id})">
                <div class="vehicle-image-container">
                    <img src="${primeiraFoto}" 
                         class="vehicle-image" 
                         alt="${c.marca} ${c.modelo}"
                         onerror="this.src='https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Sem+Foto'">
                    
                    <span class="status-badge ${statusClass}">
                        ${c.status || "Disponível"}
                    </span>
                    
                    <div class="image-overlay">
                        <span class="photo-count">
                            <i class="fas fa-camera"></i>
                            ${qtdFotos} ${qtdFotos === 1 ? "foto" : "fotos"}
                        </span>
                    </div>
                </div>
                
                <h3 class="vehicle-title text-lg sm:text-xl">${c.marca || ""} ${c.modelo || ""}</h3>
                
                <div class="vehicle-subtitle text-xs sm:text-sm">
                    <span><i class="far fa-calendar"></i> ${c.ano || "Ano não informado"}</span>
                    <i class="fas fa-circle" style="font-size: 4px;"></i>
                    <span><i class="fas fa-palette"></i> ${c.cor || "Cor não informada"}</span>
                </div>
                
                <div class="space-y-1 sm:space-y-2">
                    <div class="info-row py-1 sm:py-2">
                        <span class="info-label text-xs sm:text-sm"><i class="fas fa-tachometer-alt"></i> Quilometragem</span>
                        <span class="info-value text-xs sm:text-sm">${formatarKM(c.km)}</span>
                    </div>
                    
                    <div class="info-row py-1 sm:py-2">
                        <span class="info-label text-xs sm:text-sm"><i class="fas fa-tag"></i> Preço de Venda</span>
                        <span class="info-value text-purple-400 font-bold text-xs sm:text-sm">${formatarMoedaBrasileira(venda)}</span>
                    </div>
                    
                    <div class="info-row py-1 sm:py-2">
                        <span class="info-label text-xs sm:text-sm"><i class="fas fa-chart-line"></i> Lucro Estimado</span>
                        <span class="info-value ${lucroClass} font-bold text-xs sm:text-sm">${formatarMoedaBrasileira(lucro)}</span>
                    </div>
                    
                    <div class="info-row py-1 sm:py-2">
                        <span class="info-label text-xs sm:text-sm"><i class="fas fa-barcode"></i> Placa</span>
                        <span class="info-value font-mono text-xs sm:text-sm">${c.placa || "N/I"}</span>
                    </div>
                </div>
            </div>
        `;
    }

    cardsContainer.innerHTML = html;
    renderizarPaginacao();
}

function renderizarPaginacao() {
    if (totalPaginas <= 1) {
        document.getElementById("paginacao").classList.add("hidden");
        return;
    }

    document.getElementById("paginacao").classList.remove("hidden");

    document
        .getElementById("prevPage")
        .classList.toggle("disabled", paginaAtual === 1);
    document
        .getElementById("nextPage")
        .classList.toggle("disabled", paginaAtual === totalPaginas);

    let pageNumbers = "";
    const maxBotoes = window.innerWidth < 768 ? 3 : 5;
    let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
    let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

    if (fim - inicio + 1 < maxBotoes) {
        inicio = Math.max(1, fim - maxBotoes + 1);
    }

    for (let i = inicio; i <= fim; i++) {
        pageNumbers += `
            <div class="page-btn ${i === paginaAtual ? "active" : ""}" onclick="irParaPagina(${i})">
                ${i}
            </div>
        `;
    }

    document.getElementById("pageNumbers").innerHTML = pageNumbers;
}

function mudarPagina(direcao) {
    if (direcao === "prev" && paginaAtual > 1) {
        paginaAtual--;
        renderizarEstoque();
    } else if (direcao === "next" && paginaAtual < totalPaginas) {
        paginaAtual++;
        renderizarEstoque();
    }
}

function irParaPagina(pagina) {
    if (pagina >= 1 && pagina <= totalPaginas && pagina !== paginaAtual) {
        paginaAtual = pagina;
        renderizarEstoque();
    }
}

// ===== FUNÇÕES DE NAVEGAÇÃO =====
function voltarDashboard() {
    window.location.href = "principal.html";
}

function abrirCadastro() {
    window.location.href = "cadastro-veiculo.html";
}

function abrirPaginaVeiculo(id) {
    localStorage.setItem("veiculoId", id);
    window.location.href = "detalhes_veiculos.html";
}

function recarregarDados() {
    carregarDados();
    Swal.fire({
        icon: "success",
        title: "Dados atualizados!",
        text: "O estoque foi recarregado com sucesso.",
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
        timer: 1500,
        showConfirmButton: false,
    });
}

// ===== FUNÇÕES DE EXPORTAÇÃO =====
function exportarDados() {
    document.getElementById("modalExportar").classList.remove("hidden");
    document.getElementById("modalExportar").classList.add("flex");
}

function fecharModalExportar() {
    document.getElementById("modalExportar").classList.add("hidden");
    document.getElementById("modalExportar").classList.remove("flex");
}

function exportarCSV() {
    if (carsFiltrados.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Nada para exportar",
            text: "Não há veículos para exportar.",
            background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
            color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
        });
        return;
    }

    const cabecalho = [
        "Marca",
        "Modelo",
        "Ano",
        "Cor",
        "Placa",
        "KM",
        "Compra",
        "Venda",
        "Status",
        "Lucro",
    ];

    const linhas = carsFiltrados.map((c) => [
        c.marca || "",
        c.modelo || "",
        c.ano || "",
        c.cor || "",
        c.placa || "",
        c.km || "",
        c.compra || 0,
        c.venda || 0,
        c.status || "Disponível",
        (c.venda || 0) - (c.compra || 0),
    ]);

    const csvContent = [
        cabecalho.join(","),
        ...linhas.map((l) => l.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `estoque_gm_repasses_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    fecharModalExportar();

    Swal.fire({
        icon: "success",
        title: "Exportado com sucesso!",
        text: `CSV com ${carsFiltrados.length} veículos gerado.`,
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
        timer: 2000,
        showConfirmButton: false,
    });
}

function exportarJSON() {
    const jsonStr = JSON.stringify(carsFiltrados, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `estoque_gm_repasses_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    fecharModalExportar();
}

function exportarPDF() {
    Swal.fire({
        icon: "info",
        title: "Exportação PDF",
        html: `
            <p class="mb-4">A exportação em PDF está em desenvolvimento.</p>
            <p class="text-sm text-gray-400">Enquanto isso, utilize CSV para Excel ou JSON.</p>
        `,
        background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
        color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff',
        confirmButtonColor: "#a855f7",
    });
    fecharModalExportar();
}

function mostrarErro(mensagem) {
    document.getElementById("loadingSkeleton").classList.add("hidden");
    document.getElementById("estoqueCards").classList.remove("hidden");

    document.getElementById("estoqueCards").innerHTML = `
        <div class="col-span-1 sm:col-span-2 lg:col-span-3">
            <div class="empty-state" style="border-color: #ef4444;">
                <i class="fas fa-exclamation-triangle text-red-500"></i>
                <h3 class="text-red-400">Ops! Algo deu errado</h3>
                <p class="text-gray-400">${mensagem}</p>
                <button onclick="recarregarDados()" class="btn-primary mt-4">
                    <i class="fas fa-sync-alt"></i>
                    Tentar Novamente
                </button>
            </div>
        </div>
    `;
}

// ===== EVENTOS DE REDIMENSIONAMENTO =====
window.addEventListener('resize', function() {
    if (carsFiltrados.length > 0) {
        renderizarEstoque();
    }
});