#include "../include/registry.h"
#include <algorithm>

static const std::vector<std::string> RADIX_CODE = {
    "void radixSort(int arr[], int n) {",
    "  int minV = arr[0], maxV = arr[0];",
    "  for (int i = 1; i < n; i++) {",
    "    minV = min(minV, arr[i]);",
    "    maxV = max(maxV, arr[i]);",
    "  }",
    "  int offset = minV < 0 ? -minV : 0;",
    "  for (int i = 0; i < n; i++) arr[i] += offset;",
    "  for (int exp = 1; (maxV + offset) / exp > 0; exp *= 10) {",
    "    vector<int> out(n); int count[10] = {0};",
    "    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;",
    "    for (int d = 1; d < 10; d++) count[d] += count[d - 1];",
    "    for (int i = n - 1; i >= 0; i--) {",
    "      int d = (arr[i] / exp) % 10;",
    "      out[count[d] - 1] = arr[i];",
    "      count[d]--;",
    "    }",
    "    for (int i = 0; i < n; i++) arr[i] = out[i];",
    "  }",
    "  for (int i = 0; i < n; i++) arr[i] -= offset;",
    "}"
};

Trace radixSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "radix-sort";
    trace.codeLines = RADIX_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Start radix sort (LSD) with " + std::to_string(n) + " elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (n <= 1) {
        if (n == 1) {
            Step s;
            s.array = arr;
            s.highlights = {{0, "sorted"}};
            s.codeLine = 20;
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

    // Shift negatives so every digit is non-negative
    int offset = minV < 0 ? -minV : 0;
    std::vector<int> work(n);
    for (int i = 0; i < n; i++) {
        work[i] = arr[i] + offset;
    }
    int maxWork = maxV + offset;

    auto display = [&](const std::vector<int>& v) {
        std::vector<int> d(v.size());
        for (size_t k = 0; k < v.size(); k++) {
            d[k] = v[k] - offset;
        }
        return d;
    };

    // LSD pass announcement
    {
        c.steps++;
        Step s;
        s.array = arr;
        s.codeLine = 8;
        s.explanation = "Start with the 1s digit; the largest shifted value is " +
                        std::to_string(maxWork);
        s.counters = c;
        trace.steps.push_back(s);
    }

    for (int exp = 1; maxWork / exp > 0; exp *= 10) {
        c.steps++;
        {
            Step s;
            s.array = display(work);
            s.codeLine = 8;
            s.explanation = "Pass for digit position " + std::to_string(exp) +
                            " (exp = " + std::to_string(exp) + ")";
            s.counters = c;
            trace.steps.push_back(s);
        }

        std::vector<int> out(n, 0);
        int count[10] = {0};
        for (int i = 0; i < n; i++) {
            count[(work[i] / exp) % 10]++;
        }
        for (int d = 1; d < 10; d++) {
            count[d] += count[d - 1];
        }

        {
            c.steps++;
            Step s;
            s.array = display(work);
            s.codeLine = 11;
            s.explanation = "Prefix sums over the 10 digit buckets at position " +
                            std::to_string(exp);
            s.counters = c;
            trace.steps.push_back(s);
        }

        // Stable placement from right to left
        for (int i = n - 1; i >= 0; i--) {
            int d = (work[i] / exp) % 10;
            int pos = count[d] - 1;
            out[pos] = work[i];
            count[d]--;
            c.steps++;

            Step s;
            s.array = display(work);
            s.highlights.push_back({i, "compare"});
            s.highlights.push_back({pos, "swap"});
            s.codeLine = 13;
            s.explanation = "Digit " + std::to_string(d) + " of value " +
                            std::to_string(work[i] - offset) + " goes to output index " +
                            std::to_string(pos) + " (exp = " + std::to_string(exp) + ")";
            s.counters = c;
            trace.steps.push_back(s);
        }

        work = out;
        c.steps++;

        {
            Step s;
            s.array = display(work);
            s.highlights.clear();
            s.codeLine = 16;
            s.explanation = "Digit position " + std::to_string(exp) +
                            " pass complete: array is sorted by this digit";
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    for (int i = 0; i < n; i++) {
        arr[i] = work[i] - offset;
    }

    // Final sorted state
    {
        Step s;
        s.array = arr;
        for (int i = 0; i < n; i++) {
            s.highlights.push_back({i, "sorted"});
        }
        s.codeLine = 20;
        s.explanation = "Array is now fully sorted!";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("radix-sort", radixSort);
