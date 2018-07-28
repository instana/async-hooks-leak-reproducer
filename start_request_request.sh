#!/bin/bash

set -eo pipefail

node server.js &
node request_request.js

