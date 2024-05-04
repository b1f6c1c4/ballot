#include "common.h"
#include "node_modules/node-addon-api/napi.h"
#include "ring.h"

using namespace Napi;

#ifndef VERSION
#define VERSION "UNKNOWN"
#endif

#ifndef COMMITHASH
#define COMMITHASH "UNKNOWN"
#endif

extern size_t g_WIDTH_BIT;

Value Status(const CallbackInfo &info)
{
    return String::New(info.Env(), "Ok");
};

class NewRingWorker : public AsyncWorker, public Logger
{
public:
    NewRingWorker(Function &cb)
        : Napi::AsyncWorker(cb), Logger("NewRing")
    {
        logger->debug("NewRingWorker(Function &)");
    };
    virtual ~NewRingWorker()
    {
        logger->debug("~NewRingWorker");
    };

    void Execute() override
    {
        res = Ring::Inst().newRing().dump();
        logger->debug("Result size: {}", res.size());
    }

protected:
    void OnOK() override
    {
        logger->debug("OnOk size: {}", res.size());
        Callback().Call({String::New(Env(), res)});
    }

    void OnError(const Napi::Error &e) override
    {
        logger->debug("OnError: {}", e.Message());
        Callback().Call({});
    }

private:
    std::string res;
};

Value NewRing(const CallbackInfo &info)
{
    auto callback = info[0].As<Function>();
    auto asyncWorker = new NewRingWorker(callback);
    asyncWorker->Queue();
    return {};
};

class GenHWorker : public AsyncWorker, public Logger
{
public:
    GenHWorker(Function &cb, String &par)
        : Napi::AsyncWorker(cb), Logger("GenH"), str(par.Utf8Value())
    {
        logger->debug("GenHWorker(Function &)");
    };
    virtual ~GenHWorker()
    {
        logger->debug("~GenHWorker");
    };

    void Execute() override
    {
        auto j = json::parse(str);
        res = Ring::Inst().genH(j).dump();
        logger->debug("Result size: {}", res.size());
    }

protected:
    void OnOK() override
    {
        logger->debug("OnOk size: {}", res.size());
        Callback().Call({String::New(Env(), res)});
    }

    void OnError(const Napi::Error &e) override
    {
        logger->debug("OnError: {}", e.Message());
        Callback().Call({});
    }

private:
    std::string str, res;
};

Value GenH(const CallbackInfo &info)
{
    auto callback = info[1].As<Function>();
    auto param = info[0].As<String>();
    auto asyncWorker = new GenHWorker(callback, param);
    asyncWorker->Queue();
    return {};
};

class VerifyWorker : public AsyncWorker, public Logger
{
public:
    VerifyWorker(Function &cb, String &par)
        : Napi::AsyncWorker(cb), Logger("Verify"), str(par.Utf8Value())
    {
        logger->debug("VerifyWorker(Function &)");
    };
    virtual ~VerifyWorker()
    {
        logger->debug("~VerifyWorker");
    };

    void Execute() override
    {
        auto j = json::parse(str);
        res = Ring::Inst().verify(j);
        logger->debug("Result: {}", res);
    }

protected:
    void OnOK() override
    {
        logger->debug("OnOk: {}", res);
        Callback().Call({Boolean::New(Env(), res)});
    }

    void OnError(const Napi::Error &e) override
    {
        logger->debug("OnError: {}", e.Message());
        Callback().Call({});
    }

private:
    std::string str;
    bool res;
};

Value Verify(const CallbackInfo &info)
{
    auto callback = info[1].As<Function>();
    auto param = info[0].As<String>();
    auto asyncWorker = new VerifyWorker(callback, param);
    asyncWorker->Queue();
    return {};
};

Object Initialize(Env env, Object exports) {
    const auto &&logger = Logger{"Main"}.logger;
    logger->info("Version {}", VERSION);
    logger->info("CommitHash {}", COMMITHASH);

    auto b = getenv("WIDTH_BIT");
    if (b && *b && (g_WIDTH_BIT = atoi(b)));
    else g_WIDTH_BIT = 2048;
    logger->info("Crypto width bit {}", g_WIDTH_BIT);

    exports["status"] = Function::New(env, Status, std::string("status"));
    exports["newRing"] = Function::New(env, NewRing, std::string("newRing"));
    exports["genH"] = Function::New(env, GenH, std::string("genH"));
    exports["verify"] = Function::New(env, Verify, std::string("verify"));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Initialize)
