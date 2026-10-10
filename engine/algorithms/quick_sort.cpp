#include "../include/registry.h"

static const std::vector<std::string> QUICK_CODE = {
    "int partition(int arr[], int low, int high) {",
    "  int pivot = arr[high];",
    "  int i = low - 1;",
    "  for (int j = low; j < high; j++) {",
    "    if (arr[j] < pivot) {",
    "      i++;",
    "      swap(arr[i], arr[j]);",
    "    }",
    "  }",
    "  swap(arr[i + 1], arr[high]);",
    "  return i + 1;",
    "}",
    "",
    "void quickSort(int arr[], int low, int high) {",
    "  if (low < high) {",
    "    int pi = partition(arr, low, high);",
    "    quickSort(arr, low, pi - 1);",
    "    quickSort(arr, pi + 1, high);",
    "  }",
    "}"
};

static Counters q_counters;
static Trace* q_trace;
static std::vector<int>* q_arr;

static int partitionImpl(int low, int high) {
    int pivot = (*q_arr)[high];

    // Show pivot selection
    {
        Step s;
        s.array = *q_arr;
        s.highlights = {{high, "pivot"}};
        for (int k = low; k < high; k++)
            s.highlights.push_back({k, "current"});
        s.codeLine = 1;
        s.explanation = "Choose pivot = " + std::to_string(pivot) + " at index " + std::to_string(high);
        s.counters = q_counters;
        q_trace->steps.push_back(s);
    }

    int i = low - 1;
    for (int j = low; j < high; j++) {
        q_counters.comparisons++;
        q_counters.steps++;

        // Compare
        {
            Step s;
            s.array = *q_arr;
            s.highlights = {{j, "compare"}, {high, "pivot"}};
            if (i >= low) s.highlights.push_back({i, "left"});
            s.codeLine = 4;
            s.explanation = "Compare arr[" + std::to_string(j) + "]=" +
                std::to_string((*q_arr)[j]) + " with pivot=" + std::to_string(pivot);
            s.counters = q_counters;
            q_trace->steps.push_back(s);
        }

        if ((*q_arr)[j] < pivot) {
            i++;
            if (i != j) {
                std::swap((*q_arr)[i], (*q_arr)[j]);
                q_counters.swaps++;
                Step s;
                s.array = *q_arr;
                s.highlights = {{i, "swap"}, {j, "swap"}, {high, "pivot"}};
                s.codeLine = 6;
                s.explanation = "Swap arr[" + std::to_string(i) + "] and arr[" + std::to_string(j) + "]";
                s.counters = q_counters;
                q_trace->steps.push_back(s);
            }
        }
    }

    // Place pivot in correct position
    std::swap((*q_arr)[i + 1], (*q_arr)[high]);
    q_counters.swaps++;
    {
        Step s;
        s.array = *q_arr;
        s.highlights = {{i + 1, "sorted"}, {high, "swap"}};
        s.codeLine = 9;
        s.explanation = "Place pivot " + std::to_string(pivot) + " at its correct position " + std::to_string(i + 1);
        s.counters = q_counters;
        q_trace->steps.push_back(s);
    }

    return i + 1;
}

static void quickSortImpl(int low, int high) {
    if (low < high) {
        int pi = partitionImpl(low, high);

        // Show partition result
        {
            Step s;
            s.array = *q_arr;
            s.highlights = {{pi, "sorted"}};
            s.codeLine = 15;
            s.explanation = "Partition done. Pivot at index " + std::to_string(pi) +
                ". Recurse on [" + std::to_string(low) + ".." + std::to_string(pi - 1) +
                "] and [" + std::to_string(pi + 1) + ".." + std::to_string(high) + "]";
            s.counters = q_counters;
            q_trace->steps.push_back(s);
        }

        quickSortImpl(low, pi - 1);
        quickSortImpl(pi + 1, high);
    }
}

Trace quickSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "quick-sort";
    trace.codeLines = QUICK_CODE;

    q_counters = Counters{};
    q_trace = &trace;
    q_arr = &arr;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 13;
        s.explanation = "Start quick sort with " + std::to_string(n) + " elements";
        s.counters = q_counters;
        trace.steps.push_back(s);
    }

    if (n > 0) quickSortImpl(0, n - 1);

    // Final sorted state
    {
        Step s;
        s.array = arr;
        for (int i = 0; i < n; i++)
            s.highlights.push_back({i, "sorted"});
        s.codeLine = 19;
        s.explanation = "Array is now fully sorted!";
        s.counters = q_counters;
        trace.steps.push_back(s);
    }

    q_trace = nullptr;
    q_arr = nullptr;
    return trace;
}

REGISTER_ALGORITHM("quick-sort", quickSort);
