#include "include/registry.h"
#include "include/trace.h"
#include <cstring>
#include <string>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#define EXPORT EMSCRIPTEN_KEEPALIVE
#else
#define EXPORT
#endif

// Static buffer for return value (WASM is single-threaded)
static std::string resultBuffer;

extern "C" {

EXPORT
const char* run_algorithm(const char* algoId, const char* inputJson) {
    std::string id(algoId);
    std::string input(inputJson);
    Trace trace = AlgorithmRegistry::instance().run(id, input);
    resultBuffer = traceToJson(trace);
    return resultBuffer.c_str();
}

EXPORT
const char* list_algorithms() {
    auto ids = AlgorithmRegistry::instance().listIds();
    resultBuffer = "[";
    for (size_t i = 0; i < ids.size(); i++) {
        if (i) resultBuffer += ",";
        resultBuffer += "\"" + ids[i] + "\"";
    }
    resultBuffer += "]";
    return resultBuffer.c_str();
}

} // extern "C"

// For native testing
#ifndef __EMSCRIPTEN__
#include <iostream>
int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cout << "Usage: engine <algorithm-id> '<input-json>'" << std::endl;
        std::cout << "Available: " << list_algorithms() << std::endl;
        return 1;
    }
    const char* result = run_algorithm(argv[1], argv[2]);
    std::cout << result << std::endl;
    return 0;
}
#endif
