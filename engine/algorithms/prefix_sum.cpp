#include "../include/search_input.h"
#include <algorithm>

static const std::vector<std::string> PREFIX_CODE = {
    "int prefixSum(int arr[], int n, int k) {",
    "  vector<int> prefix(n + 1, 0);",
    "  for (int i = 0; i < n; i++)",
    "    prefix[i + 1] = prefix[i] + arr[i];",
    "  return prefix[k];",
    "}"
};

Trace prefixSum(const std::string& inputJson) {
    SearchInput in = parseSearchInput(inputJson);
    std::vector<int> arr = in.array;
    int n = (int)arr.size();
    int k = in.target;
    if (k < 0) k = 0;
    if (k > n) k = n;

    Trace trace;
    trace.algorithmId = "prefix-sum";
    trace.codeLines = PREFIX_CODE;

    Counters c;

    // Initial state shows the original array
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Build prefix sums for " + std::to_string(n) +
                        " elements, then query the first " + std::to_string(k);
        s.counters = c;
        trace.steps.push_back(s);
    }

    std::vector<int> prefix(n + 1, 0);

    {
        c.steps++;
        Step s;
        s.array = prefix;
        s.highlights.push_back({0, "current"});
        s.codeLine = 1;
        s.explanation = "Start with prefix[0] = 0 before the first element";
        s.counters = c;
        trace.steps.push_back(s);
    }

    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + arr[i];
        c.steps++;
        c.comparisons++;

        Step s;
        s.array = prefix;
        for (int j = 0; j <= i; j++) {
            s.highlights.push_back({j, "current"});
        }
        s.highlights.push_back({i + 1, "compare"});
        s.codeLine = 3;
        s.explanation = "prefix[" + std::to_string(i + 1) + "] = prefix[" +
                        std::to_string(i) + "] + arr[" + std::to_string(i) + "]=" +
                        std::to_string(arr[i]) + " -> " + std::to_string(prefix[i + 1]);
        s.counters = c;
        trace.steps.push_back(s);
    }

    // Final query result
    {
        c.steps++;
        Step s;
        s.array = prefix;
        s.highlights.push_back({k, "found"});
        s.codeLine = 4;
        s.explanation = "Prefix sum of the first " + std::to_string(k) +
                        " elements is " + std::to_string(prefix[k]);
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("prefix-sum", prefixSum);
