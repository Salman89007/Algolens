#pragma once
#include "registry.h"
#include <cctype>
#include <string>
#include <vector>

// Input for search-style algorithms: an array plus a value to look for.
// Accepts {"array":[...],"target":N} and falls back to a bare array,
// in which case the middle element is used as the target.
struct SearchInput {
    std::vector<int> array;
    int target = 0;
};

inline bool readJsonInt(const std::string& json, const std::string& key, int& out) {
    std::string needle = "\"" + key + "\"";
    size_t p = json.find(needle);
    if (p == std::string::npos) return false;
    p = json.find(':', p + needle.size());
    if (p == std::string::npos) return false;
    p++;
    while (p < json.size() && (json[p] == ' ' || json[p] == '\t')) p++;

    bool negative = false;
    if (p < json.size() && json[p] == '-') {
        negative = true;
        p++;
    }
    if (p >= json.size() || !std::isdigit((unsigned char)json[p])) return false;

    int value = 0;
    while (p < json.size() && std::isdigit((unsigned char)json[p])) {
        value = value * 10 + (json[p] - '0');
        p++;
    }
    out = negative ? -value : value;
    return true;
}

inline SearchInput parseSearchInput(const std::string& json) {
    SearchInput in;

    if (json.find('{') == std::string::npos) {
        in.array = parseIntArray(json);
        if (!in.array.empty()) {
            in.target = in.array[in.array.size() / 2];
        }
        return in;
    }

    size_t arrayKey = json.find("\"array\"");
    if (arrayKey != std::string::npos) {
        size_t lb = json.find('[', arrayKey);
        size_t rb = json.find(']', lb);
        if (lb != std::string::npos && rb != std::string::npos) {
            in.array = parseIntArray(json.substr(lb, rb - lb + 1));
        }
    }

    int target = 0;
    if (!readJsonInt(json, "target", target) && !in.array.empty()) {
        target = in.array[in.array.size() / 2];
    }
    in.target = target;
    return in;
}
