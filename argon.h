#pragma once
#include "common.h"

class Argon : public Logger
{
	LOGGABLE(Argon);
public:

	json argon2i(const json &param);
};
