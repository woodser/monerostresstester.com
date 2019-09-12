## Description

This project is a sample web application using the [monero-javascript](https://github.com/monero-ecosystem/monero-java) library.

## Build Instructions
1. Download and install [Monero CLI](https://getmonero.org/downloads/).
2. Start monero-daemon-rpc with authentication and CORS access.  For example: `./monerod --stagenet --rpc-login superuser:abctesting123 --rpc-access-control-origins http://localhost:9100`
3. Start monero-wallet-rpc with authentication and CORS access.  For example: `./monero-wallet-rpc --daemon-address http://localhost:38081 --daemon-login superuser:abctesting123 --stagenet --rpc-bind-port 38083 --rpc-login rpc_user:abc123 --rpc-access-control-origins http://localhost:9100 --wallet-dir ./`
4. `git clone https://github.com/woodser/xmr-sample-app`
5. `cd xmr-sample-app`
6. `npm install`
7. `./bin/start_dev_browser`
8. Access sample application at http://localhost:9100.

Note: The server used in these steps, SimpleHTTPServer, incorrectly serves WASM files with content-type "octet-stream" which fails in Firefox.  This issue can be resolved by using a different HTTP server or browser.