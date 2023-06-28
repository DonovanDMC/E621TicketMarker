import type webpack from "webpack";
import { UserscriptPlugin } from "webpack-userscript";
import { readFile } from "node:fs/promises";
const { version } = JSON.parse(await readFile(new URL("package.json", import.meta.url), "utf8")) as { version: string; };

const mode: "none" | "development" | "production" = "production" as never;
export default {
    mode,
    devtool: mode === "development" ? "inline-source-map" : false,
    entry:   new URL("src/index.ts", import.meta.url).pathname,
    output:  {
        path:     new URL("dist", import.meta.url).pathname,
        filename: "script.js"
    },
    plugins: [
        new UserscriptPlugin({
            headers: {
                "name":        "E621 Bulk Set Adder",
                "description": "A way to bulk add posts to a set.",
                version,
                "license":     "MIT",
                "match":       [
                    "https://e621.net/posts*",
                    "https://e926.net/posts*"
                ],
                "run-at": "document-body"
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.m?ts/,
                use:  [
                    {
                        loader:  "ts-loader",
                        options: {
                            transpileOnly: true
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    watch:       mode === "development",
    experiments: {
        topLevelAwait: true
    }
} satisfies webpack.Configuration;
