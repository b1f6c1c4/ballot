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
        : spdlog::stdout_color_st(name)) { }
