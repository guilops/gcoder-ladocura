const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  details?: unknown;
  website?: unknown;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "Método não permitido." }, 405);

  let body: ContactRequest;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Não foi possível ler a mensagem." }, 400);
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return jsonResponse({ sent: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const details = typeof body.details === "string" ? body.details.trim() : "";
  if (
    name.length < 2 || name.length > 100 ||
    email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone.length > 30 || subject.length < 2 || subject.length > 120 ||
    details.length < 2 || details.length > 2000
  ) {
    return jsonResponse({ error: "Confira os dados do formulário e tente novamente." }, 400);
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = Deno.env.get("ADMIN_EMAIL");
  const emailFrom = Deno.env.get("EMAIL_FROM");
  const businessName = Deno.env.get("BUSINESS_NAME") || "Gcoder";
  if (!resendKey || !adminEmail || !emailFrom) {
    console.error("Contact email is missing RESEND_API_KEY, ADMIN_EMAIL, or EMAIL_FROM.");
    return jsonResponse({ error: "O envio de mensagens está temporariamente indisponível." }, 503);
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Não informado");
  const safeSubject = escapeHtml(subject);
  const safeDetails = escapeHtml(details);
  const message = {
    from: emailFrom,
    to: [adminEmail],
    reply_to: email,
    subject: `[${businessName}] ${subject}`,
    html: `<h2>Nova mensagem recebida pelo site da ${escapeHtml(businessName)}</h2><p><strong>Nome:</strong> ${safeName}</p><p><strong>E-mail:</strong> ${safeEmail}</p><p><strong>WhatsApp:</strong> ${safePhone}</p><p><strong>Assunto:</strong> ${safeSubject}</p><p><strong>Mensagem:</strong></p><p>${safeDetails.replace(/\r?\n/g, "<br>")}</p>`,
    text: `Nova mensagem recebida pelo site da ${businessName}\n\nNome: ${name}\nE-mail: ${email}\nWhatsApp: ${phone || "Não informado"}\nAssunto: ${subject}\n\nMensagem:\n${details}`,
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      const providerMessage = await response.text();
      console.error(`Resend could not send the contact message (HTTP ${response.status}):`, providerMessage);
      return jsonResponse({ error: "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde." }, 502);
    }
  } catch (error) {
    console.error("Resend request for the contact message failed:", error);
    return jsonResponse({ error: "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde." }, 502);
  }

  return jsonResponse({ sent: true });
});
