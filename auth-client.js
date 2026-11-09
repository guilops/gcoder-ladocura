import { createAuthClient } from "@neon/neon-js/auth";

const authUrl = window.GCODER_CONFIG?.neonAuthBaseUrl;
const form = document.querySelector("#auth-form");
const feedback = document.querySelector("#auth-feedback");
const sessionPanel = document.querySelector("#auth-session");
const switchButton = document.querySelector("#auth-switch");
const switchCopy = document.querySelector("#auth-switch-copy");
let isSignUp = true;

function setFeedback(message, success = false) {
  feedback.textContent = message;
  feedback.classList.toggle("success", success);
}

function renderSession(session, user) {
  const signedIn = Boolean(session && user);
  sessionPanel.hidden = !signedIn;
  form.hidden = signedIn;
  switchCopy.hidden = signedIn;
  switchButton.hidden = signedIn;
  if (signedIn) {
    document.querySelector("#auth-user-email").textContent = user.email;
    document.querySelector("#auth-user-id").textContent = `Usuário: ${user.id}`;
  }
}

function applyMode() {
  document.querySelector("#auth-title").textContent = isSignUp ? "Crie sua conta" : "Acesse sua conta";
  document.querySelector("#auth-submit").textContent = isSignUp ? "Criar conta" : "Entrar";
  document.querySelector("#name-field").hidden = !isSignUp;
  form.elements.password.autocomplete = isSignUp ? "new-password" : "current-password";
  switchCopy.textContent = isSignUp ? "Já tem uma conta?" : "Ainda não tem uma conta?";
  switchButton.textContent = isSignUp ? "Entrar" : "Criar conta";
}

if (!authUrl) {
  form.hidden = true;
  setFeedback("A URL pública do Neon Auth não está configurada neste build.");
} else {
  const authClient = createAuthClient(authUrl);
  authClient.getSession().then(({ data, error }) => {
    if (error) setFeedback(error.message);
    renderSession(data?.session, data?.user);
  }).catch((error) => setFeedback(error.message || "Não foi possível verificar sua sessão."));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = document.querySelector("#auth-submit");
    button.disabled = true;
    setFeedback("");
    try {
      const values = new FormData(form);
      const result = isSignUp
        ? await authClient.signUp.email({ name: values.get("name"), email: values.get("email"), password: values.get("password") })
        : await authClient.signIn.email({ email: values.get("email"), password: values.get("password") });
      if (result.error) throw new Error(result.error.message);
      const current = await authClient.getSession();
      if (current.error) throw new Error(current.error.message);
      if (current.data?.session && current.data?.user) {
        renderSession(current.data.session, current.data.user);
        setFeedback("Conta autenticada; sessão atual lida do Neon.", true);
      } else {
        setFeedback("Cadastro enviado. Confira seu e-mail para concluir a verificação e depois entre.", true);
      }
    } catch (error) {
      setFeedback(error.message || "Não foi possível concluir o acesso.");
    } finally {
      button.disabled = false;
    }
  });

  document.querySelector("#auth-signout").addEventListener("click", async () => {
    const { error } = await authClient.signOut();
    if (error) { setFeedback(error.message); return; }
    renderSession(null, null);
    form.reset();
    setFeedback("Você saiu da sua conta.", true);
  });
}

switchButton.addEventListener("click", () => {
  isSignUp = !isSignUp;
  setFeedback("");
  applyMode();
});
applyMode();
