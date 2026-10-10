#pragma once
#include <string>
#include <vector>
#include <sstream>

// A single highlight on an element
struct Highlight {
    int index;
    std::string type; // "compare", "swap", "sorted", "pivot", "current", "left", "right"
};

// Counters for the current step
struct Counters {
    int comparisons = 0;
    int swaps = 0;
    int steps = 0;
};

// A single step in the algorithm trace
struct Step {
    std::vector<int> array;             // current data state
    std::vector<Highlight> highlights;  // which elements to highlight
    int codeLine = -1;                  // current line in the source code
    std::string explanation;            // plain English explanation
    Counters counters;                  // running counters
};

// Full trace returned by an algorithm
struct Trace {
    std::string algorithmId;
    std::vector<std::string> codeLines; // the source code shown in the panel
    std::vector<Step> steps;
};

// --- JSON serialization helpers ---

inline std::string escapeJson(const std::string& s) {
    std::string out;
    for (char c : s) {
        switch (c) {
            case '"':  out += "\\\""; break;
            case '\\': out += "\\\\"; break;
            case '\n': out += "\\n"; break;
            case '\t': out += "\\t"; break;
            default:   out += c;
        }
    }
    return out;
}

inline std::string traceToJson(const Trace& t) {
    std::ostringstream o;
    o << "{";
    o << "\"algorithmId\":\"" << escapeJson(t.algorithmId) << "\",";

    // codeLines
    o << "\"codeLines\":[";
    for (size_t i = 0; i < t.codeLines.size(); i++) {
        if (i) o << ",";
        o << "\"" << escapeJson(t.codeLines[i]) << "\"";
    }
    o << "],";

    // steps
    o << "\"steps\":[";
    for (size_t s = 0; s < t.steps.size(); s++) {
        if (s) o << ",";
        const Step& st = t.steps[s];
        o << "{";

        // array
        o << "\"array\":[";
        for (size_t i = 0; i < st.array.size(); i++) {
            if (i) o << ",";
            o << st.array[i];
        }
        o << "],";

        // highlights
        o << "\"highlights\":[";
        for (size_t i = 0; i < st.highlights.size(); i++) {
            if (i) o << ",";
            o << "{\"index\":" << st.highlights[i].index
              << ",\"type\":\"" << escapeJson(st.highlights[i].type) << "\"}";
        }
        o << "],";

        // codeLine, explanation, counters
        o << "\"codeLine\":" << st.codeLine << ",";
        o << "\"explanation\":\"" << escapeJson(st.explanation) << "\",";
        o << "\"counters\":{";
        o << "\"comparisons\":" << st.counters.comparisons << ",";
        o << "\"swaps\":" << st.counters.swaps << ",";
        o << "\"steps\":" << st.counters.steps;
        o << "}";

        o << "}";
    }
    o << "]";

    o << "}";
    return o.str();
}
