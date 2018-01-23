#include <boost/test/included/unit_test.hpp>
#include "../argonImpl.h"

std::string g_pass;
std::string g_rawsalt;
std::string g_hx;

extern "C"
{
    int argon2i_hash_raw(
        const uint32_t t_cost, const uint32_t m_cost, const uint32_t parallelism,
        const void *pwd, const size_t pwdlen,
        const void *salt, const size_t saltlen,
        void *hash, const size_t hashlen)
    {

        BOOST_TEST(t_cost == HASH_T);
        BOOST_TEST(m_cost == (1<<HASH_M));
        BOOST_TEST(parallelism == HASH_P);
        BOOST_TEST_REQUIRE(pwdlen == g_pass.size());
        BOOST_TEST_REQUIRE(saltlen == SALT_BYTE);
        BOOST_TEST_REQUIRE(g_rawsalt.size() == SALT_BYTE);
        BOOST_TEST_REQUIRE(hashlen == HASH_BYTE);
        BOOST_TEST_REQUIRE(g_hx.size() == 2 * HASH_BYTE);

        for (size_t i = 0; i < pwdlen; i++)
        {
            auto b = reinterpret_cast<const uint8_t *>(pwd)[i];
            BOOST_TEST(b == g_pass[i]);
        }

        for (size_t i = 0; i < saltlen; i++)
        {
            auto b = reinterpret_cast<const uint8_t *>(salt)[i];
            BOOST_TEST(b == g_rawsalt[i]);
        }

        for (size_t i = 0; i < hashlen; i++)
        {
            uint8_t b = std::stoi(g_hx.substr(i * 2, 2), 0, 16);
            reinterpret_cast<uint8_t *>(hash)[i] = b;
        }

        return 0;
    }
}
