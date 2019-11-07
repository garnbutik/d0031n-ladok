const rest = require("./rest");
const utils = require("util");
const port = require("./config/config").serverPort;


rest.listen(port, () => console.log(utils.format("Server listening on %s", port)));