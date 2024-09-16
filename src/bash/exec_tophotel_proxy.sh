#!/bin/bash
xvfb-run --auto-servernum yarn node src/crawler/topHotel/crawlerProxy.js $1
