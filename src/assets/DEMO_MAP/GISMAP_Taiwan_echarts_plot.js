var Echarts_MAP = function(inData, title_str, Flag_Light, Flag_HighTemp, Flag_Static, Flag_Select) {


   /* Initial Div*/
   $('#taiwan_map').show()
   $('#city_map').hide()

   console.log("inData:",inData)

   var str_Title = title_str.replace(/\s*/g,"")
   var my_str_Title = str_Title
   var Flag_RT = false
   if( Flag_Select=="MainTable" ){
      my_str_Title = "風力："+str_Title
      Flag_RT = true
   }else if(Flag_Select=="NowTable"){
      my_str_Title = "日前風力："+str_Title
      Flag_RT = true
   }else if(Flag_Select.indexOf("LastHour")>=0 ){
      my_str_Title = "前一小時陣風："+str_Title.split(":")[0]+":00~"
   }else if(Flag_Select.indexOf("Today")>=0 && Flag_Select.indexOf("Gust")<0 ){
      my_str_Title = "今日最大風力："+str_Title.split("T")[0]
   }else if(Flag_Select.indexOf("Today")>=0 && Flag_Select.indexOf("Gust")>=0 ){
      my_str_Title = "今日最大陣風："+str_Title.split("T")[0]
   }else{
      my_str_Title = str_Title
   };
   

   check_value = function(iVal){
      if(iVal <0 || typeof iVal == 'undefined' ){
         return "-"
      }else{
         return iVal
      };
   };


   var str_subTitle = $("label#init_time").text().replace(/\(|\)/g,"")
   str_subTitle = "鄉鎮為主"

   /* User Defined Data */
   var tUnit ="°C"
   var tUnit ="ms\u207B\u00B9"
   var missing_value = -9999.0
   var Legend = {"Title_Top":"","Title_Bottom":""}
   var Title = {
          "Map1":{
             "text":my_str_Title,
             "subtext": str_subTitle
          }
       }

   var pieces_data = [
      {gte: 7,label:'12G14',symbol:'rect', color:'indigo'},
      {gte: 6, lt: 7, label:'10G13',symbol:'rect', color:'fuchsia'},
      {gte: 5, lt: 6, label:'8G11',symbol:'rect', color:'red'},
      {gte: 4, lt: 5, label:'7G10',symbol:'rect', color:'orange'},
      {gte: 3, lt: 4, label:'6G9',symbol:'rect', color:'yellow'},
      {gte: 2, lt: 3, label:'5G7',symbol:'rect', color:'aquamarine'},
      {gte: 1, lt: 2, label:'4G6',symbol:'rect', color:'lightcyan'},
      //{gte: 0, lt: 1, label:'',symbol:'', color:'lightgray'},
      {lt: 0,label: '無資料 or elev ≧ 350m', color:'#E3E3E3',symbol:'rect'}
   ]


   if(title_str.indexOf("現在")<0 ){
      var L1_Series_Item_BorederColor = "#D3D3D3"
   }else{
      var L1_Series_Item_BorederColor = "white"
   };
   $("label#header_title").text("風力監測(10分鐘資料)")

   var VisualMap_param = {}
   VisualMap_param["label_left"] = "5%"
   var output_name = "風力監測_"+str_Title


   xx=600; yy=750;
   var Browser_Height = document.body.clientHeight
   if(Browser_Height*0.9 < yy){
      VisualMap_param["itemWidth"] = "16"
      VisualMap_param["itemHeight"] = "10"
      VisualMap_param["textStyle_width"] = "16"
      VisualMap_param["textStyle_fontSize"] = "12"
   }else{
      VisualMap_param["itemWidth"] = "16"
      VisualMap_param["itemHeight"] = "10"
      VisualMap_param["textStyle_width"] = "20"
      VisualMap_param["textStyle_fontSize"] = "16"
   };
   

   var Roam_Status = false
   var Roam_Status = true
 
   var SVG_GoBack = 'path://M384.834,180.699c-0.698,0-348.733,0-348.733,0l73.326-82.187c4.755-5.33,4.289-13.505-1.041-18.26c-5.328-4.754-13.505-4.29-18.26,1.041l-82.582,92.56c-10.059,11.278-10.058,28.282,0.001,39.557l82.582,92.561c2.556,2.865,6.097,4.323,9.654,4.323c3.064,0,6.139-1.083,8.606-3.282c5.33-4.755,5.795-12.93,1.041-18.26l-73.326-82.188c0,0,348.034,0,348.733,0c55.858,0,101.3,45.444,101.3,101.3s-45.443,101.3-101.3,101.3h-61.58c-7.143,0-12.933,5.791-12.933,12.933c0,7.142,5.79,12.933,12.933,12.933h61.58c70.12,0,127.166-57.046,127.166-127.166C512,237.745,454.954,180.699,384.834,180.699z'

   var SVG_eye = 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891'

   var SVG_eye_off = 'path://M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z'

   var SVG_Color = 'path://yM9.005 327.695l267.084-268.77 4.036 4.005c20.119-19.908 46.743-30.9 75.084-30.931 0 0 0 0 .03 0 28.552 0 55.447 11.144 75.656 31.353 20.239 20.209 31.383 47.074 31.383 75.716 0 28.341-11.023 54.965-30.931 75.084l66.5 66.53c9.126 9.156 14.155 21.263 14.155 34.124 0 12.921-5 24.998-14.065 34.033l-144.896 146.341c-9.095 9.096-21.203 14.125-34.063 14.125-12.921 0-25.028-5.06-34.124-14.185l-167.394-167.394-108.454-.03zM432.158 139.038c0-20.54-8.011-39.846-22.558-54.393-14.547-14.516-33.822-22.528-54.362-22.528-.03 0-.03 0-.03 0-20.299 0-39.333 7.891-53.79 22.106l108.604 108.635c14.246-14.487 22.136-33.521 22.136-53.82zM306.206 473.856c3.404 3.404 7.981 5.331 12.8 5.331s9.367-1.868 12.709-5.24l109.508-110.652h-245.579l110.562 110.562zM165.526 333.176h305.543l5.511-5.602c3.433-3.404 5.3-7.921 5.3-12.74 0-4.849-1.898-9.397-5.331-12.86l-200.403-200.403-194.801 196.036 48.61.03 35.569 35.539zM39.514 392.177l12.258-18.191 12.589 18.01c9.608 13.764 41.05 60.567 41.05 84.269 0 29.063-23.642 52.706-52.706 52.706s-52.706-23.673-52.706-52.736c0-23.552 30.238-70.295 39.514-84.058zM52.706 498.824c12.438 0 22.588-10.149 22.588-22.588 0-7.228-10.511-27.708-23.07-47.917-12.047 20.179-22.106 40.629-22.106 47.917 0 12.438 10.149 22.588 22.588 22.588z'

   var SVG_ZoomIn = 'path://M500.074 1.25l-155.798 155.798c29.365 34.244 47.255 78.607 47.255 127.187 0 107.942-87.823 195.764-195.764 195.764-52.315 0-101.466-20.36-138.451-57.344-36.984-36.954-57.314-86.137-57.314-138.421 0-107.942 87.823-195.764 195.764-195.764 48.549 0 92.943 17.89 127.217 47.255l155.798-155.798 21.293 21.324zM195.764 118.588c-91.347 0-165.647 74.3-165.647 165.647 0 44.273 17.197 85.865 48.489 117.158 31.292 31.262 72.885 48.489 117.157 48.489 91.347 0 165.647-74.3 165.647-165.647 0-91.347-74.3-165.647-165.647-165.647zM210.823 299.294h60.235v-30.117h-60.236v-60.236h-30.118v60.236h-60.236v30.118h60.236v60.236h30.118v-60.236z'

   var SVG_ZoomOut = 'path://M500.074 2.093l-155.798 155.798c29.365 34.244 47.255 78.637 47.255 127.187 0 107.942-87.823 195.764-195.764 195.764-52.284 0-101.466-20.36-138.481-57.314-36.955-36.984-57.314-86.166-57.284-138.451 0-107.942 87.823-195.764 195.764-195.764 48.549 0 92.973 17.89 127.217 47.255l155.798-155.798 21.293 21.324zM195.764 119.432c-91.317 0-165.647 74.3-165.647 165.647-0.030 44.273 17.197 85.865 48.489 117.127 31.262 31.292 72.885 48.519 117.157 48.519 91.317 0 165.647-74.3 165.647-165.647 0-91.317-74.33-165.647-165.647-165.647zM120.471 300.137h150.588v-30.118h-150.588v30.118z'


   var SVG_Image = 'path://M30.118 30.118v451.764h451.764v-451.764h-451.764zM451.765 451.764h-391.529v-60.236h391.529v60.236zM60.237 361.412v-301.176h391.529v301.176h-391.529zM427.762 306.146l-20.992 21.594-72.794-70.746-46.803 50.477-74.873-132.97-102.43 149.836-24.877-16.986 129.807-189.832 78.426 139.204 39.665-42.827 94.87 92.25z'

   var SVG_ImageB = 'path://M391.529 316.235v-301.176h-391.529v391.529h391.529v-90.353zM30.117 45.177h331.294v240.941h-22.739l-77.221-99.961-34.906 36.563-67.704-116.887-107.701 180.284h-21.022v-240.941zM300.635 286.118h-214.407l72.222-120.892 62.163 107.339 38.4-40.267 41.623 53.82zM30.117 376.471v-60.236h331.294v60.236h-331.294zM512 105.412v391.529h-391.529v-59.753h30.118v29.636h331.294v-331.294h-60.236v-30.118h90.353z'

  var SVG_1="path://M376 512v-512h-99.902l-3.56 9.932c-9.419 26.294-27.202 49.746-52.837 69.697-26.528 20.684-51.211 34.849-73.359 42.1l-10.342 3.383v114.771l19.702-6.519c36.387-12.012 69.448-29.268 98.672-51.445v330.081z"

  var SVG_3="path://M363.395 231.083c33.926-25.107 51.079-56.792 51.079-94.526 0-66.636-60.732-136.557-162.378-136.557-158.476 0-167.63 144.392-171.108 151.117l118.74 19.087c1.679-4.734-1.149-65.142 49.658-65.142 45.748 0 47.476 48.183 27.715 67.441-13.91 13.568-22.534 11.392-65.405 14.78l-15.601 109.058c14.685-3.471 39.459-12.041 61.758-12.041 25.591 0 51.416 18.164 51.416 58.755 0 43.682-27.524 63.237-54.8 63.237-57.998 0-55.866-65.857-57.524-70.195l-121.787 13.975c1.564 3.002 3.976 161.928 179.985 161.928 101.895 0 181.699-73.085 181.699-165.092 0-52.207-27.934-94.936-73.447-115.825z"

  var SVG_6="path://M207.528 187.158c6.797-50.501 21.724-82.211 58.418-82.211 16.025 0 34.995 4.49 39.39 39.523l1.816 14.535 122.314-12.844-2.798-15.76c-14.574-82.238-71.073-130.401-154.994-130.401-126.182 0-195.674 92.76-195.674 259.368 0 162.263 66.138 252.632 186.24 252.632 102.305 0 173.76-72.685 173.76-175.335-.015-146.489-147.158-200.781-228.472-149.507zm54.712 76.875c32.93 0 51.064 26.14 51.064 73.594 0 31.374-8.042 68.783-46.348 68.783-26.382 0-54.771-24.041-54.771-76.802.002-41.053 18.708-65.575 50.055-65.575z"

  var SVG_24='path d="m256 329c0-7 7-12 18-18 12-6 21-13 21-29 0-18-12-29-33-29-18 0-31 9-37 15l13 14c5-5 13-10 21-10 7 0 12 3 12 11 0 11-11 16-23 21-19 8-23 20-23 44l70 0 0-19zm0 0m107-20 0-55-15 0-43 55 0 19 37 0 0 20 21 0 0-20 12 0 0-19zm-19 0-18 0 18-23zm0 0"/'

  var SVG_Comb='path d="M0 0h7v7h-7v-7zM9 0v7h7v-7h-7zM0 16h7v-7h-7v7zM9 16h7v-7h-7v7z"'


   var myData = inData["FData"]

   /* End of User Defined Data */


   btn_plus_event = function(iTHIS){
      console.log("btn_plus_event")
      //var iCity_Town = iTHIS.name
      //var CITY_name = iCity_Town.substr(0,3)
      //var TOWN_name = iCity_Town.substr(3,6)
      //console.log("btn_plus_event:",iCity_Town,CITY_name,TOWN_name)
      var event_JSON = JSON.parse(iTHIS.name)
      var CITY_name = event_JSON.name.substr(0,3)
      var nOption = chart.getOption()
      //nOption.series[0]["data"][event_JSON.dataIndex]["value"] += 1
      nOption.series[0]["data"].forEach(function(iVV,index){
         if(iVV.name.indexOf(CITY_name)>=0){
            nOption.series[0]["data"][index]["value"] += 1
         };
      });
      chart.setOption(nOption)
   };

   btn_minus_event = function(iTHIS){
      console.log("btn_minus_event")
      //console.log(iTHIS)
      //console.log(iTHIS.name)
      var event_JSON = JSON.parse(iTHIS.name)
      //console.log("myData:",myData)
      //console.log(event_JSON)
      //console.log(myData[event_JSON.dataIndex]["value"] )
      var nOption = chart.getOption()
      //console.log(nOption)
      nOption.series[0]["data"][event_JSON.dataIndex]["value"] -= 1
      chart.setOption(nOption)
      //var iCity_Town = iTHIS.name
      //var CITY_name = iCity_Town.substr(0,3)
      //var TOWN_name = iCity_Town.substr(3,6)
      //console.log("btn_minus_event:",iCity_Town,CITY_name,TOWN_name)
   };



   /* Initialize Chart Map */
   echarts.registerMap('ctaiwan',cTaiwan, map_appendix_City)
   echarts.registerMap('taiwan', mapJson, map_appendix_Town)
   var chart = echarts.init(document.getElementById('taiwan_map'));

   chart.setOption({
      tooltip: {
         trigger: "item",
         padding: "11",
         enterable: true,
         hideDelay: 100000,
         triggerOn: "mousemove|click",
         triggerOn: "click",
         triggerEvent:true,
         formatter: function (result){
            var tip = "<span style='text-align: center; box-shadow: rgba(0, 0, 0, 0.2) 1px 2px 10px;border-width: 1px; border-radius: 14px;display:block;background-color:white;font-weight:normal;padding: 10px; border-color:"+result.color+"'><font color='black' align='center'>"
            tip += "<button id='btn_plus' name='"+JSON.stringify(result)+"' onclick='btn_plus_event(this)'><i class='ti-plus'></i></button>&nbsp;<button id='btn_minus' name='"+JSON.stringify(result)+"' onclick='btn_minus_event(this)'><i class='ti-minus'></i></button><br>"
            var dist_name  = result.name
            var dist_Cname = dist_name.substr(0,3)
            ref_list = ["縣","市"]
            if( dist_name.indexOf( dist_Cname) >=0 ){
               tip += dist_Cname+" - "+ dist_name.substr(3)
            }else{
               tip += dist_Cname+" - "+ dist_name
            };
            if( result.data.value > -99  ){
               if( Object.keys(result.data.ovalue[2]).length >1 ){
                  var show_std_list = []
                  var mnList = ["wind"]
                  mnList.forEach(function(iL){
                     var tip_std = result.data["ovalue"][2][iL]["ref"]
                     if( !show_std_list.includes(tip_std["name"]) ){ 
                        show_std_list.push(tip_std["name"])
                        tip += "<br /><font color='darkgray' align='center'>" +tip_std["name"] +" (" +tip_std["stid5"]+ ")</font>"
                     };
                  });
               }else{
                     tip += "<br /><font color='darkgray' align='center'>" +result.data.ref["name"] +" (" +result.data.ref["stid5"]+ ")</font>"
               };
            };
            tip += "<br /><hr width='90%' style='background-color:darkgray; height:1px; border:none;'>"

            if(Flag_Select.indexOf("Table")>=0 ){
               if(typeof result.data !== 'undefined'){
                  if(result.data.value > -99){
                     var mnList = ["wind"]
                     var roData = result.data["ovalue"][2]
                     mnList.forEach(function(iL){
                        var rain_Val = roData[iL]["ovalue"]
                        if(rain_Val == -99){ 
                           rain_Val = "-" 
                        };
                        WindScale = ms2scale(roData["MaxVal_avg"])+"G"+ms2scale(roData["MaxVal_gust"])
                        WindScale_A = ms2scale(roData["MaxVal_avg"])+"級 "
                        WindScale_G = ms2scale(roData["MaxVal_gust"])+"級 "
                        tip += "<i class='icon-weather-windy' style='color:black'></i>&nbsp;&nbsp;"+WindScale +" , "+roData["MaxVal_dir_name"] 
                        tip += "&nbsp;&nbsp;<i class='wi wi-wind wi-towards-"+roData["MaxVal_dir_name"]+"' style='color:black;font-size:130%;vertical-align:middle;'></i>"+ "<br />"
                        tip += "風力" +" : "+WindScale_A+ roData["MaxVal_avg"] +" <font size='1' color='darkgray'>ms\u207B\u00B9"+ "</font>, "+roData["MaxVal_avg_time"].split("T")[1]
                        tip += "<br />"
                        tip += "陣風" +" : "+WindScale_G+ roData["MaxVal_gust"] +" <font size='1' color='darkgray'>ms\u207B\u00B9"+ "</font>, "+roData["MaxVal_gust_time"].split("T")[1]
                        tip += "<br />"
                     });
                     tip += "</font></span>"
                  }else{
                     tip += "No Data"
                     tip += "</font></span>"
                  };
               }else{
                  tip += "No Data"
                  tip += "</font></span>"
               };
               return tip
            }else{
               if(result.value== missing_value || isNaN(parseFloat(result.value)) ){
                  tip += "No Data"
                  tip += "</font></span>"
               }else{
                  if(Flag_Static){
                     tip += "<i class='icon-weather-windy' style='color:black'></i>&nbsp;&nbsp;"+result.data.ovalue[2].toFixed(1)
                  }else{
                     tip += "<i class='icon-weather-windy' style='color:black'></i>&nbsp;&nbsp;"+result.value.toFixed(1) 
                  };

                  tip += "&nbsp;"+tUnit+"</font>"
                  tip += "<br \><i class='ti-time'></i>&nbsp;"+result.data.time.split("T")[1]+"</font>"
               };
               return tip
            };
         } 
         
      },
      toolbox:{
         show : true,
         right:"5%",
         feature:{
            myMore:{
               show: true,
               title:'Change BorderColor',
               icon: SVG_Color,
               onclick:function(e){
                  var current_BorderColor = e.option.series[0].itemStyle.borderColor
                  if(current_BorderColor=="white"){
                     var new_BorderColor="#D3D3D3"
                  }else{
                     var new_BorderColor="white"
                  };
                  var option = chart.getOption()
                  option.series[0].itemStyle.borderColor = new_BorderColor
                  chart.setOption(option)
               }
            },
            myMore2:{
               show:true,
               title:'Hide Label/Legend',
               icon: SVG_eye,
               onclick:function(e){
                  var current_Option = chart.getOption()
                  var VMap_Selected = current_Option.visualMap[0].selected
                  var Flag_show = current_Option.visualMap[0].show
                  if(Flag_show){
                     var Icon_EYE = SVG_eye_off
                     var Title_EYE = 'Show Label/Legend'
                  }else{
                     var Icon_EYE = SVG_eye
                     var Title_EYE = 'Hide Label/Legend'
                  };
                  chart.setOption(option = {
                     toolbox : {feature:{myMore2:{icon: Icon_EYE,title:Title_EYE}}},
                     series :{ label: {show: !Flag_show}},
                     visualMap: {
                         show: !Flag_show,
                         selected:VMap_Selected
                     }
                  });
               }
            },
            restore:{show:true},
            dataView:{show:true},
            myMore3:{
               show:true,
               title:'切換輸出\n圖背為透明',
               icon: SVG_ImageB,
               onclick:function(e){
                  var current_Option = chart.getOption()
                  var Flag_show = current_Option.toolbox[0].feature["myMore3"].title.indexOf("透明")>=0
                  if(Flag_show){
                     var Icon_EYE = SVG_Image
                     var Title_EYE = '切換輸出\n圖背為白底'
                     var ImageBG_Trans = 'transparent'
                  }else{
                     var Icon_EYE = SVG_ImageB
                     var Title_EYE = '切換輸出\n圖背透明'
                     var ImageBG_Trans = 'white'
                  };
                  chart.setOption(option = {
                     toolbox : {feature:{myMore3:{icon: Icon_EYE,title:Title_EYE},saveAsImage:{backgroundColor:ImageBG_Trans}}},
                  });
               }
            },
            saveAsImage: {name:output_name,pixelRatio:3,backgroundColor:"white",excludeComponents:["dataView","toolbox"]}
         }
      },
      visualMap: {
         left: 'right',
         text: [Legend["Title_Top"], Legend["Title_Bottom"]],
         calculable: true,
         type : 'piecewise',
         showLabel:true,
         itemWidth :  VisualMap_param["itemWidth"],
         itemHeight:  VisualMap_param["itemHeight"],
         align : 'auto',
         itemSymbol : 'roundRect',
         bottom: '3%',
         left:  VisualMap_param["label_left"],
         //left: '80%',
         precision:0,
         textStyle: {
            width: VisualMap_param["textStyle_width"],
            overglow : "truncate",
            //fontWeight : 'bold',
            fontSize : VisualMap_param["textStyle_fontSize"]
         },
         //backgroundColor : 'white',
         borderColor : 'darkgray',
         borderWidth : 0,
         //borderWidth : 1,
         pieces : pieces_data
      }, 
      title:{
         text: Title["Map1"]["text"],
         subtext: Title["Map1"]["subtext"],
         textStyle:{fontSize:16, fontWeight:"bold"},
         //x:'right',
         //y:'top',
         left: "center",
         //left: "right",
         textAlign:'center'
      },
      geo:{
         show:true,
         roam: Roam_Status,
         map:'ctaiwan',
         boundingCoords:[ [118,26.5], [122.4,21.5] ],
         center: [120.3, 23.8],
         layoutCenter: ['50%', '50%'],
         left: '0%', 
         aspectScale:1,
         scaleLimit: { min: 1.4, max: 12.0 },
         zlevel: 1,
         itemStyle: {
            normal:{
               areaColor: "transparent",
               borderColor: 'black',
               borderWidth:1
            }
         },             
         silent:true
      },
      series: [{
         type: 'map',
         roam: Roam_Status,
         map: 'taiwan',
         boundingCoords:[ [118,26.5], [122.4,21.5] ],
         center: [120.3, 23.8],
         layoutCenter: ['50%', '50%'],
         aspectScale:1,
         scaleLimit: { min: 1.4, max: 12.0 },
         left: '0%', 
         itemStyle:{
            normal:{
               color: "lightgray",
               //borderColor : 'white',
               borderColor : L1_Series_Item_BorederColor,
               borderWidth: 0.5
            },
            emphasis: {
               shadowColor: 'rgba(5, 5, 0, 0.5)', 
               shadowBlur: 10,
               borderWidth:2,
               borderColor:'#fff',
               areaColor: '#fff',
               label: {
                  show: true,
                  textStyle: {
                      color: '#fff'
                  }
               }
            }   
         }, 
         label: {
            color: "#000",
            normal: {
               show: true,
               borderColor:"white",
               fontSize:18,
               color:"#FFF",
               textBorderColor:["darkgray","#337DFF"][1],
               textBorderWidth:3,
               textShadowBlur:9,
               textShadowColor:["white","#337DFF","#33CFFF"][2],
               textShadowOffsetX:0,
               textShadowOffsetY:0,
               formatter: function (result){
                  res_list = ["aquamarine","lightcyan","silver","none"]
                  if(result["color"].indexOf("rgba")>=0 ){
                     return ""
                  }else if( res_list.includes(result["color"]) ){
                     return ""
                  };
                  try{
                     dir_str  = result["data"]["ovalue"][2]["MaxVal_dir_name"]
                     WindData = result["data"]["ovalue"][2]
                     if(Flag_Select=="LastHourGustTable" || Flag_Select=="TodayMaxGustTable"){
                        avgW_str = result["data"]["ovalue"][2]["MaxVal_gust"]
                        avgW_str = "G"+ms2scale(WindData["MaxVal_gust"])
                     }else{
                        avgW_str = result["data"]["ovalue"][2]["MaxVal_avg"]
                        avgW_str = ms2scale(WindData["MaxVal_avg"])+"G"+ms2scale(WindData["MaxVal_gust"])
                        avgW_str = ms2scale(WindData["MaxVal_avg"])+"."+ms2scale(WindData["MaxVal_gust"])
                     };
                     if(dir_str=="N"){
                        dir_symbol = "↓ "+avgW_str
                     }else if(dir_str=="W"){
                        dir_symbol = "→ "+avgW_str
                     }else if(dir_str=="S"){
                        dir_symbol = "↑ "+avgW_str
                     }else if(dir_str=="E"){
                        dir_symbol = "← "+avgW_str
                     }else if(dir_str.indexOf("NE")>=0 ){
                        dir_symbol = "↙ "+avgW_str
                     }else if(dir_str.indexOf("NW")>=0 ){
                        dir_symbol = "↘ "+avgW_str
                     }else if(dir_str.indexOf("SE")>=0 ){
                        dir_symbol = "↖ "+avgW_str
                     }else if(dir_str.indexOf("SW")>=0 ){
                        dir_symbol = "↗ "+avgW_str
                     }else{
                        dir_symbol = ""
                     };
                  }catch(err){
                     dir_symbol = ""
                  };
                  if(Flag_Select=="LastHourGustTable" || Flag_Select=="TodayMaxGustTable"){
                     if(dir_symbol!=""){
                        return dir_symbol.split(" ")[1]
                     }else{
                        return dir_symbol
                     };
                  }else{
                     return dir_symbol
                  };
               }
            },
            emphasis: {
               show: false
            },
            fontSize : "22",
            backgroundColor : "transparent",
            borderWidth: 3
         },
         select:{
            label: {
               show: false
            },
            itemStyle: function(val){
               return val;
            }
         },
         markArea: {label:{show:false}},
         nameProperty: 'name',
         data : myData
      }],
      markArea:{
         label:{show:true},
         itemStyle:{color:"black",borderColor:"black",borderWidth:3}
      }
      
   })/* End of chart.setOption */


   //var th_option = chart.getOption()
   //th_option.visualMap[0].selected[7] = false
   //chart.setOption(th_option);


   /* Detect roam (Zoom , drag) event*/
   chart=echarts.init(document.getElementById('taiwan_map'));
   chart.on('georoam',function(params){
      var option = chart.getOption();
      var o_Series_center = option.series.center
      var o_geo_center    = option.geo.center
   	  if(params.zoom!=null&&params.zoom!=undefined){ 
   	     option.series[0].zoom=option.geo[0].zoom;
   	     option.series[0].center=option.geo[0].center;
   	  }else{
         option.series[0].center=option.geo[0].center;
   	  }
   	  chart.setOption(option);
   });
   /* End of Detect roam (Zoom , drag) event*/





   
   var myChartProe = echarts.init(document.getElementById('city_map'));									

   /* Click to Level 2 (TOWN view)  */	   
   //chart.on('click', function (result) {
   chart.on('dbclick', function (result) {

      setTimeout(function (){
         $('#taiwan_map').hide()
         $('#city_map').show()
            }, 500);
   
      var selectProe_name = result.name;
      //selectProe = result.data["Cname"];
      selectProe_name = result.name.substr(0,3);
      console.log(selectProe_name," is selected.")
      var output_name_L2 = output_name+"_"+selectProe_name

      var Citymap = Citymap_All[selectProe_name]
      echarts.registerMap(selectProe_name, Citymap);
     
      var tr_name = "tr#"+selectProe_name
      $(tr_name).attr("style","border:2px MediumVioletRed   solid; box-shadow: darkgrey 1px 1px 10px 3px;")


      var reduceData = []
      var L2_Data = inData["STD_Data"]
      Object.keys(L2_Data).forEach( function(key) {
         if( key.indexOf(selectProe_name)>=0 ){
            var outData = L2_Data[key]
            if( String(outData["value"][2]).indexOf("-")>=0){
               outData["value"][2] = -9999
            };
            reduceData.push( outData )
         };
      });
      console.log("ReduceData:",reduceData)


      myChartProe.setOption({
         tooltip: {
            trigger: "item",
            padding: "11",
            triggerOn: "click",
            formatter: function (result){
               var tip = "<span style='text-align: center; box-shadow: rgba(0, 0, 0, 0.2) 1px 2px 10px;border-width: 1px; border-radius: 14px;display:block;background-color:white;font-weight:normal;padding:11px;border-color:"+result.color+"'><font color='black' align='center'>"
               var dist_name = result.name
               var dist_data = result.data
               tip += dist_name
               tip += "<br /><font color='gray'>( "+dist_data.ref["stid5"]+" )</font>"
               tip += "<br /><hr width='90%' style='background-color:darkgray; height:1px; border:none;'>"

               spec_Type = "wind_"+["avg","gust"][0]
               if(Flag_Select.indexOf("Table")>=0){
                  if(typeof result.data !== 'undefined'){
                     if(result.data.value.length>1){
                        var roData = result.data["ovalue"][2]
                        if( typeof roData !== 'undefined' && roData!=-9999 ){
                           var wind_Val = roData[spec_Type]
                              if(wind_Val < 0){
                                 wind_Val = "-"
                              };
                              WindScale = ms2scale(roData["wind_avg"])+"G"+ms2scale(roData["wind_gust"])
                              WindScale_A = ms2scale(roData["wind_avg"])+"級 "
                              WindScale_G = ms2scale(roData["wind_gust"])+"級 "
                              
                              tip += "<i class='icon-weather-windy' style='color:black'></i>&nbsp;&nbsp;"+WindScale +" , "+roData["wind_dir_name"] 
                              tip += "&nbsp;&nbsp;<i class='wi wi-wind wi-towards-"+roData["wind_dir_name"]+"' style='color:black;font-size:130%;vertical-align:middle;'></i>"+ "<br />"
                              tip += "風力" +" : "+check_value(WindScale_A)+ check_value(roData["wind_avg"]) +" <font size='1' color='darkgray'>ms\u207B\u00B9"+ "</font>, "+ check_value(roData["wind_time"].split("T")[1])
                              tip += "<br />"
                              tip += "陣風" +" : "+check_value(WindScale_G)+ check_value(roData["wind_gust"]) +" <font size='1' color='darkgray'>ms\u207B\u00B9"+ "</font>, "+ check_value(roData["wind_gust_time"].split("T")[1])
                              tip += "<br />"
                        }else{
                           tip += "No Data"
                           tip += "</font></span>"
                        };
                     }else{
                        tip += "No Data"
                        tip += "</font></span>"
                     };
                  }else{
                     tip += "No Data"
                     tip += "</font></span>"
                  };
                  return tip
               }else{
                  if(result.value[2]== missing_value){
                     tip += "&nbsp;&nbsp;&nbsp;No Data"
                     tip += "</font>&nbsp;&nbsp;&nbsp;</span>"
                  }else{
                     if(Flag_Static){
                        tip += "<i class='icon-weather-windy' style='color:black'></i>&nbsp;&nbsp;"+result.data.ovalue[2].toFixed(1)
                     }else{
                        tip += "<i class='icon-weather-windy' style='color:black'></i>&nbsp;&nbsp;"+result.value.toFixed(1) 
                     };
                     tip += "&nbsp;"+tUnit+"</font>"
                     tip += "<br \><i class='ti-time'></i>&nbsp;"+result.data.time.split("T")[1]+"</font>"
                  };
                  return tip
               };
            }
         },
         toolbox:{
            show : true,
            right: "5%",
            feature:{
               myMore:{
                  show:true,
                  title:'Back To Taiwan Scope',
                  icon:SVG_GoBack,
                  onclick:function(e){
                     myChartProe = echarts.init(document.getElementById('city_map'));
                     myChartProe.clear()
                     $('#taiwan_map').show()
                     $('#city_map').hide()
                     var tr_name = "tr#"+selectProe_name
                     $(tr_name).attr("style","")
                  }
               },
               myMore2:{
                  show:true,
                  title:'Hide Label/Legend',
                  icon: SVG_eye,
                  onclick:function(e){
                     var current_Option = myChartProe.getOption()
                     var VMap_Selected = current_Option.visualMap[0].selected
                     var Flag_show = current_Option.visualMap[0].show
                     if(Flag_show){
                        var Icon_EYE = SVG_eye_off
                        var Title_EYE = 'Show Label/Legend'
                     }else{
                        var Icon_EYE = SVG_eye
                        var Title_EYE = 'Hide Label/Legend'
                     };
                     var dim_series = current_Option.series.length
                     for(var iy=0;iy<dim_series;iy++){
                        current_Option.series[iy]["label"]["show"] = !Flag_show
                     };
                     myChartProe.setOption(current_Option,true) 
                     myChartProe.setOption(option = {
                        toolbox : {feature:{myMore2:{icon: Icon_EYE,title:Title_EYE}}},
                        //series :{ label: {show: !Flag_show}},
                        visualMap: {
                            show: !Flag_show,
                            selected:VMap_Selected
                        }
                     });
                  }
               },
               dataView:{show:true},
               myMore3:{
                  show:true,
                  title:'Show All',
                  icon:SVG_ZoomOut,
                  onclick:function(e){
                     var m_option = myChartProe.getOption();
                     var th_County = m_option.title[0].text
                     var Valid_County = {"基隆市":true,"金門縣":true,"連江縣":true}
                     if( Valid_County[th_County] !== undefined){
                        if(m_option.geo[0].center==""){
                           m_option.toolbox[0].feature["myMore3"]["title"] = "Show All"
                           m_option.toolbox[0].feature["myMore3"]["icon"] = SVG_ZoomOut
                           myChartProe.setOption(m_option,true);
                           ReLocate_County()
                        }else{
                           m_option.geo[0].center = ""
                           m_option.geo[0].zoom   = ""
                           m_option.toolbox[0].feature["myMore3"]["title"] = "Show Part"
                           m_option.toolbox[0].feature["myMore3"]["icon"] = SVG_ZoomIn
                           myChartProe.setOption(m_option,true);
                        };
                     };
                  }
               },
               myMore4:{
                  show:true,
                  title:'切換輸出\n圖背為透明',
                  icon: SVG_ImageB,
                  onclick:function(e){
                     var current_Option = myChartProe.getOption()
                     var Flag_show = current_Option.toolbox[0].feature["myMore4"].title.indexOf("透明")>=0
                     if(Flag_show){
                        var Icon_EYE = SVG_Image
                        var Title_EYE = '切換輸出\n圖背為白底'
                        var ImageBG_Trans = 'transparent'
                     }else{
                        var Icon_EYE = SVG_ImageB
                        var Title_EYE = '切換輸出\n圖背透明'
                        var ImageBG_Trans = 'white'
                     };
                     myChartProe.setOption(option = {
                        toolbox : {feature:{myMore4:{icon: Icon_EYE,title:Title_EYE},saveAsImage:{backgroundColor:ImageBG_Trans}}},
                     });
                  }
               },
               saveAsImage: {name:output_name_L2,pixelRatio:3,backgroundColor:"white",excludeComponents:["dataView","toolbox"]}
            }
         },
         visualMap: {
            left: 'right',
            text: [Legend["Title_Top"], Legend["Title_Bottom"]],
            calculable: true,
            type : 'piecewise',
            showLabel:true,
            itemWidth :  VisualMap_param["itemWidth"],
            itemHeight:  VisualMap_param["itemHeight"],
            align : 'auto', 
            itemSymbol : 'roundRect',
            bottom: '3%',
            left:  VisualMap_param["label_left"],
            //left: '80%',
            precision:0,
            textStyle: {
               width: VisualMap_param["textStyle_width"],
               overglow : "truncate",
               //fontWeight : 'bold',
               fontSize : VisualMap_param["textStyle_fontSize"]
            },
            //backgroundColor : 'white',
            borderColor : 'darkgray',
            //borderWidth : 1,
            borderWidth : 0,
            pieces : pieces_data
         },
         title:{
            text:selectProe_name,
            subtext:str_Title,
            x:'center',
            y:'top',
            textAlign:'left'
         },
         geo:{
            show:true,
            roam: Roam_Status,
            map: selectProe_name,
            layoutCenter: ['50%', '50%'],
            left: '0%',
            aspectScale:1,
            scaleLimit: { min: 1, max: 18.0 },
            z: 1,
            label: {
               normal:{
                  color:"MediumVioletRed",
                  textBorderColor:"white",
                  textBorderWidth:1,
                  textShadowColor:"white",
                  textShadowBlur:28,
                  fontSize: 16,
               },
               emphasis:{
                  color:"MediumVioletRed",
                  textBorderColor:"white",
                  textBorderWidth:1,
                  textShadowColor:"white",
                  textShadowBlur:28,
                  fontSize: 18,
                  formatter:function(params){
                     return params.name.split(selectProe_name)[1]
                  }
               }
            },
            itemStyle: {
               normal:{
                  shadowColor: 'rgba(5, 5, 0, 0.5)',
                  areaColor: "#FDFDFD",
                  borderColor: 'black',
                  borderWidth:1
               },
               emphasis: {
                  shadowColor: 'rgba(5, 5, 0, 0.5)',
                  shadowBlur: 10,
                  borderWidth:2,
                  borderColor:'#fff',
                  areaColor: '#fff',
                  label: {
                     show: true,
                     textStyle: {
                         color: 'MediumVioletRed'
                     }
                  }
               }
            },
            silent:false
         },
         series: []
      }) /* End of myChartProe.setOption */


      /* Set Series to option(L2) */
      var m_option = myChartProe.getOption();
      for(var i=0;i< reduceData.length;i++){
         var tempSeries = {};
         tempSeries.name = "Metro_"+reduceData[i]["name"]+"_L2"
         tempSeries.type = "effectScatter"
         tempSeries.roam = Roam_Status
         tempSeries.coordinateSystem = "geo"
         tempSeries.aspectScale = 1
         var Flag_LabelShow = false
         var mVal = reduceData[i]["value"][2]
         if( mVal<10 || mVal>-99){
            var FS = 12
         }else{
            var FS = 20
            Flag_LabelShow = true
         };
         tempSeries.label={
            color: "#000",
            normal: {
               show: true,
               borderColor:"white",
               fontSize:18,
               color:"#FFF",
               align:"center",
               position:"insideRight",
               textBorderColor:"#337DFF",
               textBorderWidth:3,
               textShadowBlur:9,
               textShadowColor:["#337DFF","#33CFFF"][1],//"white",
               textShadowOffsetX:0,
               textShadowOffsetY:0,
               formatter: function (result){
                  res_list = ["aquamarine","lightcyan","silver","none"]
                  res_list = ["silver","none"]
                  if(result["color"].indexOf("rgba")>=0 ){
                     return ""
                  }else if( res_list.includes(result["color"]) ){
                     return ""
                  };
                  try{
                     dir_str  = result["data"]["ovalue"][2]["wind_dir_name"]
                     WindData = result["data"]["ovalue"][2]
                     if(Flag_Select=="LastHourGustTable" || Flag_Select=="TodayMaxGustTable"){
                        avgW_str = result["data"]["ovalue"][2]["wind_gust"]
                        avgW_str = "G"+ms2scale(WindData["wind_gust"])
                     }else{
                        //avgW_str = result["data"]["ovalue"][2]["wind_avg"]
                        avgW_str = ms2scale(WindData["wind_avg"])+"."+ms2scale(WindData["wind_gust"])
                        //avgW_str = ms2scale(WindData["wind_avg"])+"G"+ms2scale(WindData["wind_gust"])
                     };
                     if(dir_str=="N"){
                        dir_symbol = "↓ "+avgW_str
                     }else if(dir_str=="W"){
                        dir_symbol = "→ "+avgW_str
                     }else if(dir_str=="S"){
                        dir_symbol = "↑ "+avgW_str
                     }else if(dir_str=="E"){
                        dir_symbol = "← "+avgW_str
                     }else if(dir_str.indexOf("NE")>=0 ){
                        dir_symbol = "↙ "+avgW_str
                     }else if(dir_str.indexOf("NW")>=0 ){
                        dir_symbol = "↘ "+avgW_str
                     }else if(dir_str.indexOf("SE")>=0 ){
                        dir_symbol = "↖ "+avgW_str
                     }else if(dir_str.indexOf("SW")>=0 ){
                        dir_symbol = "↗ "+avgW_str
                     }else{
                        dir_symbol = ""
                     };
                  }catch(err){
                     dir_symbol = ""
                  };
                  if(Flag_Select=="LastHourGustTable" || Flag_Select=="TodayMaxGustTable"){
                     if(dir_symbol!=""){
                        return dir_symbol.split(" ")[1]
                     }else{
                        return dir_symbol
                     };
                  }else{
                     return dir_symbol
                  };
               }
            },
            emphasis: {
               show: false
            },
            fontSize : "22",
            backgroundColor : "transparent",
            borderWidth: 3,
         }

         mCLS = {"7":'indigo',"6":'fuchsia',"5":'red',"4":'orange',"3":'yellow',"2":'aquamarine',"1":'lightcyan',"0":'white',"-9999":"white"}
         try{
            tempSeries.label["normal"]["textShadowColor"] = mCLS[mVal]
         }catch(err){
            tempSeries.label["normal"]["textShadowColor"] = "white"
         };

         tempSeries.labelLine = {"show":true}
         tempSeries.symbol = ["circle","arrow"][1]
         tempSeries.symbolSize = 13
         tempSeries.itemStyle = {
            opacity:1,
            borderType: "solid",
            borderWidth: 2,
            shadowBlur:6,
            borderColor: "white",
            shadowOffsetX:3,
            shadowOffsetY:3,
            shadowColor:"rgba(0,0,0,0.3)"
         }
         tempSeries.markPoint = {
            symbol: ["pin","arrow"][1],
            simbleSize: 30
         }
         tempSeries.showEffectOn = "render"
         var t_Val = parseFloat(reduceData[i]["value"][2])
         if(t_Val>=3){
            var th_Z = 6
            var th_rippleScale = 6
         }else if( t_Val >=2 && t_Val<3){
            var th_Z = 5
            var th_rippleScale = 5
         }else if( t_Val >=1 && t_Val<2){
            var th_Z = 4
            var th_rippleScale = 4
         }else if( t_Val >=0 && t_Val<1){
            var th_Z = 3
            var th_rippleScale = 3
         }else{
            var th_Z = 2
            var th_rippleScale = 0
         };
         tempSeries.z = th_Z
         tempSeries.rippleEffect={
            scale: 0,
            //scale: th_rippleScale,
            brushType:"stroke"
         }
         tempSeries.data = [ reduceData[i] ]
         m_option.series.push(tempSeries)
      };
      myChartProe.setOption(m_option,true);
      console.log("m_option:",m_option)
      /* End of Set Series to option(L2) */


      var L2_option = myChartProe.getOption();
      var dim_L2_option_pieces = L2_option.visualMap[0].pieces.length
      for(var k=0;k<dim_L2_option_pieces;k++){
         L2_option.visualMap[0].pieces[k]["symbol"] = "circle"
      };
      L2_option.visualMap[0].pieces[dim_L2_option_pieces-1] = {lte:-99,label: 'No Data', color:'black',symbol:'circle'}
      myChartProe.setOption(L2_option);


      /* Relocate Viewpoint for County */
      var ReLoc_LatLon_List = {"澎湖縣":[119.3684, 23.4926, 1],"金門縣":[118.30778, 24.44535, 4],"連江縣":[119.96073, 26.18785, 4],"新北市":[121.5656, 24.9582, 1],"臺北市":[121.5172, 25.0794, 1],"基隆市":[121.6971, 25.1158, 2.3],"桃園市":[121.1914, 24.8701, 1],"新竹縣":[121.1069, 24.7012, 1],"新竹市":[120.9408, 24.7686, 1],"苗栗縣":[120.8291, 24.4957, 1],"臺中市":[120.9033, 24.2485, 1],"南投縣":[120.9136, 23.8156, 1],"彰化縣":[120.4017, 23.9484, 1],"雲林縣":[120.2918, 23.5741, 1],"嘉義縣":[120.4429, 23.4113, 1],"嘉義市":[120.4275, 23.4750, 1],"臺南市":[120.2772, 23.1129, 1],"高雄市":[120.4781, 22.9679, 1.1],"屏東縣":[120.4206, 22.4477, 1],"宜蘭縣":[121.5871, 24.6753, 1],"花蓮縣":[121.1782, 23.7453, 1],"臺東縣":[120.7756, 22.7749, 1]}

      function ReLocate_County(){
         var New_LatLon = ReLoc_LatLon_List[selectProe_name]
         var Legend_Pos_List_L2 = {"宜蘭縣":"60%","花蓮縣":"60%","南投縣":"60%","臺中市":"60%","高雄市":"60%","基隆市":"60%","連江縣":"60%"}
         var New_Legend_Pos = Legend_Pos_List_L2[selectProe_name]
         if(New_LatLon!==undefined){
            var m_option = myChartProe.getOption();
            m_option.geo[0].center = [New_LatLon[0],New_LatLon[1]]
            m_option.geo[0].zoom   = New_LatLon[2]
            if( New_Legend_Pos!==undefined){
               //m_option.visualMap[0].left = "25%"
               m_option.visualMap[0].left = "65%"
               //m_option.visualMap[0].align = "right"
            }else{
               m_option.visualMap[0].left = "5%"
            };
            myChartProe.setOption(m_option,true);
         };
      };
      ReLocate_County()
      /* End of Relocate Viewpoint for County */





      /* Listen Mouse Click Event: blank to Home*/
      myChartProe.getZr().on('click', function (params) {
           if(params.target === undefined){
              //chart=echarts.init(document.getElementById('taiwan_map'));
              myChartProe = echarts.init(document.getElementById('city_map'));
              myChartProe.clear()
              $('#taiwan_map').show()
              $('#city_map').hide()
              $(tr_name).attr("style","")
           };
      });

   }); /* End of Click to Level 2 */

}; /* End of Function Echarts_MAP */

