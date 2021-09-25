const axios = require("axios");
async function runCode(url, language, index, input, clientId, clientSecret) {
  var output = "";
  const body = await axios.get(url);
  const data = await axios
    .post(
      "https://api.jdoodle.com/v1/execute",
      {
        script: body.data,
        language: language,
        stdin: input,
        versionIndex: index,
        clientId: clientId,
        clientSecret: clientSecret,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    )
    .then((response) => {
      output = response.data["output"];
    })
    .catch((error) => {});

  return output;
}

module.exports = { runCode };
