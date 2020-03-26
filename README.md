## Description

Generates transactions on the Monero network using the [monero-javascript](https://github.com/monero-ecosystem/monero-javascript) library.

## How to Run in a Browser
1. Download and install [Monero CLI](https://getmonero.org/downloads/)
2. Start monero-daemon-rpc with authentication and CORS access.  For example: `./monerod --stagenet --rpc-login superuser:abctesting123 --rpc-access-control-origins http://localhost:9100`
3. `git clone https://github.com/woodser/monero-tx-generator`
4. `cd monero-tx-generator`
5. `npm install`
6. `./bin/start_dev_browser`
7. Access web app at http://localhost:9100