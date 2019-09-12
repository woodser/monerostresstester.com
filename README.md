## Description

This project is a sample web application using the [monero-javascript](https://github.com/monero-ecosystem/monero-java) library.

## How to Run in a Browser
1. `git clone https://github.com/woodser/xmr-sample-app`
2. `cd xmr-sample-app`
3. `npm install`
4. `./bin/start_dev_browser`
5. Download and install [Monero CLI](https://getmonero.org/downloads/)
6. Start monero-daemon-rpc with authentication and CORS access.  For example: `./monerod --stagenet --rpc-login superuser:abctesting123 --rpc-access-control-origins http://localhost:9100`
7. Start monero-wallet-rpc with authentication and CORS access.  For example: `./monero-wallet-rpc --daemon-address http://localhost:38081 --daemon-login superuser:abctesting123 --stagenet --rpc-bind-port 38083 --rpc-login rpc_user:abc123 --rpc-access-control-origins http://localhost:9100 --wallet-dir ./`
8. Access sample application at http://localhost:9100

Note: The server used in these steps, SimpleHTTPServer, incorrectly serves WASM files with content-type "octet-stream" which fails in Firefox.  This issue can be resolved by using a different HTTP server or browser.