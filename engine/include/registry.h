#pragma once
#include "trace.h"
#include <functional>
#include <map>
#include <string>
#include <vector>
#include <sstream>

// Parse a JSON array of ints from a string like "[5,3,1,4,2]"
inline std::vector<int> parseIntArray(const std::string& json) {
    std::vector<int> result;
    std::string num;
    for (char c : json) {
        if (c == '[' || c == ' ') continue;
        if (c == ',' || c == ']') {
            if (!num.empty()) {
                result.push_back(std::stoi(num));
                num.clear();
            }
        } else {
            num += c;
        }
    }
    return result;
}

// Algorithm function signature: takes input JSON, returns Trace
using AlgoFunc = std::function<Trace(const std::string&)>;

// Global registry
class AlgorithmRegistry {
public:
    static AlgorithmRegistry& instance() {
        static AlgorithmRegistry reg;
        return reg;
    }

    void registerAlgo(const std::string& id, AlgoFunc func) {
        algos_[id] = std::move(func);
    }

    bool has(const std::string& id) const {
        return algos_.count(id) > 0;
    }

    Trace run(const std::string& id, const std::string& inputJson) const {
        auto it = algos_.find(id);
        if (it == algos_.end()) {
            Trace t;
            t.algorithmId = id;
            Step s;
            s.explanation = "Unknown algorithm: " + id;
            t.steps.push_back(s);
            return t;
        }
        return it->second(inputJson);
    }

    std::vector<std::string> listIds() const {
        std::vector<std::string> ids;
        for (auto& [k, v] : algos_) ids.push_back(k);
        return ids;
    }

private:
    AlgorithmRegistry() = default;
    std::map<std::string, AlgoFunc> algos_;
};

// Helper macro for auto-registration
#define REGISTER_ALGORITHM(id, func) \
    static bool _reg_##func = (AlgorithmRegistry::instance().registerAlgo(id, func), true)
