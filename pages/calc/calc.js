Page({
  data:{
    idb:"back",
    idc:"clear",
    idt:"toggle",
    idadd:"＋",
    id9:"9",
    id8:"8",
    id7:"7",
    idj:"－",
    id6:"6",
    id5:"5",
    id4:"4",
    idx:"×",
    id3:"3",
    id2:"2",
    id1:"1",
    iddiv:"÷",
    id0:"0",
    idd:".",
    ide:"＝",
    screenData:"0",
    operaSymbo:{"＋":"+","－":"-","×":"*","÷":"/",".":"."},
    lastIsOperaSymbo:false,
    iconType:'waiting_circle',
    iconColor:'white',
    arr:[],
    logs:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  clickBtn:function(event){
    var id = event.target.id;
    if(id == this.data.idb){  //退格←
      var data = this.data.screenData;
      if(data == "0"){
          return;
      }
      data = data.substring(0,data.length-1);
      if(data == "" || data == "－"){
          data = 0;
      }
      this.setData({"screenData":data});
      this.data.arr.pop();
    }else if(id == this.data.idc){  //清屏C
      this.setData({"screenData":"0"});
      this.data.arr.length = 0;
    }else if(id == this.data.idt){  //正负号+/-
      var data = this.data.screenData;
      if(data == "0"){
          return;
      }
      var firstWord = data.charAt(0);
      if(data == "－"){
        data = data.substr(1);
        this.data.arr.shift();
      }else{
        data = "－" + data;
        this.data.arr.unshift("－");
      }
      this.setData({"screenData":data});
    }else if(id == this.data.ide){  //等于＝
      var data = this.data.screenData;
      if(data == "0"){
          return;
      }
      //eval是js中window的一个方法，而微信页面的脚本逻辑在是在JsCore中运行，JsCore是一个没有窗口对象的环境，所以不能再脚本中使用window，也无法在脚本中操作组件                 
      //var result = eval(newData);           
      
      var lastWord = data.charAt(data.length);
      if(isNaN(lastWord)){
        return;
      }

      var num = "";

      var lastOperator = "";
      var arr = this.data.arr;
      var optarr = [];
      for(var i in arr){
        if(isNaN(arr[i]) == false || arr[i] == this.data.idd || arr[i] == this.data.idt){
          num += arr[i];
        }else{
          lastOperator = arr[i];
          optarr.push(num);
          optarr.push(arr[i]);
          num = "";
        }
      }
      optarr.push(Number(num));
      var result = Number(optarr[0])*1.0;
      console.log(result);
      for(var i=1; i<optarr.length; i++){
        if(isNaN(optarr[i])){
            if(optarr[1] == this.data.idadd){
                result += Number(optarr[i + 1]);
            }else if(optarr[1] == this.data.idj){
                result -= Number(optarr[i + 1]);
            }else if(optarr[1] == this.data.idx){
                result *= Number(optarr[i + 1]);
            }else if(optarr[1] == this.data.iddiv){
                result /= Number(optarr[i + 1]);
            }
        }
      }
      //存储历史记录
      this.data.logs.push(data + result);
      wx.setStorageSync("calclogs",this.data.logs);

      this.data.arr.length = 0;
      this.data.arr.push(result);

      this.setData({"screenData":result+""});
    }else{
      if(this.data.operaSymbo[id]){ //如果是符号+-*/
        if(this.data.lastIsOperaSymbo || this.data.screenData == "0"){
          return;
        }
      }

      var sd = this.data.screenData;
      var data;
      if(sd == 0){
        data = id;
      }else{
        data = sd + id;
      }
      this.setData({"screenData":data});
      this.data.arr.push(id);

      if(this.data.operaSymbo[id]){
        this.setData({"lastIsOperaSymbo":true});
      }else{
        this.setData({"lastIsOperaSymbo":false});
      }
    }
  },
  history:function(){
    wx.navigateTo({
      url:'../history/history'
    })
  }
})