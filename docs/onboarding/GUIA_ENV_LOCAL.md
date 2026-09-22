📝 Guia de Configuração do .env.local
Por que NEXT_PUBLIC_?
No Next.js, variáveis de ambiente sem NEXT_PUBLIC_ só existem no server-side (Node.js). Variáveis com NEXT_PUBLIC_ são "injetadas" no bundle do browser no momento do build.
Planilhas
Prefixo Onde funciona Exemplo
NEXT_PUBLIC_* Browser + Server Firebase config, Supabase URL
Sem prefixo Server only Supabase service role, API keys secretas
⚠️ NUNCA coloque chaves secretas com NEXT_PUBLIC_! Elas ficam visíveis no código-fonte da página.
🔥 Firebase — Onde pegar cada valor
Acesse Firebase Console
Selecione seu projeto gdgjobs
Clique no ícone de engrenagem (⚙️) → Project settings → aba General
Role até Your apps → selecione o app Web (ou crie um novo)
Copie os valores do objeto firebaseConfig:
JavaScript
const firebaseConfig = {
apiKey: "COPIE_AQUI", → NEXT_PUBLIC_FIREBASE_API_KEY
authDomain: "COPIE_AQUI", → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
projectId: "COPIE_AQUI", → NEXT_PUBLIC_FIREBASE_PROJECT_ID
storageBucket: "COPIE_AQUI", → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
messagingSenderId: "COPIE_AQUI", → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
appId: "COPIE_AQUI", → NEXT_PUBLIC_FIREBASE_APP_ID
measurementId: "COPIE_AQUI" → NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (opcional)
};
Ativar Google Auth:
Firebase Console → Authentication → Sign-in method
Clique em Google
Ative o toggle → salve
Adicione seu domínio localhost em Authorized domains:
localhost
127.0.0.1
🗄️ Supabase — Onde pegar cada valor
Acesse Supabase Dashboard
Selecione seu projeto
Project Settings → API
Planilhas
Valor no Supabase Variável no .env
Project URL NEXT_PUBLIC_SUPABASE_URL
anon public NEXT_PUBLIC_SUPABASE_ANON_KEY
service_role secret SUPABASE_SERVICE_ROLE_KEY
⚠️ A service_role key ignora o RLS (Row-Level Security). Use SÓ no server-side (app/api/*).
🧪 Testando se tudo está configurado

1. Verificar variáveis carregadas
   Crie um arquivo temporário app/teste-env/page.tsx:
   tsx
   export default function TesteEnvPage() {
   return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Teste de variáveis</h1>
      <ul className="space-y-2 text-sm font-mono">
        <li>🔥 Firebase API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ OK' : '❌ Ausente'}</li>
        <li>🔥 Firebase Project: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ OK' : '❌ Ausente'}</li>
        <li>🗄️ Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ OK' : '❌ Ausente'}</li>
        <li>🗄️ Supabase Anon: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ OK' : '❌ Ausente'}</li>
      </ul>
      <p className="mt-4 text-xs text-slate-500">
        Se algum aparecer "❌ Ausente", verifique o .env.local
      </p>
    </div>

);
}
Acesse http://localhost:3000/teste-env 2. Testar Firebase Auth
Acesse /login
Clique em "Entrar com Google"
Se der erro de "auth/invalid-api-key", verifique NEXT_PUBLIC_FIREBASE_API_KEY
Se der erro de "unauthorized-domain", adicione localhost no Firebase Console 3. Testar Supabase
bash
curl http://localhost:3000/api/jobs
Se retornar JSON com vagas, a conexão está OK.
🚨 Erros comuns
Planilhas
Erro Causa Solução
Firebase: Error (auth/invalid-api-key) API Key errada ou não definida Verifique NEXT_PUBLIC_FIREBASE_API_KEY
Firebase: Error (auth/unauthorized-domain) localhost não autorizado Firebase Console → Auth → Authorized domains → add localhost
Missing env var: NEXT_PUBLIC_FIREBASE_API_KEY .env.local não existe cp .env.example .env.local e preencha
SUPABASE_SERVICE_ROLE_KEY is required Service role não definida Adicione SUPABASE_SERVICE_ROLE_KEY no .env.local
relation "jobs" does not exist Seed não executado Rode o SQL seed no Supabase
✅ Checklist final do .env.local
bash

# 1. Criar o arquivo

cp .env.example .env.local

# 2. Preencher TODOS os campos (não deixe nenhum vazio!)

# 3. Salvar

# 4. Restartar o servidor (Ctrl+C → npm run dev)

# 5. Testar em http://localhost:3000/teste-env

[ ] NEXT_PUBLIC_FIREBASE_API_KEY preenchido
[ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN preenchido
[ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID preenchido
[ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET preenchido
[ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID preenchido
[ ] NEXT_PUBLIC_FIREBASE_APP_ID preenchido
[ ] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID preenchido (ou deixe vazio)
[ ] NEXT_PUBLIC_SUPABASE_URL preenchido
[ ] NEXT_PUBLIC_SUPABASE_ANON_KEY preenchido
[ ] SUPABASE_SERVICE_ROLE_KEY preenchido
[ ] .env.local NÃO está no git (git status não deve mostrar)
