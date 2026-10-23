#include "../include/registry.h"

static const std::vector<std::string> INSERTION_CODE = {
    "void insertionSort(int arr[], int n) {",
    "  for (int i = 1; i < n; i++) {",
    "    int key = arr[i];",
    "    int j = i - 1;",
    "    while (j >= 0 && arr[j] > key) {",
    "      arr[j + 1] = arr[j];",
    "      j--;",
    "    }",
    "    arr[j + 1] = key;",
    "  }",
    "}"
};

Trace insertionSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "insertion-sort";
    trace.codeLines = INSERTION_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Start insertion sort with " + std::to_string(n) + " elements";
        s.counters = c;
        if (n > 0) {
            s.highlights.push_back({0, "sorted"});
        }
        trace.steps.push_back(s);
    }

    if (n <= 1) {
        if (n == 1) {
            Step s;
            s.array = arr;
            s.highlights = {{0, "sorted"}};
            s.codeLine = 10;
            s.explanation = "Array is already sorted";
            s.counters = c;
            trace.steps.push_back(s);
        }
        return trace;
    }

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        c.steps++;

        // Pick key
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({i, "pivot"});
            for (int k = 0; k < i; k++) {
                s.highlights.push_back({k, "sorted"});
            }
            s.codeLine = 2;
            s.explanation = "Current element key = " + std::to_string(key) + " at index " + std::to_string(i);
            s.counters = c;
            trace.steps.push_back(s);
        }

        while (j >= 0) {
            c.steps++;
            c.comparisons++;

            // Compare arr[j] with key
            {
                Step s;
                s.array = arr;
                s.highlights = {{j, "compare"}, {j + 1, "pivot"}};
                s.codeLine = 4;
                s.explanation = "Compare arr[" + std::to_string(j) + "]=" + std::to_string(arr[j]) +
                                " with key=" + std::to_string(key);
                s.counters = c;
                trace.steps.push_back(s);
            }

            if (arr[j] > key) {
                arr[j + 1] = arr[j];
                c.swaps++;
                c.steps++;

                // Shift step
                {
                    Step s;
                    s.array = arr;
                    s.highlights = {{j + 1, "swap"}, {j, "current"}};
                    s.codeLine = 5;
                    s.explanation = "Shift arr[" + std::to_string(j) + "]=" + std::to_string(arr[j]) +
                                    " right to index " + std::to_string(j + 1);
                    s.counters = c;
                    trace.steps.push_back(s);
                }
                j--;
            } else {
                break;
            }
        }

        arr[j + 1] = key;
        c.steps++;

        // Insert key
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({j + 1, "current"});
            for (int k = 0; k <= i; k++) {
                s.highlights.push_back({k, "sorted"});
            }
            s.codeLine = 8;
            s.explanation = "Insert key=" + std::to_string(key) + " at index " + std::to_string(j + 1);
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    // Final sorted state
    {
        Step s;
        s.array = arr;
        for (int i = 0; i < n; i++) {
            s.highlights.push_back({i, "sorted"});
        }
        s.codeLine = 10;
        s.explanation = "Array is now fully sorted!";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("insertion-sort", insertionSort);
