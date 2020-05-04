## Description

Generates transactions on the Monero network using the [monero-javascript](https://github.com/monero-ecosystem/monero-javascript) library.

## How to Run in a Browser
1. Download and install [Monero CLI](https://getmonero.org/downloads/)
2. Start monero-daemon-rpc with authentication and CORS access.  For example: `./monerod --stagenet --rpc-login superuser:abctesting123 --rpc-access-control-origins http://localhost:9100`
3. `git clone https://github.com/woodser/monerostresstester.com`
4. `cd monerostresstester.com`
5. `npm install`
6. `./bin/build_browser_app.sh`
7. Access web app at http://localhost:9100