FROM archlinux:base-devel

RUN pacman -Syu --noconfirm nodejs crypto++

COPY docs docs/
COPY node_modules node_modules/
COPY package.json VERSION.json ./
COPY server server/

ENV LD_LIBRARY_PATH=/usr/local/lib
ENV NODE_ENV=production

CMD ["/usr/bin/node", "server/index.js"]

EXPOSE 3000
