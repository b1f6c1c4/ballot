#pragma once
#include "common.h"
#include <cryptopp/integer.h>
#include <cryptopp/modarith.h>

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
    Integer q;
    Integer g;
};

struct MathRing : public Ring
{
    ModularArithmetic maq;
    ModularArithmetic maqm1;

    MathRing(Ring &&ring);
    MathRing(const Ring &ring);
};

Integer fromJson(const json &j);

std::string toString(const Integer &v);

Ring generate();

size_t fillBuffer(const Integer &v, byte *buffer);

Integer readBuffer(const byte *buffer, size_t len);

Integer groupHash(const byte *buffer, size_t len, const MathRing &ring);
