#define BOOST_TEST_MODULE ringImpl
#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>

#include "../ringImpl.h"
#include <cryptopp/misc.h>

BOOST_AUTO_TEST_SUITE(fromJson_test);

BOOST_AUTO_TEST_CASE(full)
{
    std::string str = "a01a74f20a3e954e008308ba88c4f5e24ff6cd2e2f2155271dcc836fa14e052c361039b794028ba707d64e7b461ea5e7941d6dbb197a3d6ffc480a7675778989549375bf803df3ac6b52fb4c3f93f888434f310d24ae0ceafb6e87071b4a1a197ab9a094dc03a6b70b9e8e6bd304b576b97041f956eb8541f4dd4a6ebbd3b9b1ba595033818fae357dbd26cc17c2b9289798c6041518b7aa7ade0918bc60d502aa38e964455d0b3aedd15da0aacdba9625f22afc33a4af6e594d4579e63b87f61e77d5b917acd44e28ca08230391ffccb9fe3fe10dcf8cbce121d7c7be9354d9242886fbca034a2cd69f8c4bff2a261f14e2f9a1f7d6e227c9cad45958e0dee5e39f4006ab334752a2cd4d88bbdd67871f4a800d0b96111b2926260e4b1e62d8a6a743743aedb589d6b8871af09ab0dd30b6e1b43fca2f4a8c8403481e5fb6fd1ba3f8e7359e9eb7d6d2b59c50e5478d0bbb22b44940fadf12b729963383e67410f23b06d42fa902676f85686f479fb03a310da8379d91346ec949e301930a2f4652ba7c2356ae21cf52b4297ba21f7caab165c5973a3926649ad95326cd68968700182ca272f2872b3e9900e48e2ae22e29b7b5d5fbe4019f19a511c0d333311fdb2edf149754ef18a317ccd59296a7c30b1413b2899ba3a4d3280cd17dc4408c53c22401b4f3c358417e2a797765c2234c686df94682420ac651cfacb30dea";
    auto &&hstr = str + "h";

    json j;
    j["key"] = str;

    auto &&i = fromJson(j["key"]);
    BOOST_TEST(i == Integer(hstr.c_str()));
}

BOOST_AUTO_TEST_CASE(partial)
{
    std::string str = "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006b5a1c495fa960bc9b175dc530d3e3e5cc23ef89fda8506e392be0e8cbcab95a26ea3001d9a2caed7de97124bcbf993a0c939688a7a0c31e2a07ba87428c1fd06d5b26a05373fe1ba127d3e51f85070d0ae361afd3d6693848339a46924d24d74c72b333856ed5913f0f41b7acbe0871cacbb7f05069b1d381baaadf0ff1a9ba77e466f2818472620e95c1aa3ad0a444d00fb819bc2db219c7d25259ad89abbabcf6f2d589e6e66d58a2169cbb00a1336fa37b8ded6be500901d686984a2ae24cba2200b3c702c81360eff3f3bdbceda3d7edb9faef7f9bd80c3c58e6bd440f9eb420dcbadd11a4bf6a05021b6c20ea428dd7986a76875acb08ddf071542b";
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
    std::string str = "a01a74f20a3e954e008308ba88c4f5e24ff6cd2e2f2155271dcc836fa14e052c361039b794028ba707d64e7b461ea5e7941d6dbb197a3d6ffc480a7675778989549375bf803df3ac6b52fb4c3f93f888434f310d24ae0ceafb6e87071b4a1a197ab9a094dc03a6b70b9e8e6bd304b576b97041f956eb8541f4dd4a6ebbd3b9b1ba595033818fae357dbd26cc17c2b9289798c6041518b7aa7ade0918bc60d502aa38e964455d0b3aedd15da0aacdba9625f22afc33a4af6e594d4579e63b87f61e77d5b917acd44e28ca08230391ffccb9fe3fe10dcf8cbce121d7c7be9354d9242886fbca034a2cd69f8c4bff2a261f14e2f9a1f7d6e227c9cad45958e0dee5e39f4006ab334752a2cd4d88bbdd67871f4a800d0b96111b2926260e4b1e62d8a6a743743aedb589d6b8871af09ab0dd30b6e1b43fca2f4a8c8403481e5fb6fd1ba3f8e7359e9eb7d6d2b59c50e5478d0bbb22b44940fadf12b729963383e67410f23b06d42fa902676f85686f479fb03a310da8379d91346ec949e301930a2f4652ba7c2356ae21cf52b4297ba21f7caab165c5973a3926649ad95326cd68968700182ca272f2872b3e9900e48e2ae22e29b7b5d5fbe4019f19a511c0d333311fdb2edf149754ef18a317ccd59296a7c30b1413b2899ba3a4d3280cd17dc4408c53c22401b4f3c358417e2a797765c2234c686df94682420ac651cfacb30dea";
    auto &&hstr = str + "h";

    auto &&res = toString(Integer(hstr.c_str()));
    BOOST_TEST(res == str);
}

BOOST_AUTO_TEST_CASE(partial)
{
    std::string str = "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006b5a1c495fa960bc9b175dc530d3e3e5cc23ef89fda8506e392be0e8cbcab95a26ea3001d9a2caed7de97124bcbf993a0c939688a7a0c31e2a07ba87428c1fd06d5b26a05373fe1ba127d3e51f85070d0ae361afd3d6693848339a46924d24d74c72b333856ed5913f0f41b7acbe0871cacbb7f05069b1d381baaadf0ff1a9ba77e466f2818472620e95c1aa3ad0a444d00fb819bc2db219c7d25259ad89abbabcf6f2d589e6e66d58a2169cbb00a1336fa37b8ded6be500901d686984a2ae24cba2200b3c702c81360eff3f3bdbceda3d7edb9faef7f9bd80c3c58e6bd440f9eb420dcbadd11a4bf6a05021b6c20ea428dd7986a76875acb08ddf071542b";
    auto &&hstr = str + "h";

    auto &&res = toString(Integer(hstr.c_str()));
    BOOST_TEST(res == str);
}

BOOST_AUTO_TEST_SUITE_END();
