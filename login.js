// ===== CONFIGURAÇÕES =====
const imagens = [
  "./image/FUNDO 1.jpg", 
  "./image/FUNDO 3.avif",
  "./image/FUNDO 4.avif"
];

let slideIndex = 0;
let slideInterval;
const slideshow = document.getElementById("slideshow");
const indicatorsContainer = document.getElementById("indicators");

// ===== FUNÇÃO PARA ABRIR ESTOQUE PÚBLICO =====
function abrirEstoquePublico() {
  window.location.href = "estoque-publico.html";
}

// ===== FUNÇÕES DE TEMA =====
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const icon = themeToggle.querySelector('i');
  
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    localStorage.setItem('theme', 'dark');
  }
  
  atualizarIndicadores(slideIndex);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeToggle = document.getElementById('themeToggle');
  const icon = themeToggle.querySelector('i');
  
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    icon.classList.add('fa-moon');
    icon.classList.remove('fa-sun');
  }
}

// ===== FUNÇÕES DO SLIDESHOW =====
function criarSlideshow() {
  slideshow.innerHTML = '';
  indicatorsContainer.innerHTML = '';

  imagens.forEach((img, index) => {
    // Criar slide
    const slide = document.createElement("div");
    slide.className = `slide ${index === 0 ? "active" : ""}`;
    slide.style.backgroundImage = `url('${img}')`;
    slideshow.appendChild(slide);

    // Criar indicador
    const indicator = document.createElement("div");
    indicator.className = `indicator ${index === 0 ? "active" : ""}`;
    indicator.setAttribute("onclick", `irParaSlide(${index})`);
    indicatorsContainer.appendChild(indicator);
  });
}

function irParaSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const indicators = document.querySelectorAll(".indicator");
  
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
  
  indicators.forEach((indicator) => indicator.classList.remove("active"));
  indicators[index].classList.add("active");
  
  slideIndex = index;
}

function trocarSlide() {
  const slides = document.querySelectorAll(".slide");
  const indicators = document.querySelectorAll(".indicator");
  
  if (slides.length === 0) return;
  
  slides.forEach((slide) => slide.classList.remove("active"));
  indicators.forEach((indicator) => indicator.classList.remove("active"));
  
  slideIndex = (slideIndex + 1) % slides.length;
  
  slides[slideIndex].classList.add("active");
  indicators[slideIndex].classList.add("active");
}

function iniciarSlideshow() {
  criarSlideshow();
  
  if (slideInterval) {
    clearInterval(slideInterval);
  }
  
  slideInterval = setInterval(trocarSlide, 3000);
}

function atualizarIndicadores(index) {
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((indicator, i) => {
    if (i === index) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
}

// ===== FUNÇÕES DE LOGIN =====
function limparCampos() {
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function login() {
  let usuario = document.getElementById("username").value;
  let senha = document.getElementById("password").value;

  if (usuario === "" || senha === "") {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: "Campos vazios",
      text: "Preencha usuário e senha",
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
      color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff'
    });
    return;
  }

  if (usuario === "ninho" && senha === "1234") {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Login realizado!",
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
      color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff'
    }).then(() => {
      limparCampos();
      window.location.href = "principal.html";
    });
  } else {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Erro no login",
      text: "Usuário ou senha incorretos",
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      background: document.body.classList.contains('light-theme') ? '#ffffff' : '#1a1a1a',
      color: document.body.classList.contains('light-theme') ? '#1f2937' : '#fff'
    });
    limparCampos();
  }
}

// ===== FUNÇÃO DE TELA CHEIA =====
function ativarTelaCheia() {
  const elemento = document.documentElement;
  if (elemento.requestFullscreen) {
    elemento.requestFullscreen();
  } else if (elemento.webkitRequestFullscreen) {
    elemento.webkitRequestFullscreen();
  } else if (elemento.msRequestFullscreen) {
    elemento.msRequestFullscreen();
  }
}

// ===== INICIALIZAÇÃO =====
window.onload = function () {
  loadTheme();
  iniciarSlideshow();
};