#include "../include/registry.h"
#include <algorithm>

static const std::vector<std::string> HEAP_CODE = {
    "void heapSort(int arr[], int n) {",
    "  for (int i = n / 2 - 1; i >= 0; i--)",
    "    heapify(arr, n, i);",
    "  for (int i = n - 1; i > 0; i--) {",
    "    swap(arr[0], arr[i]);",
    "    heapify(arr, i, 0);",
    "  }",
    "}",
    "",
    "void heapify(int arr[], int n, int i) {",
    "  int largest = i;",
    "  int l = 2 * i + 1, r = 2 * i + 2;",
    "  if (l < n && arr[l] > arr[largest]) largest = l;",
    "  if (r < n && arr[r] > arr[largest]) largest = r;",
    "  if (largest != i) {",
    "    swap(arr[i], arr[largest]);",
    "    heapify(arr, n, largest);",
    "  }",
    "}"
};

static void addSortedSuffix(Step& s, int from, int n) {
    for (int k = from; k < n; k++) {
        s.highlights.push_back({k, "sorted"});
    }
}

// Sift a node down inside a max-heap, emitting a step per child comparison
static void heapifyTrace(std::vector<int>& arr, int heapSize, int i, int sortedFrom,
                         Trace& trace, Counters& c) {
    int n = (int)arr.size();
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;

    if (l < heapSize) {
        c.steps++;
        c.comparisons++;
        Step s;
        s.array = arr;
        s.highlights.push_back({l, "compare"});
        s.highlights.push_back({largest, "pivot"});
        addSortedSuffix(s, sortedFrom, n);
        s.codeLine = 12;
        s.explanation = "Compare left child " + std::to_string(arr[l]) + " with " +
                        std::to_string(arr[largest]) + " in heap of size " +
                        std::to_string(heapSize);
        s.counters = c;
        trace.steps.push_back(s);
        if (arr[l] > arr[largest]) largest = l;
    }

    if (r < heapSize) {
        c.steps++;
        c.comparisons++;
        Step s;
        s.array = arr;
        s.highlights.push_back({r, "compare"});
        s.highlights.push_back({largest, "pivot"});
        addSortedSuffix(s, sortedFrom, n);
        s.codeLine = 13;
        s.explanation = "Compare right child " + std::to_string(arr[r]) + " with " +
                        std::to_string(arr[largest]) + " in heap of size " +
                        std::to_string(heapSize);
        s.counters = c;
        trace.steps.push_back(s);
        if (arr[r] > arr[largest]) largest = r;
    }

    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        c.swaps++;
        c.steps++;

        Step s;
        s.array = arr;
        s.highlights.push_back({i, "swap"});
        s.highlights.push_back({largest, "swap"});
        addSortedSuffix(s, sortedFrom, n);
        s.codeLine = 15;
        s.explanation = "Swap the parent with its larger child at index " +
                        std::to_string(largest) + " to restore the max-heap";
        s.counters = c;
        trace.steps.push_back(s);

        heapifyTrace(arr, heapSize, largest, sortedFrom, trace, c);
    }
}

Trace heapSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "heap-sort";
    trace.codeLines = HEAP_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Start heap sort with " + std::to_string(n) + " elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (n <= 1) {
        if (n == 1) {
            Step s;
            s.array = arr;
            s.highlights = {{0, "sorted"}};
            s.codeLine = 7;
            s.explanation = "Array is already sorted";
            s.counters = c;
            trace.steps.push_back(s);
        }
        return trace;
    }

    // Build the max-heap bottom-up
    for (int i = n / 2 - 1; i >= 0; i--) {
        c.steps++;

        Step s;
        s.array = arr;
        s.highlights.push_back({i, "current"});
        s.codeLine = 2;
        s.explanation = "Build max-heap: sift down node at index " + std::to_string(i);
        s.counters = c;
        trace.steps.push_back(s);

        heapifyTrace(arr, n, i, n, trace, c);
    }

    // Repeatedly move the maximum to the end of the heap
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);
        c.swaps++;
        c.steps++;

        {
            Step s;
            s.array = arr;
            s.highlights.push_back({0, "swap"});
            s.highlights.push_back({i, "swap"});
            addSortedSuffix(s, i + 1, n);
            s.codeLine = 4;
            s.explanation = "Move the heap maximum " + std::to_string(arr[i]) +
                            " to its final index " + std::to_string(i);
            s.counters = c;
            trace.steps.push_back(s);
        }

        heapifyTrace(arr, i, 0, i, trace, c);
    }

    // Final sorted state
    {
        Step s;
        s.array = arr;
        addSortedSuffix(s, 0, n);
        s.codeLine = 7;
        s.explanation = "Array is now fully sorted!";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("heap-sort", heapSort);
