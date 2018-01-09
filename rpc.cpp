#include "rpc.h"
#include <SimpleAmqpClient/SimpleAmqpClient.h>
#include <iostream>

void runRpc()
{
    auto &&console = spdlog::stdout_color_mt("rpc");

    console->trace("runRpc()");

    auto rawHost = std::getenv("RABBIT_HOST");
    std::string host = "localhost";
    if (rawHost != nullptr)
        host = std::string(rawHost);

    console->info("Connecting {}", host);
    console->debug("Channel::Create ...");
    auto &&channel = AmqpClient::Channel::Create(host);
    console->trace("Channel::Create done");

    console->debug("Channel::Declare ...");
    channel->DeclareQueue("cryptor", false, true, false, false);
    console->trace("Channel::Declare done");

    console->debug("Channel::BasicConsume...");
    auto &&consumerTag = channel->BasicConsume("cryptor", "", true, false, false, 1);
    console->info("Consumer tag: {}", consumerTag);

    while (true)
        try
        {
            console->trace("Channel::BasicConsumeMessage...");
            auto &&envelope = channel->BasicConsumeMessage(consumerTag);
            console->trace("Channel::BasicConsumeMessage done");
            auto &&message = envelope->Message();
            auto &&body = message->Body();
            auto &&replyTo = message->ReplyTo();
            console->debug("Message from {}", replyTo);
            if (replyTo.empty())
            {
                console->warn("replyTo is empty");
                console->trace("Channel::BasicReject...");
                channel->BasicReject(envelope, false);
                console->trace("Channel::BasicReject done");
                continue;
            }

            // TODO: calculate

            console->trace("BasicMessage::Create");
            auto &&reply = AmqpClient::BasicMessage::Create(body);
            console->trace("Channel::BasicPublish...");
            channel->BasicPublish("", replyTo, reply, false, false);
            console->trace("Channel::BasicPublish done");

            console->trace("Channel::BasicAck...");
            channel->BasicAck(envelope);
            console->trace("Channel::BasicAck done");
        }
        catch (const std::exception &ex)
        {
            console->error(ex.what());
        }
}
