#include "../include/search_input.h"

static const std::vector<std::string> TWO_POINTER_CODE = {
    "bool twoSum(int arr[], int n, int target) {",
    "  int left = 0, right = n - 1;",
    "  while (left < right) {",
    "    int sum = arr[left] + arr[right];",
    "    if (sum == target) return true;",
    "    if (sum < target) left++;",
    "    else right--;",
    "  }",
    "  return false;",
    "}"
};

Trace twoPointers(const std::string& inputJson) {
    SearchInput in = parseSearchInput(inputJson);
    std::vector<int> arr = in.array;
    int n = (int)arr.size();
    int target = in.target;

    Trace trace;
    trace.algorithmId = "two-pointers";
    trace.codeLines = TWO_POINTER_CODE;

    Counters c;
    bool found = false;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Find a pair summing to target " + std::to_string(target) +
                        " with two pointers over " + std::to_string(n) + " sorted elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    int left = 0;
    int right = n - 1;

    while (left < right) {
        int sum = arr[left] + arr[right];
        c.steps++;
        c.comparisons++;

        // Compare the current pair sum with the target
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({left, "left"});
            s.highlights.push_back({right, "right"});
            s.codeLine = 3;
            s.explanation = "arr[" + std::to_string(left) + "]=" + std::to_string(arr[left]) +
                            " + arr[" + std::to_string(right) + "]=" + std::to_string(arr[right]) +
                            " = " + std::to_string(sum) + " vs target " + std::to_string(target);
            s.counters = c;
            trace.steps.push_back(s);
        }

        if (sum == target) {
            found = true;
            c.steps++;

            Step s;
            s.array = arr;
            s.highlights.push_back({left, "found"});
            s.highlights.push_back({right, "found"});
            s.codeLine = 4;
            s.explanation = "Found a pair (" + std::to_string(arr[left]) + ", " +
                            std::to_string(arr[right]) + ") that sums to target " +
                            std::to_string(target);
            s.counters = c;
            trace.steps.push_back(s);
            break;
        }

        if (sum < target) {
            left++;
            c.steps++;

            Step s;
            s.array = arr;
            s.highlights.push_back({left, "left"});
            s.highlights.push_back({right, "right"});
            s.codeLine = 5;
            s.explanation = "Sum " + std::to_string(sum) + " is too small, move left pointer to index " +
                            std::to_string(left);
            s.counters = c;
            trace.steps.push_back(s);
        } else {
            right--;
            c.steps++;

            Step s;
            s.array = arr;
            s.highlights.push_back({left, "left"});
            if (right >= 0) {
                s.highlights.push_back({right, "right"});
            }
            s.codeLine = 6;
            s.explanation = "Sum " + std::to_string(sum) + " is too large, move right pointer to index " +
                            std::to_string(right);
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    if (!found) {
        c.steps++;

        Step s;
        s.array = arr;
        s.codeLine = 8;
        s.explanation = "No pair sums to target " + std::to_string(target);
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("two-pointers", twoPointers);
