#include "../include/registry.h"
#include <algorithm>

static const std::vector<std::string> COUNTING_CODE = {
    "void countingSort(int arr[], int n) {",
    "  int minV = arr[0], maxV = arr[0];",
    "  for (int i = 1; i < n; i++) {",
    "    minV = min(minV, arr[i]);",
    "    maxV = max(maxV, arr[i]);",
    "  }",
    "  int range = maxV - minV + 1;",
    "  vector<int> count(range, 0), out(n);",
    "  for (int i = 0; i < n; i++) count[arr[i] - minV]++;",
    "  for (int i = 1; i < range; i++) count[i] += count[i - 1];",
    "  for (int i = n - 1; i >= 0; i--) {",
    "    out[count[arr[i] - minV] - 1] = arr[i];",
    "    count[arr[i] - minV]--;",
    "  }",
    "  for (int i = 0; i < n; i++) arr[i] = out[i];",
    "}"
};

Trace countingSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "counting-sort";
    trace.codeLines = COUNTING_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Start counting sort with " + std::to_string(n) + " elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (n <= 1) {
        if (n == 1) {
            Step s;
            s.array = arr;
            s.highlights = {{0, "sorted"}};
            s.codeLine = 15;
            s.explanation = "Array is already sorted";
            s.counters = c;
            trace.steps.push_back(s);
        }
        return trace;
    }

    int minV = arr[0];
    int maxV = arr[0];
    for (int i = 1; i < n; i++) {
        minV = std::min(minV, arr[i]);
        maxV = std::max(maxV, arr[i]);
    }
    int range = maxV - minV + 1;

    // Value range determines the bucket count
    {
        c.steps++;
        Step s;
        s.array = arr;
        s.codeLine = 6;
        s.explanation = "Values range from " + std::to_string(minV) + " to " +
                        std::to_string(maxV) + ", so counting needs " +
                        std::to_string(range) + " buckets";
        s.counters = c;
        trace.steps.push_back(s);
    }

    std::vector<int> count(range, 0);
    std::vector<int> out(n, 0);

    // Count occurrences of each value
    for (int i = 0; i < n; i++) {
        int idx = arr[i] - minV;
        count[idx]++;
        c.steps++;

        Step s;
        s.array = arr;
        s.highlights.push_back({i, "compare"});
        s.codeLine = 8;
        s.explanation = "Count arr[" + std::to_string(i) + "]=" + std::to_string(arr[i]) +
                        " into bucket " + std::to_string(idx);
        s.counters = c;
        trace.steps.push_back(s);
    }

    // Turn counts into prefix sums
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    {
        c.steps++;
        Step s;
        s.array = arr;
        s.codeLine = 9;
        s.explanation = "Prefix sums over " + std::to_string(range) +
                        " buckets give each value its final output position";
        s.counters = c;
        trace.steps.push_back(s);
    }

    // Place values from right to left to keep the sort stable
    for (int i = n - 1; i >= 0; i--) {
        int idx = arr[i] - minV;
        int pos = count[idx] - 1;
        out[pos] = arr[i];
        count[idx]--;
        c.steps++;

        Step s;
        s.array = out;
        s.highlights.push_back({pos, "swap"});
        s.codeLine = 11;
        s.explanation = "Place arr[" + std::to_string(i) + "]=" + std::to_string(arr[i]) +
                        " at output index " + std::to_string(pos);
        s.counters = c;
        trace.steps.push_back(s);
    }

    // Copy the output back into the input array
    arr = out;
    {
        c.steps++;
        Step s;
        s.array = arr;
        for (int i = 0; i < n; i++) {
            s.highlights.push_back({i, "current"});
        }
        s.codeLine = 14;
        s.explanation = "Copy the output array back into the input array";
        s.counters = c;
        trace.steps.push_back(s);
    }

    // Final sorted state
    {
        Step s;
        s.array = arr;
        for (int i = 0; i < n; i++) {
            s.highlights.push_back({i, "sorted"});
        }
        s.codeLine = 15;
        s.explanation = "Array is now fully sorted!";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("counting-sort", countingSort);
