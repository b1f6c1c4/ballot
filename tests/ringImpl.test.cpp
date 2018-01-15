#define BOOST_TEST_MODULE ringImpl
#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>

#include "../ringImpl.h"
#include <cryptopp/misc.h>
#include <cryptopp/osrng.h>
#include <cryptopp/nbtheory.h>

BOOST_AUTO_TEST_SUITE(fromJson_test);

BOOST_AUTO_TEST_CASE(full)
{
    std::string str = "a012badf1494f3c358417e2a797765c2";
    auto &&hstr = str + "h";

    json j;
    j["key"] = str;

    auto &&i = fromJson(j["key"]);
    BOOST_TEST(i == Integer(hstr.c_str()));
}

BOOST_AUTO_TEST_CASE(partial)
{
    std::string str = "0000000000000a962620e95c1aa3bdbc";
    auto &&hstr = str + "h";

    json j;
    j["key"] = str;

    auto &&i = fromJson(j["key"]);
    BOOST_TEST(i == Integer(hstr.c_str()));
}

BOOST_AUTO_TEST_SUITE_END();

BOOST_AUTO_TEST_SUITE(toString_test);

BOOST_AUTO_TEST_CASE(full)
{
    std::string str = "a012badf1494f3c358417e2a797765c2";
    auto &&hstr = str + "h";

    auto &&res = toString(Integer(hstr.c_str()));
    BOOST_TEST(res == str);
}

BOOST_AUTO_TEST_CASE(partial)
{
    std::string str = "0000000000000a962620e95c1aa3bdbc";
    auto &&hstr = str + "h";

    auto &&res = toString(Integer(hstr.c_str()));
    BOOST_TEST(res == str);
}

BOOST_AUTO_TEST_SUITE_END();

BOOST_AUTO_TEST_SUITE(generate_test);

BOOST_AUTO_TEST_CASE(gen)
{
    auto &&ring = generate();

    auto half = Integer::One();
    half <<= WIDTH_BIT - 1;

    AutoSeededRandomPool prng;
    BOOST_TEST(VerifyPrime(prng, ring.p));
    BOOST_TEST(ring.p > half);
}

BOOST_AUTO_TEST_SUITE_END();

BOOST_AUTO_TEST_SUITE(fillBuffer_test);

BOOST_AUTO_TEST_CASE(fill)
{
    std::string str = "0000000000000a962620e95c1aa3bdbch";
    Integer v(str.c_str());
    byte buffer[WIDTH_BYTE] = {0};

    auto res = fillBuffer(v, buffer);
    BOOST_TEST(res == WIDTH_BYTE);
    for (auto i = 0; i < WIDTH_BYTE; i++)
    {
        byte b = std::stoi(str.substr(i * 2, 2), 0, 16);
        BOOST_TEST(buffer[i] == b);
    }
}

BOOST_AUTO_TEST_SUITE_END();

BOOST_AUTO_TEST_SUITE(readBuffer_test);

BOOST_AUTO_TEST_CASE(read)
{
    std::string str = "0000000000000a962620e95c1aa3bdbch";
    byte buffer[WIDTH_BYTE] = {0};
    for (auto i = 0; i < WIDTH_BYTE; i++)
        buffer[i] = std::stoi(str.substr(i * 2, 2), 0, 16);

    Integer v0(str.c_str());
    auto &&v = readBuffer(buffer, WIDTH_BYTE);
    BOOST_TEST(v == v0);
}

BOOST_AUTO_TEST_SUITE_END();
