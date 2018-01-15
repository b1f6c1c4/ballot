#include "common.h"
#include <cryptopp/integer.h>

#ifndef IS_TEST
#define WIDTH_BIT 4096
#else
#define WIDTH_BIT 128
#endif
#define WIDTH_BYTE (WIDTH_BIT / 8)
#define WIDTH_HEXCHAR (WIDTH_BIT / 4)

using namespace CryptoPP;

struct Ring
{
    Integer p;
    Integer g;
};

Integer fromJson(const json &j);

std::string toString(const Integer &v);

Ring generate();

size_t fillBuffer(const Integer &v, byte *buffer);

Integer readBuffer(const byte *buffer, size_t len);
