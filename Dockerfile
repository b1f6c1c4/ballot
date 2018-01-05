FROM gcc:7

MAINTAINER b1f6c1c4, <b1f6c1c4@gmail.com>

RUN \
    apt-get update \
    && apt-get install -y python-dev

RUN \
    curl -fsSL "https://downloads.sourceforge.net/project/boost/boost/1.66.0/boost_1_66_0.tar.bz2?r=https%3A%2F%2Fsourceforge.net%2Fprojects%2Fboost%2Ffiles%2Fboost%2F1.66.0%2F&ts=1515136452&use_mirror=phoenixnap" \
        -o boost_1_66_0.tar.bz2 \
    && tar --bzip2 -xf boost_1_66_0.tar.bz2 \
    && rm -f boost_1_66_0.tar.bz2 \
    && cd boost_1_66_0 \
    && ./bootstrap.sh --prefix=/usr/local

RUN \
    cd boost_1_66_0 \
    && ./b2 -q -a -sHAVE_ICU=1 \
    && ./b2 install \
    && cd .. \
    && rm -rf boost_1_66_0

RUN \
    git clone --depth=1 "https://github.com/weidai11/cryptopp" \
    && cd cryptopp \
    && make \
    && make install \
    && cd .. \
    && rm -rf cryptopp

RUN \
    git clone --depth=1 "https://github.com/CopernicaMarketingSoftware/AMQP-CPP" \
    && cd AMQP-CPP \
    && make \
    && make install \
    && cd .. \
    && rm -rf AMQP-CPP

RUN \
    git clone --depth=1 "https://github.com/P-H-C/phc-winner-argon2" \
    && cd phc-winner-argon2 \
    && make \
    && make install \
    && cd .. \
    && rm -rf phc-winner-argon2

RUN \
    curl -SL "https://raw.githubusercontent.com/nlohmann/json/develop/src/json.hpp" \
        -o json.hpp \
    && mv json.hpp /usr/local/include
