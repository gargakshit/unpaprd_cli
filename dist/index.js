"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-unfetch");
var react_1 = __importDefault(require("react"));
var ink_1 = require("ink");
var ink_gradient_1 = __importDefault(require("ink-gradient"));
var ink_big_text_1 = __importDefault(require("ink-big-text"));
var ink_select_input_1 = __importDefault(require("ink-select-input"));
var ink_text_input_1 = __importDefault(require("ink-text-input"));
var webtorrent_hybrid_1 = __importDefault(require("webtorrent-hybrid"));
var path_1 = require("path");
var client = new webtorrent_hybrid_1.default();
console.clear();
var CLI = function () {
    var _a = react_1.default.useState(""), q = _a[0], setQ = _a[1];
    var _b = react_1.default.useState(null), data = _b[0], setData = _b[1];
    var _c = react_1.default.useState(false), loading = _c[0], showLoading = _c[1];
    var _d = react_1.default.useState(""), downloading = _d[0], setDownloading = _d[1];
    var _e = react_1.default.useState(""), extra = _e[0], setExtra = _e[1];
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        !data && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_gradient_1.default, { name: "teen" },
                    react_1.default.createElement(ink_big_text_1.default, { text: "unpaprd" }))),
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Box, { marginRight: 1 }, "Audiobook to search:"),
                react_1.default.createElement(ink_text_input_1.default, { value: q, onChange: function (value) { return setQ(value); }, onSubmit: function () {
                        showLoading(true);
                        fetch("https://unpaprdapi.gargakshit.now.sh/api/search?q=" + q)
                            .then(function (res) { return res.json(); })
                            .then(function (res) {
                            setData(res);
                            showLoading(false);
                        });
                    } })))),
        loading && react_1.default.createElement(ink_1.Box, null, "Searching..."),
        data && !downloading && (react_1.default.createElement(ink_select_input_1.default, { items: data.map(function (d, i) {
                return {
                    label: d.title,
                    value: "" + i
                };
            }), onSelect: function (item) {
                setDownloading("Please wait...");
                fetch("https://unpaprdapi.gargakshit.now.sh/api/book?id=" + data[Number(item.value)].id)
                    .then(function (res) { return res.json(); })
                    .then(function (res) {
                    setDownloading("Downloading " + item.label + "...");
                    client.add(res.torrent, { path: path_1.join(__dirname, "./unpaprd_downloads/") }, function (torrent) {
                        torrent.on("download", function () {
                            setExtra("Download Speed: " + (torrent.downloadSpeed / 1000000).toFixed(2) + " mb/sec\n" + torrent.numPeers + " peers");
                            setDownloading(item.label + " - " + Math.floor(torrent.progress * 10000) / 100 + "%");
                        });
                        torrent.on("done", function () {
                            setDownloading("Downloaded " + item.label + " in the \"unpaprd_downloads\" folder");
                            process.exit(0);
                        });
                    });
                });
            } })),
        downloading && (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Color, { green: true, bold: true }, downloading)),
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Color, { dim: true }, extra))))));
};
ink_1.render(react_1.default.createElement(CLI, null));
