import React from 'react';

// Syntax token helpers for code mockup
const Kw = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#AD95E9]">{children}</span>
);
const Fn = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#7FB6ED]">{children}</span>
);
const Ty = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#52B87A]">{children}</span>
);
const Lit = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#D99530]">{children}</span>
);
const Px = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#AEADA8]">{children}</span>
);

export function CodeEditorMockup() {
  return (
    <div className="border border-[rgba(255,255,255,0.07)] rounded-[0.875rem] overflow-hidden bg-[#1E1B2E] shadow-[0_8px_32px_rgba(0,0,0,0.24)] font-[ui-monospace,monospace] text-[0.78rem] leading-[1.7]">
      {/* editor body */}
      <div className="flex py-[18px]">
        {/* line numbers */}
        <div
          className="border-r border-white/[0.06] select-none text-right min-w-[36px] py-0 px-[14px] text-[rgba(255,255,255,0.18)]"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
        {/* code */}
        <div className="flex-1 overflow-x-auto py-0 px-[20px]">
          <div>
            <Kw>function</Kw> <Fn>containsDuplicate</Fn>
            <Px>(nums: </Px>
            <Ty>number</Ty>
            <Px>[]): </Px>
            <Ty>boolean</Ty>
            <Px> {'{'}</Px>
          </div>
          <div>
            <Px>{'  '}</Px>
            <Kw>const</Kw>
            <Px> stampAlbum = </Px>
            <Kw>new</Kw>
            <Px> Set&lt;</Px>
            <Ty>number</Ty>
            <Px>&gt;();</Px>
          </div>
          <div>&nbsp;</div>
          <div>
            <Px>{'  '}</Px>
            <Kw>for</Kw>
            <Px> (</Px>
            <Kw>const</Kw>
            <Px> stamp </Px>
            <Kw>of</Kw>
            <Px> nums) {'{'}</Px>
          </div>
          <div className="bg-[rgba(173,149,233,0.09)]">
            <Px>{'    '}</Px>
            <Kw>if</Kw>
            <Px> (stampAlbum.</Px>
            <Fn>has</Fn>
            <Px>(stamp)) </Px>
            <Kw>return</Kw>
            <Lit> true</Lit>
            <Px>;</Px>
          </div>
          <div>
            <Px>{'    '}stampAlbum.</Px>
            <Fn>add</Fn>
            <Px>(stamp);</Px>
          </div>
          <div>
            <Px>{'  }'}</Px>
          </div>
          <div>&nbsp;</div>
          <div>
            <Px>{'  '}</Px>
            <Kw>return</Kw>
            <Lit> false</Lit>
            <Px>;</Px>
          </div>
          <div>
            <Px>{'}'}</Px>
          </div>
        </div>
      </div>

      {/* output bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t border-t-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.2)]"
      >
        <div className="flex flex-col gap-[2px]">
          {[
            'PASS has duplicate at end',
            'PASS no duplicates',
            'PASS all same value',
          ].map((line) => (
            <span key={line} className="text-[0.65rem] text-[#52B87A]">
              ✓ {line}
            </span>
          ))}
        </div>
        <button className="py-[6px] px-[14px] rounded-[5px] bg-[var(--blue)] text-white border-0 text-[0.72rem] font-semibold cursor-pointer flex items-center gap-[6px] font-[ui-monospace,monospace]">
          Run{' '}
          <kbd className="bg-[rgba(255,255,255,0.15)] py-[1px] px-[5px] rounded-[3px] text-[0.68rem]">
            ⌘↵
          </kbd>
        </button>
      </div>
    </div>
  );
}
