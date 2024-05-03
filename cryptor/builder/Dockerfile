FROM gcc:13

MAINTAINER b1f6c1c4, <b1f6c1c4@gmail.com>

RUN \
    git clone --depth=1 "https://github.com/weidai11/cryptopp" \
    && cd cryptopp \
    && make -j 8 \
    && make install \
    && cd .. \
    && rm -rf cryptopp

RUN \
    curl -SL "https://raw.githubusercontent.com/nlohmann/json/master/single_include/nlohmann/json.hpp" \
        -o json.hpp \
    && mkdir -p /usr/local/include/nlohmann/ \
    && mv json.hpp /usr/local/include/nlohmann/

RUN \
    git clone --depth=1 "https://github.com/gabime/spdlog" \
    && cp -r spdlog/include/spdlog /usr/local/include \
    && rm -rf spdlog

RUN \
    apt-get update \
    && apt-get install -y libboost-dev gcovr \
    && rm -rf /var/lib/apt/lists/*

ENV LD_LIBRARY_PATH "$LD_LIBRARY_PATH:/usr/local/lib"
