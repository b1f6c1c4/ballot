#pragma once
#define SPDLOG_NO_EXCEPTIONS
#include <string>
#include <boost/core/noncopyable.hpp>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/stdout_color_sinks.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

#ifndef VERSION
#define VERSION "UNKNOWN"
#endif

#ifndef COMMITHASH
#define COMMITHASH "UNKNOWN"
#endif

#define LOGGABLE(cls) \
    private: \
        inline cls() : Logger(#cls) \
        { \
            logger->info(#cls " initialized"); \
        } \
    public: \
        static inline cls &Inst() \
        { \
            static cls inst; \
            return inst; \
        }

class Logger : private boost::noncopyable
{
protected:
    inline explicit Logger(std::string &&name) : logger(spdlog::stdout_color_mt(name)) {}

    std::shared_ptr<spdlog::logger> logger;
};
