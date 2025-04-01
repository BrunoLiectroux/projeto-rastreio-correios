 Integração com API Rastro (Async) dos Correios  
 Projeto: Liectroux Brasil – Google Sheets + Google Apps Script

Prezada equipe técnica dos Correios,

Segue abaixo a documentação técnica da integração desenvolvida pela equipe de tecnologia da Liectroux Brasil, com base nos manuais e orientações disponibiladas no Portal CWS, visando rastreamento automatizado de objetos via API Rastro Async.

---

 **✅ Objetivo**

Desenvolver um conector que permita consultar o status de objetos postais em lote, diretamente via **Google Sheets**, utilizando **Google Apps Script (GAS)** como camada de automação e autenticação com a **API Rastro Async**.

---

 **🔐 Autenticação**

A autenticação é realizada com base no fluxo descrito no manual oficial dos Correios:

1. Geração de Token via: POST /token/v1/autentica/cartaopostagem

2. Payload enviado:
```json
{
  "numero": "<cartaoPostagem>",
  "codigoAcesso": "<codigoGeradoNoCWS>"
}
```
**3. O token retornado é utilizado nas chamadas subsequentes via header:**
  Authorization: Bearer <token>

**🔁 Fluxo de Rastreio (_Assíncrono_)**

**1.Envio de códigos para rastreamento (máx. 500 por chamada):**
```POST /rastro-async/v1/objetos/async?resultado=T```

**2. Corpo da requisição:**
```["EX123456789BR", "EX987654321BR"]```

**3. A API retorna um ```numero``` (hash único da solicitação assíncrona).**

**4. Após intervalo de 5 segundos, a aplicação consulta os resultados via:**
```GET /rastro-async/v1/recibo/{numero}```


> [!IMPORTANT] 
> O código respeita o limite de requisições indicado no FAQ API Rastro (Correios).
>
> A geração de token é isolada por ambiente de execução (sem reutilização entre sistemas).
>
> Não há sobrescrição de tokens nem conflito com outros sistemas integrados.
>
> Os logs são armazenados no ambiente do Google Apps Script para fins de auditoria e depuração.
