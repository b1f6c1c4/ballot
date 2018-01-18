#define BOOST_TEST_MODULE argonImpl
#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>

#include "../argonImpl.h"

BOOST_AUTO_TEST_SUITE(toString_test);

BOOST_AUTO_TEST_CASE(tostr)
{
	Buffer<8> v = { 0x00, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xde };
	auto &&res = toString(v);
	BOOST_TEST(res == "0034567890abcdde");
}

BOOST_AUTO_TEST_SUITE_END();

BOOST_AUTO_TEST_SUITE(fromJson_test);

BOOST_AUTO_TEST_CASE(throws_no)
{
    json j;

    BOOST_CHECK_THROW(fromJson<8>(j["key"]), std::exception);
}

BOOST_AUTO_TEST_CASE(throws_number)
{
    json j;
    j["key"] = 123;

    BOOST_CHECK_THROW(fromJson<8>(j["key"]), std::exception);
}

BOOST_AUTO_TEST_CASE(throws_object)
{
    json j;
    j["key"]["val"] = "abcde";

    BOOST_CHECK_THROW(fromJson<8>(j["key"]), std::exception);
}

BOOST_AUTO_TEST_CASE(throws_array)
{
    json j;
    j["key"] = { "abc" };

    BOOST_CHECK_THROW(fromJson<8>(j["key"]), std::exception);
}

BOOST_AUTO_TEST_CASE(full)
{
    std::string str = "0034567890abcdde";

    json j;
    j["key"] = str;

    auto &&v = fromJson<8>(j["key"]);
    for (auto i = 0; i < 8; i++)
    {
        uint8_t b = std::stoi(str.substr(i * 2, 2), 0, 16);
        BOOST_TEST(v[i] == b);
    }
}

BOOST_AUTO_TEST_SUITE_END();

BOOST_AUTO_TEST_SUITE(genSalt_test);

BOOST_AUTO_TEST_CASE(nothrow)
{
	BOOST_CHECK_NO_THROW(genSalt());
}

BOOST_AUTO_TEST_SUITE_END();

BOOST_AUTO_TEST_SUITE(runArgon_test);

BOOST_AUTO_TEST_CASE(argon)
{
	std::string rawsalt = "qwertyuiopzxcvbn";
	ArgonSaltType salt;
	std::copy(rawsalt.begin(), rawsalt.begin() + SALT_BYTE, salt.data());

	std::string hx = "03028213517a805207dddd9db5f8d88e";
	auto &&v = runArgon("asdfghjkl", salt);
    for (auto i = 0; i < HASH_BYTE; i++)
    {
        uint8_t b = std::stoi(hx.substr(i * 2, 2), 0, 16);
        BOOST_TEST(v[i] == b);
    }
}

BOOST_AUTO_TEST_SUITE_END();
