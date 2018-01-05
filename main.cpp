#include "main.h"
#include "common.h"

#include <iostream>

void evil()
{
    auto asdf = "qrer";
}

int fun()
{
    return 2;
}

#ifndef IS_TEST
int main()
{
    std::cout << "VERSION=" << VERSION << std::endl;
    std::cout << "COMMITHASH=" << COMMITHASH << std::endl;
    std::cout << "Hello World" << std::endl;
    return 0;
}
#endif
