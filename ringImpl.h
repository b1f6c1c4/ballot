#include "common.h"
#include <cryptopp/integer.h>

#define WIDTH_BIT 4096
#define WIDTH_BYTE (WIDTH_BIT / 8)
#define WIDTH_HEXCHAR (WIDTH_BIT / 4)

using namespace CryptoPP;

Integer fromJson(const json &j);

std::string toString(const Integer &v);
