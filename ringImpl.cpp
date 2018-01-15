#include "ringImpl.h"
#include <cryptopp/misc.h>
#include <cryptopp/osrng.h>
#include <cryptopp/nbtheory.h>
#include <cryptopp/sha3.h>

using namespace CryptoPP;

MathRing::MathRing(Ring &&ring) : Ring(std::move(ring)), ma((Integer(Ring::p) -= Integer::One())) {}
MathRing::MathRing(const Ring &ring) : Ring(ring), ma((Integer(Ring::p) -= Integer::One())) {}

Integer fromJson(const json &j)
{
    if (!j.is_string())
        throw std::exception{};

    auto &&str = j.get<std::string>() + "h";
    return Integer(str.c_str());
}

std::string toString(const Integer &v)
{
    auto &&str = IntToString(v, 16);
    auto length = str.length();

    if (length < WIDTH_HEXCHAR)
        str.insert(0, WIDTH_HEXCHAR - length, '0');

    return str;
}

Ring generate()
{
    AutoSeededRandomPool prng;
    PrimeAndGenerator pg;

    pg.Generate(1, prng, WIDTH_BIT, WIDTH_BIT - 1);

    Ring ring;
    ring.p = pg.Prime();
    ring.g = pg.Generator();
    return ring;
}

size_t fillBuffer(const Integer &v, byte *buffer)
{
    v.Encode(buffer, WIDTH_BYTE);
    return WIDTH_BYTE;
}

Integer readBuffer(const byte *buffer, size_t len)
{
    Integer v;
    v.Decode(buffer, len);
    return v;
}

Integer groupHash(const byte *buffer, size_t len, const MathRing &ring)
{
    SHA3_512 raw;

    byte digest[SHA3_512::DIGESTSIZE];
    raw.CalculateDigest(digest, buffer, len);

    auto &&hash = readBuffer(digest, SHA3_512::DIGESTSIZE);
    return ring.ma.Exponentiate(ring.g, hash);
}
