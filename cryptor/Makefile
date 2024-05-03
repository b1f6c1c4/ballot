CXX=g++
TARGETS=common ring ringImpl
DEPS=common.h $(addsuffix .h, $(TARGETS))
LIBS=-lcryptopp
LIBSP=$(LIBS)
LIBST=$(LIBS)
CFLAGS+=-std=c++17 -Wall -Wextra -Wno-unused-parameter -pthread -DVERSION=\"$$(git describe --always)\" -DCOMMITHASH=\"$$(git rev-parse HEAD)\"
CFLAGSP=$(CFLAGS) -O3
CFLAGST=$(CFLAGS) -DIS_TEST -g --coverage

-include $(patsubst %, build-test/%.o.d, $(TARGETS))

build-test/%.o: %.cpp
	mkdir -p build-test
	$(CXX) -c -o $@ $< -MMD -MT $@ -MF $@.d $(CFLAGSP)

-include $(patsubst %, build-test/tests/%.d, $(TARGETS))

build-test/tests/%: tests/%.test.cpp common.cpp %.cpp tests/common.test.h
	mkdir -p build-test/tests
	$(CXX) -o $@ $< common.cpp $*.cpp $(CFLAGST) -MMD -MT $@ -MF $@.d $(LIBST) -lboost_unit_test_framework

.PRECIOUS: $(addprefix build-test/tests/, $(TARGETS))

.DEFAULT: test

.PHONY: test clean ci-test

test: clean-cov $(addprefix run-, $(TARGETS))
	gcovr -r . --exclude="\.h(pp)?$$" --exclude="^tests/" -s

run-%: build-test/tests/%
	-./$< --color_output --log_format=CLF --log_level=message --log_sink=stdout --report_format=CLF --report_level=short --report_sink=stdout

ci-test: clean-cov $(addprefix ci-run-, $(TARGETS))
	gcovr -r . --exclude="\.h(pp)?$$" --exclude="^tests/" -s --keep

ci-run-%: build-test/tests/%
	./$< --color_output --log_format=CLF --log_level=all --log_sink=stdout --report_format=CLF --report_level=short --report_sink=stdout

clean: clean-coverage
	rm -rf build-test

clean-cov:
	rm -f *.gcda *.gcov

clean-coverage: clean-cov
	rm -f *.gcno
