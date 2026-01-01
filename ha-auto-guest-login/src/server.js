import express from 'express';
const app = express();

// --- ÁREA DE CONFIGURAÇÃO (EDITE AQUI) ---

// 1. URL DO HOME ASSISTANT
// Se os inquilinos acessam pelo Wi-Fi interno, coloque o IP (ex: http://192.168.1.100:8123)
// Se acessam de fora, coloque o domínio (ex: https://minhacasa.duckdns.org)
const HA_URL = "http://192.168.2.146:8123"; 

// 2. LISTA DE INQUILINOS E SENHAS
// O "dash" é o caminho da dashboard depois do IP. Ex: /lovelace-casa1
const inquilinos = {
  "casa1": { user: "visitante1", pass: "12345", dash: "/casa-wem" },
  "casa2": { user: "visitante2", pass: "12345", dash: "/outra-casa" },
  "casa3": { user: "inquilino3", pass: "senha3", dash: "/lovelace-casa3" },
  "casa4": { user: "inquilino4", pass: "senha4", dash: "/lovelace-casa4" },
  "casa5": { user: "inquilino5", pass: "senha5", dash: "/lovelace-casa5" },
  "casa6": { user: "inquilino6", pass: "senha6", dash: "/lovelace-casa6" }
};

// --- FIM DA CONFIGURAÇÃO ---

app.get('/login', (req, res) => {
  const id = req.query.id; // Pega o id do link (ex: ?id=casa1)
  const config = inquilinos[id];

  // Se o ID não existir na lista, mostra erro
  if (!config) {
    return res.status(404).send("<h1>Erro: Casa não encontrada. Verifique o link.</h1>");
  }

  // Gera o HTML que faz o login automático
  // O "kiosk" no final da URL ajuda a esconder o menu lateral (se o kiosk-mode estiver instalado)
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Conectando...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: sans-serif; text-align: center; padding-top: 50px; background-color: #f5f5f5; }
            .loader { border: 5px solid #f3f3f3; border-top: 5px solid #03a9f4; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body onload="document.getElementById('loginForm').submit()">
        
        <form id="loginForm" method="POST" action="${HA_URL}/auth/login">
          <input type="hidden" name="client_id" value="${HA_URL}/">
          <input type="hidden" name="redirect_uri" value="${HA_URL}${config.dash}?kiosk">
          <input type="hidden" name="username" value="${config.user}">
          <input type="hidden" name="password" value="${config.pass}">
        </form>

        <h3>Acessando Painel da ${id}...</h3>
        <div class="loader"></div>
        <p>Por favor, aguarde.</p>
        
      </body>
    </html>
  `);
});

// Inicia o servidor na porta 8099 (padrão de muitos addons) ou 8080
const PORT = process.env.PORT || 8099;
app.listen(PORT, () => {
  console.log(`Servidor de Login Multi-Casa rodando na porta ${PORT}`);
});
