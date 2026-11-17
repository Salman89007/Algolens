#include "../include/search_input.h"
#include <algorithm>

static const std::vector<std::string> SLIDING_CODE = {
    "int maxWindowSum(int arr[], int n, int k) {",
    "  if (k <= 0 || k > n) return 0;",
    "  int window = 0;",
    "  for (int i = 0; i < k; i++) window += arr[i];",
    "  int best = window;",
    "  for (int i = k; i < n; i++) {",
    "    window += arr[i] - arr[i - k];",
    "    best = max(best, window);",
    "  }",
    "  return best;",
    "}"
};

Trace slidingWindow(const std::string& inputJson) {
    SearchInput in = parseSearchInput(inputJson);
    std::vector<int> arr = in.array;
    int n = (int)arr.size();
    int k = in.target;

    Trace trace;
    trace.algorithmId = "sliding-window";
    trace.codeLines = SLIDING_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Find the maximum sum of a window of size " + std::to_string(k) +
                        " over " + std::to_string(n) + " elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (k <= 0 || k > n) {
        c.steps++;

        Step s;
        s.array = arr;
        s.codeLine = 1;
        s.explanation = "Window size " + std::to_string(k) + " is invalid for " +
                        std::to_string(n) + " elements, so no window sum exists";
        s.counters = c;
        trace.steps.push_back(s);
        return trace;
    }

    // Sum the first window
    int window = 0;
    for (int i = 0; i < k; i++) {
        window += arr[i];
        c.steps++;

        Step s;
        s.array = arr;
        for (int j = 0; j <= i; j++) {
            s.highlights.push_back({j, "current"});
        }
        s.highlights.push_back({i, "compare"});
        s.codeLine = 3;
        s.explanation = "Add arr[" + std::to_string(i) + "]=" + std::to_string(arr[i]) +
                        " to the first window of size " + std::to_string(k) +
                        " (sum = " + std::to_string(window) + ")";
        s.counters = c;
        trace.steps.push_back(s);
    }

    int best = window;
    int bestStart = 0;

    {
        c.steps++;
        Step s;
        s.array = arr;
        for (int j = 0; j < k; j++) {
            s.highlights.push_back({j, "current"});
        }
        s.codeLine = 4;
        s.explanation = "Initial window sum " + std::to_string(best) +
                        " becomes the best window sum so far";
        s.counters = c;
        trace.steps.push_back(s);
    }

    // Slide the window one element at a time
    for (int i = k; i < n; i++) {
        window += arr[i] - arr[i - k];
        c.steps++;
        c.comparisons++;

        {
            Step s;
            s.array = arr;
            s.highlights.push_back({i - k, "swap"});
            s.highlights.push_back({i, "compare"});
            for (int j = i - k + 1; j <= i; j++) {
                s.highlights.push_back({j, "current"});
            }
            s.codeLine = 6;
            s.explanation = "Slide window: add arr[" + std::to_string(i) + "]=" +
                            std::to_string(arr[i]) + ", remove arr[" + std::to_string(i - k) +
                            "]=" + std::to_string(arr[i - k]) + " (sum = " +
                            std::to_string(window) + ")";
            s.counters = c;
            trace.steps.push_back(s);
        }

        if (window > best) {
            best = window;
            bestStart = i - k + 1;
            c.steps++;

            Step s;
            s.array = arr;
            for (int j = bestStart; j <= i; j++) {
                s.highlights.push_back({j, "current"});
            }
            s.codeLine = 7;
            s.explanation = "New best window sum " + std::to_string(best) +
                            " starting at index " + std::to_string(bestStart);
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    // Final result
    {
        c.steps++;
        Step s;
        s.array = arr;
        for (int j = bestStart; j < bestStart + k && j < n; j++) {
            s.highlights.push_back({j, "found"});
        }
        s.codeLine = 9;
        s.explanation = "Maximum window sum for window size " + std::to_string(k) +
                        " is " + std::to_string(best);
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("sliding-window", slidingWindow);
