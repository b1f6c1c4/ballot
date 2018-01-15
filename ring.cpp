#include "ring.h"
#include "ringImpl.h"

json newRing()
{
    auto &&ring = generate();

    json j;
    j["p"] = toString(ring.p);
    j["g"] = toString(ring.g);
    return j;
}
