#include "../include/registry.h"

static const std::vector<std::string> BUBBLE_CODE = {
    "void bubbleSort(int arr[], int n) {",
    "  for (int i = 0; i < n - 1; i++) {",
    "    for (int j = 0; j < n - i - 1; j++) {",
    "      if (arr[j] > arr[j + 1]) {",
    "        swap(arr[j], arr[j + 1]);",
    "      }",
    "    }",
    "  }",
    "}"
};

Trace bubbleSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "bubble-sort";
    trace.codeLines = BUBBLE_CODE;

    Counters c;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Start bubble sort with " + std::to_string(n) + " elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            c.steps++;

            // Compare step
            c.comparisons++;
            {
                Step s;
                s.array = arr;
                s.highlights = {{j, "compare"}, {j + 1, "compare"}};
                s.codeLine = 3;
                s.explanation = "Compare arr[" + std::to_string(j) + "]=" +
                    std::to_string(arr[j]) + " and arr[" + std::to_string(j + 1) + "]=" +
                    std::to_string(arr[j + 1]);
                s.counters = c;
                trace.steps.push_back(s);
            }

            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                c.swaps++;
                Step s;
                s.array = arr;
                s.highlights = {{j, "swap"}, {j + 1, "swap"}};
                s.codeLine = 4;
                s.explanation = "Swap arr[" + std::to_string(j) + "] and arr[" +
                    std::to_string(j + 1) + "]";
                s.counters = c;
                trace.steps.push_back(s);
            }
        }

        // Mark last sorted element
        {
            Step s;
            s.array = arr;
            for (int k = n - i - 1; k < n; k++)
                s.highlights.push_back({k, "sorted"});
            s.codeLine = 6;
            s.explanation = "Element at index " + std::to_string(n - i - 1) + " is now in its sorted position";
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    // Final sorted state
    {
        Step s;
        s.array = arr;
        for (int i = 0; i < n; i++)
            s.highlights.push_back({i, "sorted"});
        s.codeLine = 8;
        s.explanation = "Array is now fully sorted!";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("bubble-sort", bubbleSort);
