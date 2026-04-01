#!/bin/bash

# Validate all mermaid charts in a markdown file (syntax check only)
# Usage: ./validate-mermaid.sh <markdown-file>

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <markdown-file>"
    echo "Example: $0 mental-model.md"
    exit 1
fi

MARKDOWN_FILE="$1"

if [ ! -f "$MARKDOWN_FILE" ]; then
    echo "Error: File not found: $MARKDOWN_FILE"
    exit 1
fi

echo "Validating mermaid charts in: $MARKDOWN_FILE"
echo ""

# Create temp directory for extracted charts
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Extract mermaid blocks
CHART_COUNT=0
IN_MERMAID=0
CURRENT_CHART=""

while IFS= read -r line; do
    if [[ "$line" == '```mermaid' ]]; then
        IN_MERMAID=1
        CHART_COUNT=$((CHART_COUNT + 1))
        CURRENT_CHART="$TEMP_DIR/chart_$CHART_COUNT.mmd"
        > "$CURRENT_CHART"  # Create empty file
    elif [[ "$line" == '```' ]] && [ $IN_MERMAID -eq 1 ]; then
        IN_MERMAID=0
    elif [ $IN_MERMAID -eq 1 ]; then
        echo "$line" >> "$CURRENT_CHART"
    fi
done < "$MARKDOWN_FILE"

if [ $CHART_COUNT -eq 0 ]; then
    echo "⚠️  No mermaid charts found in file"
    exit 0
fi

echo "Found $CHART_COUNT mermaid chart(s)"
echo ""

# Valid mermaid diagram types
VALID_TYPES=(
    "graph"
    "flowchart"
    "sequenceDiagram"
    "classDiagram"
    "stateDiagram"
    "stateDiagram-v2"
    "erDiagram"
    "journey"
    "gantt"
    "pie"
    "quadrantChart"
    "requirementDiagram"
    "gitGraph"
    "mindmap"
    "timeline"
    "C4Context"
)

# Function to validate mermaid syntax
validate_chart() {
    local chart_file="$1"
    local chart_num="$2"
    local errors=""

    # Check if file is empty
    if [ ! -s "$chart_file" ]; then
        echo "✗ Chart $chart_num: INVALID (empty chart)"
        return 1
    fi

    # Read first non-empty line to check diagram type
    local first_line=$(grep -v '^[[:space:]]*$' "$chart_file" | head -n 1)

    # Extract the diagram type (first word)
    local diagram_type=$(echo "$first_line" | awk '{print $1}')

    # Check if diagram type is valid
    local valid=0
    for type in "${VALID_TYPES[@]}"; do
        if [[ "$first_line" == "$type"* ]]; then
            valid=1
            break
        fi
    done

    if [ $valid -eq 0 ]; then
        echo "✗ Chart $chart_num: INVALID"
        echo "  Error: Unknown diagram type '$diagram_type'"
        echo "  Valid types: ${VALID_TYPES[*]}"
        return 1
    fi

    # Basic syntax checks
    local content=$(cat "$chart_file")

    # Check for common syntax issues
    if [[ "$content" =~ \`\`\` ]]; then
        echo "✗ Chart $chart_num: INVALID"
        echo "  Error: Contains code fence markers (\`\`\`) - these should not be in the mermaid content"
        return 1
    fi

    echo "✓ Chart $chart_num: Valid (type: $diagram_type)"
    return 0
}

# Validate each chart
ALL_VALID=1
for i in $(seq 1 $CHART_COUNT); do
    CHART_FILE="$TEMP_DIR/chart_$i.mmd"

    if ! validate_chart "$CHART_FILE" "$i"; then
        ALL_VALID=0
        echo ""
    fi
done

if [ $ALL_VALID -eq 1 ]; then
    echo ""
    echo "✓ All charts passed syntax validation!"
    echo "  Note: This is a basic syntax check. Charts may still have rendering issues."
    exit 0
else
    echo "✗ Some charts have syntax errors. Please fix them."
    exit 1
fi
