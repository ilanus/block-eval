"use client";

import { Button } from "./Button";
import { PlayIcon } from "./PlayIcon";

type BlockProps = {
  onBlockRun: (id: string) => void;
  onTextareaChange: () => void;
  onTextareaBlur: () => void;
  value: string;
  result: string;
  id: string;
};

export const Block = ({
  onBlockRun,
  onTextareaChange,
  onTextareaBlur,
  value,
  result = "",
  id,
}: BlockProps) => {
  return (
    <div>
      <p className="text-sm text-[#707070]">{id}</p>
      <div className="flex gap-[14px] mb-[22px]">
        <div className="w-full max-w-[480px]">
          <textarea
            cols={3}
            value={value}
            onChange={onTextareaChange}
            onBlur={onTextareaBlur}
            className="p-4 border-2 rounded-md w-full"
          />
          {result && (
            <div
              className="flex items-center p-4 bg-[#EBEBEB] w-full max-w-[480px] min-h-[56px] mt-4 break-words whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: result }}
            />
          )}
        </div>
        <Button
          onClick={() => onBlockRun(id)}
          className="flex items-center justify-center w-[94px]"
        >
          <PlayIcon />
          Run
        </Button>
      </div>
    </div>
  );
};
