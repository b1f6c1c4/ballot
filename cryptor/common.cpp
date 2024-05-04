#include "common.h"
#include <cstdlib>
#include <spdlog/sinks/stdout_sinks.h>
#include <spdlog/sinks/stdout_color_sinks.h>

bool has_env(const char *env)
{
    auto c = getenv(env);
    return c && *c;
}

Logger::Logger(std::string &&name)
    : logger(has_env("DISABLE_COLOR")
        ? spdlog::stdout_logger_st(name)
        : spdlog::stdout_color_st(name))
{
    auto env = getenv("BACKEND_LOG");
    if (!env)
        return;

    auto &&level = std::string(env);
    if (level == "trace") {
        spdlog::set_level(spdlog::level::trace);
    } else if (level == "debug") {
        spdlog::set_level(spdlog::level::debug);
    } else if (level == "info") {
        spdlog::set_level(spdlog::level::info);
    } else if (level == "warn") {
        spdlog::set_level(spdlog::level::warn);
    } else if (level == "error") {
        spdlog::set_level(spdlog::level::err);
    } else if (level == "fatal") {
        spdlog::set_level(spdlog::level::critical);
    } else if (level == "off") {
        spdlog::set_level(spdlog::level::off);
    } else {
        logger->warn("vm.level unknown {}", level);
        spdlog::set_level(spdlog::level::info);
    }
}
