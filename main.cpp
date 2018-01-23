#include "main.h"
#include <iostream>
#include "rpc.h"
#include "argon.h"
#include "ring.h"

RpcAnswer handler(const std::string &method, const json &data)
{
    try
    {
        if (method == "status")
        {
            json j;
            j["version"] = VERSION;
            j["commitHash"] = COMMITHASH;
            return j;
        }
        else if (method == "argon2i")
        {
            return Argon::Inst().argon2i(data);
        }
        else if (method == "newRing")
        {
            return Ring::Inst().newRing();
        }
        else if (method == "genH")
        {
            return Ring::Inst().genH(data);
        }
        else if (method == "verify")
        {
            json j;
            auto res = Ring::Inst().verify(data);
            j["valid"] = res ? 1 : 0;
            return j;
        }
        else
        {
            return RpcAnswer(-32601, "Method not found");
        }
    }
    catch (nlohmann::detail::type_error)
    {
        return RpcAnswer(-32602, "Invalid params");
    }
}

// LCOV_EXCL_START
#ifndef IS_TEST
int main(int argc, char *argv[])
{
    try
    {
        auto &&console = spdlog::stdout_color_mt("main");

        console->info("Version {}", VERSION);
        console->info("CommitHash {}", COMMITHASH);
        for (auto i = 0; i < argc; i++)
            console->info("Argv[{}]: {}", i, argv[i]);

        if (argc >= 2)
        {
            if (std::string(argv[1]) == "debug")
            {
                spdlog::set_level(spdlog::level::debug);
                console->info("Verbosity set to DEBUG");
            }
            else if (std::string(argv[1]) == "trace")
            {
                spdlog::set_level(spdlog::level::trace);
                console->info("Verbosity set to TRACE");
            }
        }

        try
        {
            console->debug("Run rpc");
            Rpc::Inst().runRpc(&handler);
        }
        catch (const std::exception &ex)
        {
            console->error(ex.what());
        }

        console->warn("Crypto Exited.");
    }
    catch (const spdlog::spdlog_ex &ex)
    {
        std::cout << "VERSION=" << VERSION << std::endl;
        std::cout << "COMMITHASH=" << COMMITHASH << std::endl;
        std::cout << "Log init failed: " << ex.what() << std::endl;
        return 1;
    }
    return 0;
}
#endif
// LCOV_EXCL_STOP
