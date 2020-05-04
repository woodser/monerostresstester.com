#!/bin/sh

# delete contents of old browser build
mkdir -p ./browser_build/ || exit 1
rm -r ./browser_build/ || exit 1

# build browser tests
npm run build_browser_app || exit 1

# copy dependencies to browser build
cp node_modules/monero-javascript/dist/monero_core.js browser_build/monero_core.js
cp node_modules/monero-javascript/dist/monero_core.wasm browser_build/monero_core.wasm
cp node_modules/monero-javascript/dist/monero_core_keys.js browser_build/monero_core_keys.js
cp node_modules/monero-javascript/dist/monero_core_keys.wasm browser_build/monero_core_keys.wasm
cp node_modules/monero-javascript/dist/MoneroWebWorker.dist.js browser_build/MoneroWebWorker.dist.js
cp node_modules/monero-javascript/dist/MoneroWebWorker.dist.js.map browser_build/MoneroWebWorker.dist.js.map
cp -R src/main/ browser_build/

# start server
./bin/start_dev_server.sh