
var utils = {
	//处理数组
	forEach: function(array,action){
		if(!array || array.length == 0)return false;
		for(var i = 0;i<array.length;i++){
			action(array[i]);
		}	
	},
	//数组去重
	ique: function(arr){
		var newArr = [];
		var obj    = {};
		for(var i = 0;i<arr.length;i++){
			if(!arr[i].roomObj){
				newArr.push(arr[i]);
				continue;
			}
			var add = arr[i].id+''+arr[i].roomObj.type;
			if(!obj[add]){
				newArr.push(arr[i]);
				obj[add] = true;
			}
		}
	    return newArr;
	},
	forEach2: function(array,callback){
		var flag = null;
		for(var i = 0;i<array.length;i++){
			flag = callback(array[i]);
			if(flag){
				return flag;
			}
		}
	},

	ique2: function(arr){
		for(var i=0; i<arr.length; i++){
            for(var j=i+1; j<arr.length; j++){
                if(arr[i].x == arr[j].x && arr[i].y == arr[j].y){         
                    arr.splice(j,1);
                    j--;
                }
            }
        }
		return arr;
	},
	quchong:function(arr){
		for(var i=0; i<arr.length; i++){
            for(var j=i+1; j<arr.length; j++){
                if(arr[i].dist == arr[j].dist){         
					arr.splice(j,1);
					arr.splice(i,1);
                    j--;
                }
            }
        }
		return arr;
	},
	map: function(array,func){
		var result = []
		utils.forEach(array,function(element){
			result.push(func(element))
		})
		return result;
	},

	removeValue: function(arr, value) {
	  for(var i = arr.length - 1; i >= 0; i--) {
	    if(arr[i] === value) {
	       arr.splice(i, 1);
	    }
	  }
	},

	guid: (function() {
	    function s4() {
	    	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	 	}	
	  	return function() {
	    	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	  	}
	})(),

	distance: function(x1,y1,x2,y2){
		return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
	},
	//单轴比较
	distanceOnePoint: function(x,y,x1,y1){
		
		if( ( Math.abs( x - (x1) ) < 20 ) && ( Math.abs( y - (y1) ) < 20 ) )return 'all';
		if(  Math.abs( x - (x1) ) < 20  )return 'x';
		if(  Math.abs( y - (y1) ) < 20 )return 'y';
		return false;
	},
	//0,0->x1，y1和0,0->x2，y2之间的角度（-pi到pi）	
	angle: function( x1, y1, x2, y2 ) {
	    var dot = x1 * x2 + y1 * y2;
	    var det = x1 * y2 - y1 * x2;
	    var angle = -Math.atan2( det, dot );
	    return angle;
	},

	// 移动角度为0到2pi
	angle2pi: function( x1, y1, x2, y2 ) {
		var theta = G_Utils.angle(x1, y1, x2, y2);
		if (theta < 0) {
			theta += 2*Math.PI;
		}
		return theta;
	},
	//如果func（element）返回true，则移除数组中的元素
	removeIf: function(array,func) {
	    var result = [];
	    G_Utils.forEach(array, function (element) {
		    if (!func(element)) {
		      	result.push(element);
		    }
		});
	    return result;
	},
	//移动数组中的项（正整数）
	cycle: function(arr, shift) {
	  	var ret = arr.slice(0);
	  	for(var i = 0; i < shift; i++) {
	    	var tmp = ret.shift();
	    	ret.push(tmp);
	  	}
	  	return ret;
	},
	//点是具有x，y属性的点数组
	isClockwise: function( points ) {
	    // make positive
	    subX = Math.min(0, Math.min.apply(null, G_Utils.map(points, function(p) {
	      return p.x;
	    })))
	    subY = Math.min(0, Math.min.apply(null, G_Utils.map(points, function(p) {
	      return p.x;
	    })))
	    var newPoints = G_Utils.map(points, function(p) {
	      return {
	        x: p.x - subX,
	        y: p.y - subY
	      }
	    })
	    var sum = 0;
	    for ( var i = 0; i < newPoints.length; i++ ) {
	        var c1 = newPoints[i];
	        if (i == newPoints.length-1) {
	            var c2 = newPoints[0]
	        } else {
	            var c2 = newPoints[i+1];
	        }
	        sum += (c2.x - c1.x) * (c2.y + c1.y);
	    }
	    return (sum >= 0);
	},
	/*
		xy:鼠标点击的xy
		x1y1:墙体开始的xy
		x2y2:墙体结束点的xy
	*/
	closestPointOnLine: function(x, y, x1, y1, x2, y2) {
		var A = x - x1;
		var B = y - y1;
		var C = x2 - x1;
		var D = y2 - y1;

		var dot    = A * C + B * D;
		var len_sq = C * C + D * D;
		var param  = dot / len_sq;

		var xx, yy;

		if (param < 0 || (x1 == x2 && y1 == y2)) {
		    xx = x1;
		    yy = y1;
		} else if (param > 1) {
		    xx = x2;
		    yy = y2;
		} else {
		    xx = x1 + param * C;
		    yy = y1 + param * D;
		}

		return {
		    x: xx,
		    y: yy
		}
	},

	pointDistanceFromLine: function( x, y, x1, y1, x2, y2 ) {
	  	var point = G_Utils.closestPointOnLine(x, y, x1, y1, x2, y2);
		var dx 	  = x - point.x;
		var dy 	  = y - point.y;
		return Math.sqrt(dx * dx + dy * dy);
	},

	//获得画线测距标注——距离标注
	getDistancePoleData: function (v1, v2, w2) {
		//console.log(v1,v2,"x,y坐标")
		let rot =  Math.atan2(v2.y - v1.y, v2.x - v1.x);//通过2个点的点位求出夹角弧度值
		
		let sinθ = Math.sin(rot); //正弦
		let cosθ = Math.cos(rot); //余弦

		if(!w2)w2 = 0;

		let o1 = { x: v1.x + (w2*cosθ) - sinθ * 15, y: v1.y + (w2*sinθ) + cosθ * 15 };
		let o2 = { x: v2.x - (w2*cosθ) - sinθ * 15, y: v2.y - (w2*sinθ) + cosθ * 15 };

		let p1 = { x: v1.x - sinθ * 20, y: v1.y + cosθ * 20 };
		let p2 = { x: v1.x - sinθ * 30, y: v1.y + cosθ * 30 };

		let p3 = { x: v2.x - sinθ * 20, y: v2.y + cosθ * 20 };
		let p4 = { x: v2.x - sinθ * 30, y: v2.y + cosθ * 30 };

		let p = [
			o1, o2, 
			p1, p2,
			$agr.point.rotate(p3, o2, 5,'angle'),
			$agr.point.rotate(p4, o2, 5,'angle'),
		];
		return {
			point: p,
			center: $agr.L_segm.midP(o1, o2),
			distance: Math.round($agr.L_segm.dist(o1, o2) * 10),//取整 实际长度是场景长度的10倍
		}
	},
	//操作字符串
	stringShear: function(point){
		if(point && point != ''){
			var d = point.split(",");
			return {"x":Number(d[0]),"y":Number(d[1]),"z":Number(d[2])}
		}
	},
	toSaveNumber: function(obj,count){
		return {'x': Number(obj.x.toFixed(count)), 'y': Number(obj.y.toFixed(count))};
	},
	//edg == 0    1,1.5
		//edg == 180 // 1.5,0
		//edg == 90 1,1.5
		//edg 270   0,0.5
	hudu: function(edg){
		let rad = {}
		switch(edg){
			case 0: 
            rad.one = 1;
            rad.two = 1.5;
            break;
            case 90: 
            rad.one = 1.5;
            rad.two = 0;
            break;
            case 180: 
            rad.one = 0;
            rad.two = 0.5
            break;
            case 270: 
            rad.one = 0.5;
            rad.two = 1;
            break; 
		}
		return rad;
	},

 	findSameCorner: function(arr1,arr2){
 		var result = arr1.filter(function(n) {
		    return arr2.indexOf(n) != -1
		});
		return result;
 	},
 	arrOrObj: function(ao){
 		var a = Object.prototype.toString.call(ao);
 		if(a === "[object Object]")return 'obj';
 		if(a === "[object Array]")return 'arr';
 	},
	comporePoint: function(x,y,x1,y1){
		if(Math.abs(x-x1)>5)return true;
		if(Math.abs(y-y1)>5)return true;
		return false;
	},
	comporePoint2: function(x,y,x1,y1,x2,y2){
		if(Math.abs(x-(x1))<3 && Math.abs(y-(y1))<3)return {'x': x1, 'y': y};
		if(Math.abs(x-(x2))<3 && Math.abs(y-(y2))<3)return {'x': x2, 'y': y2};
		return false;
	},
 	getTypeItem: function(type){
 		let item = G_All_DoorWindow.filter(function(currentValue,i,arr){
				return type == arr[i].type;
		});
		if(item && item.length>0){
			return item[0];
		}
 	},
	arrSort:function(a,b){
		return a.dist - b.dist;
	},
 	//房间类型
    getRoomType:function(type){
		let roomName = "";
		switch(type){
			case "500" :
			roomName= "开间";
			break;

			case "501" :
			roomName= "主卧";
			break;

			case "502" :
			roomName= "次卧";
			break;

			case "503" : 
			roomName = "书房";
			break;

			case "504" : 
			roomName = "儿童房";
			break;

			case "505" :
			roomName= "客厅";
			break;
				
			case "506" :
			roomName= "餐厅";
			break;

			case "507" :
			roomName= "厨房";
			break;
					
			case "508" :
			roomName= "主卫";
			break;
			
			case "509" :
			roomName= "次卫";
			break;

			case "510" :
			roomName= "生活阳台";
			break;
			
			case "511" :
			roomName= "观光阳台";
			break;
		
			case "512" :
			roomName= "衣帽间"
			break;
			
			case "513" :
			roomName= "储物室";
			break;
			
			case "514" :
			roomName= "空调";
			break;
			
			case "515" :
			roomName= "楼梯";
			break;
			
			case "516" :
			roomName= "电梯";
			break;
			
			case "517" :
			roomName= "洗衣房";
			break;
			
			case "518" :
			roomName= "设备间";
			break;
			
			case "519" :
			roomName= "管道";
			break;
			
			case "520" :
			roomName= "入户花园";
			break;
			case "521" :
			roomName= "功能房";
			break;
			case "522" :
			roomName= "设备阳台";
			break;
			default : roomName= "未知"; break;	
		}
		return roomName;
	},
	getRoomArea: function(type){
		let roomName = "";
		switch(type){
			case "0" :
			roomName = "玄关区";
			break;
			case "1" :
			roomName = "会客区";
			break;
			case "2" :
			roomName = "就餐区";
			break;
			case "3" :
			roomName = "过道区";
			break;
			case "4" :
			roomName = "楼梯区";
			break;
			case "5" :
			roomName = "淋浴区";
			break;
			case "6" :
			roomName = "洗手区";
			break;
			case "7" :
			roomName = "马桶区";
			break;
			case "8" :
			roomName = "玩耍区";
			break;
			case "9" :
			roomName = "厨房区";
			break;
			case "10" :
			roomName = "睡眠区";
			break;
			default :roomName= "未知"; break;	
		}
		return roomName;
	},
	operationalStorage: function(name,obj){
		let addD = {
		    class:"roomTool",
		    cmd: name,
		    data:obj
		}
		G_undoRedo.addCommand(addD);
	}
}

window.G_Utils = utils