export interface AIPresetEntry {
  level: number;
  type: 'hint' | 'question' | 'observation';
  content: string;
}

export const AI_PRESETS: Record<string, AIPresetEntry[]> = {
  'scene-19-boss': [
    {
      level: 1,
      type: 'question',
      content: '你的程序需要保存哪些信息？分别应该用什么方式获取？',
    },
    {
      level: 2,
      type: 'hint',
      content: '试试用 input() 获取姓名，用变量保存年龄和专业。',
    },
    {
      level: 3,
      type: 'observation',
      content: '注意 print 时字符串和数字的连接方式——它们类型相同吗？',
    },
  ],
  'scene-24-human-vs-ai': [
    {
      level: 1,
      type: 'question',
      content: 'input() 得到的数据是什么类型？',
    },
    {
      level: 2,
      type: 'hint',
      content: '可以尝试 print(type(age)) 来观察 age 的类型。',
    },
    {
      level: 3,
      type: 'hint',
      content: '字符串和整数能直接用 + 连接吗？需要先做什么转换？',
    },
  ],
  'scene-26-final': [
    {
      level: 1,
      type: 'question',
      content: '你需要收集几个信息？每个信息用什么变量保存？',
    },
    {
      level: 2,
      type: 'hint',
      content: 'input() 返回的是字符串——如果要做 age + 1，需要先做什么？',
    },
    {
      level: 3,
      type: 'observation',
      content: '检查你的 print 语句：字符串拼接和逗号分隔的输出有什么区别？',
    },
  ],
};
