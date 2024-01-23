#!/bin/bash
xvfb-run --auto-servernum yarn node src/crawler/topHotel/crawlerNormal.js $1
