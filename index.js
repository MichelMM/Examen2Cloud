var request = require('request');
exports.handler = async (event) => {
    return new Promise((resolve,reject)=>{
      var req;
      var options = {
        'method': 'POST',
        'url': 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/a1d59726-eeb1-4490-9e15-4c3443b017bd/v1/analyze?version=2020-08-01',
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': process.env.API_KEY
        },
        body: JSON.stringify({
          "features": {
            "entities": {
              "sentiment": true,
              "emotion": true,
              limit: 5
            },
            "keywords": {
              "emotion": true,
              "sentiment": true,
              limit: 5
            }
          },          
          "text": event.historial_clinico
        })
      
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        resolve(JSON.parse(response.body));
      });
    }).then((response)=>{
      //return response;
      let keywords = []
      let entities = []
      let palabras_clave_desc = {}
      let entidades_desc = {}
      response.keywords.forEach((element)=>{
        keywords.push(element.text)
        palabras_clave_desc[element.text]={
          "sentimiento":element.sentiment.label,
          "relevancia":element.relevance,
          "repeticiones":element.count,
          "emocion": (element.emotion!=null)?Object.keys(element.emotion).reduce(function(a, b){ return element.emotion[a] > element.emotion[b] ? a : b }):"n/a"
        }
      })
      response.entities.forEach((element)=>{
        entities.push(element.text)
        entidades_desc[element.text]={
          "tipo": element.type,
          "sentimiento": element.sentiment.label,
          "relevancia": element.relevance,
          "emocion":(element.emotion!=null)?Object.keys(element.emotion).reduce(function(a, b){ return element.emotion[a] > element.emotion[b] ? a : b }):"n/a",
          "repeticiones": element.count,
          "porcentaje_confianza": element.confidence
        }
      })
      let salida = {
        "lenguaje_texto":response.language,
        "palabras_clave": keywords,
        "entidades":entities,
        "palabras_clave_desc":palabras_clave_desc,
        "entidades_desc":entidades_desc
      }
      return salida;
    })
};

