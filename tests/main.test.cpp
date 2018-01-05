#define BOOST_TEST_MODULE Cryptor
#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>

#include "../main.h"

BOOST_AUTO_TEST_CASE(first_test)
{
    auto res = fun();
    BOOST_TEST(res == 2);
}
