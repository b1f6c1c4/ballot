#include <string>
#include <spdlog/spdlog.h>
#include <json.hpp>

using json = nlohmann::json;

#ifndef VERSION
#define VERSION "UNKNOWN"
#endif

#ifndef COMMITHASH
#define COMMITHASH "UNKNOWN"
#endif
