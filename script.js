// ==================== VARIÁVEIS GLOBAIS ====================
let carrinho = [];
let modoLogin = 'login';
let usuarioLogado = null;

// ==================== MENU MOBILE & SCROLL SPY ====================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.link-header');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fecha o menu mobile ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Destaca o link ativo conforme a rolagem da página
window.addEventListener('scroll', () => {
    let atual = '';
    const secoes = document.querySelectorAll('main, section[id]');

    secoes.forEach(secao => {
        const topoSecao = secao.offsetTop - 150;
        if (window.scrollY >= topoSecao) {
            atual = secao.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${atual}`) {
            link.classList.add('active');
        }
    });
});

// ==================== FILTRO DE PRODUTOS ====================
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('#produtos-grid .card-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filtro = btn.getAttribute('data-filter');

        productCards.forEach(card => {
            const categoria = card.getAttribute('data-category');
            if (filtro === 'todos' || categoria === filtro) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ==================== CARRINHO DE COMPRAS ====================
function adicionarCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinhoUI();
    mostrarToast(`✅ "${nome}" adicionado ao carrinho!`);
}

function removerCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
    const countSpan = document.getElementById('cart-count');
    const listaDiv = document.getElementById('carrinho-itens');
    const totalSpan = document.getElementById('carrinho-total');

    countSpan.textContent = carrinho.length;

    if (carrinho.length === 0) {
        listaDiv.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
        totalSpan.textContent = 'R$ 0,00';
        return;
    }

    let html = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        html += `
            <div class="carrinho-item">
                <div>
                    <strong>${item.nome}</strong><br>
                    <span>R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="btn-remover" onclick="removerCarrinho(${index})">Remover</button>
            </div>
        `;
    });

    listaDiv.innerHTML = html;
    totalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

document.getElementById('open-cart-btn').addEventListener('click', () => {
    document.getElementById('modal-carrinho').classList.add('open');
});

function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarToast('⚠️ Adicione itens ao carrinho antes de finalizar.');
        return;
    }
    carrinho = [];
    atualizarCarrinhoUI();
    fecharModais();
    mostrarToast('🎉 Pedido realizado com sucesso! Obrigado pela preferência.');
}

// ==================== AGENDAMENTO DE SERVIÇOS ====================
function abrirAgendamento(servicoSelecionado) {
    const select = document.getElementById('agendamento-servico');
    if (servicoSelecionado) {
        select.value = servicoSelecionado;
    }
    // Define data mínima como hoje
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('agendamento-data').setAttribute('min', hoje);

    document.getElementById('modal-agendamento').classList.add('open');
}

document.getElementById('form-agendamento').addEventListener('submit', (e) => {
    e.preventDefault();
    const servico = document.getElementById('agendamento-servico').value;
    const pet = document.getElementById('agendamento-pet').value;
    const data = document.getElementById('agendamento-data').value;
    const hora = document.getElementById('agendamento-hora').value;

    fecharModais();
    e.target.reset();
    mostrarToast(`🐾 Agendado: ${servico} para ${pet} em ${data} às ${hora}!`);
});

// ==================== LOGIN E CADASTRO (BOTÃO ENTRAR) ====================
const openLoginBtn = document.getElementById('open-login-btn');

openLoginBtn.addEventListener('click', () => {
    if (usuarioLogado) {
        usuarioLogado = null;
        openLoginBtn.textContent = 'Entrar';
        mostrarToast('👋 Você saiu da sua conta.');
    } else {
        document.getElementById('modal-login').classList.add('open');
    }
});

function alternarAbaLogin(modo) {
    modoLogin = modo;
    const tabLogin = document.getElementById('tab-login');
    const tabCadastro = document.getElementById('tab-cadastro');
    const campoNome = document.getElementById('campo-nome-cadastro');
    const titulo = document.getElementById('login-titulo');
    const btnSubmit = document.getElementById('btn-submit-login');

    if (modo === 'cadastro') {
        tabCadastro.classList.add('active');
        tabLogin.classList.remove('active');
        campoNome.style.display = 'block';
        titulo.textContent = 'Crie sua conta no Kaio Pet';
        btnSubmit.textContent = 'Cadastrar';
    } else {
        tabLogin.classList.add('active');
        tabCadastro.classList.remove('active');
        campoNome.style.display = 'none';
        titulo.textContent = 'Bem-vindo de volta!';
        btnSubmit.textContent = 'Entrar';
    }
}

document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const nomeInput = document.getElementById('login-nome').value;

    const nomeExibicao = (modoLogin === 'cadastro' && nomeInput.trim() !== '')
        ? nomeInput.split(' ')[0]
        : email.split('@')[0];

    usuarioLogado = nomeExibicao;
    openLoginBtn.textContent = `Olá, ${usuarioLogado} (Sair)`;

    fecharModais();
    e.target.reset();
    mostrarToast(`💜 Bem-vindo(a), ${usuarioLogado}!`);
});

// ==================== FORMULÁRIO DE CONTATO ====================
document.getElementById('form-contato').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('contato-nome').value;
    e.target.reset();
    mostrarToast(`📩 Obrigado, ${nome}! Recebemos sua mensagem e responderemos em breve.`);
});

// ==================== UTILITÁRIOS (MODAIS & TOAST) ====================
function fecharModais() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('open');
    });
}

// Fecha modal ao clicar fora da caixa branca
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            fecharModais();
        }
    });
});

function mostrarToast(mensagem) {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}
