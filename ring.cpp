#include "ring.h"
#include "ringImpl.h"
#include <iostream>

RingData getRing(const json &param)
{
    RingData ring;
    ring.q = RingImpl::Inst().fromJson(param.at("q"));
    ring.g = RingImpl::Inst().fromJson(param.at("g"));
    return ring;
}

json Ring::newRing()
{
    auto &&ring = RingImpl::Inst().generate();

    json j;
    j["q"] = RingImpl::Inst().toString(ring.q);
    j["g"] = RingImpl::Inst().toString(ring.g);
    return j;
}

json Ring::genH(const json &param)
{
    MathRing ring = getRing(param);

    auto &&pks = param.at("publicKeys");
    auto num = pks.size();
    byte *buffer = new byte[WIDTH_BYTE * num];
    auto cur = buffer;
    for (auto it = pks.begin(); it != pks.end(); ++it)
        cur += RingImpl::Inst().fillBuffer(RingImpl::Inst().fromJson(*it), cur);
    auto &&h = RingImpl::Inst().groupHash(buffer, WIDTH_BYTE * num, ring);

    json j;
    j["h"] = RingImpl::Inst().toString(h);
    return j;
}

bool Ring::verify(const json &param)
{
    MathRing ring = getRing(param);

    std::vector<Integer> y, s, c;

    auto &&pks = param.at("publicKeys");
    auto num = pks.size();
    y.reserve(num);
    for (auto it = pks.begin(); it != pks.end(); ++it)
        y.push_back(std::move(RingImpl::Inst().fromJson(*it)));

    auto &&ss = param.at("s");
    if (num != ss.size())
        throw std::exception{};
    s.reserve(num);
    for (auto it = ss.begin(); it != ss.end(); ++it)
        s.push_back(std::move(RingImpl::Inst().fromJson(*it)));

    auto &&cs = param.at("c");
    if (num != cs.size())
        throw std::exception{};
    c.reserve(num);
    for (auto it = cs.begin(); it != cs.end(); ++it)
        c.push_back(std::move(RingImpl::Inst().fromJson(*it)));


    auto &&payload = param.at("payload").get<std::string>();
    auto &&m = RingImpl::Inst().groupHash(reinterpret_cast<const byte *>(payload.c_str()), payload.length(), ring);
    auto &&h = RingImpl::Inst().fromJson(param.at("h"));
    auto &&t = RingImpl::Inst().fromJson(param.at("t"));

    auto sum = Integer::Zero();
    byte *buffer = new byte[WIDTH_BYTE * (2 + 2 * num)];
    RingImpl::Inst().fillBuffer(m, buffer);
    RingImpl::Inst().fillBuffer(t, buffer + WIDTH_BYTE);
    for (size_t i = 0; i < num; i++)
    {
        auto &&tmp1 = ring.maq.Exponentiate(ring.g, s[i]);
        auto &&tmp2 = ring.maq.Exponentiate(y[i], c[i]);
        auto &&u = ring.maq.Multiply(tmp1, tmp2);
        RingImpl::Inst().fillBuffer(u, buffer + WIDTH_BYTE * (2 + i));

        auto &&tmp3 = ring.maq.Exponentiate(h, s[i]);
        auto &&tmp4 = ring.maq.Exponentiate(t, c[i]);
        auto &&v = ring.maq.Multiply(tmp3, tmp4);
        RingImpl::Inst().fillBuffer(v, buffer + WIDTH_BYTE * (2 + num + i));

        sum = ring.maqm1.Add(sum, c[i]);
    }

    auto &&hx = RingImpl::Inst().groupHash(buffer, WIDTH_BYTE * (2 + 2 * num), ring);

    return sum == hx;
}
