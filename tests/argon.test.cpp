#define BOOST_TEST_MODULE argon
#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>

#include "../argon.h"

// Borrow some implemention ...
#define IS_TEST_ARGON
#include "../argonImpl.cpp"

// .. and mock the rest ...
ArgonSaltType genSalt()
{
	std::string rawsalt = "qwertyuiopzxcvbn";
	ArgonSaltType salt;
	std::copy(rawsalt.begin(), rawsalt.begin() + SALT_BYTE, salt.data());
	return salt;
}

// done

BOOST_AUTO_TEST_SUITE(argon2i_test);

BOOST_AUTO_TEST_CASE(gensalt)
{
	json j;
	j["password"] = "asdfghjkl";

	auto &&res = argon2i(j);
	auto &&salt = res.at("salt").get<std::string>();
	auto &&hash = res.at("hash").get<std::string>();
	BOOST_TEST(salt == "71776572747975696f707a786376626e");
	BOOST_TEST(hash == "03028213517a805207dddd9db5f8d88e");
}

BOOST_AUTO_TEST_CASE(usesalt)
{
	json j;
	j["password"] = "asdfghjkl";
	j["salt"] = "71776572747975696f707a786376626d";

	auto &&res = argon2i(j);
	auto &&salt = res.at("salt").get<std::string>();
	auto &&hash = res.at("hash").get<std::string>();
	BOOST_TEST(salt == "71776572747975696f707a786376626d");
	BOOST_TEST(hash == "307adbe399303fc1b79d7a82d386638a");
}

BOOST_AUTO_TEST_SUITE_END();
