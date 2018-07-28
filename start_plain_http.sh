#!/bin/bash

set -eo pipefail

node server.js &
node plain_http.js

