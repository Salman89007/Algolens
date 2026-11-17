#include "../include/search_input.h"
#include <algorithm>

static const std::vector<std::string> EXPONENTIAL_CODE = {
    "int exponentialSearch(int arr[], int n, int target) {",
    "  if (n == 0) return -1;",
    "  if (arr[0] == target) return 0;",
    "  int bound = 1;",
    "  while (bound < n && arr[bound] < target) bound *= 2;",
    "  int lo = bound / 2, hi = min(bound, n - 1);",
    "  return binarySearch(arr, lo, hi, target);",
    "}"
};

Trace exponentialSearch(const std::string& inputJson) {
    SearchInput in = parseSearchInput(inputJson);
    std::vector<int> arr = in.array;
    int n = (int)arr.size();
    int target = in.target;

    Trace trace;
    trace.algorithmId = "exponential-search";
    trace.codeLines = EXPONENTIAL_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Exponential search for target " + std::to_string(target) + " in " +
                        std::to_string(n) + " sorted elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (n == 0) {
        c.steps++;
        Step s;
        s.array = arr;
        s.codeLine = 1;
        s.explanation = "Target " + std::to_string(target) + " is not present in the empty array";
        s.counters = c;
        trace.steps.push_back(s);
        return trace;
    }

    c.steps++;
    c.comparisons++;
    {
        Step s;
        s.array = arr;
        s.highlights.push_back({0, "compare"});
        s.codeLine = 2;
        s.explanation = "Check the first element " + std::to_string(arr[0]) +
                        " against target " + std::to_string(target);
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (arr[0] == target) {
        c.steps++;
        Step s;
        s.array = arr;
        s.highlights.push_back({0, "found"});
        s.codeLine = 2;
        s.explanation = "Found target " + std::to_string(target) + " at index 0";
        s.counters = c;
        trace.steps.push_back(s);
        return trace;
    }

    int bound = 1;
    while (bound < n && arr[bound] < target) {
        c.steps++;
        c.comparisons++;
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({bound, "compare"});
            s.codeLine = 4;
            s.explanation = "arr[" + std::to_string(bound) + "]=" + std::to_string(arr[bound]) +
                            " < target " + std::to_string(target) + ", double the bound";
            s.counters = c;
            trace.steps.push_back(s);
        }
        bound *= 2;
    }

    int lo = bound / 2;
    int hi = std::min(bound, n - 1);
    c.steps++;
    {
        Step s;
        s.array = arr;
        s.highlights.push_back({lo, "left"});
        s.highlights.push_back({hi, "right"});
        s.codeLine = 5;
        s.explanation = "Target lies in range [" + std::to_string(lo) + ".." +
                        std::to_string(hi) + "], run binary search there for " +
                        std::to_string(target);
        s.counters = c;
        trace.steps.push_back(s);
    }

    bool found = false;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        c.steps++;
        c.comparisons++;

        {
            Step s;
            s.array = arr;
            s.highlights.push_back({lo, "left"});
            s.highlights.push_back({hi, "right"});
            s.highlights.push_back({mid, "compare"});
            s.codeLine = 6;
            s.explanation = "Binary search in [" + std::to_string(lo) + ".." +
                            std::to_string(hi) + "]: compare arr[" + std::to_string(mid) +
                            "]=" + std::to_string(arr[mid]) + " with target " +
                            std::to_string(target);
            s.counters = c;
            trace.steps.push_back(s);
        }

        if (arr[mid] == target) {
            found = true;
            c.steps++;
            Step s;
            s.array = arr;
            s.highlights.push_back({mid, "found"});
            s.codeLine = 6;
            s.explanation = "Found target " + std::to_string(target) +
                            " at index " + std::to_string(mid);
            s.counters = c;
            trace.steps.push_back(s);
            break;
        }

        if (arr[mid] < target) {
            lo = mid + 1;
            c.steps++;
            Step s;
            s.array = arr;
            s.highlights.push_back({mid, "current"});
            s.codeLine = 6;
            s.explanation = "arr[" + std::to_string(mid) + "]=" + std::to_string(arr[mid]) +
                            " < target " + std::to_string(target) + ", move lo to " +
                            std::to_string(lo);
            s.counters = c;
            trace.steps.push_back(s);
        } else {
            hi = mid - 1;
            c.steps++;
            Step s;
            s.array = arr;
            s.highlights.push_back({mid, "current"});
            s.codeLine = 6;
            s.explanation = "arr[" + std::to_string(mid) + "]=" + std::to_string(arr[mid]) +
                            " > target " + std::to_string(target) + ", move hi to " +
                            std::to_string(hi);
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    if (!found) {
        c.steps++;
        Step s;
        s.array = arr;
        s.codeLine = 6;
        s.explanation = "Target " + std::to_string(target) + " is not present in the array";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("exponential-search", exponentialSearch);
