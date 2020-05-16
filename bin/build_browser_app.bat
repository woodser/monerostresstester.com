ECHO OFF

rem delete contents of old browser build
IF EXIST browser_build (
rmdir /s /q browser_build
) ELSE (
mkdir browser_build
)

rem build browser tests
call npm run build_browser_app_windows

rem copy dependencies to browser build
copy node_modules\monero-javascript\dist\monero_core.js browser_build\monero_core.js
copy node_modules\monero-javascript\dist\monero_core.wasm browser_build\monero_core.wasm
copy node_modules\monero-javascript\dist\monero_core_keys.js browser_build\monero_core_keys.js
copy node_modules\monero-javascript\dist\monero_core_keys.wasm browser_build\monero_core_keys.wasm
copy node_modules\monero-javascript\dist\MoneroWebWorker.dist.js browser_build\MoneroWebWorker.dist.js
copy node_modules\monero-javascript\dist\MoneroWebWorker.dist.js.map browser_build\MoneroWebWorker.dist.js.map
xcopy src\main browser_build

rem start server
bin\start_dev_server.bat
