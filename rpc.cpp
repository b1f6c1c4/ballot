#include "rpc.h"
#include <SimpleAmqpClient/SimpleAmqpClient.h>

std::string Rpc::executeRpcs(const std::string &str, RpcHandler executer)
{
    json reqs;
    try
    {
        logger->debug("Try parse json...");
        reqs = std::move(json::parse(str));
        if (reqs.is_object())
        {
            logger->trace("Single jsonrpc");
            auto &&j = executeRpc(reqs, executer);
            logger->trace("Execution succeed");
            return j.dump();
        }
        if (reqs.is_array() && !reqs.empty())
        {
            logger->trace("Batch jsonrpc");
            auto errored = false;
            json ress = json::array();
            for (auto &&it : reqs)
            {
                if (!it.is_object())
                {
                    logger->error("Batch verify wrong");
                    errored = true;
                    break;
                }
                logger->trace("Single jsonrpc in batch");
                ress.push_back(std::move(executeRpc(it, executer)));
            }
            if (!errored)
            {
                logger->trace("Execution succeed");
                return ress.dump();
            }
        }

        logger->error("Invalid jsonrpc");
        json res;
        res["jsonrpc"] = "2.0";
        res["id"] = nullptr;
        res["error"]["code"] = -32600;
        res["error"]["message"] = "Invalid Request";
        return res.dump();
    }
    catch (std::exception)
    {
        logger->error("Json parse error");
        json res;
        res["jsonrpc"] = "2.0";
        res["id"] = nullptr;
        res["error"]["code"] = -32700;
        res["error"]["message"] = "Parse error";
        return res.dump();
    }
}

json Rpc::executeRpc(const json &req, RpcHandler executer)
{
    logger->trace("executeRpc core");

    json res;
    res["jsonrpc"] = "2.0";
    res["id"] = nullptr;

    std::string method;
    try
    {
        logger->trace("Getting id");
        res["id"] = req.at("id");
        logger->trace("Getting method");
        if (!req.at("method").is_string())
            throw std::invalid_argument{"method"};
        method = req["method"];
        logger->debug("Method: {}", method);
    }
    catch (const std::exception &ex)
    {
        logger->error(ex.what());
        res["error"]["code"] = -32600;
        res["error"]["message"] = "Invalid Request";
        return res;
    }

    json par;
    try
    {
        par = req.at("param");
        logger->debug("Param: defined");
    }
    catch (std::exception)
    {
        logger->warn("Param: undefined");
        par = nullptr;
    }

    try
    {
        logger->trace("Calling executer");
        auto &&result = executer(method, par);
        logger->trace("Returned from executer, code {}", result.code);
        if (result.code == 0)
        {
            res["result"] = result.data;
        }
        else
        {
            logger->warn("Executer: {}, {}", result.code, result.message);
            res["error"]["code"] = result.code;
            res["error"]["message"] = result.message;
            if (result.data != nullptr)
                res["error"]["data"] = result.data;
        }
        return res;
    }
    catch (const std::exception &ex)
    {
        logger->error(ex.what());
        res["error"]["code"] = -32603;
        res["error"]["message"] = "Internal error";
        return res;
    }
}

// LCOV_EXCL_START
void Rpc::runRpc(RpcHandler executer)
{
    logger->trace("runRpc()");

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

    logger->info("Connecting {}", host);
    logger->info("Username {}", username);
    logger->debug("Channel::Create ...");
    auto &&channel = AmqpClient::Channel::Create(host, 5672, username, password);
    logger->trace("Channel::Create done");

    logger->debug("Channel::Declare ...");
    channel->DeclareQueue("cryptor", false, true, false, false);
    logger->trace("Channel::Declare done");

    logger->debug("Channel::BasicConsume...");
    auto &&consumerTag = channel->BasicConsume("cryptor", "", true, false, false, 1);
    logger->info("Consumer tag: {}", consumerTag);

    while (true)
        try
        {
            logger->trace("Channel::BasicConsumeMessage...");
            auto &&envelope = channel->BasicConsumeMessage(consumerTag);
            logger->trace("Channel::BasicConsumeMessage done");
            auto &&message = envelope->Message();
            auto &&body = message->Body();
            auto &&replyTo = message->ReplyTo();
            logger->info("Message from {}", replyTo);
            if (replyTo.empty())
            {
                logger->warn("replyTo is empty");
                logger->trace("Channel::BasicReject...");
                channel->BasicReject(envelope, false);
                logger->trace("Channel::BasicReject done");
                continue;
            }

            logger->trace("executeRpcs...");
            auto &&res = executeRpcs(body, executer);
            logger->trace("executeRpcs done");

            logger->trace("BasicMessage::Create");
            auto &&reply = AmqpClient::BasicMessage::Create(res);
            logger->trace("Channel::BasicPublish...");
            channel->BasicPublish("", replyTo, reply, false, false);
            logger->trace("Channel::BasicPublish done");

            logger->trace("Channel::BasicAck...");
            channel->BasicAck(envelope);
            logger->trace("Channel::BasicAck done");
        }
        catch (const std::exception &ex)
        {
            logger->error(ex.what());
        }
}
// LCOV_EXCL_STOP
