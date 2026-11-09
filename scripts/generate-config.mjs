import { readFile, writeFile } from "node:fs/promises";

const env = { ...process.env };
for (const filename of ["../.env", "../.env.local"]) {
  try {
    const contents = await readFile(new URL(filename, import.meta.url), "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match || match[1] in env) continue;
      const value = match[2].trim();
      env[match[1]] = value.replace(/^(['"])(.*)\1$/, "$2");
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

const supabaseUrl = env.SUPABASE_URL || "";
const supabaseAnonKey = env.SUPABASE_ANON_KEY || "";
if (Boolean(supabaseUrl) !== Boolean(supabaseAnonKey)) {
  throw new Error("Configure SUPABASE_URL e SUPABASE_ANON_KEY juntos.");
}
if (supabaseUrl && !/^https?:\/\/.+/.test(supabaseUrl)) {
  throw new Error("SUPABASE_URL deve ser uma URL http ou https válida.");
}

const config = {
  supabaseUrl,
  supabaseAnonKey,
  neonAuthBaseUrl: env.NEON_AUTH_BASE_URL || "",
  whatsappNumber: env.WHATSAPP_NUMBER || "5511954841299",
  contactEmail: env.CONTACT_EMAIL || "",
  instagramUrl: env.INSTAGRAM_URL || "",
  githubUrl: env.GITHUB_URL || "",
  serviceArea: env.SERVICE_AREA || "São Paulo e região",
  hotmartLogicUrl: env.HOTMART_LOGIC_URL || "https://go.hotmart.com/J79485536F",
  businessName: env.BUSINESS_NAME || "La Docura Confeitaria Gourmet",
  businessTagline: env.BUSINESS_TAGLINE || "DOCES FEITOS COM CARINHO",
};

await writeFile(
  new URL("../config.js", import.meta.url),
  `window.GCODER_CONFIG = ${JSON.stringify(config, null, 2)};\n`,
  "utf8",
);
console.log("Configuração pública gerada em config.js.");

