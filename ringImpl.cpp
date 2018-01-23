#include "ringImpl.h"
#include <cryptopp/misc.h>
#include <cryptopp/osrng.h>
#include <cryptopp/nbtheory.h>
#include <cryptopp/sha3.h>

using namespace CryptoPP;

MathRing::MathRing(RingData &&ring) :
    RingData(std::move(ring)),
    maq(RingData::q),
    maqm1((Integer(RingData::q) -= Integer::One())) {}
MathRing::MathRing(const RingData &ring) :
    RingData(ring),
    maq(RingData::q),
    maqm1((Integer(RingData::q) -= Integer::One())) {}

Integer RingImpl::fromJson(const json &j)
{
    if (!j.is_string())
        throw std::exception{};

    auto &&str = j.get<std::string>() + "h";
    return Integer(str.c_str());
}

std::string RingImpl::toString(const Integer &v)
{
    auto &&str = IntToString(v, 16);
    auto length = str.length();

    if (length < WIDTH_HEXCHAR)
        str.insert(0, WIDTH_HEXCHAR - length, '0');

    return str;
}

#ifndef IS_TEST_RING
RingData RingImpl::generate()
{
    AutoSeededRandomPool prng;
    PrimeAndGenerator pg;

    pg.Generate(1, prng, WIDTH_BIT + 1, WIDTH_BIT);

    RingData ring;
    ring.q = pg.SubPrime();
    ring.g = pg.Generator();
    return ring;
}
#endif

size_t RingImpl::fillBuffer(const Integer &v, byte *buffer)
{
    v.Encode(buffer, WIDTH_BYTE);
    return WIDTH_BYTE;
}

Integer RingImpl::readBuffer(const byte *buffer, size_t len)
{
    Integer v;
    v.Decode(buffer, len);
    return v;
}

Integer RingImpl::groupHash(const byte *buffer, size_t len, const MathRing &ring)
{
    SHA3_512 raw;

    byte digest[SHA3_512::DIGESTSIZE];
    raw.CalculateDigest(digest, buffer, len);

    auto &&hash = readBuffer(digest, SHA3_512::DIGESTSIZE);
    return ring.maq.Exponentiate(ring.g, hash);
}
