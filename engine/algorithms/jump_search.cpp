#include "../include/search_input.h"
#include <algorithm>
#include <cmath>

static const std::vector<std::string> JUMP_CODE = {
    "int jumpSearch(int arr[], int n, int target) {",
    "  int block = max(1, (int)sqrt(n)), prev = 0;",
    "  while (prev < n && arr[min(block, n) - 1] < target) {",
    "    prev = block;",
    "    block += max(1, (int)sqrt(n));",
    "    if (prev >= n) return -1;",
    "  }",
    "  while (prev < min(block, n)) {",
    "    if (arr[prev] == target) return prev;",
    "    prev++;",
    "  }",
    "  return -1;",
    "}"
};

Trace jumpSearch(const std::string& inputJson) {
    SearchInput in = parseSearchInput(inputJson);
    std::vector<int> arr = in.array;
    int n = (int)arr.size();
    int target = in.target;

    Trace trace;
    trace.algorithmId = "jump-search";
    trace.codeLines = JUMP_CODE;

    Counters c;
    int foundAt = -1;

    // Initial state
    {
        Step s;
        s.array = arr;
        s.codeLine = 0;
        s.explanation = "Jump search for target " + std::to_string(target) + " in " +
                        std::to_string(n) + " sorted elements";
        s.counters = c;
        trace.steps.push_back(s);
    }

    if (n == 0) {
        c.steps++;
        Step s;
        s.array = arr;
        s.codeLine = 11;
        s.explanation = "Target " + std::to_string(target) + " is not present in the empty array";
        s.counters = c;
        trace.steps.push_back(s);
        return trace;
    }

    int blockSize = std::max(1, (int)std::sqrt((double)n));
    int block = blockSize;
    int prev = 0;

    // Jump forward while the end of the block is smaller than the target
    while (prev < n && arr[std::min(block, n) - 1] < target) {
        int end = std::min(block, n) - 1;
        c.steps++;
        c.comparisons++;

        {
            Step s;
            s.array = arr;
            s.highlights.push_back({end, "compare"});
            s.highlights.push_back({prev, "current"});
            s.codeLine = 2;
            s.explanation = "Block end arr[" + std::to_string(end) + "]=" +
                            std::to_string(arr[end]) + " < target " + std::to_string(target) +
                            ", jump forward";
            s.counters = c;
            trace.steps.push_back(s);
        }

        prev = block;
        block += blockSize;

        if (prev >= n) {
            c.steps++;
            Step s;
            s.array = arr;
            s.codeLine = 5;
            s.explanation = "Jumped past the end, target " + std::to_string(target) +
                            " is not present in the array";
            s.counters = c;
            trace.steps.push_back(s);
            return trace;
        }

        c.steps++;
        {
            Step s;
            s.array = arr;
            s.highlights.push_back({prev, "left"});
            s.codeLine = 4;
            s.explanation = "Start scanning block from index " + std::to_string(prev) +
                            " (next block end at " + std::to_string(std::min(block, n) - 1) + ")";
            s.counters = c;
            trace.steps.push_back(s);
        }
    }

    // Linear scan inside the block
    int limit = std::min(block, n);
    while (prev < limit) {
        c.steps++;
        c.comparisons++;

        {
            Step s;
            s.array = arr;
            s.highlights.push_back({prev, "compare"});
            s.codeLine = 8;
            s.explanation = "Compare arr[" + std::to_string(prev) + "]=" +
                            std::to_string(arr[prev]) + " with target " +
                            std::to_string(target);
            s.counters = c;
            trace.steps.push_back(s);
        }

        if (arr[prev] == target) {
            foundAt = prev;
            c.steps++;
            Step s;
            s.array = arr;
            s.highlights.push_back({prev, "found"});
            s.codeLine = 8;
            s.explanation = "Found target " + std::to_string(target) +
                            " at index " + std::to_string(prev);
            s.counters = c;
            trace.steps.push_back(s);
            break;
        }
        prev++;
    }

    if (foundAt < 0) {
        c.steps++;
        Step s;
        s.array = arr;
        s.codeLine = 11;
        s.explanation = "Target " + std::to_string(target) + " is not present in the array";
        s.counters = c;
        trace.steps.push_back(s);
    }

    return trace;
}

REGISTER_ALGORITHM("jump-search", jumpSearch);
