#include "rpc.h"
#include <SimpleAmqpClient/SimpleAmqpClient.h>
#include <iostream>

std::string executeRpcs(const std::string &str, RpcHandler executer)
{
    json reqs;
    try
    {
        reqs = std::move(json::parse(str));
        if (reqs.is_object())
        {
            return executeRpc(reqs, executer).dump();
        }
        if (reqs.is_array() && !reqs.empty())
        {
            auto errored = false;
            json ress = json::array();
            for (auto &&it : reqs)
            {
                if (!it.is_object())
                {
                    errored = true;
                    break;
                }
                ress.push_back(std::move(executeRpc(it, executer)));
            }
            if (!errored)
                return ress.dump();
        }

        json res;
        res["jsonrpc"] = "2.0";
        res["id"] = nullptr;
        res["error"]["code"] = -32600;
        res["error"]["message"] = "Invalid Request";
        return res.dump();
    }
    catch (std::exception)
    {
        json res;
        res["jsonrpc"] = "2.0";
        res["id"] = nullptr;
        res["error"]["code"] = -32700;
        res["error"]["message"] = "Parse error";
        return res.dump();
    }
}

json executeRpc(const json &req, RpcHandler executer)
{
    json res;
    res["jsonrpc"] = "2.0";
    res["id"] = nullptr;

    std::string method;
    try
    {
        res["id"] = req.at("id");
        if (!req.at("method").is_string())
            throw std::exception();
        method = req["method"];
    }
    catch (std::exception)
    {
        res["error"]["code"] = -32600;
        res["error"]["message"] = "Invalid Request";
        return res;
    }

    json par;
    try
    {
        par = req.at("param");
    }
    catch (std::exception)
    {
        par = nullptr;
    }

    try
    {
        auto &&result = executer(method, par);
        if (result.code == 0)
        {
            res["result"] = result.data;
        }
        else
        {
            res["error"]["code"] = result.code;
            res["error"]["message"] = result.message;
            if (result.data != nullptr)
                res["error"]["data"] = result.data;
        }
        return res;
    }
    catch (std::exception)
    {
        res["error"]["code"] = -32603;
        res["error"]["message"] = "Internal error";
        return res;
    }
}

// LCOV_EXCL_START
void runRpc(RpcHandler executer)
{
    auto &&console = spdlog::stdout_color_mt("rpc");

    console->trace("runRpc()");

    auto rawHost = std::getenv("RABBIT_HOST");
    auto rawUsername = std::getenv("RABBIT_USER");
    auto rawPassword = std::getenv("RABBIT_PASS");
    std::string host = "localhost";
    std::string username = "guest";
    std::string password = "guest";
    if (rawHost != nullptr)
        host = std::string(rawHost);
    if (rawUsername != nullptr)
        username = std::string(rawUsername);
    if (rawPassword != nullptr)
        password = std::string(rawPassword);

    console->info("Connecting {}", host);
    console->info("Username {}", username);
    console->debug("Channel::Create ...");
    auto &&channel = AmqpClient::Channel::Create(host, 5672, username, password);
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

            console->trace("executeRpcs...");
            auto &&res = executeRpcs(body, executer);
            console->trace("executeRpcs done");

            console->trace("BasicMessage::Create");
            auto &&reply = AmqpClient::BasicMessage::Create(res);
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
// LCOV_EXCL_STOP
