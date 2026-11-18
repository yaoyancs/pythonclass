/** Cloudflare request.cf 的英文地名 → 中文「省 + 市」。未收录的城市只显示省级。 */

const PROVINCES: Record<string, { name: string; kind: 'municipality' | 'province' | 'region' | 'sar' }> = {
  anhui: { name: '安徽', kind: 'province' },
  beijing: { name: '北京', kind: 'municipality' },
  chongqing: { name: '重庆', kind: 'municipality' },
  fujian: { name: '福建', kind: 'province' },
  gansu: { name: '甘肃', kind: 'province' },
  guangdong: { name: '广东', kind: 'province' },
  guangxi: { name: '广西壮族', kind: 'region' },
  guizhou: { name: '贵州', kind: 'province' },
  hainan: { name: '海南', kind: 'province' },
  hebei: { name: '河北', kind: 'province' },
  heilongjiang: { name: '黑龙江', kind: 'province' },
  henan: { name: '河南', kind: 'province' },
  hubei: { name: '湖北', kind: 'province' },
  hunan: { name: '湖南', kind: 'province' },
  'inner mongolia': { name: '内蒙古', kind: 'region' },
  neimenggu: { name: '内蒙古', kind: 'region' },
  jiangsu: { name: '江苏', kind: 'province' },
  jiangxi: { name: '江西', kind: 'province' },
  jilin: { name: '吉林', kind: 'province' },
  liaoning: { name: '辽宁', kind: 'province' },
  ningxia: { name: '宁夏回族', kind: 'region' },
  qinghai: { name: '青海', kind: 'province' },
  shaanxi: { name: '陕西', kind: 'province' },
  shandong: { name: '山东', kind: 'province' },
  shanghai: { name: '上海', kind: 'municipality' },
  shanxi: { name: '山西', kind: 'province' },
  sichuan: { name: '四川', kind: 'province' },
  tianjin: { name: '天津', kind: 'municipality' },
  tibet: { name: '西藏', kind: 'region' },
  xizang: { name: '西藏', kind: 'region' },
  xinjiang: { name: '新疆维吾尔', kind: 'region' },
  yunnan: { name: '云南', kind: 'province' },
  zhejiang: { name: '浙江', kind: 'province' },
  'hong kong': { name: '香港', kind: 'sar' },
  macao: { name: '澳门', kind: 'sar' },
  macau: { name: '澳门', kind: 'sar' },
  taiwan: { name: '台湾', kind: 'province' },
};

const CITIES: Record<string, string> = {
  // 直辖市与港澳台
  beijing: '北京',
  shanghai: '上海',
  tianjin: '天津',
  chongqing: '重庆',
  taipei: '台北',
  kaohsiung: '高雄',
  taichung: '台中',
  // 山东（全覆盖 + 曲阜）
  jinan: '济南',
  qingdao: '青岛',
  zibo: '淄博',
  zaozhuang: '枣庄',
  dongying: '东营',
  yantai: '烟台',
  weifang: '潍坊',
  jining: '济宁',
  qufu: '曲阜',
  "tai'an": '泰安',
  taian: '泰安',
  weihai: '威海',
  rizhao: '日照',
  linyi: '临沂',
  dezhou: '德州',
  liaocheng: '聊城',
  binzhou: '滨州',
  heze: '菏泽',
  // 河北
  shijiazhuang: '石家庄',
  tangshan: '唐山',
  qinhuangdao: '秦皇岛',
  handan: '邯郸',
  xingtai: '邢台',
  baoding: '保定',
  zhangjiakou: '张家口',
  chengde: '承德',
  cangzhou: '沧州',
  langfang: '廊坊',
  hengshui: '衡水',
  // 山西 & 内蒙古
  taiyuan: '太原',
  datong: '大同',
  changzhi: '长治',
  jinzhong: '晋中',
  yuncheng: '运城',
  linfen: '临汾',
  hohhot: '呼和浩特',
  baotou: '包头',
  chifeng: '赤峰',
  ordos: '鄂尔多斯',
  tongliao: '通辽',
  // 东北（辽宁、吉林、黑龙江）
  shenyang: '沈阳',
  dalian: '大连',
  anshan: '鞍山',
  fushun: '抚顺',
  jinzhou: '锦州',
  yingkou: '营口',
  changchun: '长春',
  jilin: '吉林',
  siping: '四平',
  yanji: '延吉',
  harbin: '哈尔滨',
  qiqihar: '齐齐哈尔',
  mudanjiang: '牡丹江',
  jiamusi: '佳木斯',
  daqing: '大庆',
  // 江苏
  nanjing: '南京',
  wuxi: '无锡',
  xuzhou: '徐州',
  changzhou: '常州',
  suzhou: '苏州',
  nantong: '南通',
  lianyungang: '连云港',
  "huai'an": '淮安',
  huaian: '淮安',
  yancheng: '盐城',
  yangzhou: '扬州',
  zhenjiang: '镇江',
  taizhou: '泰州',
  suqian: '宿迁',
  // 浙江
  hangzhou: '杭州',
  ningbo: '宁波',
  wenzhou: '温州',
  jiaxing: '嘉兴',
  huzhou: '湖州',
  shaoxing: '绍兴',
  jinhua: '金华',
  quzhou: '衢州',
  zhoushan: '舟山',
  lishui: '丽水',
  // 安徽
  hefei: '合肥',
  wuhu: '芜湖',
  bengbu: '蚌埠',
  huainan: '淮南',
  maanshan: '马鞍山',
  anqing: '安庆',
  huangshan: '黄山',
  chuzhou: '滁州',
  fuyang: '阜阳',
  suzhou_ah: '宿州',
  "lu'an": '六安',
  luan: '六安',
  bozhou: '亳州',
  xuancheng: '宣城',
  // 福建 & 江西
  fuzhou: '福州',
  xiamen: '厦门',
  putian: '莆田',
  sanming: '三明',
  quanzhou: '泉州',
  zhangzhou: '漳州',
  nanping: '南平',
  longyan: '龙岩',
  ningde: '宁德',
  nanchang: '南昌',
  jingdezhen: '景德镇',
  jiujiang: '九江',
  ganzhou: '赣州',
  "ji'an": '吉安',
  jian: '吉安',
  yichun: '宜春',
  shangrao: '上饶',
  // 河南
  zhengzhou: '郑州',
  kaifeng: '开封',
  luoyang: '洛阳',
  pingdingshan: '平顶山',
  anyang: '安阳',
  xinxiang: '新乡',
  jiaozuo: '焦作',
  puyang: '濮阳',
  xuchang: '许昌',
  nanyang: '南阳',
  shangqiu: '商丘',
  xinyang: '信阳',
  zhoukou: '周口',
  zhumadian: '驻马店',
  // 湖北 & 湖南
  wuhan: '武汉',
  huangshi: '黄石',
  shiyan: '十堰',
  yichang: '宜昌',
  xiangyang: '襄阳',
  jingzhou: '荆州',
  huanggang: '黄冈',
  xiaogan: '孝感',
  changsha: '长沙',
  zhuzhou: '株洲',
  xiangtan: '湘潭',
  hengyang: '衡阳',
  shaoyang: '邵阳',
  yueyang: '岳阳',
  changde: '常德',
  chenzhou: '郴州',
  // 广东、广西、海南
  guangzhou: '广州',
  shaoguan: '韶关',
  shenzhen: '深圳',
  zhuhai: '珠海',
  shantou: '汕头',
  foshan: '佛山',
  jiangmen: '江门',
  zhanjiang: '湛江',
  maoming: '茂名',
  zhaoqing: '肇庆',
  huizhou: '惠州',
  meizhou: '梅州',
  dongguan: '东莞',
  zhongshan: '中山',
  chaozhou: '潮州',
  jieyang: '揭阳',
  nanning: '南宁',
  liuzhou: '柳州',
  guilin: '桂林',
  beihai: '北海',
  yulin_gx: '玉林',
  haikou: '海口',
  sanya: '三亚',
  // 西南（四川、贵州、云南、西藏）
  chengdu: '成都',
  mianyang: '绵阳',
  deyang: '德阳',
  luzhou: '泸州',
  leshan: '乐山',
  nanchong: '南充',
  yibin: '宜宾',
  dazhou: '达州',
  guiyang: '贵阳',
  liupanshui: '六盘水',
  zunyi: '遵义',
  bijie: '毕节',
  kunming: '昆明',
  qujing: '曲靖',
  yuxi: '玉溪',
  dali: '大理',
  lijiang: '丽江',
  lhasa: '拉萨',
  // 西北（陕西、甘肃、青海、宁夏、新疆）
  "xi'an": '西安',
  xian: '西安',
  baoji: '宝鸡',
  xianyang: '咸阳',
  weinan: '渭南',
  "yan'an": '延安',
  yanan: '延安',
  hanzhong: '汉中',
  yulin: '榆林',
  lanzhou: '兰州',
  tianshui: '天水',
  jiuquan: '酒泉',
  zhangye: '张掖',
  xining: '西宁',
  yinchuan: '银川',
  urumqi: '乌鲁木齐',
  korla: '库尔勒',
  kashgar: '喀什',
};

const COUNTRIES: Record<string, string> = {
  CN: '中国',
  HK: '中国香港',
  MO: '中国澳门',
  TW: '中国台湾',
  US: '美国',
  JP: '日本',
  KR: '韩国',
  SG: '新加坡',
  GB: '英国',
  DE: '德国',
  FR: '法国',
  AU: '澳大利亚',
  CA: '加拿大',
};

export interface CfGeo {
  country?: string | null;
  region?: string | null;
  city?: string | null;
}

function keyOf(value: string | null | undefined): string {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function resolveCityName(provinceKey: string, cityKey: string): string | undefined {
  if (!cityKey) return undefined;
  if (cityKey === 'taizhou' && provinceKey === 'zhejiang') return '台州';
  if (cityKey === 'suzhou' && provinceKey === 'anhui') return '宿州';
  if (cityKey === 'fuzhou' && provinceKey === 'jiangxi') return '抚州';
  if (cityKey === 'yichun' && provinceKey === 'heilongjiang') return '伊春';
  if (cityKey === 'yulin' && provinceKey === 'guangxi') return '玉林';
  return CITIES[cityKey];
}

function provinceLabel(info: { name: string; kind: 'municipality' | 'province' | 'region' | 'sar' }): string {
  if (info.kind === 'municipality') return `${info.name}市`;
  if (info.kind === 'region') return `${info.name}自治区`;
  if (info.kind === 'sar') return `${info.name}特别行政区`;
  return `${info.name}省`;
}

/** 例如 Shandong + Rizhao → 山东省日照市。无法识别时返回 null。 */
export function formatVisitRegion(geo: CfGeo): string | null {
  const country = (geo.country || '').trim().toUpperCase();
  const provKey = keyOf(geo.region);
  const cityKey = keyOf(geo.city);
  const province = PROVINCES[provKey];
  const cityName = resolveCityName(provKey, cityKey);

  if (country === 'CN' || (!country && province)) {
    if (!province && !cityName) return country === 'CN' ? '中国' : null;
    if (province?.kind === 'municipality' || province?.kind === 'sar') return provinceLabel(province);
    if (province && cityName && (cityName !== province.name || provKey === 'jilin')) {
      return `${provinceLabel(province)}${cityName}市`;
    }
    if (province) return provinceLabel(province);
    return cityName ? `${cityName}市` : '中国';
  }

  const countryName = COUNTRIES[country] || (country ? country : null);
  if (!countryName && !cityName) return null;
  const place = cityName ? `${cityName}市` : (geo.city || '').trim();
  if (countryName && place) return `${countryName} ${place}`;
  return countryName || place || null;
}
