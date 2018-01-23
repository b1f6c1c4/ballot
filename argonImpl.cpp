#include "argonImpl.h"
#include <cryptopp/osrng.h>
#include <argon2.h>

#ifndef IS_TEST_ARGON
ArgonSaltType ArgonImpl::genSalt()
{
	logger->trace("ArgonImpl::genSalt");
	ArgonSaltType result;
	AutoSeededRandomPool gen;
	gen.GenerateBlock(result.data(), SALT_BYTE);
	return result;
}
#endif

ArgonHashType ArgonImpl::runArgon(const std::string &pwd, const ArgonSaltType &salt)
{
	logger->trace("ArgonImpl::runArgon");
	ArgonHashType result;
	argon2i_hash_raw(
		HASH_T, 1<<HASH_M, HASH_P,
		pwd.c_str(), pwd.length(),
		salt.data(), SALT_BYTE,
		result.data(), HASH_BYTE
	);
	return result;
}
