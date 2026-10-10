#include "../include/registry.h"

static const std::vector<std::string> MERGE_CODE = {
    "void merge(int arr[], int l, int m, int r) {",
    "  int n1 = m - l + 1, n2 = r - m;",
    "  int L[n1], R[n2];",
    "  for (int i = 0; i < n1; i++) L[i] = arr[l+i];",
    "  for (int j = 0; j < n2; j++) R[j] = arr[m+1+j];",
    "  int i = 0, j = 0, k = l;",
    "  while (i < n1 && j < n2) {",
    "    if (L[i] <= R[j]) arr[k++] = L[i++];",
    "    else arr[k++] = R[j++];",
    "  }",
    "  while (i < n1) arr[k++] = L[i++];",
    "  while (j < n2) arr[k++] = R[j++];",
    "}",
    "",
    "void mergeSort(int arr[], int l, int r) {",
    "  if (l < r) {",
    "    int m = l + (r - l) / 2;",
    "    mergeSort(arr, l, m);",
    "    mergeSort(arr, m + 1, r);",
    "    merge(arr, l, m, r);",
    "  }",
    "}"
};

static Counters g_counters;
static Trace* g_trace;
static std::vector<int>* g_arr;

static void recordMerge(int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    std::vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = (*g_arr)[l + i];
    for (int j = 0; j < n2; j++) R[j] = (*g_arr)[m + 1 + j];

    // Show subarrays being merged
    {
        Step s;
        s.array = *g_arr;
        for (int k = l; k <= r; k++)
            s.highlights.push_back({k, "current"});
        s.codeLine = 0;
        s.explanation = "Merging subarrays [" + std::to_string(l) + ".." +
            std::to_string(m) + "] and [" + std::to_string(m + 1) + ".." +
            std::to_string(r) + "]";
        s.counters = g_counters;
        g_trace->steps.push_back(s);
    }

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        g_counters.comparisons++;
        g_counters.steps++;
        if (L[i] <= R[j]) {
            (*g_arr)[k] = L[i];
            {
                Step s;
                s.array = *g_arr;
                s.highlights = {{k, "compare"}};
                s.codeLine = 10;
                s.explanation = "Place L[" + std::to_string(i) + "]=" +
                    std::to_string(L[i]) + " at position " + std::to_string(k);
                s.counters = g_counters;
                g_trace->steps.push_back(s);
            }
            i++;
            k++;
        } else {
            (*g_arr)[k] = R[j];
            {
                Step s;
                s.array = *g_arr;
                s.highlights = {{k, "swap"}};
                s.codeLine = 11;
                s.explanation = "Place R[" + std::to_string(j) + "]=" +
                    std::to_string(R[j]) + " at position " + std::to_string(k);
                s.counters = g_counters;
                g_trace->steps.push_back(s);
            }
            j++;
            k++;
        }
    }
    while (i < n1) {
        (*g_arr)[k] = L[i];
        g_counters.steps++;
        Step s;
        s.array = *g_arr;
        s.highlights = {{k, "compare"}};
        s.codeLine = 13;
        s.explanation = "Copy remaining L[" + std::to_string(i) + "]=" +
            std::to_string(L[i]) + " to position " + std::to_string(k);
        s.counters = g_counters;
        g_trace->steps.push_back(s);
        i++; k++;
    }
    while (j < n2) {
        (*g_arr)[k] = R[j];
        g_counters.steps++;
        Step s;
        s.array = *g_arr;
        s.highlights = {{k, "swap"}};
        s.codeLine = 14;
        s.explanation = "Copy remaining R[" + std::to_string(j) + "]=" +
            std::to_string(R[j]) + " to position " + std::to_string(k);
        s.counters = g_counters;
        g_trace->steps.push_back(s);
        j++; k++;
    }
}

static void mergeSortImpl(int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;

        // Show divide
        {
            Step s;
            s.array = *g_arr;
            s.highlights.push_back({m, "pivot"});
            for (int k = l; k <= r; k++)
                if (k != m) s.highlights.push_back({k, "current"});
            s.codeLine = 19;
            s.explanation = "Divide at midpoint " + std::to_string(m) +
                ": [" + std::to_string(l) + ".." + std::to_string(m) +
                "] and [" + std::to_string(m + 1) + ".." + std::to_string(r) + "]";
            s.counters = g_counters;
            g_trace->steps.push_back(s);
        }

        mergeSortImpl(l, m);
        mergeSortImpl(m + 1, r);
        recordMerge(l, m, r);
    }
}

Trace mergeSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "merge-sort";
    trace.codeLines = MERGE_CODE;

    g_counters = Counters{};
    g_trace = &trace;
    g_arr = &arr;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 17;
        s.explanation = "Start merge sort with " + std::to_string(n) + " elements";
        s.counters = g_counters;
        trace.steps.push_back(s);
    }

    if (n > 0) mergeSortImpl(0, n - 1);

    // Final sorted state
    {
        Step s;
        s.array = arr;
        for (int i = 0; i < n; i++)
            s.highlights.push_back({i, "sorted"});
        s.codeLine = 24;
        s.explanation = "Array is now fully sorted!";
        s.counters = g_counters;
        trace.steps.push_back(s);
    }

    g_trace = nullptr;
    g_arr = nullptr;
    return trace;
}

REGISTER_ALGORITHM("merge-sort", mergeSort);
