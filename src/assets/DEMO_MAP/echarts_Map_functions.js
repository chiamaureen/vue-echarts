
/* Add Echart Plot Var and Map */
function Reform_stids_of_city(stids_of_city){
     var myCitys = {}
     Object.keys(stids_of_city).forEach( function(x){
        if(x=="恆春半島"){
           if(myCitys["屏東縣"]==="undefined"){
              myCitys["屏東縣"]=[]
           };
           stids_of_city[x].forEach( function(y){
              myCitys["屏東縣"].push(y)
           });
        }else if(x=="蘭嶼綠島"){
           if(myCitys["臺東縣"]==="undefined"){
              myCitys["臺東縣"]=[]
           };
           stids_of_city[x].forEach( function(y){
              myCitys["臺東縣"].push(y)
           });
        }else if(x!="其他"){
           myCitys[x] = []
           stids_of_city[x].forEach( function(y){
              myCitys[x].push(y)
           });
        };
     });
     myCitys["基隆市"].push("466950")
     myCitys["基隆市"].push("C0B020")
     myCitys["高雄市"].push("469020")
     myCitys["高雄市"].push("468100")
     return myCitys
};
//var stids_of_city_R = Reform_stids_of_city()

function Reform_stids_of_town(){
   var Rdata = {}
     
   Object.keys(stids_of_town["恆春半島"]).forEach( function(iskeys){
      stids_of_town["屏東縣"][iskeys] = stids_of_town["恆春半島"][iskeys]
   });
   Object.keys(stids_of_town["蘭嶼綠島"]).forEach( function(iskeys){
      stids_of_town["臺東縣"][iskeys] = stids_of_town["蘭嶼綠島"][iskeys]
   });

   stids_of_town["基隆市"]["中正區"].push("466950") /*彭佳嶼*/
   stids_of_town["基隆市"]["中正區"].push("C0B020") /*基隆嶼*/
   stids_of_town["高雄市"]["旗津區"].push("469020") /*南沙*/
   stids_of_town["高雄市"]["旗津區"].push("468100") /*東沙*/
   //console.log(stids_of_town)

   var ignore_list = ["其他","恆春半島","蘭嶼綠島"]
   Object.keys( stids_of_town ).forEach( function(CityName){
      if( ignore_list.indexOf(CityName) <0){
         Rdata[CityName] = stids_of_town[CityName]
      };
   });
   //console.log(Rdata)
   return Rdata 
   //return stids_of_town
};


function Color_Translate(color_name){
   if(color_name=="indego"){
      return 7
   }else if(color_name=="fuchsia"){
      return 6
   }else if(color_name=="red"){
      return 5
   }else if(color_name=="orange"){
      return 4
   }else if(color_name=="yellow"){
      return 3
   }else if(color_name=="aquamarine"){
      return 2
   }else if(color_name=="lightcyan"){
      return 1
   }else if(color_name=="silver"){
      return 0
   }else if(color_name=="none"){
      return 0
      //return -99
   };
};
      
      
function cal_color2val(val_Aw,val_Gw){
   var scale_valA = ms2scale(val_Aw)
   var scale_valG = ms2scale(val_Gw)
   var color_name = set_color(scale_valA , scale_valG)
   var color_val = Color_Translate( color_name  )
   return color_val
};
      


function get_ArrayMax_index(arr){
   var thVal_Max = -99
   var thVal_Max_ind = 0
   for(var i=0;i<arr.length;i++){
      var tVal = parseFloat( arr[i] )
     if( !isNaN(tVal) && arr[i]!=='-'){
        if( tVal >= thVal_Max ){
          thVal_Max = tVal
         thVal_Max_ind = i
       };
     };
   };
   return [thVal_Max, thVal_Max_ind]
};















/* 日前的風力 in 10min */
function get_Data_NowTable(Fid_WebDate){

   console.log("get_Data_NowTable:", data["times"][Fid_WebDate])
   var CTS_Data_F = []
   var CTS_Data_S = {}
   Object.keys( stids_of_town_R).forEach(function(key_citys){
      Object.keys( stids_of_town_R[key_citys] ).forEach(function(key_towns){

         var missing_value = -9999
         var max_Wind_std = []
         var max_Gust_std = []
         var TownMax_name = ""
         var TownMax_ref  = -999
         var TownMax_Cls  = -999
         var TownMax_time = ""
         var TownMax_dir_ind = -999
         var max_Town_avg = -99
         var Flag_Std = false
         stids_of_town_R[key_citys][key_towns].forEach(function(key_stids){

            var Std_Data = data["wind"][key_stids]
            if( typeof Std_Data !== 'undefined'){
               var th_std_info = data["stids"][key_stids]
               var val_Aw = parseFloat( Std_Data["speed"][Fid_WebDate] )
               var val_Gw = parseFloat( Std_Data["gust"][Fid_WebDate] )

               var TEMP_S = {}
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"] = th_std_info["name"]
               TEMP_S["ref"]  = th_std_info
               TEMP_S["time"] = data["times"][Fid_WebDate]
               if(!isNaN(val_Aw) && !isNaN(val_Gw) && th_std_info["elev"]<elev_threshold ){

                  var send_Data = {}
                  var Flag_datatype = true
                  Flag_datatype = Flag_datatype && (typeof Std_Data !== 'undefined')
                  if( Flag_datatype ){
                     WebDate_Time  = WebDate.split("T")[1].replace(":","")
                     CheckDate_St  = data["times"][Fid_WebDate].split("T")[1].replace(":","")

                     /* 確認 指定時間 是否為最近的一個小時 */
                     Date_Cond = (WebDate.split("T")[0] == data["times"][Fid_WebDate].split("T")[0])
                     Date_Cond = Date_Cond && (WebDate_Time.slice(0,2) == CheckDate_St.slice(0,2) )
                     if( Date_Cond  ){
                        CheckDate_Et = parseInt(CheckDate_St) + 10
                        var rTmp_A  = get_ArrayMax_index( Std_Data["speed"].slice(Fid_WebDate,Fid_WebDate+1) )
                        var rTmp_G  = get_ArrayMax_index( Std_Data["gust"].slice(Fid_WebDate,Fid_WebDate+1) )
                     }else{
                        CheckDate_Et = data["times"][Fid_WebDate+6].split("T")[1].replace(":","")
                        var rTmp_A  = get_ArrayMax_index( Std_Data["speed"].slice(Fid_WebDate,Fid_WebDate+6) )
                        var rTmp_G  = get_ArrayMax_index( Std_Data["gust"].slice(Fid_WebDate,Fid_WebDate+6) )
                     };

                     /* 比對出 該測站的最大陣風 & 時間 */
                     max_std_gust = -99
                     max_std_gust_time = "-"
                     for(var ixy=0;ixy< Std_Data["times"].length;ixy++){
                        mTime = Std_Data["times"][ixy]
                        if( parseInt(mTime) >= parseInt(CheckDate_St) &&  parseInt(mTime) < parseInt(CheckDate_Et)){
                           if( parseFloat( Std_Data["gust"][ixy]) >= max_std_gust){
                              max_std_gust      = parseFloat( Std_Data["gust"][ixy])
                              max_std_gust_time = Std_Data["times"][ixy]
                           };
                        };
                     };
                     if(max_std_gust_time!="-"){
                        str_gust_time = String(max_std_gust_time)
                        max_std_gust_time  = data["times"][Fid_WebDate].split("T")[0]
                        max_std_gust_time += "T"+str_gust_time.slice(0,2) +":"+ str_gust_time.slice(2,4)
                     };

                     /* 統整該測站的資訊 */
                     send_Data["wind_avg"]       = rTmp_A[0]
                     send_Data["wind_gust"]      = max_std_gust
                     send_Data["wind_time"]      = data["times"][Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_gust_time"] = max_std_gust_time
                     send_Data["wind_dir"]       = Std_Data["dir"][Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_dir_name"]  = deg2dir( send_Data["wind_dir"] )

                     //val_A = cal_color2val(rTmp_A[0], max_std_gust)
                     val_A = cal_color2val(rTmp_A[0], "-")
                     send_Data["wind_color"] = val_A
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], val_A ]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], send_Data]
                  }else{
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  };
                  TEMP_S["type"]  = "wind"
                  TEMP_S["time"]  = send_Data["wind_time"]
               }else{
                  TEMP_S["value"] =  [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  TEMP_S["ovalue"]=  [ th_std_info["lon"], th_std_info["lat"], missing_value]
               };
               CTS_Data_S[TEMP_S_name] = TEMP_S

               /* 比對 該站的平均風 是否有比該鄉鎮的目前記錄還高 */
               var tmp_valA = parseFloat(TEMP_S["ovalue"][2]["wind_avg"])
               var tmp_valB = parseFloat(TownMax_ref)
               elev_check = parseFloat( th_std_info["elev"] ) < elev_threshold
               if( tmp_valA  > tmp_valB && !isNaN( tmp_valA  )  && elev_check){
                  TownMax_ref       = tmp_valA
                  TownMax_Cls       = parseFloat(TEMP_S["ovalue"][2]["wind_color"])
                  TownMax_name      = key_stids
                  TownMax_time      = send_Data["wind_time"]
                  TownMax_avgW      = rTmp_A[0]
                  TownMax_gustW     = max_std_gust
                  TownMax_gust_time = send_Data["wind_gust_time"]
                  TownMax_dir_ind   = parseInt(rTmp_A[1]) + parseInt(Fid_WebDate)
                  TownMax_avgW_dir  = data["wind"][key_stids]["dir"][ TownMax_dir_ind]
                  Flag_Std = true
               };

            }else if(Std_Data="-"){
               if( typeof data["stids"][key_stids] == 'undefined'){return};
               var TEMP_S = {}
               var th_std_info = data["stids"][key_stids]
               console.log("##Lost station:", th_std_info["name"],key_stids )
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"]   = th_std_info["name"]
               TEMP_S["value"]  = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ovalue"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ref"]    = th_std_info
               CTS_Data_S[TEMP_S_name] = TEMP_S
            };
         }); /* End of Stids in Town */


         /* 計算Map1 : CTS_Data_F  */
         var TEMP_D = {}
         if(Flag_Std){  // 如果該鄉鎮 有測站存在 & 有數值 //
            var th_std_info = data["stids"][TownMax_name]

            var Rank_Std  = {}
            var dict_temp = {}
            dict_temp["name"]   = th_std_info["name"]
            dict_temp["ref"]    = th_std_info
            if( TownMax_ref > max_Town_avg ){
               Rank_Std["MaxVal"]          = TownMax_ref
               Rank_Std["MaxVal_avg"]      = TownMax_avgW
               Rank_Std["MaxVal_avg_time"] = TownMax_time
               Rank_Std["MaxVal_gust"]     = TownMax_gustW
               Rank_Std["MaxVal_gust_time"]= TownMax_gust_time
               Rank_Std["MaxVal_Cls"]      = TownMax_Cls
               Rank_Std["MaxVal_dir"]      = TownMax_avgW_dir
               Rank_Std["MaxVal_dir_name"] = deg2dir(TownMax_avgW_dir)
               Rank_Std["MaxVal_dir_ind"]  = TownMax_dir_ind
               Rank_Std["wind"]            = dict_temp
               max_Town_avg = TownMax_ref
            };

            var Flag_datatype_2 = (typeof data["wind"][TownMax_name] !== 'undefined')
            if( Flag_datatype_2 ){
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["value"] = TownMax_Cls
               TEMP_D["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], Rank_Std]
            }else{
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["time"]  = data["times"][Fid_WebDate]
               TEMP_D["value"] = missing_value
            };
         }else{
            TEMP_D["name"]  = key_citys + key_towns
            TEMP_D["time"]  = data["times"][Fid_WebDate]
            TEMP_D["value"] = missing_value
         };
         CTS_Data_F.push(TEMP_D)
      });
      /* End of 計算Map1 : CTS_Data_F  */
   });
   console.log("CTS_Data_F:",CTS_Data_F)
   console.log("CTS_Data_S:",CTS_Data_S)
   return [CTS_Data_F,CTS_Data_S]
};
/* End of 日前的風力 in 10min */




/* 前1小時的陣風 */
function get_Data_LastHourGustTable(Fid_WebDate){

   console.log("get_Data_LastHourGustTable:", data["times"][Fid_WebDate])
   Date_backShift = parseInt(data["times"][Fid_WebDate].split(":")[1])/10
   New_Fid_WebDate = Fid_WebDate - Date_backShift
   console.log("New_WebDate:",data["times"][New_Fid_WebDate])
   var CTS_Data_F = []
   var CTS_Data_S = {}
   Object.keys( stids_of_town_R).forEach(function(key_citys){
      Object.keys( stids_of_town_R[key_citys] ).forEach(function(key_towns){

         var missing_value = -9999
         var max_Wind_std = []
         var max_Gust_std = []
         var TownMax_name = ""
         var TownMax_ref  = -999
         var TownMax_Cls  = -999
         var TownMax_time = ""
         var TownMax_dir_ind = -999
         var max_Town_avg = -99
         var Flag_Std = false
         stids_of_town_R[key_citys][key_towns].forEach(function(key_stids){

            var Std_Data = data["wind"][key_stids]
            if( typeof Std_Data !== 'undefined'){

               var th_std_info = data["stids"][key_stids]
               var val_Aw = parseFloat( Std_Data["speed"][New_Fid_WebDate] )
               var val_Gw = parseFloat( Std_Data["gust"][New_Fid_WebDate] )

               var TEMP_S = {}
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"] = th_std_info["name"]
               TEMP_S["ref"]  = th_std_info
               TEMP_S["time"] = data["times"][New_Fid_WebDate]
               //if(!isNaN(val_Aw) && !isNaN(val_Gw)){
               if(!isNaN(val_Gw) && th_std_info["elev"]<elev_threshold ){

                  var send_Data = {}
                  var Flag_datatype = true
                  Flag_datatype = Flag_datatype && (typeof Std_Data !== 'undefined')
                  if( Flag_datatype ){
                     WebDate_Time  = WebDate.split("T")[1].replace(":","")
                     CheckDate_St  = data["times"][New_Fid_WebDate].split("T")[1].replace(":","")

                     /* 確認 指定時間 是否為最近的一個小時 */
                     CheckDate_Et = data["times"][New_Fid_WebDate+6].split("T")[1].replace(":","")
                     var rTmp_A  = get_ArrayMax_index( Std_Data["speed"].slice(New_Fid_WebDate,New_Fid_WebDate+6) )
                     var rTmp_G  = get_ArrayMax_index( Std_Data["gust"].slice(New_Fid_WebDate,New_Fid_WebDate+6) )

                     /* 比對出 該測站的最大陣風 & 時間 */
                     max_std_gust = -99
                     max_std_gust_time = "-"
                     dim_times = Std_Data["times"].length
                     ixy_st = parseInt(parseInt(dim_times)*3/4)
                     for(var ixy=ixy_st;ixy<dim_times;ixy++){
                        mTime = Std_Data["times"][ixy]
                        if( parseInt(mTime) >= parseInt(CheckDate_St) &&  parseInt(mTime) < parseInt(CheckDate_Et)){
                           if( parseFloat( Std_Data["gust"][ixy]) >= max_std_gust){
                              max_std_gust      = parseFloat( Std_Data["gust"][ixy])
                              max_std_gust_time = Std_Data["times"][ixy]
                           };
                        };
                     };
                     if(max_std_gust_time!="-"){
                        str_gust_time = String(max_std_gust_time)
                        max_std_gust_time  = data["times"][New_Fid_WebDate].split("T")[0]
                        max_std_gust_time += "T"+str_gust_time.slice(0,2) +":"+ str_gust_time.slice(2,4)
                     };


                     /* 統整該測站的資訊 */
                     send_Data["wind_avg"]       = rTmp_A[0]
                     send_Data["wind_gust"]      = max_std_gust
                     send_Data["wind_time"]      = data["times"][New_Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_gust_time"] = max_std_gust_time
                     send_Data["wind_dir"]       = Std_Data["dir"][New_Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_dir_name"]  = deg2dir( send_Data["wind_dir"] )

                     console.log("#",data["stids"][key_stids]["city"],data["stids"][key_stids]["town"],data["stids"][key_stids]["name"],max_std_gust)
                     //val_A = cal_color2val(rTmp_A[0], max_std_gust)
                     val_A = cal_color2val("-", max_std_gust)
                     send_Data["wind_color"] = val_A
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], val_A ]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], send_Data]
                  }else{
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  };
                  TEMP_S["type"]  = "wind"
                  TEMP_S["time"]  = send_Data["wind_time"]
               }else{
                  TEMP_S["value"] =  [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  TEMP_S["ovalue"]=  [ th_std_info["lon"], th_std_info["lat"], missing_value]
               };
               CTS_Data_S[TEMP_S_name] = TEMP_S

               /* 比對 該站的平均風 是否有比該鄉鎮的目前記錄還高 */
               //var tmp_valA = parseFloat(TEMP_S["ovalue"][2]["wind_avg"])
               var tmp_valA = parseFloat(TEMP_S["ovalue"][2]["wind_gust"])
               var tmp_valB = parseFloat(TownMax_ref)
               elev_check = parseFloat( th_std_info["elev"] ) < elev_threshold
               if( tmp_valA  > tmp_valB && !isNaN( tmp_valA  )  && elev_check){
                  TownMax_ref       = tmp_valA
                  TownMax_Cls       = parseFloat(TEMP_S["ovalue"][2]["wind_color"])
                  TownMax_name      = key_stids
                  TownMax_time      = send_Data["wind_time"]
                  TownMax_avgW      = rTmp_A[0]
                  TownMax_gustW     = max_std_gust
                  TownMax_gust_time = send_Data["wind_gust_time"]
                  TownMax_dir_ind   = parseInt(rTmp_A[1]) + parseInt(New_Fid_WebDate)
                  TownMax_avgW_dir  = Std_Data["dir"][ TownMax_dir_ind]
                  Flag_Std = true
               };

            }else if(Std_Data="-"){
               if( typeof data["stids"][key_stids] == 'undefined'){return};
               var TEMP_S = {}
               var th_std_info = data["stids"][key_stids]
               console.log("##Lost station:", th_std_info["name"],key_stids )
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"]   = th_std_info["name"]
               TEMP_S["value"]  = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ovalue"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ref"]    = th_std_info
               CTS_Data_S[TEMP_S_name] = TEMP_S
            };
         }); /* End of Stids in Town */


         /* 計算Map1 : CTS_Data_F  */
         var TEMP_D = {}
         if(Flag_Std){  // 如果該鄉鎮 有測站存在 & 有數值 //
            var th_std_info = data["stids"][TownMax_name]

            var Rank_Std  = {}
            var dict_temp = {}
            dict_temp["name"]   = th_std_info["name"]
            dict_temp["ref"]    = th_std_info
            if( TownMax_ref > max_Town_avg ){
               Rank_Std["MaxVal"]          = TownMax_ref
               Rank_Std["MaxVal_avg"]      = TownMax_avgW
               Rank_Std["MaxVal_avg_time"] = TownMax_time
               Rank_Std["MaxVal_gust"]     = TownMax_gustW
               Rank_Std["MaxVal_gust_time"]= TownMax_gust_time
               Rank_Std["MaxVal_Cls"]      = TownMax_Cls
               Rank_Std["MaxVal_dir"]      = TownMax_avgW_dir
               Rank_Std["MaxVal_dir_name"] = deg2dir(TownMax_avgW_dir)
               Rank_Std["MaxVal_dir_ind"]  = TownMax_dir_ind
               Rank_Std["wind"]            = dict_temp
               max_Town_avg = TownMax_ref
            };

            var Flag_datatype_2 = (typeof data["wind"][TownMax_name] !== 'undefined')
            if( Flag_datatype_2 ){
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["value"] = TownMax_Cls
               TEMP_D["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], Rank_Std]
            }else{
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["time"]  = data["times"][New_Fid_WebDate]
               TEMP_D["value"] = missing_value
            };
         }else{
            TEMP_D["name"]  = key_citys + key_towns
            TEMP_D["time"]  = data["times"][New_Fid_WebDate]
            TEMP_D["value"] = missing_value
         };
         CTS_Data_F.push(TEMP_D)
      });
      /* End of 計算Map1 : CTS_Data_F  */
   });
   console.log("CTS_Data_F:",CTS_Data_F)
   console.log("CTS_Data_S:",CTS_Data_S)
   return [CTS_Data_F,CTS_Data_S]
};
/* End of 前1小時的陣風 */







/* 主表格 */
function get_Data_MainTable(Fid_WebDate){

   var CTS_Data_F = []
   var CTS_Data_S = {}
   Object.keys( stids_of_town_R).forEach(function(key_citys){
      Object.keys( stids_of_town_R[key_citys] ).forEach(function(key_towns){

         var missing_value = -9999
         var max_Wind_std = []
         var max_Gust_std = []
         var TownMax_name = ""
         var TownMax_ref  = -999
         var TownMax_Cls  = -999
         var TownMax_time = ""
         var TownMax_dir_ind = -999
         var max_Town_avg = -99
         var Flag_Std = false
         stids_of_town_R[key_citys][key_towns].forEach(function(key_stids){

            var Std_Data = data["wind"][key_stids]
            if( typeof Std_Data !== 'undefined'){
               var th_std_info = data["stids"][key_stids]
               var val_Aw = parseFloat( Std_Data["speed"][Fid_WebDate] )
               var val_Gw = parseFloat( Std_Data["gust"][Fid_WebDate] )

               var TEMP_S = {}
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"] = th_std_info["name"]
               TEMP_S["ref"]  = th_std_info
               TEMP_S["time"] = data["times"][Fid_WebDate]
               if(!isNaN(val_Aw) && !isNaN(val_Gw) && th_std_info["elev"]<elev_threshold ){

                  var send_Data = {}
                  var Flag_datatype = true
                  Flag_datatype = Flag_datatype && (typeof Std_Data !== 'undefined')
                  if( Flag_datatype ){
                     WebDate_Time  = WebDate.split("T")[1].replace(":","")
                     CheckDate_St  = data["times"][Fid_WebDate].split("T")[1].replace(":","")

                     /* 確認 指定時間 是否為最近的一個小時 */
                     Date_Cond = (WebDate.split("T")[0] == data["times"][Fid_WebDate].split("T")[0])
                     Date_Cond = Date_Cond && (WebDate_Time.slice(0,2) == CheckDate_St.slice(0,2) )
                     if( Date_Cond  ){
                        CheckDate_Et = parseInt(CheckDate_St) + 10
                        var rTmp_A  = get_ArrayMax_index( Std_Data["speed"].slice(Fid_WebDate,Fid_WebDate+1) )
                        var rTmp_G  = get_ArrayMax_index( Std_Data["gust"].slice(Fid_WebDate,Fid_WebDate+1) )
                     }else{
                        CheckDate_Et = data["times"][Fid_WebDate+6].split("T")[1].replace(":","")
                        var rTmp_A  = get_ArrayMax_index( Std_Data["speed"].slice(Fid_WebDate,Fid_WebDate+6) )
                        var rTmp_G  = get_ArrayMax_index( Std_Data["gust"].slice(Fid_WebDate,Fid_WebDate+6) )
                     };

                     /* 比對出 該測站的最大陣風 & 時間 */
                     max_std_gust = -99
                     max_std_gust_time = "-"
                     for(var ixy=0;ixy< Std_Data["times"].length;ixy++){
                        mTime = Std_Data["times"][ixy]
                        if( parseInt(mTime) >= parseInt(CheckDate_St) &&  parseInt(mTime) < parseInt(CheckDate_Et)){
                           if( parseFloat( Std_Data["gust"][ixy]) >= max_std_gust){
                              max_std_gust      = parseFloat( Std_Data["gust"][ixy])
                              max_std_gust_time = Std_Data["times"][ixy]
                           };
                        };
                     };
                     if(max_std_gust_time!="-"){
                        str_gust_time = String(max_std_gust_time)
                        max_std_gust_time  = data["times"][Fid_WebDate].split("T")[0]
                        max_std_gust_time += "T"+str_gust_time.slice(0,2) +":"+ str_gust_time.slice(2,4)
                     };

                     /* 統整該測站的資訊 */
                     send_Data["wind_avg"]       = rTmp_A[0]
                     send_Data["wind_gust"]      = max_std_gust
                     send_Data["wind_time"]      = data["times"][Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_gust_time"] = max_std_gust_time
                     send_Data["wind_dir"]       = Std_Data["dir"][Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_dir_name"]  = deg2dir( send_Data["wind_dir"] )

                     val_A = cal_color2val(rTmp_A[0], max_std_gust)
                     send_Data["wind_color"] = val_A
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], val_A ]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], send_Data]
                  }else{
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  };
                  TEMP_S["type"]  = "wind"
                  TEMP_S["time"]  = send_Data["wind_time"]
               }else{
                  TEMP_S["value"] =  [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  TEMP_S["ovalue"]=  [ th_std_info["lon"], th_std_info["lat"], missing_value]
               };
               CTS_Data_S[TEMP_S_name] = TEMP_S

               /* 比對 該站的平均風 是否有比該鄉鎮的目前記錄還高 */
               var tmp_valA = parseFloat(TEMP_S["ovalue"][2]["wind_avg"])
               var tmp_valB = parseFloat(TownMax_ref)
               elev_check = parseFloat( th_std_info["elev"] ) < elev_threshold
               if( tmp_valA  > tmp_valB && !isNaN( tmp_valA  )  && elev_check){
                  TownMax_ref       = tmp_valA
                  TownMax_Cls       = parseFloat(TEMP_S["ovalue"][2]["wind_color"])
                  TownMax_name      = key_stids
                  TownMax_time      = send_Data["wind_time"]
                  TownMax_avgW      = rTmp_A[0]
                  TownMax_gustW     = max_std_gust
                  TownMax_gust_time = send_Data["wind_gust_time"]
                  TownMax_dir_ind   = parseInt(rTmp_A[1]) + parseInt(Fid_WebDate)
                  TownMax_avgW_dir  = data["wind"][key_stids]["dir"][ TownMax_dir_ind]
                  Flag_Std = true
               };

            }else if(Std_Data="-"){
               if( typeof data["stids"][key_stids] == 'undefined'){return};
               var TEMP_S = {}
               var th_std_info = data["stids"][key_stids]
               console.log("##Lost station:", th_std_info["name"],key_stids )
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"]   = th_std_info["name"]
               TEMP_S["value"]  = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ovalue"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ref"]    = th_std_info
               CTS_Data_S[TEMP_S_name] = TEMP_S
            };
         }); /* End of Stids in Town */


         /* 計算Map1 : CTS_Data_F  */
         var TEMP_D = {}
         if(Flag_Std){  // 如果該鄉鎮 有測站存在 & 有數值 //
            var th_std_info = data["stids"][TownMax_name]

            var Rank_Std  = {}
            var dict_temp = {}
            dict_temp["name"]   = th_std_info["name"]
            dict_temp["ref"]    = th_std_info
            if( TownMax_ref > max_Town_avg ){
               Rank_Std["MaxVal"]          = TownMax_ref
               Rank_Std["MaxVal_avg"]      = TownMax_avgW
               Rank_Std["MaxVal_avg_time"] = TownMax_time
               Rank_Std["MaxVal_gust"]     = TownMax_gustW
               Rank_Std["MaxVal_gust_time"]= TownMax_gust_time
               Rank_Std["MaxVal_Cls"]      = TownMax_Cls
               Rank_Std["MaxVal_dir"]      = TownMax_avgW_dir
               Rank_Std["MaxVal_dir_name"] = deg2dir(TownMax_avgW_dir)
               Rank_Std["MaxVal_dir_ind"]  = TownMax_dir_ind
               Rank_Std["wind"]            = dict_temp
               max_Town_avg = TownMax_ref
            };

            var Flag_datatype_2 = (typeof data["wind"][TownMax_name] !== 'undefined')
            if( Flag_datatype_2 ){
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["value"] = TownMax_Cls
               TEMP_D["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], Rank_Std]
            }else{
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["time"]  = data["times"][Fid_WebDate]
               TEMP_D["value"] = missing_value
            };
         }else{
            TEMP_D["name"]  = key_citys + key_towns
            TEMP_D["time"]  = data["times"][Fid_WebDate]
            TEMP_D["value"] = missing_value
         };
         CTS_Data_F.push(TEMP_D)
      });
      /* End of 計算Map1 : CTS_Data_F  */
   });
   console.log("CTS_Data_F:",CTS_Data_F)
   console.log("CTS_Data_S:",CTS_Data_S)
   return [CTS_Data_F,CTS_Data_S]
};
/* End of 主表格 */




/* 今日最大風力 */
function get_Data_TodayMaxTable(Fid_WebDate){

   console.log("get_Data_TodayMaxTable:", data["times"][Fid_WebDate])
   New_Fid_WebDate = data["times"].indexOf( data["times"][Fid_WebDate].split("T")[0] + "T00:00" )
   console.log("New_WebDate:",data["times"][New_Fid_WebDate]  )

   var CTS_Data_F = []
   var CTS_Data_S = {}
   Object.keys( stids_of_town_R).forEach(function(key_citys){
      Object.keys( stids_of_town_R[key_citys] ).forEach(function(key_towns){

         var missing_value = -9999
         var max_Wind_std = []
         var max_Gust_std = []
         var TownMax_name = ""
         var TownMax_ref  = -999
         var TownMax_Cls  = -999
         var TownMax_time = ""
         var TownMax_dir_ind = -999
         var max_Town_avg = -99
         var Flag_Std = false
         stids_of_town_R[key_citys][key_towns].forEach(function(key_stids){

            var Std_Data = data["wind"][key_stids]
            if( typeof Std_Data !== 'undefined'){
               var th_std_info = data["stids"][key_stids]
               var val_Aw = parseFloat( Std_Data["speed"][New_Fid_WebDate] )
               var val_Gw = parseFloat( Std_Data["gust"][New_Fid_WebDate] )

               var TEMP_S = {}
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"] = th_std_info["name"]
               TEMP_S["ref"]  = th_std_info
               TEMP_S["time"] = data["times"][New_Fid_WebDate]
               if(!isNaN(val_Aw) && !isNaN(val_Gw) && th_std_info["elev"]<elev_threshold ){

                  var send_Data = {}
                  var Flag_datatype = true
                  Flag_datatype = Flag_datatype && (typeof Std_Data !== 'undefined')
                  if( Flag_datatype ){
                     WebDate_Time  = WebDate.split("T")[1].replace(":","")
                     End_id_time   = data["times"].length-1
                     CheckDate_St  = data["times"][New_Fid_WebDate].split("T")[1].replace(":","")
                     CheckDate_Et = data["times"][ End_id_time  ].split("T")[1].replace(":","")
                     var rTmp_A  = get_ArrayMax_index( Std_Data["speed"].slice(New_Fid_WebDate,CheckDate_Et) )
                     var rTmp_G  = get_ArrayMax_index( Std_Data["gust"].slice(New_Fid_WebDate,CheckDate_Et) )

                     /* 比對出 該測站的最大陣風 & 時間 */
                     max_std_gust = -99
                     max_std_gust_time = "-"
                     for(var ixy=0;ixy< Std_Data["times"].length;ixy++){
                        mTime = Std_Data["times"][ixy]
                        if( parseInt(mTime) >= parseInt(CheckDate_St) &&  parseInt(mTime) < parseInt(CheckDate_Et)){
                           if( parseFloat( Std_Data["gust"][ixy]) >= max_std_gust){
                              max_std_gust      = parseFloat( Std_Data["gust"][ixy])
                              max_std_gust_time = Std_Data["times"][ixy]
                           };
                        };
                     };
                     if(max_std_gust_time!="-"){
                        str_gust_time = String(max_std_gust_time)
                        max_std_gust_time  = data["times"][New_Fid_WebDate].split("T")[0]
                        max_std_gust_time += "T"+str_gust_time.slice(0,2) +":"+ str_gust_time.slice(2,4)
                     };

                     /* 統整該測站的資訊 */
                     send_Data["wind_avg"]       = rTmp_A[0]
                     send_Data["wind_gust"]      = max_std_gust
                     send_Data["wind_time"]      = data["times"][New_Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_gust_time"] = max_std_gust_time
                     send_Data["wind_dir"]       = Std_Data["dir"][New_Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_dir_name"]  = deg2dir( send_Data["wind_dir"] )

                     val_A = cal_color2val(rTmp_A[0], max_std_gust)
                     send_Data["wind_color"] = val_A
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], val_A ]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], send_Data]
                  }else{
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  };
                  TEMP_S["type"]  = "wind"
                  TEMP_S["time"]  = send_Data["wind_time"]
               }else{
                  TEMP_S["value"] =  [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  TEMP_S["ovalue"]=  [ th_std_info["lon"], th_std_info["lat"], missing_value]
               };
               CTS_Data_S[TEMP_S_name] = TEMP_S

               /* 比對 該站的平均風 是否有比該鄉鎮的目前記錄還高 */
               var tmp_valA = parseFloat(TEMP_S["ovalue"][2]["wind_avg"])
               var tmp_valB = parseFloat(TownMax_ref)
               elev_check = parseFloat( th_std_info["elev"] ) < elev_threshold
               if( tmp_valA  > tmp_valB && !isNaN( tmp_valA  )  && elev_check){
                  TownMax_ref       = tmp_valA
                  TownMax_Cls       = parseFloat(TEMP_S["ovalue"][2]["wind_color"])
                  TownMax_name      = key_stids
                  TownMax_time      = send_Data["wind_time"]
                  TownMax_avgW      = rTmp_A[0]
                  TownMax_gustW     = max_std_gust
                  TownMax_gust_time = send_Data["wind_gust_time"]
                  TownMax_dir_ind   = parseInt(rTmp_A[1]) + parseInt(New_Fid_WebDate)
                  TownMax_avgW_dir  = data["wind"][key_stids]["dir"][ TownMax_dir_ind]
                  Flag_Std = true
               };

            }else if(Std_Data="-"){
               if( typeof data["stids"][key_stids] == 'undefined'){return};
               var TEMP_S = {}
               var th_std_info = data["stids"][key_stids]
               console.log("##Lost station:", th_std_info["name"],key_stids )
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"]   = th_std_info["name"]
               TEMP_S["value"]  = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ovalue"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ref"]    = th_std_info
               CTS_Data_S[TEMP_S_name] = TEMP_S
            };
         }); /* End of Stids in Town */


         /* 計算Map1 : CTS_Data_F  */
         var TEMP_D = {}
         if(Flag_Std){  // 如果該鄉鎮 有測站存在 & 有數值 //
            var th_std_info = data["stids"][TownMax_name]

            var Rank_Std  = {}
            var dict_temp = {}
            dict_temp["name"]   = th_std_info["name"]
            dict_temp["ref"]    = th_std_info
            if( TownMax_ref > max_Town_avg ){
               Rank_Std["MaxVal"]          = TownMax_ref
               Rank_Std["MaxVal_avg"]      = TownMax_avgW
               Rank_Std["MaxVal_avg_time"] = TownMax_time
               Rank_Std["MaxVal_gust"]     = TownMax_gustW
               Rank_Std["MaxVal_gust_time"]= TownMax_gust_time
               Rank_Std["MaxVal_Cls"]      = TownMax_Cls
               Rank_Std["MaxVal_dir"]      = TownMax_avgW_dir
               Rank_Std["MaxVal_dir_name"] = deg2dir(TownMax_avgW_dir)
               Rank_Std["MaxVal_dir_ind"]  = TownMax_dir_ind
               Rank_Std["wind"]            = dict_temp
               max_Town_avg = TownMax_ref
            };

            var Flag_datatype_2 = (typeof data["wind"][TownMax_name] !== 'undefined')
            if( Flag_datatype_2 ){
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["value"] = TownMax_Cls
               TEMP_D["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], Rank_Std]
            }else{
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["time"]  = data["times"][New_Fid_WebDate]
               TEMP_D["value"] = missing_value
            };
         }else{
            TEMP_D["name"]  = key_citys + key_towns
            TEMP_D["time"]  = data["times"][New_Fid_WebDate]
            TEMP_D["value"] = missing_value
         };
         CTS_Data_F.push(TEMP_D)
      });
      /* End of 計算Map1 : CTS_Data_F  */
   });
   console.log("CTS_Data_F:",CTS_Data_F)
   console.log("CTS_Data_S:",CTS_Data_S)
   return [CTS_Data_F,CTS_Data_S]
};
/* End of 今日最大風力 */



/* 今日最大陣風 */
function get_Data_TodayMaxGustTable(Fid_WebDate){

   console.log("get_Data_TodayMaxTable:", data["times"][Fid_WebDate])
   New_Fid_WebDate = data["times"].indexOf( data["times"][Fid_WebDate].split("T")[0] + "T00:00" )
   console.log("New_WebDate:",data["times"][New_Fid_WebDate]  )

   var CTS_Data_F = []
   var CTS_Data_S = {}
   Object.keys( stids_of_town_R).forEach(function(key_citys){
      Object.keys( stids_of_town_R[key_citys] ).forEach(function(key_towns){

         var missing_value = -9999
         var max_Wind_std = []
         var max_Gust_std = []
         var TownMax_name = ""
         var TownMax_ref  = -999
         var TownMax_Cls  = -999
         var TownMax_time = ""
         var TownMax_dir_ind = -999
         var max_Town_avg = -99
         var Flag_Std = false
         stids_of_town_R[key_citys][key_towns].forEach(function(key_stids){

            var Std_Data = data["wind"][key_stids]
            if( typeof Std_Data !== 'undefined'){
               var th_std_info = data["stids"][key_stids]
               var val_Aw = parseFloat( Std_Data["speed"][New_Fid_WebDate] )
               var val_Gw = parseFloat( Std_Data["gust"][New_Fid_WebDate] )

               var TEMP_S = {}
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"] = th_std_info["name"]
               TEMP_S["ref"]  = th_std_info
               TEMP_S["time"] = data["times"][New_Fid_WebDate]
               if(!isNaN(val_Aw) && !isNaN(val_Gw) && th_std_info["elev"]<elev_threshold ){

                  var send_Data = {}
                  var Flag_datatype = true
                  Flag_datatype = Flag_datatype && (typeof Std_Data !== 'undefined')
                  if( Flag_datatype ){
                     WebDate_Time  = WebDate.split("T")[1].replace(":","")
                     End_id_time   = data["times"].length-1
                     CheckDate_St  = data["times"][New_Fid_WebDate].split("T")[1].replace(":","")
                     CheckDate_Et = data["times"][ End_id_time  ].split("T")[1].replace(":","")
                     var rTmp_A  = get_ArrayMax_index( Std_Data["speed"].slice(New_Fid_WebDate,CheckDate_Et) )
                     var rTmp_G  = get_ArrayMax_index( Std_Data["gust"].slice(New_Fid_WebDate,CheckDate_Et) )

                     /* 比對出 該測站的最大陣風 & 時間 */
                     max_std_gust = -99
                     max_std_gust_time = "-"
                     dim_times = Std_Data["times"].length
                     ixy_st = data["times"].indexOf(WebDate.split("T")[0]+"T00:00") 
                     for(var ixy=dim_times;ixy>ixy_st;ixy--){
                        mTime    = Std_Data["times"][ixy]
                        if( !isNaN(parseInt(mTime) || !isNaN(parseInt(Std_Data["times"][ixy-1]) ))){
                           if( parseFloat( Std_Data["gust"][ixy]) >= max_std_gust){
                              max_std_gust      = parseFloat( Std_Data["gust"][ixy])
                              max_std_gust_time = Std_Data["times"][ixy]
                           };
                        };
                     };
                     if(max_std_gust_time!="-"){
                        str_gust_time = String(max_std_gust_time)
                        max_std_gust_time  = data["times"][New_Fid_WebDate].split("T")[0]
                        max_std_gust_time += "T"+str_gust_time.slice(0,2) +":"+ str_gust_time.slice(2,4)
                     };

                     /* 統整該測站的資訊 */
                     send_Data["wind_avg"]       = rTmp_A[0]
                     send_Data["wind_gust"]      = max_std_gust
                     send_Data["wind_time"]      = data["times"][New_Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_gust_time"] = max_std_gust_time
                     send_Data["wind_dir"]       = Std_Data["dir"][New_Fid_WebDate + parseInt(rTmp_A[1])]
                     send_Data["wind_dir_name"]  = deg2dir( send_Data["wind_dir"] )

                     //val_A = cal_color2val(rTmp_A[0], max_std_gust)
                     val_A = cal_color2val("-", max_std_gust)
                     send_Data["wind_color"] = val_A
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], val_A ]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], send_Data]
                  }else{
                     TEMP_S["value"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
                     TEMP_S["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  };
                  TEMP_S["type"]  = "wind"
                  TEMP_S["time"]  = send_Data["wind_time"]
               }else{
                  TEMP_S["value"] =  [ th_std_info["lon"], th_std_info["lat"], missing_value]
                  TEMP_S["ovalue"]=  [ th_std_info["lon"], th_std_info["lat"], missing_value]
               };
               CTS_Data_S[TEMP_S_name] = TEMP_S

               /* 比對 該站的平均風 是否有比該鄉鎮的目前記錄還高 */
               var tmp_valA = parseFloat(TEMP_S["ovalue"][2]["wind_gust"])
               var tmp_valB = parseFloat(TownMax_ref)
               elev_check = parseFloat( th_std_info["elev"] ) < elev_threshold
               if( tmp_valA  > tmp_valB && !isNaN( tmp_valA  )  && elev_check){
                  TownMax_ref       = tmp_valA
                  TownMax_Cls       = parseFloat(TEMP_S["ovalue"][2]["wind_color"])
                  TownMax_name      = key_stids
                  TownMax_time      = send_Data["wind_time"]
                  TownMax_avgW      = rTmp_A[0]
                  TownMax_gustW     = max_std_gust
                  TownMax_gust_time = send_Data["wind_gust_time"]
                  TownMax_dir_ind   = parseInt(rTmp_A[1]) + parseInt(New_Fid_WebDate)
                  TownMax_avgW_dir  = data["wind"][key_stids]["dir"][ TownMax_dir_ind]
                  Flag_Std = true
               };

            }else if(Std_Data="-"){
               if( typeof data["stids"][key_stids] == 'undefined'){return};
               var TEMP_S = {}
               var th_std_info = data["stids"][key_stids]
               console.log("##Lost station:", th_std_info["name"],key_stids )
               TEMP_S_name = key_citys + key_towns +"_"+th_std_info["name"]
               TEMP_S["name"]   = th_std_info["name"]
               TEMP_S["value"]  = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ovalue"] = [ th_std_info["lon"], th_std_info["lat"], missing_value]
               TEMP_S["ref"]    = th_std_info
               CTS_Data_S[TEMP_S_name] = TEMP_S
            };
         }); /* End of Stids in Town */


         /* 計算Map1 : CTS_Data_F  */
         var TEMP_D = {}
         if(Flag_Std){  // 如果該鄉鎮 有測站存在 & 有數值 //
            var th_std_info = data["stids"][TownMax_name]

            var Rank_Std  = {}
            var dict_temp = {}
            dict_temp["name"]   = th_std_info["name"]
            dict_temp["ref"]    = th_std_info
            if( TownMax_ref > max_Town_avg ){
               Rank_Std["MaxVal"]          = TownMax_ref
               Rank_Std["MaxVal_avg"]      = TownMax_avgW
               Rank_Std["MaxVal_avg_time"] = TownMax_time
               Rank_Std["MaxVal_gust"]     = TownMax_gustW
               Rank_Std["MaxVal_gust_time"]= TownMax_gust_time
               Rank_Std["MaxVal_Cls"]      = TownMax_Cls
               Rank_Std["MaxVal_dir"]      = TownMax_avgW_dir
               Rank_Std["MaxVal_dir_name"] = deg2dir(TownMax_avgW_dir)
               Rank_Std["MaxVal_dir_ind"]  = TownMax_dir_ind
               Rank_Std["wind"]            = dict_temp
               max_Town_avg = TownMax_ref
            };

            var Flag_datatype_2 = (typeof data["wind"][TownMax_name] !== 'undefined')
            if( Flag_datatype_2 ){
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["value"] = TownMax_Cls
               TEMP_D["ovalue"]= [ th_std_info["lon"], th_std_info["lat"], Rank_Std]
            }else{
               TEMP_D["name"]  = key_citys + key_towns
               TEMP_D["time"]  = data["times"][New_Fid_WebDate]
               TEMP_D["value"] = missing_value
            };
         }else{
            TEMP_D["name"]  = key_citys + key_towns
            TEMP_D["time"]  = data["times"][New_Fid_WebDate]
            TEMP_D["value"] = missing_value
         };
         CTS_Data_F.push(TEMP_D)
      });
      /* End of 計算Map1 : CTS_Data_F  */
   });
   console.log("CTS_Data_F:",CTS_Data_F)
   console.log("CTS_Data_S:",CTS_Data_S)
   return [CTS_Data_F,CTS_Data_S]
};
/* End of 今日最大陣風 */





function Reform_Date(tStr){
   //7日7時00-50分
   var Replaced_DateString = tStr.replace("日","-").replace("時","-").replace("分","").split("-")
   var DataDate = data["times"][0].split("-")
   var ShowDate = WebDate.split("-")
   if( parseInt(DataDate[2]) == parseInt(Replaced_DateString[0]) ){
      var ClickDate = DataDate[0]+"-"+DataDate[1]+"-"+padLeft(Replaced_DateString[0],2)+"T"+ padLeft(Replaced_DateString[1],2)
   }else{
      var ClickDate = ShowDate[0]+"-"+ShowDate[1]+"-"+padLeft(Replaced_DateString[0],2)+"T"+ padLeft(Replaced_DateString[1],2)
   };
   if(Replaced_DateString.length>3){
      ClickDate += ":00"
   }else{
      ClickDate += ":"+Replaced_DateString[2]
   };
   //2021-08-07T07:00
   return ClickDate
};





function Phone_drag(elemnt){
   var mybox = elemnt
   mybox.addEventListener("touchmove",function(e){
      var touchLocation  = e.targetTouches[0]
      mybox.style.left = touchLocation.pageX + "px"
      mybox.style.top  = touchLocation.pageY + "px"
      e.preventDefault();
   });
   mybox.addEventListener("touchend",function(e){
      var x = parseInt(mybox.style.left)
      var y = parseInt(mybox.style.top)
   });
};


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {  
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
        elmnt.onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
/* End of Add Echart Plot Var and Map */




