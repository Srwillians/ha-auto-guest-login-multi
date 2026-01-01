const express = require('express');
const app = express();
const path = require('path');

// --- CONFIGURAÇÃO DAS 6 CASAS ---
const inquilinos = {
  "casa1": { user: "inquilino1", pass: "senha1", dash: "/lovelace-casa1/0" },
  "casa2": { user: "inquilino2", pass: "senha2", dash: "/lovelace-casa2/0" },
  "casa3": { user: "inquilino3", pass: "senha3", dash: "/lovelace-casa3/0" },
  "casa4": { user: "inquilino4", pass: "senha4", dash: "/lovelace-casa4/0" },
  "casa5": { user: "inquilino5", pass: "senha5", dash: "/lovelace-casa5/0" },
  "casa6": { user: "inquilino6", pass: "senha6", dash: "/lovelace-casa6/0" }
};

const HA_URL = "http://192.168.1.100:8123"; // TROQUE PELO IP DO SEU HA

app.get('/login', (req, res) => {
  const id = req.query.id;
  const config = inquilinos[id];

  if (!config) {
    return res.status(404).send("Casa não encontrada.");
  }

  // Esta parte gera um formulário HTML que envia os dados sozinho para o HA
  // É a forma mais simples de "enganar" o login sem dar erro de segurança
  res.send(`
    <html>
      <body onload="document.forms[0].submit()">
        <form method="POST" action="${HA_URL}/auth/login">
          <input type="hidden" name="username" value="${config.user}">
          <input type="hidden" name="password" value="${config.pass}">
          <input type="hidden" name="client_id" value="${HA_URL}">
          <input type="hidden" name="redirect_uri" value="${HA_URL}${config.dash}?kiosk">
        </form>
        <p>Conectando à ${id}...</p>
      </body>
    </html>
  `);
});

app.listen(8080, () => console.log('Servidor Multi-Casa rodando na porta 8080'));
