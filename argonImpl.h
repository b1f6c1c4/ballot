#pragma once
#include "common.h"
#include <array>
#include <cryptopp/filters.h>
#include <cryptopp/hex.h>

using namespace CryptoPP;

template <size_t N>
using Buffer = std::array<byte, N>;

#ifndef IS_TEST
#define SALT_BIT 4096
#else
#define SALT_BIT 128
#endif
#define SALT_BYTE (SALT_BIT / 8)
#define SALT_HEXCHAR (SALT_BIT / 4)

typedef Buffer<SALT_BYTE> ArgonSaltType;

#ifndef IS_TEST
#define HASH_BIT 4096
#else
#define HASH_BIT 128
#endif
#define HASH_BYTE (HASH_BIT / 8)
#define HASH_HEXCHAR (HASH_BIT / 4)

typedef Buffer<HASH_BYTE> ArgonHashType;

#ifndef IS_TEST
#define HASH_T 64
#define HASH_M 14
#else
#define HASH_T 16
#define HASH_M 12
#endif
#define HASH_P 1

template <size_t N>
std::string toString(const Buffer<N> &v)
{
	std::string encoded;
	auto sink = new StringSink{encoded};
	auto hex = new HexEncoder{sink, false};
	ArraySource{v.data(), N, true, hex};
	return encoded;
}

template <size_t N>
Buffer<N> fromJson(const json &j)
{
	if (!j.is_string())
		throw std::exception{};

	auto &&str = j.get<std::string>();
	Buffer<N> decoded;
	auto sink = new ArraySink{decoded.data(), N};
	auto hex = new HexDecoder{sink};
	StringSource{str, true, hex};
	return decoded;
}

class ArgonImpl : public Logger
{
	LOGGABLE(ArgonImpl);
public:

	ArgonSaltType genSalt();

	ArgonHashType runArgon(const std::string &pwd, const ArgonSaltType &salt);
};
