#!/bin/bash
xvfb-run --auto-servernum yarn node src/crawler/hotelDetail/crawlerNormal.js $1
