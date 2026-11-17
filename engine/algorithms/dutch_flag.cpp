#include "../include/search_input.h"
#include <algorithm>

static const std::vector<std::string> DUTCH_CODE = {
    "void dutchFlag(int arr[], int n, int pivot) {",
    "  int low = 0, mid = 0, high = n - 1;",
    "  while (mid <= high) {",
    "    if (arr[mid] < pivot) {",
    "      swap(arr[low], arr[mid]); low++; mid++;",
    "    } else if (arr[mid] > pivot) {",
    "      swap(arr[mid], arr[high]); high--;",
    "    } else {",
    "      mid++;",
    "    }",
    "  }",
    "}"
};

Trace dutchFlag(const std::string& inputJson) {
    SearchInput in = parseSearchInput(inputJson);
    std::vector<int> arr = in.array;
    int n = (int)arr.size();
    int pivot = in.target;

    Trace trace;
    trace.algorithmId = "dutch-flag";
    trace.codeLines = DUTCH_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Partition " + std::to_string(n) + " elements around pivot " +
                        std::to_string(pivot) + ": smaller left, equal middle, larger right";
        s.counters = c;
        trace.steps.push_back(s);
    }

    int low = 0;
    int mid = 0;
    int high = n - 1;

    while (mid <= high) {
        c.steps++;
        c.comparisons++;

        // Inspect the current element
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({mid, "compare"});
            if (low < n) {
                s.highlights.push_back({low, "left"});
            }
            if (high >= 0) {
                s.highlights.push_back({high, "right"});
            }
            s.codeLine = 2;
            s.explanation = "Check arr[" + std::to_string(mid) + "]=" +
                            std::to_string(arr[mid]) + " against pivot " +
                            std::to_string(pivot);
            s.counters = c;
            trace.steps.push_back(s);
        }

        if (arr[mid] < pivot) {
            std::swap(arr[low], arr[mid]);
            c.swaps++;
            c.steps++;
            low++;
            mid++;

            Step s;
            s.array = arr;
            if (low > 0) {
                s.highlights.push_back({low - 1, "found"});
            }
            if (mid - 1 < n) {
                s.highlights.push_back({mid - 1, "current"});
            }
            s.codeLine = 4;
            s.explanation = "Value is smaller than pivot " + std::to_string(pivot) +
                            ", swap it into the left region";
            s.counters = c;
            trace.steps.push_back(s);
        } else if (arr[mid] > pivot) {
            std::swap(arr[mid], arr[high]);
            c.swaps++;
            c.steps++;
            high--;

            Step s;
            s.array = arr;
            s.highlights.push_back({mid, "compare"});
            if (high >= 0 && high < n) {
                s.highlights.push_back({high, "right"});
            }
            s.codeLine = 6;
            s.explanation = "Value is larger than pivot " + std::to_string(pivot) +
                            ", swap it into the right region";
            s.counters = c;
            trace.steps.push_back(s);
        } else {
            mid++;
            c.steps++;

            Step s;
            s.array = arr;
            if (mid - 1 < n && mid > 0) {
                s.highlights.push_back({mid - 1, "found"});
            }
            s.codeLine = 8;
            s.explanation = "Value equals pivot " + std::to_string(pivot) +
                            ", keep it in the middle region";
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    // Final partitioned state
    {
        c.steps++;
        Step s;
        s.array = arr;
        for (int i = 0; i < n; i++) {
            s.highlights.push_back({i, "current"});
        }
        s.codeLine = 11;
        s.explanation = "Partition complete around pivot " + std::to_string(pivot) +
                        ": smaller values on the left, equal in the middle, larger on the right";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("dutch-flag", dutchFlag);
