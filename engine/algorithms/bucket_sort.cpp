#include "../include/registry.h"
#include <algorithm>
#include <cmath>

static const std::vector<std::string> BUCKET_CODE = {
    "void bucketSort(int arr[], int n) {",
    "  int minV = arr[0], maxV = arr[0];",
    "  for (int i = 1; i < n; i++) {",
    "    minV = min(minV, arr[i]);",
    "    maxV = max(maxV, arr[i]);",
    "  }",
    "  int k = max(1, (int)sqrt((double)n));",
    "  vector<vector<int>> buckets(k);",
    "  for (int i = 0; i < n; i++) {",
    "    int b = (arr[i] - minV) * k / (maxV - minV + 1);",
    "    buckets[b].push_back(arr[i]);",
    "  }",
    "  for (int b = 0; b < k; b++)",
    "    sort(buckets[b].begin(), buckets[b].end());",
    "  int pos = 0;",
    "  for (int b = 0; b < k; b++)",
    "    for (int v : buckets[b]) arr[pos++] = v;",
    "}"
};

Trace bucketSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "bucket-sort";
    trace.codeLines = BUCKET_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Start bucket sort with " + std::to_string(n) + " elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (n <= 1) {
        if (n == 1) {
            Step s;
            s.array = arr;
            s.highlights = {{0, "sorted"}};
            s.codeLine = 17;
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
    int k = std::max(1, (int)std::sqrt((double)n));
    int range = maxV - minV + 1;

    // Choose the bucket count
    {
        c.steps++;
        Step s;
        s.array = arr;
        s.codeLine = 6;
        s.explanation = "Values range from " + std::to_string(minV) + " to " +
                        std::to_string(maxV) + ", so spread them over " +
                        std::to_string(k) + " buckets";
        s.counters = c;
        trace.steps.push_back(s);
    }

    std::vector<std::vector<int>> buckets(k);

    // Scatter values into buckets
    for (int i = 0; i < n; i++) {
        int b = (arr[i] - minV) * k / range;
        buckets[b].push_back(arr[i]);
        c.steps++;

        Step s;
        s.array = arr;
        s.highlights.push_back({i, "compare"});
        s.codeLine = 10;
        s.explanation = "Place arr[" + std::to_string(i) + "]=" + std::to_string(arr[i]) +
                        " into bucket " + std::to_string(b) + " of " + std::to_string(k);
        s.counters = c;
        trace.steps.push_back(s);
    }

    // Sort each bucket
    for (int b = 0; b < k; b++) {
        std::sort(buckets[b].begin(), buckets[b].end());
        c.steps++;

        std::string contents = "[";
        for (size_t x = 0; x < buckets[b].size(); x++) {
            if (x) contents += ", ";
            contents += std::to_string(buckets[b][x]);
        }
        contents += "]";

        Step s;
        s.array = arr;
        s.codeLine = 13;
        s.explanation = "Sort bucket " + std::to_string(b) + " -> " + contents;
        s.counters = c;
        trace.steps.push_back(s);
    }

    // Concatenate buckets back into the array
    std::vector<int> merged = arr;
    int pos = 0;
    for (int b = 0; b < k; b++) {
        for (int v : buckets[b]) {
            merged[pos] = v;
            c.steps++;

            Step s;
            s.array = merged;
            s.highlights.push_back({pos, "swap"});
            s.codeLine = 15;
            s.explanation = "Copy " + std::to_string(v) + " from bucket " + std::to_string(b) +
                            " to index " + std::to_string(pos);
            s.counters = c;
            trace.steps.push_back(s);
            pos++;
        }
    }

    arr = merged;

    // Final sorted state
    {
        Step s;
        s.array = arr;
        for (int i = 0; i < n; i++) {
            s.highlights.push_back({i, "sorted"});
        }
        s.codeLine = 17;
        s.explanation = "Array is now fully sorted!";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("bucket-sort", bucketSort);
