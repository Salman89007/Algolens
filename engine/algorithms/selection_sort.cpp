#include "../include/registry.h"

static const std::vector<std::string> SELECTION_CODE = {
    "void selectionSort(int arr[], int n) {",
    "  for (int i = 0; i < n - 1; i++) {",
    "    int minIdx = i;",
    "    for (int j = i + 1; j < n; j++) {",
    "      if (arr[j] < arr[minIdx]) {",
    "        minIdx = j;",
    "      }",
    "    }",
    "    if (minIdx != i) {",
    "      swap(arr[i], arr[minIdx]);",
    "    }",
    "  }",
    "}"
};

Trace selectionSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "selection-sort";
    trace.codeLines = SELECTION_CODE;

    Counters c;

    // Highlight every position before `end` as already sorted
    auto markSortedPrefix = [](Step& s, int end) {
        for (int k = 0; k < end; k++) {
            s.highlights.push_back({k, "sorted"});
        }
    };

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Start selection sort with " + std::to_string(n) + " elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (n <= 1) {
        if (n == 1) {
            Step s;
            s.array = arr;
            s.highlights = {{0, "sorted"}};
            s.codeLine = 12;
            s.explanation = "Array is already sorted";
            s.counters = c;
            trace.steps.push_back(s);
        }
        return trace;
    }

    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        c.steps++;

        // Assume the first unsorted element is the minimum
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({i, "current"});
            markSortedPrefix(s, i);
            s.codeLine = 2;
            s.explanation = "Start scanning at index " + std::to_string(i) +
                            ", assume min = " + std::to_string(arr[i]);
            s.counters = c;
            trace.steps.push_back(s);
        }

        for (int j = i + 1; j < n; j++) {
            c.steps++;
            c.comparisons++;

            // Compare candidate with current minimum
            {
                Step s;
                s.array = arr;
                s.highlights.push_back({j, "compare"});
                s.highlights.push_back({minIdx, "pivot"});
                markSortedPrefix(s, i);
                s.codeLine = 4;
                s.explanation = "Compare arr[" + std::to_string(j) + "]=" + std::to_string(arr[j]) +
                                " with current minimum " + std::to_string(arr[minIdx]);
                s.counters = c;
                trace.steps.push_back(s);
            }

            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                c.steps++;

                // New minimum found
                {
                    Step s;
                    s.array = arr;
                    s.highlights.push_back({minIdx, "current"});
                    markSortedPrefix(s, i);
                    s.codeLine = 5;
                    s.explanation = "New minimum found: " + std::to_string(arr[minIdx]) +
                                    " at index " + std::to_string(minIdx);
                    s.counters = c;
                    trace.steps.push_back(s);
                }
            }
        }

        if (minIdx != i) {
            std::swap(arr[i], arr[minIdx]);
            c.swaps++;
            c.steps++;

            // Swap the minimum into place
            {
                Step s;
                s.array = arr;
                s.highlights.push_back({i, "swap"});
                s.highlights.push_back({minIdx, "swap"});
                markSortedPrefix(s, i);
                s.codeLine = 9;
                s.explanation = "Swap the minimum " + std::to_string(arr[i]) +
                                " into index " + std::to_string(i);
                s.counters = c;
                trace.steps.push_back(s);
            }
        } else {
            c.steps++;

            // Already the minimum, no swap needed
            {
                Step s;
                s.array = arr;
                s.highlights.push_back({i, "current"});
                markSortedPrefix(s, i);
                s.codeLine = 8;
                s.explanation = "arr[" + std::to_string(i) + "]=" + std::to_string(arr[i]) +
                                " is already the minimum, no swap needed";
                s.counters = c;
                trace.steps.push_back(s);
            }
        }

        // Index i is now final
        {
            Step s;
            s.array = arr;
            markSortedPrefix(s, i + 1);
            s.codeLine = 8;
            s.explanation = "Index " + std::to_string(i) + " is now in its final sorted position";
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    // Final sorted state
    {
        Step s;
        s.array = arr;
        markSortedPrefix(s, n);
        s.codeLine = 12;
        s.explanation = "Array is now fully sorted!";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("selection-sort", selectionSort);
