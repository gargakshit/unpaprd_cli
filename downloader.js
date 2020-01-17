require("isomorphic-unfetch");
const React = require("react");
const { render, Color, Box } = require("ink");
const Gradient = require("ink-gradient");
const BigText = require("ink-big-text");
const { default: SelectInput } = require("ink-select-input");
const { default: TextInput } = require("ink-text-input");
const WebTorrent = require("webtorrent-hybrid");
const { join } = require("path");

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
                  { path: join(__dirname, "./unpaprd_downloads/") },
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
