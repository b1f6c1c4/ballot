#include "ringImpl.h"
#include <cryptopp/misc.h>

using namespace CryptoPP;

Integer fromJson(const json &j)
{
    if (!j.is_string())
        throw std::exception{};

    auto &&str = j.get<std::string>() + "h";
    return Integer(str.c_str());
}

std::string toString(const Integer &v)
{
    auto &&str = IntToString(v, 16);
    auto length = str.length();

    if (length < WIDTH_HEXCHAR)
        str.insert(0, WIDTH_HEXCHAR - length, '0');

    return str;
}
