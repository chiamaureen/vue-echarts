var cities=["基隆市","臺北市","新北市","桃園市","新竹市","新竹縣","苗栗縣","臺中市","彰化縣","南投縣","雲林縣","嘉義市","嘉義縣","臺南市","高雄市","屏東縣","恆春半島","宜蘭縣","花蓮縣","臺東縣","蘭嶼綠島","連江縣","金門縣","澎湖縣","其他"];

var towns={'臺北市': ['北投區', '士林區', '大同區', '中山區', '松山區', '萬華區', '中正區', '大安區', '信義區', '內湖區', '南港區', '文山區'], '基隆市': ['中山區', '中正區', '安樂區', '仁愛區', '信義區', '七堵區', '暖暖區'], '新北市': ['石門區', '金山區', '萬里區', '汐止區', '平溪區', '瑞芳區', '貢寮區', '雙溪區', '坪林區', '石碇區', '深坑區', '三芝區', '淡水區', '八里區', '林口區', '五股區', '蘆洲區', '泰山區', '三重區', '新莊區', '板橋區', '永和區', '中和區', '新店區', '土城區', '樹林區', '鶯歌區', '三峽區', '烏來區'], '桃園市': ['大園區', '觀音區', '新屋區', '蘆竹區', '龜山區', '桃園區', '中壢區', '八德區', '楊梅區', '平鎮區', '龍潭區', '大溪區', '復興區'], '新竹市': ['北區', '香山區', '東區'], '新竹縣': ['新豐鄉', '竹北市', '湖口鄉', '新埔鎮', '關西鎮', '芎林鄉', '竹東鎮', '寶山鄉', '峨眉鄉', '北埔鄉', '橫山鄉', '五峰鄉', '尖石鄉'], '苗栗縣': ['竹南鎮', '後龍鎮', '西湖鄉', '通霄鎮', '苑裡鎮', '頭份市', '造橋鄉', '苗栗市', '三灣鄉', '頭屋鄉', '公館鄉', '銅鑼鄉', '三義鄉', '南庄鄉', '獅潭鄉', '大湖鄉', '卓蘭鎮', '泰安鄉'], '臺中市': ['大甲區', '大安區', '外埔區', '清水區', '梧棲區', '沙鹿區', '龍井區', '大肚區', '后里區', '神岡區', '豐原區', '大雅區', '潭子區', '西屯區', '南屯區', '烏日區', '北屯區', '北區', '西區', '中區', '南區', '東區', '大里區', '霧峰區', '太平區', '石岡區', '東勢區', '新社區', '和平區'], '南投縣': ['草屯鎮', '南投市', '名間鄉', '中寮鄉', '集集鎮', '國姓鄉', '埔里鎮', '魚池鄉', '水里鄉', '鹿谷鄉', '竹山鎮', '仁愛鄉', '信義鄉'], '彰化縣': ['伸港鄉', '線西鄉', '鹿港鎮', '福興鄉', '芳苑鄉', '大城鄉', '和美鎮', '彰化市', '秀水鄉', '花壇鄉', '大村鄉', '埔鹽鄉', '溪湖鎮', '埔心鄉', '永靖鄉', '田尾鄉', '二林鎮', '竹塘鄉', '埤頭鄉', '北斗鎮', '溪州鄉', '員林市', '社頭鄉', '田中鎮', '二水鄉', '芬園鄉'], '雲林縣': ['麥寮鄉', '臺西鄉', '四湖鄉', '口湖鄉', '崙背鄉', '二崙鄉', '東勢鄉', '褒忠鄉', '土庫鎮', '元長鄉', '北港鎮', '水林鄉', '西螺鎮', '莿桐鄉', '虎尾鎮', '斗南鎮', '大埤鄉', '林內鄉', '斗六市', '古坑鄉'], '嘉義市': ['西區', '東區'], '嘉義縣': ['東石鄉', '布袋鎮', '六腳鄉', '朴子市', '義竹鄉', '溪口鄉', '新港鄉', '太保市', '鹿草鄉', '水上鄉', '大林鎮', '民雄鄉', '梅山鄉', '竹崎鄉', '番路鄉', '中埔鄉', '大埔鄉', '阿里山鄉'], '臺南市': ['北門區', '學甲區', '將軍區', '佳里區', '七股區', '西港區', '安南區', '北區', '安平區', '中西區', '東區', '南區', '鹽水區', '後壁區', '新營區', '柳營區', '下營區', '六甲區', '麻豆區', '官田區', '善化區', '安定區', '新市區', '永康區', '仁德區', '大內區', '玉井區', '山上區', '新化區', '左鎮區', '歸仁區', '關廟區', '龍崎區', '白河區', '東山區', '楠西區', '南化區'], '高雄市': ['茄萣區', '湖內區', '永安區', '彌陀區', '梓官區', '楠梓區', '左營區', '鼓山區', '三民區', '苓雅區', '鹽埕區', '前金區', '新興區', '旗津區', '前鎮區', '小港區', '林園區', '路竹區', '阿蓮區', '岡山區', '橋頭區', '田寮區', '燕巢區', '大社區', '仁武區', '大樹區', '鳥松區', '鳳山區', '大寮區', '內門區', '旗山區', '杉林區', '美濃區', '甲仙區', '六龜區', '茂林區', '那瑪夏區', '桃源區'], '屏東縣': ['里港鄉', '九如鄉', '高樹鄉', '鹽埔鄉', '屏東市', '萬丹鄉', '長治鄉', '麟洛鄉', '內埔鄉', '竹田鄉', '萬巒鄉', '潮州鎮', '崁頂鄉', '南州鄉', '新埤鄉', '新園鄉', '東港鎮', '林邊鄉', '佳冬鄉', '枋寮鄉', '枋山鄉', '三地門鄉', '霧臺鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '車城鄉', '恆春鎮', '牡丹鄉', '滿州鄉', '琉球鄉'], '恆春半島':['枋山鄉', '獅子鄉', '車城鄉', '恆春鎮', '牡丹鄉', '滿州鄉'], '宜蘭縣': ['頭城鎮', '礁溪鄉', '壯圍鄉', '宜蘭市', '五結鄉', '羅東鎮', '冬山鄉', '員山鄉', '三星鄉', '蘇澳鎮', '南澳鄉', '大同鄉'], '花蓮縣': ['新城鄉', '花蓮市', '吉安鄉', '壽豐鄉', '豐濱鄉', '鳳林鎮', '光復鄉', '瑞穗鄉', '玉里鎮', '富里鄉', '秀林鄉', '萬榮鄉', '卓溪鄉'], '臺東縣': ['長濱鄉', '成功鎮', '東河鄉', '池上鄉', '關山鎮', '鹿野鄉', '臺東市', '太麻里鄉', '大武鄉', '海端鄉', '延平鄉', '卑南鄉', '金峰鄉', '達仁鄉', '綠島鄉', '蘭嶼鄉'], '蘭嶼綠島':['蘭嶼鄉', '綠島鄉'], '澎湖縣': ['白沙鄉', '西嶼鄉', '湖西鄉', '馬公市', '望安鄉', '七美鄉'], '金門縣': ['烏坵鄉', '金沙鎮', '金湖鎮', '金寧鄉', '金城鎮', '烈嶼鄉'], '連江縣': ['東引鄉', '北竿鄉', '南竿鄉', '莒光鄉'],"其他":["島嶼"]};

var nearshore_towns={'基隆市': ['中山區', '中正區', '安樂區'], '新北市': ['石門區', '金山區', '萬里區', '瑞芳區', '貢寮區', '三芝區', '淡水區', '八里區', '林口區'], '桃園市': ['大園區', '觀音區', '新屋區', '蘆竹區'], '新竹市': ['北區', '香山區'], '新竹縣': ['新豐鄉', '竹北市'], '苗栗縣': ['竹南鎮', '後龍鎮', '通霄鎮', '苑裡鎮'], '臺中市': ['大甲區', '大安區', '清水區', '梧棲區', '龍井區'], '彰化縣': ['伸港鄉', '線西鄉', '鹿港鎮', '福興鄉', '芳苑鄉', '大城鄉'], '雲林縣': ['麥寮鄉', '臺西鄉', '四湖鄉', '口湖鄉'], '嘉義縣': ['東石鄉', '布袋鎮'], '臺南市': ['北門區', '將軍區', '七股區', '安南區', '安平區', '南區'], '高雄市': ['茄萣', '永安區', '彌陀區', '梓官區', '楠梓區', '左營區', '鼓山區', '旗津區', '前鎮區', '小港區', '林園區'], '屏東縣': ['新園鄉', '東港鎮', '林邊鄉', '佳冬鄉', '枋寮鄉', '琉球鄉'], '恆春半島':['枋山鄉', '車城鄉', '恆春鎮', '牡丹鄉', '滿州鄉'], '宜蘭縣': ['頭城鎮', '壯圍鄉', '五結鄉', '蘇澳鎮', '南澳鄉'], '花蓮縣': ['新城鄉', '花蓮市', '吉安鄉', '壽豐鄉', '豐濱鄉', '秀林鄉'], '臺東縣': ['長濱鄉', '成功鎮', '東河鄉', '臺東市', '太麻里鄉', '大武鄉', '卑南鄉', '達仁鄉'], '蘭嶼綠島':['蘭嶼鄉', '綠島鄉'], '澎湖縣': ['白沙鄉', '西嶼鄉', '湖西鄉', '馬公市', '望安鄉', '七美鄉'], '金門縣': ['烏坵鄉', '金沙鎮', '金湖鎮', '金寧鄉', '金城鎮', '烈嶼鄉'], '連江縣': ['東引鄉', '北竿鄉', '南竿鄉', '莒光鄉']};

var mountain_towns={'臺北市': ['北投區', '士林區'], '新北市': ['平溪區', '坪林區', '石碇區', '三峽區', '烏來區'], '桃園市': ['復興區'], '新竹縣': ['北埔鄉', '橫山鄉', '五峰鄉', '尖石鄉'], '苗栗縣': ['南庄鄉', '獅潭鄉', '大湖鄉', '卓蘭鎮', '泰安鄉'], '臺中市': ['太平區', '石岡區', '東勢區', '新社區', '和平區'], '南投縣': ['國姓鄉', '埔里鎮', '魚池鄉', '水里鄉', '鹿谷鄉', '竹山鎮', '仁愛鄉', '信義鄉'], '雲林縣': ['古坑鄉'], '嘉義縣': ['梅山鄉', '竹崎鄉', '番路鄉', '大埔鄉', '阿里山鄉'], '臺南市': ['楠西區', '南化區'], '高雄市': ['甲仙區', '六龜區', '茂林區', '那瑪夏區', '桃源區'], '屏東縣': ['三地門鄉', '霧臺鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉'], '恆春半島':['獅子鄉'], '宜蘭縣': ['南澳鄉', '大同鄉'], '花蓮縣': ['秀林鄉', '萬榮鄉', '卓溪鄉'], '臺東縣': ['海端鄉', '延平鄉', '卑南鄉', '金峰鄉', '達仁鄉']};
