#!/usr/bin/env node

import "isomorphic-unfetch";
import React from "react";
import { render, Color, Box } from "ink";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";
import { default as SelectInput } from "ink-select-input";
import { default as TextInput } from "ink-text-input";
import WebTorrent from "webtorrent-hybrid";
import { join } from "path";

const client = new WebTorrent();

console.clear();

const CLI = () => {
  const [q, setQ] = React.useState("");
  const [data, setData] = React.useState(null);
  const [loading, showLoading] = React.useState(false);
  const [downloading, setDownloading] = React.useState("");
  const [extra, setExtra] = React.useState("");

  return (
    <Box flexDirection="column">
      {!data && (
        <>
          <Box>
            <Gradient name="teen">
              <BigText text="unpaprd" />
            </Gradient>
          </Box>
          <Box>
            <Box marginRight={1}>Audiobook to search:</Box>
            <TextInput
              value={q}
              onChange={value => setQ(value)}
              onSubmit={() => {
                showLoading(true);
                fetch(`https://unpaprdapi.gargakshit.now.sh/api/search?q=${q}`)
                  .then(res => res.json())
                  .then(res => {
                    setData(res);
                    showLoading(false);
                  });
              }}
            />
          </Box>
        </>
      )}
      {loading && <Box>{"Searching..."}</Box>}
      {data && !downloading && (
        <SelectInput
          items={data.map((d, i) => {
            return {
              label: d.title,
              value: `${i}`
            };
          })}
          onSelect={item => {
            setDownloading("Please wait...");
            fetch(
              `https://unpaprdapi.gargakshit.now.sh/api/book?id=${
                data[Number(item.value)].id
              }`
            )
              .then(res => res.json())
              .then(res => {
                setDownloading(`Downloading ${item.label}...`);
                client.add(
                  res.torrent,
                  { path: join(process.cwd(), "./unpaprd_downloads/") },
                  torrent => {
                    torrent.on("download", () => {
                      setExtra(
                        `Download Speed: ${(
                          torrent.downloadSpeed / 1000000
                        ).toFixed(2)} mb/sec\n${torrent.numPeers} peers`
                      );
                      setDownloading(
                        `${item.label} - ${Math.floor(
                          torrent.progress * 10000
                        ) / 100}%`
                      );
                    });

                    torrent.on("done", () => {
                      setDownloading(
                        `Downloaded ${item.label} in the "unpaprd_downloads" folder`
                      );

                      process.exit(0);
                    });
                  }
                );
              });
          }}
        />
      )}
      {downloading && (
        <Box flexDirection="column">
          <Box>
            <Color green bold>
              {downloading}
            </Color>
          </Box>
          <Box>
            <Color dim>{extra}</Color>
          </Box>
        </Box>
      )}
    </Box>
  );
};

render(<CLI />);
