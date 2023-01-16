FROM ubuntu:22.04
RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
    && localedef -i ko_KR -c -f UTF-8 -A /usr/share/locale/locale.alias ko_KR.UTF-8
ENV LANG ko_KR.utf8
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN npx playwright install-deps
RUN cd ~
RUN mkdir .aws
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install && npx playwright install
COPY . .
