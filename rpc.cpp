#include "rpc.h"
#include <SimpleAmqpClient/SimpleAmqpClient.h>
#include <iostream>

void runRpc()
{
    auto &&console = spdlog::stdout_color_mt("rpc");

    console->debug("Channel::Create ...");
    auto &&channel = AmqpClient::Channel::Create("localhost");
    console->debug("Channel::Create done");

    console->debug("Channel::Declare ...");
    channel->DeclareQueue("cryptor", false, true, false, false);
    console->debug("Channel::Declare done");

    console->debug("Channel::BasicConsume...");
    auto &&consumerTag = channel->BasicConsume("cryptor", "", true, false, false, 1);
    console->info("Consumer tag: " + consumerTag);

    while (true)
        try
        {
            console->debug("Channel::BasicConsumeMessage...");
            auto &&envelope = channel->BasicConsumeMessage(consumerTag);
            console->debug("Channel::BasicConsumeMessage done");
            auto &&message = envelope->Message();
            auto &&body = message->Body();
            auto &&replyTo = message->ReplyTo();
            console->info("Message from " + replyTo);
            if (replyTo.empty())
            {
                console->warn("replyTo is empty");
                console->debug("Channel::BasicReject...");
                channel->BasicReject(envelope, false);
                console->debug("Channel::BasicReject done");
                continue;
            }

            // TODO: calculate

            auto &&reply = AmqpClient::BasicMessage::Create(body);
            console->debug("Channel::BasicPublish...");
            channel->BasicPublish("", replyTo, reply, false, false);
            console->debug("Channel::BasicPublish done");

            console->debug("Channel::BasicAck...");
            channel->BasicAck(envelope);
            console->debug("Channel::BasicAck done");
        }
        catch (const std::exception &ex)
        {
            console->error(ex.what());
        }
}
