FROM archlinux:base-devel

RUN pacman -Syu --noconfirm nodejs crypto++

WORKDIR /workdir

COPY docs docs/
COPY node_modules node_modules/
COPY server server/
COPY entrypoint.sh package.json VERSION.json ./

ENV LD_LIBRARY_PATH=/usr/local/lib
ENV NODE_ENV=production

ENTRYPOINT ["/workdir/entrypoint.sh"]
CMD ["server/index.js"]

EXPOSE 3000
