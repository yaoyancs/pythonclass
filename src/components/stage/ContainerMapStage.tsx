type Op = [label: string, action: string];

type Branch = {
  title: string;
  chip: string;
  mutable: boolean;
  trait: string;
  ops: Op[];
};

const left: Branch[] = [
  {
    title: "列表",
    chip: "list",
    mutable: true,
    trait: "有序，按下标访问，允许重复",
    ops: [
      ["读取", "[下标]、切片"],
      ["查找", "index()、count()"],
      ["增加", "append()、extend()、+= 接到末尾"],
      ["插入", "insert(下标)"],
      ["删除", "del、pop(下标)、remove()、clear()"],
      ["修改", "[下标] ="],
      ["新列表", "+ 得到新列表"],
    ],
  },
  {
    title: "元组",
    chip: "tuple",
    mutable: false,
    trait: "有序，创建后不能改项",
    ops: [
      ["读取", "[下标]、切片"],
      ["查找", "index()、count()"],
      ["生成新元组", "+"],
    ],
  },
];

const right: Branch[] = [
  {
    title: "集合",
    chip: "set",
    mutable: true,
    trait: "元素唯一，判断是否存在，做集合运算",
    ops: [
      ["增加", "add() 成为成员"],
      ["合并", "update() 已有则忽略"],
      ["删除", "remove() 没有则报错"],
      ["删除", "discard() 没有则不变"],
      ["运算", "&、|、-"],
    ],
  },
  {
    title: "字典",
    chip: "dict",
    mutable: true,
    trait: "按键取值",
    ops: [
      ["取值", "[Key]、get()"],
      ["查看", "keys()、values()、items()"],
      ["修改", "[Key] = Value 写入键值"],
      ["合并", "update() 键已有则覆盖"],
      ["删除", "pop(Key)、del、clear()"],
      ["复制", "copy()"],
    ],
  },
];

function Ops({ ops, side }: { ops: Op[]; side: "left" | "right" }) {
  return (
    <div className={`flex min-w-0 flex-col justify-center gap-1 ${side === "left" ? "items-end" : "items-start"}`}>
      {ops.map(([label, action]) => (
        <div key={`${label}-${action}`} className="flex max-w-full items-center gap-2">
          {side === "right" && <span className="h-0.5 w-3 shrink-0 bg-classroom-border" aria-hidden />}
          <p className="rounded-xl border border-classroom-border bg-white px-2.5 py-1 text-sm leading-snug text-text-primary">
            <span className="font-semibold text-accent">{label}</span>
            <span className="mx-1.5 text-text-secondary">·</span>
            <span className="font-mono">{action}</span>
          </p>
          {side === "left" && <span className="h-0.5 w-3 shrink-0 bg-classroom-border" aria-hidden />}
        </div>
      ))}
    </div>
  );
}

function BranchCard({ branch }: { branch: Branch }) {
  return (
    <article className="w-44 rounded-2xl border-2 border-accent bg-white px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg font-semibold leading-none text-text-primary">{branch.title}</p>
        <span className="shrink-0 rounded-full bg-accent-muted px-2 py-0.5 font-mono text-xs leading-none text-accent">
          {branch.chip}
        </span>
      </div>
      <p className={`mt-1.5 text-sm font-semibold leading-none ${branch.mutable ? "text-highlight" : "text-accent"}`}>
        {branch.mutable ? "可变" : "不可变"}
      </p>
      <p className="mt-1 text-sm leading-snug text-text-secondary">{branch.trait}</p>
    </article>
  );
}

function Side({ branches, side }: { branches: Branch[]; side: "left" | "right" }) {
  return (
    <div className="flex min-w-0 flex-col justify-center">
      {branches.map((branch, index) => (
        <div key={branch.chip} className={`flex ${side === "right" ? "flex-row-reverse" : ""}`}>
          <div
            className={`grid min-w-0 flex-1 items-center gap-2 py-2 ${side === "left" ? "grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-[auto_minmax(0,1fr)]"}`}
          >
            {side === "left" ? (
              <>
                <Ops ops={branch.ops} side="left" />
                <BranchCard branch={branch} />
              </>
            ) : (
              <>
                <BranchCard branch={branch} />
                <Ops ops={branch.ops} side="right" />
              </>
            )}
          </div>
          <span className="relative w-4 shrink-0 self-stretch" aria-hidden>
            <span className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-accent" />
            <span
              className={`absolute w-0.5 bg-accent ${side === "left" ? "right-0" : "left-0"} ${
                index === 0 ? "top-1/2" : "top-0"
              } ${index === branches.length - 1 ? "bottom-1/2" : "bottom-0"}`}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

export function ContainerMapStage() {
  return (
    <div className="mt-1" role="img" aria-label="容器数据类型总结和对比">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <Side branches={left} side="left" />
        <div className="rounded-3xl bg-accent px-3 py-4 text-center text-white shadow-lift">
          <p className="whitespace-nowrap text-xl font-semibold leading-tight">容器数据类型</p>
        </div>
        <Side branches={right} side="right" />
      </div>
      <p className="mt-2 text-center text-base text-text-secondary">
        len() 统计项数。in 判断是否存在，字典只查 Key。
      </p>
    </div>
  );
}
