CXX=g++
TARGETS=main rpc ring ringImpl
DEPS=common.h $(addsuffix .h, $(TARGETS))
LIBS=-lrabbitmq -lSimpleAmqpClient -lcryptopp
CFLAGS=-std=c++17 -Wall -pthread -DVERSION=\"$$(git describe --always)\" -DCOMMITHASH=\"$$(git rev-parse HEAD)\"
CFLAGSP=$(CFLAGS) -O3
CFLAGST=$(CFLAGS) -DIS_TEST -g --coverage

build/%.o: %.cpp $(DEPS)
	mkdir -p build
	g++ -c -o $@ $< $(CFLAGSP)

build/cryptor: $(patsubst %, build/%.o, $(TARGETS))
	mkdir -p build
	g++ -o $@ $^ $(CFLAGSP) $(LIBS)

build/tests/%: tests/%.test.cpp %.cpp $(DEPS)
	mkdir -p build/tests
	g++ -o $@ $< $*.cpp $(CFLAGST) $(LIBS) -lboost_unit_test_framework

.PRECIOUS: $(addprefix build/tests/, $(TARGETS))

.DEFAULT: all

.PHONY: all test clean

all: build/cryptor

test: clean-cov $(addprefix run-, $(TARGETS))
	gcovr -r . --exclude="\.h(pp)?$$" --exclude="^tests/" -s

run-%: build/tests/%
	-./$< --color_output --log_format=CLF --log_level=message --log_sink=stdout --report_format=CLF --report_level=short --report_sink=stdout

ci-test: clean-cov $(addprefix ci-run-, $(TARGETS))
	gcovr -r . --exclude="\.h(pp)?$$" --exclude="^tests/" -s --keep

ci-run-%: build/tests/%
	./$< --color_output --log_format=CLF --log_level=all --log_sink=stdout --report_format=CLF --report_level=short --report_sink=stdout

clean: clean-coverage
	rm -rf build

clean-cov:
	rm -f *.gcda *.gcov

clean-coverage: clean-cov
	rm -f *.gcno
