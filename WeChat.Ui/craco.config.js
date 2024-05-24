const CracoAlias = require("craco-alias");

module.exports = {
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: "tsconfig",
                baseUrl: "./src",
                tsConfigPath: "./jsconfig.paths.json",
            },
        },
    ],
};

