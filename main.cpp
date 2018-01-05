#include "main.h"
#include "common.h"

#include <iostream>

#ifndef IS_TEST
int main()
{
    try
    {
        auto console = spdlog::stdout_color_mt("console");

        console->info("Version {0}", VERSION);
        console->info("CommitHash {0}", COMMITHASH);

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
