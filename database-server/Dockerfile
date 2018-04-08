FROM postgres:9.5

RUN apt-get update -y -qq && \
    apt-get -y -qq install protobuf-c-compiler libprotobuf-c0-dev unzip git build-essential

RUN apt-get update \
    && apt-get install -y \
        postgresql-server-dev-$PG_MAJOR=$PG_VERSION \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src
RUN git clone https://github.com/citusdata/cstore_fdw.git && \
    cd cstore_fdw && \
    make -j"$(nproc)" && \
    make install && \
    cd .. && \
    rm -rf cstore_fdw

COPY docker-entrypoint.sh /docker-entrypoint.sh

WORKDIR /usr/src/postgres
