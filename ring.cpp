#include "ring.h"
#include "ringImpl.h"

json newRing()
{
    auto &&ring = generate();

    json j;
    j["q"] = toString(ring.q);
    j["g"] = toString(ring.g);
    return j;
}
