const basic = [
  { title: "整数", chip: "int", use: "数完整的个数", example: "18 分钟" },
  { title: "浮点数", chip: "float", use: "可以有小数", example: "单价 1.5" },
  { title: "字符串", chip: "str", use: "给人看的一串字", example: "“李华”" },
  { title: "布尔", chip: "bool", use: "只有真和假", example: "是否超时" },
];

const containers = [
  { title: "列表", chip: "list", use: "好多份，按顺序", example: "每次骑行的分钟" },
  { title: "元组", chip: "tuple", use: "几项绑成一条", example: "一趟的记录" },
  { title: "字典", chip: "dict", use: "用名字查出一份", example: "学号查同学" },
  { title: "集合", chip: "set", use: "只问有没有", example: "去过的站点" },
];

type Leaf = (typeof basic)[number];

function LeafColumn({
  items,
  side,
  tone,
}: {
  items: Leaf[];
  side: "left" | "right";
  tone: "basic" | "later";
}) {
  const line = tone === "basic" ? "bg-accent" : "bg-classroom-border";
  const card =
    tone === "basic"
      ? "border-accent bg-white"
      : "border-classroom-border bg-white";
  const chip = tone === "basic" ? "bg-accent-muted text-accent" : "bg-classroom-playground text-text-secondary";

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {items.map((item, index) => (
        <div key={item.chip} className={`flex ${side === "right" ? "flex-row-reverse" : ""}`}>
          <article className={`min-w-0 flex-1 self-center rounded-2xl border-2 px-3 py-2 ${card}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-lg font-semibold leading-none text-text-primary">{item.title}</p>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-sm leading-none ${chip}`}>
                {item.chip}
              </span>
            </div>
            <p className="mt-1.5 text-base leading-snug text-text-secondary">{item.use}</p>
            <p className="text-base leading-snug text-text-primary">{item.example}</p>
          </article>
          <span className="relative w-3 shrink-0 self-stretch" aria-hidden>
            <span className={`absolute top-1/2 h-0.5 w-full -translate-y-1/2 ${line}`} />
            <span
              className={`absolute w-0.5 ${line} ${side === "left" ? "right-0" : "left-0"} ${
                index === 0 ? "top-1/2" : "top-0"
              } ${index === items.length - 1 ? "bottom-1/2" : "-bottom-2"}`}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

function Hub({
  title,
  note,
  tone,
}: {
  title: string;
  note: string;
  tone: "basic" | "later";
}) {
  const box =
    tone === "basic"
      ? "border-accent bg-accent-muted"
      : "border-classroom-border bg-classroom-playground";
  const line = tone === "basic" ? "bg-accent" : "bg-classroom-border";
  const noteColor = tone === "basic" ? "text-accent" : "text-highlight";

  return (
    <div className="flex items-center self-center">
      <span className={`h-0.5 w-4 ${line}`} aria-hidden />
      <div className={`rounded-2xl border-2 px-3 py-3 text-center ${box}`}>
        <p className="whitespace-nowrap text-lg font-semibold leading-tight text-text-primary">{title}</p>
        <p className={`mt-1 whitespace-nowrap text-base leading-none font-medium ${noteColor}`}>{note}</p>
      </div>
      <span className={`h-0.5 w-4 ${line}`} aria-hidden />
    </div>
  );
}

export function TypeMapStage() {
  return (
    <div className="mt-3" role="img" aria-label="Python 数据类型思维导图">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto_minmax(0,1fr)] items-stretch">
        <LeafColumn items={basic} side="left" tone="basic" />
        <Hub title="基本数据类型" note="本讲会用" tone="basic" />
        <div className="flex items-center self-center">
          <div className="rounded-3xl bg-accent px-4 py-4 text-center text-white shadow-lift">
            <p className="whitespace-nowrap text-2xl font-semibold leading-tight">数据类型</p>
            <p className="mt-2 whitespace-nowrap text-base leading-none text-white/90">先看要干什么</p>
          </div>
        </div>
        <Hub title="容器数据类型" note="后面再讲" tone="later" />
        <LeafColumn items={containers} side="right" tone="later" />
      </div>
    </div>
  );
}
