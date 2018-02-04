package main

import (
    "os"
    "fmt"
    "log"
    "encoding/json"
    "github.com/streadway/amqp"
    "gopkg.in/guregu/null.v3"
)

func failOnError(err error, msg string) {
    if err != nil {
        log.Fatalf("%s: %s", msg, err)
    }
}

type PasswordParam struct {
    Password string `json:"password"`
    Salt string `json:"salt"`
}

type PasswordResult struct {
    Hash string `json:"hash"`
    Salt string `json:"salt"`
}

type JsonRpcError struct {
    Code int `json:"code"`
    Message string `json:"message"`
}

type JsonRpcRequest struct {
    JsonRpc string `json:"jsonrpc"`
    Method string `json:"method"`
    Param PasswordParam `json:"param"`
    Id null.Int `json:"id"`
}

type JsonRpcResponse interface {
}

type JsonRpcRes struct {
    JsonRpc string `json:"jsonrpc"`
    Result PasswordResult `json:"result"`
    Id null.Int `json:"id"`
}

type JsonRpcErr struct {
    JsonRpc string `json:"jsonrpc"`
    Error JsonRpcError `json:"error"`
    Id null.Int `json:"id"`
}

func main() {
    rabbitUser := os.Getenv("RABBIT_USER")
    if rabbitUser == "" {
        rabbitUser = "guest"
    }
    rabbitPass := os.Getenv("RABBIT_PASS")
    if rabbitPass == "" {
        rabbitPass = "guest"
    }
    rabbitHost := os.Getenv("RABBIT_HOST")
    if rabbitHost == "" {
        rabbitHost = "localhost"
    }
    log.Printf("Rabbit host: %s", rabbitHost)
    log.Printf("Rabbit user: %s", rabbitUser)
    rabbit := fmt.Sprintf("amqp://%s:%s@%s:5672/", rabbitUser, rabbitPass, rabbitHost)
    conn, err := amqp.Dial(rabbit)
    failOnError(err, "Failed to connect to RabbitMQ")
    defer conn.Close()

    ch, err := conn.Channel()
    failOnError(err, "Failed to open a channel")
    defer ch.Close()

    q, err := ch.QueueDeclare(
        "auth", // name
        true,  // durable
        false,  // delete when unused
        false,  // exclusive
        false,  // no-wait
        nil,    // arguments
    )
    failOnError(err, "Failed to declare a queue")

    err = ch.Qos(
        1,     // prefetch count
        0,     // prefetch size
        false, // global
    )
    failOnError(err, "Failed to set QoS")

    msgs, err := ch.Consume(
        q.Name, // queue
        "",     // consumer
        false,  // auto-ack
        false,  // exclusive
        false,  // no-local
        false,  // no-wait
        nil,    // args
    )
    failOnError(err, "Failed to register a consumer")

    forever := make(chan bool)

    go func() {
        for d := range msgs {
            log.Printf("[Rpc] Message from %s", d.ReplyTo)
            log.Printf("[Rpc] Request: %s", d.Body)

            var m JsonRpcRequest
            var res JsonRpcResponse
            err = json.Unmarshal(d.Body, &m)
            if err != nil {
                res = JsonRpcErr{
                    JsonRpc: "2.0",
                    Error: JsonRpcError{
                        Code: -32700,
                        Message: "Parse error",
                    },
                    Id: null.Int{},
                }
            } else if m.JsonRpc != "2.0" {
                res = JsonRpcErr{
                    JsonRpc: "2.0",
                    Error: JsonRpcError{
                        Code: -32600,
                        Message: "Invalid Request",
                    },
                    Id: m.Id,
                }
            } else if m.Method != "password" {
                res = JsonRpcErr{
                    JsonRpc: "2.0",
                    Error: JsonRpcError{
                        Code: -32601,
                        Message: "Method not found",
                    },
                    Id: m.Id,
                }
            } else {
                res = JsonRpcRes{
                    JsonRpc: "2.0",
                    Result: PasswordResult{
                        Hash: "1",
                        Salt: "2",
                    },
                    Id: m.Id,
                }
            }

            str, err := json.Marshal(res)
            if err != nil {
                log.Printf("[Rpc] Error during marshal: %s", err)
                str = []byte(`{"jsonrpc":"2.0","error":{"code":-32603,"message":"Internal error"},"id":null}`)
            }

            log.Printf("[Rpc] Response: %s", str)

            err = ch.Publish(
                "",        // exchange
                d.ReplyTo, // routing key
                false,     // mandatory
                false,     // immediate
                amqp.Publishing{
                    ContentType: "application/json",
                    Body: str,
                },
            )
            if err != nil {
                log.Printf("[Rpc] Error during reply: %s", err)
            }

            d.Ack(false)
        }
    }()

    log.Printf("[Main] Listening auth")
    <-forever
}
