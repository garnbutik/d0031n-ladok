const rest = require("./rest");
const utils = require("util");

const port = 3000;

rest.listen(port, () => console.log(utils.format("Server listening on %s", port)));