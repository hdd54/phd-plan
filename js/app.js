(function(){
'use strict';

// Ensure feature scripts get access even if IIFE crashes mid-way
try{
  var _featExported=false;
  function _exportFeatVars(){
    if(_featExported)return;_featExported=true;
    try{
      if(typeof data!=='undefined'){window.data=data}
      if(typeof showToast==='function'){window.showToast=showToast}
      if(typeof save==='function'){window.save=save}
      if(typeof renderWeeks==='function'){window.renderWeeks=renderWeeks}
    }catch(e){}
  }
  setTimeout(_exportFeatVars,50);
}catch(e){}

// 鈹€鈹€ Cover removed 鈹€鈹€
const DAYS = ['鍛ㄤ竴','鍛ㄤ簩','鍛ㄤ笁','鍛ㄥ洓','鍛ㄤ簲','鍛ㄥ叚','鍛ㄦ棩'];
const WEEKDAY_MAP = {1:'鍛ㄤ竴',2:'鍛ㄤ簩',3:'鍛ㄤ笁',4:'鍛ㄥ洓',5:'鍛ㄤ簲',6:'鍛ㄥ叚',0:'鍛ㄦ棩'};
const COLORS = {a:'#d4a574',b:'#4a7c8c',c:'#d4a574',d:'#e85d2f'};

// ======================== DEFAULT DATA ========================
const Y1A = [
  {w:'绗?鍛?,s:'',d:['闃呰OCE缁艰堪1锛屾爣娉ㄦ牳蹇冩柟娉?,'闃呰OCE缁艰堪2锛屾彁鍙栨妧鏈矾绾?,'鎼缓Zotero鏂囩尞搴撳垎绫荤鐞?,'鏁寸悊OCE绯荤粺缁勬垚绗旇','鍚戝甯堟眹鎶ユ湰鍛ㄦ枃鐚繘灞?,'瀛︿範OCT鍩烘湰鍘熺悊涓庣郴缁熺粨鏋?,'鎾板啓鍗氫竴瀛︿範璁″垝鍛ㄦ姤']},
  {w:'绗?鍛?,s:'',d:['瀹屾垚銆婄敓鐗╁尰瀛﹀厜瀛︺€嬬涓夌珷','闃呰鏈烘鑷傜矘寮规€ф祴閲忕粡鍏歌鏂?,'鏁寸悊OCE淇″彿澶勭悊娴佺▼绗旇','鍦ㄥ笀鍏勬寚瀵间笅棣栨鎺ヨЕOCT绯荤粺','瀛︿範OCT杞欢鎿嶄綔鐣岄潰','閲囬泦绗竴缁勭畝鍗曟牱鍝佹暟鎹?,'璁板綍瀹為獙闂鍒楄〃']},
  {w:'绗?鍛?,s:'',d:['澶嶄範OCT鎴愬儚鍘熺悊瀹屾垚浣滀笟','闃呰鏈哄櫒浜鸿繍鍔ㄥ鍩虹绔犺妭','瀛︿範UR5鏈烘鑷傚畨鍏ㄦ搷浣滆鑼?,'鐙珛瀹屾垚OCT鍚姩-鏍″噯-鍏虫満娴佺▼','瀹屾垚鏈烘鑷傜ず鏁欏櫒鍩虹缁冧範','鎬荤粨OCT鎿嶄綔SOP鏂囨。','鏈懆鎬荤粨锛氱郴缁熸搷浣滃垵姝ユ帉鎻?]},
  {w:'绗?鍛?,s:'',d:['閲囬泦10缁凮CT鏍峰搧鏁版嵁缁冧範','瀛︿範MATLAB澶勭悊鑴氭湰','鏈烘鑷傜紪绋嬶細鍧愭爣绯讳笌杩愬姩鎸囦护','涓庡甯堣璁哄疄楠屽钩鍙版柟妗?,'璺戦€氱涓€涓嚜鍔ㄦ壂鎻忕▼搴?,'鏁版嵁鍚庡鐞嗭細淇″彿鍒板脊鎬у浘','鏈懆鎬荤粨锛氳仈璋冩柟妗堝垵姝ョ‘瀹?]},
  {w:'绗?鍛?,s:'',d:['鎼缓OCT涓庢満姊拌噦纭欢閫氫俊閾捐矾','缂栧啓鑱斿悎鎺у埗瑙﹀彂鑴氭湰','瀹屾垚鑱旇皟娴嬭瘯鈥斺€旈€氫俊鎴愬姛','瀵规爣瀹氭祦绋嬭繘琛屾祴璇?,'棰勫疄楠岋細閲囬泦5缁勪豢浣撴暟鎹?,'鏁版嵁鍒濇鍒嗘瀽璇勪及淇″櫔姣?,'鏈懆鎬荤粨锛氳仈璋冮€氳繃杩涘叆瀹為獙闃舵']},
  {w:'绗?鍛?,s:'',d:['閲嶅鎬у疄楠岋細鍚屼竴鏍峰搧娴?0娆?,'璇勪及绯荤粺閲嶅鎬ц宸?,'浼樺寲鏈烘鑷傛壂鎻忚矾寰勫弬鏁?,'闃呰缁勭粐绮樺脊鎬CE璁烘枃','鏁寸悊绗竴鐗堝疄楠屾暟鎹浘琛?,'鍚戝甯堟眹鎶ヤ袱鍛ㄥ疄楠岃繘灞?,'鏈懆鎬荤粨锛氱郴缁熺ǔ瀹氭€у凡楠岃瘉']},
  {w:'绗?鍛?,s:'',d:['璁捐姝ｅ紡瀹為獙鏂规','鍑嗗涓嶅悓纭害缁勭粐浠夸綋','閲囬泦姝ｅ紡瀹為獙绗竴鎵规暟鎹?,'鏁版嵁澶勭悊锛氱矘寮规€у弬鏁版彁鍙?,'缁撴灉鍙鍖栵細寮规€у垎甯冨浘','琛ュ厖瀹為獙璋冩暣鍙傛暟璺戠浜屾壒','鏈懆鎬荤粨锛氭寮忓疄楠屾寔缁帹杩?]},
  {w:'绗?鍛?,s:'',d:['瀹屾垚鍏ㄩ儴姝ｅ紡瀹為獙鏁版嵁閲囬泦','绯荤粺鏁寸悊鏁版嵁鍋氱粺璁″垎鏋?,'寮€濮嬫挵鍐欑患杩拌鏂囨鏋?,'瀹屾垚鏂囩尞缁艰堪閮ㄥ垎鍒濈','缁艰堪鏂规硶璁轰笌鎶€鏈姣旂珷鑺?,'缁艰堪鍒濈鍙戠粰瀵煎笀棰勮','鏈懆鎬荤粨锛氭暟鎹畬鏁寸患杩版鏋跺畬鎴?]},
];
const Y2A = [
  {w:'绗?鍛?,s:'',d:['鏁寸悊鍗氫竴鍏ㄩ儴瀹為獙鏁版嵁','妫€鏌ユ暟鎹畬鏁存€т笌寮傚父鍊?,'琛ュ厖缂哄け瀹為獙缁?,'浼樺寲鏁版嵁澶勭悊鑴氭湰','瀹屽杽瀹為獙绯荤粺绋冲畾鎬?,'澶囦唤鎵€鏈夊師濮嬫暟鎹?,'鎾板啓瀹為獙杩涘睍鎶ュ憡']},
  {w:'绗?鍛?,s:'',d:['闃呰Paper1鐩爣鏈熷垔杩戞湡璁烘枃','鏁寸悊鏂囩尞缁艰堪妗嗘灦','纭畾Paper1鍒涙柊鐐?,'鍒跺畾Paper1鍐欎綔璁″垝','缁樺埗璁烘枃鍥捐〃妯℃澘','瀛︿範鏈熷垔鎶曠鏍煎紡瑕佹眰','涓庡甯堣璁鸿鏂囨鏋?]},
  {w:'绗?鍛?,s:'',d:['Paper1缁撴灉閮ㄥ垎鏁版嵁鏁寸悊','鍒朵綔璁烘枃鏍稿績鍥捐〃','琛ュ厖缁熻鍒嗘瀽','璁烘枃鏂规硶閮ㄥ垎鍐欎綔','鎾板啓瀹為獙鏂规硶鎻忚堪','缁撴灉閮ㄥ垎鍒濈瀹屾垚','鏂规硶閮ㄥ垎鍒濈瀹屾垚']},
  {w:'绗?鍛?,s:'',d:['Paper1寮曡█閮ㄥ垎鍐欎綔','鏂囩尞寮曠敤鏁寸悊','璁ㄨ閮ㄥ垎鍐欎綔','缁撹閮ㄥ垎鎾板啓','鍏ㄦ枃鍒濈鏁村悎','妫€鏌ラ€昏緫杩炶疮鎬?,'瀹屾垚璁烘枃鍒濈']},
  {w:'绗?鍛?,s:'',d:['璁烘枃鏍煎紡涓庡弬鑰冩枃鐚皟鏁?,'鍏ㄦ枃璇█娑﹁壊','浜ょ粰瀵煎笀瀹￠槄','鎸夊甯堟剰瑙佺涓€杞慨鏀?,'绗簩杞慨鏀?,'鍥捐〃缁嗚妭瀹屽杽','缁堢瀹氱']},
  {w:'绗?鍛?,s:'',d:['鍑嗗鎶曠鏉愭枡娓呭崟','鎾板啓Cover Letter','鎺ㄨ崘瀹＄浜?,'鎶曞嚭Paper1锛?,'杩涘叆鎶曠绯荤粺璺熻釜','鏁寸悊鎶曠纭閭欢','鏈懆鎬荤粨涓庝笅闃舵璁″垝']},
  {w:'绗?鍛?,s:'',d:['鏁寸悊涓撳埄鎶€鏈氦搴曚功','璋冪爺鐩稿叧宸叉湁涓撳埄','涓庡甯堣璁轰笓鍒╃偣','纭畾涓撳埄淇濇姢鑼冨洿','鎾板啓涓撳埄鏉冨埄瑕佹眰','缁樺埗涓撳埄绀烘剰鍥?,'鍑嗗涓撳埄鐢宠鏉愭枡']},
  {w:'绗?鍛?,s:'',d:['鎻愪氦涓撳埄1鐢宠','鏁寸悊涓撳埄鐢宠鍥炴墽','鎬荤粨鍗氫簩涓婂崐骞村伐浣?,'鍒跺畾涓嬪崐骞磋鍒?,'鏂囩尞闃呰鏇存柊','瀹為獙骞冲彴缁存姢','鍑嗗缁勪細姹囨姤鏉愭枡']},
];
const Y3A = [
  {w:'绗?鍛?,s:'',d:['Paper1瀹＄鎰忚閫愭潯鏁寸悊','鍒跺畾淇敼璁″垝','涓庡甯堣璁哄洖澶嶇瓥鐣?,'閫愭潯淇敼璁烘枃','鎾板啓淇敼璇存槑','鎻愪氦淇敼绋?,'纭鎶曠鐘舵€?]},
  {w:'绗?鍛?,s:'',d:['閲嶆柊鎶曞嚭鎴栨敼鎶?,'閫夋嫨鐩爣鏈熷垔','璋冩暣璁烘枃鏍煎紡','鏇存柊Cover Letter','鎻愪氦淇敼绋?,'纭鎶曠鐘舵€?,'鏁寸悊鎶曠璁板綍']},
  {w:'绗?鍛?,s:'',d:['寮€濮婸aper2瀹為獙璁捐','闃呰鐩稿叧鏈€鏂版枃鐚?,'纭畾瀹為獙鏂规','璁捐瀵圭収瀹為獙','鍑嗗瀹為獙鏉愭枡','璺慞aper2棰勫疄楠?,'鍒嗘瀽棰勫疄楠岀粨鏋?]},
  {w:'绗?鍛?,s:'',d:['浼樺寲瀹為獙鍙傛暟','鏁寸悊瀹為獙鏉愭枡','瀹屽杽瀹為獙SOP','瀛︿範鏂板疄楠屾妧鏈?,'鏍″噯瀹為獙璁惧','鍒跺畾姝ｅ紡瀹為獙璁″垝','鍚戝甯堟眹鎶ュ疄楠屾柟妗?]},
  {w:'绗?鍛?,s:'',d:['Paper2姝ｅ紡瀹為獙鏁版嵁閲囬泦','璁板綍瀹為獙鏁版嵁','姣忔棩瀹為獙鏃ュ織','鏁版嵁鍒濇鍒嗘瀽','妫€鏌ユ暟鎹川閲?,'琛ュ厖閲嶅瀹為獙','鏁寸悊瀹為獙鏁版嵁琛?]},
  {w:'绗?鍛?,s:'',d:['瀹屾垚瀹為獙鏁版嵁閲囬泦','鏁版嵁缁熻鍒嗘瀽','鍒朵綔瀹為獙缁撴灉鍥?,'楠岃瘉瀹為獙缁撹','鎬荤粨瀹為獙鍙戠幇','鎾板啓瀹為獙鏂规硶閮ㄥ垎','瀹屾垚瀹為獙閮ㄥ垎']},
  {w:'绗?鍛?,s:'',d:['Paper2鍐欎綔寮€濮?,'鎾板啓寮曡█閮ㄥ垎','鏋勫缓璁烘枃妗嗘灦','鏂囩尞缁艰堪鏇存柊','鎾板啓缁撴灉涓庤璁?,'缁樺埗璁烘枃鍥捐〃','瀹屾垚鏂规硶閮ㄥ垎']},
  {w:'绗?鍛?,s:'',d:['瀹屾垚Paper2鍒濈','鍏ㄦ枃閫氳淇敼','璇█娑﹁壊','鏍煎紡璋冩暣','淇敼鍚庢姇鍑?,'杩借釜鎶曠鐘舵€?,'纭鎶曠鎴愬姛']},
  {w:'绗?鍛?,s:'',d:['涓撳埄2鐢宠鏉愭枡鏁寸悊','璋冪爺鐩稿叧涓撳埄','鎾板啓涓撳埄鏂囦欢','鎻愪氦涓撳埄2','鍗氬＋璁烘枃寮€棰樻姤鍛婃挵鍐?,'闃呰寮€棰樼浉鍏虫枃鐚?,'纭畾璁烘枃閫夐鏂瑰悜']},
  {w:'绗?0鍛?,s:'',d:['鏂囩尞缁艰堪绔犺妭瀹屾垚','鐮旂┒鍐呭涓庢妧鏈矾绾跨‘瀹?,'鎾板啓寮€棰樻姤鍛?,'鍒涙柊鐐规彁鐐?,'鐮旂┒璁″垝鏃堕棿琛?,'寮€棰楶PT鍒朵綔','棰勬紨寮€棰樻眹鎶?]},
  {w:'绗?1鍛?,s:'',d:['寮€棰樼瓟杈╅婕?,'妯℃嫙闂瓟鍑嗗','姝ｅ紡寮€棰樼瓟杈?,'璁板綍涓撳鎰忚','绛旇京鎬荤粨','鏁寸悊淇敼寤鸿','搴嗙寮€棰橀€氳繃']},
  {w:'绗?2鍛?,s:'',d:['寮€棰橀€氳繃鍚庢暣鐞嗕笓瀹舵剰瑙?,'淇敼鐮旂┒鏂规','鏇存柊鐮旂┒璁″垝','鏁寸悊寮€棰樻潗鏂欏綊妗?,'鍒跺畾涓嬩竴闃舵鐮旂┒璁″垝','涓庡甯堣璁哄弽棣?,'鏇存柊瀹為獙鏃堕棿琛?]},
];
const Y4A = [
  {w:'绗?鍛?,s:'',d:['鍗氬＋璁烘枃绗竴绔犲畾绋?,'瀹屽杽缁閮ㄥ垎','琛ュ厖鏈€鏂版枃鐚?,'鏇存柊鐮旂┒鑳屾櫙','鏄庣‘鐮旂┒鎰忎箟','纭畾璁烘枃妗嗘灦','绗竴绔犳牸寮忚鑼?]},
  {w:'绗?鍛?,s:'',d:['鍗氬＋璁烘枃绗簩绔犲啓浣?,'鏂囩尞缁艰堪娣卞寲','鐞嗚妗嗘灦寤虹珛','鐮旂┒鏂规硶鎻忚堪','绔犺妭琛旀帴杩炶疮','绗簩绔犲垵绋垮畬鎴?,'浜ゅ弶妫€鏌ュ紩鐢?]},
  {w:'绗?鍛?,s:'',d:['绗笁绔犲疄楠屾暟鎹暣鐞?,'瀹為獙缁撴灉琛ュ叏','鏁版嵁缁熻鍒嗘瀽','鍒朵綔瀹為獙缁撴灉鍥捐〃','鎾板啓瀹為獙绔犺妭','楠岃瘉瀹為獙缁撹','绗笁绔犲垵绋?]},
  {w:'绗?鍛?,s:'',d:['绗洓绔犲垵绋?,'绗簲绔犲垵绋?,'鍏ㄦ枃杩涘害妫€鏌?,'妫€鏌ョ珷鑺傞€昏緫','琛ュ厖缂哄け鍐呭','璁烘枃缁撴瀯浼樺寲','瀹屾垚鍒濈鏁村悎']},
  {w:'绗?鍛?,s:'',d:['璁烘枃鍒濈瀹屾垚鍙戠粰瀵煎笀','绛夊緟瀵煎笀瀹￠槄','鍑嗗淇敼璁″垝','鎸夊甯堟剰瑙佺涓€杞慨鏀?,'淇敼閲嶇偣绔犺妭','琛ュ厖瀹為獙鏁版嵁','淇敼璇存槑璁板綍']},
  {w:'绗?鍛?,s:'',d:['绗簩杞慨鏀?,'璁烘枃鏍煎紡瑙勮寖鍖?,'鍙傝€冩枃鐚暣鐞?,'鍥捐〃缂栧彿鏍稿','璁烘枃鎽樿鎾板啓','缁撹閮ㄥ垎瀹氱','瀹屾垚鍏ㄦ枃淇敼']},
  {w:'绗?鍛?,s:'',d:['璁烘枃鏍煎紡鏈€缁堟鏌?,'椤电湁椤佃剼璁剧疆','鐩綍鏇存柊','鍙傝€冩枃鐚牸寮忕粺涓€','璁烘枃灏侀潰鍒朵綔','璁烘枃鎽樿涓庣粨璁哄畾绋?,'鎻愪氦棰勫鐢宠']},
  {w:'绗?鍛?,s:'',d:['鎻愪氦棰勫鏉愭枡','绛夊緟棰勫缁撴灉','鎸夐瀹℃剰瑙佷慨鏀?,'鍑嗗閫佸鏉愭枡','濉啓閫佸琛ㄦ牸','鍔炵悊閫佸鎵嬬画','鎻愪氦鐩插']},
  {w:'绗?鍛?,s:'',d:['閫佺洸瀹?,'绛夊緟鐩插缁撴灉','澶囪€冪浉鍏冲噯澶?,'淇敼璁烘枃澶囩敤','鍑嗗绛旇京鏉愭枡','鍏虫敞鐩插杩涘害','涓庡甯堜繚鎸佹矡閫?]},
  {w:'绗?0鍛?,s:'',d:['鐩插鎰忚杩斿洖','閫愭潯闃呰璇勫鎰忚','鎸夌洸瀹℃剰瑙佷慨鏀?,'淇敼璇存槑鎾板啓','閲嶇偣淇敼闂绔犺妭','琛ュ厖鏁版嵁鎴栬璇?,'瀹屾垚淇敼绋?]},
  {w:'绗?1鍛?,s:'',d:['棰勭瓟杈㏄PT鍒朵綔','姹囨姤鍐呭鎺掔粌','妯℃嫙闂瓟鍑嗗','棰勭瓟杈╅婕?,'閭€璇峰甯堥鍚?,'淇敼PPT','鍑嗗璁茬']},
  {w:'绗?2鍛?,s:'',d:['棰勭瓟杈?,'璁板綍涓撳鎰忚','鎸夋剰瑙佷慨鏀硅鏂?,'鏇存柊璁烘枃缁堢','鏁寸悊绛旇京鏉愭枡','鍑嗗姝ｅ紡绛旇京','璁烘枃鏈€缁堝畾绋?]},
];
const Y5A = [
  {w:'绗?鍛?,s:'',d:['妫€鏌ユ瘯涓氳姹傚畬鎴愭儏鍐?,'鏍稿瀛﹀垎涓庡彂琛ㄨ姹?,'琛ラ綈鍓╀綑瀹為獙鏁版嵁','鍒嗘瀽缂哄け鏁版嵁','琛ュ厖瀹為獙','瀹屽杽瀹為獙璁板綍','鏁寸悊姣曚笟璁烘枃鏉愭枡']},
  {w:'绗?鍛?,s:'',d:['琛ュ啓璁烘枃缂哄け绔犺妭','瀹屽杽璁烘枃缁嗚妭','鏁版嵁琛ュ厖鍒嗘瀽','璁烘枃鍒濈瀹屾垚','閫氳鍏ㄦ枃妫€鏌?,'鏍煎紡缁熶竴璋冩暣','鍙戠粰瀵煎笀淇敼']},
  {w:'绗?鍛?,s:'',d:['绛夊緟瀵煎笀瀹￠槄','鎸夋剰瑙佷慨鏀?,'閫愭潯淇敼鏍囨敞','淇敼璇存槑鎾板啓','瀵煎笀浜屾瀹￠槄','鍐嶆淇敼瀹屽杽','璁烘枃瀹氱']},
  {w:'绗?鍛?,s:'',d:['璁烘枃鏌ラ噸妫€娴?,'闄嶄綆閲嶅鐜囦慨鏀?,'鏍煎紡鏈€缁堟鏌?,'灏侀潰鐩綍鍒朵綔','椤电湁椤佃剼妫€鏌?,'鍙傝€冩枃鐚牳瀵?,'璁烘枃鎵撳嵃瑁呰']},
  {w:'绗?鍛?,s:'',d:['閫佸鏉愭枡鍑嗗','鍔炵悊閫佸鎵嬬画','鎻愪氦鐩插','绛夊緟鐩插缁撴灉','鍑嗗绛旇京PPT鍒濈','闃呰鐩稿叧鏈€鏂版枃鐚?,'鍑嗗绛旇京闂']},
  {w:'绗?鍛?,s:'',d:['鐩插鎰忚杩斿洖','鐩插淇敼','淇敼璇存槑鎾板啓','瀵煎笀纭淇敼','绛旇京PPT瀹屽杽','绛旇京婕旇缁冧範','妯℃嫙绛旇京']},
  {w:'绗?鍛?,s:'',d:['绛旇京鏉愭枡鍑嗗','绛旇京鍦哄湴纭','姝ｅ紡绛旇京','璁板綍绛旇京鎰忚','绛旇京鍚庝慨鏀?,'鎻愪氦缁堢','搴嗙绛旇京閫氳繃锛?]},
  {w:'绗?鍛?,s:'',d:['姣曚笟鏉愭枡鎻愪氦','瀛︿綅鐢宠','鍔炵悊绂绘牎鎵嬬画','鏁寸悊鐮旂┒鐢熸湡闂磋祫鏂?,'鎰熻阿瀵煎笀涓庡悓瀛?,'姣曚笟鍏哥ぜ','姣曚笟锛侌煄?]},
];

// ======================== STATE ========================
const SK = 'phd_v4';
let data = load();
// openState: { 'y1-academic': {0:true, 1:false, ...} }
let openState = loadOpenState();
function loadOpenState() {
  try { return JSON.parse(localStorage.getItem(SK+'_open')||'{}'); } catch(e) { return {}; }
}
function saveOpenState() {
  try { localStorage.setItem(SK+'_open', JSON.stringify(openState)); } catch(e) {}
}

function load() {
  try {
    const raw = localStorage.getItem(SK);
    if (raw) {
      const p = JSON.parse(raw);
      ensure(p);
      return p;
    }
  } catch(e) {}
  const init = {};
  ensure(init);
  return init;
}
function ensure(p) {
  [
    ['y1-academic',Y1A],['y2-academic',Y2A],['y3-academic',Y3A],['y4-academic',Y4A],['y5-academic',Y5A]
  ].forEach(([k,v])=>{
    if(!p[k]||!Array.isArray(p[k])||p[k].length===0) p[k]=cloneDeep(v);
  });
  ['y1','y2','y3','y4','y5'].forEach(y=>['exam','finance','life'].forEach(t=>{const c=y+'-'+t;if(!p[c])p[c]=[]}));
  // Ensure overviews storage
  if (!p._overviews) p._overviews = {};
  // Ensure settings defaults
  if (!p._settings) p._settings = {fontSize:1,fontFamily:0,lineHeight:1,pageWidth:0};
  if (p._settings.fontSizeCustom===undefined) p._settings.fontSizeCustom='';
  if (p._settings.fontFamilyCustom===undefined) p._settings.fontFamilyCustom='';
  if (p._settings.lineHeightCustom===undefined) p._settings.lineHeightCustom='';
  if (p._settings.pageWidth===undefined) p._settings.pageWidth=0;
  // Migration: expand ranged week labels (e.g. '绗?-4鍛? 鈫?individual weeks)
  var expanded=0;
  ['y1-academic','y2-academic','y3-academic','y4-academic','y5-academic'].forEach(function(cid){
    if(!p[cid]||!Array.isArray(p[cid])||p[cid].length<2)return;
    // Check if first week label contains a dash (ranged)
    var first=p[cid][0].w;
    if(first&&first.indexOf('-')>0){
      var newWeeks=[];p[cid].forEach(function(w){
        if(w.s)s=w.s;
        var m=w.w.match(/绗?\d+)[-鈥撹嚦](\d+)鍛?);
        if(!m){newWeeks.push({w:w.w,s:(w.s||w.summary||''),d:w.d.slice()});return}
        var start=parseInt(m[1]),end=parseInt(m[2]);
        var tasks=w.d.filter(function(t){return t&&t.trim()});
        var per=Math.max(1,Math.ceil(tasks.length/(end-start+1)));
        for(var wi=start;wi<=end;wi++){
          var weekTasks=[];
          for(var di=0;di<per;di++){var ti=(wi-start)*per+di;if(tasks[ti])weekTasks.push(tasks[ti])}
          if(weekTasks.length===0)weekTasks=[''];
          newWeeks.push({w:'绗?+wi+'鍛?,s:(wi===end?(w.s||w.summary||''):''),d:weekTasks})
        }
      });
      p[cid]=newWeeks;expanded++;
    }
  });
  if(expanded>0)save();
  // === FIX: ensure every week across all cards has exactly 7 days (鍛ㄤ竴~鍛ㄦ棩) ===
  var _days7 = ['鍛ㄤ竴','鍛ㄤ簩','鍛ㄤ笁','鍛ㄥ洓','鍛ㄤ簲','鍛ㄥ叚','鍛ㄦ棩'];
  Object.entries(p).forEach(function(_a){
    var _v=_a[1];
    if(!Array.isArray(_v))return;
    _v.forEach(function(_w){
      if(_w&&typeof _w==='object'&&_w.d){
        if(!Array.isArray(_w.d))_w.d=_days7.map(function(){return ''});
        else if(_w.d.length<7){
          var _more=_days7.slice(_w.d.length).map(function(){return ''});
          _w.d=_w.d.concat(_more);
        }
        if(_w.d.length>7)_w.d.length=7;
      }
    });
  });
}
function cloneDeep(arr){return arr.map(w=>({w:w.w,s:w.s||'',d:[...w.d]}))}
function save(){localStorage.setItem(SK,JSON.stringify(data));saveOpenState();try{computeStats()}catch(e){}}

// ======================== RENDER ========================
function renderWeeks(cardId, preserveState) {
  const container = document.querySelector(`.wp[data-c="${cardId}"]`);
  if (!container) return;
  if (!data[cardId]) data[cardId] = [];
  const weeks = data[cardId];
  if (!openState[cardId]) openState[cardId] = {};

  // === FIX: ensure every week has exactly 7 days (鍛ㄤ竴~鍛ㄦ棩) ===
  weeks.forEach(week => {
    if (!week.d) week.d = DAYS.map(() => '');
    else if (week.d.length < 7) {
      // Pad missing days with empty strings
      const pad = DAYS.slice(week.d.length).map(() => '');
      week.d = [...week.d, ...pad];
    }
    // Also cap at 7 if somehow longer
    if (week.d.length > 7) week.d.length = 7;
  });

  // Save current open states before re-render
  // skipState: true when caller has already set correct openState (e.g. add-week handler)
  if (preserveState !== 'skip') {
    container.querySelectorAll('.week').forEach(el => {
      const wi = el.dataset.wi;
      if (wi !== undefined) {
        const body = el.querySelector('.wk-body');
        openState[cardId][wi] = body ? body.classList.contains('o') : false;
      }
    });
  }
  // Save card-level open state
  const existingToggle = container.querySelector('.wt');
  const cardWasOpen = existingToggle ? existingToggle.classList.contains('o') : false;

  container.innerHTML = '';
  const toggle = document.createElement('button');
  toggle.className = 'wt'+(cardWasOpen?' o':'');
  toggle.dataset.c = cardId;
  toggle.innerHTML = `<span class="wtl">馃搵 鍛ㄨ鍒?/span><span class="ws-badge z" id="ws-${cardId}">0/0</span><span class="wta">鈻?/span>`;
  container.appendChild(toggle);

  const body = document.createElement('div');
  body.className = 'wb'+(cardWasOpen?' o':'');
  body.id = 'plan-body-'+cardId;
  container.appendChild(body);

  if (weeks.length === 0) {
    body.innerHTML = '<div style="padding:.35rem 0;text-align:center;color:var(--txt3);font-size:.7rem">鏆傛棤鍛ㄨ鍒?/div><button class="aw" data-c="'+cardId+'">+ 娣诲姞鏂板懆</button>';
    updateMeta(cardId);
    return;
  }

  const now = new Date();
  const todayCN = WEEKDAY_MAP[now.getDay()];

  let html = '<div class="weeks-wrap">';
  weeks.forEach((week, wi) => {
    const dd = week.d || [];
    let done = 0, total = 0;
    dd.forEach(t => { total+=1; if(typeof t==='object'&&t.done) done+=1 });
    const wkOpen = openState[cardId][wi] || false;

    html += `<div class="week" data-wi="${wi}">
      <div class="wk-header">
        <button class="wk-toggle${wkOpen?' o':''}" data-c="${cardId}" data-wi="${wi}">
          <span class="wka">鈻?/span><span class="wk-label">${esc(week.w)}</span>
          <span class="wk-prog">${done}/${total}</span>
        </button>
        <button class="wk-del" data-c="${cardId}" data-wi="${wi}" title="鍒犻櫎鏈懆">鉁?/button>
      </div>
      <div class="wk-body${wkOpen?' o':''}"><div class="days">`;
    dd.forEach((t, di) => {
      const isObj = typeof t === 'object';
      const txt = isObj ? t.text : (t||'');
      const chk = isObj ? t.done : false;
      const dayLabel = DAYS[di] || 'Day'+(di+1);
      var isToday = dayLabel === todayCN;
      var journalKey=cardId+'-w'+wi,journalVal='';if(data._journal&&data._journal[journalKey]&&data._journal[journalKey][di])journalVal=data._journal[journalKey][di];
      html += `<div class="dr${chk?' done':''}${isToday?' today':''}" data-di="${di}">
        <span class="dl">${dayLabel}</span>
        <textarea class="di" rows="1" data-c="${cardId}" data-wi="${wi}" data-di="${di}" placeholder="浠婂ぉ鍋氫粈涔? draggable="true">${esc(txt)}</textarea>
        <div class="md-preview" id="mdp-${cardId}-${wi}-${di}"></div>
        <button class="md-btn" data-c="${cardId}" data-wi="${wi}" data-di="${di}">MD</button>
        <input class="dc" type="checkbox" ${chk?'checked':''} data-c="${cardId}" data-wi="${wi}" data-di="${di}" />
        <button class="journal-btn" data-c="${cardId}" data-wi="${wi}" data-di="${di}" title="闅忕瑪">&#128221;</button>
      </div>
      <div class="journal-box" id="jb-${cardId}-${wi}-${di}">
        <textarea id="jt-${cardId}-${wi}-${di}" placeholder="浠婃棩闅忕瑪鈥? data-wkkey="${cardId}-w${wi}" data-di="${di}">${esc(journalVal)}</textarea>
      </div>`;
    });
    html += `</div><div class="ws-box"><textarea placeholder="鏈懆鎬荤粨..." data-c="${cardId}" data-wi="${wi}">${esc(week.s||'')}</textarea></div></div></div>`;
  });
  html += '</div><div style="display:flex;gap:.3rem;margin-top:.2rem"><button class="aw" data-c="'+cardId+'">+ 娣诲姞鏂板懆</button><button class="aw tpl" data-c="'+cardId+'">馃搵 妯℃澘</button></div>';
  body.innerHTML = html;
  updateMeta(cardId);
  // auto-resize all textareas in this card
  body.querySelectorAll('.di').forEach(autoResize);
  // Bind MD preview buttons
  body.querySelectorAll('.md-btn').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation();var ta=btn.closest('.dr').querySelector('.di');if(ta)toggleMd(ta)})
  });
  // Bind journal toggle buttons
  body.querySelectorAll('.journal-btn').forEach(function(btn){
    btn.addEventListener('click',function(e){e.stopPropagation()
      var dr=btn.closest('.dr'),di=parseInt(btn.dataset.di),wkKey=btn.dataset.c+'-w'+btn.dataset.wi
      toggleJournal(dr,di,wkKey)
    })
  });
  // Bind journal textarea save
  body.querySelectorAll('.journal-box textarea').forEach(function(ta){
    ta.addEventListener('input',function(){saveJournal(ta.dataset.wkkey,ta.dataset.di,ta.value)})
  });
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.max(el.scrollHeight, 22) + 'px';
}

function countLines(){return 1}
function updateMeta(cardId) {
  const weeks = data[cardId] || [];
  let total=0,done=0;
  weeks.forEach(w=>(w.d||[]).forEach(t=>{total+=1;if(typeof t==='object'&&t.done)done+=1}));
  const pct=total===0?0:Math.round((done/total)*100);
  const bar=document.querySelector(`.bar[data-c="${cardId}"]`);
  if(bar) bar.style.width=pct+'%';
  const card=document.querySelector(`.tc[data-c="${cardId}"]`);
  if(card){const m=card.querySelector('.tm span:first-child');if(m)m.textContent=total>0?`杩涘害 ${done}/${total}`:'馃搵 灞曞紑鍒跺畾鍛ㄨ鍒?;}
  const badge=document.getElementById('ws-'+cardId);
  if(badge){badge.textContent=done+'/'+total;badge.className='ws-badge'+(total===0?' z':'');}
  updateAllStats();
}

function updateAllStats() {
  let total=0,done=0;
  // Per-year stats for page 0
  const yt={y1:{t:0,d:0},y2:{t:0,d:0},y3:{t:0,d:0},y4:{t:0,d:0},y5:{t:0,d:0}};
  for(const[cid,weeks]of Object.entries(data)){
    if(!Array.isArray(weeks)||cid.startsWith('_'))continue;
    // Track per-year for page 0
    var yP=cid.substring(0,2);
    if(!yt[yP]){
      var m=cid.match(/^(c\d+)/);
      if(m){yP=m[1];if(!yt[yP])yt[yP]={t:0,d:0}}
    }
    (weeks||[]).forEach(w=>(w.d||[]).forEach(t=>{const d=typeof t==='object'?t.done:false;total+=1;if(d)done+=1;if(yt[yP]){yt[yP].t+=1;if(d)yt[yP].d+=1}}))
  }
  var stEl=document.getElementById('statTotal');if(stEl)stEl.textContent=total;
  var sdEl=document.getElementById('statDone');if(sdEl)sdEl.textContent=done;
  // Year stats card (page 0 only)
  var ys=document.getElementById('yearStats');
  if(ys){
    var yN={y1:'鍗氫竴',y2:'鍗氫簩',y3:'鍗氫笁',y4:'鍗氬洓',y5:'鍗氫簲'};
    var cys=data._customYears||[];
    cys.forEach(function(yr){yN[yr.id]=yr.label});
    ys.innerHTML=Object.entries(yt).filter(function(a){return a[1].t>0||yN[a[0]]}).map(function(a){var v=a[1],p=v.t===0?0:Math.round((v.d/v.t)*100);return'<div class="ysb-item"><span class="ysb-dot" style="background:'+COLORS.a+'"></span>'+(yN[a[0]]||a[0])+'<span class="ysb-p">'+v.d+'/'+v.t+'</span><span style="font-size:clamp(.55rem,.8vw,.6rem);color:var(--txt3)">'+p+'%</span></div>'}).join('');
  }
}

function renderAll() {
  document.querySelectorAll('.wp[data-c]').forEach(el => {
    const cid = el.dataset.c;
    if (!data[cid]) data[cid] = [];
    renderWeeks(cid);
  });
  renderCustomYears();
}

// ======================== CUSTOM YEARS (鍔ㄦ€佹坊鍔? ========================
let customYearCounter = 0;

// Load existing custom year definitions or initialize empty
function getCustomYears() {
  if (!data._customYears) data._customYears = [];
  return data._customYears;
}

function renderCustomYears() {
  const container = document.getElementById('customYearsContainer');
  if (!container) return;
  const years = getCustomYears();
  container.innerHTML = '';
  
  // Refresh nav
  document.querySelectorAll('.yni-custom, .nav-dot-custom').forEach(el => el.remove());

  years.forEach((yr, idx) => {
    const id = yr.id;
    const label = yr.label || '鏂拌鍒?;
    const title = yr.title || '';
    const subtitle = yr.subtitle || '';
    
    // Generate HTML same structure as static years
    const html = `
      <section class="sec reveal" id="${id}">
        <div class="sh">
          <div class="ey">${esc(label)}</div>
          <h2>${esc(title)}</h2>
          <p class="sub">${esc(subtitle)}</p>
        </div>
        <div class="tg">
          <div class="tc a" data-c="${id}-academic"><div class="ti">馃摎</div><div class="tt"><span contenteditable="false">瀛︽湳</span><span class="ttg">0%</span></div><div class="tb" id="ov-${id}-academic"><ul><li>寰呰鍒?/li></ul></div><div class="wp" data-c="${id}-academic"></div><div class="tp"><div class="bar" data-c="${id}-academic"></div></div><div class="tm"><span>馃搵 灞曞紑鍒跺畾鍛ㄨ鍒?/span></div></div>
          <div class="tc b" data-c="${id}-exam"><div class="ti">馃搵</div><div class="tt"><span contenteditable="false">澶囪€?/span><span class="ttg">0%</span></div><div class="tb" id="ov-${id}-exam"><ul><li>寰呰鍒?/li></ul></div><div class="wp" data-c="${id}-exam"></div><div class="tp"><div class="bar" data-c="${id}-exam"></div></div><div class="tm"><span>馃搵 灞曞紑鍒跺畾鍛ㄨ鍒?/span></div></div>
          <div class="tc c" data-c="${id}-finance"><div class="ti">馃挵</div><div class="tt"><span contenteditable="false">璐㈠姟</span><span class="ttg">0%</span></div><div class="tb" id="ov-${id}-finance"><ul><li>寰呰鍒?/li></ul></div><div class="wp" data-c="${id}-finance"></div><div class="tp"><div class="bar" data-c="${id}-finance"></div></div><div class="tm"><span>馃搵 灞曞紑鍒跺畾鍛ㄨ鍒?/span></div></div>
          <div class="tc d" data-c="${id}-life"><div class="ti">鉂わ笍</div><div class="tt"><span contenteditable="false">鐢熸椿</span><span class="ttg">0%</span></div><div class="tb" id="ov-${id}-life"><ul><li>寰呰鍒?/li></ul></div><div class="wp" data-c="${id}-life"></div><div class="tp"><div class="bar" data-c="${id}-life"></div></div><div class="tm"><span>馃搵 灞曞紑鍒跺畾鍛ㄨ鍒?/span></div></div>
        </div>
        <div style="text-align:right;margin-top:.5rem">
          <button class="del-year-btn bb d" data-id="${id}">馃棏 鍒犻櫎姝よ鍒?/button>
        </div>
      </section>
      <div class="sec-divider"><hr></div>`;
    
    container.insertAdjacentHTML('beforeend', html);

    // Observe new section for scroll animations & nav
    const newSec = document.getElementById(id);
    if (newSec) {
      if (typeof obs !== 'undefined' && obs instanceof IntersectionObserver) {
        obs.observe(newSec);
      }
      // Also observe for nav-dot active state
      if (typeof navObs !== 'undefined' && navObs instanceof IntersectionObserver) {
        navObs.observe(newSec);
      }
      // Observe for reveal animation
      if (typeof rObs !== 'undefined' && rObs instanceof IntersectionObserver) {
        rObs.observe(newSec);
      }
    }

    // Add nav buttons
    const yn = document.querySelector('.yn');
    if (yn) {
      const btn = document.createElement('button');
      btn.className = 'yni yni-custom';
      btn.dataset.y = id;
      btn.innerHTML = `<span class="yd"></span><span class="yl">${esc(label)}</span>`;
      yn.appendChild(btn);
    }
    const navRail = document.getElementById('navRail');
    if (navRail && navRail.querySelector('.nav-dot[data-target="sum"]')) {
      const dot = document.createElement('button');
      dot.className = 'nav-dot nav-dot-custom';
      dot.dataset.target = id;
      dot.dataset.label = label;
      dot.ariaLabel = label;
      navRail.insertBefore(dot, navRail.querySelector('.nav-dot[data-target="sum"]'));
    }

    // Ensure week data arrays exist
    ['academic','exam','finance','life'].forEach(t => {
      const cid = id + '-' + t;
      if (!data[cid]) data[cid] = [];
    });
  });

  // Re-render weeks for custom cards
  years.forEach(yr => {
    ['academic','exam','finance','life'].forEach(t => {
      const cid = yr.id + '-' + t;
      const el = document.querySelector(`.wp[data-c="${cid}"]`);
      if (el) renderWeeks(cid);
    });
  });

  // Re-apply edit mode if active
  if (document.querySelector('.tb[contentEditable="true"]')) {
    document.querySelectorAll(
      '.tb, .tc .ti, .tc .tt > span:first-child, .tc .tm, .sh .ey, .sh h2, .sh .sub, .sc h3, .sc ul li, .ft p'
    ).forEach(el => { el.contentEditable = true; });
  }

  // Delete year handler
  container.querySelectorAll('.del-year-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = this.dataset.id;
      if (!confirm('纭畾鍒犻櫎銆? + id + '銆嶅強鍏舵墍鏈夊懆璁″垝鏁版嵁锛?)) return;
      // Remove from data
      const years = getCustomYears();
      data._customYears = years.filter(y => y.id !== id);
      ['academic','exam','finance','life'].forEach(t => { delete data[id + '-' + t]; });
      save();
      renderAll(); // calls renderCustomYears() internally
      showToast('馃棏 宸插垹闄?);
    });
  });
}

// Add new year
function addCustomYear() {
  const label = prompt('璇疯緭鍏ユ柊璁″垝鍚嶇О锛堝锛氬崥鍏€佹嫇灞曡鍒掔瓑锛?, '鏂拌鍒?);
  if (!label || !label.trim()) return;
  const title = prompt('璇疯緭鍏ュ壇鏍囬锛堝锛氬欢姣曞勾銆佸閫夋柟妗堢瓑锛?, '鏂拌鍒掑勾');
  const subtitle = prompt('璇疯緭鍏ュ垎绫绘瘮渚嬶紙濡傦細瀛︽湳30% 路 鑰冨叕45%锛?, '');
  customYearCounter++;
  const id = 'c' + Date.now();
  const years = getCustomYears();
  years.push({ id, label: label.trim(), title: (title||label.trim()), subtitle: (subtitle||'') });
  data._customYears = years;
  save();
  renderAll(); // calls renderCustomYears() internally
  // Scroll to new section
  setTimeout(() => {
    const sec = document.getElementById(id);
    if (sec) sec.scrollIntoView({behavior:'smooth', block:'start'});
  }, 100);
  showToast('锛?宸叉坊鍔犮€? + label.trim() + '銆?);
}

// Wire add year button (script runs after DOM in body, so button exists)
document.getElementById('addYearBtn')?.addEventListener('click', addCustomYear);

// ======================== PAGE MANAGEMENT (澶氶〉闈? ========================
let activePageId = 'p0';

function initPages() {
  if (!data._pages || !Array.isArray(data._pages) || data._pages.length === 0) {
    data._pages = [{
      id: 'p0',
      label: '鍗氬＋璁″垝',
      icon: '馃帗',
      type: 'year',
      categories: [
        { id: 'academic', icon: '馃摎', label: '瀛︽湳' },
        { id: 'exam', icon: '馃搵', label: '鑰冨叕' },
        { id: 'finance', icon: '馃挵', label: '璐㈠姟' },
        { id: 'life', icon: '鉂わ笍', label: '鐢熸椿' }
      ]
    }];
    save();
  }
  renderFooter();
  renderPageToolbar();
  // Ensure page 0 is active and visible
  const p0 = document.getElementById('page0Content');
  const dp = document.getElementById('pageContent');
  if (p0) p0.classList.add('a');
  if (dp) dp.classList.remove('a');
  activePageId = 'p0';
}

function renderFooter() {
  if (!data._footer || !Array.isArray(data._footer)) {
    data._footer = ['鏁版嵁鑷姩淇濆瓨鍦ㄦ祻瑙堝櫒 路 姣忓ぉ鑷姩楂樹寒褰撳ぉ 路 姣忔棩鏀寔澶氳杈撳叆', '鍖椾含鑸┖鑸ぉ澶у 路 鐢熺墿鍖诲鍏夊瓙瀛?路 2026鈥?030'];
  }
  var f1 = document.getElementById('footerLine1');
  var f2 = document.getElementById('footerLine2');
  if (f1) f1.textContent = data._footer[0] || '';
  if (f2) f2.textContent = data._footer[1] || '';
}

function renderPageToolbar() {
  const bar = document.getElementById('pageBar');
  if (!bar) return;
  const pages = data._pages || [];
  // Rebuild: keep only the add button or recreate all
  bar.innerHTML = '';
  // Always add the first page (page0) button
  var p0btn = document.createElement('button');
  p0btn.className = 'pbi' + (activePageId === 'p0' ? ' a' : '');
  p0btn.dataset.page = 'p0';
  p0btn.textContent = '馃帗 鍗氬＋璁″垝';
  bar.appendChild(p0btn);
  // Add dynamic page buttons (with delete button)
  pages.forEach(function(p) {
    var wrap = document.createElement('span');
    wrap.className = 'pbi-wrap';
    var b = document.createElement('button');
    b.className = 'pbi' + (p.id === activePageId ? ' a' : '');
    b.dataset.page = p.id;
    b.textContent = (p.icon||'馃搫') + ' ' + p.label;
    wrap.appendChild(b);
    var del = document.createElement('button');
    del.className = 'pbi-del';
    del.dataset.page = p.id;
    del.textContent = '脳';
    del.title = '鍒犻櫎姝ら〉';
    wrap.appendChild(del);
    bar.appendChild(wrap);
  });
  var add = document.createElement('button');
  add.id = 'addPageBtn';
  add.className = 'pbi add';
  add.title = '娣诲姞鏂伴〉';
  add.textContent = '锛?;
  bar.appendChild(add);
}

function switchPage(pageId) {
  if (pageId === activePageId) return;
  activePageId = pageId;
  
  var p0 = document.getElementById('page0Content');
  var dp = document.getElementById('pageContent');
  var nr = document.getElementById('navRail');
  var yn = document.getElementById('ynw');
  
  if (pageId === 'p0') {
    if (p0) p0.classList.add('a');
    if (dp) { dp.classList.remove('a'); dp.innerHTML = ''; }
    if (nr) nr.style.display = '';
    if (yn) yn.style.display = '';
    renderAll();
  } else {
    if (p0) p0.classList.remove('a');
    if (dp) dp.classList.add('a');
    if (nr) nr.style.display = 'none';
    if (yn) yn.style.display = 'none';
    renderDynamicPage(pageId);
  }
  renderPageToolbar();
}
window.switchPage = switchPage; // expose globally for TOC navigation

function renderDynamicPage(pageId) {
  var container = document.getElementById('pageContent');
  var pages = data._pages || [];
  var page = null;
  for (var i = 0; i < pages.length; i++) { if (pages[i].id === pageId) { page = pages[i]; break; } }
  if (!page || !container) return;
  
  // Find section IDs for this page from data keys
  var catIds = [];
  for (var ci = 0; ci < page.categories.length; ci++) catIds.push(page.categories[ci].id);
  var sectionSet = {};
  for (var key in data) {
    if (key.indexOf(pageId + '-') === 0) {
      var rest = key.slice(pageId.length + 1);
      // Check if rest ends with one of the category IDs
      for (var ci2 = 0; ci2 < catIds.length; ci2++) {
        var cat = catIds[ci2];
        if (rest.indexOf('-') > 0 && rest.slice(-cat.length) === cat && (rest.length === cat.length || rest[rest.length-cat.length-1] === '-')) {
          var secId = rest.slice(0, rest.length - cat.length - 1);
          sectionSet[secId] = true;
          break;
        }
      }
    }
  }
  var sections = Object.keys(sectionSet).sort();
  
  // Build hero section (same style as page0)
  var pageIcon = page.icon || '馃搫';
  var defaultTitle = esc(pageIcon + ' ' + (page.label || '鏂拌鍒?));
  var hmarkVal = data[pageId + '-hmark'] || defaultTitle;
  var hsubVal = data[pageId + '-hsub'] || '';
  var hstatN1 = data[pageId + '-hstat-n1'] || '0';
  var hstatL1 = data[pageId + '-hstat-l1'] || '浠诲姟';
  var hstatN2 = data[pageId + '-hstat-n2'] || '0';
  var hstatL2 = data[pageId + '-hstat-l2'] || '宸插畬鎴?;
  
  var html = '<header class="hero" data-dyn-page="'+pageId+'">';
  html += '<div class="hmark reveal in" data-dyn-page="'+pageId+'" contenteditable="true">'+hmarkVal+'</div>';
  html += '<div class="hline"></div>';
  html += '<p class="hsub" data-dyn-page="'+pageId+'" contenteditable="true">'+esc(hsubVal)+'</p>';
  html += '<div class="hstats">';
  html += '<div class="hstat"><div class="n" data-dyn-page="'+pageId+'" contenteditable="true">'+esc(hstatN1)+'</div><div class="l" data-dyn-page="'+pageId+'" contenteditable="true">'+esc(hstatL1)+'</div></div>';
  html += '<div class="hstat"><div class="n" data-dyn-page="'+pageId+'" contenteditable="true">'+esc(hstatN2)+'</div><div class="l" data-dyn-page="'+pageId+'" contenteditable="true">'+esc(hstatL2)+'</div></div>';
  html += '</div>';
  html += '</header>';
  
  if (sections.length === 0) {
    html += '<div class="sec reveal in" style="text-align:center;padding:3rem 1rem"><p style="color:var(--txt3);font-size:.9rem;margin-bottom:1.5rem">鏆傛棤璁″垝</p><button class="bb" onclick="addPageSection(\''+pageId+'\')">锛?娣诲姞'+(page.type==='month'?'鏈堜唤':'骞翠唤')+'</button></div>';
  } else {
    // Build section labels
    var secLabels = {};
    for (var si = 0; si < sections.length; si++) {
      var s = sections[si];
      if (page.type === 'month') {
        var num = parseInt(s.replace('m','')) || 1;
        var mn = ['涓€鏈?,'浜屾湀','涓夋湀','鍥涙湀','浜旀湀','鍏湀','涓冩湀','鍏湀','涔濇湀','鍗佹湀','鍗佷竴鏈?,'鍗佷簩鏈?];
        secLabels[s] = mn[num-1] || (num+'鏈?);
      } else {
        var num2 = parseInt(s.replace('y','')) || 1;
        secLabels[s] = '绗?+num2+'骞?;
      }
    }
    
    for (var si2 = 0; si2 < sections.length; si2++) {
      var secId = sections[si2];
      var label = secLabels[secId] || secId;
      
      html += '<section class="sec reveal" id="'+pageId+'-'+secId+'"><div class="sh"><div class="ey">'+esc(label)+'</div><h2>'+esc(label)+'</h2><p class="sub"></p></div><div class="tg">';
      
      for (var ci3 = 0; ci3 < page.categories.length; ci3++) {
        var cat = page.categories[ci3];
        var cardId = pageId + '-' + secId + '-' + cat.id;
        var letters = ['a','b','c','d','e','f','g','h'];
        var letter = letters[ci3 % letters.length];
        html += '<div class="tc '+letter+'" data-c="'+cardId+'"><div class="ti">'+cat.icon+'</div><div class="tt"><span>'+esc(cat.label)+'</span><span class="ttg">0%</span></div><div class="tb" id="ov-'+cardId+'"><ul><li>寰呰鍒?/li></ul></div><div class="wp" data-c="'+cardId+'"></div><div class="tp"><div class="bar" data-c="'+cardId+'"></div></div><div class="tm"><span>馃搵 灞曞紑鍒跺畾鍛ㄨ鍒?/span></div></div>';
      }
      
      html += '</div></section><div class="sec-divider"><hr></div>';
    }
    
    // Add section button
    html += '<div class="sec reveal" style="text-align:center;padding:1rem"><button class="bb" onclick="addPageSection(\''+pageId+'\')">锛?娣诲姞'+(page.type==='month'?'鏈堜唤':'骞翠唤')+'</button></div>';
  }
  
  container.innerHTML = html;
  
  // Initialize weeks for all cards
  for (var ci4 = 0; ci4 < page.categories.length; ci4++) {
    var cat2 = page.categories[ci4];
    for (var si3 = 0; si3 < sections.length; si3++) {
      var cardId2 = pageId + '-' + sections[si3] + '-' + cat2.id;
      if (!data[cardId2]) data[cardId2] = [];
      renderWeeks(cardId2);
    }
  }
  
  // Observe sections
  container.querySelectorAll('.sec').forEach(function(s) {
    if (typeof obs !== 'undefined') try { obs.observe(s); } catch(e) {}
    if (typeof navObs !== 'undefined') try { navObs.observe(s); } catch(e) {}
    if (typeof rObs !== 'undefined') try { rObs.observe(s); } catch(e) {}
  });
  
  // Re-apply edit mode
  if (document.querySelector('.tb[contentEditable="true"]')) {
    container.querySelectorAll('.tb, .tc .ti, .tc .tt > span:first-child, .tc .tm').forEach(function(el) { el.contentEditable = true; });
  }
  
  updateAllStats();
}

function addPage() {
  var label = prompt('璇疯緭鍏ユ柊椤甸潰鍚嶇О锛堝锛氫拱鎴胯鍒掋€佸仴韬鍒掔瓑锛?, '鏂拌鍒?);
  if (!label || !label.trim()) return;
  var icon = prompt('璇疯緭鍏ラ〉闈㈠浘鏍囷紙emoji锛屽锛氿煆?馃挭 馃摎锛?, '馃搫');
  var typeAns = prompt('璁″垝绫诲瀷锛氳緭鍏?y 鎸夊勾璁″垝锛岃緭鍏?m 鎸夋湀璁″垝', 'y');
  var pageType = typeAns && typeAns.toLowerCase() === 'm' ? 'month' : 'year';
  
  var catsInput = prompt('璇疯緭鍏ュ垎绫伙紙鐢ㄩ€楀彿鍒嗛殧锛屽锛氿煉版埧浠?馃彟璐锋,馃搱鏀跺叆,馃搲鏀嚭锛?, '馃摎浠诲姟1,馃搵浠诲姟2,馃挵浠诲姟3,鉂わ笍浠诲姟4');
  var categories = [];
  if (catsInput) {
    var parts = catsInput.split(',');
    for (var i = 0; i < parts.length; i++) {
      var c = parts[i].trim();
      if (!c) continue;
      // Try to extract leading emoji
      var emoji = '馃搫';
      var name = c;
      // Simple emoji extraction: first char if it's high unicode
      var code = c.charCodeAt(0);
      if (code > 0x2600 || (code >= 0x2000 && code <= 0x27BF)) {
        emoji = c.charAt(0);
        name = c.slice(1).trim();
      }
      if (!name) name = '鍒嗙被' + (i+1);
      categories.push({ id: 'cat' + i, icon: emoji, label: name });
    }
  }
  if (categories.length === 0) {
    categories.push({ id: 'cat0', icon: '馃搫', label: '榛樿' });
  }
  
  var pageId = 'p' + Date.now();
  var pages = data._pages || [];
  pages.push({ id: pageId, label: label.trim(), icon: icon.trim() || '馃搫', type: pageType, categories: categories });
  data._pages = pages;
  save();
  renderPageToolbar();
  
  // Create initial section
  var firstSecId = pageType === 'month' ? 'm1' : 'y1';
  for (var ci = 0; ci < categories.length; ci++) {
    data[pageId + '-' + firstSecId + '-' + categories[ci].id] = [];
  }
  save();
  
  switchPage(pageId);
  showToast('锛?宸插垱寤恒€? + label.trim() + '銆?);
}

function deletePage(pageId) {
  if (pageId === 'p0') return; // Never delete the default page
  var pages = data._pages || [];
  var idx = -1;
  for (var i = 0; i < pages.length; i++) { if (pages[i].id === pageId) { idx = i; break; } }
  if (idx === -1) return;
  var label = pages[idx].label || '姝ら〉';
  if (!confirm('纭鍒犻櫎銆? + label + '銆嶏紵\n璇ラ〉闈㈡墍鏈夋暟鎹皢琚案涔呯Щ闄ゃ€?)) return;
  
  // Remove from pages array
  pages.splice(idx, 1);
  data._pages = pages;
  
  // Remove all related data keys (page-level + section-level)
  for (var key in data) {
    if (key === pageId || key.indexOf(pageId + '-') === 0) {
      delete data[key];
    }
  }
  save();
  
  // If this was the active page, switch to page0
  if (activePageId === pageId) {
    switchPage('p0');
  } else {
    renderPageToolbar();
  }
  showToast('宸插垹闄ゃ€? + label + '銆?);
}

function addPageSection(pageId) {
  var pages = data._pages || [];
  var page = null;
  for (var i = 0; i < pages.length; i++) { if (pages[i].id === pageId) { page = pages[i]; break; } }
  if (!page) return;
  
  var type = page.type;
  var ans = prompt('杈撳叆鏂? + (type === 'month' ? '鏈堜唤鏁板瓧锛屽 2 琛ㄧず浜屾湀' : '骞翠唤鏁板瓧锛屽 2 琛ㄧず绗簩骞?), '');
  if (ans === null || ans === '') return;
  var num = parseInt(ans);
  if (isNaN(num) || num < 1) { showToast('鈿狅笍 璇疯緭鍏ユ湁鏁堟暟瀛?); return; }
  
  var secId = type === 'month' ? 'm' + num : 'y' + num;
  var secLabel = type === 'month' ? (['涓€鏈?,'浜屾湀','涓夋湀','鍥涙湀','浜旀湀','鍏湀','涓冩湀','鍏湀','涔濇湀','鍗佹湀','鍗佷竴鏈?,'鍗佷簩鏈?][num-1] || num+'鏈?) : '绗?+num+'骞?;
  
  // Check if section already exists
  for (var key in data) {
    if (key.indexOf(pageId + '-' + secId + '-') === 0) {
      showToast('鈿狅笍 銆? + secLabel + '銆嶅凡瀛樺湪');
      return;
    }
  }
  
  for (var ci = 0; ci < page.categories.length; ci++) {
    var cardId = pageId + '-' + secId + '-' + page.categories[ci].id;
    data[cardId] = [];
  }
  save();
  renderDynamicPage(pageId);
  showToast('锛?宸叉坊鍔犮€? + secLabel + '銆?);
}

// Expose for inline onclick in dynamically generated HTML
window.addPageSection = addPageSection;

// Wire page toolbar clicks
document.addEventListener('click', function(e) {
  var del = e.target.closest('.pbi-del');
  if (del) { deletePage(del.dataset.page); return; }
  var pbi = e.target.closest('.pbi[data-page]');
  if (pbi) { var pid = pbi.dataset.page; if (pid !== activePageId) switchPage(pid); return; }
  if (e.target.closest('#addPageBtn')) { addPage(); return; }
});

// ======================== TOAST ========================
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg || '鉁?宸蹭繚瀛?; el.classList.add('s');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('s'), 1800);
}

// ======================== EVENTS ========================
document.addEventListener('click', e => {
  const t = e.target;

  // Year nav
  const navBtn = t.closest('.yni');
  if (navBtn) {
    const id = navBtn.dataset.y;
    const sec = document.getElementById(id);
    if (sec) { sec.classList.add('v'); sec.scrollIntoView({behavior:'smooth',block:'start'}); }
    document.querySelectorAll('.yni').forEach(n => n.classList.remove('a'));
    navBtn.classList.add('a');
    return;
  }

  // Card toggle 鈥?preserve open state across all weeks inside
  var wtToggle = t.closest('.wt');
  // Also allow clicking on .tc card body (except inner interactive areas) to toggle
  if (!wtToggle && t.closest('.tc') && !t.closest('.tb') && !t.closest('.wp') && !t.closest('.tp')) {
    wtToggle = t.closest('.tc').querySelector('.wt');
  }
  if (wtToggle) {
    const toggle = wtToggle;
    const cid = toggle.dataset.c;
    const body = document.getElementById('plan-body-'+cid);
    if (body) {
      const opening = !body.classList.contains('o');
      body.classList.toggle('o');
      toggle.classList.toggle('o');
      // When collapsing card, save open states of weeks; when expanding, restore
      const weeks = body.querySelectorAll('.week');
      weeks.forEach((w, i) => {
        const wb = w.querySelector('.wk-body');
        const wt = w.querySelector('.wk-toggle');
        if (!wb || !wt) return;
        if (opening) {
          // Restore saved state
          if (openState[cid] && openState[cid][i]) {
            wb.classList.add('o');
            wt.classList.add('o');
          }
        } else {
          // Save state before hiding
          if (!openState[cid]) openState[cid] = {};
          openState[cid][i] = wb.classList.contains('o');
          wb.classList.remove('o');
          wt.classList.remove('o');
        }
      });
    }
    return;
  }

  // Week toggle
  if (t.closest('.wk-toggle')) {
    const toggle = t.closest('.wk-toggle');
    const body = toggle.closest('.week').querySelector('.wk-body');
    if (body) {
      body.classList.toggle('o');
      toggle.classList.toggle('o');
      // Save state
      const cid = toggle.dataset.c;
      const wi = parseInt(toggle.dataset.wi);
      if (!openState[cid]) openState[cid] = {};
      openState[cid][wi] = body.classList.contains('o');
      saveOpenState();
    }
    return;
  }

  // Delete week
  if (t.classList.contains('wk-del')) {
    const cid = t.dataset.c, wi = parseInt(t.dataset.wi);
    if (data[cid] && data[cid][wi] && confirm('鍒犻櫎銆?+data[cid][wi].w+'銆嶏紵')) {
      data[cid].splice(wi, 1);
      // Shift openState indices down for weeks after the deleted one
      if (openState[cid]) {
        const newState = {};
        Object.keys(openState[cid]).forEach(k => {
          const idx = parseInt(k);
          if (idx < wi) newState[idx] = openState[cid][k];
          else if (idx > wi) newState[idx - 1] = openState[cid][k];
        });
        openState[cid] = newState;
      }
      save(); renderWeeks(cid); showToast('馃棏 宸插垹闄?);
    }
    return;
  }

  // Add week 鈥?fill gaps, insert at correct sorted position
  if (t.classList.contains('aw') && !t.classList.contains('tpl')) {
    const cid = t.dataset.c;
    if (!data[cid]) data[cid] = [];
    // Scan existing week numbers to find the first gap
    const nums = [];
    let maxN = 0;
    data[cid].forEach((w, idx) => {
      const m = w.w.match(/绗?\d+)鍛?);
      if (m) { const v = parseInt(m[1]); nums.push({idx, v}); maxN = Math.max(maxN, v); }
    });
    // Find first missing number (gap) starting from 1
    let n = maxN + 1;
    for (let i = 1; i <= maxN; i++) {
      if (!nums.some(x => x.v === i)) { n = i; break; }
    }
    const newWeek = {w:'绗?+n+'鍛?, s:'', d:DAYS.map(()=>'')};
    // Insert at correct sorted position
    const insertAt = data[cid].findIndex((w, idx) => {
      const m = w.w.match(/绗?\d+)鍛?);
      return m && parseInt(m[1]) > n;
    });
    if (insertAt >= 0) {
      data[cid].splice(insertAt, 0, newWeek);
      if (openState[cid]) {
        const newState = {};
        Object.keys(openState[cid]).forEach(k => {
          const idx = parseInt(k);
          if (idx < insertAt) newState[idx] = openState[cid][k];
          else newState[idx + 1] = openState[cid][k];
        });
        openState[cid] = newState;
      }
    } else {
      data[cid].push(newWeek);
    }
    if (!openState[cid]) openState[cid] = {};
    var newWi = insertAt >= 0 ? insertAt : data[cid].length - 1;
    openState[cid][newWi] = true;
    save(); renderWeeks(cid, 'skip');
    // renderWeeks with 'skip' avoids the DOM-save phase, so openState[cid] stays correct.
    // New week is rendered open. Now ensure card body is visible.
    var _ab = document.getElementById('plan-body-'+cid);
    if (_ab && !_ab.classList.contains('o')) {
      _ab.classList.add('o');
      var _at = _ab.parentElement ? _ab.parentElement.querySelector('.wt') : null;
      if (_at) _at.classList.add('o');
    }
    saveOpenState();
    showToast('鉁?宸叉坊鍔?);
    return;
  }

  // Expand all / collapse all
  if (t.id==='expandAll'||t.closest('#expandAll')||t.id==='expandAll2'||t.closest('#expandAll2')) {
    document.querySelectorAll('.wk-body,.wb').forEach(el => el.classList.add('o'));
    document.querySelectorAll('.wk-toggle,.wt').forEach(el => el.classList.add('o'));
    // Save all as open
    document.querySelectorAll('.week').forEach(w => {
      const cid = w.closest('.wp')?.dataset?.c;
      const wi = w.dataset.wi;
      if (cid && wi !== undefined) {
        if (!openState[cid]) openState[cid] = {};
        openState[cid][wi] = true;
      }
    });
    saveOpenState();
    return;
  }
  if (t.id==='collapseAll'||t.closest('#collapseAll')||t.id==='collapseAll2'||t.closest('#collapseAll2')) {
    document.querySelectorAll('.wk-body,.wb').forEach(el => el.classList.remove('o'));
    document.querySelectorAll('.wk-toggle,.wt').forEach(el => el.classList.remove('o'));
    document.querySelectorAll('.week').forEach(w => {
      const cid = w.closest('.wp')?.dataset?.c;
      const wi = w.dataset.wi;
      if (cid && wi !== undefined) {
        if (!openState[cid]) openState[cid] = {};
        openState[cid][wi] = false;
      }
    });
    saveOpenState();
    return;
  }

  // Export
  if (t.id==='exportBtn'||t.closest('#exportBtn')||t.id==='exportBtn2'||t.closest('#exportBtn2')) {
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='phd-plan-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href);
    showToast('馃摜 宸插鍑?);
    return;
  }
  // Import
  if (t.id==='importBtn'||t.closest('#importBtn')||t.id==='importBtn2'||t.closest('#importBtn2')) {
    document.getElementById('fileInput').click();
    return;
  }

  // Edit toggle (both buttons)
  if (t.id==='editToggle'||t.closest('#editToggle')||t.id==='editToggle2'||t.closest('#editToggle2')) {
    const isEdit = !document.querySelector('.tb[contentEditable="true"]');
    // Toggle contentEditable on ALL text elements
    document.querySelectorAll(
      '.tb, .tc .ti, .tc .tt > span:first-child, .tc .tm, .wk-label, ' +
      '.sh .ey, .sh h2, .sh .sub, ' +
      '.sc h3, .sc ul li, ' +
      '.hmark, .hsub, ' +
      '.hstat .n, .hstat .l, ' +
      '.ft p'
    ).forEach(el => {
      el.contentEditable = isEdit;
    });
    // In edit mode: text cursor on daily textareas; disable drag; non-edit: default arrow
    document.querySelectorAll('.di').forEach(el => {
      el.draggable = !isEdit;
      el.style.cursor = isEdit ? 'text' : 'default';
    });
    document.getElementById('edBadge').classList.toggle('s', isEdit);
    document.querySelectorAll('#editToggle,#editToggle2').forEach(b => {
      b.textContent = isEdit ? '馃敀 缂栬緫' : '鉁?缂栬緫';
      if (isEdit) { b.classList.remove('x'); } else { b.classList.add('x'); }
    });
    return;
  }

  // Gist indicator click 鈫?open AI panel + sync section
  if (t.id === 'gistIndicator' || t.closest('#gistIndicator')) {
    // Open AI panel if not already open
    if (!aiPanel.classList.contains('s')) {
      aiFab.click();
    }
    // Expand sync section in AI panel
    const gistBody = document.getElementById('gistBody');
    if (gistBody) gistBody.classList.add('o');
    return;
  }

  // Reset
  if (t.id==='resetTasks'||t.closest('#resetTasks')||t.id==='resetTasks2'||t.closest('#resetTasks2')) {
    if (confirm('纭畾閲嶇疆鎵€鏈変换鍔℃暟鎹紵')) {
      localStorage.removeItem(SK); localStorage.removeItem(SK+'_open');
      data = load(); openState = {}; renderAll(); showToast('馃棏 宸查噸缃?);
    }
    return;
  }
});

// File import
document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const imported = JSON.parse(ev.target.result);
      if (typeof imported !== 'object') throw new Error('invalid');
      data = imported; ensure(data); save(); renderAll(); showToast('馃摛 宸插鍏?);
    } catch(err) { alert('瀵煎叆澶辫触锛氭牸寮忎笉姝ｇ‘'); }
  };
  reader.readAsText(file); this.value = '';
});

// ===== Textarea input with auto-resize and debounced save =====
let saveTimer;
function qSave() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { save(); updateAllStats(); }, 350); }

document.addEventListener('input', e => {
  const t = e.target;
  // Day textarea
  if (t.classList.contains('di')) {
    autoResize(t);
    const cid=t.dataset.c, wi=parseInt(t.dataset.wi), di=parseInt(t.dataset.di);
    if (data[cid]&&data[cid][wi]) {
      const d = data[cid][wi].d;
      if (!d[di]||typeof d[di]==='string') d[di]=t.value;
      else d[di].text=t.value;
      qSave();
    }
    return;
  }
  // Summary textarea
  if (t.tagName==='TEXTAREA' && t.closest('.ws-box')) {
    const cid=t.dataset.c, wi=parseInt(t.dataset.wi);
    if (data[cid]&&data[cid][wi]) { data[cid][wi].s=t.value; qSave(); }
    return;
  }
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.classList.contains('dc')) {
    const cid=t.dataset.c, wi=parseInt(t.dataset.wi), di=parseInt(t.dataset.di);
    const chk=t.checked;
    if (data[cid]&&data[cid][wi]) {
      const d=data[cid][wi].d;
      if (!d[di]) d[di]='';
      if (typeof d[di]==='string') d[di]={text:d[di],done:chk};
      else d[di].done=chk;
      const row=t.closest('.dr');
      if (row) row.classList.toggle('done',chk);
      save(); renderWeeks(cid); showToast();
    }
    return;
  }
});

// ======================== SCROLL OBSERVER ========================
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('v');
      const id = e.target.getAttribute('id');
      if (id && (id.startsWith('y')||id==='sum'||id.startsWith('c'))) {
        document.querySelectorAll('.yni').forEach(n => n.classList.toggle('a', n.dataset.y === id));
      }
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.sec').forEach(s => obs.observe(s));

// Bottom bar always visible 鈥?no scroll hide needed

// ======================== AI ASSISTANT (DeepSeek) ========================
const AI_KEY = SK + '_ai_key';
const AI_CHAT_KEY = SK + '_ai_chat';
const AI_CONV_KEY = SK + '_ai_convs';
const AI_CURRENT_CONV_KEY = SK + '_ai_current';
const AI_ENDPOINT_KEY = SK + '_ai_endpoint';
const AI_MODEL_KEY = SK + '_ai_model';
let aiKey = localStorage.getItem(AI_KEY) || '';
let aiEndpoint = localStorage.getItem(AI_ENDPOINT_KEY) || 'https://api.deepseek.com/chat/completions';
let aiModel = localStorage.getItem(AI_MODEL_KEY) || 'deepseek-chat';
let aiProcessing = false;

// Multiple conversations storage
let aiConversations = {};      // { id: { id, title, ts, msgs:[] } }
let aiCurrentId = '';
let aiCurrentConv = null;      // shortcut to current conversation object

// DOM refs
const aiFab = document.getElementById('aiFab');
const aiOverlay = document.getElementById('aiOverlay');
const aiPanel = document.getElementById('aiPanel');
const aiClose = document.getElementById('aiClose');
const aiKeyInput = document.getElementById('aiKeyInput');
const aiEndpointInput = document.getElementById('aiEndpointInput');
const aiModelInput = document.getElementById('aiModelInput');
const aiKeySave = document.getElementById('aiKeySave');
const aiKeyStatus = document.getElementById('aiKeyStatus');
const aiChat = document.getElementById('aiChat');
const aiInput = document.getElementById('aiInput');
const aiSend = document.getElementById('aiSend');
const aiMicBtn = document.getElementById('aiMicBtn');
const aiConvBtn = document.getElementById('aiConvBtn');
const aiConvPanel = document.getElementById('aiConvPanel');
const aiConvBack = document.getElementById('aiConvBack');
const aiConvNew = document.getElementById('aiConvNew');
const aiConvList = document.getElementById('aiConvList');
let aiTypingStart = 0;
let aiTypingTimerInterval = null;
let aiRecognition = null;
let aiListening = false;

// Load conversations
function loadConvs() {
  try {
    const raw = localStorage.getItem(AI_CONV_KEY);
    if (raw) { aiConversations = JSON.parse(raw); if (typeof aiConversations !== 'object') aiConversations = {}; }
  } catch(e) { aiConversations = {}; }
}
function saveConvs() {
  try { localStorage.setItem(AI_CONV_KEY, JSON.stringify(aiConversations)); } catch(e) {}
}
function loadCurrentId() {
  return localStorage.getItem(AI_CURRENT_CONV_KEY) || '';
}
function saveCurrentId(id) {
  localStorage.setItem(AI_CURRENT_CONV_KEY, id);
}

// Generate unique id
function convId() { return 'c' + Date.now() + Math.random().toString(36).slice(2,6); }

// Ensure current conversation exists
function ensureConv() {
  if (aiCurrentConv && aiConversations[aiCurrentId]) return;
  // Find existing conversations or create new
  const ids = Object.keys(aiConversations);
  if (ids.length > 0) {
    aiCurrentId = loadCurrentId();
    if (!aiConversations[aiCurrentId]) aiCurrentId = ids[ids.length - 1];
    aiCurrentConv = aiConversations[aiCurrentId];
    return;
  }
  // Create first conversation
  const id = convId();
  aiCurrentId = id;
  aiConversations[id] = { id, title: '鏂板璇?, ts: Date.now(), msgs: [] };
  aiCurrentConv = aiConversations[id];
  saveConvs(); saveCurrentId(id);
}

function switchConv(id) {
  if (!aiConversations[id]) return;
  aiCurrentId = id;
  aiCurrentConv = aiConversations[id];
  saveCurrentId(id);
  renderChatHistory();
  scrollChat();
}

function newConv() {
  const id = convId();
  aiConversations[id] = { id, title: '鏂板璇?, ts: Date.now(), msgs: [] };
  aiCurrentId = id;
  aiCurrentConv = aiConversations[id];
  saveConvs(); saveCurrentId(id);
  renderChatHistory();
  scrollChat();
  renderConvList();
  showToast('馃搧 鏂板璇濆凡鍒涘缓');
}

function deleteConv(id) {
  if (!aiConversations[id]) return;
  const ids = Object.keys(aiConversations);
  if (ids.length <= 1) { showToast('鈿狅笍 鑷冲皯淇濈暀涓€涓璇?); return; }
  delete aiConversations[id];
  if (aiCurrentId === id) {
    const remaining = Object.keys(aiConversations);
    switchConv(remaining[remaining.length-1]);
  }
  saveConvs();
  renderConvList();
  showToast('馃棏 瀵硅瘽宸插垹闄?);
}

function autoTitle(msg) {
  if (!msg) return '鏂板璇?;
  const clean = msg.replace(/[\[\]{}銆娿€嬨€屻€嶃€愩€慮/g, '').trim();
  return clean.length > 18 ? clean.slice(0, 18) + '鈥? : clean;
}

// ===== AI Status Management =====
function setAIStatus(state, detail) {
  const dot = document.getElementById('aiStatusDot');
  const text = document.getElementById('aiStatusText');
  const fab = document.getElementById('fabStatus');
  const states = {
    idle:    { cls: 'idle',    label: '寰呭懡' },
    thinking:{ cls: 'thinking',label: '鎬濊€冧腑' },
    confirming:{cls: 'confirming',label: '绛夊緟纭' },
    error:   { cls: 'error',   label: '鍑洪敊浜? },
    off:     { cls: 'off',     label: '鏈厤缃? }
  };
  const s = states[state] || states.off;
  if (dot) { dot.className = 'ai-status-dot ' + s.cls; }
  if (text) { text.textContent = detail || s.label; text.className = 'ai-status-text' + (state==='thinking'?' talk':''); }
  if (fab) { fab.className = 'fab-status ' + s.cls; }
}

// Restore saved config
const hasAiKey = !!aiKey;
setAIStatus(hasAiKey ? 'idle' : 'off');
if (aiKey) { aiKeyStatus.textContent = '鉁?宸茶缃?; aiKeyStatus.style.color = '#d4a574'; aiKeySave.textContent = '鏇存柊'; }
aiKeyInput.value = aiKey;
aiEndpointInput.value = aiEndpoint;
aiModelInput.value = aiModel;

// Initialize conversations
loadConvs();
ensureConv();

// Panel open/close
aiFab.addEventListener('click', function aiFabClick(e) {
  if (fabDragging) { fabDragging = false; e.stopImmediatePropagation(); return; }
  const open = aiPanel.classList.contains('s');
  aiPanel.classList.toggle('s'); aiOverlay.classList.toggle('s'); aiFab.classList.toggle('o');
  if (!open) { renderChatHistory(); scrollChat(); renderConvList(); }
  if (!open) setTimeout(() => aiInput.focus(), 400);
});
function closeAIPanel() { aiPanel.classList.remove('s'); aiOverlay.classList.remove('s'); aiFab.classList.remove('o'); if (aiListening) stopListening(); aiConvPanel.classList.remove('s'); }
aiClose.addEventListener('click', closeAIPanel);
aiOverlay.addEventListener('click', closeAIPanel);

// Conversation panel
aiConvBtn.addEventListener('click', () => { renderConvList(); aiConvPanel.classList.toggle('s'); });
aiConvBack.addEventListener('click', () => { aiConvPanel.classList.remove('s'); });
aiConvNew.addEventListener('click', newConv);

// Drag FAB
const AI_POS_KEY = SK + '_ai_pos';
let fabDragging = false, fabStartX, fabStartY, fabOrigLeft, fabOrigTop;
function restoreFabPos() {
  try {
    const saved = localStorage.getItem(AI_POS_KEY);
    if (saved) {
      const pos = JSON.parse(saved);
      if (pos.left !== undefined) {
        aiFab.style.left = pos.left;
        aiFab.style.right = 'auto';
        aiFab.style.top = pos.top;
        aiFab.style.bottom = 'auto';
      }
    }
  } catch(e) {}
}
restoreFabPos();

function fabDragStart(ex, ey) {
  const rect = aiFab.getBoundingClientRect();
  fabStartX = ex; fabStartY = ey;
  fabOrigLeft = rect.left; fabOrigTop = rect.top;
  fabDragging = false;
  aiFab.classList.add('dragging');
}

function fabDragMove(ex, ey) {
  if (!aiFab.classList.contains('dragging')) return;
  const dx = ex - fabStartX, dy = ey - fabStartY;
  if (!fabDragging && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) fabDragging = true;
  if (fabDragging) {
    aiFab.style.left = (fabOrigLeft + dx) + 'px';
    aiFab.style.right = 'auto';
    aiFab.style.top = (fabOrigTop + dy) + 'px';
    aiFab.style.bottom = 'auto';
  }
}

function fabDragEnd() {
  aiFab.classList.remove('dragging');
  if (fabDragging) {
    // Save position
    try { localStorage.setItem(AI_POS_KEY, JSON.stringify({ left: aiFab.style.left, top: aiFab.style.top })); } catch(e) {}
    // Prevent click from firing after drag
    setTimeout(() => { fabDragging = false; }, 50);
  }
}

aiFab.addEventListener('mousedown', e => { if (e.button === 0) { fabDragStart(e.clientX, e.clientY); } });
document.addEventListener('mousemove', e => { fabDragMove(e.clientX, e.clientY); });
document.addEventListener('mouseup', fabDragEnd);

aiFab.addEventListener('touchstart', e => { const t = e.touches[0]; fabDragStart(t.clientX, t.clientY); }, {passive:true});
document.addEventListener('touchmove', e => { const t = e.touches[0]; fabDragMove(t.clientX, t.clientY); }, {passive:true});
document.addEventListener('touchend', fabDragEnd, {passive:true});

// Key management
aiKeySave.addEventListener('click', () => {
  const val = aiKeyInput.value.trim();
  const ep = aiEndpointInput.value.trim() || 'https://api.deepseek.com/chat/completions';
  const md = aiModelInput.value.trim() || 'deepseek-chat';
  if (!val || !val.startsWith('sk-')) { aiKeyStatus.textContent = '鈿狅笍 闇€瑕佹湁鏁堢殑 sk- 寮€澶村瘑閽?; aiKeyStatus.style.color = '#e85d2f'; return; }
  aiKey = val; aiEndpoint = ep; aiModel = md;
  localStorage.setItem(AI_KEY, val);
  localStorage.setItem(AI_ENDPOINT_KEY, ep);
  localStorage.setItem(AI_MODEL_KEY, md);
  aiKeyStatus.textContent = '鉁?宸蹭繚瀛?; aiKeyStatus.style.color = '#d4a574';
  aiKeySave.textContent = '鏇存柊';
  setAIStatus('idle');
  addAIMessage('system', '馃攽 閰嶇疆宸蹭繚瀛?(' + aiModel + ' @ ' + aiEndpoint.replace(/^https?:\/\//,'').substring(0,30) + '鈥?銆備綘鍙互寮€濮嬩娇鐢?AI 鍔╂墜浜嗐€?);
  scrollChat();
});

// Chat input auto-resize + send enable
aiInput.addEventListener('input', () => {
  autoResize(aiInput);
  aiSend.disabled = !aiInput.value.trim() || aiProcessing;
});

// ======================== VOICE INPUT ========================
function initSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { aiMicBtn.title = '娴忚鍣ㄤ笉鏀寔璇煶'; aiMicBtn.disabled = true; return; }
  aiRecognition = new SR();
  aiRecognition.lang = 'zh-CN';
  aiRecognition.continuous = true;
  aiRecognition.interimResults = true;
  aiRecognition.maxAlternatives = 1;

  aiRecognition.onresult = function(e) {
    let interim = '', final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) final += r[0].transcript;
      else interim += r[0].transcript;
    }
    // Prepend existing text if user already typed
    const existing = aiInput.value.trim();
    aiInput.value = existing ? existing + ' ' + final : final;
    aiInput.value += interim ? (aiInput.value ? ' ' : '') + interim : '';
    autoResize(aiInput);
    aiSend.disabled = !aiInput.value.trim() || aiProcessing;
  };

  aiRecognition.onerror = function(e) {
    console.warn('Speech error:', e.error);
    stopListening();
    if (e.error !== 'aborted') aiMicBtn.title = '璇煶鍑洪敊锛岀偣鍑婚噸璇?;
  };

  aiRecognition.onend = function() {
    if (aiListening) {
      // Auto-restart if still listening
      try { aiRecognition.start(); } catch(e) {}
    }
  };
}

function startListening() {
  if (!aiRecognition) return;
  try {
    aiRecognition.start();
    aiListening = true;
    aiMicBtn.classList.add('r');
    aiMicBtn.title = '鐐瑰嚮鍋滄褰曢煶';
  } catch(e) { aiMicBtn.title = '鍚姩澶辫触'; }
}

function stopListening() {
  if (aiRecognition) {
    try { aiRecognition.stop(); } catch(e) {}
  }
  aiListening = false;
  aiMicBtn.classList.remove('r');
  aiMicBtn.title = '璇煶杈撳叆';
}

aiMicBtn.addEventListener('click', () => {
  if (!aiRecognition) { initSpeech(); if (aiRecognition) startListening(); return; }
  if (aiListening) { stopListening(); }
  else { startListening(); }
});

// Init speech recognition on load
setTimeout(initSpeech, 500);
aiInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!aiSend.disabled) sendAIMessage(); }
});

aiSend.addEventListener('click', sendAIMessage);

function addAIMessage(role, content, extra, reasoning) {
  const div = document.createElement('div');
  div.className = 'ai-msg ' + role;
  if (role === 'ai' || role === 'system') {
    const tag = document.createElement('span');
    tag.className = 'role-tag';
    tag.textContent = role === 'ai' ? 'AI 鍔╂墜' : '绯荤粺';
    div.appendChild(tag);
  }
  // Show reasoning content (collapsible) if present
  if (reasoning) {
    const reasonDetails = document.createElement('details');
    reasonDetails.className = 'ai-reasoning';
    const reasonSummary = document.createElement('summary');
    reasonSummary.className = 'reasoning-label';
    reasonSummary.textContent = '鎬濊€冭繃绋?;
    reasonDetails.appendChild(reasonSummary);
    const reasonBody = document.createElement('div');
    reasonBody.className = 'reasoning-body';
    reasonBody.textContent = reasoning;
    reasonDetails.appendChild(reasonBody);
    div.appendChild(reasonDetails);
  }
  const p = document.createElement('div');
  p.style.whiteSpace = 'pre-wrap';
  p.textContent = content;
  div.appendChild(p);
  if (extra && extra.proposal) {
    const propDiv = document.createElement('div');
    propDiv.className = 'ai-edit-proposal';
    const desc = document.createElement('p');
    desc.textContent = extra.proposal.description || '鎻愯淇敼浠ヤ笅鍐呭锛?;
    propDiv.appendChild(desc);
    const actsDiv = document.createElement('div');
    actsDiv.className = 'edit-actions';
    const cf = document.createElement('button'); cf.className = 'btn-confirm'; cf.textContent = '鉁?纭搴旂敤';
    cf.addEventListener('click', () => applyEditProposal(extra.proposal, cf));
    const rj = document.createElement('button'); rj.className = 'btn-reject'; rj.textContent = '鉂?鎷掔粷';
    rj.addEventListener('click', () => { propDiv.innerHTML = '<p style="color:#e85d2f">鉁?宸叉嫆缁?/p>'; setAIStatus('idle'); });
    actsDiv.appendChild(cf); actsDiv.appendChild(rj);
    propDiv.appendChild(actsDiv);
    div.appendChild(propDiv);
  }
  aiChat.appendChild(div);
}

function addTypingIndicator(reasoningCb) {
  const div = document.createElement('div');
  div.className = 'ai-msg ai';
  div.id = 'aiTyping';
  const tag = document.createElement('span');
  tag.className = 'role-tag'; tag.textContent = 'AI 鍔╂墜';
  div.appendChild(tag);
  const wrap = document.createElement('div');
  wrap.className = 'ai-typing';
  const dots = document.createElement('div');
  dots.className = 'typing-dots';
  for (let i = 0; i < 3; i++) { const s = document.createElement('span'); dots.appendChild(s); }
  wrap.appendChild(dots);
  const txt = document.createElement('span');
  txt.className = 'typing-text'; txt.textContent = '姝ｅ湪鎬濊€?;
  wrap.appendChild(txt);
  const timer = document.createElement('span');
  timer.className = 'typing-timer'; timer.id = 'aiTypingTimer'; timer.textContent = '0s';
  wrap.appendChild(timer);
  div.appendChild(wrap);
  // Reasoning area (collapsible, shows thinking content in real-time)
  const reasonDetails = document.createElement('details');
  reasonDetails.className = 'ai-reasoning';
  reasonDetails.id = 'aiReasoning';
  const reasonSummary = document.createElement('summary');
  reasonSummary.className = 'reasoning-label';
  reasonSummary.textContent = '鎬濊€冭繃绋?;
  reasonDetails.appendChild(reasonSummary);
  const reasonBody = document.createElement('div');
  reasonBody.className = 'reasoning-body streaming';
  reasonBody.id = 'aiReasoningBody';
  reasonDetails.appendChild(reasonBody);
  div.appendChild(reasonDetails);
  aiChat.appendChild(div);
  scrollChat();
  // Start timer
  aiTypingStart = Date.now();
  if (aiTypingTimerInterval) clearInterval(aiTypingTimerInterval);
  aiTypingTimerInterval = setInterval(() => {
    const el = document.getElementById('aiTypingTimer');
    if (el) el.textContent = Math.floor((Date.now() - aiTypingStart) / 1000) + 's';
  }, 200);
  // Return a function to update reasoning content in real-time
  if (reasoningCb) {
    reasoningCb.update = function(text) {
      reasonBody.textContent = text;
      if (!reasonDetails.open) reasonDetails.open = true;
      scrollChat();
    };
    reasoningCb.finalize = function() {
      reasonBody.classList.remove('streaming');
    };
  }
}

function removeTyping() {
  const el = document.getElementById('aiTyping');
  if (el) el.remove();
  if (aiTypingTimerInterval) { clearInterval(aiTypingTimerInterval); aiTypingTimerInterval = null; }
}

function scrollChat() { aiChat.scrollTop = aiChat.scrollHeight; }

function renderChatHistory() {
  aiChat.innerHTML = '';
  const msgs = (aiCurrentConv && aiCurrentConv.msgs) || [];
  if (!msgs.length) {
    const div = document.createElement('div');
    div.className = 'ai-msg ai';
    div.innerHTML = '<span class="role-tag">AI 鍔╂墜</span><div style="white-space:pre-wrap">浣犲ソ锛佹垜鍙互璇诲彇骞剁紪杈戜綘鐨勫崥澹鍒掋€傚憡璇夋垜浣犳兂鍋氫粈涔堚€斺€斾慨鏀逛换鍔°€佹坊鍔犲懆璁″垝銆佽皟鏁存杩伴兘鍙互銆傛墍鏈変慨鏀归渶瑕佷綘纭鍚庢墠浼氱敓鏁堛€?/div>';
    aiChat.appendChild(div);
    return;
  }
  msgs.forEach(msg => {
    if (msg.role === 'system') return;
    addAIMessage(msg.role, msg.content, msg.extra || null, msg.reasoning || null);
  });
}

function saveChatHistory() {
  if (!aiCurrentConv) return;
  // Only save when AI panel is open 鈥?otherwise the DOM is empty/stale
  // and would overwrite saved conversations with the default welcome message.
  if (!aiPanel.classList.contains('s')) return;
  const toStore = [];
  aiChat.querySelectorAll('.ai-msg').forEach(el => {
    const role = el.classList.contains('u') ? 'u' : el.classList.contains('ai') || el.classList.contains('system') ? 'ai' : null;
    if (!role) return;
    const textEl = el.querySelector('div[style*="pre-wrap"]') || el.querySelector('div:not(.role-tag):not(.ai-edit-proposal):not(.ai-edit-result):not(.ai-reasoning):not(.reasoning-body)');
    if (!textEl) return;
    // Capture reasoning content if present
    let reasoning = null;
    const reasoningEl = el.querySelector('.ai-reasoning .reasoning-body');
    if (reasoningEl && reasoningEl.textContent.trim()) reasoning = reasoningEl.textContent;
    toStore.push({ role, content: textEl.textContent, reasoning });
  });
  // Keep last 80 messages
  if (toStore.length > 80) toStore.splice(0, toStore.length - 80);
  aiCurrentConv.msgs = toStore;
  // Update title from first user message
  const firstUser = toStore.find(m => m.role === 'u');
  if (firstUser) aiCurrentConv.title = autoTitle(firstUser.content);
  aiCurrentConv.ts = Date.now();
  saveConvs();
}

function renderConvList() {
  aiConvList.innerHTML = '';
  const ids = Object.keys(aiConversations);
  if (!ids.length) { aiConvList.innerHTML = '<div style="text-align:center;color:var(--txt4);padding:1rem;font-size:.7rem">鏆傛棤瀵硅瘽</div>'; return; }
  // Sort by timestamp descending
  ids.sort((a, b) => (aiConversations[b].ts || 0) - (aiConversations[a].ts || 0));
  ids.forEach(id => {
    const conv = aiConversations[id];
    if (!conv) return;
    const item = document.createElement('div');
    item.className = 'ai-conv-item' + (id === aiCurrentId ? ' a' : '');
    const title = document.createElement('span');
    title.className = 'ci-title'; title.textContent = conv.title || '鏂板璇?;
    item.appendChild(title);
    const meta = document.createElement('span');
    meta.className = 'ci-meta';
    const cnt = (conv.msgs || []).length;
    const date = conv.ts ? new Date(conv.ts).toLocaleDateString('zh-CN', {month:'short',day:'numeric'}) : '';
    meta.textContent = cnt + '鏉? + (date ? ' 路 ' + date : '');
    item.appendChild(meta);
    const del = document.createElement('button');
    del.className = 'ci-del'; del.textContent = '鉁?;
    del.addEventListener('click', e => { e.stopPropagation(); deleteConv(id); });
    item.appendChild(del);
    item.addEventListener('click', () => { switchConv(id); aiConvPanel.classList.remove('s'); });
    aiConvList.appendChild(item);
  });
}

// ======================== EXPORT FUNCTIONS ========================
function getExportContent() {
  const msgs = (aiCurrentConv && aiCurrentConv.msgs) || [];
  if (!msgs.length) return null;
  const title = (aiCurrentConv && aiCurrentConv.title) || 'AI瀵硅瘽';
  const lines = [];
  lines.push('========================================');
  lines.push('  ' + title);
  lines.push('  瀵煎嚭鏃堕棿: ' + new Date().toLocaleString('zh-CN'));
  lines.push('  娑堟伅鏁? ' + msgs.length + ' 鏉?);
  lines.push('========================================');
  lines.push('');
  msgs.forEach(m => {
    const label = m.role === 'u' ? '馃懁 鎴? : m.role === 'ai' ? '馃 AI' : '鈿欙笍 绯荤粺';
    lines.push('鈹€鈹€ ' + label + ' 鈹€鈹€');
    lines.push(m.content || '');
    lines.push('');
  });
  return { text: lines.join('\n'), title, msgs };
}

function exportTXT() {
  const data = getExportContent();
  if (!data) { showToast('鈿狅笍 娌℃湁鍙鍑虹殑娑堟伅'); return; }
  const blob = new Blob([data.text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (data.title || '瀵硅瘽') + '.txt';
  a.click(); URL.revokeObjectURL(a.href);
  showToast('馃搫 宸插鍑?TXT');
}

function exportDOCX() {
  const data = getExportContent();
  if (!data) { showToast('鈿狅笍 娌℃湁鍙鍑虹殑娑堟伅'); return; }
  const date = new Date().toLocaleString('zh-CN');
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>
body{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-size:12pt;color:#222;padding:30px;line-height:1.6}
h1{font-size:18pt;color:#d4a574;border-bottom:2px solid #d4a574;padding-bottom:6px}
.meta{color:#888;font-size:10pt;margin:6px 0 18px}
.msg{margin:10px 0;padding:10px 14px;border-radius:6px}
.msg-u{background:#f5f5f5;border-left:3px solid #d4a574}
.msg-ai{background:#fdf8f3;border-left:3px solid #d4a574}
.msg-system{background:#fafafa;border-left:3px solid #ccc;color:#888;font-style:italic}
.label{font-weight:bold;font-size:10pt;margin-bottom:3px;color:#555}
.content{white-space:pre-wrap;font-size:11pt}
</style></head><body>
<h1>` + data.title + '</h1><div class="meta">瀵煎嚭鏃堕棿: ' + date + ' 路 鍏?' + data.msgs.length + ' 鏉℃秷鎭?/div>';
  data.msgs.forEach(m => {
    const cls = m.role === 'u' ? 'msg-u' : m.role === 'ai' ? 'msg-ai' : 'msg-system';
    const label = m.role === 'u' ? '馃懁 鎴? : m.role === 'ai' ? '馃 AI 鍔╂墜' : '鈿欙笍 绯荤粺';
    html += '<div class="msg ' + cls + '"><div class="label">' + label + '</div><div class="content">' + esc(m.content) + '</div></div>';
  });
  html += '</body></html>';
  const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (data.title || '瀵硅瘽') + '.doc';
  a.click(); URL.revokeObjectURL(a.href);
  showToast('馃摑 宸插鍑?DOC');
}

function exportPDF() {
  const data = getExportContent();
  if (!data) { showToast('鈿狅笍 娌℃湁鍙鍑虹殑娑堟伅'); return; }
  const w = window.open('', '_blank');
  if (!w) { showToast('鈿狅笍 璇峰厑璁稿脊鍑虹獥鍙?); return; }
  const date = new Date().toLocaleString('zh-CN');
  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>` + data.title + `</title><style>
@media print{@page{margin:1.5cm}body{padding:0}}
body{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-size:12pt;color:#222;padding:30px;line-height:1.6;max-width:800px;margin:0 auto}
h1{font-size:18pt;color:#d4a574;border-bottom:2px solid #d4a574;padding-bottom:6px}
.meta{color:#888;font-size:10pt;margin:6px 0 18px}
.msg{margin:10px 0;padding:10px 14px;border-radius:6px}
.msg-u{background:#f5f5f5;border-left:3px solid #d4a574}
.msg-ai{background:#fdf8f3;border-left:3px solid #d4a574}
.msg-system{background:#fafafa;border-left:3px solid #ccc;color:#888;font-style:italic}
.label{font-weight:bold;font-size:10pt;margin-bottom:3px;color:#555}
.content{white-space:pre-wrap;font-size:11pt}
</style></head><body>
<h1>` + data.title + '</h1><div class="meta">瀵煎嚭鏃堕棿: ' + date + ' 路 鍏?' + data.msgs.length + ' 鏉℃秷鎭?/div>';
  data.msgs.forEach(m => {
    const cls = m.role === 'u' ? 'msg-u' : m.role === 'ai' ? 'msg-ai' : 'msg-system';
    const label = m.role === 'u' ? '馃懁 鎴? : m.role === 'ai' ? '馃 AI 鍔╂墜' : '鈿欙笍 绯荤粺';
    html += '<div class="msg ' + cls + '"><div class="label">' + label + '</div><div class="content">' + esc(m.content) + '</div></div>';
  });
  html += '<p style="text-align:center;color:#ccc;font-size:9pt;margin-top:30px">鈥斺€?鐢卞崥澹鍒掑姪鎵嬪鍑?鈥斺€?/p></body></html>';
  w.document.write(html);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 300);
  showToast('馃摃 鎵撳紑 PDF 鎵撳嵃棰勮');
}

// Export button click delegation
document.querySelector('.ai-conv-footer').addEventListener('click', e => {
  const btn = e.target.closest('.cf-btn');
  if (!btn) return;
  const type = btn.dataset.export;
  if (type === 'txt') exportTXT();
  else if (type === 'docx') exportDOCX();
  else if (type === 'pdf') exportPDF();
});

// Build system prompt with full data context
function buildSystemPrompt() {
  let overviews = {};
  document.querySelectorAll('.tb[id^="ov-"]').forEach(el => {
    const cid = el.id.replace('ov-', '');
    overviews[cid] = el.innerText.trim();
  });

  const now = new Date().toLocaleDateString('zh-CN', {year:'numeric',month:'long',day:'numeric',weekday:'long'});
  let prompt = '浣犳槸涓€涓崥澹鍒掑姪鎵嬶紝甯姪鐢ㄦ埛绠＄悊鍏跺崥澹?-5骞村叏鏅鍒掞紙瀛︽湳銆佽€冨叕銆佽储鍔°€佺敓娲诲洓缁村害锛夈€俓n\n';
  prompt += '## 褰撳墠鏃ユ湡\n' + now + '\n\n';
  prompt += '## 褰撳墠鏁版嵁姒傝\n姣忔潯鍛ㄨ褰曟牸寮忥細{w:"鍛ㄥ悕绉?, s:"鍛ㄦ€荤粨", d:["鍛ㄤ竴浠诲姟","鍛ㄤ簩浠诲姟",...]}\n姣忓懆鏈?澶╋紙鍛ㄤ竴鑷冲懆鏃ワ級銆傚鏋滄煇澶╂病鏈夊唴瀹瑰垯涓虹┖瀛楃涓层€俓n\n';

  for (const cid in data) {
    const weeks = data[cid];
    if (!weeks || !weeks.length) { prompt += '- ' + cid + ': 绌篭n'; continue; }
    prompt += '- ' + cid + ' (' + weeks.length + '鍛?:\n';
    weeks.forEach((wk, i) => {
      const daySummary = wk.d.map((dd, di) => {
        const txt = typeof dd === 'string' ? dd : (dd && dd.text || '');
        return txt ? DAYS[di] + ':' + txt.substring(0,30) : '';
      }).filter(Boolean).join('; ');
      prompt += '  鍛? + (i+1) + ' [' + (wk.w||'') + '] 鎬荤粨:' + (wk.s||'').substring(0,40) + ' 浠诲姟:' + (daySummary || '绌?) + '\n';
    });
  }

  prompt += '\n## 鍚勫崱鐗囨杩板唴瀹筡n';
  for (const [cid, txt] of Object.entries(overviews)) {
    if (txt) prompt += '- ' + cid + ': ' + txt.substring(0,100) + '\n';
  }

  prompt += '\n## 浣犵殑鑳藉姏\n1. **璇诲彇鏁版嵁** - 浣犳嫢鏈夊畬鏁寸殑瑙勫垝鏁版嵁锛屽彲浠ョ洿鎺ュ洖绛旂敤鎴峰叧浜庢暟鎹殑闂\n2. **缂栬緫瑙勫垝** - 濡傛灉闇€瑕佷慨鏀癸紝璇峰湪鍥炲鏈熬娣诲姞JSON浠ｇ爜鍧楋紙鐢?```json ... ``` 鍖呰９锛塡n\n';
  prompt += '## 缂栬緫JSON鏍煎紡\n```json\n{\n  "edits": [\n    {\n      "type": "update_day",\n      "card": "y1-academic",\n      "week_index": 0,\n      "day_index": 0,\n      "new_text": "鍛ㄤ竴鐨勬柊浠诲姟鍐呭锛堟敮鎸佸琛岋紝鐢╘\n鎹㈣锛?,\n      "description": "淇敼绗?鍛ㄥ懆涓€浠诲姟"\n    }\n  ]\n}\n```\n\n';
  prompt += '## 鏀寔鐨勬搷浣滅被鍨媆n| type | 鍙傛暟 | 璇存槑 |\n|------|------|------|\n| update_day | card, week_index(0寮€濮?, day_index(0-6), new_text | 淇敼鏌愬ぉ浠诲姟锛堟敮鎸佸琛岋紝\\n鎹㈣锛?|\n| update_week_text | card, week_index, new_text | 淇敼鏌愬ぉ浠诲姟涓虹函鏂囨湰锛堜笉鏍囪瀹屾垚鐘舵€侊級 |\n| update_summary | card, week_index, new_text | 淇敼鍛ㄦ€荤粨 |\n| add_week | card, week_name(濡?绗琗鍛?) | 鍦ㄥ崱鐗囨湯灏炬坊鍔犳柊鐨勪竴鍛紙鍚?澶╃┖瀛楃涓诧級 |\n| add_weeks | card, week_names(鏁扮粍濡俒"绗?鍛?,"绗?鍛?]) | 鎵归噺娣诲姞澶氬懆 |\n| update_overview | card, new_text | 淇敼鍗＄墖姒傝堪鍐呭 |\n| update_footer | line(0-1), new_text | 淇敼椤佃剼鏂囧瓧锛坙ine=0绗竴琛? line=1绗簩琛岋級 |\n\n';
  prompt += '## 閲嶈瑙勫垯\n1. week_index 浠?寮€濮嬨€傜1鍛?0锛岀2鍛?1锛屼互姝ょ被鎺ㄣ€俓n2. day_index: 0=鍛ㄤ竴, 1=鍛ㄤ簩, ... 6=鍛ㄦ棩銆俓n3. new_text鏀寔澶氳鍐呭锛岀敤\\n琛ㄧず鎹㈣銆俓n4. 濡傛灉娌℃湁闇€瑕佷慨鏀圭殑鍐呭锛岀洿鎺ユ甯稿洖绛斿嵆鍙紝涓嶈娣诲姞缂栬緫JSON銆俓n5. 姣忔鍥炲鏈€澶氭彁鍑?涓紪杈戞搷浣溿€俓n6. 缂栬緫鎿嶄綔蹇呴』绮剧‘锛屼竴娆′慨鏀逛竴浠朵簨銆俓n7. 鐢ㄦ埛纭鍚庢墠浼氭墽琛屼慨鏀癸紝鎵€浠ヤ綘鍙渶瑕佹彁鍑哄缓璁€俓n8. 鍥炵瓟瑕佺敤涓枃锛岄鏍间翰鍒囦笓涓氥€俓n9. 褰撶敤鎴烽棶鍙婃暟鎹唴瀹规椂锛岀洿鎺ュ熀浜庝綘鐪嬪埌鐨勬暟鎹洖绛旓紝涓嶉渶瑕佺紪杈戙€?;

  return prompt;
}

// Send message to DeepSeek
async function sendAIMessage() {
  const text = aiInput.value.trim();
  if (!text || aiProcessing || !aiKey) {
    if (!aiKey) { aiKeyStatus.textContent = '鈿狅笍 璇峰厛璁剧疆 API Key'; aiKeyStatus.style.color = '#e85d2f'; }
    return;
  }
  aiInput.value = ''; aiSend.disabled = true; autoResize(aiInput);
  aiProcessing = true;
  setAIStatus('thinking');

  // Add user message
  addAIMessage('u', text);
  scrollChat();
  saveChatHistory();

  // Build messages array
  const systemPrompt = buildSystemPrompt();
  const msgs = [{ role: 'system', content: systemPrompt }];

  // Add last 8 messages for context
  const recentMsgs = (aiCurrentConv && aiCurrentConv.msgs) ? aiCurrentConv.msgs.slice(-8) : [];
  recentMsgs.forEach(m => {
    if (m.role === 'system') return;
    msgs.push({ role: m.role === 'u' ? 'user' : 'assistant', content: m.content });
  });
  msgs.push({ role: 'user', content: text });

  // Show typing with reasoning area
  const reasoningCb = {};
  addTypingIndicator(reasoningCb);

  try {
    const resp = await fetch(aiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + aiKey },
      body: JSON.stringify({
        model: aiModel,
        messages: msgs,
        max_tokens: 4096,
        temperature: 0.3,
        stream: true
      })
    });

    if (!resp.ok) {
      removeTyping();
      const errText = await resp.text();
      let errMsg = 'API 璇锋眰澶辫触';
      try { const je = JSON.parse(errText); errMsg = je.error?.message || je.error?.type || errMsg; } catch(e) {}
      addAIMessage('ai', '鈿狅笍 ' + errMsg + '銆傝妫€鏌?API Key 鏄惁鏈夋晥銆?);
      aiProcessing = false; aiSend.disabled = !aiInput.value.trim();
      setAIStatus('error', '璇锋眰澶辫触');
      saveChatHistory(); return;
    }

    // Streaming SSE response
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let replyContent = '';
    let reasoningContent = '';
    let gotReasoning = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const dataStr = trimmed.slice(6);
        if (dataStr === '[DONE]') { break; }

        try {
          const data = JSON.parse(dataStr);
          const delta = data.choices?.[0]?.delta || {};
          // Reasoning content (real-time thinking)
          if (delta.reasoning_content) {
            reasoningContent += delta.reasoning_content;
            if (reasoningCb.update) reasoningCb.update(reasoningContent);
            gotReasoning = true;
          }
          // Regular content
          if (delta.content) {
            replyContent += delta.content;
          }
        } catch(e) { /* skip malformed JSON lines */ }
      }
    }

    removeTyping();
    if (reasoningCb.finalize) reasoningCb.finalize();

    const reply = replyContent || '锛堟病鏈夊洖澶嶏級';

    // Parse for edit proposals
    let replyBody = reply;
    let proposal = null;
    const jsonBlockRegex = /```json\s*([\s\S]*?)```/;
    const match = reply.match(jsonBlockRegex);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed.edits && Array.isArray(parsed.edits) && parsed.edits.length) {
          proposal = {
            description: parsed.edits.length + ' 椤逛慨鏀瑰缓璁? + (parsed.edits[0].description ? '锛? + parsed.edits[0].description + (parsed.edits.length > 1 ? ' 绛? : '') : ''),
            edits: parsed.edits,
            raw: match[1]
          };
          replyBody = reply.replace(jsonBlockRegex, '').trim();
        }
      } catch(e) { /* ignore parse errors */ }
    }

    addAIMessage('ai', replyBody, proposal ? { proposal } : null, gotReasoning ? reasoningContent : null);
    scrollChat();
    saveChatHistory();
    if (proposal) setAIStatus('confirming');

  } catch(err) {
    removeTyping();
    addAIMessage('ai', '鈿狅笍 缃戠粶閿欒锛? + (err.message || '璇锋眰澶辫触') + '銆傝妫€鏌ョ綉缁滆繛鎺ャ€?);
    scrollChat();
    saveChatHistory();
    setAIStatus('error', '缃戠粶閿欒');
  }

  aiProcessing = false;
  aiSend.disabled = !aiInput.value.trim();
  // If no error and not confirming, go idle; confirming is set by proposal
  if (!aiProcessing) {
    const hasPending = document.querySelector('.ai-edit-proposal .btn-confirm');
    if (!hasPending) setAIStatus('idle');
  }
}

// Apply edit proposal
function applyEditProposal(proposal, btnEl) {
  const edits = proposal.edits;
  let applied = 0, errors = [];

  edits.forEach(edit => {
    try {
      switch (edit.type) {
        case 'update_day':
        case 'update_week_text': {
          const cid = edit.card;
          if (!data[cid]) { errors.push(edit.card + ' 涓嶅瓨鍦?); return; }
          const week = data[cid][edit.week_index];
          if (!week) { errors.push(edit.card + ' 绗? + (edit.week_index+1) + '鍛ㄤ笉瀛樺湪'); return; }
          // Ensure all 7 days exist
          while (week.d.length < 7) week.d.push('');
          const di = edit.day_index;
          // Check if existing is object with done state
          if (week.d[di] && typeof week.d[di] === 'object' && week.d[di].done !== undefined) {
            week.d[di].text = edit.new_text;
          } else {
            week.d[di] = edit.new_text;
          }
          applied++;
          break;
        }
        case 'update_summary': {
          const cid = edit.card;
          if (!data[cid]) { errors.push(edit.card + ' 涓嶅瓨鍦?); return; }
          const week = data[cid][edit.week_index];
          if (!week) { errors.push(edit.card + ' 绗? + (edit.week_index+1) + '鍛ㄤ笉瀛樺湪'); return; }
          week.s = edit.new_text;
          applied++;
          break;
        }
        case 'add_week': {
          const cid = edit.card;
          if (!data[cid]) { errors.push(edit.card + ' 涓嶅瓨鍦?); return; }
          data[cid].push({ w: edit.week_name || '绗? + (data[cid].length+1) + '鍛?, s: '', d: ['','','','','','',''] });
          applied++;
          break;
        }
        case 'add_weeks': {
          const cid = edit.card;
          if (!data[cid]) { errors.push(edit.card + ' 涓嶅瓨鍦?); return; }
          const names = edit.week_names || [];
          names.forEach(name => {
            data[cid].push({ w: name, s: '', d: ['','','','','','',''] });
            applied++;
          });
          break;
        }
        case 'update_overview': {
          const ovEl = document.getElementById('ov-' + edit.card);
          if (!ovEl) { errors.push(edit.card + ' 姒傝堪涓嶅瓨鍦?); return; }
          ovEl.innerHTML = '<ul><li>' + edit.new_text.split('\n').join('</li><li>') + '</li></ul>';
          if (!data._overviews) data._overviews = {};
          data._overviews[edit.card] = ovEl.innerHTML;
          applied++;
          break;
        }
        case 'update_footer': {
          var lineIdx = parseInt(edit.line);
          if (isNaN(lineIdx) || lineIdx < 0 || lineIdx > 1) { errors.push('footer line 蹇呴』涓?0 鎴?1'); return; }
          if (!data._footer || !Array.isArray(data._footer)) data._footer = ['', ''];
          data._footer[lineIdx] = edit.new_text;
          renderFooter();
          applied++;
          break;
        }
        default:
          errors.push('鏈煡鎿嶄綔绫诲瀷: ' + edit.type);
      }
    } catch(e) {
      errors.push(edit.type + ' 鎵ц閿欒: ' + e.message);
    }
  });

  // Save
  save();
  renderAll();
  updateAllStats();

  // Show result in the proposal area
  const propDiv = btnEl.closest('.ai-edit-proposal');
  if (propDiv) {
    let resultHtml = '';
    if (errors.length === 0) {
      resultHtml = '<span style="color:#d4a574">鉁?宸插簲鐢?' + applied + ' 椤逛慨鏀?/span>';
    } else {
      resultHtml = '<span style="color:#d4a574">鉁?宸插簲鐢?' + applied + ' 椤?/span><span style="color:#e85d2f;margin-left:.5rem">鈿狅笍 ' + errors.length + ' 椤瑰け璐? ' + errors.join('; ') + '</span>';
    }
    propDiv.innerHTML = '<p>' + resultHtml + '</p>';
  }

  showToast('馃 AI 宸插簲鐢?' + applied + ' 椤逛慨鏀?);
  setAIStatus('idle');
}

// Patch save to also persist AI chat history
{ const _origSave = save; save = function() { _origSave(); saveChatHistory(); debounceAutoSync(); }; }

// ======================== GIST SYNC ========================
const GIST_FILENAME = 'phd-plan-data.json';
const GIST_TOKEN_KEY = SK + '_gist_token';
const GIST_ID_KEY = SK + '_gist_id';
const GIST_LAST_SYNC_KEY = SK + '_gist_last_sync';

let gistToken = localStorage.getItem(GIST_TOKEN_KEY) || '';
let gistId = localStorage.getItem(GIST_ID_KEY) || '';
let gistLastSync = parseInt(localStorage.getItem(GIST_LAST_SYNC_KEY)) || 0;
let gistSyncing = false;

function gistDom(id) { return document.getElementById(id); }

// Restore gist token and ID inputs
if (gistToken) gistDom('gistTokenInput').value = gistToken;
if (gistId) gistDom('gistIdInput').value = gistId;
updateGistUI();

// Toggle sync section
gistDom('gistToggle').addEventListener('click', function() {
  const body = gistDom('gistBody');
  body.classList.toggle('o');
  this.querySelector('span:last-child').textContent = body.classList.contains('o') ? '鈻? : '鈻?;
});

// Manual Gist ID input: update live
gistDom('gistIdInput').addEventListener('input', function() {
  gistId = this.value.trim();
  if (gistId) {
    localStorage.setItem(GIST_ID_KEY, gistId);
    updateGistUI();
  } else {
    localStorage.removeItem(GIST_ID_KEY);
  }
});

// Save token 鈫?verify + find existing gist or create
gistDom('gistSaveBtn').addEventListener('click', async function() {
  const token = gistDom('gistTokenInput').value.trim();
  if (!token || (!token.startsWith('ghp_') && !token.startsWith('github_pat_') && !token.startsWith('gho_') && !token.startsWith('ghu_'))) {
    setGistStatus('鈿狅笍 闇€瑕佹湁鏁堢殑 GitHub Token锛坓hp_ 寮€澶达級', 'err');
    return;
  }
  gistToken = token;
  localStorage.setItem(GIST_TOKEN_KEY, token);

  // Also pick up manual gistId if entered
  const manualId = gistDom('gistIdInput').value.trim();
  if (manualId) gistId = manualId;

  setGistStatus('鈴?楠岃瘉涓€?, '');
  
  // If we have a gistId, verify it
  if (gistId) {
    try {
      const remote = await gistFetch();
      if (remote._syncedAt > gistLastSync) {
        setGistStatus('鉁?鍙戠幇鏂版暟鎹紝姝ｅ湪鍚屾鈥?, 'ok');
        await gistPull();
      } else {
        setGistStatus('鉁?Token 鏈夋晥锛孏ist 宸插氨缁?, 'ok');
      }
      updateGistUI();
      return;
    } catch(e) {
      // gistId invalid or gist deleted 鈫?fall through to find/create
      setGistStatus('鈿狅笍 宸插瓨鐨?Gist 鏃犳晥锛屾鍦ㄦ煡鎵锯€?, '');
      gistId = '';
    }
  }
  
  // No gistId 鈫?search for existing gist with our filename
  setGistStatus('馃攳 姝ｅ湪鏌ユ壘宸叉湁鐨勬暟鎹?Gist鈥?, '');
  try {
    const foundId = await gistFindExisting();
    if (foundId) {
      gistId = foundId;
      localStorage.setItem(GIST_ID_KEY, gistId);
      gistDom('gistIdInput').value = gistId;
      setGistStatus('鉁?鎵惧埌宸叉湁 Gist锛屾鍦ㄦ媺鍙栤€?, 'ok');
      await gistPull();
    } else {
      // No existing gist 鈫?create one
      setGistStatus('鈴?鏈壘鍒帮紝姝ｅ湪鍒涘缓鏂?Gist鈥?, '');
      const now = Date.now();
      const pushData = JSON.parse(JSON.stringify(data));
      pushData._syncedAt = now;
      const resp = await gistCreate(JSON.stringify(pushData));
      gistId = resp.id;
      localStorage.setItem(GIST_ID_KEY, gistId);
      gistDom('gistIdInput').value = gistId;
      gistLastSync = now;
      localStorage.setItem(GIST_LAST_SYNC_KEY, gistLastSync.toString());
      setGistStatus('鉁?Gist 宸插垱寤?(ID: ' + gistId.slice(0,8) + '鈥?', 'ok');
      showToast('鈿?Gist 鑷姩鍚屾宸插紑鍚?);
    }
  } catch(e) {
    setGistStatus('鈿狅笍 鎿嶄綔澶辫触: ' + (e.message || e), 'err');
  }
  updateGistUI();
});

// 馃攳 Find my Gist button
gistDom('gistFindBtn').addEventListener('click', async function() {
  const token = gistDom('gistTokenInput').value.trim();
  if (!token) { setGistStatus('鈿狅笍 璇峰厛濉叆 Token', 'err'); return; }
  gistToken = token;
  localStorage.setItem(GIST_TOKEN_KEY, token);
  setGistStatus('馃攳 姝ｅ湪鏌ユ壘宸叉湁 Gist鈥?, '');
  try {
    const foundId = await gistFindExisting();
    if (foundId) {
      gistId = foundId;
      localStorage.setItem(GIST_ID_KEY, gistId);
      gistDom('gistIdInput').value = gistId;
      setGistStatus('鉁?鎵惧埌 Gist: ' + gistId.slice(0,12) + '鈥︼紝鐐?猬囨媺鍙?鑾峰彇鏁版嵁', 'ok');
    } else {
      setGistStatus('鈿狅笍 鏈壘鍒版暟鎹?Gist锛岀偣 馃捑淇濆瓨Token 鍒涘缓涓€涓?, 'err');
    }
  } catch(e) {
    setGistStatus('鈿狅笍 鏌ユ壘澶辫触: ' + (e.message || e), 'err');
  }
  updateGistUI();
});

// Push to Gist
gistDom('gistSyncBtn').addEventListener('click', async function() {
  if (!gistToken) { showToast('鈿狅笍 璇峰厛淇濆瓨 Token'); return; }
  if (gistSyncing) return;
  if (!gistId) { showToast('鈿狅笍 鏈壘鍒?Gist锛岃鍏堜繚瀛?Token'); return; }
  await gistPush();
});

// Pull from Gist
gistDom('gistPullBtn').addEventListener('click', async function() {
  if (!gistToken) { showToast('鈿狅笍 璇峰厛淇濆瓨 Token'); return; }
  if (gistSyncing) return;
  if (!gistId) { showToast('鈿狅笍 鏈壘鍒?Gist锛岃鍏堜繚瀛?Token'); return; }
  await gistPull();
});

// ===== Gist API Helpers =====
async function gistCreate(content) {
  const resp = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: { 'Authorization': 'token ' + gistToken, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
    body: JSON.stringify({
      description: '鍗氬＋瑙勫垝鏁版嵁鍚屾 (' + new Date().toLocaleDateString('zh-CN') + ')',
      public: false,
      files: { [GIST_FILENAME]: { content: content } }
    })
  });
  if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error((e.message||resp.statusText)+' ('+resp.status+')'); }
  return resp.json();
}

async function gistUpdate(content) {
  const resp = await fetch('https://api.github.com/gists/' + gistId, {
    method: 'PATCH',
    headers: { 'Authorization': 'token ' + gistToken, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
    body: JSON.stringify({
      files: { [GIST_FILENAME]: { content: content } }
    })
  });
  if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error((e.message||resp.statusText)+' ('+resp.status+')'); }
  return resp.json();
}

async function gistFetch() {
  const resp = await fetch('https://api.github.com/gists/' + gistId, {
    headers: { 'Authorization': 'token ' + gistToken, 'Accept': 'application/vnd.github.v3+json' }
  });
  if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error((e.message||resp.statusText)+' ('+resp.status+')'); }
  const gist = await resp.json();
  const file = gist.files && gist.files[GIST_FILENAME];
  if (!file) throw new Error('Gist 涓湭鎵惧埌 ' + GIST_FILENAME);
  return JSON.parse(file.content);
}

// ===== Find existing gist by filename =====
async function gistFindExisting() {
  // List user's gists (paginated, get 50 most recent)
  const resp = await fetch('https://api.github.com/gists?per_page=50', {
    headers: { 'Authorization': 'token ' + gistToken, 'Accept': 'application/vnd.github.v3+json' }
  });
  if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error((e.message||resp.statusText)+' ('+resp.status+')'); }
  const gists = await resp.json();
  if (!Array.isArray(gists)) throw new Error('鏃犳硶鑾峰彇 Gist 鍒楄〃');
  // Find the first gist that has our filename
  for (const g of gists) {
    if (g.files && g.files[GIST_FILENAME]) {
      return g.id;
    }
  }
  return null; // not found
}

// ===== Push =====
async function gistPush() {
  gistSyncing = true;
  gistDom('gistSyncBtn').disabled = true;
  setGistStatus('鈴?鎺ㄩ€佷腑鈥?, '');
  try {
    const now = Date.now();
    const pushData = JSON.parse(JSON.stringify(data));
    pushData._syncedAt = now;
    const content = JSON.stringify(pushData);
    if (gistId) {
      await gistUpdate(content);
    } else {
      const resp = await gistCreate(content);
      gistId = resp.id;
      localStorage.setItem(GIST_ID_KEY, gistId);
    }
    gistLastSync = now;
    localStorage.setItem(GIST_LAST_SYNC_KEY, gistLastSync.toString());
    setGistStatus('鉁?宸插悓姝?' + new Date(gistLastSync).toLocaleString('zh-CN', {hour:'2-digit',minute:'2-digit'}), 'ok');
    showToast('鈿?宸叉帹閫佸埌浜戠');
  } catch(e) {
    setGistStatus('鈿狅笍 鎺ㄩ€佸け璐? ' + (e.message || e), 'err');
    showToast('鈿狅笍 鍚屾澶辫触');
  }
  gistSyncing = false;
  gistDom('gistSyncBtn').disabled = false;
  updateGistUI();
}

// ===== Pull (always overwrites local data with remote) =====
async function gistPull() {
  gistSyncing = true;
  gistDom('gistPullBtn').disabled = true;
  setGistStatus('鈴?鎷夊彇涓€?, '');
  try {
    const remote = await gistFetch();
    delete remote._syncedAt;
    // Preserve overviews if remote doesn't have them
    const localOverviews = data._overviews;
    data = remote;
    if (!data._overviews && localOverviews) data._overviews = localOverviews;
    ensure(data);
    save();
    renderAll();
    gistLastSync = Date.now();
    localStorage.setItem(GIST_LAST_SYNC_KEY, gistLastSync.toString());
    setGistStatus('鉁?宸蹭粠浜戠鎷夊彇 ' + new Date(gistLastSync).toLocaleString('zh-CN', {hour:'2-digit',minute:'2-digit'}), 'ok');
    showToast('鈿?宸蹭粠浜戠鎷夊彇');
  } catch(e) {
    setGistStatus('鈿狅笍 鎷夊彇澶辫触: ' + (e.message || e), 'err');
    showToast('鈿狅笍 鎷夊彇澶辫触');
  }
  gistSyncing = false;
  gistDom('gistPullBtn').disabled = false;
  updateGistUI();
}

// ===== Auto-sync helpers =====
let autoSyncTimer = null;
function debounceAutoSync() {
  if (!gistToken || !gistId) return;
  if (autoSyncTimer) clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(function() {
    gistPush();
  }, 5000);
}

function setGistStatus(msg, cls) {
  const el = gistDom('gistStatus');
  if (el) { el.textContent = msg; el.className = 'gist-status-text' + (cls ? ' ' + cls : ''); }
}

function updateGistUI() {
  const el = gistDom('gistIndicator');
  if (!el) return;
  if (gistId && gistLastSync > 0) {
    const d = new Date(gistLastSync);
    el.textContent = '鈿? + d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
    el.title = '涓婃鍚屾: ' + d.toLocaleString('zh-CN');
  } else if (gistToken && gistId) {
    el.textContent = '鈿″緟';
    el.title = '绛夊緟棣栨鍚屾';
  } else {
    el.textContent = '鈿?-';
    el.title = '鏈厤缃暟鎹悓姝?;
  }
}

// ===== Init: auto-pull remote data on page load =====
function trySyncOnLoad() {
  if (!gistToken || !gistId) return;
  setGistStatus('鈴?鑷姩鍚屾涓€?, '');
  gistFetch().then(function(remote) {
    delete remote._syncedAt;
    const localOverviews = data._overviews;
    data = remote;
    if (!data._overviews && localOverviews) data._overviews = localOverviews;
    ensure(data);
    save();
    renderAll();
    gistLastSync = Date.now();
    localStorage.setItem(GIST_LAST_SYNC_KEY, gistLastSync.toString());
    setGistStatus('鉁?宸茶嚜鍔ㄥ悓姝ヤ簯绔暟鎹?, 'ok');
    showToast('鈿?宸插悓姝ヤ簯绔暟鎹?);
    updateGistUI();
  }).catch(function(e) {
    setGistStatus('鈿狅笍 鑷姩鍚屾澶辫触: ' + (e.message||'').substring(0,40), 'err');
  });
}

// ===== "Save to Repo" - backup data as a commit =====
const REPO_OWNER = 'hdd54';
const REPO_NAME = 'phd-plan';
const BACKUP_PATH = 'data/backup.json';
document.getElementById('repoSaveBtn').addEventListener('click', async function() {
  var btn = this;
  if (btn.dataset.busy === '1') return;
  btn.dataset.busy = '1';
  btn.textContent = '鈴?瀛樻。涓€?;
  var token = gistToken || localStorage.getItem(GIST_TOKEN_KEY) || '';
  if (!token) {
    showToast('鈿狅笍 璇峰厛鍦?鈿?涓厤缃?GitHub Token锛堥渶 repo 鏉冮檺锛?);
    btn.textContent = '馃捑 瀛樻。'; btn.dataset.busy = '';
    return;
  }
  try {
    var content = JSON.stringify(data, null, 2);
    var encoded = btoa(unescape(encodeURIComponent(content)));
    var now = new Date();
    var dateStr = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    var commitMsg = '馃捑 鏁版嵁澶囦唤 ' + dateStr;
    // Try to get current file SHA first
    var sha = '';
    try {
      var getResp = await fetch('https://api.github.com/repos/'+REPO_OWNER+'/'+REPO_NAME+'/contents/'+BACKUP_PATH, {
        headers: { 'Authorization': 'token '+token, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (getResp.ok) {
        var existing = await getResp.json();
        sha = existing.sha;
      }
    } catch(e) { /* file doesn't exist yet */ }
    // Create or update the file
    var body = { message: commitMsg, content: encoded };
    if (sha) body.sha = sha;
    var resp = await fetch('https://api.github.com/repos/'+REPO_OWNER+'/'+REPO_NAME+'/contents/'+BACKUP_PATH, {
      method: 'PUT',
      headers: { 'Authorization': 'token '+token, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      var errData = await resp.json().catch(function(){ return {}; });
      throw new Error(errData.message || resp.statusText);
    }
    showToast('鉁?宸插瓨妗ｅ埌浠撳簱 ('+dateStr+')');
  } catch(e) {
    showToast('鈿狅笍 瀛樻。澶辫触: '+(e.message||e).substring(0,50));
  }
  btn.textContent = '馃捑 瀛樻。'; btn.dataset.busy = '';
});

// ======================== SCROLL PROGRESS ========================
(function(){
  const bar = document.getElementById('progress');
  function upd(){const s=document.body.scrollHeight-window.innerHeight;bar.style.width=(s>0?(window.scrollY/s)*100:0)+'%'}
  window.addEventListener('scroll',upd,{passive:true});upd();
})();

// ======================== LEFT NAV RAIL ========================
var navObs;
(function(){
  const dots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('.sec');
  navObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        dots.forEach(function(d) {
          d.classList.toggle('a', d.dataset.target === id);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(function(s) { navObs.observe(s); });
  dots.forEach(function(d) {
    d.addEventListener('click', function() {
      var el = document.getElementById(this.dataset.target);
      if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
})();

// ======================== REVEAL ON SCROLL ========================
var rObs;
(function(){
  rObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function(el) { rObs.observe(el); });
})();

// ======================== PARTICLES ========================
(function(){
const canvas = document.getElementById('pc');
const ctx = canvas.getContext('2d');
let W, H, particles = [], mouse = {x:-9999,y:-9999};
function resizeCanvas() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
class Particle{
  constructor(){this.reset(true)}
  reset(init){
    this.x=Math.random()*W;this.y=init?Math.random()*H:H+10;
    this.size=Math.random()*1.8+0.3;this.speedY=-(Math.random()*0.3+0.06);
    this.speedX=(Math.random()-0.5)*0.18;this.opacity=Math.random()*0.6+0.15;
    this.life=0;this.maxLife=Math.random()*700+500;
    this.hue=Math.random()<0.7?'amber':'vermilion';
  }
  update(){
    this.x+=this.speedX;this.y+=this.speedY;this.life++;
    var dx=mouse.x-this.x,dy=mouse.y-this.y,dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<130&&dist>0){var f=(130-dist)/130;this.x-=(dx/dist)*f*0.6;this.y-=(dy/dist)*f*0.6}
    if(this.y<-10||this.life>this.maxLife)this.reset();
  }
  draw(){
    var fi=Math.min(this.life/80,1),fo=Math.min((this.maxLife-this.life)/120,1);
    var op=this.opacity*Math.max(0,Math.min(fi,fo));if(op<=0)return;
    var bc=this.hue==='amber'?'rgba(212,165,116,'+op+')':'rgba(232,93,47,'+(op*0.75)+')';
    ctx.beginPath();ctx.arc(this.x,this.y,Math.max(0.1,this.size),0,Math.PI*2);ctx.fillStyle=bc;ctx.fill();
    if(this.size>0.9){
      var hr=this.size*3.5,grad=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,hr);
      grad.addColorStop(0,bc);grad.addColorStop(1,'rgba(212,165,116,0)');
      ctx.beginPath();ctx.arc(this.x,this.y,hr,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
    }
  }
}
var pc=window.innerWidth<768?40:75;
for(var i=0;i<pc;i++)particles.push(new Particle());
function draw(){
  ctx.fillStyle='rgba(10,9,8,0.09)';ctx.fillRect(0,0,W,H);
  particles.forEach(function(p){p.update();p.draw()});
  requestAnimationFrame(draw);
}
draw();
window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY});
window.addEventListener('mouseleave',function(){mouse.x=-9999;mouse.y=-9999});
})();

// ======================== FEATURE: Markdown Render ========================
function mdRender(t){if(!t)return'';var s=esc(t)
// bold+italic
s=s.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
s=s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
s=s.replace(/\*(.+?)\*/g,'<em>$1</em>')
// inline code
s=s.replace(/`(.+?)`/g,'<code style="background:rgba(255,255,255,.05);padding:.05rem .2rem;border-radius:3px;font-size:.9em">$1</code>')
// links
s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
// images
s=s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<em style="color:var(--muted)">[img: $1]</em>')
// hr
s=s.replace(/^---$/gm,'<hr>')
// headings
s=s.replace(/^### (.+)$/gm,'<strong style="font-size:1.1em;color:var(--fg);display:block;margin:.2rem 0 .05rem">$1</strong>')
// lists
var inUl=false;s=s.split('\n').map(function(l){
  var m=l.match(/^[*-] (.+)$/);if(m){if(!inUl){inUl=true;return '<ul><li>'+m[1]+'</li>'}return '<li>'+m[1]+'</li>'}
  if(inUl){inUl=false;return '</ul>'+l}return l
}).join('\n');if(inUl)s+='</ul>'
return s}
function toggleMd(ta){var dr=ta.closest('.dr'),pre=dr?dr.querySelector('.md-preview'):null,btn=dr?dr.querySelector('.md-btn'):null
  if(!pre||!btn)return;if(pre.classList.contains('s')){pre.classList.remove('s');ta.style.display='block';btn.textContent='MD'}
  else{pre.innerHTML=mdRender(ta.value);pre.classList.add('s');ta.style.display='none';btn.textContent='鉁?}}

// ======================== FEATURE: Weekly OKR ========================
function renderOKRs(cid){var area=document.getElementById('okr-'+cid);if(!area)return;var okrs=data._okrs||{};var list=okrs[cid]||[]
  area.innerHTML='';list.forEach(function(o,i){
    var d=document.createElement('div');d.className='okr-item'+(o.done?' done':'')
    d.innerHTML='<span class="okr-key">KR'+(i+1)+'</span><span>'+esc(o.text)+'</span><button class="okr-del" data-okr-cid="'+cid+'" data-okr-i="'+i+'">脳</button>'
    d.querySelector('.okr-item')||d.querySelector('.okr-del')&&(d.querySelector('.okr-del').onclick=function(){list.splice(i,1);save();renderOKRs(cid)})
    if(!o.done)d.onclick=function(){o.done=true;save();renderOKRs(cid)}
    area.appendChild(d)})
  var addBtn=document.createElement('button');addBtn.className='okr-add';addBtn.textContent='+ 鍏抽敭缁撴灉'
  addBtn.onclick=function(){var t=prompt('鍏抽敭缁撴灉锛?);if(t&&t.trim()){list.push({text:t.trim(),done:false});save();renderOKRs(cid)}}
  area.appendChild(addBtn)
  // Re-bind delete
  area.querySelectorAll('.okr-del').forEach(function(b){b.onclick=function(e){e.stopPropagation();var idx=parseInt(b.dataset.okr-i);list.splice(idx,1);save();renderOKRs(cid)}})
}
function initOKRs(){if(!data._okrs)data._okrs={};;var cids=[];document.querySelectorAll('.wp').forEach(function(w){var cid=w.id.replace('plan-body-','');cids.push(cid)})
  cids.forEach(function(cid){if(!data._okrs[cid])data._okrs[cid]=[]});}

// ======================== FEATURE: Daily Journal ========================
function initJournalsForWeek(cid,wkIdx){if(!data._journal)data._journal={};var key=cid+'-w'+wkIdx;if(!data._journal[key])data._journal[key]={}}
function toggleJournal(dr,dayIdx,wkKey){var jb=dr.querySelector('.journal-box');if(!jb)return;jb.classList.toggle('s')
  var ta=jb.querySelector('textarea');if(ta&&jb.classList.contains('s'))setTimeout(function(){ta.focus()},50)}
function saveJournal(wkKey,dayIdx,val){if(!data._journal)data._journal={};if(!data._journal[wkKey])data._journal[wkKey]={};data._journal[wkKey][dayIdx]=val;save()}

// ======================== FEATURE: Weekly Templates ========================
function saveTemplate(cid){var weeks=data[cid];if(!weeks||!weeks.length){showToast('鈿狅笍 娌℃湁鍛ㄦ暟鎹?);return}
  var tpl={days:[],summary:''};weeks.forEach(function(w){
    (w.d||w.days||[]).forEach(function(d,i){if(!tpl.days[i])tpl.days[i]='';var txt=typeof d==='object'?d.text:(d||'');if(txt&&txt.trim())tpl.days[i]=txt.trim()});if(w.summary||w.s)w.summary=(w.summary||w.s||'').trim()})
  var name=prompt('妯℃澘鍚嶇О锛?);if(!name||!name.trim())return;if(!data._templates)data._templates={}
  data._templates[name.trim()]=tpl;save();showToast('鉁?宸蹭繚瀛樻ā鏉?"'+name.trim()+'"')
  renderTemplates()}
function applyTemplate(cid){if(!data._templates||!Object.keys(data._templates).length){showToast('鈿狅笍 娌℃湁鍙敤妯℃澘');return}
  var names=Object.keys(data._templates);if(names.length===1)loadTemplate(cid,names[0]);else{
    var html='<div style="display:flex;flex-direction:column;gap:.3rem;padding:.2rem 0">'
    names.forEach(function(n){html+='<button class="fb" data-tpl="'+n+'" style="text-align:left;justify-content:flex-start">'+esc(n)+'</button>'})
    html+='</div>';showToast(html)}}
function loadTemplate(cid,name){var tpl=data._templates[name];if(!tpl){showToast('鈿狅笍 妯℃澘涓嶅瓨鍦?);return}
  var weeks=data[cid];if(!weeks||!weeks.length){showToast('鈿狅笍 璇峰厛娣诲姞鍛?);return}
  weeks.forEach(function(w){(w.d||w.days||[]).forEach(function(d,i){if(tpl.days[i]){var nv=typeof d==='object'?{text:tpl.days[i],done:d.done}:tpl.days[i];if(Array.isArray(w.d))w.d[i]=nv;else w.days[i]=nv}});if(tpl.summary){w.s=tpl.summary;w.summary=tpl.summary}})
  save();renderAll();showToast('鉁?宸插簲鐢ㄦā鏉?"'+name+'"')}
function renderTemplates(){document.querySelectorAll('.tpl-list').forEach(function(el){
  var names=data._templates?Object.keys(data._templates):[]
  el.innerHTML=names.length?names.map(function(n){return'<span class="tpl-item" data-tpl="'+n+'">'+esc(n)+'</span>'}).join(''):'<span style="color:var(--muted);font-size:.55rem">鏃犳ā鏉?/span>'
  el.querySelectorAll('.tpl-item').forEach(function(s){s.onclick=function(){loadTemplate(s.closest('.wp')?.id?.replace('plan-body-','')||'',s.dataset.tpl)}})})}

// ======================== FEATURE: Pomodoro ========================
var pomo={running:false,time:25*60,left:25*60,interval:null,label:'focus',sessionType:'focus',tag:'',date:null,totalToday:0}
var POMO_MS=[{n:'50涓?,c:50,i:'馃尡'},{n:'100涓?,c:100,i:'馃尶'},{n:'200涓?,c:200,i:'馃尦'},{n:'500涓?,c:500,i:'馃弳'},{n:'1000涓?,c:1000,i:'馃憫'},{n:'2000涓?,c:2000,i:'馃拵'},{n:'5000涓?,c:5000,i:'馃弲'},{n:'10000涓?,c:10000,i:'馃挮'}]
function pomoLoad(){var s=localStorage.getItem('phd_v4_pomo');if(s)try{var p=JSON.parse(s);pomo.time=p.time||25*60;pomo.left=p.left||pomo.time;pomo.label=p.label||'focus';pomo.sessionType=p.sessionType||'focus'}catch(e){}
  var t=new Date().toDateString();if(pomo.date!==t){pomo.date=t;pomo.totalToday=0}
  updatePomoDisplay();updatePomoBadge();renderPomoRecords();renderPomoStats();renderPomoMstones()}
function pomoSaveState(){localStorage.setItem('phd_v4_pomo',JSON.stringify({time:pomo.time,left:pomo.left,label:pomo.label,sessionType:pomo.sessionType,date:pomo.date}))}
function pomoOpen(){document.getElementById('pomoOverlay').classList.add('s');document.getElementById('pomoModal').classList.add('s')}
function pomoClose(){if(pomo.running&&!confirm('璁℃椂鍣ㄦ鍦ㄨ繍琛岋紝纭畾鍏抽棴锛?))return
  document.getElementById('pomoOverlay').classList.remove('s');document.getElementById('pomoModal').classList.remove('s')}
function pomoSetType(el){var m=el.dataset;if(!m.pomoTime)return
  if(pomo.running){pomoClose();return}
  document.querySelectorAll('.pomo-type').forEach(function(b){b.classList.remove('s')});el.classList.add('s')
  pomo.time=parseInt(m.pomoTime)*60;pomo.left=pomo.time;pomo.label=m.pomoLabel||'focus';pomo.sessionType=el.classList.contains('break-t')?'break':'focus'
  clearInterval(pomo.interval);pomo.running=false
  updatePomoDisplay();document.getElementById('pomoStartBtn').textContent='鈻?寮€濮?
  document.getElementById('pomoProgressBar').style.width='0%'
  pomoSaveState()}
function fmtTime(s){var m=Math.floor(s/60);var sec=s%60;return(m<10?'0':'')+m+':'+(sec<10?'0':'')+sec}
function updatePomoDisplay(){var txt=fmtTime(pomo.left)
  var el=document.getElementById('pomoTimerDisplay');el.textContent=txt
  el.className='pomo-timer-display'+(pomo.running?' r':'')+(pomo.sessionType==='break'?' break':'')
  document.getElementById('pomoSessionLabel').textContent=pomo.label||'涓撴敞'
  document.getElementById('pomoProgressBar').className='bar'+(pomo.running?' r':'')+(pomo.sessionType==='break'?' break':'')
  document.getElementById('pomoProgressBar').style.width=((1-pomo.left/pomo.time)*100)+'%'
  document.getElementById('pfTime').textContent=txt;document.getElementById('pfLabel').textContent=pomo.label||'涓撴敞'
  var pb=document.getElementById('pfBar');pb.innerHTML='<div class="in" style="width:'+((1-pomo.left/pomo.time)*100)+'%"></div>'}
function updatePomoBadge(){var b=document.getElementById('pomoBadge');var t=getPomoTodayCount();b.textContent=t>99?'99+':t;b.classList.toggle('s',t>0)}
function getPomoTodayCount(){var logs=pomoGetLogs();var t=new Date().toLocaleDateString('zh-CN');return logs.filter(function(l){return l.date===t}).length}
function pomoGetLogs(){if(data._pomoLog)return data._pomoLog;return []}
function pomoStart(){if(pomo.running){clearInterval(pomo.interval);pomo.running=false;document.getElementById('pomoStartBtn').textContent='鈻?缁х画';pomoFloatHide();updatePomoDisplay();pomoSaveState();return}
  pomo.running=true;document.getElementById('pomoStartBtn').textContent='鈴?鏆傚仠';pomo.date=new Date().toDateString()
  pomo.interval=setInterval(function(){pomo.left--
    updatePomoDisplay()
    if(pomo.left<=0){clearInterval(pomo.interval);pomo.running=false;pomoComplete()}},1000)
  pomoFloatShow();pomoClose();pomoSaveState()}
function pomoFloatShow(){var f=document.getElementById('pomoFloat');f.classList.add('s');f.classList.toggle('r',pomo.sessionType!=='break');f.classList.toggle('break',pomo.sessionType==='break');document.getElementById('pomoBtn').classList.add('r');updatePomoDisplay()}
function pomoFloatHide(){document.getElementById('pomoFloat').classList.remove('s');document.getElementById('pomoBtn').classList.remove('r')}
function pomoComplete(){pomoFloatHide();sleepUpdateDisplay();document.getElementById('pomoStartBtn').textContent='鉁?瀹屾垚'
  var tag=document.getElementById('pomoTagInput').value.trim()
  var now=new Date();var ds=now.toLocaleDateString('zh-CN');var ts=now.toLocaleTimeString()
  if(!data._pomoLog)data._pomoLog=[]
  data._pomoLog.push({date:ds,time:ts,type:pomo.sessionType,label:pomo.label,tag:tag,duration:pomo.time/60})
  try{if(Notification.permission==='granted')new Notification('馃崊 鐣寗瀹屾垚锛?,{body:pomo.label+' 路 '+(pomo.time/60)+'鍒嗛挓',icon:'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2280%22 font-size=%2280%22>馃崊</text></svg>'})}catch(e){}
  try{var ac=new(window.AudioContext||window.webkitAudioContext),o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=880;g.gain.setValueAtTime(.3,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+1);o.start(ac.currentTime);o.stop(ac.currentTime+1)}catch(e){}
  save();pomo.left=pomo.time;updatePomoDisplay();document.getElementById('pomoProgressBar').style.width='0%'
  document.getElementById('pomoTagInput').value=''
  updatePomoBadge();renderPomoRecords();renderPomoStats();renderPomoMstones()
  showToast('鉁?鐣寗 '+pomo.label+' 瀹屾垚锛?);pomoSaveState()}
function pomoReset(){if(pomo.running&&!confirm('閲嶇疆褰撳墠鐣寗锛?))return
  clearInterval(pomo.interval);pomo.running=false;pomo.left=pomo.time;pomoFloatHide()
  document.getElementById('pomoStartBtn').textContent='鈻?寮€濮?;updatePomoDisplay()
  document.getElementById('pomoProgressBar').style.width='0%';pomoSaveState()}
function renderPomoRecords(){var el=document.getElementById('pomoRecordsList');var logs=pomoGetLogs()
  if(!logs.length){el.innerHTML='<div class="pr-empty">鏆傛棤璁板綍锛屽畬鎴愮涓€涓暘鑼勫惂锛?/div>';return}
  el.innerHTML=logs.slice().reverse().slice(0,100).map(function(l){
    var tc=l.type==='break'?'break-r':'';var tn=l.label||'涓撴敞'
    return'<div class="pomo-record"><span class="pr-date">'+esc(l.date)+'</span><span class="pr-time">'+esc(l.time)+'</span><span class="pr-type '+tc+'">'+esc(tn)+'</span><span class="pr-tag">'+(l.tag?esc(l.tag):'')+'</span></div>'
  }).join('')}
function renderPomoStats(){var el=document.getElementById('pomoStatsGrid');var logs=pomoGetLogs()
  var total=logs.length;var today=getPomoTodayCount();var streak=0;var maxStreak=0;var cur=0
  // compute daily streak
  var dayCounts={};logs.forEach(function(l){dayCounts[l.date]=(dayCounts[l.date]||0)+1})
  var sortedDays=Object.keys(dayCounts).sort()
  for(var i=0;i<sortedDays.length;i++){if(i>0){var d1=new Date(sortedDays[i]),d2=new Date(sortedDays[i-1]);var diff=(d1-d2)/86400000;if(diff===1)cur++;else if(diff>1)cur=0}
    else cur=1;maxStreak=Math.max(maxStreak,cur)}
  // week chart
  var weekDays=[];for(var i=6;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);var ds=d.toLocaleDateString('zh-CN');weekDays.push({label:['鏃?,'涓€','浜?,'涓?,'鍥?,'浜?,'鍏?][d.getDay()],date:ds,count:dayCounts[ds]||0})}
  var maxC=Math.max(1,Math.max.apply(null,weekDays.map(function(w){return w.count})))
  el.innerHTML=
    '<div class="pomo-stat-card highlight"><div class="ps-num">'+total+'</div><div class="ps-label">绱鐣寗</div></div>'+
    '<div class="pomo-stat-card highlight"><div class="ps-num">'+today+'</div><div class="ps-label">浠婃棩瀹屾垚</div></div>'+
    '<div class="pomo-stat-card"><div class="ps-num">'+maxStreak+'</div><div class="ps-label">鏈€闀胯繛缁ぉ鏁?/div><div class="ps-sub">'+sortedDays.length+' 澶╂湁璁板綍</div></div>'+
    '<div class="pomo-stat-card"><div class="ps-num">'+(total?Math.round(today/total*100)+'%':'0%')+'</div><div class="ps-label">浠婃棩鍗犳瘮</div></div>'
  var chart=document.getElementById('pomoChart'),cl=document.getElementById('pomoChartLabels')
  chart.innerHTML=weekDays.map(function(w){return'<div class="col" style="height:'+Math.max(3,w.count/maxC*100*0.55)+'px;background:'+(w.count?'rgba(212,165,116,.6)':'rgba(255,255,255,.04)')+'" title="'+w.date+': '+w.count+'涓?><span class="col-tip">'+w.count+'</span></div>'}).join('')
  cl.innerHTML=weekDays.map(function(w){return'<span class="cl">'+(w.count?'鈼?':'鈼?')+w.label+'</span>'}).join('')}
function renderPomoMstones(){var el=document.getElementById('pomoMstoneList');var total=pomoGetLogs().length
  el.innerHTML=POMO_MS.map(function(m){
    var done=total>=m.c
    return'<div class="pomo-mstone'+(done?' done':'')+'"><span class="pm-icon">'+(done?m.i:'鈼?)+'</span><div class="pm-info"><div class="pm-name">'+m.i+' 绱 '+m.n+' 鐣寗</div><div class="pm-prog">'+(done?'宸茶揪鎴?鉁?:'褰撳墠 '+total+'/'+m.c)+'</div></div><div class="pm-prog-bar"><div class="bar" style="width:'+Math.min(100,total/m.c*100)+'%"></div></div>'+(done?'<span class="pm-badge done">鉁?/span>':'<span class="pm-badge">'+Math.round(total/m.c*100)+'%</span>')+'</div>'
  }).join('')}
// ===== Sleep Mode =====
function sleepUpdateDisplay(){var txt=fmtTime(pomo.left)
  var te=document.getElementById('soTimer');te.textContent=txt
  te.className='so-timer'+(pomo.running?' r':'')+(pomo.sessionType==='break'?' break':'')
  document.getElementById('soLabel').textContent=pomo.label||'涓撴敞'
  var pb=document.getElementById('soProgressBar')
  pb.className='bar'+(pomo.running?(pomo.sessionType==='break'?' break':' r'):' idle')
  pb.style.width=((1-pomo.left/pomo.time)*100)+'%'
  document.getElementById('soStartBtn').textContent=pomo.running?'鈴?鏆傚仠':'鈻?寮€濮?}
function sleepEnter(){document.getElementById('sleepOverlay').classList.add('s')
  document.getElementById('soTagInput').value=document.getElementById('pomoTagInput').value
  sleepUpdateDisplay()
  if(pomo.running)pomoFloatHide()
  pomoClose()}
function sleepExit(){document.getElementById('sleepOverlay').classList.remove('s')
  document.getElementById('pomoTagInput').value=document.getElementById('soTagInput').value
  if(pomo.running){pomoFloatShow();updatePomoDisplay()}}
function soStart(){if(pomo.running){clearInterval(pomo.interval);pomo.running=false;updatePomoDisplay();sleepUpdateDisplay();pomoSaveState();return}
  pomo.running=true;pomo.date=new Date().toDateString()
  clearInterval(pomo.interval)
  pomo.interval=setInterval(function(){pomo.left--;updatePomoDisplay();sleepUpdateDisplay()
    if(pomo.left<=0){clearInterval(pomo.interval);pomo.running=false;pomoComplete()}},1000)
  pomoClose();sleepUpdateDisplay();pomoSaveState()}
function soReset(){if(pomo.running&&!confirm('閲嶇疆褰撳墠鐣寗锛?))return
  clearInterval(pomo.interval);pomo.running=false;pomo.left=pomo.time;updatePomoDisplay();sleepUpdateDisplay()
  document.getElementById('pomoStartBtn').textContent='鈻?寮€濮?;document.getElementById('pomoProgressBar').style.width='0%';pomoSaveState()}
// ===== Draggable Floating Timer =====
(function(){var f=document.getElementById('pomoFloat'),d=false,ox,oy
  f.addEventListener('mousedown',function(e){if(e.button!==0)return;d=true
    var r=f.getBoundingClientRect()
    ox=e.clientX-r.left;oy=e.clientY-r.top
    f.style.left=r.left+'px';f.style.top=r.top+'px'
    f.style.right='auto';f.style.bottom='auto'
    f.classList.add('dragging')})
  document.addEventListener('mousemove',function(e){if(!d)return
    f.style.left=(e.clientX-ox)+'px';f.style.top=(e.clientY-oy)+'px'})
  document.addEventListener('mouseup',function(){if(!d)return;d=false;f.classList.remove('dragging')
    pomoSavePos()})})()
function pomoSavePos(){var f=document.getElementById('pomoFloat');var l=parseInt(f.style.left);var t=parseInt(f.style.top)
  if(l||t)try{localStorage.setItem('phd_v4_pomo_pos',JSON.stringify({l:l,t:t}))}catch(e){}}
function pomoLoadPos(){try{var s=localStorage.getItem('phd_v4_pomo_pos');if(!s)return;var p=JSON.parse(s);var f=document.getElementById('pomoFloat');if(p.l||p.t){f.style.left=p.l+'px';f.style.top=p.t+'px';f.style.right='auto';f.style.bottom='auto'}}catch(e){}}
// Pomodoro UI bindings
document.getElementById('pomoBtn').addEventListener('click',function(){pomoOpen()})
document.getElementById('pomoOverlay').addEventListener('click',pomoClose)
document.getElementById('pomoClose').addEventListener('click',pomoClose)
document.getElementById('pomoStartBtn').addEventListener('click',pomoStart)
document.getElementById('pomoResetBtn').addEventListener('click',pomoReset)
document.getElementById('sleepEntryBtn').addEventListener('click',sleepEnter)
document.getElementById('pfSleepBtn').addEventListener('click',function(e){e.stopPropagation();sleepEnter()})
document.getElementById('sleepOverlay').addEventListener('click',function(e){if(e.target===this||e.target.closest('.so-hint'))sleepExit()})
document.getElementById('soStartBtn').addEventListener('click',function(e){e.stopPropagation();soStart()})
document.getElementById('soResetBtn').addEventListener('click',function(e){e.stopPropagation();soReset()})
document.getElementById('soTagInput').addEventListener('keydown',function(e){e.stopPropagation()})
document.getElementById('soTagInput').addEventListener('input',function(){document.getElementById('pomoTagInput').value=this.value})
// Tab switching
document.querySelectorAll('.pomo-tab').forEach(function(tab){
  tab.addEventListener('click',function(){
    document.querySelectorAll('.pomo-tab').forEach(function(t){t.classList.remove('s')})
    tab.classList.add('s')
    var target=tab.dataset.ptab
    document.querySelectorAll('.pomo-body').forEach(function(b){b.style.display='none'})
    var el=document.getElementById('pomoTab'+target.charAt(0).toUpperCase()+target.slice(1))
    if(el){el.style.display='flex'}
    if(target==='records')renderPomoRecords()
    if(target==='stats')renderPomoStats()
    if(target==='milestones')renderPomoMstones()
  })
})

// Session type buttons
document.querySelectorAll('.pomo-type').forEach(function(btn){
  btn.addEventListener('click',function(){pomoSetType(btn)})
})
// Keyboard: Escape to close
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(document.getElementById('sleepOverlay').classList.contains('s'))sleepExit();else if(document.getElementById('pomoModal').classList.contains('s'))pomoClose();else if(document.getElementById('housingOverlay')&&document.getElementById('housingOverlay').classList.contains('s')){var ce=document.getElementById('housingClose');if(ce)ce.click()}else if(document.getElementById('ucOverlay')&&document.getElementById('ucOverlay').classList.contains('s')){var ce=document.getElementById('ucClose');if(ce)ce.click()}}})
try{pomoLoad()}catch(e){}try{pomoLoadPos}catch(e){}

// ======================== FEATURE: Milestone Timeline ========================
function renderMilestones(cid){var area=document.getElementById('ms-'+cid);if(!area)return;var ms=data._milestones||{};var list=ms[cid]||[]
  area.innerHTML='<div class="ms-line">'
  if(!list.length)area.innerHTML+='<div style="color:var(--muted);font-size:.55rem;padding:.2rem 0">鏆傛棤閲岀▼纰戯紝鐐瑰嚮 + 娣诲姞</div>'
  else{list.forEach(function(m,i){
    var cls='ms-dot'+(m.done?' done':'')+(m.type>1?' ms-'+m.type:'')
    var label=m.label||'M'+(i+1);var dateStr=m.date||''
    area.innerHTML+='<div class="ms-track"><div class="'+cls+'" title="'+esc(label)+'"></div><div class="ms-date">'+esc(dateStr)+'</div><div class="ms-label">'+esc(label)+'</div></div>'
  })}
  area.innerHTML+='<button class="ms-add" id="msAdd-'+cid+'" title="娣诲姞閲岀▼纰?>+</button></div>'
  document.getElementById('msAdd-'+cid).onclick=function(){addMilestone(cid)}}
function addMilestone(cid){var label=prompt('閲岀▼纰戝悕绉帮細');if(!label||!label.trim())return
  var date=prompt('鏃ユ湡锛堝 2026-06锛夛細')||''
  if(!data._milestones)data._milestones={};if(!data._milestones[cid])data._milestones[cid]=[]
  data._milestones[cid].push({label:label.trim(),date:date,done:false,type:1});save();renderMilestones(cid)}
function initMilestones(){if(!data._milestones)data._milestones={}
  ;['y1','y2','y3','y4','y5'].forEach(function(cid){if(!data._milestones[cid])data._milestones[cid]=[]})}

// ======================== FEATURE: Full Text Search ========================
function searchOpen(){document.getElementById('searchOverlay').classList.add('s');document.getElementById('searchPanel').classList.add('s')
  setTimeout(function(){document.getElementById('searchInput').focus()},100)}
function searchClose(){document.getElementById('searchOverlay').classList.remove('s');document.getElementById('searchPanel').classList.remove('s')
  document.getElementById('searchInput').value='';document.getElementById('searchResults').innerHTML='';document.getElementById('searchCount').textContent=''}
function searchDo(q){q=q.trim().toLowerCase();var res=document.getElementById('searchResults'),cnt=document.getElementById('searchCount')
  if(!q){res.innerHTML='';cnt.textContent='';return}
  var hits=[];Object.keys(data).filter(function(k){return k.match(/^y[1-5]/)}).forEach(function(cid){
    var yearLabel=cid.replace('y','绗?).replace('1','涓€').replace('2','浜?).replace('3','涓?).replace('4','鍥?).replace('5','浜?)+'骞?
    ;(data[cid]||[]).forEach(function(w,wi){
      var wNum=wi+1;(w.d||w.days||[]).forEach(function(d,di){
        var txt=typeof d==='object'?d.text:d||'';if(txt.toLowerCase().includes(q)){var dayNames=['鍛ㄤ竴','鍛ㄤ簩','鍛ㄤ笁','鍛ㄥ洓','鍛ㄤ簲','鍛ㄥ叚','鍛ㄦ棩'];hits.push({loc:yearLabel+' 绗?+wNum+'鍛?'+dayNames[di],text:txt,cid:cid,wi:wi,di:di})}})
      if(w.summary&&w.summary.toLowerCase().includes(q))hits.push({loc:yearLabel+' 绗?+wNum+'鍛?鎬荤粨',text:w.summary,cid:cid,wi:wi,di:-1})
    })})
  // Search OKRs
  var okrs=data._okrs||{};Object.keys(okrs).forEach(function(cid){var yearLabel=cid.replace('y','绗?).replace('1','涓€').replace('2','浜?).replace('3','涓?).replace('4','鍥?).replace('5','浜?);(okrs[cid]||[]).forEach(function(o,i){if(o.text.toLowerCase().includes(q))hits.push({loc:yearLabel+' KR'+(i+1),text:o.text,cid:cid,wi:-1,di:-2})})})
  // Search journal
  var jrn=data._journal||{};Object.keys(jrn).forEach(function(key){var parts=key.split('-w');var cid=parts[0];var wi=parseInt(parts[1])||0;var yearLabel=cid.replace('y','绗?).replace('1','涓€').replace('2','浜?).replace('3','涓?).replace('4','鍥?).replace('5','浜?)+'骞?;Object.keys(jrn[key]).forEach(function(di){var v=jrn[key][di];if(v&&v.toLowerCase().includes(q))hits.push({loc:yearLabel+' 鍛ㄩ殢绗?,text:v,cid:cid,wi:wi,di:parseInt(di)})})})
  // Search milestones
  var ms=data._milestones||{};Object.keys(ms).forEach(function(cid){(ms[cid]||[]).forEach(function(m,i){if(m.label&&m.label.toLowerCase().includes(q))hits.push({loc:cid.replace('y','绗?).replace('1','涓€').replace('2','浜?).replace('3','涓?).replace('4','鍥?).replace('5','浜?)+'骞?閲岀▼纰?,text:m.label,cid:cid,wi:-1,di:-3})})})
  cnt.textContent=hits.length+' 鏉＄粨鏋?
  if(!hits.length){res.innerHTML='<div class="sh-empty">鏈壘鍒板尮閰?"'+esc(q)+'"</div>';return}
  res.innerHTML=hits.slice(0,50).map(function(h){
    var idx=h.text.toLowerCase().indexOf(q),start=Math.max(0,idx-20),end=Math.min(h.text.length,idx+q.length+30)
    var ctx=esc(h.text.slice(start,end)).replace(new RegExp(esc(q),'gi'),'<em>$&</em>')
    return'<div class="search-hit" data-cid="'+h.cid+'" data-wi="'+h.wi+'" data-di="'+h.di+'"><div class="sh-loc">'+esc(h.loc)+'</div><div class="sh-text">'+ctx+'</div></div>'
  }).join('')
  res.querySelectorAll('.search-hit').forEach(function(el){el.onclick=function(){searchGoTo(el.dataset.cid,parseInt(el.dataset.wi),parseInt(el.dataset.di))}})}
function searchGoTo(cid,wi,di){searchClose()
  var sec=document.getElementById(cid);if(sec)sec.scrollIntoView({behavior:'smooth',block:'start'})
  if(wi>=0){var body=document.getElementById('plan-body-'+cid+'-academic');if(body&&!body.classList.contains('o')){var t=body.closest('.tc')||body.previousElementSibling;if(t&&t.classList.contains('wt'))t.click()}
    setTimeout(function(){var weeks=document.querySelectorAll('#plan-body-'+cid+'-academic .week');if(weeks[wi])weeks[wi].scrollIntoView({behavior:'smooth',block:'center'})},400)}}

// ===== Non-critical init wrapped in try/catch to not break feature bindings =====
try{
// Left sidebar toggle
(function(){
  var bar = document.getElementById('leftBar');
  var btn = document.getElementById('lbToggle');
  if(bar && btn){
    if(localStorage.getItem('_leftBarCollapsed')==='1'){
      bar.classList.remove('s');
      document.body.classList.remove('sb');
    }
    btn.textContent = bar.classList.contains('s') ? '鈼€' : '鈻?;
    btn.addEventListener('click', function(){
      bar.classList.toggle('s');
      document.body.classList.toggle('sb');
      btn.textContent = bar.classList.contains('s') ? '鈼€' : '鈻?;
      try { localStorage.setItem('_leftBarCollapsed', bar.classList.contains('s') ? '0' : '1'); } catch(e){}
    });
  }
})();
// Search bindings (null-safe: search elements may not exist in HTML)
var searchOv=document.getElementById('searchOverlay'),searchInp=document.getElementById('searchInput'),searchCl=document.getElementById('searchClose')
if(searchOv)searchOv.onclick=searchClose
if(searchCl)searchCl.onclick=searchClose
if(searchInp){searchInp.addEventListener('input',function(){searchDo(this.value)});searchInp.addEventListener('keydown',function(e){if(e.key==='Escape')searchClose()})}
}catch(e){console.error('Sidebar/search init error:',e)}

// ===== Help Modal =====
function helpOpen(){document.getElementById('helpOverlay').classList.add('s');document.getElementById('helpModal').classList.add('s')}
function helpClose_(){document.getElementById('helpOverlay').classList.remove('s');document.getElementById('helpModal').classList.remove('s')}

// ===== Settings =====
var _SETTINGS_CFG={
  fontSize:[13,15,17,20],
  fontFamily:[
    "'STSong','鍗庢枃瀹嬫シ','Songti SC','Noto Serif CJK SC',serif",
    "'STSong','鍗庢枃瀹嬫シ','Songti SC','Noto Serif CJK SC',serif",
    "'PingFang SC','Microsoft YaHei','Noto Sans CJK SC',sans-serif",
    "'Cascadia Code','SF Mono','Consolas',monospace"
  ],
  lineHeight:[1.4,1.6,1.9],
  pageWidth:[90,95,98]
}
function applySettings(s){
  var root=document.documentElement
  var fs = s.fontSizeCustom ? parseFloat(s.fontSizeCustom) : _SETTINGS_CFG.fontSize[s.fontSize]
  if (!isNaN(fs) && fs>0) root.style.setProperty('--font-size-root',fs+'px')
  var ff = s.fontFamilyCustom || _SETTINGS_CFG.fontFamily[s.fontFamily]
  root.style.setProperty('--font-family-body',ff)
  root.style.setProperty('--font-serif', "'Fraunces',Georgia,'Songti SC','Noto Serif SC',serif");
  root.style.setProperty('--font-ui', "'Space Grotesk','Segoe UI','PingFang SC','Microsoft YaHei',sans-serif");
  root.style.setProperty('--font-data', "Georgia,'STSong','Noto Serif SC',serif");
  root.style.setProperty('--font-mono', "'Cascadia Code','SF Mono','Consolas',monospace");
  root.style.setProperty('--font-label', "-apple-system,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif");
  var lh = s.lineHeightCustom ? parseFloat(s.lineHeightCustom) : _SETTINGS_CFG.lineHeight[s.lineHeight]
  if (!isNaN(lh) && lh>0) root.style.setProperty('--line-height-base',lh)
  var pw = _SETTINGS_CFG.pageWidth[s.pageWidth]
  if(pw)root.style.setProperty('--page-width',pw+'vw')
}
function stgHighlight(grp,v){
  document.querySelectorAll('#stg'+grp+' .stg-btn').forEach(function(b){b.classList.toggle('a',parseInt(b.dataset.v)===v)})
}
function stgOpen(){
  var s=data._settings||{fontSize:1,fontFamily:0,lineHeight:1,pageWidth:0}
  stgHighlight('FontSize',s.fontSize)
  stgHighlight('FontFamily',s.fontFamily)
  stgHighlight('LineHeight',s.lineHeight)
  stgHighlight('PageWidth',s.pageWidth)
  document.getElementById('stgFontSizeCustom').value=s.fontSizeCustom||''
  document.getElementById('stgFontFamilyCustom').value=s.fontFamilyCustom||''
  document.getElementById('stgLineHeightCustom').value=s.lineHeightCustom||''
  document.getElementById('stgOverlay').classList.add('s')
  document.getElementById('stgModal').classList.add('s')
}

// ===== Settings Init =====
try{
document.getElementById('helpBtn').onclick=helpOpen
document.getElementById('helpOverlay').onclick=helpClose_
document.getElementById('helpClose').onclick=helpClose_
// Academic modal handled by feature-academic.js
// (merged: paper + experiment + literature)

// ====== DEAD CODE: initMapApp and below (map globe removed from UI) ======
function initMapApp(){
  if(mapApp){mapApp.render();return}
  var modal=document.getElementById('mapModal'), body=document.getElementById('mapBody');
  if(!modal||!body)return;
  var titleEl=modal.querySelector('.map-header h3'), closeEl=document.getElementById('mapClose');
  if(titleEl)titleEl.textContent='涓栫晫鍦板浘';
  if(closeEl)closeEl.textContent='脳';
  body.innerHTML='<div class="map-app copied-map"><header class="copied-map-topbar" id="topbar"><div class="copied-map-logo">馃實</div><div class="copied-map-title">Map<span>Notes</span></div><div class="page-tabs"><button class="page-tab active" data-page="world">涓栫晫鍦板浘</button></div><div class="copied-map-zoom"><button id="mapZoomIn" title="鏀惧ぇ">+</button><button id="mapZoomOut" title="缂╁皬">鈭?/button><button id="mapZoomReset" title="閲嶇疆">鈱?/button></div></header><div class="copied-map-main"><div class="copied-map-pages"><div class="map-page active" id="page-world"><div id="globe-wrap"><div id="globe-3d" aria-label="鍙棆杞殑涓夌淮涓栫晫鍦板浘"></div><svg id="globe-svg" class="globe-fallback" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet"></svg></div></div><div id="tooltip"><div class="tt-name" id="tt-name"></div><div class="tt-sub" id="tt-sub"></div></div><div class="map-status"><span>涓栫晫鍦板浘鍙嫋鎷芥棆杞€佹粴杞缉鏀撅紱鎮仠鏌ョ湅鏃堕棿鍜屽熀鏈俊鎭紝鐐瑰嚮鍥藉缂栬緫澶囨敞</span><span>澶囨敞鑷姩淇濆瓨鍦ㄦ湰鍦?/span></div></div><aside class="copied-map-note"><div class="map-note-kicker" id="mapScope">World</div><div class="map-note-title" id="mapSelected">璇烽€夋嫨涓€涓浗瀹?/div><div class="map-note-meta" id="mapMeta">榧犳爣鏀惧湪鍦板浘鍖哄煙涓婁細鏄剧ず褰撳湴鏃堕棿鍜屽熀鏈俊鎭紱鐐瑰嚮鍚庡彲鍦ㄨ繖閲岃褰曟椂闂淬€佷簨浠躲€佹櫙鐐广€佽鍒掔瓑銆?/div><div class="map-note-form"><label>鏃堕棿<input id="mapNoteTime" type="text" placeholder="渚嬪锛?026-10-01 / 涓婂崍 / 绗?鍛?></label><label>浜嬩欢<textarea id="mapNoteEvent" placeholder="鍙戠敓浜嗕粈涔堬紝鎴栨墦绠楀仛浠€涔?></textarea></label><label>鏅偣<textarea id="mapNotePlace" placeholder="鎯冲幓鐨勫煄甯傘€佹櫙鐐广€佽矾绾?></textarea></label><label>璁″垝<textarea id="mapNotePlan" placeholder="浜ら€氥€侀绠椼€佸緟鍔炪€佽祫鏂欓摼鎺?></textarea></label><div class="map-note-actions"><button class="map-note-btn primary" id="mapNoteSave">淇濆瓨褰撳墠椤?/button><button class="map-note-btn" id="mapNoteNew">鏂板涓€椤?/button><button class="map-note-btn" id="mapNoteClear">鍒犻櫎褰撳墠椤?/button></div></div><div class="map-note-list" id="mapNoteList"></div></aside></div></div>';

  var tabs=[].slice.call(document.querySelectorAll('.map-tab'));
  var pageTabs=[].slice.call(body.querySelectorAll('.page-tab'));
  var worldSvg=document.getElementById('globe-svg'), globeHost=document.getElementById('globe-3d'), globeRenderer=null, globeUnavailable=false, svg=worldSvg, tip=document.getElementById('tooltip'), ttName=document.getElementById('tt-name'), ttSub=document.getElementById('tt-sub');
  var selectedTitle=document.getElementById('mapSelected'), scopeEl=document.getElementById('mapScope'), metaEl=document.getElementById('mapMeta');
  var inputTime=document.getElementById('mapNoteTime'), inputEvent=document.getElementById('mapNoteEvent'), inputPlace=document.getElementById('mapNotePlace'), inputPlan=document.getElementById('mapNotePlan'), listEl=document.getElementById('mapNoteList');
  var current='world', selected=null, notes=loadNotes(), notePage=0;
  var baseViews={world:{x:0,y:40,w:1000,h:540},worldFull:{x:0,y:0,w:1000,h:560}};
  var views={world:{x:0,y:40,w:1000,h:540}};
  var worldRegions=[
    {id:'world:CN',name:'涓浗',tz:'Asia/Shanghai',info:'涓滀簹鍥藉锛岄閮藉寳浜€?,pop:'绾?4浜?,points:[[690,210],[735,200],[790,220],[805,260],[780,305],[720,315],[670,285],[660,240]]},
    {id:'world:US',name:'缇庡浗',tz:'America/New_York',info:'鍖楃編鍥藉锛岄閮藉崕鐩涢】銆?,pop:'绾?.3浜?,points:[[160,205],[250,175],[320,205],[305,260],[245,295],[170,270]]},
    {id:'world:CA',name:'鍔犳嬁澶?,tz:'America/Toronto',info:'鍖楃編鍖楅儴鍥藉锛岄閮芥弗澶崕銆?,pop:'绾?000涓?,points:[[130,105],[285,80],[350,125],[310,175],[165,190],[90,145]]},
    {id:'world:BR',name:'宸磋タ',tz:'America/Sao_Paulo',info:'鍗楃編鏈€澶у浗瀹讹紝棣栭兘宸磋タ鍒╀簹銆?,pop:'绾?.1浜?,points:[[315,330],[375,335],[430,390],[405,485],[345,505],[300,435]]},
    {id:'world:GB',name:'鑻卞浗',tz:'Europe/London',info:'娆ф床宀涘浗锛岄閮戒鸡鏁︺€?,pop:'绾?700涓?,points:[[485,165],[505,150],[525,170],[515,200],[490,195]]},
    {id:'world:FR',name:'娉曞浗',tz:'Europe/Paris',info:'瑗挎鍥藉锛岄閮藉反榛庛€?,pop:'绾?800涓?,points:[[510,205],[545,205],[560,235],[535,260],[505,245]]},
    {id:'world:DE',name:'寰峰浗',tz:'Europe/Berlin',info:'涓鍥藉锛岄閮芥煆鏋椼€?,pop:'绾?400涓?,points:[[548,185],[585,185],[595,220],[565,240],[540,220]]},
    {id:'world:RU',name:'淇勭綏鏂?,tz:'Europe/Moscow',info:'妯法娆т簹澶ч檰锛岄閮借帿鏂銆?,pop:'绾?.4浜?,points:[[585,105],[860,80],[950,135],[900,205],[720,190],[600,165]]},
    {id:'world:IN',name:'鍗板害',tz:'Asia/Kolkata',info:'鍗椾簹鍥藉锛岄閮芥柊寰烽噷銆?,pop:'绾?4浜?,points:[[650,300],[700,290],[725,345],[690,405],[655,360]]},
    {id:'world:JP',name:'鏃ユ湰',tz:'Asia/Tokyo',info:'涓滀簹宀涘浗锛岄閮戒笢浜€?,pop:'绾?.2浜?,points:[[845,230],[870,245],[858,285],[835,270]]},
    {id:'world:AU',name:'婢冲ぇ鍒╀簹',tz:'Australia/Sydney',info:'澶ф磱娲插浗瀹讹紝棣栭兘鍫煿鎷夈€?,pop:'绾?600涓?,points:[[760,425],[850,415],[905,465],[875,520],[785,510],[735,470]]},
    {id:'world:ZA',name:'鍗楅潪',tz:'Africa/Johannesburg',info:'闈炴床鍗楃鍥藉锛岃鏀块閮芥瘮鍕掗檧鍒╀簹銆?,pop:'绾?000涓?,points:[[530,455],[595,455],[620,500],[570,525],[520,500]]},
    {id:'world:EG',name:'鍩冨強',tz:'Africa/Cairo',info:'涓滃寳闈炲浗瀹讹紝棣栭兘寮€缃椼€?,pop:'绾?.1浜?,points:[[560,275],[615,270],[630,315],[590,340],[555,315]]}
  ];
  var worldFullRegions=null, worldLoading=false;
  var countryNames={'004':'闃垮瘜姹?,'008':'闃垮皵宸村凹浜?,'012':'闃垮皵鍙婂埄浜?,'024':'瀹夊摜鎷?,'032':'闃挎牴寤?,'036':'婢冲ぇ鍒╀簹','040':'濂ュ湴鍒?,'050':'瀛熷姞鎷夊浗','056':'姣斿埄鏃?,'076':'宸磋タ','124':'鍔犳嬁澶?,'156':'涓浗','250':'娉曞浗','276':'寰峰浗','356':'鍗板害','360':'鍗板害灏艰タ浜?,'392':'鏃ユ湰','410':'闊╁浗','484':'澧ㄨタ鍝?,'643':'淇勭綏鏂?,'710':'鍗楅潪','826':'鑻卞浗','840':'缇庡浗'};
  function loadNotes(){try{return JSON.parse(localStorage.getItem('_mapNotesV2')||'{}')}catch(e){return {}}}
  function saveNotes(){localStorage.setItem('_mapNotesV2',JSON.stringify(notes))}
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function pathFrom(points){return points.map(function(p,i){return (i?'L':'M')+p[0]+' '+p[1]}).join(' ')+' Z'}
  function getTime(r){try{return new Date().toLocaleString('zh-CN',{timeZone:r.tz||'Asia/Shanghai',hour12:false,month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(e){return new Date().toLocaleString('zh-CN',{hour12:false})}}
  function colorFor(i,total){return i%3===0?'var(--bg2)':(i%3===1?'var(--bg3)':'color-mix(in srgb,var(--bg2) 72%,var(--accent))')}
  function setView(target, view){worldSvg.setAttribute('viewBox',view.x+' '+view.y+' '+view.w+' '+view.h)}
  function baseViewFor(target){return worldFullRegions?baseViews.worldFull:baseViews.world}
  function syncBase(target){var b=baseViewFor(target);var v=views[target];if(!v||Math.abs((v.baseW||0)-b.w)>1||Math.abs((v.baseH||0)-b.h)>1){views[target]={x:b.x,y:b.y,w:b.w,h:b.h,baseW:b.w,baseH:b.h}}}
  function zoomMap(target, factor){syncBase(target);var v=views[target], minW=220, maxW=baseViewFor(target).w;var nw=Math.max(minW,Math.min(maxW,v.w*factor));var nh=nw*(v.h/v.w);if(nh>baseViewFor(target).h){nh=baseViewFor(target).h;nw=nh*(v.w/v.h)}var cx=v.x+v.w/2,cy=v.y+v.h/2;v.x=cx-nw/2;v.y=cy-nh/2;v.w=nw;v.h=nh;setView(target,v)}
  function resetMapZoom(target){var b=baseViewFor(target);views[target]={x:b.x,y:b.y,w:b.w,h:b.h,baseW:b.w,baseH:b.h};setView(target,views[target])}
  function render(){
    var data=worldFullRegions||worldRegions;
    current='world';
    scopeEl.textContent='World';
    svg=worldSvg;
    body.querySelectorAll('.map-page').forEach(function(p){p.classList.remove('active')});
    var page=document.getElementById('page-world');
    if(page)page.classList.add('active');
    if(worldFullRegions&&window.d3){renderWorldFull(data);return}
    if(!worldFullRegions&&!worldLoading)ensureWorldData();
    syncBase(current);
    setView(current,views[current]);
    var grid='';
    for(var x=100;x<1000;x+=100)grid+='<path class="map-graticule" d="M'+x+' 40 L'+x+' 580"/>';
    for(var y=100;y<600;y+=80)grid+='<path class="map-graticule" d="M0 '+y+' L1000 '+y+'"/>';
    svg.innerHTML='<rect x="-20" y="20" width="1040" height="620" fill="var(--bg3)"/>'+grid+data.map(function(r,i){var sel=selected&&selected.id===r.id?' selected':'';return '<path class="country-path'+sel+'" data-id="'+r.id+'" d="'+pathFrom(r.points)+'" fill="'+colorFor(i,data.length)+'" opacity=".9"></path>'}).join('');
    svg.querySelectorAll('.country-path').forEach(function(el){
      el.addEventListener('mouseenter',onHover);
      el.addEventListener('mousemove',moveTip);
      el.addEventListener('mouseleave',hideTip);
      el.addEventListener('click',function(){selectRegion(findRegion(el.dataset.id))});
    });
    if(!selected)selectRegion(data[0],true); else renderPanel();
  }
  function loadScript(src){return new Promise(function(resolve,reject){var old=document.querySelector('script[src="'+src+'"]');if(old){resolve();return}var s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  function ensureWorldData(){
    worldLoading=true;
    Promise.resolve()
      .then(function(){return window.d3?null:loadScript('https://cdn.jsdelivr.net/npm/d3@7')})
      .then(function(){return window.topojson?null:loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3')})
      .then(function(){return fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')})
      .then(function(r){return r.json()})
      .then(function(topology){
        var features=topojson.feature(topology,topology.objects.countries).features;
        worldFullRegions=features.map(function(f){
          var raw=String(f.id||'');
          while(raw.length<3)raw='0'+raw;
          var nm=(f.properties&&f.properties.name)||countryNames[raw]||('鍥藉 '+raw);
          return {id:'world:'+raw,name:nm,tz:tzForCountry(raw),info:'涓栫晫鍦板浘鍥藉/鍦板尯杈圭晫銆傛暟鎹潵鑷?world-atlas 鍏紑 TopoJSON銆?,pop:'--',feature:f};
        });
        worldLoading=false;
        if(current==='world'){selected=null;render()}
      })
      .catch(function(){worldLoading=false});
  }
  function tzForCountry(id){return {'156':'Asia/Shanghai','840':'America/New_York','124':'America/Toronto','076':'America/Sao_Paulo','826':'Europe/London','250':'Europe/Paris','276':'Europe/Berlin','643':'Europe/Moscow','356':'Asia/Kolkata','392':'Asia/Tokyo','036':'Australia/Sydney','710':'Africa/Johannesburg','818':'Africa/Cairo'}[id]||'UTC'}
  function ensureGlobe(){
    if(globeUnavailable)return false;
    if(globeRenderer){globeRenderer.resize();globeRenderer.renderTheme();return true}
    if(!window.MapGlobeRenderer||!globeHost)return false;
    try{
      globeRenderer=window.MapGlobeRenderer.create({
        container:globeHost,
        onHover:function(region,x,y){showRegionTip(region,x,y)},
        onLeave:hideTip,
        onSelect:function(region){selectRegion(region)}
      });
      if(!globeRenderer){globeUnavailable=true;return false}
      return true;
    }catch(e){console.warn('3D globe unavailable',e);globeUnavailable=true;return false}
  }
  function renderWorldFull(data){
    if(ensureGlobe()){
      worldSvg.style.display='none';
      globeHost.style.display='block';
      globeRenderer.setRegions(data);
      if(!selected){selected=data.filter(function(r){return r.id==='world:156'})[0]||data[0];notePage=0}
      globeRenderer.setSelected(selected);
      renderPanel();
      return;
    }
    globeHost.style.display='none';
    worldSvg.style.display='block';
    svg=worldSvg;
    syncBase('world');
    setView('world',views.world);
    var fc={type:'FeatureCollection',features:data.map(function(r){return r.feature})};
    var projection=d3.geoNaturalEarth1().fitSize([980,520],fc).translate([500,285]);
    var path=d3.geoPath(projection);
    var graticule=d3.geoGraticule10();
    svg.innerHTML='<rect x="0" y="0" width="1000" height="560" fill="var(--bg3)"/><path class="map-graticule" d="'+path(graticule)+'"/>'+data.map(function(r,i){var sel=selected&&selected.id===r.id?' selected':'';return '<path class="country-path'+sel+'" data-id="'+r.id+'" d="'+path(r.feature)+'" fill="'+colorFor(i,data.length)+'" opacity=".88"></path>'}).join('');
    svg.querySelectorAll('.country-path').forEach(function(el){el.addEventListener('mouseenter',onHover);el.addEventListener('mousemove',moveTip);el.addEventListener('mouseleave',hideTip);el.addEventListener('click',function(){selectRegion(findRegion(el.dataset.id))})});
    if(!selected)selectRegion(data.filter(function(r){return r.id==='world:156'})[0]||data[0],true); else renderPanel();
  }
  function findRegion(id){return (worldFullRegions||worldRegions).filter(function(r){return r.id===id})[0]}
  function noteListFor(r){
    if(!r)return [];
    var raw=notes[r.id];
    if(!raw)return [];
    if(Array.isArray(raw))return raw;
    return [raw];
  }
  function setNoteList(r,list){if(!r)return;if(list&&list.length)notes[r.id]=list;else delete notes[r.id]}
  function currentNoteFor(r){var list=noteListFor(r);if(notePage>=list.length)notePage=Math.max(0,list.length-1);return list[notePage]||{}}
  function showRegionTip(r,x,y){if(!r)return;var list=noteListFor(r), n=list[0]||{};ttName.textContent=r.name;ttSub.innerHTML='褰撳湴鏃堕棿锛?+esc(getTime(r))+'<br>'+esc(r.info)+'<br>浜哄彛锛?+esc(r.pop||'--')+(n.time?'<br>澶囨敞鏃堕棿锛?+esc(n.time):'')+(list.length?'<br>澶囨敞锛?+list.length+' 鏉?:'');tip.classList.add('visible');moveTip({clientX:x,clientY:y})}
  function onHover(e){showRegionTip(findRegion(e.currentTarget.dataset.id),e.clientX,e.clientY)}
  function moveTip(e){var box=body.getBoundingClientRect();tip.style.left=(e.clientX-box.left+12)+'px';tip.style.top=(e.clientY-box.top+12)+'px'}
  function hideTip(){tip.classList.remove('visible')}
  function selectRegion(r,silent){if(!r)return;selected=r;notePage=0;if(current==='world'&&globeRenderer){globeRenderer.setSelected(r);renderPanel();return}renderPanel();if(!silent)render()}
  function renderPanel(){
    var list=noteListFor(selected);
    var n=currentNoteFor(selected);
    selectedTitle.textContent=selected?selected.name:'璇烽€夋嫨涓€涓浗瀹?;
    metaEl.innerHTML=selected?('褰撳湴鏃堕棿锛?+esc(getTime(selected))+'<br>鍩烘湰淇℃伅锛?+esc(selected.info)+'<br>浜哄彛锛?+esc(selected.pop||'--')):'鐐瑰嚮鍦板浘鍚庣紪杈戝娉ㄣ€?;
    inputTime.value=n.time||'';inputEvent.value=n.event||'';inputPlace.value=n.place||'';inputPlan.value=n.plan||'';
    var has=n.time||n.event||n.place||n.plan;
    if(list.length){
      listEl.innerHTML='<div class="map-note-pager"><button class="map-note-btn" id="mapNotePrev">涓婁竴椤?/button><span class="map-note-count">'+(notePage+1)+' / '+list.length+'</span><button class="map-note-btn" id="mapNoteNext">涓嬩竴椤?/button></div>'+
        (has?('<div class="map-note-item"><strong>澶囨敞 '+(notePage+1)+'</strong>'+(n.time?'鏃堕棿锛?+esc(n.time)+'<br>':'')+(n.event?'浜嬩欢锛?+esc(n.event)+'<br>':'')+(n.place?'鏅偣锛?+esc(n.place)+'<br>':'')+(n.plan?'璁″垝锛?+esc(n.plan):'')+'</div>'):'<div class="map-note-empty">杩欎竴椤佃繕鏄┖鐧斤紝鍙互鍦ㄤ笂鏂圭紪杈戝悗淇濆瓨銆?/div>');
      document.getElementById('mapNotePrev').onclick=function(){notePage=(notePage-1+list.length)%list.length;renderPanel()};
      document.getElementById('mapNoteNext').onclick=function(){notePage=(notePage+1)%list.length;renderPanel()};
    }else{
      listEl.innerHTML='<div class="map-note-empty">杩欓噷杩樻病鏈夊娉ㄣ€傚彲浠ュ啓鏃堕棿銆佷簨浠躲€佹櫙鐐广€佽鍒掋€佽矾绾挎垨鍏跺畠鎯虫硶锛涢渶瑕佸鏉℃椂鐐瑰嚮鈥滄柊澧炰竴椤碘€濄€?/div>';
    }
  }
  function readNoteForm(){return {time:inputTime.value.trim(),event:inputEvent.value.trim(),place:inputPlace.value.trim(),plan:inputPlan.value.trim(),updatedAt:new Date().toISOString()}}
  document.getElementById('mapNoteSave').onclick=function(){if(!selected)return;var list=noteListFor(selected).slice();if(!list.length)list.push({});list[notePage]=readNoteForm();setNoteList(selected,list);saveNotes();renderPanel();toast('鍦板浘澶囨敞宸蹭繚瀛?)};
  document.getElementById('mapNoteNew').onclick=function(){if(!selected)return;var list=noteListFor(selected).slice();list.push({time:'',event:'',place:'',plan:'',updatedAt:new Date().toISOString()});notePage=list.length-1;setNoteList(selected,list);saveNotes();renderPanel();toast('宸叉柊澧炰竴椤靛湴鍥惧娉?)};
  document.getElementById('mapNoteClear').onclick=function(){if(!selected)return;var list=noteListFor(selected).slice();if(list.length){list.splice(notePage,1);notePage=Math.max(0,Math.min(notePage,list.length-1));setNoteList(selected,list)}else{delete notes[selected.id]}saveNotes();renderPanel();toast('褰撳墠鍦板浘澶囨敞椤靛凡鍒犻櫎')};
  function switchMap(){
    current='world';selected=null;hideTip();
    tabs.forEach(function(t){t.classList.toggle('a',(t.dataset.map||'world')==='world')});
    pageTabs.forEach(function(t){t.classList.toggle('active',(t.dataset.page||'world')==='world')});
    render();
  }
  tabs.forEach(function(tab){tab.addEventListener('click',switchMap)});
  pageTabs.forEach(function(tab){tab.addEventListener('click',switchMap)});
  document.getElementById('mapZoomIn').onclick=function(){if(globeRenderer)globeRenderer.zoomBy(.78);else zoomMap(current,.78)};
  document.getElementById('mapZoomOut').onclick=function(){if(globeRenderer)globeRenderer.zoomBy(1.28);else zoomMap(current,1.28)};
  document.getElementById('mapZoomReset').onclick=function(){if(globeRenderer)globeRenderer.resetView();else resetMapZoom(current)};
  var globeWrap=document.getElementById('globe-wrap');
  if(globeWrap){
    globeWrap.addEventListener('wheel',function(e){
      if(globeRenderer)return;
      e.preventDefault();
      zoomMap(current,e.deltaY < 0 ? 0.86 : 1.16);
    },{passive:false});
  }
  mapApp={render:function(){render();if(globeRenderer)globeRenderer.resize()}};
  render();
}
document.addEventListener('keydown',function(e){
  if(e.key==='?'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.target.closest('input,textarea,[contentEditable]')){
    e.preventDefault();var m=document.getElementById('helpModal');if(m.classList.contains('s'))helpClose_();else helpOpen()
  }
  if(e.key==='Escape'&&document.getElementById('helpModal').classList.contains('s'))helpClose_()
})
}catch(e){console.error('help init error:',e)}

function stgClose(){
  document.getElementById('stgOverlay').classList.remove('s')
  document.getElementById('stgModal').classList.remove('s')
}
try{
document.getElementById('stgBtn').onclick=stgOpen
document.getElementById('stgOverlay').onclick=stgClose
document.getElementById('stgClose').onclick=stgClose
document.querySelectorAll('.stg-row').forEach(function(row){
  row.querySelectorAll('.stg-btn').forEach(function(btn){
    btn.onclick=function(){
      var grp=row.id.replace('stg',''),v=parseInt(btn.dataset.v)
      var s=data._settings||{fontSize:1,fontFamily:0,lineHeight:1,pageWidth:0}
      if(grp==='FontSize'){s.fontSize=v;s.fontSizeCustom=''}
      else if(grp==='FontFamily'){s.fontFamily=v;s.fontFamilyCustom=''}
      else if(grp==='LineHeight'){s.lineHeight=v;s.lineHeightCustom=''}
      else if(grp==='PageWidth'){s.pageWidth=v}
      data._settings=s;save()
      stgHighlight(grp,v)
      applySettings(s)
    }
  })
})
;['FontSize','FontFamily','LineHeight','PageWidth'].forEach(function(grp){
  var input=document.getElementById('stg'+grp+'Custom')
  if(!input)return
  input.oninput=function(){
    var s=data._settings||{fontSize:1,fontFamily:0,lineHeight:1}
    var val=input.value.trim()
    if(grp==='FontSize'){s.fontSizeCustom=val;stgHighlight('FontSize',-1)}
    else if(grp==='FontFamily'){s.fontFamilyCustom=val;stgHighlight('FontFamily',-1)}
    else if(grp==='LineHeight'){s.lineHeightCustom=val;stgHighlight('LineHeight',-1)}
    data._settings=s;save()
    applySettings(s)
  }
})
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&document.getElementById('stgModal').classList.contains('s'))stgClose()
})
}catch(e){console.error('settings init error:',e)}

// ======================== FEATURE: Reading Tracker ========================
function renderReadings(){var el=document.getElementById('readingSection');if(!el)return;var items=data._readings||[]
  el.innerHTML='<div class="rd-header"><h3>馃摉 闃呰杩借釜</h3><button class="rd-add" id="rdAddBtn">+ 娣诲姞</button></div>'
  if(!items.length)el.innerHTML+='<div style="color:var(--muted);font-size:.55rem;padding:.2rem 0">鏆傛棤闃呰鏉＄洰</div>'
  else{items.forEach(function(r,i){
    var sc='rd-status'+(r.status==='done'?' done':r.status==='reading'?' reading':'')
    var tc='rd-title'+(r.status==='done'?' done':'')
    var meta=r.status==='done'?'鉁?璇诲畬':r.status==='reading'?'馃摉 鍦ㄨ':'馃搶 寰呰'
    el.innerHTML+='<div class="rd-item"><div class="'+sc+'" data-ri="'+i+'"></div><span class="'+tc+'">'+esc(r.title)+'</span><span class="rd-meta">'+meta+'</span><button class="rd-del" data-ri="'+i+'">脳</button></div>'
  })}
  el.innerHTML+='<div class="rd-input" id="rdInput"><input id="rdTitleInput" placeholder="涔﹀悕/璁烘枃鏍囬鈥?><button class="rd-save" id="rdSaveBtn">娣诲姞</button></div>'
  // Bind status toggle
  el.querySelectorAll('.rd-status').forEach(function(d){d.onclick=function(){var i=parseInt(d.dataset.ri),r=data._readings[i];if(r){r.status=r.status==='done'?'todo':r.status==='reading'?'done':'reading';save();renderReadings()}}})
  el.querySelectorAll('.rd-del').forEach(function(d){d.onclick=function(){var i=parseInt(d.dataset.ri);data._readings.splice(i,1);save();renderReadings()}})
  document.getElementById('rdAddBtn').onclick=function(){document.getElementById('rdInput').classList.toggle('s');document.getElementById('rdTitleInput').focus()}
  document.getElementById('rdSaveBtn').onclick=function(){var v=document.getElementById('rdTitleInput').value.trim();if(v){if(!data._readings)data._readings=[];data._readings.push({title:v,status:'todo'});save();renderReadings();document.getElementById('rdTitleInput').value='';document.getElementById('rdInput').classList.remove('s')}}
  document.getElementById('rdTitleInput').addEventListener('keydown',function(e){if(e.key==='Enter')document.getElementById('rdSaveBtn').click()})}

// ======================== FEATURE: Heatmap ========================
function renderHeatmap(cid){var wrap=document.getElementById('hm-'+cid);if(!wrap)return;var weeks=data[cid];if(!weeks||!weeks.length){wrap.innerHTML='';return}
  var totalDays=0,doneDays=0;var dayData=[];weeks.forEach(function(w,i){(w.days||[]).forEach(function(d,di){
    totalDays++;var done=w.done&&w.done[di]||false;var hasContent=d&&d.trim();dayData.push({done:done,hasContent:hasContent,wi:i,di:di})})})
  if(!totalDays){wrap.innerHTML='';return}
  var cols=Math.ceil(totalDays/7),cellSize=12,gap=3,padding=20,labelW=30,labelH=18
  var w=labelW+cols*(cellSize+gap)+padding,h=labelH+7*(cellSize+gap)+padding
  var svg='<svg class="heat-svg" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg">'
  // month labels
  svg+='<text x="'+labelW+'" y="12" class="heat-l">1鏈?/text>'
  dayData.forEach(function(d,i){
    var col=Math.floor(i/7),row=i%7
    var x=labelW+col*(cellSize+gap),y=labelH+row*(cellSize+gap)
    var fill='rgba(255,255,255,.02)';if(d.done)fill='rgba(212,165,116,.5)';else if(d.hasContent)fill='rgba(212,165,116,.15)'
    var title=(d.done?'鉁?':'')+(d.hasContent?'鏈夊唴瀹?:'绌?)+' 路 绗?+(d.wi+1)+'鍛?鍛?+(d.di+1)
    svg+='<rect class="heat-day" x="'+x+'" y="'+y+'" width="'+cellSize+'" height="'+cellSize+'" fill="'+fill+'"><title>'+title+'</title></rect>'
  })
  // day labels
  ;['涓€','涓?,'浜?].forEach(function(l,i){svg+='<text x="4" y="'+(labelH+i*2*(cellSize+gap)+cellSize)+'" class="heat-l">'+l+'</text>'})
  svg+='</svg>';wrap.innerHTML=svg}

// ======================== FEATURE: Stats Panel ========================
function computeStats(){var total=0,done=0,streak=0,allDays=[],weeklyRates=[]
  var wkKeys=Object.keys(data).filter(function(k){return k.match(/^y[1-5]-(academic|exam|finance|life)$/)})
  wkKeys.forEach(function(cid){(data[cid]||[]).forEach(function(w,wi){
    var wTotal=0,wDone=0;(w.days||[]).forEach(function(d,di){
      if(d&&d.trim()){wTotal++;if(w.done&&w.done[di])wDone++;allDays.push({done:w.done&&w.done[di]||false,date:null})}})
    if(wTotal){weeklyRates.push({label:cid.replace('y','').replace('1','Y1').replace('2','Y2').replace('3','Y3').replace('4','Y4').replace('5','Y5')+'W'+(wi+1),rate:Math.round(wDone/wTotal*100),total:wTotal,done:wDone})}
    total+=wTotal;done+=wDone})})
  // Streak
  var cur=0;allDays.forEach(function(d){if(d.done){cur++;streak=Math.max(streak,cur)}else cur=0})
  document.getElementById('sTotal').textContent=total
  document.getElementById('sDone').textContent=done
  document.getElementById('sRate').textContent=total?Math.round(done/total*100)+'%':'0%'
  document.getElementById('sStreak').textContent=streak+' 澶?
  // Chart
  var chart=document.getElementById('sChart'),labels=document.getElementById('sChartLabels')
  var recent=weeklyRates.slice(-12)
  chart.innerHTML=recent.map(function(r){return'<div class="col" style="height:'+Math.max(2,r.rate*0.6)+'px;background:'+(r.rate>70?'rgba(212,165,116,.7)':r.rate>40?'rgba(212,165,116,.4)':'rgba(212,165,116,.2)')+'" title="'+r.label+': '+r.rate+'%"><span class="col-tip">'+r.rate+'%</span></div>'}).join('')
  labels.innerHTML=recent.map(function(r){return'<span class="cl">'+r.label+'</span>'}).join('')}

// ======================== FEATURE: Keyboard Shortcuts ========================
var kbdBindings={}
function showKbdHint(msg){var el=document.getElementById('kbdHint');if(!el)return;el.textContent=msg;el.classList.add('s');clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('s')},2000)}
document.addEventListener('keydown',function(e){
  // Ctrl+F / Cmd+F: search
  if((e.ctrlKey||e.metaKey)&&e.key==='f'){e.preventDefault();searchOpen();showKbdHint('鎼滅储宸叉墦寮€');return}
  // Escape: close panels
  if(e.key==='Escape'){searchClose();document.getElementById('pomoPanel').classList.remove('s');document.getElementById('statsPanel').classList.remove('s');return}
  // ?: show all shortcuts
  if(e.key==='?'&&!e.ctrlKey&&!e.metaKey){e.preventDefault()
    showKbdHint('[Ctrl+F] 鎼滅储 路 [W] 灞曞紑鍛?路 [Space] 鍕鹃€?路 [Escape] 鍏抽棴 路 [?] 甯姪')
    return}
  // Only if not in input/textarea
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.isContentEditable)return
  // W: expand first collapsible week
  if(e.key==='w'||e.key==='W'){var wt=document.querySelector('.wt:not(.o)');if(wt){wt.click();showKbdHint('宸插睍寮€涓€鍛?)}return}
  // Space: toggle first undone checkbox in view
  if(e.key===' '){e.preventDefault();var dc=document.querySelector('.dc:not(:checked)');if(dc){dc.click();showKbdHint('宸插嬀閫?)}return}
  // 1-5: jump to year
  if(['1','2','3','4','5'].includes(e.key)){var sec=document.getElementById('y'+e.key);if(sec)sec.scrollIntoView({behavior:'smooth',block:'start'});return}
})

// Click floating timer to reopen pomo modal
document.getElementById('pomoFloat').addEventListener('click',function(){pomoOpen()})
// CSV export
document.getElementById('csvBtn').addEventListener('click',exportCSV)
// White noise toggle
document.getElementById('noiseBtn').addEventListener('click',noiseToggle)
// Template buttons (delegated)
document.addEventListener('click',function(e){var b=e.target.closest('.aw.tpl');if(b)showTplPicker(b.dataset.c)})
// Initialize drag & drop
initDrag()
// Request notification permission
if('Notification'in window&&Notification.permission==='default')Notification.requestPermission()
// Register service worker for PWA
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js')

// ======================== FEATURE: Init all new features ========================
function initFeatures(){
  initOKRs();initMilestones()
  // Add OKR areas to week bodies
  document.querySelectorAll('.wk-body').forEach(function(wb){
    var oa=wb.querySelector('.okr-area');if(!oa){oa=document.createElement('div');oa.className='okr-area';wb.insertBefore(oa,wb.firstChild)}
    var cid=wb.closest('.wp')?.id?.replace('plan-body-','')||'';oa.id='okr-'+cid
    renderOKRs(cid)
  })
  // Add heatmap areas after each year section
  document.querySelectorAll('.sec').forEach(function(sec){
    var cid=sec.id;if(!cid||cid==='sum')return
    var hm=document.createElement('div');hm.className='heatmap-wrap';hm.id='hm-'+cid
    var inner=document.createElement('div');inner.className='heatmap-inner';hm.appendChild(inner)
    var toggle=document.createElement('button');toggle.className='heat-toggle';toggle.textContent='馃搳 鐑姏鍥?
    toggle.onclick=function(){hm.classList.toggle('s');renderHeatmap(cid)}
    sec.querySelector('.sh')?.appendChild(toggle)
    sec.querySelector('.sh')?.after(hm)
  })
  // Add milestone areas after each year section's sh
  document.querySelectorAll('.sec').forEach(function(sec){
    var cid=sec.id;if(!cid||cid==='sum')return
    var ms=document.createElement('div');ms.className='ms-area';ms.id='ms-'+cid
    sec.querySelector('.sh')?.after(ms);renderMilestones(cid)
  })
  // Add reading section to summary
  var sumSec=document.getElementById('sum');if(sumSec){var rd=document.createElement('div');rd.className='rd-section';rd.id='readingSection';sumSec.appendChild(rd);renderReadings()}
  // Render templates
  renderTemplates()
  // Compute stats
  computeStats()
}
// Bind stats toggle 鈥?refresh data every time panel opens
document.getElementById('statsToggle').addEventListener('click',function(){var p=document.getElementById('statsPanel');var was=p.classList.contains('s');p.classList.toggle('s');if(!was){try{computeStats()}catch(e){}}})
// Init on load
setTimeout(initFeatures,500)

// ======================== FEATURE: CSV Export ========================
function exportCSV(){var csv='\ufeff绫诲瀷,鏃ユ湡,鏃堕棿,鏍囩,鏍囩澶囨敞,鏃堕暱(鍒嗛挓)\n'
  ;(data._pomoLog||[]).forEach(function(r){csv+='鐣寗閽?'+r.date+','+r.time+','+r.label+','+(r.tag||'')+','+r.duration+'\n'})
  csv+='\n\n骞村害,鍒嗙被,鍛ㄦ,鏃ユ湡,浠诲姟,宸插畬鎴?鍛ㄦ€荤粨\n'
  Object.keys(data).filter(function(k){return k.match(/^y[1-5]/)}).forEach(function(cid){
    var yl=cid.replace('y','绗?).replace('1','涓€').replace('2','浜?).replace('3','涓?).replace('4','鍥?).replace('5','浜?)+'骞?
    ;(data[cid]||[]).forEach(function(w,wi){(w.d||[]).forEach(function(d,di){
      var txt=typeof d==='object'?d.text:d||'';var done=typeof d==='object'?d.done:false
      csv+=yl+','+cid.split('-')[1]+',绗?+(wi+1)+'鍛?鍛?+(['涓€','浜?,'涓?,'鍥?,'浜?,'鍏?,'鏃?][di]||'')+','+txt.replace(/\n/g,' | ')+','+(done?'鏄?:'鍚?)+','+(w.s||'')+'\n'})})})
  var blob=new Blob([csv],{type:'text/csv;charset=utf-8'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='phd-plan-export.csv';a.click();URL.revokeObjectURL(a.href)}

// ======================== FEATURE: White Noise ========================
var noiseCtx=null,noiseNode=null,noiseGain=null,noiseFilter=null,noiseType='rain'
function noiseStart(type){try{
  if(!noiseCtx||noiseCtx.state==='closed')noiseCtx=new(window.AudioContext||window.webkitAudioContext)
  if(noiseCtx.state==='suspended')noiseCtx.resume()
  noiseStop()
  noiseType=type||'rain';var sr=noiseCtx.sampleRate;var len=sr*2;var buf=noiseCtx.createBuffer(1,len);var d=buf.getChannelData(0)
  if(noiseType==='rain'){for(var i=0;i<len;i++)d[i]=Math.random()*2-1;noiseGain=noiseCtx.createGain();noiseGain.gain.value=.25}
  else{for(var i=0;i<len;i++){var t=i/sr;d[i]=(Math.random()*2-1)*.3+Math.sin(2*Math.PI*200*t)*.03+Math.sin(2*Math.PI*400*t)*.02};noiseGain=noiseCtx.createGain();noiseGain.gain.value=.12}
  noiseNode=noiseCtx.createBufferSource();noiseNode.buffer=buf;noiseNode.loop=true
  noiseFilter=noiseCtx.createBiquadFilter();noiseFilter.type='lowpass';noiseFilter.frequency.value=noiseType==='rain'?800:1500
  noiseNode.connect(noiseFilter);noiseFilter.connect(noiseGain);noiseGain.connect(noiseCtx.destination);noiseNode.start()
  document.getElementById('noiseBtn').textContent='馃攰 鍏抽棴鐧藉櫔闊?;document.getElementById('noiseBtn').classList.add('s')}catch(e){showToast('鈿狅笍 鐧藉櫔闊冲惎鍔ㄥけ璐?)}}
function noiseStop(){if(noiseNode){try{noiseNode.stop()}catch(e){}noiseNode.disconnect();noiseNode=null}
  if(noiseFilter){noiseFilter.disconnect();noiseFilter=null}
  document.getElementById('noiseBtn').textContent='馃幍 鐧藉櫔闊?;document.getElementById('noiseBtn').classList.remove('s')}
function noiseToggle(){if(noiseNode)noiseStop();else noiseStart()}

// ======================== FEATURE: Weekly Templates ========================
var WEEK_TPL=[{n:'馃摎 璁烘枃鍛?,d:['2h 瀹為獙/浠跨湡','1h 鏂囩尞闃呰','鏁版嵁鍒嗘瀽','璁烘枃鍐欎綔','缁勪細鍑嗗','鑷敱瀛︿範','浼戞伅']},{n:'馃搵 澶囪€冨懆',d:['琛屾祴 1h','鐢宠 1h','閿欓鏁寸悊','鐪熼妯℃嫙','鐢宠缁冧範','鑷敱澶嶄範','浼戞伅']},{n:'馃挵 璐㈠姟鍛?,d:['璁拌处','棰勭畻瑙勫垝','鎶曡祫瀛︿範','鍓笟鎺㈢储','鐞嗚储澶嶇洏','鑷敱瀹夋帓','浼戞伅']},{n:'鉂わ笍 鐢熸椿鍛?,d:['杩愬姩30min','闃呰','鍏磋叮瀛︿範','绀句氦','鏁寸悊鏀剁撼','鑷敱娲诲姩','浼戞伅']}]
function showTplPicker(cardId){var el=document.getElementById('tplPicker');if(!el){el=document.createElement('div');el.id='tplPicker';el.className='tpl-picker';document.body.appendChild(el)}
  el.innerHTML='<div class="tpl-picker-h">閫夋嫨鍛ㄦā鏉?/div>'+WEEK_TPL.map(function(t,i){return'<button class="tpl-picker-btn" data-tpl="'+i+'" data-c="'+cardId+'">'+esc(t.n)+'</button>'}).join('')+'<button class="tpl-picker-close">鉁?/button>'
  el.classList.add('s')
  el.querySelectorAll('.tpl-picker-btn').forEach(function(b){b.onclick=function(){applyTpl(b.dataset.c,parseInt(b.dataset.tpl));el.classList.remove('s')}})
  el.querySelector('.tpl-picker-close').onclick=function(){el.classList.remove('s')}}
function applyTpl(cardId,tplIdx){var tpl=WEEK_TPL[tplIdx];if(!tpl)return;if(!data[cardId])data[cardId]=[]
  var nWeeks=prompt('鍒涘缓鍑犲懆锛?1-12)','4');nWeeks=parseInt(nWeeks)||4;if(nWeeks<1||nWeeks>12)nWeeks=4
  // Find max existing week number
  var maxN=0;data[cardId].forEach(function(w){var m=w.w.match(/绗?\d+)鍛?);if(m)maxN=Math.max(maxN,parseInt(m[1]))});
  for(var w=0;w<nWeeks;w++){var startWeek=maxN+w+1
    data[cardId].push({w:'绗?+(startWeek)+'鍛?,s:'',d:tpl.d.slice()})}
  save();renderWeeks(cardId);showToast('鉁?宸插垱寤?'+nWeeks+' 鍛ㄨ鍒?)}

// ======================== FEATURE: Drag & Drop ========================
function initDrag(){document.addEventListener('dragstart',function(e){var ta=e.target.closest('.di');if(!ta)return;e.dataTransfer.setData('text/plain',ta.id);ta.classList.add('dragging')})
  document.addEventListener('dragover',function(e){var ta=e.target.closest('.di');if(!ta||ta.classList.contains('dragging'))return;e.preventDefault();ta.classList.add('drag-over')})
  document.addEventListener('dragleave',function(e){var ta=e.target.closest('.di');if(ta)ta.classList.remove('drag-over')})
  document.addEventListener('drop',function(e){var ta=e.target.closest('.di');if(!ta)return;e.preventDefault();ta.classList.remove('drag-over')
    var srcId=e.dataTransfer.getData('text/plain');var src=document.getElementById(srcId);if(!src||src===ta)return
    var srcDr=src.closest('.dr'),tgtDr=ta.closest('.dr');if(!srcDr||!tgtDr||srcDr.parentElement!==tgtDr.parentElement)return
    var parent=tgtDr.parentElement;var idxSrc=Array.from(parent.children).indexOf(srcDr);var idxTgt=Array.from(parent.children).indexOf(tgtDr)
    if(idxSrc<idxTgt)parent.insertBefore(srcDr,tgtDr.nextSibling);else parent.insertBefore(srcDr,tgtDr)
    saveDragOrder(parent)})
  document.addEventListener('dragend',function(e){document.querySelectorAll('.di.dragging,.di.drag-over').forEach(function(el){el.classList.remove('dragging','drag-over')})})}
function saveDragOrder(container){var cardId=container.closest('.wp')?.dataset?.c;if(!cardId)return
  var wi=container.closest('.week')?.dataset?.wi;if(wi===undefined)return
  var drs=container.querySelectorAll('.dr');var week=data[cardId][parseInt(wi)];if(!week||!week.d)return
  var reordered=[];drs.forEach(function(dr){var idx=parseInt(dr.dataset.di);if(!isNaN(idx)&&week.d[idx])reordered.push(week.d[idx])})
  if(reordered.length===week.d.length){week.d=reordered;save();renderWeeks(cardId);showToast('鉁?浠诲姟椤哄簭宸叉洿鏂?)}}

// ======================== UTIL ========================
function esc(s) { if(typeof s!=='string')return s||'';const d=document.createElement('div');d.textContent=s;return d.innerHTML; }

// ======================== INIT ========================
// Restore saved overviews + card headings
if (data._overviews) {
  // Restore overview text (.tb)
  for (const [cid, html] of Object.entries(data._overviews)) {
    if (typeof html === 'string') {
      const el = document.getElementById('ov-' + cid);
      if (el) el.innerHTML = html;
    }
  }
  // Restore card heading icon, category label, motto (stored as object)
  document.querySelectorAll('.tc[data-c]').forEach(function(card){
    var cid = card.dataset.c;
    var obj = data._overviews[cid];
    if (obj && typeof obj === 'object') {
      if (obj.ti) { var ti = card.querySelector('.ti'); if (ti) ti.textContent = obj.ti; }
      if (obj.tt) { var tt = card.querySelector('.tt > span:first-child'); if (tt) tt.textContent = obj.tt; }
      if (obj.tm) { var tm = card.querySelector('.tm'); if (tm) tm.innerHTML = obj.tm; }
    }
  });
}
initPages();
renderAll();
applySettings(data._settings);
// Auto-expand y1-academic on load
setTimeout(() => {
  const body = document.getElementById('plan-body-y1-academic');
  const toggle = document.querySelector('.wt[data-c="y1-academic"]');
  if (body) { body.classList.add('o'); }
  if (toggle) { toggle.classList.add('o'); }
  // Also auto-resize all textareas
  document.querySelectorAll('.di').forEach(autoResize);
}, 300);

// Try Gist auto-sync on load
setTimeout(trySyncOnLoad, 2000);

// Save overviews on edit mode blur
document.addEventListener('blur', e => {
  var el = e.target;
  // Overview text (.tb)
  var tb = el.closest('.tb[id^="ov-"]');
  if (tb && tb.contentEditable === 'true') {
    if (!data._overviews) data._overviews = {};
    data._overviews[tb.id.replace('ov-', '')] = tb.innerHTML;
    save(); return;
  }
  // Card heading icon (.ti)
  var ti = el.closest('.tc .ti');
  if (ti && ti.contentEditable === 'true') {
    var card = ti.closest('.tc');
    if (!card) return;
    var cid = card.dataset.c;
    if (!cid) return;
    if (!data._overviews) data._overviews = {};
    if (!data._overviews[cid]) data._overviews[cid] = {};
    data._overviews[cid].ti = ti.textContent;
    save(); return;
  }
  // Card category label (.tt > span:first-child)
  var tt = el.closest('.tc .tt > span:first-child');
  if (tt && tt.contentEditable === 'true') {
    var card = tt.closest('.tc');
    if (!card) return;
    var cid = card.dataset.c;
    if (!cid) return;
    if (!data._overviews) data._overviews = {};
    if (!data._overviews[cid]) data._overviews[cid] = {};
    data._overviews[cid].tt = tt.textContent;
    save(); return;
  }
  // Card motto (.tm)
  var tm = el.closest('.tc .tm');
  if (tm && tm.contentEditable === 'true') {
    var card = tm.closest('.tc');
    if (!card) return;
    var cid = card.dataset.c;
    if (!cid) return;
    if (!data._overviews) data._overviews = {};
    if (!data._overviews[cid]) data._overviews[cid] = {};
    data._overviews[cid].tm = tm.innerHTML;
    save(); return;
  }
  // Year section header label (.ey)
  var ey = el.closest('.sh .ey');
  if (ey && ey.contentEditable === 'true') {
    var sec = ey.closest('.sec');
    if (!sec) return;
    if (!data._overviews) data._overviews = {};
    data._overviews[sec.id+'-ey'] = ey.textContent;
    save(); return;
  }
  // Year section h2 title
  var h2el = el.closest('.sh h2');
  if (h2el && h2el.contentEditable === 'true') {
    var sec = h2el.closest('.sec');
    if (!sec) return;
    if (!data._overviews) data._overviews = {};
    // Store text-only, preserve the emoji icons
    data._overviews[sec.id+'-h2'] = h2el.innerHTML;
    save(); return;
  }
  // Year section subtitle (.sub)
  var sub = el.closest('.sh .sub');
  if (sub && sub.contentEditable === 'true') {
    if (!data._overviews) data._overviews = {};
    data._overviews['sub-'+sub.textContent.slice(0,8)] = sub.textContent;
    save(); return;
  }
  // Summary card h3
  var sch3 = el.closest('.sc h3');
  if (sch3 && sch3.contentEditable === 'true') {
    if (!data._overviews) data._overviews = {};
    data._overviews['sc-'+sch3.textContent.slice(0,6)] = sch3.textContent;
    save(); return;
  }
  // Summary card li
  var scLi = el.closest('.sc ul li');
  if (scLi && scLi.contentEditable === 'true') {
    if (!data._overviews) data._overviews = {};
    data._overviews['scli-'+Date.now()] = scLi.textContent;
    save(); return;
  }
  // Hero title (page0 or dynamic page)
  var hm = el.closest('.hmark');
  if (hm && hm.contentEditable === 'true') {
    var dynPageId = hm.dataset.dynPage;
    if (dynPageId) {
      data[dynPageId + '-hmark'] = hm.innerHTML;
    } else {
      if (!data._overviews) data._overviews = {};
      data._overviews['hmark'] = hm.innerHTML;
    }
    save(); return;
  }
  // Hero subtitle (page0 or dynamic page)
  var hs = el.closest('.hsub');
  if (hs && hs.contentEditable === 'true') {
    var dynPageId = hs.dataset.dynPage;
    if (dynPageId) {
      data[dynPageId + '-hsub'] = hs.textContent;
    } else {
      if (!data._overviews) data._overviews = {};
      data._overviews['hsub'] = hs.textContent;
    }
    save(); return;
  }
  // Hero stats (page0 or dynamic page)
  var hstat = el.closest('.hstat');
  if (hstat) {
    var nEl = hstat.querySelector('.n');
    var lEl = hstat.querySelector('.l');
    var dynPageId = null;
    if (nEl) dynPageId = nEl.dataset.dynPage;
    if (!dynPageId && lEl) dynPageId = lEl.dataset.dynPage;
    if (dynPageId) {
      // Dynamic page: save all four stat fields individually (up to 2 pairs)
      var allStats = hstat.closest('.hstats');
      if (allStats) {
        var statEls = allStats.querySelectorAll('.hstat');
        var idx = 0;
        statEls.forEach(function(st) {
          var sn = st.querySelector('.n');
          var sl = st.querySelector('.l');
          if (sn && sn.contentEditable === 'true') {
            data[dynPageId + '-hstat-n' + (idx+1)] = sn.textContent;
          }
          if (sl && sl.contentEditable === 'true') {
            data[dynPageId + '-hstat-l' + (idx+1)] = sl.textContent;
          }
          idx++;
        });
        save();
      }
    } else {
      if (nEl && nEl.contentEditable === 'true') {
        if (!data._overviews) data._overviews = {};
        data._overviews['hstat-n'] = nEl.textContent;
        save();
      }
      if (lEl && lEl.contentEditable === 'true') {
        if (!data._overviews) data._overviews = {};
        data._overviews['hstat-l'] = lEl.textContent;
        save();
      }
    }
    return;
  }
  // Footer text
  var ftp = el.closest('.ft p');
  if (ftp && ftp.contentEditable === 'true') {
    if (!data._footer || !Array.isArray(data._footer)) data._footer = ['', ''];
    if (ftp.id === 'footerLine1') data._footer[0] = ftp.textContent;
    else if (ftp.id === 'footerLine2') data._footer[1] = ftp.textContent;
    save(); return;
  }
}, true);

// ======================== PWA Install Prompt ========================
let pwaInstallEvent = null;
const installBtn = document.getElementById('installBtn');
if (installBtn) {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    pwaInstallEvent = e;
    installBtn.style.display = '';
    installBtn.onclick = async () => {
      if (pwaInstallEvent) {
        pwaInstallEvent.prompt();
        const result = await pwaInstallEvent.userChoice;
        if (result.outcome === 'accepted') {
          installBtn.style.display = 'none';
          showToast('馃摝 宸插畨瑁呭埌妗岄潰');
        }
        pwaInstallEvent = null;
      }
    };
  });
  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    showToast('馃摝 鎰熻阿瀹夎锛?);
    pwaInstallEvent = null;
  });
  // On iOS, show hint since beforeinstallprompt doesn't fire
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS && !window.navigator.standalone) {
    installBtn.style.display = '';
    installBtn.onclick = () => showToast('鍦?Safari 涓偣鍑汇€屽垎浜€嶁啋銆屾坊鍔犲埌涓诲睆骞曘€?);
  }
  // Hide if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installBtn.style.display = 'none';
  }
}

// ======================== PWA Update Detection ========================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    // Check for SW updates on each page load
    reg.addEventListener('updatefound', () => {
      const newSW = reg.installing;
      let swTimeout = setTimeout(() => { swTimeout = null; showToast('馃攧 鏂扮増鏈笅杞戒腑鈥?); }, 3000);
      newSW.addEventListener('statechange', () => {
        if (newSW.state === 'installed') {
          if (swTimeout) { clearTimeout(swTimeout); swTimeout = null; }
          if (navigator.serviceWorker.controller) {
            // New version available 鈥?prompt to refresh
            showToast('馃攧 鏂扮増鏈凡灏辩华锛岀偣鍑诲埛鏂?);
            setTimeout(() => location.reload(), 5000);
          }
        }
      });
    });
  });
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
}

// ======================== 3D INTERACTIVE SCENE ========================
(function(){
  var container = document.getElementById('threeScene');
  if (!container || typeof THREE === 'undefined') return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  var group = new THREE.Group();
  scene.add(group);

  var GOLD = 0xd4a574, TEAL = 0x4a7c8c, VERM = 0xe85d2f, JADE = 0x3b7a5c;

  // Helper: glow sprite via canvas
  function makeGlow(color, size) {
    var c = document.createElement('canvas');
    c.width = c.height = 128;
    var cx = c.getContext('2d');
    var g = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
    var hex = '#' + new THREE.Color(color).getHexString();
    g.addColorStop(0, hex + '99');
    g.addColorStop(0.3, hex + '44');
    g.addColorStop(1, hex + '00');
    cx.fillStyle = g; cx.fillRect(0, 0, 128, 128);
    var tex = new THREE.CanvasTexture(c);
    var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    var sp = new THREE.Sprite(mat);
    sp.scale.set(size, size, 1);
    return sp;
  }

  // 1. Main geometries (enhanced with inner fill + wireframe)
  var knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.2, 0.35, 100, 16),
    new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0.22 })
  );
  knot.position.set(0, 0, 0);
  group.add(knot);

  // Glow behind knot
  var knotGlow = makeGlow(GOLD, 4.5);
  knotGlow.position.set(0, 0, -0.2);
  group.add(knotGlow);

  var ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.6, 0),
    new THREE.MeshBasicMaterial({ color: TEAL, wireframe: true, transparent: true, opacity: 0.15 })
  );
  ico.position.set(2.5, -1.2, -1);
  group.add(ico);

  var dod = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.45, 0),
    new THREE.MeshBasicMaterial({ color: VERM, wireframe: true, transparent: true, opacity: 0.12 })
  );
  dod.position.set(-2.2, 1.4, -1.5);
  group.add(dod);

  var ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.08, 16, 32),
    new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0.1 })
  );
  ring.position.set(-1.5, -1.8, 0.5);
  ring.rotation.x = Math.PI / 3;
  group.add(ring);

  // 2. Connecting lines between geometries
  var positions = [
    knot.position, ico.position, dod.position, ring.position
  ];
  var pairs = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
  var lineGeo = new THREE.BufferGeometry();
  var verts = [];
  pairs.forEach(function(p){
    var a = positions[p[0]], b = positions[p[1]];
    verts.push(a.x, a.y, a.z, b.x, b.y, b.z);
  });
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  var lineMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.06 });
  var lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  // 3. Particle system (300+ small dots)
  var particleCount = 400;
  var pGeo = new THREE.BufferGeometry();
  var pPos = new Float32Array(particleCount * 3);
  var pSizes = new Float32Array(particleCount);
  var pSpeeds = [];
  for (var i = 0; i < particleCount; i++) {
    pPos[i*3] = (Math.random() - 0.5) * 14;
    pPos[i*3+1] = (Math.random() - 0.5) * 10;
    pPos[i*3+2] = (Math.random() - 0.5) * 8 - 1;
    pSizes[i] = Math.random() * 2 + 0.5;
    pSpeeds.push({
      x: (Math.random() - 0.5) * 0.002,
      y: (Math.random() - 0.5) * 0.002,
      z: (Math.random() - 0.5) * 0.002
    });
  }
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
  pGeo.setAttribute('size', new THREE.Float32BufferAttribute(pSizes, 1));

  // Create a dot canvas texture
  var dotCanvas = document.createElement('canvas');
  dotCanvas.width = dotCanvas.height = 32;
  var dotCtx = dotCanvas.getContext('2d');
  var dg = dotCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  dg.addColorStop(0, 'rgba(212,165,116,0.8)');
  dg.addColorStop(0.3, 'rgba(212,165,116,0.3)');
  dg.addColorStop(1, 'rgba(212,165,116,0)');
  dotCtx.fillStyle = dg; dotCtx.fillRect(0, 0, 32, 32);
  var dotTex = new THREE.CanvasTexture(dotCanvas);

  var pMat = new THREE.PointsMaterial({
    color: GOLD, map: dotTex, transparent: true,
    opacity: 0.12, size: 0.06, blending: THREE.AdditiveBlending,
    depthWrite: false, sizeAttenuation: true
  });
  var particles = new THREE.Points(pGeo, pMat);
  group.add(particles);
  // Store speeds for animation
  particles.userData = { speeds: pSpeeds };

  // 4. Subtle ambient glow sphere
  var ambientGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 16, 16),
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.015, wireframe: false })
  );
  group.add(ambientGlow);

  // Mouse tracking
  var mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // Scroll tracking for parallax
  var scrollY = 0;
  window.addEventListener('scroll', function() {
    scrollY = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  }, { passive: true });

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    // Color pulsing
    var pulse1 = Math.sin(t * 0.4) * 0.5 + 0.5;
    var pulse2 = Math.sin(t * 0.3 + 1) * 0.5 + 0.5;
    var pulse3 = Math.sin(t * 0.5 + 2) * 0.5 + 0.5;

    knot.material.opacity = 0.06 + pulse1 * 0.08;
    ico.material.opacity = 0.04 + pulse2 * 0.06;
    dod.material.opacity = 0.03 + pulse3 * 0.05;
    ring.material.opacity = 0.02 + pulse1 * 0.04;

    // Glow pulsing
    knotGlow.scale.setScalar(3 + pulse1 * 1.0);
    knotGlow.material.opacity = 0.08 + pulse1 * 0.08;

    // Particles drift
    var pPosAttr = particles.geometry.attributes.position;
    var pArr = pPosAttr.array;
    var spds = particles.userData.speeds;
    for (var pi = 0; pi < particleCount; pi++) {
      pArr[pi*3] += spds[pi].x;
      pArr[pi*3+1] += spds[pi].y + Math.sin(t * 0.05 + pi) * 0.0003;
      pArr[pi*3+2] += spds[pi].z;
      // Bound check
      if (Math.abs(pArr[pi*3]) > 7) spds[pi].x *= -1;
      if (Math.abs(pArr[pi*3+1]) > 5) spds[pi].y *= -1;
      if (Math.abs(pArr[pi*3+2]) > 5) spds[pi].z *= -1;
    }
    pPosAttr.needsUpdate = true;

    // Connecting lines pulse
    lines.material.opacity = 0.03 + pulse2 * 0.06;

    // Ambient glow pulse
    ambientGlow.material.opacity = 0.005 + pulse3 * 0.008;

    // Parallax: slight vertical shift based on scroll
    var scrollOffset = scrollY * 0.3;

    // Group rotation 鈥?mouse driven with scroll influence
    var spdFactor = 0.06 + scrollY * 0.04;
    group.rotation.x = Math.sin(t * 0.08) * 0.15 + mouseY * 0.05 - scrollOffset * 0.05;
    group.rotation.y = t * spdFactor + mouseX * 0.08;

    // Individual geometry motions (enhanced)
    knot.rotation.x = Math.sin(t * 0.12) * 0.2;
    knot.rotation.z = Math.cos(t * 0.1) * 0.15;

    ico.rotation.x = t * 0.2 + pulse2 * 0.3;
    ico.rotation.y = t * 0.25;
    ico.position.y = -1.2 + Math.sin(t * 0.3) * 0.4 + pulse1 * 0.2;

    dod.rotation.x = t * 0.25 + pulse3 * 0.2;
    dod.rotation.z = t * 0.2;
    dod.position.x = -2.2 + Math.sin(t * 0.15) * 0.3;
    dod.position.y = 1.4 + Math.cos(t * 0.2) * 0.2;

    ring.rotation.z = t * 0.12;
    ring.position.y = -1.8 + Math.sin(t * 0.2) * 0.25;

    renderer.render(scene, camera);
  }

  // Force first paint BEFORE showing, to prevent compositor drop on initial load
  renderer.render(scene, camera);
  animate();
  container.classList.add('loaded');
})();

// ======================== FEATURE: Daily Overview ========================
function showDailyOverview(){
  try{
    var _d = window.data || {};
    var total = 0, done = 0;
    for(var cid in _d){
      if(cid.startsWith('_') || !Array.isArray(_d[cid])) continue;
      (_d[cid]||[]).forEach(function(w){
        (w.d||[]).forEach(function(t){ total++; if(typeof t==='object'&&t.done) done++; });
      });
    }
    var weekTotal = 0, weekDone = 0;
    for(var cid2 in _d){
      if(cid2.startsWith('_') || !Array.isArray(_d[cid2])) continue;
      var ws = _d[cid2]; if(!ws.length) continue;
      var lastW = ws[ws.length-1];
      if(lastW && lastW.w && lastW.d){ weekTotal += lastW.d.length;
        lastW.d.forEach(function(t){ if(typeof t==='object'&&t.done) weekDone++; });
      }
    }
    var weekPct = weekTotal === 0 ? 0 : Math.round(weekDone / weekTotal * 100);
    var todoEl=document.getElementById('doTodoDone'), totalEl=document.getElementById('doTodoTotal'), weekEl=document.getElementById('doTodoWeek');
    if(todoEl) todoEl.textContent = done;
    if(totalEl) totalEl.textContent = total;
    if(weekEl) weekEl.textContent = weekPct + '%';
    var now = new Date();
    var dateEl=document.getElementById('doDate');
    if(dateEl) dateEl.textContent = now.getFullYear()+'骞?+(now.getMonth()+1)+'鏈?+now.getDate()+'鏃?鍛?+(['鏃?,'涓€','浜?,'涓?,'鍥?,'浜?,'鍏?][now.getDay()]);
    var reminderEl=document.getElementById('doReminders');
    if(reminderEl){
      var reminders=window.CalendarReminders&&typeof window.CalendarReminders.collect==='function'?window.CalendarReminders.collect(_d,now,7):[];
      if(reminders.length){
        reminderEl.innerHTML='<strong class="do-reminders-title">鏈潵7澶╀簨椤?路 '+reminders.length+' 鏉?/strong>'+reminders.map(function(item){
          return '<div class="do-reminder-row"><time>'+esc(item.date.slice(5))+'</time><span>'+(item.days===0?'浠婂ぉ':item.days+'澶╁悗')+'</span><strong>'+esc(item.label)+'</strong></div>';
        }).join('');
      }else{
        reminderEl.innerHTML='<strong class="do-reminders-title">鏈潵7澶╀簨椤?/strong><div class="do-reminder-empty">鏈潵7澶╂殏鏃犳湭瀹屾垚浜嬮」</div>';
      }
    }
    var tips = [
      weekPct === 0 ? '馃挕 浠婂ぉ杩樻病鏈夊畬鎴愮殑浠诲姟锛屽厛浠庝竴浠跺皬浜嬪紑濮嬪惂' :
      weekPct < 30 ? '馃挭 鏈懆杩涘害 '+weekPct+'%锛岀户缁姞娌癸紒' :
      weekPct < 60 ? '馃憤 鏈懆 '+weekPct+'% 宸插畬鎴愶紝淇濇寔鑺傚' :
      weekPct < 90 ? '馃幆 鏈懆 '+weekPct+'%锛屽啿鍒哄畬鎴愶紒' : '馃帀 鏈懆浠诲姟鎺ヨ繎瀹屾垚锛岃交鏉句竴涓嬶紒',
      total > 0 ? '馃搳 鎬昏繘搴︼細'+Math.round(done/total*100)+'%锛屽叡 '+total+' 椤逛换鍔? : '馃摑 寮€濮嬪埗瀹氫綘鐨勫懆璁″垝鍚?,
      done === 0 && total > 0 ? '馃幆 璇曡瘯鐢?AI 鍔╂墜鐢熸垚浠诲姟锛熺偣鍙充笅瑙?馃' : ''
    ];
    var tipEl=document.getElementById('doTip');
    if(tipEl) tipEl.innerHTML = tips.filter(Boolean).join('<br>');
    var ov=document.getElementById('doOverlay'), md=document.getElementById('doModal');
    if(ov) ov.classList.add('s');
    if(md) md.classList.add('s');
  }catch(e){ console.error('daily overview error:',e); }
}
function doClose_(){
  var ov=document.getElementById('doOverlay'), md=document.getElementById('doModal');
  if(ov) ov.classList.remove('s');
  if(md) md.classList.remove('s');
}
var doCl=document.getElementById('doClose'), doOv=document.getElementById('doOverlay'), doBtn=document.getElementById('doCloseBtn');
if(doCl) doCl.addEventListener('click', doClose_);
if(doOv) doOv.addEventListener('click', doClose_);
if(doBtn) doBtn.addEventListener('click', doClose_);
setTimeout(showDailyOverview, 1200);

// ======================== FEATURE: Browser Notification ========================
(function(){
  function reqNotif(){ if('Notification' in window && Notification.permission==='default') Notification.requestPermission(); }
  document.addEventListener('click', function once(){ reqNotif(); }, { once: true });
  window.pomoNotify = function(label){
    if(!('Notification' in window)) return;
    if(Notification.permission === 'granted'){
      new Notification('馃崊 鐣寗閽熷畬鎴?, { body: label||'涓撴敞鏃堕棿缁撴潫锛屼紤鎭竴涓嬪惂' });
    } else if(Notification.permission === 'default'){ Notification.requestPermission(); }
  };
  var _pomoRunning = false;
  setInterval(function(){
    var label = document.getElementById('pfLabel');
    var time = document.getElementById('pfTime');
    if(!label||!time) return;
    var isRun = label.textContent === '涓撴敞'||label.textContent === '鐭紤鎭?||label.textContent === '闀夸紤鎭?;
    if(_pomoRunning && !isRun && time.textContent === '00:00') window.pomoNotify(label.textContent);
    _pomoRunning = isRun;
  }, 1000);
})();
console.log('DBG: pomodoro OK, about to init cc feature');

// Credit Card Calculator (reused by finance feature)
function financeInitCC_(){
  document.getElementById('ccCalcBtn').addEventListener('click', function(){
    try{
      var bal = parseFloat(document.getElementById('ccBal').value)||0;
      var rate = parseFloat(document.getElementById('ccRate').value)||18.25;
      var pay = parseFloat(document.getElementById('ccPay').value)||500;
      if(bal<=0||pay<=0){ showToast('鈿狅笍 璇疯緭鍏ラ噾棰?); return; }
      if(pay<=bal*rate/100/12){ showToast('鈿狅笍 鏈堣繕娆鹃渶澶т簬鏈€浣庡埄鎭?); return; }
      var _d = window.data || {};
      _d._ccLast = {bal:bal,rate:rate,pay:pay}; if(window.save) window.save();
      var mr = rate/100/12, r = bal, m = 0, ti = 0;
      while(r>0&&m<600){ var i=r*mr; ti+=i; var p=pay-i; if(p<=0)break; r-=p; m++; }
      if(m>=600){ showToast('鈿狅笍 杩樻閲戦杩囦綆'); return; }
      var mEl=document.getElementById('ccMonths'),iEl=document.getElementById('ccInterest'),tEl=document.getElementById('ccTotal'),rEl=document.getElementById('ccResult');
      if(mEl) mEl.textContent = m+' 涓湀 ('+Math.floor(m/12)+'骞?+m%12+'涓湀)';
      if(iEl) iEl.textContent = ti.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g,',')+' 鍏?;
      if(tEl) tEl.textContent = (m*pay).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g,',')+' 鍏?;
      if(rEl) rEl.style.display = 'block';
    }catch(e){ console.error('cc calc error:',e); }
  });
}

try{
// ======================== FEATURE: Savings Settings (with Daily Log) ========================
console.log('DBG: sv try block entered');
;(function(){
  function svGetData(){ return window.data || {}; }
  function svCalcTotal_(){
    var sv = svGetData()._savings||{};
    var total = parseFloat(sv.initial)||0;
    (sv.log||[]).forEach(function(e){
      if(e.type==='save'||e.type==='earn') total += parseFloat(e.amount)||0;
      else if(e.type==='spend') total -= parseFloat(e.amount)||0;
    });
    return Math.max(0, total);
  }
  function svRenderLog_(){
    var sv = svGetData()._savings||{};
    var list = document.getElementById('svLogList');
    if(!list) return;
    var log = sv.log||[];
    if(!log.length){ list.innerHTML = '<div class="sv-log-empty">鏆傛棤娴佹按璁板綍锛岀偣鍑讳笂鏂规寜閽坊鍔?/div>'; return; }
    var typeLabels = {save:'鐪侀挶',earn:'璧氶挶',spend:'鐢ㄩ挶'};
    var html = '';
    var sorted = log.slice().sort(function(a,b){ return (a.date||'') < (b.date||'') ? 1 : -1; });
    sorted.forEach(function(e, idx){
      var origIdx = log.indexOf(e);
      var isPlus = (e.type==='save'||e.type==='earn');
      var sign = isPlus ? '+' : '鈭?;
      var cls = isPlus ? 'plus' : 'minus';
      var tCls = 'sv-t-' + e.type;
      html += '<div class="sv-log-item">'
        + '<span class="sv-li-date">' + (e.date||'') + '</span>'
        + '<span class="sv-li-type ' + tCls + '">' + (typeLabels[e.type]||e.type) + '</span>'
        + '<span class="sv-li-amt ' + cls + '">' + sign + (parseFloat(e.amount)||0).toFixed(2) + '涓?/span>'
        + '<span class="sv-li-note">' + (e.note||'') + '</span>'
        + '<button class="sv-li-del" data-idx="' + origIdx + '" title="鍒犻櫎">鉁?/button>'
        + '</div>';
    });
    list.innerHTML = html;
    list.querySelectorAll('.sv-li-del').forEach(function(btn){
      btn.addEventListener('click', function(){
        try{
          var idx = parseInt(this.dataset.idx);
          var _d = svGetData();
          var sv2 = _d._savings||{};
          if(!sv2.log) return;
          sv2.log.splice(idx, 1);
          _d._savings = sv2; if(window.save) window.save();
          svRenderSummary_(); svRenderLog_();
        }catch(e2){ console.error('sv del error:',e2); }
      });
    });
  }
  function svRenderSummary_(){
    var sv = svGetData()._savings||{};
    var total = svCalcTotal_();
    var logSection = document.getElementById('svLogSection');
    if(!sv.goal){ if(logSection) logSection.style.display='none'; return; }
    if(logSection) logSection.style.display='block';
    var gEl=document.getElementById('svDispGoal'), aEl=document.getElementById('svAutoTotal'), pEl=document.getElementById('svDispPct'), rEl=document.getElementById('svDispRemain'), bEl=document.getElementById('svBar');
    if(gEl) gEl.textContent = (sv.goal||0).toFixed(1)+' 元;
    if(aEl) aEl.textContent = total.toFixed(1)+' 元/ '+(sv.goal||0).toFixed(1)+' 元;
    var pct = sv.goal>0 ? Math.min(100, Math.round(total/sv.goal*100)) : 0;
    if(pEl) pEl.textContent = pct+'%';
    if(rEl) rEl.textContent = Math.max(0,(sv.goal||0)-total).toFixed(1)+' 元;
    if(bEl) bEl.style.width = pct+'%';
    svRenderLog_();
  }
  window.financeOpenSavings_ = function(){
    var sv = svGetData()._savings||{};
    var gEl=document.getElementById('svGoal'), iEl=document.getElementById('svInitial'), dEl=document.getElementById('svDate');
    if(gEl&&sv.goal) gEl.value = sv.goal;
    if(iEl&&sv.initial!==undefined) iEl.value = sv.initial;
    if(dEl&&sv.date) dEl.value = sv.date;
    svRenderSummary_();
  };
  var svSave = document.getElementById('svSaveBtn');
  if(svSave) svSave.addEventListener('click', function(){
    try{
      var goal = parseFloat(document.getElementById('svGoal').value)||0;
      var initial = parseFloat(document.getElementById('svInitial').value)||0;
      var date = document.getElementById('svDate').value||'';
      if(goal<=0){ showToast('鈿狅笍 璇疯緭鍏ョ洰鏍囬噾棰?); return; }
      var _d = svGetData();
      var sv = _d._savings||{};
      sv.goal = goal; sv.initial = initial; sv.date = date;
      if(!sv.log) sv.log = [];
      _d._savings = sv; if(window.save) window.save();
      svRenderSummary_(); showToast('鉁?瀛樻鐩爣宸蹭繚瀛?);
    }catch(e2){ console.error('sv save error:',e2); }
  });
  function svPromptAdd_(type){
    try{
      var typeLabels = {save:'鐪侀挶',earn:'璧氶挶',spend:'鐢ㄩ挶'};
      var label = typeLabels[type] || type;
      var amtStr = prompt('馃挵 ' + label + ' 閲戦锛堜竾鍏冿級锛?);
      if(amtStr === null) return;
      var amt = parseFloat(amtStr);
      if(isNaN(amt) || amt <= 0){ showToast('鈿狅笍 璇疯緭鍏ユ湁鏁堥噾棰?); return; }
      var note = prompt('馃摑 澶囨敞锛堝彲閫夛級锛?) || '';
      var _d = svGetData();
      var sv = _d._savings||{};
      if(!sv.log) sv.log = [];
      sv.log.push({ date: new Date().toISOString().slice(0,10), type: type, amount: amt, note: note });
      _d._savings = sv; if(window.save) window.save();
      svRenderSummary_(); showToast('鉁?宸茶褰?+label+' '+amt.toFixed(2)+'涓?);
    }catch(e2){ console.error('sv prompt error:',e2); }
  }
  var svLogSave = document.getElementById('svLogSaveBtn');
  var svLogEarn = document.getElementById('svLogEarnBtn');
  var svLogSpend = document.getElementById('svLogSpendBtn');
  if(svLogSave) svLogSave.addEventListener('click', function(){ svPromptAdd_('save'); });
  if(svLogEarn) svLogEarn.addEventListener('click', function(){ svPromptAdd_('earn'); });
  if(svLogSpend) svLogSpend.addEventListener('click', function(){ svPromptAdd_('spend'); });
  setTimeout(svRenderSummary_, 1000);
})();
}catch(e){console.error('sv init error:',e)}

// ======================== FEATURE: Unified Finance Modal (CC + Savings) ========================
try{
console.log('DBG: finance try block entered');
;(function(){
  var btn = document.getElementById('financeBtn');
  if(!btn){ console.warn('financeBtn not found'); return; }
  btn.addEventListener('click', function(){
    try{
      console.log('DBG: financeBtn clicked');
      var ov = document.getElementById('financeOverlay'), md = document.getElementById('financeModal');
      if(!ov||!md){ console.warn('finance overlay/modal missing'); return; }
      ov.classList.add('s'); md.classList.add('s');
      // Restore CC last values
      var _d = window.data || {};
      var last = _d._ccLast||{};
      var balEl=document.getElementById('ccBal'), rateEl=document.getElementById('ccRate'), payEl=document.getElementById('ccPay');
      if(balEl&&last.bal) balEl.value = last.bal;
      if(rateEl&&last.rate) rateEl.value = last.rate;
      if(payEl&&last.pay) payEl.value = last.pay;
      // Restore and render savings
      if(typeof window.financeOpenSavings_ === 'function') window.financeOpenSavings_();
    }catch(e2){ console.error('finance click error:',e2); }
  });
  var ovEl = document.getElementById('financeOverlay');
  var clEl = document.getElementById('financeClose');
  if(ovEl) ovEl.addEventListener('click', function(){ ovEl.classList.remove('s'); var m=document.getElementById('financeModal'); if(m)m.classList.remove('s'); });
  if(clEl) clEl.addEventListener('click', function(){ var o=document.getElementById('financeOverlay'); if(o)o.classList.remove('s'); var m=document.getElementById('financeModal'); if(m)m.classList.remove('s'); });
  // Init CC calculator
  if(typeof financeInitCC_ === 'function') financeInitCC_();
})();
}catch(e){console.error('finance init error:',e)}

// ======================== FEATURE: Snapshot Comparison ========================
try{
console.log('DBG: sn try block entered');
;(function(){
  var snBtn = document.getElementById('snBtn');
  if(!snBtn){ console.warn('snBtn not found'); return; }
  snBtn.addEventListener('click', function(){
    try{
      console.log('DBG: snBtn clicked');
      var ov = document.getElementById('snOverlay'), md = document.getElementById('snModal');
      if(!ov||!md){ console.warn('sn overlay/modal missing'); return; }
      ov.classList.add('s'); md.classList.add('s');
      if(typeof snRenderList_ === 'function') snRenderList_();
    }catch(e2){ console.error('sn click error:',e2); }
  });
  var snOv = document.getElementById('snOverlay');
  var snCl = document.getElementById('snClose');
  if(snOv) snOv.addEventListener('click', function(){ snOv.classList.remove('s'); var m=document.getElementById('snModal'); if(m)m.classList.remove('s'); });
  if(snCl) snCl.addEventListener('click', function(){ var o=document.getElementById('snOverlay'); if(o)o.classList.remove('s'); var m=document.getElementById('snModal'); if(m)m.classList.remove('s'); });
  var snNew = document.getElementById('snNewBtn');
  if(snNew) snNew.addEventListener('click', function(){
    try{
      var _d = window.data || {};
      var total=0,done=0;
      for(var cid in _d){ if(cid.startsWith('_')||!Array.isArray(_d[cid]))continue; (_d[cid]||[]).forEach(function(w){(w.d||[]).forEach(function(t){total++;if(typeof t==='object'&&t.done)done++})}); }
      var pct=total===0?0:Math.round(done/total*100);
      if(!_d._snapshots) _d._snapshots=[];
      _d._snapshots.push({ts:Date.now(),total:total,done:done,pct:pct,label:new Date().toLocaleDateString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})});
      if(window.save) window.save();
      if(typeof snRenderList_ === 'function') snRenderList_();
      showToast('馃摳 蹇収宸蹭繚瀛?);
    }catch(e2){ console.error('sn new error:',e2); }
  });
  function snRenderList_(){
    try{
      var _d = window.data || {};
      var list = _d._snapshots||[];
      var el = document.getElementById('snList');
      var ce = document.getElementById('snCompare');
      if(!el) return;
      if(!list.length){ el.innerHTML='<div class="sn-empty">鏆傛棤蹇収锛岀偣鍑讳笂鏂规寜閽褰曞綋鍓嶈繘搴?/div>'; if(ce)ce.innerHTML=''; return; }
      el.innerHTML = list.map(function(s,i){
        return '<div class="sn-item" data-si="'+i+'"><span class="sn-date">'+new Date(s.ts).toLocaleDateString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})+' 鈥?'+s.label+'</span><span class="sn-pct">'+s.done+'/'+s.total+' ('+s.pct+'%)</span><button class="sn-del" data-si="'+i+'">鉁?/button></div>';
      }).join('');
      var sel = null;
      el.querySelectorAll('.sn-item').forEach(function(item){
        item.addEventListener('click', function(){
          var si = parseInt(this.dataset.si);
          if(sel===si){ sel=null; if(ce)ce.innerHTML=''; return; }
          if(sel===null){ sel=si; return; }
          var a=list[sel], b=list[si]; if(!a||!b){ sel=null; return; }
          var diff = b.pct-a.pct;
          var dc = diff>0?'up':diff<0?'down':'same';
          if(ce) ce.innerHTML = '<div class="sn-compare">'+
            '<div class="sn-col"><div class="sn-col-label">馃摳 鍩哄噯</div><div class="sn-col-date">'+new Date(a.ts).toLocaleDateString('zh-CN',{month:'short',day:'numeric'})+'</div>'+
            '<div class="sn-col-stat"><span class="sn-csl">宸插畬鎴?/span><span class="sn-csv">'+a.done+'</span></div>'+
            '<div class="sn-col-stat"><span class="sn-csl">鎬讳换鍔?/span><span class="sn-csv">'+a.total+'</span></div>'+
            '<div class="sn-col-stat" style="border-top:1px solid var(--line);margin-top:.1rem;padding-top:.15rem"><span class="sn-csl">杩涘害</span><span class="sn-csv" style="color:var(--accent)">'+a.pct+'%</span></div></div>'+
            '<div class="sn-col"><div class="sn-col-label">馃摳 瀵规瘮</div><div class="sn-col-date">'+new Date(b.ts).toLocaleDateString('zh-CN',{month:'short',day:'numeric'})+'</div>'+
            '<div class="sn-col-stat"><span class="sn-csl">宸插畬鎴?/span><span class="sn-csv">'+b.done+'</span></div>'+
            '<div class="sn-col-stat"><span class="sn-csl">鎬讳换鍔?/span><span class="sn-csv">'+b.total+'</span></div>'+
            '<div class="sn-col-stat" style="border-top:1px solid var(--line);margin-top:.1rem;padding-top:.15rem"><span class="sn-csl">杩涘害</span><span class="sn-csv" style="color:var(--accent)">'+b.pct+'%</span></div></div>'+
            '<div class="sn-diff">鍙樺寲锛?span class="sn-dp '+dc+'">'+(diff>0?'+'+diff+'% 鈫?:diff<0?diff+'% 鈫?:'鎸佸钩 鈥?)+'</span></div></div>';
          sel=null;
        });
      });
      el.querySelectorAll('.sn-del').forEach(function(btn){
        btn.addEventListener('click', function(e){
          e.stopPropagation();
          var si = parseInt(this.dataset.si);
          if(!confirm('鍒犻櫎姝ゅ揩鐓э紵')) return;
          _d._snapshots.splice(si,1); if(window.save) window.save(); snRenderList_();
        });
      });
    }catch(e2){ console.error('sn render error:',e2); }
  }
  // Expose snRenderList_ to outer scope for reuse
  window.snRenderList_ = snRenderList_;
})();
}catch(e){console.error('sn init error:',e)}

// ======================== BOTTOM BAR CHAPTER INFO ========================
(function(){
  var secEl = document.getElementById('currentSection');
  var pageEl = document.getElementById('pageIndicator');
  var chapterInfo = document.querySelector('.chapter-info');
  if (!secEl || !pageEl) return;

  var allSections = document.querySelectorAll('.sec');
  var total = allSections.length;
  var currentTarget = null; // DOM element for current section

  // Helper: update display + target
  function setSection(name, page, targetEl) {
    secEl.textContent = name;
    pageEl.textContent = page;
    currentTarget = targetEl;
    if (targetEl) secEl.dataset.targetId = targetEl.id || '';
    else delete secEl.dataset.targetId;
  }

  // Watch each .sec
  allSections.forEach(function(sec, idx) {
    new IntersectionObserver(function(e) {
      if (e[0].isIntersecting) {
        var label = sec.querySelector('.ey');
        var h2 = sec.querySelector('h2');
        var name = label ? label.textContent.trim() : (h2 ? h2.textContent.replace(/[馃敩馃搵馃挵鉂わ笍馃搳馃梻锔廬/g,'').trim() : '');
        setSection(name || '璁″垝', (idx + 1) + '/' + total, sec);
      }
    }, { threshold: 0.3 }).observe(sec);
  });

  // Click to jump
  if (chapterInfo) {
    chapterInfo.addEventListener('click', function() {
      if (currentTarget) {
        currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
})();

// Expose IIFE-scoped vars to window for external feature scripts
window.data = data;
window.showToast = showToast;
window.save = save;
var _origRenderWeeks = renderWeeks;
window.renderWeeks = renderWeeks;
// Route local calls through _origRenderWeeks (direct reference, not window.renderWeeks)
// so that _exportFeatVars (line 1699) can't overwrite window.renderWeeks with the wrapper and cause infinite recursion.
renderWeeks = function(cid, preserveState){ _origRenderWeeks(cid, preserveState); };
})();
