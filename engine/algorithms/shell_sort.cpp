#include "../include/registry.h"

static const std::vector<std::string> SHELL_CODE = {
    "void shellSort(int arr[], int n) {",
    "  for (int gap = n / 2; gap > 0; gap /= 2) {",
    "    for (int i = gap; i < n; i++) {",
    "      int temp = arr[i];",
    "      int j = i;",
    "      while (j >= gap && arr[j - gap] > temp) {",
    "        arr[j] = arr[j - gap];",
    "        j -= gap;",
    "      }",
    "      arr[j] = temp;",
    "    }",
    "  }",
    "}"
};

Trace shellSort(const std::string& inputJson) {
    std::vector<int> arr = parseIntArray(inputJson);
    int n = (int)arr.size();
    Trace trace;
    trace.algorithmId = "shell-sort";
    trace.codeLines = SHELL_CODE;

    Counters c;

    // Highlight every position before `end` as already sorted
    auto markSorted = [](Step& s, int n) {
        for (int k = 0; k < n; k++) {
            s.highlights.push_back({k, "sorted"});
        }
    };

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Start shell sort with " + std::to_string(n) + " elements, first gap = " +
                        std::to_string(n / 2);
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (n <= 1) {
        if (n == 1) {
            Step s;
            s.array = arr;
            s.highlights = {{0, "sorted"}};
            s.codeLine = 12;
            s.explanation = "Array is already sorted (no gaps needed)";
            s.counters = c;
            trace.steps.push_back(s);
        }
        return trace;
    }

    for (int gap = n / 2; gap > 0; gap /= 2) {
        c.steps++;

        // Announce the gap for this pass
        {
            Step s;
            s.array = arr;
            s.codeLine = 1;
            s.explanation = "Gap = " + std::to_string(gap) + ": compare elements " +
                            std::to_string(gap) + " positions apart";
            s.counters = c;
            trace.steps.push_back(s);
        }

        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            c.steps++;

            // Pick the value to insert
            {
                Step s;
                s.array = arr;
                s.highlights.push_back({i, "current"});
                s.codeLine = 3;
                s.explanation = "Gap = " + std::to_string(gap) + ": pick arr[" +
                                std::to_string(i) + "]=" + std::to_string(temp) +
                                " as the value to insert";
                s.counters = c;
                trace.steps.push_back(s);
            }

            while (j >= gap) {
                c.steps++;
                c.comparisons++;

                // Compare the element one gap behind with temp
                {
                    Step s;
                    s.array = arr;
                    s.highlights.push_back({j - gap, "compare"});
                    s.highlights.push_back({j, "pivot"});
                    s.codeLine = 5;
                    s.explanation = "Gap = " + std::to_string(gap) + ": compare arr[" +
                                    std::to_string(j - gap) + "]=" + std::to_string(arr[j - gap]) +
                                    " with temp=" + std::to_string(temp);
                    s.counters = c;
                    trace.steps.push_back(s);
                }

                if (arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    c.swaps++;
                    c.steps++;

                    // Shift the larger element forward by one gap
                    {
                        Step s;
                        s.array = arr;
                        s.highlights.push_back({j, "swap"});
                        s.highlights.push_back({j - gap, "current"});
                        s.codeLine = 6;
                        s.explanation = "Gap = " + std::to_string(gap) + ": shift arr[" +
                                        std::to_string(j - gap) + "]=" + std::to_string(arr[j - gap]) +
                                        " forward to index " + std::to_string(j);
                        s.counters = c;
                        trace.steps.push_back(s);
                    }
                    j -= gap;
                } else {
                    break;
                }
            }

            arr[j] = temp;
            c.steps++;

            // Insert temp at its gapped position
            {
                Step s;
                s.array = arr;
                s.highlights.push_back({j, "current"});
                s.codeLine = 9;
                s.explanation = "Gap = " + std::to_string(gap) + ": place temp=" +
                                std::to_string(temp) + " at index " + std::to_string(j);
                s.counters = c;
                trace.steps.push_back(s);
            }
        }

        c.steps++;

        // Report this gap as finished
        {
            Step s;
            s.array = arr;
            s.codeLine = 11;
            s.explanation = "Gap = " + std::to_string(gap) + " complete: array is " +
                            std::to_string(gap) + "-sorted";
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    // Final sorted state
    {
        Step s;
        s.array = arr;
        markSorted(s, n);
        s.codeLine = 12;
        s.explanation = "Array is now fully sorted! All gaps complete (last gap = 1)";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("shell-sort", shellSort);
