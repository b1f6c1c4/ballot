#include "main.h"

#include <iostream>

void evil()
{
    auto asdf = "qrer";
}

int fun()
{
    return 3;
}

#ifndef IS_TEST
int main()
{
    std::cout << "Hello World" << std::endl;
    return 0;
}
#endif
