#define BOOST_TEST_MODULE argonImpl
#include "common.test.h"

#include "../argonImpl.h"

extern "C"
{
    int argon2i_hash_raw(
        const uint32_t t_cost, const uint32_t m_cost, const uint32_t parallelism,
        const void *pwd, const size_t pwdlen,
        const void *salt, const size_t saltlen,
        void *hash, const size_t hashlen)
    {
        std::string pass = "asdfghjkl";
        std::string rawsalt = "qwertyuiopzxcvbn";
        std::string hx = "03028213517a805207dddd9db5f8d88e";

        BOOST_TEST(t_cost == HASH_T);
        BOOST_TEST(m_cost == (1<<HASH_M));
        BOOST_TEST(parallelism == HASH_P);
        BOOST_TEST_REQUIRE(pwdlen == pass.size());
        BOOST_TEST_REQUIRE(saltlen == SALT_BYTE);
        BOOST_TEST_REQUIRE(rawsalt.size() == SALT_BYTE);
        BOOST_TEST_REQUIRE(hashlen == HASH_BYTE);
        BOOST_TEST_REQUIRE(hx.size() == 2 * HASH_BYTE);

        for (size_t i = 0; i < pwdlen; i++)
        {
            auto b = reinterpret_cast<const uint8_t *>(pwd)[i];
            BOOST_TEST(b == pass[i]);
        }

        for (size_t i = 0; i < saltlen; i++)
        {
            auto b = reinterpret_cast<const uint8_t *>(salt)[i];
            BOOST_TEST(b == rawsalt[i]);
        }

        for (size_t i = 0; i < hashlen; i++)
        {
            uint8_t b = std::stoi(hx.substr(i * 2, 2), 0, 16);
            reinterpret_cast<uint8_t *>(hash)[i] = b;
        }

        return 0;
    }
}

BOOST_AUTO_TEST_SUITE(toString_test);

BOOST_AUTO_TEST_CASE(tostr)
{
    Buffer<8> v = { 0x00, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xde };
    auto &&res = ArgonImpl::Inst().toString(v);
    BOOST_TEST(res == "0034567890abcdde");
}

BOOST_AUTO_TEST_SUITE_END();

BOOST_AUTO_TEST_SUITE(fromJson_test);

BOOST_AUTO_TEST_CASE(throws_no)
{
    json j;

    BOOST_CHECK_THROW(ArgonImpl::Inst().fromJson<8>(j["key"]), std::exception);
}

BOOST_AUTO_TEST_CASE(throws_number)
{
    json j;
    j["key"] = 123;

    BOOST_CHECK_THROW(ArgonImpl::Inst().fromJson<8>(j["key"]), std::exception);
}

BOOST_AUTO_TEST_CASE(throws_object)
{
    json j;
    j["key"]["val"] = "abcde";

    BOOST_CHECK_THROW(ArgonImpl::Inst().fromJson<8>(j["key"]), std::exception);
}

BOOST_AUTO_TEST_CASE(throws_array)
{
    json j;
    j["key"] = { "abc" };

    BOOST_CHECK_THROW(ArgonImpl::Inst().fromJson<8>(j["key"]), std::exception);
}

BOOST_AUTO_TEST_CASE(full)
{
    std::string str = "0034567890abcdde";

    json j;
    j["key"] = str;

    auto &&v = ArgonImpl::Inst().fromJson<8>(j["key"]);
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
    BOOST_CHECK_NO_THROW(ArgonImpl::Inst().genSalt());
}

BOOST_AUTO_TEST_SUITE_END();

BOOST_AUTO_TEST_SUITE(runArgon_test);

BOOST_AUTO_TEST_CASE(argon)
{
    std::string rawsalt = "qwertyuiopzxcvbn";
    ArgonSaltType salt;
    std::copy(rawsalt.begin(), rawsalt.begin() + SALT_BYTE, salt.data());

    std::string hx = "03028213517a805207dddd9db5f8d88e";
    auto &&v = ArgonImpl::Inst().runArgon("asdfghjkl", salt);
    for (auto i = 0; i < HASH_BYTE; i++)
    {
        uint8_t b = std::stoi(hx.substr(i * 2, 2), 0, 16);
        BOOST_TEST(v[i] == b);
    }
}

BOOST_AUTO_TEST_SUITE_END();
