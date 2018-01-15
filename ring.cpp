#include "ring.h"
#include "ringImpl.h"

Ring getRing(const json &param)
{
    Ring ring;
    ring.q = fromJson(param["q"]);
    ring.g = fromJson(param["g"]);
    return ring;
}

json newRing()
{
    auto &&ring = generate();

    json j;
    j["q"] = toString(ring.q);
    j["g"] = toString(ring.g);
    return j;
}

json genH(const json &param)
{
    MathRing ring = getRing(param);

    auto &&pks = param["publicKeys"];
    auto num = pks.size();
    byte *buffer = new byte[WIDTH_BYTE * num];
    auto cur = buffer;
    for (auto it = pks.begin(); it != pks.end(); ++it)
        cur += fillBuffer(fromJson(*it), cur);
    auto &&h = groupHash(buffer, WIDTH_BYTE * num, ring);

    json j;
    j["h"] = toString(h);
    return j;
}
