#include "main.h"
#include <iostream>
#include "rpc.h"
#include "argon.h"
#include "ring.h"

RpcAnswer Main::handler(const std::string &method, const json &data)
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
void Main::Setup(const po::variables_map &vm)
{
    auto &&verbose = vm["verbose"].as<std::string>();
    if (verbose == "trace") {
        spdlog::set_level(spdlog::level::trace);
    } else if (verbose == "debug") {
        spdlog::set_level(spdlog::level::debug);
    } else if (verbose == "info") {
        spdlog::set_level(spdlog::level::info);
    } else if (verbose == "warn") {
        spdlog::set_level(spdlog::level::warn);
    } else if (verbose == "error") {
        spdlog::set_level(spdlog::level::err);
    } else if (verbose == "fatal") {
        spdlog::set_level(spdlog::level::critical);
    } else if (verbose == "off") {
        spdlog::set_level(spdlog::level::off);
    } else {
        logger->warn("vm.verbose unknown {}", verbose);
        spdlog::set_level(spdlog::level::info);
    }

    logger->info("Version {}", VERSION);
    logger->info("CommitHash {}", COMMITHASH);

    auto &&sub = vm["subscribe"].as<std::string>();
    logger->debug("Will subscribe {}", sub);
    Rpc::Inst().setupRpc(sub);
    logger->debug("Setup done");
}

void Main::EventLoop()
{
    logger->info("Main::EventLoop");

    try
    {
        using namespace std::placeholders;
        logger->debug("Run rpc");
        Rpc::Inst().runRpc(std::bind(&Main::handler, this, _1, _2));
    }
    catch (const std::exception &ex)
    {
        logger->error(ex.what());
    }

    logger->warn("Crypto Exited.");
}

#ifndef IS_TEST
int main(int argc, char *argv[])
{
    try
    {
        po::options_description desc("Allowed options");
        desc.add_options()
            ("help,h", "produce help message")
            ("verbose,v", po::value<std::string>()->default_value("info"), "set logging level")
            ("subscribe,s", po::value<std::string>()->default_value("cryptor"), "channel to listen")
        ;

        po::variables_map vm;
        po::store(po::parse_command_line(argc, argv, desc), vm);
        po::notify(vm);

        if (vm.count("help")) {
            std::cout << desc << std::endl;
            return 1;
        }

        Main::Inst().Setup(vm);
        Main::Inst().EventLoop();
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
