import type { SyntaxMapContent } from "../../types/scene";

export function SyntaxMapStage({ content }: { content: SyntaxMapContent }) {
  const { branches } = content;
  const last = branches.length - 1;

  return (
    <div
      className="mx-auto mt-1 w-full max-w-7xl lg:grid lg:grid-cols-[auto_1.5rem_minmax(0,1fr)] lg:items-center"
      role="img"
      aria-label={`${content.root}语法小结`}
    >
      <div className="hidden items-center lg:flex">
        <p className="rounded-2xl bg-accent px-5 py-4 text-center text-2xl font-semibold leading-tight text-white shadow-lift">
          {content.root}
        </p>
        <span className="h-0.5 w-4 bg-accent" aria-hidden />
      </div>

      <div className="hidden lg:block" aria-hidden />

      <div className="grid w-full grid-cols-[auto_minmax(0,1.7fr)_minmax(0,1fr)] gap-y-2 lg:gap-y-3">
        {branches.map((branch, i) => (
          <div
            key={branch.title}
            className="relative col-span-3 grid grid-cols-subgrid items-stretch rounded-2xl border-2 border-accent bg-white"
          >
            <span className="absolute -left-[calc(1.5rem+2px)] top-0 hidden h-full w-6 lg:block" aria-hidden>
              <span
                className={`absolute left-0 w-0.5 bg-accent ${i === 0 ? "top-1/2" : "-top-[calc(0.375rem+2px)]"} ${
                  i === last ? "bottom-1/2" : "-bottom-[calc(0.375rem+2px)]"
                }`}
              />
              <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-accent" />
            </span>
            <h3 className="flex items-center justify-center whitespace-nowrap rounded-l-[14px] bg-accent-muted px-4 py-2 text-center text-lg font-semibold leading-tight text-accent 2xl:px-5 2xl:text-xl">
              {branch.title}
            </h3>
            <div className="flex items-center px-3 py-2">
              {branch.code && (
                <pre className="w-full overflow-x-auto whitespace-pre rounded-xl bg-classroom-playground px-3 py-1.5 font-mono text-sm leading-snug text-text-primary 2xl:py-2 2xl:text-lg">
                  {branch.code}
                </pre>
              )}
            </div>
            <ul className="flex flex-col justify-center gap-1 border-l border-classroom-border px-3 py-2 2xl:px-4">
              {branch.notes?.map((note) => (
                <li key={note} className="flex gap-2 text-base leading-snug text-text-primary 2xl:text-lg">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent 2xl:mt-2.5" aria-hidden />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
