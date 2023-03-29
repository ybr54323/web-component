#!/usr/bin/env bash
rm -rf dist
vue-cli-service build --target lib --name index ./lib/index.js --no-clean --report && 
vue-cli-service build --target lib --name TableForm/index ./lib/TableForm/index.js --no-clean --report
