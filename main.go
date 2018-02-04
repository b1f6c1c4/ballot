package main

import (
    "os"
    "fmt"
    "encoding/json"
    "github.com/streadway/amqp"
    "gopkg.in/guregu/null.v3"
    "golang.org/x/crypto/bcrypt"
    "github.com/juju/ansiterm"
    "github.com/juju/loggo"
    "github.com/juju/loggo/loggocolor"
)

var log = loggo.GetLogger("")
var VERSION string
var COMMITHASH string

func failOnError(err error, msg string) {
    if err != nil {
        log.Criticalf("%s: %s", msg, err)
        panic(fmt.Sprintf("%s: %s", msg, err))
    }
}

type PasswordParam struct {
    Password string `json:"password"`
    Hash null.String `json:"hash"`
}

type HashPasswordResult struct {
    Hash string `json:"hash"`
}

type VerifyPasswordResult struct {
    Valid int `json:"valid"`
}

type JsonRpcError struct {
    Code int `json:"code"`
    Message string `json:"message"`
    Data null.String `json:"data"`
}

type JsonRpcRequest struct {
    JsonRpc string `json:"jsonrpc"`
    Method string `json:"method"`
    Param PasswordParam `json:"param"`
    Id null.Int `json:"id"`
}

type JsonRpcParam interface { }
type JsonRpcResult interface { }
type JsonRpcResponse interface { }

type JsonRpcRes struct {
    JsonRpc string `json:"jsonrpc"`
    Result JsonRpcResult `json:"result"`
    Id null.Int `json:"id"`
}

type JsonRpcErr struct {
    JsonRpc string `json:"jsonrpc"`
    Error JsonRpcError `json:"error"`
    Id null.Int `json:"id"`
}

func ExecuteHash(param PasswordParam) (HashPasswordResult, *JsonRpcError) {
    log.Tracef("[Auth] ExecuteHash")

    bytes, err := bcrypt.GenerateFromPassword([]byte(param.Password), 14)

    var a HashPasswordResult
    var e *JsonRpcError
    if err == nil {
        log.Infof("[Auth] Hash generated")
        a = HashPasswordResult{
            Hash: string(bytes),
        }
    } else {
        log.Errorf("[Auth] Error during hash: %s", err)
        e = &JsonRpcError{
            Code: -32603,
            Message: "Internal error",
            Data: null.StringFrom(err.Error()),
        }
    }
    return a, e
}

func ExecuteVerify(param PasswordParam) (VerifyPasswordResult, *JsonRpcError) {
    log.Tracef("[Auth] ExecuteVerify")

    hash := param.Hash.ValueOrZero()
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(param.Password))

    var a VerifyPasswordResult
    var e *JsonRpcError
    if err == nil {
        log.Infof("[Auth] Password verified")
        a = VerifyPasswordResult{
            Valid: 1,
        }
    } else if err == bcrypt.ErrMismatchedHashAndPassword {
        log.Infof("[Auth] Password wrong")
        a = VerifyPasswordResult{
            Valid: 0,
        }
    } else {
        log.Errorf("[Auth] Error during verify: %s", err)
        e = &JsonRpcError{
            Code: -32603,
            Message: "Internal error",
            Data: null.StringFrom(err.Error()),
        }
    }
    return a, e
}

func main() {
    loggocolor.SeverityColor = map[loggo.Level]*ansiterm.Context{
        loggo.TRACE:   ansiterm.Foreground(ansiterm.Cyan),
        loggo.DEBUG:   ansiterm.Foreground(ansiterm.Cyan),
        loggo.INFO:    ansiterm.Foreground(ansiterm.Green),
        loggo.WARNING: ansiterm.Foreground(ansiterm.BrightYellow),
        loggo.ERROR:   ansiterm.Foreground(ansiterm.BrightRed),
        loggo.CRITICAL: &ansiterm.Context{
            Foreground: ansiterm.White,
            Background: ansiterm.Red,
        },
    }
    loggocolor.LocationColor = ansiterm.Foreground(ansiterm.Default)

    loggo.RemoveWriter("default")
    loggo.RegisterWriter("default", loggocolor.NewWriter(os.Stdout))

    verbosity := os.Args[2]
    switch verbosity {
    case "fatal":
        log.SetLogLevel(loggo.CRITICAL)
    case "error":
        log.SetLogLevel(loggo.ERROR)
    case "warn":
        log.SetLogLevel(loggo.WARNING)
    case "info":
        log.SetLogLevel(loggo.INFO)
    case "debug":
        log.SetLogLevel(loggo.DEBUG)
    case "trace":
        log.SetLogLevel(loggo.TRACE)
    default:
        log.SetLogLevel(loggo.INFO)
    }
    log.Infof("[Main] Verbosity: %s", verbosity)
    log.Infof("[Main] VERSION: %s", VERSION)
    log.Infof("[Main] COMMITHASH: %s", COMMITHASH)

    channelName := os.Args[1]
    log.Infof("[Main] Channel name: %s", channelName)

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

    log.Infof("[Main] Rabbit host: %s", rabbitHost)
    log.Infof("[Main] Rabbit user: %s", rabbitUser)
    rabbit := fmt.Sprintf("amqp://%s:%s@%s:5672/", rabbitUser, rabbitPass, rabbitHost)

    log.Debugf("[Main] amqp.Dial")
    log.Tracef("[Main] url: %s", rabbit)
    conn, err := amqp.Dial(rabbit)
    failOnError(err, "Failed to connect to RabbitMQ")
    defer conn.Close()

    log.Debugf("[Main] conn.Channel")
    ch, err := conn.Channel()
    failOnError(err, "Failed to open a channel")
    defer ch.Close()

    log.Debugf("[Main] ch.QueueDeclare")
    q, err := ch.QueueDeclare(
        channelName, // name
        true,        // durable
        false,       // delete when unused
        false,       // exclusive
        false,       // no-wait
        nil,         // arguments
    )
    failOnError(err, "Failed to declare a queue")

    log.Debugf("[Main] ch.Qos")
    err = ch.Qos(
        1,     // prefetch count
        0,     // prefetch size
        false, // global
    )
    failOnError(err, "Failed to set QoS")

    log.Debugf("[Main] ch.Consume")
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

    log.Tracef("[Main] go func")
    go func() {
        log.Infof("[Main] Listening auth")
        for d := range msgs {
            log.Infof("[Rpc] Message from %s", d.ReplyTo)

            if d.ReplyTo == "" {
                log.Warningf("[Rpc] Rejecting")
                d.Reject(false)
                continue
            }

            var m JsonRpcRequest
            var res JsonRpcResponse
            err = json.Unmarshal(d.Body, &m)
            if err != nil {
                log.Warningf("[Rpc] Json parse error: %s", err)
                res = JsonRpcErr{
                    JsonRpc: "2.0",
                    Error: JsonRpcError{
                        Code: -32700,
                        Message: "Parse error",
                    },
                    Id: null.Int{},
                }
            } else if m.JsonRpc != "2.0" {
                log.Warningf("[Rpc] Json rpc version incorrect")
                res = JsonRpcErr{
                    JsonRpc: "2.0",
                    Error: JsonRpcError{
                        Code: -32600,
                        Message: "Invalid Request",
                    },
                    Id: m.Id,
                }
            } else if m.Method == "hashPassword" {
                log.Debugf("[Rpc] Method called: %s", m.Method)
                r, err := ExecuteHash(m.Param)
                if err == nil {
                    res = JsonRpcRes{
                        JsonRpc: "2.0",
                        Result: r,
                        Id: m.Id,
                    }
                } else {
                    res = JsonRpcErr{
                        JsonRpc: "2.0",
                        Error: *err,
                        Id: m.Id,
                    }
                }
            } else if m.Method == "verifyPassword" {
                log.Debugf("[Rpc] Method called: %s", m.Method)
                r, err := ExecuteVerify(m.Param)
                if err == nil {
                    res = JsonRpcRes{
                        JsonRpc: "2.0",
                        Result: r,
                        Id: m.Id,
                    }
                } else {
                    res = JsonRpcErr{
                        JsonRpc: "2.0",
                        Error: *err,
                        Id: m.Id,
                    }
                }
            } else {
                log.Errorf("[Rpc] Method not found: %s", m.Method)
                res = JsonRpcErr{
                    JsonRpc: "2.0",
                    Error: JsonRpcError{
                        Code: -32601,
                        Message: "Method not found",
                    },
                    Id: m.Id,
                }
            }

            str, err := json.Marshal(res)
            if err != nil {
                log.Errorf("[Rpc] Error during marshal: %s", err)
                str = []byte(`{"jsonrpc":"2.0","error":{"code":-32603,"message":"Internal error"},"id":null}`)
            }

            log.Debugf("[Rpc] Response: %s", str)

            err = ch.Publish(
                "",        // exchange
                d.ReplyTo, // routing key
                false,     // mandatory
                false,     // immediate
                amqp.Publishing{
                    Body: str,
                },
            )
            if err != nil {
                log.Errorf("[Rpc] Error during reply: %s", err)
            }

            d.Ack(false)
        }
    }()

    <-forever
}
