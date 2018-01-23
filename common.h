#pragma once
#include <string>
#include <boost/core/noncopyable.hpp>
#include <spdlog/spdlog.h>
#include <json.hpp>

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
public:
    inline void setLoggingLevel(spdlog::level::level_enum level)
    {
        logger->set_level(level);
    }

protected:
    inline explicit Logger(std::string &&name) : logger(spdlog::stdout_color_mt(name))
    {
#ifdef IS_TEST
        logger->set_level(spdlog::level::off);
#endif
    }

    std::shared_ptr<spdlog::logger> logger;
};
