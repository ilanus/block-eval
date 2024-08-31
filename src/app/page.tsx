"use client";

import { Block } from "./components/Block";
import { Button } from "./components/Button";
import { useCallback, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

const formatResult = (result: any): string => {
  if (typeof result === "string" && /^https?:\/\/[^\s]+$/.test(result)) {
    return `<a href="${result}" target="_blank" rel="noopener noreferrer">${result}</a>`;
  }

  if (result instanceof HTMLElement) {
    return result.outerHTML;
  }

  return result.toString();
};

export default function Home() {
  const [results, setResults] = useState<Record<string, string>>({});
  const { control, getValues } = useForm({
    defaultValues: {
      block: [{ value: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "block",
  });

  const handleNewBlock = useCallback(() => {
    append({ value: "" });
  }, [append]);

  // Resolve references within block expressions
  const evaluateExpression = (expression: string, values: any): string => {
    const referencePattern = /\b(A\d+)\b/g;

    const resolvedExpression = expression.replace(referencePattern, (match) => {
      const refIndex = parseInt(match.replace("A", ""), 10) - 1;
      const referencedValue = values.block[refIndex]?.value;

      if (referencedValue === undefined || referencedValue === "") {
        return match;
      }

      return `(${evaluateExpression(referencedValue, values)})`;
    });

    return resolvedExpression;
  };

  // Function to run and evaluate a block, and update results
  const handleRunBlock = async (id: string) => {
    const values = getValues();
    const newResults: Record<string, string> = {};

    for (let i = 0; i < fields.length; i++) {
      const blockId = `A${i + 1}`;
      const blockValue = values.block[i]?.value || "";
      const referencePattern = new RegExp(`\\b${id}\\b`, "g");

      if (blockValue.match(referencePattern) || blockId === id) {
        const expressionToEvaluate = evaluateExpression(blockValue, values);
        let evalResult: any;

        try {
          evalResult = await eval(
            `(async () => { return ${expressionToEvaluate}; })()`
          );
        } catch (e: any) {
          evalResult = e.message;
        }

        newResults[blockId] = evalResult ? formatResult(evalResult) : "";
      } else {
        newResults[blockId] = results[blockId];
      }
    }

    setResults(newResults);
  };

  return (
    <div className="max-w-5xl mx-auto mt-20">
      {fields.map((field, index) => {
        const id = `A${index + 1}`;

        return (
          <Controller
            key={field.id}
            render={({ field }) => {
              const blockResult = results && results[id];

              return (
                <Block
                  onBlockRun={() => handleRunBlock(id)}
                  value={field.value}
                  onTextareaChange={field.onChange}
                  onTextareaBlur={field.onBlur}
                  result={blockResult}
                  id={id}
                />
              );
            }}
            name={`block.${index}.value`}
            control={control}
          />
        );
      })}
      <Button onClick={handleNewBlock} className="w-[184px] mt-[38px]">
        Add new block
      </Button>
    </div>
  );
}
