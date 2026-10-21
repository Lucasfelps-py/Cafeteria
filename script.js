
const lista = [
  { nome: "café expresso", tipo: "cafes", preco: 6,
    imagem: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400" },
  { nome: "cappuccino", tipo: "cafes", preco: 12,
    imagem: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400" },
  { nome: "café gelado", tipo: "gelados", preco: 14,
    imagem: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400" },
  { nome: "brownie", tipo: "doces", preco: 9,
    imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400" },
  { nome: "cheesecake", tipo: "doces", preco: 14,
    imagem: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400" },
  { nome: "latte", tipo: "cafes", preco: 13,
    imagem: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400" }
];

const produtos = document.getElementById("produtos");
const busca = document.getElementById("busca");
const carrinho = document.getElementById("carrinho");
const itens = document.getElementById("itens");

let pedido = [];
let categoria = "todos";

const dinheiro = valor =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function mostrarProdutos() {
  const encontrados = lista.filter(p =>
    (categoria === "todos" || p.tipo === categoria) &&
    p.nome.includes(busca.value.toLowerCase())
  );

  produtos.innerHTML = encontrados.map(p => `
    <article class="produto">
      <img src="${p.imagem}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p>${dinheiro(p.preco)}</p>
      <button data-nome="${p.nome}">adicionar</button>
    </article>
  `).join("");
}

function mostrarCarrinho() {
  itens.innerHTML = pedido.map(p => `
    <div class="item">
      ${p.nome} x ${p.qtd}
      <button data-remover="${p.nome}">remover</button>
    </div>
  `).join("");

  const quantidade = pedido.reduce((s, p) => s + p.qtd, 0);
  const total = pedido.reduce((s, p) => s + p.preco * p.qtd, 0);

  document.getElementById("quantidade").textContent = quantidade;
  document.getElementById("total").textContent = dinheiro(total);
}

produtos.addEventListener("click", e => {
  const nome = e.target.dataset.nome;
  if (!nome) return;

  const produto = lista.find(p => p.nome === nome);
  const item = pedido.find(p => p.nome === nome);

  if (item) item.qtd++;
  else pedido.push({ ...produto, qtd: 1 });

  mostrarCarrinho();
});

itens.addEventListener("click", e => {
  const nome = e.target.dataset.remover;
  if (!nome) return;

  pedido = pedido.filter(p => p.nome !== nome);
  mostrarCarrinho();
});

busca.addEventListener("input", mostrarProdutos);

document.getElementById("categorias").addEventListener("click", e => {
  if (!e.target.dataset.cat) return;
  categoria = e.target.dataset.cat;
  mostrarProdutos();
});

document.getElementById("abrir").onclick = () =>
  carrinho.classList.add("aberto");

document.getElementById("fechar").onclick = () =>
  carrinho.classList.remove("aberto");

document.getElementById("finalizar").onclick = () => {
  if (!pedido.length) {
    alert("adicione produtos ao carrinho.");
    return;
  }

  // substitua pelo número comercial com código do país e ddd.
  const whatsapp = "5500000000000";

  if (!/^55\d{10,11}$/.test(whatsapp)) {
    alert("configure seu número do whatsapp no script.js.");
    return;
  }

  const mensagem = pedido.map(p =>
    `${p.qtd}x ${p.nome} - ${dinheiro(p.preco * p.qtd)}`
  ).join("\n");

  const total = pedido.reduce((s, p) => s + p.preco * p.qtd, 0);

  window.open(
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      "olá, quero fazer um pedido:\n" + mensagem +
      "\n\n total: " + dinheiro(total)
    )}`,
    "_blank"
  );
};

mostrarProdutos();
mostrarCarrinho();
