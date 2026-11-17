#include "../include/search_input.h"

static const std::vector<std::string> LINEAR_CODE = {
    "int linearSearch(int arr[], int n, int target) {",
    "  for (int i = 0; i < n; i++) {",
    "    if (arr[i] == target) return i;",
    "  }",
    "  return -1;",
    "}"
};

Trace linearSearch(const std::string& inputJson) {
    SearchInput in = parseSearchInput(inputJson);
    std::vector<int> arr = in.array;
    int n = (int)arr.size();
    int target = in.target;

    Trace trace;
    trace.algorithmId = "linear-search";
    trace.codeLines = LINEAR_CODE;

    Counters c;
    int foundAt = -1;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Search for target " + std::to_string(target) + " in " +
                        std::to_string(n) + " elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    for (int i = 0; i < n; i++) {
        c.steps++;
        c.comparisons++;

        // Compare the current element with the target
        {
            Step s;
            s.array = arr;
            for (int k = 0; k < i; k++) {
                s.highlights.push_back({k, "current"});
            }
            s.highlights.push_back({i, "compare"});
            s.codeLine = 2;
            s.explanation = "Compare arr[" + std::to_string(i) + "]=" + std::to_string(arr[i]) +
                            " with target " + std::to_string(target);
            s.counters = c;
            trace.steps.push_back(s);
        }

        if (arr[i] == target) {
            foundAt = i;
            c.steps++;

            // Target found
            {
                Step s;
                s.array = arr;
                s.highlights.push_back({i, "found"});
                s.codeLine = 2;
                s.explanation = "Found target " + std::to_string(target) +
                                " at index " + std::to_string(i);
                s.counters = c;
                trace.steps.push_back(s);
            }
            break;
        }
    }

    if (foundAt < 0) {
        c.steps++;

        // Target not present
        Step s;
        s.array = arr;
        s.codeLine = 4;
        s.explanation = "Target " + std::to_string(target) +
                        " is not present in the array";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("linear-search", linearSearch);
