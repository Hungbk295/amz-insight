#!/bin/bash
xvfb-run --auto-servernum yarn node src/crawler/topHotel/crawlerImportant.js $1
