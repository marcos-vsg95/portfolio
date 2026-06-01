import carregarAPI from "./carregarAPI";

const botao = document.getElementById('botao-tema');
const body = document.body;

// Persistência do tema
const temasalvo = localStorage.getItem('tema');
temaEscuro(temasalvo === 'escuro');

// Função para alternar entre tema claro e escuro
function temaEscuro(tipo) {
  if (tipo == true) {
    body.classList.add('escuro');
    botao.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    body.classList.remove('escuro');
    botao.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

botao.addEventListener('click', () => {
  const isescuro = body.classList.toggle('escuro');
  temaEscuro(isescuro);
  localStorage.setItem('tema', isescuro ? 'escuro' : 'claro');
});

// Scroll suave para links de navegação
const navLinks = document.querySelectorAll('#menu ul a.link');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Usando API para colocar os projetos
const divProjetos = document.querySelector('#projetos-conteiner');
async function executarAPI() {
    const repos = await carregarAPI();

    const html = repos
    .filter(repo => 
      !repo.fork &&
      repo.name !== "marcos-vsg95"
    )
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map(repo => criaProjetoHTML(repo))
    .join("");

    divProjetos.innerHTML = html;
}

function criaProjetoHTML(repo){
  const basePath = window.location.pathname.includes("portfolio")
  ? "/portfolio/"
  : "/";
  const imagem = `${basePath}src/assets/img/${repo.name}.jpg`;
  const fallback = `${basePath}src/assets/img/default.jpg`;
  return `
    <div class="projeto">
      <img src="${imagem}" class="foto" alt="Projeto ${repo.name}" onerror="this.onerror=null; this.src='${fallback}'">

      <div class="projeto-info">
        <h2 class="titulo">${repo.name}</h2>

        <p>${repo.description || "Sem descrição disponível."}</p>

        <details class="descricao">
          <summary>Saiba mais...</summary>
          <p>Linguagem principal: ${repo.language || "Não especificada"}</p>
        </details>

        <a href="${repo.homepage || repo.html_url}" target="_blank">
          🔗 Ver projeto
        </a>
      </div>
    </div>
  `;
}

executarAPI();
