#include "main.h"
#include "common.h"
#include "rpc.h"

#include <iostream>

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
            // runRpc(&handler);
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
