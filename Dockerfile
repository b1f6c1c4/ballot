FROM b1f6c1c4/ballot-builder

WORKDIR /root/cryptor

COPY . .

RUN make ci-test
RUN make all

FROM ubuntu:artful

WORKDIR /root/cryptor
COPY --from=0 /root/cryptor .
CMD ["./build/cryptor"]
