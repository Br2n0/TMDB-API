module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          "moduleName": "@env",         // Nome do módulo para importação
          "path": ".env",               // Caminho para o arquivo .env
          "blacklist": null,            // Sem blacklist de variáveis
          "whitelist": null,            // Sem whitelist de variáveis
          "safe": false,                // Sem validação de segurança
          "allowUndefined": true        // Permite valores undefined
        }
      ]
    ]
  };
};
