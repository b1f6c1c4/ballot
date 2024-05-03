#pragma once
#define SPDLOG_NO_EXCEPTIONS
#include <string>
#include <boost/core/noncopyable.hpp>
#include <spdlog/spdlog.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

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
    explicit Logger(std::string &&name);

    std::shared_ptr<spdlog::logger> logger;
};
