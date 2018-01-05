CXX=g++
TARGETS=main
DEPS=$(addsuffix .h, $(TARGETS))
LIBS=
CFLAGS=-Wall
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

test: $(addprefix run-, $(TARGETS))

run-%: build/tests/%
	mkdir -p coverage
	-./$<
	-gcov $*.cpp
	-mv $*.gcda $*.gcno $*.cpp.gcov $*.test.gcda $*.test.gcno coverage

clean:
	rm -rf build coverage
