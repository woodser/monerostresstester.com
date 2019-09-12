## Description

This project is a sample web application using the [monero-javascript](https://github.com/monero-ecosystem/monero-java) library.

## Build Instructions
1. `git clone https://github.com/woodser/xmr-sample-app`
2. `cd xmr-sample-app`
3. `npm install`
4. `./bin/start_dev_browser`
5. Access sample application at http://localhost:9100.

Note: The server used in these steps, SimpleHTTPServer, incorrectly serves WASM files with content-type "octet-stream" which fails in Firefox.  This issue can be resolved by using a different HTTP server or browser.