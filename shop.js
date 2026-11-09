"use strict";

const cfg = window.GCODER_CONFIG || {};
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const products = [
  { id: "Brigadeiro", unit: "unidades", price: 2.8 },
  { id: "Beijinho", unit: "unidades", price: 2.8 },
  { id: "Cajuzinho", unit: "unidades", price: 2.8 },
  { id: "Bicho-de-pé", unit: "unidades", price: 2.8 },
  { id: "Morango com Nutella", unit: "unidades", price: 6 },
];
const quantityStep = 25;
const minimumQuantity = 25;
const productList = document.querySelector("#product-list");
const orderForm = document.querySelector("#order-form");

if (productList) {
  for (const product of products) {
    const row = document.createElement("label");
    row.className = "product-row";
    const info = document.createElement("span");
    info.innerHTML = `<strong>${product.id}</strong><small>${money.format(product.price)} / unidade</small>`;
    const quantity = document.createElement("select");
    quantity.className = "quantity-select";
    quantity.dataset.product = product.id;
    quantity.dataset.price = String(product.price);
    quantity.setAttribute("aria-label", `Quantidade de ${product.id}`);
    const none = document.createElement("option");
    none.value = "0";
    none.textContent = "Não incluir";
    quantity.append(none);
    for (let amount = minimumQuantity; amount <= 1000; amount += quantityStep) {
      const option = document.createElement("option");
      option.value = String(amount);
      option.textContent = `${amount} unidades`;
      quantity.append(option);
    }
    row.append(info, quantity);
    productList.append(row);
  }
}

function calculate() {
  if (!productList) return 0;
  return [...productList.querySelectorAll("select[data-product]")]
    .reduce((total, select) => total + Number(select.value) * Number(select.dataset.price), 0);
}

function minimumDate(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function applyLeadTime(days) {
  const minDays = Math.max(1, Math.min(60, Number(days) || 7));
  const date = document.querySelector("#event-date");
  if (date) date.min = minimumDate(minDays);
  document.querySelectorAll("[data-min-days-label]").forEach((el) => {
    el.textContent = `${minDays} ${minDays === 1 ? "dia" : "dias"}`;
  });
}

applyLeadTime(7);
if (orderForm && cfg.supabaseUrl && cfg.supabaseAnonKey) {
  fetch(`${cfg.supabaseUrl}/rest/v1/bakery_settings?select=min_order_days&id=eq.1`, {
    headers: { apikey: cfg.supabaseAnonKey, Authorization: `Bearer ${cfg.supabaseAnonKey}` },
  }).then((response) => response.ok ? response.json() : [])
    .then((rows) => { if (rows?.[0]) applyLeadTime(rows[0].min_order_days); })
    .catch(() => {});
}

productList?.addEventListener("change", () => {
  const total = document.querySelector("#estimate-total");
  if (total) total.textContent = money.format(calculate());
});

document.querySelectorAll('[name="delivery"]').forEach((radio) => radio.addEventListener("change", () => {
  const wrap = document.querySelector("#address-wrap");
  if (!wrap) return;
  const address = wrap.querySelector("input");
  wrap.hidden = radio.value !== "entrega" || !radio.checked;
  address.required = !wrap.hidden;
}));

orderForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(orderForm);
  const feedback = document.querySelector("#order-feedback");
  const date = String(data.get("date"));
  const dateInput = document.querySelector("#event-date");
  if (dateInput.min && date < dateInput.min) {
    feedback.textContent = "Escolha uma data que respeite a antecedência mínima informada.";
    dateInput.focus();
    return;
  }
  const chosen = [...productList.querySelectorAll("select[data-product]")].filter((select) => Number(select.value) > 0);
  if (!chosen.length) {
    feedback.textContent = "Escolha ao menos um docinho para continuar.";
    return;
  }
  for (const select of chosen) {
    const amount = Number(select.value);
    if (amount < minimumQuantity || amount % quantityStep !== 0) {
      feedback.textContent = `Escolha pelo menos ${minimumQuantity} unidades de ${select.dataset.product}, em múltiplos de ${quantityStep}.`;
      select.focus();
      return;
    }
  }

  const delivery = data.get("delivery");
  const orderLines = chosen.map((select) => {
    const product = products.find((item) => item.id === select.dataset.product);
    return `• ${product.id}: ${select.value} unidades — ${money.format(Number(select.value) * product.price)}`;
  });
  const total = calculate();
  const message = [
    "Olá! Quero fazer uma encomenda na La Docura.", "",
    `Nome: ${data.get("name")}`,
    `WhatsApp: ${data.get("phone")}`,
    `E-mail: ${data.get("email")}`,
    `Data da festa: ${new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR")} às ${data.get("time")}`,
    "", "Meu pedido:", ...orderLines, "",
    `Estimativa dos doces: ${money.format(total)}`,
    `Sinal de 50% após confirmação: ${money.format(total / 2)}`,
    `Recebimento: ${delivery === "entrega" ? `Entrega (custo por minha conta) — ${data.get("address")}` : "Retirada"}`,
    `Observações: ${data.get("notes") || "Nenhuma"}`, "",
    "Sei que o pedido só fica confirmado após disponibilidade, pagamento do sinal Pix de 50% e envio do comprovante pelo WhatsApp.",
  ].join("\n");
  const phone = String(cfg.whatsappNumber || "").replace(/\D/g, "");
  if (!phone) {
    feedback.textContent = "O WhatsApp da confeitaria ainda não está configurado.";
    return;
  }
  const orderWindow = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  if (!orderWindow) {
    feedback.textContent = "Permita a abertura do WhatsApp no navegador para enviar sua encomenda.";
    return;
  }
  orderWindow.opener = null;

  if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
    const details = ["Quantidade selecionada:", ...orderLines, `Total estimado: ${money.format(total)}`, `Sinal estimado (50%): ${money.format(total / 2)}`, `Recebimento: ${delivery === "entrega" ? `Entrega, custo do cliente. Endereço: ${data.get("address")}` : "Retirada"}`, `Observações: ${data.get("notes") || "Nenhuma"}`].join("\n");
    try {
      const response = await fetch(`${cfg.supabaseUrl}/functions/v1/create-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: cfg.supabaseAnonKey, Authorization: `Bearer ${cfg.supabaseAnonKey}` },
        body: JSON.stringify({ customer_name: data.get("name"), customer_phone: data.get("phone"), customer_email: data.get("email"), service: "Encomenda para festa", details, booking_date: date, booking_time: data.get("time") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Falha ao registrar o pedido.");
      feedback.textContent = "Pedido registrado e enviado ao WhatsApp. A encomenda ainda depende da confirmação da confeitaria.";
      return;
    } catch (error) {
      feedback.textContent = `Não foi possível registrar no painel (${error.message}). O WhatsApp foi aberto para você combinar diretamente.`;
      return;
    }
  }
  feedback.textContent = "Seu pedido está pronto no WhatsApp. Envie a mensagem para a confeitaria confirmar disponibilidade e informar os dados do Pix.";
});

document.querySelector("#menu-toggle")?.addEventListener("click", (event) => {
  const nav = document.querySelector("#main-nav");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelector("#main-nav")?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    document.querySelector("#main-nav").classList.remove("open");
    document.querySelector("#menu-toggle")?.setAttribute("aria-expanded", "false");
  }
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
const whatsappNumber = String(cfg.whatsappNumber || "").replace(/\D/g, "");
for (const link of document.querySelectorAll("[data-whatsapp]")) {
  if (whatsappNumber) link.href = `https://wa.me/${whatsappNumber}`;
}

function setupBakeryCarousel() {
  const carousel = document.querySelector("[data-bakery-carousel]");
  if (!carousel) return;
  const slides = [
    { src: "assets/bakery/doces-natalinos.png", alt: "Doces artesanais em formato de árvore de Natal", caption: "Doces para celebrar" },
    { src: "assets/bakery/morango-nutella.png", alt: "Morango coberto com chocolate e creme de avelã", caption: "Sabores que surpreendem" },
    { src: "assets/bakery/brigadeiros.png", alt: "Brigadeiros gourmet feitos à mão", caption: "Feito com carinho" },
  ];
  const image = carousel.querySelector("#home-carousel-image");
  const caption = carousel.querySelector("#home-carousel-caption");
  const dots = carousel.querySelector("[data-carousel-dots]");
  const pauseButton = carousel.querySelector("[data-carousel-toggle]");
  let current = 0;
  let paused = false;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    image.src = slide.src;
    image.alt = slide.alt;
    caption.textContent = slide.caption;
    [...dots.children].forEach((dot, dotIndex) => dot.setAttribute("aria-pressed", String(dotIndex === current)));
  }
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Mostrar foto ${index + 1}: ${slide.caption}`);
    dot.setAttribute("aria-pressed", String(index === current));
    dot.addEventListener("click", () => showSlide(index));
    dots.append(dot);
  });
  carousel.querySelector("[data-carousel-previous]").addEventListener("click", () => showSlide(current - 1));
  carousel.querySelector("[data-carousel-next]").addEventListener("click", () => showSlide(current + 1));
  pauseButton.addEventListener("click", () => {
    paused = !paused;
    pauseButton.textContent = paused ? "▶" : "Ⅱ";
    pauseButton.setAttribute("aria-label", paused ? "Iniciar carrossel" : "Pausar carrossel");
  });
  window.setInterval(() => {
    if (!paused && !document.hidden) showSlide(current + 1);
  }, 3000);
}

setupBakeryCarousel();
