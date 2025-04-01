function rastrearEncomendas() {
    const CARTAO = 'XXXXXXXXXX'; 
    const CODIGO_ACESSO = 'YYYYYYYY'; 
    const codigosRastreio = ['DG049186209BR', 'DG049186190BR']; // Códigos fakes
  
    try {

      Logger.log('Iniciando geração do token...');
      const tokenUrl = 'https://apihom.correios.com.br/token/v1/autentica/cartaopostagem'; //ambiente teste
      const tokenPayload = {
        numero: CARTAO,
        codigoAcesso: CODIGO_ACESSO
      };
  
      Logger.log(`Enviando requisição para: ${tokenUrl}`);
      Logger.log(`Payload: ${JSON.stringify(tokenPayload)}`);
  
      const tokenResponse = UrlFetchApp.fetch(tokenUrl, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(tokenPayload)
      });
  
      const tokenJson = JSON.parse(tokenResponse.getContentText());
      Logger.log(`Resposta Token: ${JSON.stringify(tokenJson, null, 2)}`);
  
      const token = tokenJson.token;
      if (!token) {
        throw new Error('Token não foi retornado. Verifique as credenciais.');
      }
  
      const rastrearUrl = 'https://apihom.correios.com.br/rastro-async/v1/objetos/async?resultado=T'; //ambiente teste
      Logger.log('Enviando códigos para rastreamento...');
      Logger.log(`Códigos: ${JSON.stringify(codigosRastreio)}`);
  
      const rastrearResponse = UrlFetchApp.fetch(rastrearUrl, {
        method: 'post',
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token
        },
        payload: JSON.stringify(codigosRastreio)
      });
  
      const rastrearJson = JSON.parse(rastrearResponse.getContentText());
      Logger.log(`Resposta do rastreamento (async): ${JSON.stringify(rastrearJson, null, 2)}`);
  
      const numeroRequisicao = rastrearJson.numero;
      if (!numeroRequisicao) {
        throw new Error('Número de requisição assíncrona não retornado.');
      }
  
      Logger.log('Aguardando 5 segundos para consultar resultado...');
      Utilities.sleep(5000);
  
      const consultaUrl = `https://apihom.correios.com.br/rastro-async/v1/recibo/${numeroRequisicao}`;
      Logger.log(`Consultando resultado em: ${consultaUrl}`);
  
      const resultadoResponse = UrlFetchApp.fetch(consultaUrl, {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
  
      const resultadoJson = JSON.parse(resultadoResponse.getContentText());
      Logger.log(`Resultado final do rastreamento: ${JSON.stringify(resultadoJson, null, 2)}`);
  
  
    } catch (error) {
      Logger.log(`Erro encontrado: ${error.message}`);
    }
  }
  
