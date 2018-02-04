FROM golang:latest
WORKDIR /go/src/github.com/b1f6c1c4/ballot/auth/
COPY *.go .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o auth .

FROM alpine:latest
WORKDIR /root/
COPY --from=0 /go/src/github.com/b1f6c1c4/ballot/auth/auth .
CMD ["./auth"]
