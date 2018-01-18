#pragma once
#include "common.h"
#include "rpc.h"

RpcAnswer handler(const std::string &method, const json &data);
