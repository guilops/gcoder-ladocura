"use strict";
const cfg = window.GCODER_CONFIG || {};
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const products = [
  { id: "Brigadeiro gourmet", unit: "unidades", price: 2.8, step: 25, minimum: 25 },
  { id: "Beijinho de coco", unit: "unidades", price: 2.8, step: 25, minimum: 25 },
  { id: "Docinho especial", unit: "unidades", price: 3.8, step: 25, minimum: 25 },
  { id: "Bolo festivo", unit: "kg", price: 180, step: 0.5, minimum: 1.5 },
];
let minDays = 7;
const productList = document.querySelector("#product-list");
for (const product of products) {
  const row = document.createElement("label"); row.className = "product-row";
  const info = document.createElement("span"); info.innerHTML = `<strong>${product.id}</strong><small>${money.format(product.price)} / ${product.unit.replace(/\(s\)/, "")}</small>`;
  const qty = document.createElement("input"); qty.type = "number"; qty.min = "0"; qty.step = String(product.step); qty.value = "0"; qty.inputMode = "numeric"; qty.dataset.product = product.id; qty.dataset.price = String(product.price); qty.setAttribute("aria-label", `Quantidade de ${product.id}`);
  row.append(info, qty); productList.append(row);
}
function calculate() {
  return [...productList.querySelectorAll("input")].reduce((total, input) => total + Math.max(0, Number(input.value) || 0) * Number(input.dataset.price), 0);
}
function minimumDate(days) { const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() + days); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`; }
function applyLeadTime(days) {
  minDays = Math.max(1, Math.min(60, Number(days) || 7));
  const date = document.querySelector("#event-date"); date.min = minimumDate(minDays);
  document.querySelectorAll("[data-min-days-label]").forEach((el) => el.textContent = `${minDays} ${minDays === 1 ? "dia" : "dias"}`);
}
applyLeadTime(7);
if (cfg.supabaseUrl && cfg.supabaseAnonKey) fetch(`${cfg.supabaseUrl}/rest/v1/bakery_settings?select=min_order_days&id=eq.1`, { headers: { apikey: cfg.supabaseAnonKey, Authorization: `Bearer ${cfg.supabaseAnonKey}` } }).then((r) => r.ok ? r.json() : []).then((rows) => { if (rows?.[0]) applyLeadTime(rows[0].min_order_days); }).catch(() => {});
productList.addEventListener("input", () => { document.querySelector("#estimate-total").textContent = money.format(calculate()); });
document.querySelectorAll('[name="delivery"]').forEach((radio) => radio.addEventListener("change", () => {
  const wrap = document.querySelector("#address-wrap"); const address = wrap.querySelector("input"); wrap.hidden = radio.value !== "entrega" || !radio.checked; address.required = !wrap.hidden;
}));
document.querySelector("#order-form").addEventListener("submit", async (event) => {
  event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const feedback = document.querySelector("#order-feedback");
  const date = String(data.get("date")); if (date < minimumDate(minDays)) { feedback.textContent = `Escolha uma data com pelo menos ${minDays} ${minDays === 1 ? "dia" : "dias"} de antecedência.`; document.querySelector("#event-date").focus(); return; }
  const chosen = [...productList.querySelectorAll("input")].filter((input) => Number(input.value) > 0);
  if (!chosen.length) { feedback.textContent = "Escolha ao menos um doce ou bolo para continuar."; return; }
  for (const input of chosen) { const product = products.find((item) => item.id === input.dataset.product); if (Number(input.value) < product.minimum || Number(input.value) % product.step !== 0 && product.step > 1) { feedback.textContent = `${product.id}: quantidade mínima de ${product.minimum} e em múltiplos de ${product.step}.`; input.focus(); return; } }
  const delivery = data.get("delivery"); const orderLines = chosen.map((input) => { const product = products.find((item) => item.id === input.dataset.product); return `• ${input.dataset.product}: ${input.value} ${product.unit.replace(/\(s\)/, "")} — ${money.format(Number(input.value) * Number(input.dataset.price))}`; });
  const message = [`Olá! Quero fazer uma encomenda na La Docura.`, ``, `Nome: ${data.get("name")}`, `WhatsApp: ${data.get("phone")}`, `E-mail: ${data.get("email")}`, `Data da festa: ${new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR")} às ${data.get("time")}`, ``, `Meu pedido:`, ...orderLines, ``, `Estimativa dos doces: ${money.format(calculate())}`, `Sinal de 50% após confirmação: ${money.format(calculate() / 2)}`, `Recebimento: ${delivery === "entrega" ? `Entrega (custo por minha conta) — ${data.get("address")}` : "Retirada"}`, `Observações: ${data.get("notes") || "Nenhuma"}`, ``, `Sei que o pedido só fica confirmado após disponibilidade, pagamento do sinal Pix de 50% e envio do comprovante pelo WhatsApp.`].join("\n");
  const phone = String(cfg.whatsappNumber || "").replace(/\D/g, ""); if (!phone) { feedback.textContent = "O WhatsApp da confeitaria ainda não está configurado."; return; }
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const orderWindow = window.open(whatsappUrl, "_blank");
  if (!orderWindow) { feedback.textContent = "Permita a abertura do WhatsApp no navegador para enviar sua encomenda."; return; }
  orderWindow.opener = null;
  let saved = false;
  if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
    const details = [`Quantidade selecionada:`, ...orderLines, `Total estimado: ${money.format(calculate())}`, `Sinal estimado (50%): ${money.format(calculate() / 2)}`, `Recebimento: ${delivery === "entrega" ? `Entrega, custo do cliente. Endereço: ${data.get("address")}` : "Retirada"}`, `Observações: ${data.get("notes") || "Nenhuma"}`].join("\n");
    try {
      const response = await fetch(`${cfg.supabaseUrl}/functions/v1/create-booking`, { method: "POST", headers: { "Content-Type": "application/json", apikey: cfg.supabaseAnonKey, Authorization: `Bearer ${cfg.supabaseAnonKey}` }, body: JSON.stringify({ customer_name: data.get("name"), customer_phone: data.get("phone"), customer_email: data.get("email"), service: "Encomenda para festa", details, booking_date: date, booking_time: data.get("time") }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Falha ao registrar o pedido."); saved = true;
    } catch (error) { feedback.textContent = `Não foi possível registrar no painel (${error.message}). O WhatsApp será aberto para você combinar diretamente.`; }
  }
  if (saved) feedback.textContent = "Pedido registrado e enviado ao WhatsApp. A encomenda ainda depende da confirmação da confeitaria.";
  else if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) feedback.textContent = "Seu pedido está pronto no WhatsApp. Envie a mensagem para a confeitaria confirmar disponibilidade e informar os dados do Pix.";
});
document.querySelector("#menu-toggle").addEventListener("click", (event) => { const nav = document.querySelector("#main-nav"); const open = nav.classList.toggle("open"); event.currentTarget.setAttribute("aria-expanded", String(open)); });
document.querySelector("#main-nav").addEventListener("click", (event) => { if (event.target.closest("a")) { document.querySelector("#main-nav").classList.remove("open"); document.querySelector("#menu-toggle").setAttribute("aria-expanded", "false"); } });
document.querySelector("#year").textContent = String(new Date().getFullYear());
for (const link of document.querySelectorAll("[data-whatsapp]")) link.href = `https://wa.me/${String(cfg.whatsappNumber || "").replace(/\D/g, "")}`;

