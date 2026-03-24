// ===== CONSTANTES =====
const CONFIG = {
    STORAGE_KEY: 'gmRepasses',
    WHATSAPP_NUMBER: '5581981837459',
    WHATSAPP_GROUP_URL: 'https://chat.whatsapp.com/FYvCDjoFpHi6ZmZyIgbuRk',
    INSTAGRAM_URL: 'https://www.instagram.com/gmrepasses_/',
    PLACEHOLDER_IMAGE: 'https://via.placeholder.com/400x300/1a1a1a/444?text=Sem+Imagem',
    SHARE_URL: window.location.href.split('?')[0] // Pega a URL atual automaticamente
};

// ===== ESTADO DA APLICAÇÃO =====
const State = {
    todosVeiculos: [],
    slideAtual: 0,
    isSharedPage: window.location.search.includes('shared=true') || document.referrer !== ''
};

// ===== UTILITÁRIOS =====
const Utils = {
    getSwalConfig() {
        const isLight = document.body.classList.contains('light-theme');
        return {
            background: isLight ? '#ffffff' : '#1a1a1a',
            color: isLight ? '#1f2937' : '#fff'
        };
    },

    formatarMoedaBrasileira(valor) {
        if (!valor || isNaN(valor)) return 'R$ 0';
        return valor.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL', 
            minimumFractionDigits: 0 
        });
    },

    formatarKM(km) {
        if (!km) return 'KM não informado';
        return parseInt(km).toLocaleString('pt-BR') + ' km';
    },

    compararComFIPE(fipe, venda) {
        if (!fipe || fipe === 0 || !venda || venda === 0) {
            return { text: '', class: '' };
        }
        
        const diff = ((venda - fipe) / fipe * 100).toFixed(1);
        
        if (venda > fipe) {
            return { text: `+${diff}% acima FIPE`, class: 'fipe-above' };
        } else if (venda < fipe) {
            return { text: `${diff}% abaixo FIPE`, class: 'fipe-below' };
        } else {
            return { text: 'Igual FIPE', class: 'fipe-equal' };
        }
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    getMensagemCompleta() {
        return `Olá! Confira os melhores veículos da GM Repasses! Acesse o link para ver todo o nosso estoque:\n\n${CONFIG.SHARE_URL}\n\nVeículos com procedência e garantia! Os melhores preços da região! Compartilhe com quem também está procurando um veículo!`;
    }
};

// ===== TEMA =====
const Theme = {
    toggle() {
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
        
        this._atualizarTituloHeader();
    },

    load() {
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
        
        this._atualizarTituloHeader();
    },

    _atualizarTituloHeader() {
        const titleElement = document.querySelector('.header-gradient h1');
        if (titleElement) {
            const isLight = document.body.classList.contains('light-theme');
            titleElement.style.color = isLight ? '#1f2937' : '#fff';
        }
    }
};

// ===== MENU MOBILE =====
const Menu = {
    toggle() {
        document.getElementById('mobileMenu').classList.toggle('open');
        document.getElementById('menuOverlay').classList.toggle('active');
    },

    fechar() {
        document.getElementById('mobileMenu').classList.remove('open');
        document.getElementById('menuOverlay').classList.remove('active');
    },

    init() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.fechar();
            }
        });
    }
};

// ===== TELA CHEIA =====
const TelaCheia = {
    ativar() {
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
    },

    init() {
        document.addEventListener('fullscreenchange', () => this._atualizarIndicador());
        document.addEventListener('webkitfullscreenchange', () => this._atualizarIndicador());
        document.addEventListener('mozfullscreenchange', () => this._atualizarIndicador());
        document.addEventListener('MSFullscreenChange', () => this._atualizarIndicador());
    },

    _atualizarIndicador() {
        const indicator = document.getElementById('fullscreenIndicator');
        if (!document.fullscreenElement && indicator) {
            indicator.classList.remove('visible');
        }
    }
};

// ===== WHATSAPP =====
const WhatsApp = {
    abrirGrupo() {
        window.open(CONFIG.WHATSAPP_GROUP_URL, '_blank');
    },

    interessado(veiculo, preco) {
        const mensagem = `Olá! Tenho interesse no veículo *${veiculo}* anunciado por *${Utils.formatarMoedaBrasileira(preco)}*. Poderia me passar mais informações?`;
        const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }
};

// ===== SAIR =====
const Sair = {
    executar() {
        const isLight = document.body.classList.contains('light-theme');
        
        Swal.fire({
            title: 'Deseja sair?',
            text: 'Você será redirecionado para a página de login',
            icon: 'question',
            background: isLight ? '#ffffff' : '#1a1a1a',
            color: isLight ? '#1f2937' : '#fff',
            showCancelButton: true,
            confirmButtonColor: '#a855f7',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, sair',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'index.html';
            }
        });
    }
};

// ===== COMPARTILHAMENTO =====
const Compartilhamento = {
    getUrl() {
        return CONFIG.SHARE_URL;
    },

    getTitulo() {
        return 'GM Repasses - Estoque de Veículos';
    },

    abrirModal() {
        const modal = document.getElementById('modalCompartilhar');
        const mensagemDiv = document.getElementById('mensagemCompartilhar');
        
        if (mensagemDiv) {
            mensagemDiv.textContent = Utils.getMensagemCompleta();
        }
        
        this._gerarQRCode();
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    fecharModal() {
        const modal = document.getElementById('modalCompartilhar');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    },

    _gerarQRCode() {
        const container = document.getElementById('qrcode');
        container.innerHTML = '';
        
        if (typeof QRCode !== 'undefined') {
            new QRCode(container, {
                text: this.getUrl(),
                width: 150,
                height: 150,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    },

    copiarMensagem() {
        const mensagem = Utils.getMensagemCompleta();
        
        navigator.clipboard.writeText(mensagem).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Mensagem copiada!',
                text: 'A mensagem foi copiada para a área de transferência.',
                timer: 1500,
                showConfirmButton: false,
                ...Utils.getSwalConfig()
            });
        }).catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível copiar a mensagem.',
                ...Utils.getSwalConfig()
            });
        });
    },

    compartilharWhatsApp() {
        const mensagem = Utils.getMensagemCompleta();
        const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        this.fecharModal();
    },

    compartilharInstagram() {
        const mensagem = encodeURIComponent(Utils.getMensagemCompleta());
        const url = `https://www.instagram.com/?text=${mensagem}`;
        window.open(url, '_blank');
        this.fecharModal();
    },

    compartilharFacebook() {
        const url = encodeURIComponent(this.getUrl());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        this.fecharModal();
    },

    compartilharTwitter() {
        const mensagem = encodeURIComponent(this.getTitulo());
        const url = encodeURIComponent(this.getUrl());
        window.open(`https://twitter.com/intent/tweet?text=${mensagem}&url=${url}`, '_blank');
        this.fecharModal();
    },

    compartilharLinkedIn() {
        const url = encodeURIComponent(this.getUrl());
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        this.fecharModal();
    },

    compartilharTelegram() {
        const mensagem = encodeURIComponent(Utils.getMensagemCompleta());
        window.open(`https://t.me/share/url?url=${encodeURIComponent(this.getUrl())}&text=${mensagem}`, '_blank');
        this.fecharModal();
    },

    compartilharEmail() {
        const assunto = encodeURIComponent(this.getTitulo());
        const corpo = encodeURIComponent(Utils.getMensagemCompleta());
        window.open(`mailto:?subject=${assunto}&body=${corpo}`, '_blank');
        this.fecharModal();
    }
};

// ===== GALERIA =====
const Galeria = {
    abrir(fotos, titulo) {
        if (!fotos || fotos.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sem fotos',
                text: 'Este veículo não possui fotos cadastradas.',
                ...Utils.getSwalConfig(),
                confirmButtonColor: '#a855f7'
            });
            return;
        }

        let currentIndex = 0;
        const isLight = document.body.classList.contains('light-theme');

        const showImage = (index) => {
            const foto = fotos[index];
            Swal.fire({
                imageUrl: foto,
                imageAlt: titulo,
                title: `${index + 1}/${fotos.length}`,
                background: isLight ? '#ffffff' : '#1a1a1a',
                color: isLight ? '#1f2937' : '#fff',
                showConfirmButton: false,
                showCloseButton: true,
                width: '90%',
                customClass: {
                    image: 'max-h-[80vh] object-contain',
                    closeButton: isLight ? 'text-gray-400 hover:text-gray-600' : 'text-gray-400 hover:text-white'
                },
                didOpen: () => this._adicionarNavegacao(fotos, index, showImage)
            });
        };

        showImage(currentIndex);
    },

    _adicionarNavegacao(fotos, currentIndex, showImageCallback) {
        const container = document.querySelector('.swal2-popup');
        if (!container) return;
        
        const isLight = document.body.classList.contains('light-theme');
        const setaColor = isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)';
        
        const leftArrow = this._criarSeta('◀', 'left', setaColor, () => {
            currentIndex = (currentIndex - 1 + fotos.length) % fotos.length;
            Swal.close();
            showImageCallback(currentIndex);
        });
        
        const rightArrow = this._criarSeta('▶', 'right', setaColor, () => {
            currentIndex = (currentIndex + 1) % fotos.length;
            Swal.close();
            showImageCallback(currentIndex);
        });
        
        container.appendChild(leftArrow);
        container.appendChild(rightArrow);
        
        this._adicionarControleTeclado(fotos, currentIndex, showImageCallback);
    },

    _criarSeta(symbol, direction, color, callback) {
        const arrow = document.createElement('div');
        arrow.innerHTML = symbol;
        arrow.style.cssText = `
            position: absolute;
            ${direction}: 20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 40px;
            color: ${color};
            cursor: pointer;
            z-index: 1000;
            transition: color 0.2s;
            user-select: none;
        `;
        arrow.onmouseover = () => arrow.style.color = '#a855f7';
        arrow.onmouseout = () => arrow.style.color = color;
        arrow.onclick = callback;
        return arrow;
    },

    _adicionarControleTeclado(fotos, currentIndex, showImageCallback) {
        const keyHandler = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + fotos.length) % fotos.length;
                Swal.close();
                showImageCallback(currentIndex);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % fotos.length;
                Swal.close();
                showImageCallback(currentIndex);
            } else if (e.key === 'Escape') {
                Swal.close();
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        
        const originalClose = Swal.close;
        Swal.close = function() {
            document.removeEventListener('keydown', keyHandler);
            originalClose();
        };
    }
};

// ===== GERENCIADOR DE VEÍCULOS =====
const VeiculosManager = {
    dados: [],

    carregar() {
        const dadosSalvos = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (dadosSalvos) {
            try {
                const dados = JSON.parse(dadosSalvos);
                this.dados = (dados.cars || []).filter(c => c.status !== 'Vendido');
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
                this.dados = [];
            }
        }
        State.todosVeiculos = this.dados;
        UI.atualizarResultadoBusca(this.dados.length);
        UI.renderizarVeiculos(this.dados);
    },

    filtrar(termo) {
        if (!termo) {
            UI.atualizarResultadoBusca(this.dados.length);
            UI.renderizarVeiculos(this.dados);
            return this.dados;
        }
        
        const filtrados = this.dados.filter(c => {
            return (c.marca && c.marca.toLowerCase().includes(termo)) ||
                   (c.modelo && c.modelo.toLowerCase().includes(termo)) ||
                   (c.ano && c.ano.toString().includes(termo)) ||
                   (c.cor && c.cor.toLowerCase().includes(termo)) ||
                   (c.combustivel && c.combustivel.toLowerCase().includes(termo));
        });
        
        UI.atualizarResultadoBusca(filtrados.length, termo);
        UI.renderizarVeiculos(filtrados);
        return filtrados;
    }
};

// ===== INTERFACE DO USUÁRIO =====
const UI = {
    renderizarVeiculos(veiculos) {
        const grid = document.getElementById('veiculosGrid');
        
        if (!veiculos || veiculos.length === 0) {
            grid.innerHTML = this._getEmptyStateHTML();
            return;
        }
        
        let html = '';
        for (let i = 0; i < veiculos.length; i++) {
            html += this._renderizarCard(veiculos[i]);
        }
        
        grid.innerHTML = html;
    },

    _renderizarCard(veiculo) {
        const foto = (veiculo.fotos && veiculo.fotos.length > 0) 
            ? veiculo.fotos[0] 
            : CONFIG.PLACEHOLDER_IMAGE;
        
        const statusClass = veiculo.status === 'Disponível' ? 'status-disponivel' : 'status-reservado';
        const statusIcon = veiculo.status === 'Disponível' ? 'fa-check-circle' : 'fa-clock';
        
        const fipeComp = Utils.compararComFIPE(veiculo.fipe, veiculo.venda);
        const fotosJson = JSON.stringify(veiculo.fotos || []);
        const tituloVeiculo = `${veiculo.marca || ''} ${veiculo.modelo || ''} ${veiculo.ano || ''}`.trim();
        
        return `
            <div class="vehicle-card">
                <div class="image-container">
                    <img src="${foto}" class="vehicle-image" alt="${veiculo.marca} ${veiculo.modelo}" 
                         onclick='Galeria.abrir(${fotosJson}, "${Utils.escapeHtml(tituloVeiculo)}")'
                         onerror="this.src='${CONFIG.PLACEHOLDER_IMAGE}'">
                    <div class="price-tag">${Utils.formatarMoedaBrasileira(veiculo.venda)}</div>
                    <div class="status-badge ${statusClass}">
                        <i class="fas ${statusIcon} mr-1"></i> ${veiculo.status}
                    </div>
                </div>
                
                <div class="vehicle-info">
                    <h3 class="vehicle-title">${veiculo.marca || ''} ${veiculo.modelo || ''}</h3>
                    
                    <div class="vehicle-subtitle">
                        <span><i class="fas fa-calendar"></i> ${veiculo.ano || '-'}</span>
                        <span><i class="fas fa-palette"></i> ${veiculo.cor || '-'}</span>
                        <span><i class="fas fa-gas-pump"></i> ${veiculo.combustivel || '-'}</span>
                    </div>
                    
                    <div class="vehicle-details">
                        <div class="detail-item">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>${Utils.formatarKM(veiculo.km)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-id-card"></i>
                            <span>${veiculo.placa || 'Placa não informada'}</span>
                        </div>
                    </div>
                    
                    <div class="extra-info">
                        ${veiculo.fipe ? `
                        <div class="extra-item">
                            <i class="fas fa-chart-line"></i>
                            <span class="label">FIPE:</span>
                            <span class="value fipe-value">${Utils.formatarMoedaBrasileira(veiculo.fipe)}</span>
                            ${fipeComp.text ? `<span class="fipe-comparison ${fipeComp.class}">${fipeComp.text}</span>` : ''}
                        </div>
                        ` : ''}
                        
                        ${veiculo.observacoes ? `
                        <div class="observation-note">
                            <i class="fas fa-comment"></i>
                            <span>${veiculo.observacoes}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <button class="contact-button" onclick="WhatsApp.interessado('${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}', ${veiculo.venda})">
                        <i class="fab fa-whatsapp"></i>
                        Tenho interesse
                    </button>
                </div>
            </div>
        `;
    },

    _getEmptyStateHTML() {
        return `
            <div class="no-results">
                <i class="fas fa-car"></i>
                <h3 class="text-lg md:text-xl font-bold text-gray-400 mb-2">Nenhum veículo disponível</h3>
                <p class="text-sm md:text-base text-gray-600">No momento não temos veículos em estoque.</p>
                <p class="text-sm md:text-base text-gray-600 mt-3 md:mt-4">Entre em contato pelo WhatsApp para mais informações.</p>
            </div>
        `;
    },

    atualizarResultadoBusca(quantidade, termo = '') {
        const resultadoEl = document.getElementById('resultadoBusca');
        if (quantidade === 0) {
            resultadoEl.innerHTML = '<i class="fas fa-search mr-1"></i> Nenhum veículo encontrado';
        } else {
            resultadoEl.innerHTML = `
                <i class="fas fa-car mr-1"></i> 
                ${quantidade} ${quantidade === 1 ? 'veículo' : 'veículos'} ${termo ? `para "<span class="text-purple-400">${Utils.escapeHtml(termo)}</span>"` : 'disponível(eis)'}
            `;
        }
    },

    mostrarLoading() {
        document.getElementById('veiculosGrid').innerHTML = `
            <div class="loading">
                <i class="fas fa-circle-notch fa-spin"></i>
                <p class="mt-2 text-sm md:text-base">Carregando veículos...</p>
            </div>
        `;
    }
};

// ===== FILTRO =====
const Filtro = {
    aplicar() {
        const termo = document.getElementById('buscaCliente').value.toLowerCase().trim();
        VeiculosManager.filtrar(termo);
    }
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    Theme.load();
    Menu.init();
    TelaCheia.init();
    
    UI.mostrarLoading();
    VeiculosManager.carregar();
    
    window.addEventListener('storage', (e) => {
        if (e.key === CONFIG.STORAGE_KEY) {
            VeiculosManager.carregar();
        }
    });
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modalCompartilhar');
        if (e.target === modal) {
            Compartilhamento.fecharModal();
        }
    });
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            Compartilhamento.fecharModal();
        }
    });
});