package main

import (
    "os"
    "fmt"
    "log"
    "github.com/streadway/amqp"
)

func failOnError(err error, msg string) {
    if err != nil {
        log.Fatalf("%s: %s", msg, err)
    }
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

            err = ch.Publish(
                "",        // exchange
                d.ReplyTo, // routing key
                false,     // mandatory
                false,     // immediate
                amqp.Publishing{
                    ContentType:   "application/json",
                    Body:          []byte(d.Body),
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
