#include "../include/search_input.h"
#include <algorithm>

static const std::vector<std::string> INTERPOLATION_CODE = {
    "int interpolationSearch(int arr[], int n, int target) {",
    "  int lo = 0, hi = n - 1;",
    "  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {",
    "    if (lo == hi) {",
    "      if (arr[lo] == target) return lo;",
    "      return -1;",
    "    }",
    "    if (arr[hi] == arr[lo]) return arr[lo] == target ? lo : -1;",
    "    int pos = lo + (target - arr[lo]) * (hi - lo) / (arr[hi] - arr[lo]);",
    "    if (arr[pos] == target) return pos;",
    "    if (arr[pos] < target) lo = pos + 1;",
    "    else hi = pos - 1;",
    "  }",
    "  return -1;",
    "}"
};

Trace interpolationSearch(const std::string& inputJson) {
    SearchInput in = parseSearchInput(inputJson);
    std::vector<int> arr = in.array;
    int n = (int)arr.size();
    int target = in.target;

    Trace trace;
    trace.algorithmId = "interpolation-search";
    trace.codeLines = INTERPOLATION_CODE;

    Counters c;
    int lo = 0;
    int hi = n - 1;
    bool found = false;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 1;
        s.explanation = "Interpolation search for target " + std::to_string(target) + " in " +
                        std::to_string(n) + " sorted elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    while (lo <= hi && n > 0 && target >= arr[lo] && target <= arr[hi]) {
        if (lo == hi) {
            c.steps++;
            c.comparisons++;

            {
                Step s;
                s.array = arr;
                s.highlights.push_back({lo, "compare"});
                s.codeLine = 4;
                s.explanation = "Single candidate arr[" + std::to_string(lo) + "]=" +
                                std::to_string(arr[lo]) + " vs target " +
                                std::to_string(target);
                s.counters = c;
                trace.steps.push_back(s);
            }

            if (arr[lo] == target) {
                found = true;
                c.steps++;
                Step s;
                s.array = arr;
                s.highlights.push_back({lo, "found"});
                s.codeLine = 4;
                s.explanation = "Found target " + std::to_string(target) +
                                " at index " + std::to_string(lo);
                s.counters = c;
                trace.steps.push_back(s);
            }
            break;
        }

        if (arr[hi] == arr[lo]) {
            c.steps++;
            Step s;
            s.array = arr;
            s.highlights.push_back({lo, "current"});
            s.codeLine = 7;
            s.explanation = "All values in range are equal, so target " +
                            std::to_string(target) + " cannot be located by interpolation";
            s.counters = c;
            trace.steps.push_back(s);
            break;
        }

        int pos = lo + (target - arr[lo]) * (hi - lo) / (arr[hi] - arr[lo]);
        c.steps++;

        // Interpolated probe position
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({lo, "left"});
            s.highlights.push_back({hi, "right"});
            s.highlights.push_back({pos, "pivot"});
            s.codeLine = 8;
            s.explanation = "Interpolate position " + std::to_string(pos) +
                            " for target " + std::to_string(target) +
                            " inside range [" + std::to_string(lo) + ".." +
                            std::to_string(hi) + "]";
            s.counters = c;
            trace.steps.push_back(s);
        }

        c.steps++;
        c.comparisons++;

        {
            Step s;
            s.array = arr;
            s.highlights.push_back({pos, "compare"});
            s.codeLine = 9;
            s.explanation = "Compare arr[" + std::to_string(pos) + "]=" +
                            std::to_string(arr[pos]) + " with target " +
                            std::to_string(target);
            s.counters = c;
            trace.steps.push_back(s);
        }

        if (arr[pos] == target) {
            found = true;
            c.steps++;
            Step s;
            s.array = arr;
            s.highlights.push_back({pos, "found"});
            s.codeLine = 9;
            s.explanation = "Found target " + std::to_string(target) +
                            " at index " + std::to_string(pos);
            s.counters = c;
            trace.steps.push_back(s);
            break;
        }

        if (arr[pos] < target) {
            lo = pos + 1;
            c.steps++;
            Step s;
            s.array = arr;
            s.highlights.push_back({pos, "current"});
            if (lo < n) {
                s.highlights.push_back({lo, "left"});
            }
            s.codeLine = 10;
            s.explanation = "arr[" + std::to_string(pos) + "]=" + std::to_string(arr[pos]) +
                            " < target " + std::to_string(target) + ", move lo to " +
                            std::to_string(lo);
            s.counters = c;
            trace.steps.push_back(s);
        } else {
            hi = pos - 1;
            c.steps++;
            Step s;
            s.array = arr;
            s.highlights.push_back({pos, "current"});
            if (hi >= 0) {
                s.highlights.push_back({hi, "right"});
            }
            s.codeLine = 11;
            s.explanation = "arr[" + std::to_string(pos) + "]=" + std::to_string(arr[pos]) +
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
        s.codeLine = 13;
        s.explanation = "Target " + std::to_string(target) + " is not present in the array";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("interpolation-search", interpolationSearch);
