from __future__ import annotations

import json
import math
from collections import Counter
from copy import deepcopy
from pathlib import Path
from typing import Any


DataRow = dict[str, Any]

OUTPUT_PATH = Path("id3_results_python.json")


WEATHER_DATA: list[DataRow] = [
    {"Outlook": "Sunny", "Temperature": "Hot", "Humidity": "High", "Wind": "Weak", "Play": "No"},
    {"Outlook": "Sunny", "Temperature": "Hot", "Humidity": "High", "Wind": "Strong", "Play": "No"},
    {"Outlook": "Overcast", "Temperature": "Hot", "Humidity": "High", "Wind": "Weak", "Play": "Yes"},
    {"Outlook": "Rain", "Temperature": "Mild", "Humidity": "High", "Wind": "Weak", "Play": "Yes"},
    {"Outlook": "Rain", "Temperature": "Cool", "Humidity": "Normal", "Wind": "Weak", "Play": "Yes"},
    {"Outlook": "Rain", "Temperature": "Cool", "Humidity": "Normal", "Wind": "Strong", "Play": "No"},
    {"Outlook": "Overcast", "Temperature": "Cool", "Humidity": "Normal", "Wind": "Strong", "Play": "Yes"},
    {"Outlook": "Sunny", "Temperature": "Mild", "Humidity": "High", "Wind": "Weak", "Play": "No"},
    {"Outlook": "Sunny", "Temperature": "Cool", "Humidity": "Normal", "Wind": "Weak", "Play": "Yes"},
    {"Outlook": "Rain", "Temperature": "Mild", "Humidity": "Normal", "Wind": "Weak", "Play": "Yes"},
    {"Outlook": "Sunny", "Temperature": "Mild", "Humidity": "Normal", "Wind": "Strong", "Play": "Yes"},
    {"Outlook": "Overcast", "Temperature": "Mild", "Humidity": "High", "Wind": "Strong", "Play": "Yes"},
    {"Outlook": "Overcast", "Temperature": "Hot", "Humidity": "Normal", "Wind": "Weak", "Play": "Yes"},
    {"Outlook": "Rain", "Temperature": "Mild", "Humidity": "High", "Wind": "Strong", "Play": "No"},
]

TITANIC_SAMPLE: list[DataRow] = [
    {"Survived": 0, "Pclass": 3, "Sex": "male", "Age": 22, "SibSp": 1, "Parch": 0, "Fare": 7.25},
    {"Survived": 1, "Pclass": 1, "Sex": "female", "Age": 38, "SibSp": 1, "Parch": 0, "Fare": 71.28},
    {"Survived": 1, "Pclass": 3, "Sex": "female", "Age": 26, "SibSp": 0, "Parch": 0, "Fare": 7.92},
    {"Survived": 1, "Pclass": 1, "Sex": "female", "Age": 35, "SibSp": 1, "Parch": 0, "Fare": 53.1},
    {"Survived": 0, "Pclass": 3, "Sex": "male", "Age": 35, "SibSp": 0, "Parch": 0, "Fare": 8.05},
    {"Survived": 0, "Pclass": 3, "Sex": "male", "Age": None, "SibSp": 0, "Parch": 0, "Fare": 8.45},
    {"Survived": 0, "Pclass": 1, "Sex": "male", "Age": 54, "SibSp": 0, "Parch": 0, "Fare": 51.86},
    {"Survived": 0, "Pclass": 3, "Sex": "male", "Age": 2, "SibSp": 3, "Parch": 1, "Fare": 21.07},
    {"Survived": 1, "Pclass": 3, "Sex": "female", "Age": 27, "SibSp": 0, "Parch": 2, "Fare": 11.13},
    {"Survived": 1, "Pclass": 2, "Sex": "female", "Age": 14, "SibSp": 1, "Parch": 0, "Fare": 30.07},
    {"Survived": 1, "Pclass": 3, "Sex": "female", "Age": 4, "SibSp": 1, "Parch": 1, "Fare": 16.7},
    {"Survived": 1, "Pclass": 1, "Sex": "female", "Age": 58, "SibSp": 0, "Parch": 0, "Fare": 26.55},
    {"Survived": 0, "Pclass": 3, "Sex": "male", "Age": 20, "SibSp": 0, "Parch": 0, "Fare": 8.05},
]


def calculate_entropy(data: list[DataRow], target_attr: str) -> float:
    total = len(data)
    if total == 0:
        return 0.0

    counts = Counter(row[target_attr] for row in data)
    entropy = 0.0
    for count in counts.values():
        p = count / total
        entropy -= p * math.log2(p)
    return entropy


def calculate_info_gain(data: list[DataRow], attr: str, target_attr: str) -> float:
    total_entropy = calculate_entropy(data, target_attr)
    total = len(data)
    attr_values = list(dict.fromkeys(row[attr] for row in data))

    weighted_entropy = 0.0
    for value in attr_values:
        subset = [row for row in data if row[attr] == value]
        weighted_entropy += (len(subset) / total) * calculate_entropy(subset, target_attr)

    return total_entropy - weighted_entropy


def majority_label(data: list[DataRow], target_attr: str) -> str:
    counts: dict[Any, int] = {}
    for row in data:
        label = row[target_attr]
        counts[label] = counts.get(label, 0) + 1

    winner = next(iter(counts))
    for label in counts:
        if counts[label] > counts[winner]:
            winner = label
    return str(winner)


def build_id3_tree(data: list[DataRow], target_attr: str, remaining_attrs: list[str]) -> dict[str, Any]:
    labels = list(dict.fromkeys(row[target_attr] for row in data))
    if len(labels) == 1:
        return {"isLeaf": True, "label": str(labels[0]), "children": {}}

    if not remaining_attrs:
        return {"isLeaf": True, "label": majority_label(data, target_attr), "children": {}}

    best_attr = remaining_attrs[0]
    max_gain = -1.0
    for attr in remaining_attrs:
        gain = calculate_info_gain(data, attr, target_attr)
        if gain > max_gain:
            max_gain = gain
            best_attr = attr

    root: dict[str, Any] = {"attribute": best_attr, "children": {}, "isLeaf": False}
    next_remaining_attrs = [attr for attr in remaining_attrs if attr != best_attr]

    for value in list(dict.fromkeys(row[best_attr] for row in data)):
        subset = [row for row in data if row[best_attr] == value]
        if not subset:
            root["children"][str(value)] = {
                "isLeaf": True,
                "label": majority_label(data, target_attr),
                "children": {},
            }
        else:
            root["children"][str(value)] = build_id3_tree(subset, target_attr, next_remaining_attrs)

    return root


def predict(tree: dict[str, Any], row: DataRow) -> str:
    if tree["isLeaf"]:
        return tree["label"]

    attr_value = str(row[tree["attribute"]])
    child = tree["children"].get(attr_value)
    if child is None:
        return "N/A"
    return predict(child, row)


def handle_missing_values_mode(data: list[DataRow]) -> list[DataRow]:
    if not data:
        return []

    result = deepcopy(data)
    columns = list(result[0].keys())

    for col in columns:
        values = [row[col] for row in data if row[col] not in (None, "")]
        first_value = data[0][col]

        if isinstance(first_value, (int, float)) and first_value is not None:
            counts: dict[Any, int] = {}
            for value in values:
                counts[value] = counts.get(value, 0) + 1
            replacement = float(next(iter(counts)))
            for value in counts:
                if counts[value] > counts[replacement]:
                    replacement = value
        else:
            counts: dict[Any, int] = {}
            for value in values:
                counts[value] = counts.get(value, 0) + 1
            replacement = next(iter(counts))
            for value in counts:
                if counts[value] > counts[replacement]:
                    replacement = value

        for row in result:
            if row[col] in (None, ""):
                row[col] = replacement

    return result


def discretize_equal_width(data: list[DataRow], col: str, num_bins: int) -> list[DataRow]:
    values = [row[col] for row in data]
    min_value = min(values)
    max_value = max(values)
    width = (max_value - min_value) / num_bins

    result: list[DataRow] = []
    for row in data:
        value = row[col]
        bin_index = math.floor((value - min_value) / width)
        if bin_index >= num_bins:
            bin_index = num_bins - 1

        left = min_value + bin_index * width
        right = min_value + (bin_index + 1) * width
        bracket = "]" if bin_index == num_bins - 1 else ")"
        bin_range = f"[{left:.2f}, {right:.2f}{bracket}"
        result.append({**row, col: bin_range})

    return result


def summarize_dataset(name: str, data: list[DataRow], target_attr: str) -> dict[str, Any]:
    attrs = [column for column in data[0].keys() if column != target_attr]
    tree = build_id3_tree(data, target_attr, attrs)
    predictions = [predict(tree, row) for row in data]
    actual = [str(row[target_attr]) for row in data]
    matches = sum(1 for predicted, observed in zip(predictions, actual) if predicted == observed)

    return {
        "dataset": name,
        "rows": len(data),
        "target": target_attr,
        "entropy": calculate_entropy(data, target_attr),
        "gains": {attr: calculate_info_gain(data, attr, target_attr) for attr in attrs},
        "tree": tree,
        "predictions": predictions,
        "actual": actual,
        "training_accuracy": matches / len(data),
        "root_attribute": tree.get("attribute", tree.get("label")),
    }


def main() -> None:
    titanic_cleaned = handle_missing_values_mode(TITANIC_SAMPLE)
    titanic_binned = discretize_equal_width(titanic_cleaned, "Age", 3)

    results = {
        "weather": summarize_dataset("Weather", WEATHER_DATA, "Play"),
        "titanic_preprocessed": summarize_dataset("Titanic (mode-imputed + age-binned)", titanic_binned, "Survived"),
        "comparison_basis": {
            "typescript_files": [
                "src/utils/id3-core.ts",
                "src/utils/preprocessing.ts",
                "src/utils/sample-data.ts",
            ],
            "notes": [
                "Python logic mirrors the TypeScript entropy, information gain, recursive split, mode imputation, and equal-width binning behavior.",
                "Both implementations are deterministic for the bundled datasets because attribute order follows the dataset column order.",
            ],
        },
    }

    OUTPUT_PATH.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
