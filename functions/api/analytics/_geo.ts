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
  jinan: '济南',
  qingdao: '青岛',
  zibo: '淄博',
  zaozhuang: '枣庄',
  dongying: '东营',
  yantai: '烟台',
  weifang: '潍坊',
  jining: '济宁',
  "tai'an": '泰安',
  taian: '泰安',
  weihai: '威海',
  rizhao: '日照',
  linyi: '临沂',
  dezhou: '德州',
  liaocheng: '聊城',
  binzhou: '滨州',
  heze: '菏泽',
  nanjing: '南京',
  suzhou: '苏州',
  wuxi: '无锡',
  xuzhou: '徐州',
  hangzhou: '杭州',
  ningbo: '宁波',
  wenzhou: '温州',
  hefei: '合肥',
  fuzhou: '福州',
  xiamen: '厦门',
  nanchang: '南昌',
  zhengzhou: '郑州',
  wuhan: '武汉',
  changsha: '长沙',
  guangzhou: '广州',
  shenzhen: '深圳',
  zhuhai: '珠海',
  dongguan: '东莞',
  foshan: '佛山',
  nanning: '南宁',
  haikou: '海口',
  sanya: '三亚',
  chengdu: '成都',
  chongqing: '重庆',
  guiyang: '贵阳',
  kunming: '昆明',
  "xi'an": '西安',
  xian: '西安',
  lanzhou: '兰州',
  xining: '西宁',
  yinchuan: '银川',
  urumqi: '乌鲁木齐',
  lhasa: '拉萨',
  hohhot: '呼和浩特',
  shijiazhuang: '石家庄',
  taiyuan: '太原',
  shenyang: '沈阳',
  dalian: '大连',
  changchun: '长春',
  harbin: '哈尔滨',
  beijing: '北京',
  shanghai: '上海',
  tianjin: '天津',
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

function provinceLabel(info: { name: string; kind: 'municipality' | 'province' | 'region' | 'sar' }): string {
  if (info.kind === 'municipality') return `${info.name}市`;
  if (info.kind === 'region') return `${info.name}自治区`;
  if (info.kind === 'sar') return `${info.name}特别行政区`;
  return `${info.name}省`;
}

/** 例如 Shandong + Rizhao → 山东省日照市。无法识别时返回 null。 */
export function formatVisitRegion(geo: CfGeo): string | null {
  const country = (geo.country || '').trim().toUpperCase();
  const province = PROVINCES[keyOf(geo.region)];
  const cityName = CITIES[keyOf(geo.city)];

  if (country === 'CN' || (!country && province)) {
    if (!province && !cityName) return country === 'CN' ? '中国' : null;
    if (province?.kind === 'municipality' || province?.kind === 'sar') return provinceLabel(province);
    if (province && cityName && cityName !== province.name) return `${provinceLabel(province)}${cityName}市`;
    if (province) return provinceLabel(province);
    return cityName ? `${cityName}市` : '中国';
  }

  const countryName = COUNTRIES[country] || (country ? country : null);
  if (!countryName && !cityName) return null;
  const place = cityName ? `${cityName}市` : (geo.city || '').trim();
  if (countryName && place) return `${countryName} ${place}`;
  return countryName || place || null;
}
