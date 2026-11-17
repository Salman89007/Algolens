#include "../include/search_input.h"

static const std::vector<std::string> BINARY_CODE = {
    "int binarySearch(int arr[], int n, int target) {",
    "  int lo = 0, hi = n - 1;",
    "  while (lo <= hi) {",
    "    int mid = lo + (hi - lo) / 2;",
    "    if (arr[mid] == target) return mid;",
    "    if (arr[mid] < target) lo = mid + 1;",
    "    else hi = mid - 1;",
    "  }",
    "  return -1;",
    "}"
};

Trace binarySearch(const std::string& inputJson) {
    SearchInput in = parseSearchInput(inputJson);
    std::vector<int> arr = in.array;
    int n = (int)arr.size();
    int target = in.target;

    Trace trace;
    trace.algorithmId = "binary-search";
    trace.codeLines = BINARY_CODE;

    Counters c;
    int lo = 0;
    int hi = n - 1;
    bool found = false;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 1;
        s.explanation = "Binary search for target " + std::to_string(target) + " in " +
                        std::to_string(n) + " sorted elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        c.steps++;

        // Midpoint probe
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({lo, "left"});
            s.highlights.push_back({hi, "right"});
            s.highlights.push_back({mid, "pivot"});
            s.codeLine = 3;
            s.explanation = "Search range [" + std::to_string(lo) + ".." +
                            std::to_string(hi) + "], mid = " + std::to_string(mid);
            s.counters = c;
            trace.steps.push_back(s);
        }

        c.steps++;
        c.comparisons++;

        // Compare midpoint value with the target
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({mid, "compare"});
            s.codeLine = 4;
            s.explanation = "Compare arr[" + std::to_string(mid) + "]=" +
                            std::to_string(arr[mid]) + " with target " +
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
            s.codeLine = 4;
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
            if (lo < n) {
                s.highlights.push_back({lo, "left"});
            }
            s.codeLine = 5;
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
            if (hi >= 0) {
                s.highlights.push_back({hi, "right"});
            }
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
        s.codeLine = 8;
        s.explanation = "Target " + std::to_string(target) +
                        " is not present in the array";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("binary-search", binarySearch);
