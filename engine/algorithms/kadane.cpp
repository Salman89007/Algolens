#include "../include/registry.h"
#include <algorithm>

static const std::vector<std::string> KADANE_CODE = {
    "int kadane(int arr[], int n) {",
    "  int best = arr[0], current = arr[0];",
    "  for (int i = 1; i < n; i++) {",
    "    current = max(arr[i], current + arr[i]);",
    "    best = max(best, current);",
    "  }",
    "  return best;",
    "}"
};

Trace kadane(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();

    Trace trace;
    trace.algorithmId = "kadane";
    trace.codeLines = KADANE_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Find the maximum subarray sum with Kadane's algorithm over " +
                        std::to_string(n) + " elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (n == 0) {
        c.steps++;
        Step s;
        s.array = arr;
        s.codeLine = 6;
        s.explanation = "The array is empty, so the maximum subarray sum is 0";
        s.counters = c;
        trace.steps.push_back(s);
        return trace;
    }

    int best = arr[0];
    int current = arr[0];
    int bestStart = 0;
    int bestEnd = 0;
    int currentStart = 0;

    {
        c.steps++;
        Step s;
        s.array = arr;
        s.highlights.push_back({0, "current"});
        s.codeLine = 1;
        s.explanation = "Start with arr[0]=" + std::to_string(arr[0]) +
                        " as both the current and best subarray sum";
        s.counters = c;
        trace.steps.push_back(s);
    }

    for (int i = 1; i < n; i++) {
        if (arr[i] > current + arr[i]) {
            current = arr[i];
            currentStart = i;
        } else {
            current += arr[i];
        }
        c.steps++;
        c.comparisons++;

        // Extend or restart the current subarray
        {
            Step s;
            s.array = arr;
            for (int j = currentStart; j <= i; j++) {
                s.highlights.push_back({j, "current"});
            }
            s.highlights.push_back({i, "compare"});
            s.codeLine = 3;
            s.explanation = "At index " + std::to_string(i) + ", current subarray sum is " +
                            std::to_string(current) + " (best so far " +
                            std::to_string(best) + ")";
            s.counters = c;
            trace.steps.push_back(s);
        }

        if (current > best) {
            best = current;
            bestStart = currentStart;
            bestEnd = i;
            c.steps++;

            Step s;
            s.array = arr;
            for (int j = bestStart; j <= bestEnd; j++) {
                s.highlights.push_back({j, "found"});
            }
            s.codeLine = 4;
            s.explanation = "New best subarray sum " + std::to_string(best) +
                            " from index " + std::to_string(bestStart) +
                            " to " + std::to_string(bestEnd);
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    // Final result
    {
        c.steps++;
        Step s;
        s.array = arr;
        for (int j = bestStart; j <= bestEnd; j++) {
            s.highlights.push_back({j, "found"});
        }
        s.codeLine = 6;
        s.explanation = "Maximum subarray sum is " + std::to_string(best) +
                        " (indices " + std::to_string(bestStart) + ".." +
                        std::to_string(bestEnd) + ")";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("kadane", kadane);
