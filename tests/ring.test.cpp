#define BOOST_TEST_MODULE ring
#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>

#include "../ring.h"

// Borrow some implemention ...
#define IS_TEST_RING
#include "../ringImpl.cpp"

// .. and mock the rest ...
Ring generate()
{
    Ring ring;
    ring.q = Integer(15485863);
    ring.g = Integer(6);
    return ring;
}

// done

BOOST_AUTO_TEST_SUITE(newRing_test);

BOOST_AUTO_TEST_CASE(gen)
{
    auto &&j = newRing();
    BOOST_TEST(j["q"] == "00000000000000000000000000ec4ba7");
    BOOST_TEST(j["g"] == "00000000000000000000000000000006");
}

BOOST_AUTO_TEST_SUITE_END();
