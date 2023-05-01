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
                "name":        "E621 Ticket Marker",
                "description": "A way to mark e621 tickets you don't want to handle.",
                version,
                "license":     "MIT",
                "supportURL":  "https://github.com/DonovanDMC/E621TicketMarker/issues",
                "match":       [
                    "https://e621.net/tickets*",
                    "https://e926.net/tickets*"
                ],
                "run-at": "document-body",
                "grant":  [
                    "GM.getValue",
                    "GM.setValue"
                ],
                "icon":        "https://raw.githubusercontent.com/DonovanDMC/E621TicketMarker/master/icon.png",
                "updateURL":   "https://github.com/DonovanDMC/E621TicketMarker/releases/latest/download/script.meta.js",
                "downloadURL": "https://github.com/DonovanDMC/E621TicketMarker/releases/latest/download/script.user.js"
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
