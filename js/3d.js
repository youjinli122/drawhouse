(function(global){
	//先走完Floorplan然后在走Blueprint3d
	global.Blueprint3d = function(opts){
		// console.log(333)
		// console.log(new Floorplan())
		this.floorplan    = new Floorplan();
		this.floorplanner = new Floorplanner(opts.floorplannerElement,this.floorplan);
	}  

})(window);

//操作DOM
var G_ctrlDom = {
	view: null,
	floorplan: null,
	floorplanner: null,
	type: null,
	targetObj: null,
	flag: null,

	createInput: function(wall,floorplanner){
		//console.log(wall,"所有的墙",floorplanner);
		var html = '';
		for(var i = 0;i<wall.length;i++){
			let w = wall[i];
			let xy = w.centerPoint.split(",");
			let x = floorplanner.convertX(Number(xy[0]));
			let y = floorplanner.convertY(Number(xy[1]));
			w.update('length');
			html += '<span class="ruler-text" data-id='+w.id+' style="left:'+x+'px;top:'+y+'px; transform:rotate('+w.edg+'deg)"><input  type="number" value="'+Math.ceil(w.wallLength)+'"></span>';
		}
		$(".span-input-container").html(html);
	},
	init: function(flag,obj,floorplanner,floorplan,view){
		$("#J_ctrlcanvas .tab1").removeClass("active");
		$("#J_ctrlcanvas .tab2").addClass("active");
		if(obj && obj.constructor === Array)obj = obj[0];
		this.view 		  = view;
		this.floorplan 	  = floorplan;
		this.floorplanner = floorplanner;
		this.targetObj    = obj;
		this.flag         = flag;
		this.createSidebarDom(flag,obj);
	},
	showDom: function(flag){
		$("#J_dialog").show();
		$("#J_dialog .item[data='0']").show();
		$("#J_dialog .item[data='1']").hide();
		$("#J_dialog .item[data='2']").hide();

		if(flag === 'wall'){
			$("#J_dialog .item[data='1']").show();
		}else if(flag === 'door'){
			$("#J_dialog .item[data='2']").show();
		}
	},
	//房间、墙、门、房间结构部件,只有墙体的厚度改变之后需要显示，其他均不需要显示
	createSidebarDom: function(flag,obj){
		G_ctrlDom.showDom(flag);
		if(flag === 'room'){
			obj.countArea();
			$("#J_ctrlsiderbar").html(UI_siderbar_room('room'));
			$("#J_ctrlsiderbar .j_area").text(obj.area);
			$("#J_ctrlsiderbar .select-trigger").text(utils.getRoomType(obj.type));
		}

		if(flag === 'roomarea'){
			$("#J_ctrlsiderbar").html(UI_siderbar_room('area'));
			$("#J_ctrlsiderbar .j_area").text(obj.area);
			$("#J_ctrlsiderbar .select-trigger").text(G_Utils.getRoomArea(obj.type));
		}

		if(flag === 'wall'){
			obj.update('length');
			let t = obj.type;
			let disable = true;
			if(obj.type == 2){
				t = 0;
				disable = false;
			}
			$("#J_ctrlsiderbar").html(UI_siderbar_wall);
			$("#J_ctrlsiderbar .wall-l[data='"+t+"']").addClass("active");
		    $('#J_ctrlsiderbar .range_0').ionRangeSlider({'min': 10,'max': 10000,'step':1,'hide_min_max': true, 'from':obj.thickness * 10,'skin': 'round','onChange':this.changeInut});
		    $('#J_ctrlsiderbar .range_1').ionRangeSlider({'min': 100,'max': 100000,'step':1,'hide_min_max': true, 'from':obj.wallLength,'disable':disable,'skin':'round','onChange':this.changeInut});
		    $('#J_ctrlsiderbar .range_2').ionRangeSlider({'min': 100,'max': 10000,'step':1,'hide_min_max': true, 'from':obj.height,'disable':true,'skin':'round'});

		    if(obj.backgroundType){
		    	$('#J_ctrlsiderbar .j_backgroundWall').find('option[data='+obj.backgroundType+' ]').attr('selected', 'selected');
		    }   
		}
		//长高宽离地
		if(flag === 'door'){
			$("#J_ctrlsiderbar").html(UI_siderbar_door(obj.type));
			let state = false;
			$('#J_ctrlsiderbar .range_0').ionRangeSlider({'min': 10,'max': 10000,'step':1,'hide_min_max': true,'disable': state, 'from': obj.length * 10,'skin': 'round','name':'door','onChange':this.changeInut});
			$('#J_ctrlsiderbar .range_1').ionRangeSlider({'min': 10,'max': 20000,'step':1,'hide_min_max': true, 'from':  obj.width * 10,'skin': 'round','onChange':this.changeInut});
			$('#J_ctrlsiderbar .range_2').ionRangeSlider({'min': 10,'max': 10000,'step':1,'hide_min_max': true, 'disable':  state,'from': obj.height* 10,'skin': 'round','onChange':this.changeInut});
			$('#J_ctrlsiderbar .range_3').ionRangeSlider({'min': 10,'max': 10000,'step':1,'hide_min_max': true, 'from': obj.groundMinClearance * 10,'skin': 'round','onChange':this.changeInut});			
		}
		//宽高角度
		if(flag === 'roomCom'){
			$("#J_ctrlsiderbar").html(UI_siderbar_roomCom(obj.type));
			$('#J_ctrlsiderbar .j_select_shape').find('option[data='+obj.shape+' ]').attr('selected', 'selected');
			$('#J_ctrlsiderbar .j_select_type').find('option[data='+obj.type2+' ]').attr('selected', 'selected');
		    if(obj.shape == '1602'){
		    	$('#J_ctrlsiderbar  .item.temp').hide();
		    	$('#J_ctrlsiderbar  .item.diameter').show();
		    	$('#J_ctrlsiderbar .range_0').ionRangeSlider({'min': 10,'max': 10000,'step':1,'hide_min_max': true, 'from':obj.length * 10,'skin': 'round','onChange':this.changeInut});
		    	$('#J_ctrlsiderbar .range_4').ionRangeSlider({'min': 10,'max': 10000,'step':1,'hide_min_max': true, 'from':obj.diameter * 10,'skin': 'round','onChange':this.changeInut});
		    }else{
		    	$('#J_ctrlsiderbar  .item.temp').show();
		    	$('#J_ctrlsiderbar  .item diameter').hide();
		    	$('#J_ctrlsiderbar .range_0').ionRangeSlider({'min': 10,'max': 10000,'step':1,'hide_min_max': true, 'from':obj.length * 10,'skin': 'round','onChange':this.changeInut});
				$('#J_ctrlsiderbar .range_1').ionRangeSlider({'min': 10,'max': 10000,'step':1,'hide_min_max': true, 'from':obj.width * 10,'skin': 'round','onChange':this.changeInut});
		    	$('#J_ctrlsiderbar .range_2').ionRangeSlider({'min': 10,'max': 10000,'step':1,'hide_min_max': true, 'from':obj.height * 10,'skin': 'round','onChange':this.changeInut});
		    	$('#J_ctrlsiderbar .range_3').ionRangeSlider({'min': 0,'max': 360,'step':1,'hide_min_max': true, 'from':obj.edg,'skin': 'round','onChange':this.changeInut,'onFinish':this.finish});
		    }
		}
		
		EVENT_EMIT("createdEvent",G_ctrlDom.flag);
	},
	changeInut: function(v){
		let name = v.input.context.className;

		if(G_ctrlDom.flag == 'door'){
			G_ctrlDom.targetObj.updateSize(name,v.from);
		}else if(G_ctrlDom.flag == 'roomCom'){
			G_ctrlDom.targetObj.updateSize(name,v.from);
		}else if(G_ctrlDom.flag == 'wall'){
			G_ctrlDom.targetObj.updateSize(name,v.from);
		}
		G_ctrlDom.view.draw();
	},
	// finish: function(e){
	// 	G_ctrlDom.targetObj.edgFinish(e.from);
	// }
}

//门窗类
var DoorWindow   = function(id,start,end,thickness,edg,obj){
	var scope    = this;
	this.roomObj = obj;
	this.id      = id;
	this.edg 	 = edg;
	this.type    = id;

	var start 	 = start;
	var end      = end;	
	var size     = '';
	var deleted_callbacks = $.Callbacks();
	this.inWall     = null;
	this.thickness  = thickness; //吸附的墙的宽或者厚度
	this.width      = thickness; //默认上个
	this.height     = 200; //默认高度
	this.length     = $agr.L_segm.dist(start,end); //长度
	this.groundMinClearance = 0; //离地最小数据
	this.groundMaxClearance = 0; //离地最大数据
	this.centerPoint = 0;
	var originDeg    = edg;

	if(this.roomObj){
		this.type = this.roomObj.type;
	}

	this.fireOnDelete = function(func){
    	deleted_callbacks.add(func);
  	}

	this.updateSize = function(name,num){
		let vector 		= $agr.L_segm.normalize(start.x,start.y,end.x,end.y);
		let centerPoint = $agr.L_segm.midP(start,end);

		let n = num / 10;
		if(name){
			if(name == 'range_0'){
				let l_2    = n / 2;
				let v1     = {'x': centerPoint.x+vector.x*l_2,'y': centerPoint.y+vector.y*l_2};
				let v2     = {'x': centerPoint.x-vector.x*l_2,'y': centerPoint.y-vector.y*l_2};
				start.x    = v1.x;
				start.y    = v1.y;
				end.x      = v2.x;
				end.y      = v2.y;
				scope.length = n;
			}
			if(name == 'range_1'){
				scope.width = n;
			}
			if(name == 'range_2'){
				scope.height = n;
			}
			if(name == 'range_3'){
				scope.groundMinClearance = n;
			}
		}
	}
	this.getStart = function(){
		return start;
	}
	this.getEnd   = function(){
		return end;
	}
  	this.getStartX = function(){
  		return start.getX();
  	}

  	this.getStartY = function(){
  		return start.getY();
  	}

  	this.getEndX = function(){
  		return end.getX();
  	}

  	this.getEndY = function(){
  		return end.getY();
  	}

	this.distanceFrom = function(x, y){
    	return G_Utils.pointDistanceFromLine(
    		x, 
    		y, 
      		this.getStartX(),
      		this.getStartY(), 
      		this.getEndX(),
      		this.getEndY()
      	);
  	}
  	this.relativeMove = function(sx,sy){
  		start.relativeMove(sx,sy);
  		end.relativeMove(sx,sy);
  	}
  	this.remove = function(){
  		start.remove();
  		end.remove();
  		deleted_callbacks.fire(this);
  	}
  	this.updateRotate = function(deg){
		this.roomObj.rotate = "0.0,"+deg+".0,"+"0.0";
  	}
  	this.getSize = function(){
  		size = scope.length + "," + scope.width + "," + scope.height;
  		return size; 
	}
	  
  	this.init = function(){
  		scope.updateSize();
  		scope.getSize();
  	}
  	scope.init();
}

// var RoomComponents = function(id,x,y,length,width,height,edg,shape){
// 	var scope   = this;
	
	

// 	// scope.init();
// }
// RoomComponents.prototype.initDraw = function(){

// }
//房间结构部件
var RoomComponents = function(id,x,y,length,width,height,edg,shape){

	var scope   = this;
	this.id     = id;
	this.type   = id;
	this.x      = x;
	this.y      = y;

	this.length = length;
	this.width  = width;
	this.height = height; //高度图形不改变，只改变数据
	this.edg    = edg || 180; //默认
	this.shape  = shape || 1601;  //默认四边形 1602->圆形

	this.diameter = length;	//圆的直径 

	this.type2    = id;

	this.groundMinClearance = 0;
	this.groundMaxClearance = 0; 
	this.isSelected  = false; //是否被选中
	this.inRoom      = null;
	var start        = {}; 
	var end          = {}; 
	var corners      = [];
	var deleted_callbacks = $.Callbacks();
	var size          = '';
	var centerCorners = [];
	var tagLines      = [];
	var liang_centerCorner = [];

	var centerPoint  = {};
	var originStart  = {};
	var originEnd    = {};
	var originLength = 40;
	var color        = '';
	var g_publicObj  = null;

	let initS,initE,initStart,initEnd;

	this.getStart = function(){
		return start;
	}
	this.getEnd = function(){
		return end;
	}
	this.getCenterP = function(){
		return $agr.L_segm.midP(start, end); 
	}
	this.getColor = function(){
		updateColor();
		return color;
	}
	this.setStart = function(start){
		start = start;
	}
	this.setEnd = function(end){
		end  = end;
	}

	function findXyPointMaxOrMin(cors){
		
		let objX = {'max':null,'min': null};
		let objY = {'max':null,'min': null};

		let px = [];
		let py = [];
		cors.forEach(function(item){
			px.push(item.x);
		});
		cors.forEach(function(item){
			py.push(item.y);
		});
		let pmaxX = Math.max.apply(null, px);
		let pminX = Math.min.apply(null, px);
		let pmaxY = Math.max.apply(null, py);
		let pminY = Math.min.apply(null, py);
		objX.max = cors.filter(function(item){
			if(pmaxX == item.x)return item;
		});
		objX.min = cors.filter(function(item){
			if(pminX == item.x)return item;
		});
		objY.max = cors.filter(function(item){
			if(pmaxY == item.y)return item;
		});
	    objY.min = cors.filter(function(item){
			if(pminY == item.y)return item;
		});
		return [objX,objY];
	}
	
	function findClosestIntersection(cors){
		let px = [];
		let py = [];
	
		if(tagLines && tagLines.length>0){
			for(var i = 0;i<tagLines.length;i++){
				if(tagLines[i].start.x == tagLines[i].end.x){
					px.push(tagLines[i]);
				}
				if(tagLines[i].start.y == tagLines[i].end.y){
					py.push(tagLines[i]);
				}
			}
		}
		px = px.sort(G_Utils.arrSort);
		py = py.sort(G_Utils.arrSort);
		tagLines = [];
		px.forEach(function(c,i){
			if(i<=1)tagLines.push(c);
		});
		py.forEach(function(c,i){
			if(i<=1)tagLines.push(c);
		});
		for(var i = 0;i<cors.length;i++){
			for(var j = 0;j<tagLines.length;j++){
				if( (cors[i].x == tagLines[j].end.x && cors[i].y == tagLines[j].end.y) ){
					tagLines.splice(j,1);
				}
			}
		}
	}
	function addRoomComLine(){

		if(scope.inRoom.type == 0 || scope.inRoom.type == 21)return; //这里可能拿到的是墙体
		let walls = scope.inRoom.getWalls();
		let cors  = corners;
		tagLines  = [];

		
		if(scope.edg == 180 || scope.edg == 0 || scope.edg == 360){ //如果是0/180度就去中心点坐标否则就取角点坐标
			cors  = centerCorners; 
		}
		countLine();
	

		//用墙和所有的角点做对比找到每个角点与线段的垂直交点并且交点在此条线段内，因为可能会出现多个交点都在线段内因此调用findClosestIntersection();
		function countLine(){
			
			for(var i = 0;i<walls.length;i++){
				let arr    = [];
				let start  = [];	
				for(var j = 0;j<cors.length;j++){	
					let p  = {'x': cors[j].x, 'y': cors[j].y};
					let o1 = {'x': walls[i].getStartX(), 'y': walls[i].getStartY()};
					let o2 = {'x': walls[i].getEndX(),   'y': walls[i].getEndY()};
					if($agr.point.inSegm(p,o1,o2))continue; //如果角点在线段内则不需要计算长度
					let result = 	$agr.point.vertiP(p,o1,o2);
					if(!$agr.point.inSegm(result,o1,o2))continue; //返回的交点必须要在线段内

					let len   =  $agr.L_segm.dist(result, p);
					if(len == 0)continue;
					let obj   = {'start': cors[j],'end': result, 'dist': len};
					
					arr.push(obj);						
				}
				if(arr.length == 0)continue;
				arr = G_Utils.quchong(arr).sort(G_Utils.arrSort);
				tagLines.push(arr[0]);		
			}
			findClosestIntersection(cors);
		}
	}
	//根据角度发射2条射线，求初始角度
	function getVectorFromRotate(){
	
		let arr = [];
		let c   = {'x': scope.x, 'y': scope.y};
	
		let v1 = {'x': scope.x + 0.5, 'y': scope.y};
		let v2 = {'x': scope.x - 0.5, 'y': scope.y};
		v1 = $agr.point.rotate(v1,c,scope.edg,'angle');
		v2 = $agr.point.rotate(v2,c,scope.edg,'angle');

		arr.push($agr.L_segm.normalize(v1.x, v1.y, v2.x, v2.y));
		arr.push($agr.L_segm.normalize(v2.x, v2.y, v1.x, v1.y));
		return arr;	
	}

	function findIntersectpoint(){
		
		let vec    = getVectorFromRotate({'x': scope.x,'y': scope.y});
		if(!scope.inRoom)return;
		let wall   = scope.inRoom.getWalls();
		let newArr = [];
		vec.forEach(function(item){
			let arr   = [];
			for(var i = 0;i<wall.length;i++){
				let s  =  wall[i].getStart();
				let e  =  wall[i].getEnd();
				let r1 =  $agr.L_half.intersection_ray_segment_double_point(scope.x, scope.y, item.x, item.y, s.x, s.y, e.x, e.y);
				if(r1){
					let dis = $agr.point.segm_d({'x': scope.x, 'y': scope.y}, s, e); 
					r1  = {'x': r1.m_x, 'y': r1.m_y,'dist': dis};
					arr.push(r1);
				}	
			}
			if(arr.length>0){
				if(arr.length == 1){
					newArr.push(arr[0]);
				}else{
					arr = arr.sort(G_Utils.arrSort);
					newArr.push(arr[0]);
				}
			}
		});
		
		if(newArr.length>1){
			start = {'x': newArr[0].x, 'y': newArr[0].y};
			end   = {'x': newArr[1].x, 'y': newArr[1].y};
			return [start, end];
		}else{
			setInitParams();
			update("init");
		}
	}

	this.getRoomComTagLines = function(){
		return tagLines;
	}

  	this.fireOnDelete = function(func) {
    	deleted_callbacks.add(func);
  	}

	this.getCorners = function(){
		return corners;
	}

	this.getStartX = function(){
		return start.x;
	}
	this.getStartY = function(){
		return start.y;
	}
	this.getEndX = function(){
		return end.x;
	}
	this.getEndY = function(){
		return end.y;
	}
	this.move = function(newX,newY){
		this.x = newX;
		this.y = newY;
		if(scope.type == 15){
			let p = findIntersectpoint();
			if(p){
				setInitParams(p,'move');
				if(scope.edg == 0 || scope.edg == 90 || scope.edg == 270 || scope.edg == 180 || scope.edg == 360)addRoomComLine();
			}
		}else{
			setInitParams();
			update('init');	
			addRoomComLine();
		}
		
	}
	this.remove = function(){
		deleted_callbacks.fire(this);
	}
	this.relativeMove = function(dx, dy) {
	    scope.move(scope.x + dx, scope.y + dy);
	}
	//找到图形的四个角点和中心点
	this.createPoint = function(){
	
		corners 		    = [];
		centerCorners 		= [];
		let leftTopP,leftBottomP,rightTopP,rightBottomP,centerTpoint,centerBpoint,centerLpoint,centerRpoint; 

		if(scope.shape == 1601 || scope.type == 15){
		
			let rad         =  scope.edg*Math.PI/180;
			let w_2         =  scope.width / 2;
			let l_2         =  $agr.L_segm.dist(start,end) / 2;
			leftTopP 		=  $agr.L_segm.getDistance(start,rad,w_2);
			leftBottomP 	=  $agr.L_segm.getDistance(start,rad,-w_2);
			rightTopP 		=  $agr.L_segm.getDistance(end,rad,w_2);
			rightBottomP 	=  $agr.L_segm.getDistance(end,rad,-w_2);	

		}else{
		
			let radius = scope.diameter / 2;
			leftTopP 		=  {'x': centerPoint.x + radius,'y': centerPoint.y + radius}; 
			leftBottomP 	=  {'x': centerPoint.x + radius,'y': centerPoint.y - radius};
			rightTopP 		=  {'x': centerPoint.x - radius,'y': centerPoint.y + radius}; 
			rightBottomP 	=  {'x': centerPoint.x - radius,'y': centerPoint.y - radius}; 

		}
		
		centerTpoint 	=  $agr.L_segm.midP(leftTopP,leftBottomP); 
		centerBpoint 	=  $agr.L_segm.midP(rightTopP,rightBottomP); 
		centerLpoint 	=  $agr.L_segm.midP(leftTopP,rightTopP);
		centerRpoint 	=  $agr.L_segm.midP(leftBottomP,rightBottomP);

		corners.push(leftTopP,rightTopP,rightBottomP,leftBottomP);
		centerCorners.push(centerTpoint, centerBpoint,centerLpoint,centerRpoint);

	}

	this.getCenterCorner = function(){
		return centerCorners;
	}

	this.getSize = function(){
		size = scope.length + ',' + scope.width + ',' + scope.height;
		return size;
	}

	this.resetType = function(type){
		scope.type2 = Number(type);
	}

	this.resetShape = function(data){

		scope.shape = data;

		if(data == 1601){
			update('init');	
		}

		G_ctrlDom.init('roomCom',scope);

	}

	this.updateSize = function(name,num){
	
		let size = num / 10;
		if(name){
			if(name === 'range_0'){
				scope.length = size;
				if(scope.shape == 1602)return;
				update('length',size);
			}else if(name === 'range_1'){
				scope.width = size;
				update();
			}else if(name === 'range_2'){
				scope.height = size;
				update();
			}else if(name === 'range_3'){
				scope.edg  = num;	
				update('rotate');				
			}else if(name === 'range_4'){
				scope.diameter = size;
				update();
			}		
		}

	}
	function updateColor(){

		if(scope.shape == 1602){
			if(scope.type == 16)color = '#000';
			if(scope.type == 19)color = '#8A2BE2';
			if(scope.type == 17)color = '5F9EA0';
			if(scope.type == 18)color = 'FFD700';
		}

	}
	
	function setInitParams(p,flag){
		if(p){
			start = p[0];
			end   = p[1];
			centerPoint  = $agr.L_segm.midP(start, end);
			scope.length = $agr.L_segm.dist(start, end);
			originStart  = start;
			originEnd    = end;
		}else{
			centerPoint    =  {'x': scope.x, 'y': scope.y};
		}
		initStart = initS  =  {'x': centerPoint.x + 0.5, 'y': centerPoint.y};
		initEnd   = initE  =  {'x': centerPoint.x - 0.5, 'y': centerPoint.y};

		if(flag == 'move'){
			initS  =  {'x': centerPoint.x + 0.5, 'y': centerPoint.y};
			initE  =  {'x': centerPoint.x - 0.5, 'y': centerPoint.y};
			initS = $agr.point.rotate(initS,centerPoint,scope.edg,'angle');
			initE = $agr.point.rotate(initE,centerPoint,scope.edg,'angle');
		}

		scope.createPoint();
	}
	function update(flag,num){
		// console.log("进来没")
		var vecS    =  $agr.L_segm.normalize(centerPoint.x,centerPoint.y,initS.x,initS.y);
		var vecE    =  $agr.L_segm.normalize(centerPoint.x,centerPoint.y,initE.x,initE.y);
		let len     =  scope.length / 2 + 0.5;

		if(flag == 'init'){
			
			start.x     =  initS.x + vecS.x * len;
			start.y     =  initS.y + vecS.y * len;

			end.x       =  initE.x + vecE.x * len;
			end.y       =  initE.y + vecE.y * len;
	
			originStart = start;
			originEnd   = end;
			
			if(scope.edg != 180)update('rotate');	
		}

		//修改长度时，需要重新计算结束点和中心点和180度下的原点坐标点
		if(flag == 'length'){

			start.x     =  initS.x + vecS.x * len;
			start.y     =  initS.y + vecS.y * len;

			end.x       =  initE.x + vecE.x * len;
			end.y       =  initE.y + vecE.y * len;

			originStart =  $agr.point.rotate(start,centerPoint,360-scope.edg,'angle'); //这是180度下的坐标相加减所以要360减掉旋转角度重新找回180度下的原点坐标
			originEnd   =  $agr.point.rotate(end,centerPoint,360-scope.edg,'angle');

		}

		if(flag == 'rotate'){

			start = $agr.point.rotate(originStart,centerPoint,scope.edg,'angle'); //记录旋转后的坐标
			end   = $agr.point.rotate(originEnd,centerPoint,scope.edg,'angle');

			initS = $agr.point.rotate(initStart,centerPoint,scope.edg,'angle');  //记录旋转后的初始坐标
			initE = $agr.point.rotate(initEnd,centerPoint,scope.edg,'angle');
		
		}
		scope.createPoint();
		if(scope.isSelected){
			// if( scope.type == 15 && ( scope.edg == 0 || scope.edg == 90 || scope.edg == 270 || scope.edg == 180 || scope.edg == 360) )addRoomComLine();
			if( scope.type != 15)addRoomComLine();	
		}
	}

	this.count = function(){
		console.log($agr.L_segm.dist(start,end),"最后的长度")
	}
	//不管有没有旋转，先找到中心点，再根据中心点跳转起始结束点或和角度
	this.init = function(){
		console.log("init")
		setInitParams();
		g_publicObj  =  window.blueprint;
		if(g_publicObj)scope.inRoom =  g_publicObj.floorplan.isponitFromRoom(scope.x, scope.y);
		if(g_publicObj  && scope.type == 15){
			let p = findIntersectpoint();
			p && setInitParams(p);
		}else{
			update('init');	
		}		
	}

	scope.init();
}


var HalfEdge = function(room, wall, front){
	
	var scope    = this;
	this.room    = room;
	this.front   = front || false;
	this.wall    = wall;
	this.offset  = wall.thickness / 2;
	this.distane = null;
	this.height  = wall.height;
	this.prev;
	this.next;
	// 交叉口测试
	this.plane   = null;

	if(front){
		wall.frontEdge = this;
	}else{
		wall.backEdge  = this;
	}

	this.getStart = function(){
		if(this.front){
			return this.wall.getStart();
		}else{
			return this.wall.getEnd();
		}
	}

	this.getEnd = function(){
		if(this.front){
			return this.wall.getEnd();
		}else{
			return this.wall.getStart();
		}
	}

	//找到线段的中心点
	this.interiorCenter = function() {
		return {
			x: (this.interiorStart().x + this.interiorEnd().x) / 2.0,
			y: (this.interiorStart().y + this.interiorEnd().y) / 2.0,
		}
	}

	this.interiorDistance = function() {
		var start = this.interiorStart();
		var end   = this.interiorEnd();
		return utils.distance(start.x, start.y, end.x, end.y);
	}

	this.exteriorEnd = function() {
		var vec = this.halfAngleVector(scope, scope.next);
		return {
			x: this.getEnd().x - vec.x,
			y: this.getEnd().y - vec.y
		}
	}

	this.exteriorStart = function() {
		var vec = this.halfAngleVector(scope.prev, scope);
		return {
			x: this.getStart().x - vec.x,
			y: this.getStart().y - vec.y
		}
	}

	this.interiorEnd = function() {
		var vec = this.halfAngleVector(scope, scope.next);
		return {
			x: this.getEnd().x + vec.x,
			y: this.getEnd().y + vec.y
		}
	}

	this.interiorStart = function(){
		var vec =  this.halfAngleVector(scope.prev, scope);
		return {
			x: this.getStart().x + vec.x,
			y: this.getStart().y + vec.y
		}
	}

	this.corners = function(){
		return [this.interiorStart(), this.interiorEnd(), this.exteriorEnd(), this.exteriorStart()];
	}
	//计算边框线
	this.halfAngleVector = function(v1, v2) {
		if (!v1) {
			var v1startX = v2.getStart().x - (v2.getEnd().x - v2.getStart().x);
			var v1startY = v2.getStart().y - (v2.getEnd().y - v2.getStart().y);     
			var v1endX = v2.getStart().x;
			var v1endY = v2.getStart().y;
		} else {
			var v1startX = v1.getStart().x;
			var v1startY = v1.getStart().y;
			var v1endX = v1.getEnd().x;
			var v1endY = v1.getEnd().y;
		}

		if (!v2) {
			var v2startX = v1.getEnd().x;
			var v2startY = v1.getEnd().y;
			var v2endX   = v1.getEnd().x + (v1.getEnd().x - v1.getStart().x);
			var v2endY   = v1.getEnd().y + (v1.getEnd().y - v1.getStart().y); 
		} else {
			var v2startX = v2.getStart().x;
			var v2startY = v2.getStart().y;
			var v2endX = v2.getEnd().x;
			var v2endY = v2.getEnd().y;      	  
		}

		// // 边缘间的逆时针角度
		var theta = G_Utils.angle2pi(
			v1startX- v1endX,
			v1startY - v1endY,
			v2endX - v1endX,
			v2endY - v1endY);

		// // 半角余弦和正弦
		var cs = Math.cos(theta / 2.0);
		var sn = Math.sin(theta / 2.0);

		// // 旋转v2
		var v2dx = v2endX - v2startX;
		var v2dy = v2endY - v2startY;

		var vx = v2dx * cs - v2dy * sn;
		var vy = v2dx * sn + v2dy * cs;

		var mag = G_Utils.distance(0, 0, vx, vy);
		
		var desiredMag = (this.offset) / sn;
		var scalar 	   = desiredMag / mag;
	
		var halfAngleVector = {
				x: vx * scalar,
				y: vy * scalar
		}
		return halfAngleVector;
	}
}

//房间分区
var RoomArea = function(floorplan,corners,id){
	var scope        = this;
	var corners      = corners || [];
	var walls        = [];
	var floorplan    = floorplan;
	this.id          = id;
	this.type   	 = 100; //分区类型
	this.area        = '';
	this.areaCenter  = '';
	this.areaColor   = false;
	this.name        = '';

	this.pushCorner = function(){
		for(var i = 0;i<arguments.length;i++){
    		corners.push(arguments[i]);
  		}
	}
	this.pushWall = function(){
		for(var i = 0;i<arguments.length;i++){
    		walls.push(arguments[i]);
  		}	
	}
	this.getCorners = function(){
		return corners;
	}
	function backRoomWalls(arr){
  		var obj    = {};
  		var newArr = [];
  		for(var i = 0;i<arr.length;i++){
  			var re = arr[i].id;
	        if (re in obj) obj[re].push(arr[i]);
	        else obj[re] = [arr[i]];
  		}

  		for(var key in obj){
  			var length = obj[key].length;
  			if(length>1){
  				newArr.push(obj[key][0])
  			}
  		}
  		walls = newArr;
  		return newArr;
  	}
	this.getWalls = function(){
		let cors    = this.getCorners();
		let wall    = [];
		for(var i = 0;i<cors.length;i++){
			for(var j = 0;j<cors[i].wallStarts.length;j++){
				wall.push(cors[i].wallStarts[j]);
			}
			for(var x = 0;x<cors[i].wallEnds.length;x++){
				wall.push(cors[i].wallEnds[x])
			}
		}
		return backRoomWalls(wall);
	}
	this.remove = function(){
		let wall  = this.getWalls();
		for(var i = 0;i<wall.length;i++){
			wall[i].remove();
		}
	}

	function countArea(){
		var pointsArr = [];	
		for(var i = 0,len=corners.length;i<len;i++){
			var v1 = corners[i].getX();
			var v2 = corners[i].getY();
			var obj= {x:v1 ,y:v2};
			pointsArr.push(obj);
		}	
		scope.area 		 = ($agr.poly.Area(pointsArr) * 10 * 0.00001).toFixed(2) + 'm²';
		scope.areaCenter = $agr.poly.centerP(pointsArr);
	}
	this.update = function(type){
		scope.type = type;
	}
	this.init = function(){
		countArea();
	}
	scope.init();
} 

//合成房间
var Room = function(floorplan,corners,room,id){
	var scope       = this;
	var g_floorplan = floorplan;
	var g_corners   = corners || [];
	var g_walls     =  [];
	var g_roomComs  =  [];
	var g_roomArea  =  [];
	var g_roomAreaWall = [];
	this.edgePointer = null;
	this.interiorCorners = [];
	this.area        = '';
	this.areaCenter  = '';
	this.areaColor   = false;
	this.roomJson    = room;
	this.name        = '';
	this.type        = 500; //房间类型
	this.id          = id;

	this.pushCorner = function(a){	
		g_corners.push(a);
	}
	this.setRoomComs  = function(c){
		g_roomComs.push(c);
	}
	this.setRoomArea = function(c){
		for(var i = 0;i<g_roomArea.length;i++){
			if(c === g_roomArea[i])return;
		}
		g_roomArea.push(c);
	}
	this.getRoomArea = function(){
		return g_roomArea;
	}
	this.getCorners = function(){
		return g_corners;
	}
	this.getRoomComs = function(){
  		return g_roomComs;
  	}
	this.getWalls = function(){
		let allWall = this.createWalls();
		return allWall;
	}
	this.getNoPublicWall = function(){
		return findNoPublicWall();
	}
	this.getNoPublicCorner = function(){
		let wall    = scope.getNoPublicWall();
		let cors 	= [];
		let arr     = [];
		wall.forEach(function(item){
			cors.push(item.getStart(),item.getEnd());
		});
		let newCors = cors.filter(function(item){
			return cors.indexOf(item) !== cors.lastIndexOf(item);
		});
		
		for(var i = 0; i<newCors.length;i++){
			if(arr.indexOf(newCors[i]) === -1){
				arr.push(newCors[i])
			}
		}
		return arr;
	}
	//处理墙，单个的墙是和其他房间共有的角点，如果有超过2面相同的墙取一个，拿到这个房间的所有墙体然后和其他房间的所有墙体对比,如果找到不是共同的墙体就删掉
  	function backRoomWalls(arr){
  		var obj    = {};
  		var newArr = [];
  		for(var i = 0;i<arr.length;i++){
  			var re = arr[i].id;
	        if (re in obj) obj[re].push(arr[i]);
	        else obj[re] = [arr[i]];
  		}

  		for(var key in obj){
  			var length = obj[key].length;
  			if(length>1){
  				newArr.push(obj[key][0])
  			}
  		}
  		return newArr;
  	}
  	function removeDoorWindow(walls){
		var allD  = g_floorplan.getItems();
		let items = [];
		for(var i = 0;i<allD.length;i++){
			let start = allD[i].getStart();
			let end   = allD[i].getEnd();
			for(var j = 0;j<walls.length;j++){
				let s = walls[j].getStart();
				let e = walls[j].getEnd();
				if($agr.L_segm.overlap(start,end,s,e)){
					items.push(allD[i]);
				}
			}
		}
		items.forEach(function(it){
			it.remove();
		});
	}
  	//找到不是公共的墙也就是要删掉的墙
  	function removeNoPublicWall(newArr){
  		if(newArr.length>0){
  			removeDoorWindow(newArr);
  			newArr.forEach(function(item){
  				item.remove();
  			});
  		}
  	}
  	function findNoPublicWall(){
  		let r    	  = floorplan.getRooms();
  		let mywalls   = scope.getWalls(); //删除墙
		let allWalls  = [];
		let newArr 	  = [];
		for(var i = 0;i<r.length;i++){
			if(r[i] === scope)continue;
			let rooms = r[i];
			let walls = rooms.getWalls();
			for(var j = 0;j<walls.length;j++){
				allWalls.push(walls[j]);
			}
		}
  	
  		for(var i = 0;i<mywalls.length;i++){
  			var oid = mywalls[i].id;
  			var flag = false;
  			for(var j = 0;j<allWalls.length;j++){
  				var nid = allWalls[j].id
  				if(oid === nid){
  					flag = true;
  					break;
  				}
  			}
  			if(!flag){
  				newArr.push(mywalls[i]);
  			}
  		}
  		return newArr;
		// backNoPublicWall(mywalls,allWalls); //用现在这个房间的墙和所有房间的墙做对比
  	}

	this.createWalls = function(){
		let cors    = this.getCorners();
		let allCors = [];
		for(var i = 0;i<cors.length;i++){
			for(var j = 0;j<cors[i].wallStarts.length;j++){
				allCors.push(cors[i].wallStarts[j])
			}
			for(var x = 0;x<cors[i].wallEnds.length;x++){
				allCors.push(cors[i].wallEnds[x])
			}
		}
		g_walls = backRoomWalls(allCors);
		return g_walls;
	}

	this.countArea = function(){
		var pointsArr = [];	
		for(var i = 0,len=g_corners.length;i<len;i++){
			var v1 = g_corners[i].getX();
			var v2 = g_corners[i].getY();
			var obj= {x:v1 ,y:v2};
			pointsArr.push(obj);
		}	
		scope.area 		 = ($agr.poly.Area(pointsArr) * 10 * 0.00001).toFixed(2);
		scope.areaCenter = $agr.poly.centerP(pointsArr);
	}
	//删除房间-包括房间相关的墙体，结构部件，门窗等,用我的要删除的房间的墙体去和所有房间的墙体相比较，如果有共同的墙体就留下，如果没有就删除
	this.remove = function(){

		let roomcoms = g_floorplan.getRoomCom(); //在删除房间前先删除房间结构部件
		for(var i = 0;i<roomcoms.length;i++){
			let temp = roomcoms[i];
			if($agr.point.inPoly({'x':temp.x,'y':temp.y},g_corners)){
				temp.remove();
			}
		}

		let mywalls   = scope.getWalls(); //删除墙
		let r    	  = floorplan.getRooms(); //删除房间
		//如果房间只有一个
		if(r.length == 1){	
			removeDoorWindow(mywalls);
			mywalls.forEach(function(item){
				item.remove();
			});
			return;
		}
		removeNoPublicWall(findNoPublicWall());
	}

	function updateInteriorCorners(){
	    var edge = scope.edgePointer;
	    if(!edge)return;
	    while (true) {
	      scope.interiorCorners.push(edge.interiorStart());
	      if (edge.next === scope.edgePointer) {
	        break;
	      } else {
	        edge = edge.next;
	      }
	    }
	}

	function updateWalls(){
		
		var prevEdge,firstEdge,edge;	
    	for(var i = 0; i < corners.length; i++){
    		var firstCorner  = corners[i];
    		var secondCorner = corners[( i + 1) % corners.length];
    		var wallTo       = firstCorner.wallTo(secondCorner);
    		var wallFrom     = firstCorner.wallFrom(secondCorner);

    		if(wallTo){
    			edge 	= new HalfEdge(scope, wallTo, true);
    		}else if(wallFrom){
    			edge    = new HalfEdge(scope, wallFrom, false);
    		}else{
    			console.log("corner没有找到链接的墙面");
    		}

    		if(i == 0){
    			firstEdge = edge;
    		}else{
    			edge.prev 	  = prevEdge;
    			prevEdge.next = edge;
    			if(i + 1 == corners.length){
    				firstEdge.prev = edge;
    				edge.next      = firstEdge;
    			}
    		}
    		prevEdge = edge;
    	}
    	scope.edgePointer = firstEdge;
	}

	this.init = function(){
		scope.countArea();
		scope.getWalls();
		updateWalls();
		updateInteriorCorners();
	}
	this.init();
}
//房间分区线段
var AreaWall = function(start,end){
	var scope  = this;
	var start = start;
	var end   = end;
	var deleted_callbacks = $.Callbacks();

	this.id    = getUuid();
	start.attachStart(this);
  	end.attachEnd(this);
  	
	this.setStart = function(corner){
  		start.detachWall(this);
  		corner.attachStart(this);
    	start = corner;
  	} 
  	this.setEnd = function(corner) {
	    end.detachWall(this);
	    corner.attachEnd(this);
	    end = corner;
	}
	this.getStart = function(){
		return start;
	}
	this.getEnd = function(){
		return end;
	}
  	this.fireOnDelete = function(func) {
    	deleted_callbacks.add(func);
  	}

	this.remove = function() {
	    start.detachWall(this);
	    end.detachWall(this);
	    deleted_callbacks.fire(this);
  	}

	function getUuid() {
    	return [start.id, end.id].join();
  	}
}

//type == 0 直墙 2孤墙 21承重墙
var Wall = function(start, end, wallObj){
	var scope    = this;
	this.id      = getUuid();
	this.wallObj = wallObj;
	var wallSize = {};
  	var start    = start;
  	var end      = end;
  	var doorWindow = []; 

  	this.thickness  = 20;   //厚度
  	this.height     = 2800; //高度  
  	this.edg        = 0;   //默认角度
  	this.type       = 0;   //默认类型 
  	this.backgroundType = 0; //默认背景类型
  	this.wallLength = 0;//长度

  	this.frontEdge = null;
  	this.backEdge  = null;
  	this.orphan    = false;
  	this.groundMinClearance = 0;
  	///this.wallStyle = 0;  	//0:普通墙、1：承重墙，2：矮墙,3:点击的颜色,4：鼠标浮动的颜色

  	this.clickAddColor = false;
  	this.centerPoint   = '';

  	this.startStop = 0;
  	this.endStop   = 0;

  	var deleted_callbacks = $.Callbacks();
  	var moved_callbacks   = $.Callbacks();
  	var items = []; //墙上的门窗
	var centerPoint = {};

  	if(this.wallObj){
  		scope.id  		 = scope.wallObj.id;
  		wallSize 		 = G_Utils.stringShear(scope.wallObj.size);
  		scope.thickness  = wallSize.y;
  		scope.height     = wallSize.z * 10;
  		scope.wallLength = wallSize.x * 10;
  		scope.type       = scope.wallObj.type;
  		scope.edg        = G_Utils.stringShear(scope.wallObj.rotate).y;
  	}

  	start.attachStart(this);
  	end.attachEnd(this);

	function getUuid() {
    	return [start.id, end.id].join();
  	}

	this.getCenterP = function(){
		return $agr.L_segm.midP(start, end); 
	}

    this.fireOnMove = function(func) {
    	moved_callbacks.add(func);
  	}

  	this.fireMoved = function() {
    	moved_callbacks.fire();
  	}

  	this.fireOnDelete = function(func) {
    	deleted_callbacks.add(func);
  	}
  	//更新位置

  	// this.updateItems = function(dx,dy){
  	// 	var witems = scope.getWallItems();
  	// 	if(witems && witems.length>0){
  	// 		//console.log(witems[0].x,witems[0].y,"更新前的item")
  	// 		//for(var i = 0;i<witems.length;i++){	
  	// 			witems[0].updateXy(dx,dy);
  	// 		//}	
  	// 	} 		
  	// }

    function updateParams(type){
  		scope.backgroundType = type;
  		switch(type){
  			case '1' :
  			scope.sofaEdgeStart = start.x + ','+start.y;
  			scope.sofaEdgeEnd   = end.x + ','+end.y;
  			break;
  			case '2' : 
  			scope.TVEdgeStart = start.x + ','+start.y;
  			scope.TVEdgeEnd   = end.x + ','+end.y;
  			break;
  			case '3' :
  			scope.DinnerTableEdgeStart = start.x + ','+start.y;
  			scope.DinnerTableEdgeEnd   = end.x + ','+end.y;
  			break;
  			case '4' :
  			scope.porcharkEdgeStart = start.x + ','+start.y;
  			scope.porcharkEdgeEnd   = end.x + ','+end.y;
  			break;
  			default:
  			console.log("没有");
  			break;
  		}
  	}

  	this.getItems = function(){
  		return items;
  	}
  	//移动或者点击时找到门窗
	this.findItem = function(x,y){ 		
  		let items = scope.getItems();
  		if(items && items.length>0){
			for(var i = 0;i<items.length;i++){		
				if(items[i].distanceFrom(x, y) <= 10){
					return items[i];
				}	
			}
		}
  	}

  	this.fireRedraw = function() {
	    if (scope.frontEdge) {
	      scope.frontEdge.redrawCallbacks.fire();
	    }
	    if (scope.backEdge) {
	      scope.backEdge.redrawCallbacks.fire();
	    }
	}

  	this.resetFrontBack = function() {
	    this.frontEdge  = null;
	    this.backEdge   = null; 
	    this.orphan     = false;
  	}

  	this.getEnd = function(){
  		return end
  	}

  	this.getStart = function(){
  		return start
  	}

  	this.getStartX = function(){
  		return start.getX();
  	}

  	this.getStartY = function(){
  		return start.getY();
  	}

  	this.getEndX = function(){
  		return end.getX();
  	}

  	this.getEndY = function(){
  		return end.getY();
  	}
  	this.setDoorWindow = function(d){
  		doorWindow.push(d);
  	}
  	this.getDoorWindows = function(){
  		return doorWindow;
  	}
	this.remove = function() {
		scope.getDoorWindows().forEach(function(item){
			item.remove();
		});
	    start.detachWall(this);
	    end.detachWall(this);
	    deleted_callbacks.fire(this);
  	}

  	this.setStart = function(corner){
  		start.detachWall(this);
  		corner.attachStart(this);
    	start = corner;
    	this.fireMoved();
  	} 

  	this.setEnd = function(corner) {
	    end.detachWall(this);
	    corner.attachEnd(this);
	    end = corner;
	    this.fireMoved();
	}

	this.snapToAxis = function(tolerance) {
	    // 这里的顺序很重要
	    start.snapToAxis(tolerance);
	    end.snapToAxis(tolerance);
  	}

  	this.relativeMove = function(dx, dy) {
    	start.relativeMove(dx, dy);
    	end.relativeMove(dx, dy);
    	doorWindow.forEach(function(item){
    		item.relativeMove(dx,dy);
    	});
  	}
  	this.distanceFrom = function(x, y) {
    	return G_Utils.pointDistanceFromLine(
    		x, 
    		y, 
      		this.getStartX(),
      		this.getStartY(), 
      		this.getEndX(),
      		this.getEndY()
      	);
  	}

  	this.updateEdg = function(){
  		 let rot    = Math.atan2(end.y - start.y,end.x - start.x);
  		 scope.edg  = Math.round(rot * 180 / Math.PI);
  		 if(scope.edg<0){
  		 	scope.edg = 360+scope.edg;
  		 } 
  	}
  	this.updateSize = function(flag,num){
  		//let n = 0 ;
  		if(flag == 'range_0'){
  			scope.thickness = num / 10;
  		}else if(flag == 'range_1'){

  		}
  	}
  	this.update = function(flag,data){
  		if(flag == 'type'){
  			scope.type = data;
  		}else if(flag == 'backType'){
  			updateParams(data);
  		}else if(flag == 'length'){
  			countLength();
  		}
  	}
  	this.getSize = function(){
  		let size = scope.wallLength + "," + scope.thickness + "," + scope.height;
  		return size;
  	}
  	function countLength(){
  		scope.wallLength =  $agr.L_segm.dist(start.getPoint(),end.getPoint()) * 10;
  	}
  	function countPoint(){
  		let point 		  =  $agr.L_segm.midP(scope.getStart(),scope.getEnd());
  		scope.centerPoint =  point.x + "," + point.y + "," +"0.0";
  	}
  	function countStopPoint(){
  		var vector 		=  $agr.L_segm.normalize(start.x,start.y,end.x,end.y);
		let th     		=  scope.thickness / 2;
  		scope.startStop = {'x': start.x + vector.x * -(th), 'y': start.y + vector.y *  -(th)};
  		scope.endStop   = {'x': end.x + vector.x * th, 'y': end.y+ vector.y *  th};
  	}
  	this.init = function(){
  		scope.updateEdg();
  		countLength();
  		countPoint();
  		countStopPoint();
  	}
  	scope.init();	
}

//墙
var Corner = function(floorplan, x, y, id) {
  //G_Utils.guid自主创建id
  	var scope       = this;
	this.id 		= id || G_Utils.guid();
	this.x  		= x;
	this.y  		= y;
	this.wallStarts = []; 
	this.wallEnds   = [];
	this.cornerType = '';
	
	var floorplan   = floorplan;
	var moved_callbacks   = $.Callbacks();
	var deleted_callbacks = $.Callbacks();
  	//闭合公差
  	var tolerance = 20;

  	this.fireOnMove = function(func) {
	    moved_callbacks.add(func);
	}	

	this.fireOnDelete = function(func) {
	    deleted_callbacks.add(func);
	}
  	//这里接收Wall对象 如果这里大于2个墙体则说明这个角点是公共角点至少有个关联墙体
  	this.attachStart = function(wall){
    	this.wallStarts.push(wall);
  	}
  	this.attachEnd = function(wall){
    	this.wallEnds.push(wall);
  	}
  	this.getX = function(){
  		return this.x
  	}
  	this.getY = function(){
  		return this.y
  	}
  	this.getPoint = function(){
  		return {'x':this.x,'y':this.y};
  	}
  	this.move = function(newX, newY,tolerance,flag) {
	    this.x = newX;
		this.y = newY;
		// console.log(newX,newY,"ner")
	    if(flag != 'wall'){
	    	scope.mergeWithIntersected2(5);
	    	return;
	    }
	    this.mergeWithIntersected(tolerance);
	    moved_callbacks.fire(this.x, this.y);
	    G_Utils.forEach(this.wallStarts, function(wall) {
	    	wall.init();
	      	wall.fireMoved();
	    });
	    G_Utils.forEach(this.wallEnds, function(wall) {
	      	wall.fireMoved();
	    });
	}
	//移动不是墙角的角点
	this.move2 = function(newX, newY) {
	    this.x  = newX;
	    this.y  = newY;
	    scope.mergeWithIntersected2();
	}
  	//把墙角捕捉到轴上
  	this.snapToAxis = function(tolerance) {   
	    var snapped = {
	      	x: false,
	      	y: false
	    };
	    G_Utils.forEach(this.adjacentCorners(), function(corner) {
	      if (Math.abs(corner.x - scope.x) < tolerance) {
	        scope.x   = corner.x;
	        snapped.x = true;
	      } 
	      if (Math.abs(corner.y - scope.y) < tolerance) {
	        scope.y = corner.y;
	        snapped.y = true;
	      }
	    });
	    return snapped;
  	}

	this.relativeMove = function(dx, dy) {
	    this.move(this.x + dx, this.y + dy);
	}
	this.relativeMove2 = function(dx, dy) {
	    this.move2(this.x + dx, this.y + dy);
	}
	//对比墙体的结束角点和现在的角点
	this.wallTo = function(corner) {
	    for( var i = 0; i < this.wallStarts.length; i++ ) {
	      if (this.wallStarts[i].getEnd() === corner) {
	        return this.wallStarts[i];
	      }
	    }
	    return null; 
	}
	//对比墙体的开始的角点和现在的角点
	this.wallFrom = function(corner) {
	    for( var i = 0; i < this.wallEnds.length; i++ ) {
	      if (this.wallEnds[i].getStart() === corner) {
	        return this.wallEnds[i];
	      }
	    } 
	    return null;
	}

  	this.distanceFrom = function(x,y){
  		var distance  = G_Utils.distance(x, y, this.x, this.y);
    	return distance;
  	}
	
  	this.distanceFromCorner = function(corner) {
    	return this.distanceFrom(corner.x, corner.y);
	}
	//所有的坐标和现在的坐标进行比较
	this.distanceOnePoint = function(corner){
		return G_Utils.distanceOnePoint(corner.x,corner.y,this.x,this.y);
	}
  	this.distanceFromWall = function(wall) {
    	return wall.distanceFrom(this.x, this.y);
  	}

  	this.isWallConnected = function(wall){
  		for(var i = 0; i < this.wallStarts.length; i++){
  			if(this.wallStarts[i] == wall){
  				return true;
  			}
  		}
  		for(var i = 0; i < this.wallEnds.length; i++){
  			if(this.wallEnds[i] == wall){
  				return true;
  			}
  		}
  		return false;
  	}

  	this.remove = function() {
    	deleted_callbacks.fire(this);
  	}
  	//删除wall
  	this.detachWall = function(wall) {
    	G_Utils.removeValue(this.wallStarts, wall);
   		G_Utils.removeValue(this.wallEnds, wall);
    	if(this.wallStarts.length == 0 && this.wallEnds.length == 0) {   
      		this.remove();	
    	}     
  	}

  	this.removeAll = function() {
	    for( var i = 0; i < this.wallStarts.length; i++ ) {
	      this.wallStarts[i].remove();
	    }
	    for( var i = 0; i < this.wallEnds.length; i++ ) {
	      this.wallEnds[i].remove();  
	    } 
	    this.remove();
	}
	this.changePoint = function(x,y){
		this.x = x;
		this.y = y;
		// scope.mergeWithIntersected();
		scope.mergeWithIntersected2();
	}
  	//临近的corners
  	this.adjacentCorners = function(){
  		retArray = []
  		for(var i = 0; i < this.wallStarts.length;i++){
  			retArray.push(this.wallStarts[i].getEnd());
  		}
	  	for(var x = 0; x < this.wallEnds.length; x++){
	  		retArray.push(this.wallEnds[x].getStart());
	  	}
	  	return retArray;
  	}

  	this.combineWithCorner = function(corner){
  		 // 将位置更新到其他角
	    this.x = corner.x;
	    this.y = corner.y;
	    // 吸收另一个角落的墙开始和墙结束
	    for( var i = corner.wallStarts.length - 1; i >= 0; i-- ){
	      corner.wallStarts[i].setStart( this );
	    }
	    for( var i = corner.wallEnds.length - 1; i >= 0; i-- ){
	      corner.wallEnds[i].setEnd( this );         
	    }          
	    // 删除另一个角
	    corner.removeAll();
	    this.removeDuplicateWalls();
	    floorplan.update();
  	}
	this.mergeWithIntersected2 = function(tol) {
		if(tol && tol>0)tolerance = tol;
		var arr = floorplan.getWalls();
  		for(var i = 0; i < arr.length; i++){
  			var obj = arr[i]
  			// 更新在墙上的位置
  			if(this.distanceFromWall(obj) < tolerance)
  			{
  				var intersection = G_Utils.closestPointOnLine(
  								   this.x,
  								   this.y,
  								   obj.getStart().x,
  								   obj.getStart().y,
  								   obj.getEnd().x,
  								   obj.getEnd().y,
								)
  				//重新赋值
	  			this.x = intersection.x;
	  			this.y = intersection.y;
	        	return true;
  			}
  		}
	}
  	this.mergeWithIntersected = function(tol) {
		  //和临近的xy轴吸附
		function changeCor(obj){
			let fg = scope.distanceOnePoint(obj);
			if(fg){
				switch(fg){
					case 'x' : 
					scope.x = obj.x;
					break;
					
					case 'y' : 
					scope.y = obj.y;
					break;

					case 'all' :
					scope.combineWithCorner(obj);
					break;
				}
			}		
		}
  		//检查圆角是否重合
  		if(tol && tol>0)tolerance = tol;
  		var arr   = floorplan.getCorners();
  		for(var i = 0; i < arr.length; i++){
  			var obj = arr[i];
  			if(this.distanceFromCorner(obj) < tolerance && obj != this){
  				this.combineWithCorner(obj);
        		return true;
			}else if( obj != this ){
				changeCor(obj);
			}	  
  		}
  				
  		//检查墙壁
  		var arr = floorplan.getWalls();
  		for(var i = 0; i < arr.length; i++){
			var obj = arr[i];
			  // 更新在墙上的位置
  			if(this.distanceFromWall(obj) < tolerance && !this.isWallConnected( obj ))
  			{
  				var intersection = G_Utils.closestPointOnLine(
  								   this.x,
  								   this.y,
  								   obj.getStart().x,
  								   obj.getStart().y,
  								   obj.getEnd().x,
  								   obj.getEnd().y,
								)
  				//重新赋值
	  			this.x = intersection.x;
				this.y = intersection.y;
			
	  			// 把角折成2部分，与墙融为一体
				floorplan.newWall(this, obj.getEnd());
	        	obj.setEnd(this);
				floorplan.update();
				return obj;
			  }  
		}
  		return false;
  	}

  	// 确保没有重复的墙 (i.e. 起点和重点相同)
	this.removeDuplicateWalls = function() {
	    // 删除这些角之间的墙
	    var wallEndpoints   = {};
	    var wallStartpoints = {};
	    for( var i = this.wallStarts.length - 1; i >= 0; i-- ) {
	        if (this.wallStarts[i].getEnd() === this) {
	        	// 移除0长度墙 
	        	this.wallStarts[i].remove();   
	        } else if (this.wallStarts[i].getEnd().id in wallEndpoints) {
	        	// 删除复制墙
	        	this.wallStarts[i].remove();
	      	}else{
	        	wallEndpoints[this.wallStarts[i].getEnd().id] = true;
	      	}
	    }
	    for( var i = this.wallEnds.length - 1; i >= 0; i-- ) {
	      	if(this.wallEnds[i].getStart() === this) {
	        	// 移除0长度墙  
	        	this.wallEnds[i].remove();     
	      	}else if(this.wallEnds[i].getStart().id in wallStartpoints) {
	        	// 删除复制墙
	        	this.wallEnds[i].remove();
	      	}else{
	        	wallStartpoints[this.wallEnds[i].getStart().id] = true;
	      	}         
	    } 
	}
}

var Floorplan = function() {
	var scope   = this;	
	var defaultTolerance = 30.0; //默认公差

	var roomAreas = [];     //房间分区
	var corners   = [];		//墙角
	var walls     = [];     //墙
	var rooms     = [];     //所有房间
	var doors     = [];		//门窗
	var roomComs  = [];      //房间结构部件
	var areaWalls = [];      //所有的房间分区里的墙分区

	var orphanWalls = [];    //孤立的墙
	var originRooms = [];    //为了处理导入json合并房间数组

	var new_corner_callbacks 	= $.Callbacks();
	var new_wall_callbacks   	= $.Callbacks();
	var new_door_callbacks   	= $.Callbacks();
	var new_areaWall_callbacks  = $.Callbacks();
	var new_roomcoms_callbacks  = $.Callbacks();
	var updated_rooms 		 	= $.Callbacks();
	var roomId = 1;

  	this.newRoom = function(room){
  		let obj  = new Room(scope,[],room,room.id);
  		originRooms.push(obj);
  		return obj;
  	}
	this.newWall = function(start, end,wallObj) {
		let w = findPublicWall(walls,start,end);
		if(w)return w;

		let wall = new Wall(start,end,wallObj);
    	walls.push(wall);
    	wall.fireOnDelete(removeWall);
		new_wall_callbacks.fire(wall);
		// scope.isTestWallOverlap(wall);
    	scope.update();
    	return wall;
	}
	this.newCorner = function(x,y,id,flag){
		if(flag){
			let c = scope.overlappedCorner(x,y,10,flag);
			if(c)return c;
		}
		let corner = new Corner(this,x,y,id);
		corners.push(corner);
		corner.fireOnDelete(removeCorner);
		new_corner_callbacks.fire(corner);
		return corner;
	}
	this.newAreaWall = function(start,end){
  		let areaWall = new AreaWall(start,end);
  		areaWalls.push(areaWall);
  		areaWall.fireOnDelete(removeAreaWall);
  		new_areaWall_callbacks.fire(areaWall);
    	scope.update2();	
  		return areaWall;
  	}
  	//门窗
  	this.newDoorWindow = function(id,start,end,thickness,edg,obj){
  		let item 	   = new DoorWindow(id,start,end,thickness,edg,obj);
  		doors.push(item);	
  		item.fireOnDelete(removeDoorWindow);
  		new_door_callbacks.fire(item);
  		return item;
  	}
  	//房间结构
  	this.newRoomcom = function(id,x,y,length,width,height,edg,shape){
		let it = new RoomComponents(id,x,y,length,width,height,edg,shape);
  		roomComs.push(it);
  		it.fireOnDelete(removeRoomcom);
  		new_roomcoms_callbacks.fire(it);
  		return it;
  	}

  	/*
		重写操作start
  	*/
  	this.setDoors = function(door){
  		if(G_Utils.arrOrObj(door) === 'obj'){		
	  		doors.push(door);	
	  		scope.setCorners(door.getStart());
	  		scope.setCorners(door.getEnd());
	  		door.fireOnDelete(removeDoorWindow);
	  		new_door_callbacks.fire(door);
  		}else{
  			door.forEach(function(item){
				doors.push(item);	
		  		scope.setCorners(item.getStart());
		  		scope.setCorners(item.getEnd());
		  		item.fireOnDelete(removeDoorWindow);
		  		new_door_callbacks.fire(item);
  			});
  		}
  		return door;
  	}
  	this.setWalls = function(wall){ 
  		this.setCorners(wall.getStart());
		this.setCorners(wall.getEnd());
		walls.push(wall);
    	wall.fireOnDelete(removeWall);
		new_wall_callbacks.fire(wall);
    	scope.update();
    	return wall;
  	}
  	this.setCorners = function(corner){
  		corners.push(corner);
		corner.fireOnDelete(removeCorner);
		new_corner_callbacks.fire(corner);
		return corner;
  	}
  	this.changeCorner = function(x,y,id){
  		corners.forEach(function(item){
  			if(item.id == id){
  				item.changePoint(x,y);
  			}
  		});
  	}
  	this.setRoomcoms = function(com){
  		roomComs.push(com);
  		com.fireOnDelete(removeRoomcom);
  		new_roomcoms_callbacks.fire(com);
  		return com;
  	}
  	this.setAreaWalls = function(areaw){
  		scope.setCorners(areaw.getStart());
		scope.setCorners(areaw.getEnd());
  		areaWalls.push(areaw);
  		areaw.fireOnDelete(removeAreaWall);
  		new_areaWall_callbacks.fire(areaw);
    	scope.update2();	
  		return areaw;
  	}
  	this.setRooms = function(room){
  		room.wall.forEach(function(item){
		    item.setStart(item.getStart());
            item.setEnd(item.getEnd());
  			scope.setWalls(item);
  			scope.setDoors(item.getDoorWindows());
  		});
  		room.coms.forEach(function(item){
  			scope.setRoomcoms(item);
  		});
  	}

  	this.setRoomArea = function(roomarea){
  		roomarea.wall.forEach(function(item){
  			item.setStart(item.getStart());
            item.setEnd(item.getEnd());
  			scope.setAreaWalls(item);
  		});
  	}
  	/*
		重写操作end
  	*/

  	/*
		更新操作
		1.更新房间
		2.更新房间分区
  	*/
	this.update = function(){
		//重置

		G_Utils.forEach(walls, function(wall) {
	        wall.resetFrontBack();
	    });
	    let items = corners.filter(function(item){
	    	return item.cornerType === 'wall';
	    });

		let roomCorners = findRooms(items);

		rooms   		= [];
		//第一步 创建房间
		G_Utils.forEach(roomCorners,function(corner){	
			roomId++; 
			let r = new Room(scope, corner,null,roomId);
			rooms.push(r);
		});

		//第二步，边框线，生成边框
		assignOrphanEdges();
		updated_rooms.fire();
	}
	//找到分区的角点
	this.update2 = function(){
		roomAreas   = [];
		let items   = corners.filter(function(item){
			return item.cornerType === 'wallarea';
		});

		let areaCorners = findRooms(items);
		//第一步 创建房间分区
		G_Utils.forEach(areaCorners,function(corner){
			roomId++;
			let roomarea = new RoomArea(scope, corner,roomId);
			roomAreas.push(roomarea);
		});
	}

	/*
		更新操作end
  	*/
 
 	/*
		获取对象start
 	*/
  	this.getRoomCom = function(){
  		return roomComs;
  	}
  	this.getItems = function(){
  		return doors;
  	}
	this.getRooms = function(){
		return rooms.concat(originRooms);
	}
	this.getWalls = function(){
		return walls;
	}
	this.getCorners = function(){
		var result = [];
		var obj    = {};
		for(var i = 0;i<corners.length;i++){
			if(!obj[corners[i].id]){
				result.push(corners[i]);
				obj[corners[i].id] = true;
			}
		}
		corners = result;
		return corners;
	}
	this.getAreaWalls = function(){
		return areaWalls;
	}
	this.getRoomArea = function(){
		return roomAreas;
	}
	/*
		获取对象end
 	*/

	function findPublicWall(arr,start,end){
		//如果角点相同
		for(var i = 0;i<arr.length;i++){
			let w = arr[i];
			if( (w.getStart() == start && w.getEnd() == end) || (w.getStart() == end && w.getEnd() == start)){
				return arr[i];
			}
		}
		return false;
	}
 	/*
		找到对象start
		1.找到墙角
		2.找到墙体
		3.找到门窗
	 */
	this.overlappedCorner = function(x, y, tolerance,flag) {
	    var tolerance = tolerance || defaultTolerance;
	    var arr 	  = [];
	    for (i = 0; i < corners.length; i++) {
			if(flag){
				if (corners[i].distanceFrom(x, y) < tolerance && corners[i].cornerType == 'wall') {
					arr.push(corners[i]);
				}  
			}else{
				if (corners[i].distanceFrom(x, y) < tolerance) {
					arr.push(corners[i]);
				}  
			}      
		}
	    if(arr.length>1)return arr;
	    if(arr.length === 1)return arr[0];
	    return null;
	}
	//找到墙，添加obj是要知道需要检测的不是自己
  	this.overlappedWall = function(x, y, tolerance, obj) {
	    var tolerance   = tolerance || defaultTolerance;
		var arr         = [];
	    for (i = 0; i < walls.length; i++) {	
			if (walls[i].distanceFrom(x, y) < tolerance) {
				if(obj && obj.id == walls[i].id)continue;
				arr.push(walls[i]);
			} 		    
	    }
	    if(arr.length == 1)return arr[0];
	    if(arr.length > 1)return arr;
	    return null;
	}


  	this.overlappedItems = function(x, y, tolerance) {
	    var tolerance = tolerance || defaultTolerance;
	    for (i = 0; i < doors.length; i++) {
	      	if ( doors[i].distanceFrom(x, y) < tolerance) {
	       	 	return  doors[i];
	      	}      
	    }
	    return null;
	}
	function findRooms(corners) {
	  	function calculateTheta(previousCorner, currentCorner, nextCorner) {
		    var theta = G_Utils.angle2pi(
		    				previousCorner.x - currentCorner.x, 
		    				previousCorner.y - currentCorner.y,
		    				nextCorner.x - currentCorner.x,
		    				nextCorner.y - currentCorner.y
		    			);
		    return theta;
	    }
	  
	  	function removeDuplicateRooms(roomArray) {
		    var results  = [];
		    var lookup   = {};
		    var hashFunc = function(corner) {
		      return corner.id 
		    };
		    var sep = '-';
		    for (var i = 0; i < roomArray.length; i++) {
		      // 房间都是循环的，换个位置来检查唯一性
		      var add    = true;
		      var room   = roomArray[i];
		      for (var j = 0; j < room.length; j++) {
		        var roomShift = G_Utils.cycle(room, j);
		        var str 	  = G_Utils.map(roomShift, hashFunc).join(sep);
		        if(lookup.hasOwnProperty(str)) {
		          add = false;
		        }
		      }
		      if(add) {
		        results.push(roomArray[i]);
		        lookup[str] = true;
		      }
		    }
		    return results; 
		}

	  	function findTightestCycle(firstCorner, secondCorner) {
		    var stack = [];
		    var next  = {
		      	corner: secondCorner,
		      	previousCorners: [firstCorner]
		    };
		    var visited = {};
		    visited[firstCorner.id] = true;

		    while ( next ) {  
		      //更新以前的角点、当前角点和访问过的角点
		      	var currentCorner = next.corner;
		      	visited[currentCorner.id] = true; 
		    
		      	// 我们回到起点了吗？
		      	if ( next.corner === firstCorner && currentCorner !== secondCorner ) {
		        	return next.previousCorners;  
		      	}
		      
		      	var  addToStack = [];
		      	var  adjacentCorners = next.corner.adjacentCorners();  
		      	for( var i = 0; i <  adjacentCorners.length; i++ ) {
		            var nextCorner    = adjacentCorners[i];  
			        //我们是从这里来的吗？如果在第一个拐角处，而我们不在第二个拐角处，请破例。
			        if ( nextCorner.id in visited &&  !( nextCorner === firstCorner && currentCorner !== secondCorner )) {
			          continue;
			        }   
		        	//把它扔到队列上 
		        	addToStack.push( nextCorner );  
		      	}
		    
		        var previousCorners = next.previousCorners.slice(0);
		        previousCorners.push( currentCorner );  
		        if(addToStack.length > 1) {  
		        	// 先去看看最小的Theta
		        	var previousCorner = next.previousCorners[next.previousCorners.length - 1];
		        	addToStack.sort(function(a,b) {
		          		return (calculateTheta(previousCorner, currentCorner, b) - calculateTheta(previousCorner, currentCorner, a));
		        	});
		        }
		    
		        if(addToStack.length > 0) {
			        // 添加到堆栈
			        G_Utils.forEach(addToStack, function(corner) {
			            stack.push({
			               corner: corner,
			               previousCorners: previousCorners
			            });   
			        });
			    }    
		        // 跳下一个
		        next = stack.pop();
		    }
		    return [];  
	  	}

	  	// 为每个角、每个相邻的角查找最紧密的循环
	  	// TODO: 优化这一点，只检查具有大于2个相邻或孤立循环的角点
	    var loops = [];
	    
	    for (var i = 0; i < corners.length; i++) {
		    var firstCorner     = corners[i];
		    var adjacentCorners = firstCorner.adjacentCorners(); //拿到每一个角点在墙体里公用的角点

		    for(var j = 0; j < adjacentCorners.length; j++) {
		        var secondCorner = adjacentCorners[j];
		        var fs           = findTightestCycle(firstCorner, secondCorner);
		        loops.push(fs);
		    }
		}
		// 删除重复的点
		var uniqueLoops    = removeDuplicateRooms(loops);

		//移除
		var uniqueCCWLoops = G_Utils.removeIf(uniqueLoops, G_Utils.isClockwise);
		//console.log(uniqueCCWLoops,'返回的是什么')
		return uniqueCCWLoops;
	}
	/*
		找到对象end
 	*/

 	/*
		检测操作start
		1.在绘制分区时检测
		2.在添加门窗items时检测items是否有重合
		3.检测墙角点是不是单个的
		4.检测单个的墙
		5.检测是不是来自房间、来自哪个房间
		6.检测线段和其他线段是否相交
		7.检测2条线段是否重叠
 	*/
	
	this.isRoomAreaCoincidence = function(point){
		let arr = scope.getRoomArea();
		if(arr && arr.length>0){
			for(var i = 0;i<arr.length;i++){	
				let cor = arr[i].getCorners();
				if($agr.point.inPoly(point,cor))return true;
			}
		}
		return false;
	} 
	this.isItemsCoincidence = function(point){
		let arr = scope.getItems();
		if(arr && arr.length>0){
			for(var i = 0;i<arr.length;i++){	
				if($agr.point.inSegm(point,arr[i].getStart(),arr[i].getEnd())){
					return true;
				}
			}
		}
		return false;
	} 
	this.isAloneCorner = function(cor,wall){
		if(!cor)return false;
		let arr  = scope.getWalls();
		let arr2 = scope.getAreaWalls();

		if(wall){
			for(var i = 0;i<arr.length;i++){
				if(arr[i].id == wall.id)continue;
				if(cor === arr[i].getStart() || cor === arr[i].getEnd()){
					return true;
				}
			}
			return false;
		}

		for(var i = 0;i<arr.length;i++){
			if(cor === arr[i].getStart() || cor === arr[i].getEnd()){
				return true;
			}
		}
		for(var i = 0;i<arr2.length;i++){
			if(cor === arr2[i].getStart() || cor === arr2[i].getEnd()){
				return true;
			}
		}
		return false;
	}
	this.isponitFromRoom = function(x,y){
		let xy      = {'x':x,'y':y};
		let rooms   = scope.getRooms();
		let newRoom = [];
	
		for(var i = 0;i<rooms.length;i++){
			let roomPoint = [];
			let cor       = rooms[i].getCorners();
			cor.forEach(function(cur,i,all){
				let obj  = {'x': all[i].x, 'y': all[i].y}
				roomPoint.push(obj);
			})
			if($agr.point.inPoly(xy,roomPoint)){
				newRoom.push(rooms[i]);
			}	
		}
		if(newRoom.length === 0)return null;
		if(newRoom.length === 1)return newRoom[0];
		let area = Math.min.apply(Math, newRoom.map(function(o) {return o.area}));
		for(var j = 0;j<newRoom.length;j++){
			if(area == newRoom[j].area)return newRoom[j];
		}
		return null;
	}
	this.isLineInter = function(start,end){
		if(roomAreas.length>0){
			for(var i = 0;i<roomAreas.length;i++){
				let walls = roomAreas[i].getWalls();
				for(var j = 0;j<walls.length;j++){
					let s = walls[j].getStart();
					let e = walls[j].getEnd();
					if($agr.L_segm.inter(start,end,s,e))return true;
				}
			}
		}	
		return false;
	}
	//绘制过程中判断墙体是否重叠
	this.isLineOverLap = function(start,end){
		let wall  = this.getWalls();
		for(var i = 0;i<wall.length;i++){
			let s = wall[i].getStart();
			let e = wall[i].getEnd();
			if($agr.L_segm.overlap(start,end,s,e))return true;
		}
		return false;
	}
	/**
	 * 这里分2种情况，重叠或者相交
	 */
	this.isTestWallOverlap = function(wall){
		
		function findCorner(r){
			for(var i = 0;i<corners.length;i++){
				if(r == corners[i] || r.id == corners[i].id)return true;
			}
		}
		let joinPoint = [];
		for(var i = 0;i<walls.length;i++){
			if(wall.id == walls[i].id)continue;
			let s = walls[i].getStart();
			let e = walls[i].getEnd();
			let res  = $agr.L_segm.inter(wall.getStart(),wall.getEnd(),s,e); //相交
			let res2 = $agr.point.inStra({'x':s.x,'y':s.y},wall.getStart(),wall.getEnd()); //重叠
		
			if(res){
				if(findCorner(res))continue;
				joinPoint.push(res);
			}
		}
		if(joinPoint.length>0){
			for(var i = 0;i<joinPoint.length;i++){
				let d = joinPoint[i];
				
				let c = scope.newCorner(d.x,d.y);
				c.cornerType = 'wall';
				c.mergeWithIntersected();
				let w = scope.newWall(wall.getStart(),c);
			
			}
		}
	}
	//物体移动时碰撞检测
	this.moveCheck = function(w,mouseX,mouseY){
		let x = 0,
			y = 0;
		let stop1X = Number(w.startStop.x.toFixed(1));
		let stop1Y = Number(w.startStop.y.toFixed(1));
		let stop2X = Number(w.endStop.x.toFixed(1));
		let stop2Y = Number(w.endStop.y.toFixed(1));
	
		x = Math.min(Math.max(stop1X, mouseX), stop2X);
		y = Math.min(Math.max(stop1Y, mouseY), stop2Y);
		if( (x == stop1X && y == stop1Y) || (x == stop2X && y == stop2Y) ){
			return {'x': x, 'y': y};
		}else{
			x = Math.max(Math.min(stop2X, mouseX), stop1X);
			y = Math.max(Math.min(stop2Y, mouseY), stop1Y);
			if( (x == stop1X && y == stop1Y) || (x == stop2X && y == stop2Y) ){
				return {'x': x, 'y': y};
			}
			return {'x': mouseX, 'y': mouseY};
		}
	}

	/*
		检测操作end
	*/
	//找到需要显示input的墙
	this.findAloneWall = function(wall){
		let ws  = wall.getStart();
		let we  = wall.getEnd();
		let allWall = []
		ws.wallStarts.filter(function(w){
			if(wall.id != w.id)allWall.push(w);
		});
		ws.wallEnds.filter(function(w){
			if(wall.id != w.id)allWall.push(w);
		});
		we.wallStarts.filter(function(w){
			if(wall.id != w.id)allWall.push(w);
		});
		we.wallEnds.filter(function(w){
			if(wall.id != w.id)allWall.push(w);
		});
		if(allWall.length <= 1)allWall.push(wall);
		return allWall;
	}
	//修改墙的长度
	this.changeWallsLength = function(walls,num,myId){

		let mywall = walls.filter(function(item){
			return myId == item.id;
		});
		if(mywall){
			let length = (mywall[0].wallLength - num) / 10;
			let stx    = mywall[0].getStartX();
			let sty    = mywall[0].getStartY();
			let etx    = mywall[0].getEndX();
			let ety    = mywall[0].getEndY();
			var vector = $agr.L_segm.normalize(stx,sty,etx,ety);
			mywall[0].getStart().changePoint( stx+vector.x* -(length), sty+vector.y* -(length) )
		}
	}

	/*
		删除操作start
		1.删除墙角
		2.删除房间结构部件
		3.删除门窗
		4.删除房间分区
		5.删除墙体
	*/
	function removeCorner(corner){
		G_Utils.removeValue(corners,corner);
	}
	function removeRoomcom(roomcom){
		G_Utils.removeValue(roomComs,roomcom);
	}
	function removeDoorWindow(item){
		G_Utils.removeValue(doors,item);
	}
	function removeAreaWall(wall){
		G_Utils.removeValue(areaWalls,wall);
		scope.update2();
	}
	function removeWall(wall){
		let its = scope.getItems();
		for(var i = 0;i<its.length;i++){
			let start = wall.getStart();
			let end   = wall.getEnd();
			let s     = its[i].getStart();
			let e     = its[i].getEnd();
			if($agr.L_segm.overlap(start,end,s,e)){
				its[i].remove();
			}
		}
		G_Utils.removeValue(walls,wall);
		scope.update();
	}
	var cmPerPixel = 1.0;
	this.setOrigin = function(x,y){
  		this.originX = x;
  		this.originY = y;
  	}

  	//将canvas坐标转换成算法坐标---左下角0,0
	function countXy(x,y){
		x = Number(x);
		y = Number(y);
		var x1 = (x-320) * cmPerPixel - scope.originX * cmPerPixel;
		var y1 = (y+30)  * cmPerPixel - scope.originY * cmPerPixel;
		return {"x": x1,"y": y1};
	}
	/*
		删除操作 end
	*/

	//孤立的墙
	function assignOrphanEdges(){
		orphanWalls = [];
		G_Utils.forEach(walls,function(wall){
			if(!wall.frontEdge && !wall.backEdge){
				wall.orphan = true;
				var back   = new HalfEdge(null,wall,false);
		        var front  = new HalfEdge(null, wall, true);
		        orphanWalls.push(wall);
			}
		});
	}

	//清空重置
	this.reset = function(){
		roomAreas = [];     //房间分区
		corners   = [];		//墙角
		walls     = [];     //墙
		rooms     = [];     //所有房间
		doors     = [];		//门窗
		roomComs  = [];      //房间结构部件
		areaWalls = [];      //所有的房间分区里的墙分区
		orphanWalls = [];    //孤立的墙
		originRooms = [];    //为了处理导入json合并房间数组
	}

	function entityObj(obj){
		let start = countXy(obj.getStartX(),obj.getStartY());
		let end   = countXy(obj.getEndX(),obj.getEndY());
		let temp = {
			"rotate":"0.0"+","+obj.edg+".0"+","+"0.0",
			"wallFace": 0,
			"isIntersectWall": "No",
			"modelID": "0",
			"isDoorMirror": "No",
			"nextCenterPoint": "",
			"capStyle": 1,
			"groundMinClearance": obj.groundMinClearance,
			"parentEntityId": "-1",
			"type": obj.type,
			"groundMaxClearance": 0,
			"startPoint": start.x+","+start.y+","+"0.0",
			"centerPoint": obj.centerPoint,
			"endPoint": end.x+","+end.y+","+"0.0",
			"isVirtualWall": "No",
			"size": obj.getSize(),
			"id": obj.id,
			"radius": 0,
			"isMainDoor": "No"
		}
		return temp;
	}
	function unitWallBackground(start,end){
		let st = start.split(",");
	  	let en = end.split(",");
	  	return [ countXy(st[0],st[1]) , countXy(en[0],en[1])];
	}
	function wallBackground(type,obj){
		let newObj = [];
		let point  = null;
		switch(type){
		  	case '1' :
		  	point = unitWallBackground(obj.sofaEdgeStart,obj.sofaEdgeEnd);
		  	newObj.push({'key': 'sofaEdgeStart','value': point[0] });
		  	newObj.push({'key': 'sofaEdgeEnd','value': point[1] });
  			break;
  			case '2' : 
		  	point = unitWallBackground(obj.TVEdgeStart,obj.TVEdgeEnd);
  			newObj.push({'key': 'TVEdgeStart','value': point[0] });
		  	newObj.push({'key': 'TVEdgeEnd','value': point[1] });
  			break;
  			case '3' :
  			point = unitWallBackground(obj.DinnerTableEdgeStart,obj.DinnerTableEdgeEnd);
  			newObj.push({'key': 'TDinnerTableEdgeStart','value': point[0] });
		  	newObj.push({'key': 'DinnerTableEdgeEnd','value': point[1] });
  			break;
  			case '4' :
  			point = unitWallBackground(obj.porcharkEdgeStart,obj.porcharkEdgeEnd);
  			newObj.push({'key': 'porcharkEdgeStart','value': point[0] });
		  	newObj.push({'key': 'porcharkEdgeEnd','value': point[1] });
  			break;
  			default:
  			console.log("没有");
  			break;
		}
		return newObj;
	}

	function roomAreaAddRoom(){
		if(roomAreas.length>0){
			for(var i = 0;i<roomAreas.length;i++){
				let cor = roomAreas[i].getCorners()[0];	
				for(var j = 0;j<rooms.length;j++){
					let roomPoint = [];
					let roomcor   = rooms[j].getCorners();
					for(var t = 0;t<roomcor.length;t++){
						roomPoint.push({'x':roomcor[t].x,'y':roomcor[t].y})
					}
					if($agr.point.inPoly({'x':cor.x,'y':cor.y},roomPoint)){
						rooms[j].setRoomArea(roomAreas[i]);
					};
				}
			}

		}
	}

	this.savaFloorplan2 = function(){
		localStorage.clear();
		let houseObj = {
			rooms: [],
			corners: {},
			walls: [],
			doorWindow: [],
			roomcom: [],
			roomArea: [],
			areaWall: [],
		}

		//墙角
		G_Utils.forEach(corners,function(corner){
			houseObj.corners[corner.id] = {
				'x': corner.x,
				'y': corner.y,
				'cornerType': corner.cornerType 
			}
		});
		//墙
		G_Utils.forEach(walls,function(wall){
			houseObj.walls.push({
				'corner1': wall.getStart().id,
				'corner2': wall.getEnd().id,
				'type': wall.type,
				'thickness': wall.thickness,
				'backgroundType': wall.backgroundType
			});
		});
		//门窗
		G_Utils.forEach(doors,function(door){
			houseObj.doorWindow.push({
				'corner1': door.getStart().id,
				'corner2': door.getEnd().id,
				'type': door.type,	
				'edg':  door.edg,
				'size': door.getSize(),
			});
		});
		G_Utils.forEach(roomComs,function(com){
			let len = com.shape == 1601 ? com.length : com.diameter;
			let po  = com.type == 15 ? com.getCenterP() : {'x': com.x, 'y': com.y}; 
			houseObj.roomcom.push({
				'x': po.x,
				'y': po.y,
				'length': len,
				'width': com.width,
				'thickness': com.thickness,
				'height': com.height,
				'shape': com.shape,
				'edg': com.edg,
				'type': com.type
			});
		});
		//房间分区的墙体
		G_Utils.forEach(areaWalls,function(area){
			houseObj.areaWall.push({
				'corner1': area.getStart().id,
				'corner2': area.getEnd().id,
			});
		});
		//房间分区
		G_Utils.forEach(roomAreas,function(arearoom){
			let roomsObj = {
				'id': [],
				'type': arearoom.type,
			}
			let corner   = arearoom.getCorners();
			G_Utils.forEach(corner,function(c){
				roomsObj.id.push(c.id);
			});
			houseObj.roomArea.push(roomsObj);
		});
		//房间
		if(rooms.length>0){
			for(var i = 0;i<rooms.length;i++){
				let r 	     = rooms[i];
				let roomsObj = {
					'id': [],
					'type': r.type,
				}
				let corner   = r.getCorners();
				G_Utils.forEach(corner,function(c){
					roomsObj.id.push(c.id);
				});
				houseObj.rooms.push(roomsObj);
			}
		}
		localStorage.setItem('house',JSON.stringify(houseObj));
	}

	this.savaFloorplan = function(){

		localStorage.clear();
		roomAreaAddRoom();
		let houseUnit  = {
			"area": "",
			"rooms": [],
			"shape": "",
			"orient": "",
			"roamingPoint": [],
			"isProtoRoom": "",
			"furnStyle": "16",
			"isCopyModelRoom": false,
			"decStyle": "16",
			"buildingType": "",
			"pixelRate": "1.0",
			"centerPoint": ""
		};
	
		let cor  	 = [];
		let wall 	 = [];
		let door     = [];
		let areaWall = [];
		let roomcom  = [];

		if(rooms.length>0){
			for(var i = 0,len = rooms.length;i<len;i++){
				let r     = rooms[i];
				let c     = r.getCorners();  //墙角
				let w     = r.getWalls();    //墙
				let coms  = r.getRoomComs(); //房间结构部件
				let ra    = r.getRoomArea(); //分区
				let xy    = countXy(r.areaCenter.x,r.areaCenter.y);
				let obj   = {
					'area':r.area*100000,
					'roomName':r.name,
					'type':r.type,
					'id':r.id,
					'centerPoint':xy.x+','+xy.y,
					'entity': [],
					"isVirtualRoom": "-1",
					"parentRoomID": "-1",
					"lightSolution": [],
					"storey": 1,
					"decStyle": "16",
					"jointPoint": [],
					// "corners": [],
					// "walls": [],
					"region": {
						"roof": [],
						"floor": [],
						"wall": []
					}
				};

				// if(c.length>0){
				// 	for(var i = 0;i<c.length;i++){
				// 		obj.corners.push({'id':c[i].id,'x':c[i].x,'y':c[i].y});
				// 		// obj.corners[c[i].id] = {
				// 		// 	'x': c[i].x,
				// 		// 	'y': c[i].y
				// 		// } 
				// 	}
				// }

				//房间结构
				if(coms.length>0){
					coms.forEach(function(item){
						obj.entity.push(entityObj(item));
					})
				}
				for(var j = 0;j<w.length;j++){
					// obj.walls.push({
					// 	'corner1': w[j].getStart().id,
					// 	'corner2': w[j].getEnd().id
					// });
					//背景墙
					if(w[j].backgroundType != 0){
						let wstyle = wallBackground(w[j].backgroundType,w[j]);
						obj[wstyle[0].key] = wstyle[0].value; 
						obj[wstyle[1].key] = wstyle[1].value; 
					}
					//墙
					obj.entity.push(entityObj(w[j]));
					let door = w[j].getDoorWindows(); //根据墙找到门窗
					if(door.length>0){
						door.forEach(function(item){
							obj.entity.push(entityObj(item));
						});
					}
				};
				if(ra.length>0){
					for(var x = 0;x<ra.length;x++){	
						let raobj = {
							"regionPoint": [],
							"name": ra[x].name,
							"id": ra[x].id,
							"type": ra[x].type,
						}
						let w = ra[x].getCorners();
						w.forEach(function(item){				
							let point = countXy(item.x).x + "," + countXy(item.y).y;
							raobj.regionPoint.push(point);
						});
						obj.region.roof.push(raobj);
					}
				}
				houseUnit.rooms.push(obj);	
			}
		}
		localStorage.setItem('room',JSON.stringify(houseUnit));
		let obj = {'houseUnit':houseUnit};
		return obj;
	}	
}

var Floorplanner = function(canvas, floorplan) {	
	var scope    = this;
	this.roomJson = false;
    this.originX = 0;
    this.originY = 0;
    this.targetX = 0;
  	this.targetY = 0;
    this.modes   = {
    	MOVE: 0, //移动
    	DRAW: 1, //画
    	DELETE: 2,//删除
    	DRAWROOM:3,//画房间
    	DRAWAREA:4,//画房间
    };

	var cmPerPixel    = 1.0 ;

	var rawMouseX     = 0,
		rawMouseY     = 0;
    this.mode         = 0;
    this.lastNode     = null;
    //是否正在画墙
    this.isDraw 	  = false;  
    //是否在画房间
    this.isDrawRoom   = false;
    //是否在画分区
    this.isDrawArea   = false;
    //是否在画门窗  
    this.addItemState = false;
    //移动时的墙
    this.activeWall   = null;
    //移动的墙角
  	this.activeCorner = null;  
  	//删除的墙
  	this.findWall     = null;     
  	//找到房间
  	this.activeRoom   = null; 
  	//确定选中房间
  	this.findRoom     = null;
  	//房间分区
  	this.activeRoomArea = null;
  	//门窗
  	this.activeDoor    = null;
  	//找到结构部件
  	this.activeRoomCom = null;
  	//点击选中的门窗
  	this.findDoor      = null;
  	this.changeWalls   = null;
  	var isChangeCorner = false;

  	var startX       = 0;
  	var startY       = 0;     

  	var drawnum      	= 0; 
  	var rightClickCount = 0; //记录鼠标右击次数
	//门窗参数
  	this.itemData     = {
  		type: 0,         //itemid
  		x: 0.00,           //item的x
  		y: 0.00,           //item的y
  		edg: 180,         //item的角度
  		itemWidth: 0,      //item的宽度,
  		wall: null,
  		start: null,
  		end: null,
  		thickness: 0,
	}
 
    var mouseX        = 0;
  	var mouseY        = 0;
  	//最后的点击坐标
  	var lastX = 0;
  	var lastY = 0;

    var mouseDown  = false;
    var mouseMoved = false;

    var canvasElement = $('#'+canvas);

    var view       = new FloorplannerView(floorplan, this, canvas);
  	var floorplan  = floorplan;
  	//为了使墙轴对齐，我们要移动一个角多少cm
  	var snapTolerance   = 25;
  	var centerFloorplan = {"x":0,"y":0,"z":0};
  	var moveCorner      = {};
  	var moveObj         = 0;

  	this.xy        = {}; //识别空间墙面坐标
  	this.resetState = function(){
  		rightClickCount = 0;
  		this.isDraw 	  = false;  
	    this.isDrawRoom   = false;
	    this.isDrawArea   = false;
	    this.addItemState = false;
	}
	  
    this.setMode   = function(mode) {
    	scope.lastNode = null;
	    scope.mode     = mode;
	    updateTarget();
	}

	this.setItemMode = function(mode,flag){
		scope.itemData.type = mode;
		if(flag){
			scope.addItemState = false;
			scope.itemWalls    = null;
			scope.activeRoom   = null;
			$("#J_ctrlcanvas .draw").removeClass("active");
		}
	}

	//分割墙体时
	this.createNewCorner = function(centerPoint,obj){

		let corner = floorplan.newCorner(centerPoint.x,centerPoint.y);
		corner.cornerType = 'wall';

		let wall1       = floorplan.newWall(obj.getStart(),corner);
		let wall2       = floorplan.newWall(corner,obj.getEnd());
		wall2.thickness = wall1.thickness = obj.thickness;
		G_Utils.operationalStorage("cutWall",{'my':obj, 'w1': wall1, 'w2': wall2});
		obj.remove();

	}

	//在墙上吸附门窗
	this.drawDoorWindow = function(w,type){
		
		let room,stx,sty,ety,etx,flag;
		let wall = w;
		if(G_Utils.arrOrObj(w) == 'arr')wall = w[0];
	
		let item = G_All_DoorWindow.filter(function(currentValue,i,arr){
			return type == arr[i].type;
		});
		if(G_Utils.arrOrObj(item) == 'arr')item = item[0];

		stx     =  wall.getStartX();
		sty     =  wall.getStartY();
		etx     =  wall.getEndX();
		ety     =  wall.getEndY();
	
		let start,end,verP,centerPoint;
		let len     = item.length;
		let wid     = item.thickness;
		let l_2     = len/2;	
		let vector  = $agr.L_segm.normalize(stx,sty,etx,ety);
		centerPoint	= $agr.point.vertiP({"x":mouseX,"y":mouseY},{"x":stx,"y":sty},{"x":etx,"y":ety}); //找到垂直中心点;

		start       =  {'x': centerPoint.x+vector.x*l_2,'y': centerPoint.y+vector.y*l_2};
		end         =  {'x': centerPoint.x-vector.x*l_2,'y': centerPoint.y-vector.y*l_2};

		//类型3最少需要3个参数 起始点，角度，结束点，墙宽
		scope.itemData.start = start;
		scope.itemData.end   = end;
		scope.itemData.edg   = wall.edg;
		scope.itemData.itemWidth  = len;
		scope.itemData.thickness  = wall.thickness;
		view.drawItems(type,start,end,wall.thickness,wall.edg);
	}

	function isponitFromRoom(room){
		if(room){
			let roomPoint = [];
			let xy    	  = {'x':mouseX,'y':mouseY};
			let cor       = room.getCorners();
			for(var i = 0; i < cor.length; i++){		
				var obj  = {'x': cor[i].x, 'y': cor[i].y}
				roomPoint.push(obj);	    			
			}
			//求坐标是否在多边形内
			if($agr.point.inPoly(xy,roomPoint))return room;		
		}
		return null;
	}

	function removeColor(){
		var rooms 	 = floorplan.getRooms();
		var walls 	 = floorplan.getWalls();
		var roomArea = floorplan.getRoomArea();
		var roomCom  = floorplan.getRoomCom();
		if(rooms && rooms.length>0){
			rooms.forEach(function(item){
				item.areaColor = false;
			});
		}	
  		if(walls && walls.length>0){
  			walls.forEach(function(item){
  				item.clickAddColor = false;
  			});
  		}
  		if(roomArea && roomArea.length>0){
  			roomArea.forEach(function(item){
  				item.areaColor = false;
  			});
  		}
  		if(roomCom.length>0){
  			roomCom.forEach(function(item){
  				item.isSelected = false;
  			});
  		}
  		$(".span-input-container").html('');
  		view.draw();
	}

	//吸附功能
	function updateTarget(){ 
		if (scope.mode == scope.modes.DRAW && scope.lastNode && scope.lastNode == 'wall') { 
		    if (Math.abs(mouseX - scope.lastNode.x) < snapTolerance) {
		        scope.targetX = scope.lastNode.x;        
		    } else {
		        scope.targetX = mouseX;
		    }
		    if (Math.abs(mouseY - scope.lastNode.y) < snapTolerance) {
		        scope.targetY = scope.lastNode.y;
		    } else {
		        scope.targetY = mouseY;
		    }
		}else{
			scope.targetX = mouseX;
	    	scope.targetY = mouseY;  
		}
		view.draw();
	}
	//转换成中心点坐标
	function countXy(x,y){
		var x1 = (x-320) * cmPerPixel + scope.originX * cmPerPixel;
		var y1 = y  * cmPerPixel + scope.originY * cmPerPixel;
		return {"x": x1,"y": y1};
	}
	//算法json坐标转换成canvas坐标
	function countXy2(x,y){
		var x1 = (x+320) * cmPerPixel + scope.originX * cmPerPixel;
		var y1 = y-30  * cmPerPixel + scope.originY * cmPerPixel;
		return {"x": x1,"y": y1};
	}

	//设置保存撤销路劲;
	function setOperationalStorage(){
		if( scope.activeCorner){
			if(moveObj == 1){
				if(G_Utils.comporePoint(moveCorner.x,moveCorner.y,scope.activeCorner.x,scope.activeCorner.y)){	
					G_Utils.operationalStorage("moveCorner",{'my':scope.activeCorner,'originObj': JSON.stringify(moveCorner)});
				};  
			}
			if( moveObj == 2 ){
				if( G_Utils.comporePoint(moveCorner.start.x,moveCorner.start.y,scope.activeWall.getStart().x,scope.activeWall.getStart().y) || 
					G_Utils.comporePoint(moveCorner.end.x,moveCorner.end.y,scope.activeWall.getEnd().x,scope.activeWall.getEnd().y)){
					G_Utils.operationalStorage("moveWall",{'my':scope.activeWall,'originObj': JSON.stringify(moveCorner)});
				}
			}
			if( moveObj == 3 ){
				if( G_Utils.comporePoint(moveCorner.start.x,moveCorner.start.y,scope.activeDoor.getStart().x,scope.activeDoor.getStart().y) || 
					G_Utils.comporePoint(moveCorner.end.x,moveCorner.end.y,scope.activeDoor.getEnd().x,scope.activeDoor.getEnd().y)){
					G_Utils.operationalStorage("moveDoor",{'my': scope.activeDoor,'originObj': JSON.stringify(moveCorner)});
				}
			}
			if( moveObj == 4 ){
				if( G_Utils.comporePoint( moveCorner.start.x, moveCorner.start.y, scope.activeRoomCom.x, scope.activeRoomCom.y ) ){
					G_Utils.operationalStorage("moveCom",{'my': scope.activeRoomCom,'originObj': JSON.stringify(moveCorner)});
				}
			}
	    } 
	}

	/*
	* 鼠标按下事件分2种情况
	*	1.如果不在画墙状态下检测门窗、检测墙面
	*	2.如果在画墙状态下画墙
	*/
	function mousedown(e){

		e.preventDefault();
		mouseX = countXy( e.clientX, e.clientY ).x;
		mouseY = countXy( e.clientX, e.clientY ).y;

		if(e.button == 2)return;
		let temp = floorplan.overlappedCorner(mouseX, mouseY,15);   	
		if(temp){
			moveCorner.cornerType = temp.cornerType;
			moveCorner.x          = temp.x;
			moveCorner.y          = temp.y;
			moveCorner.id         = temp.id;
		}else{
			moveCorner = {};
			let hoverWall   = floorplan.overlappedWall(mouseX, mouseY,10);		
			if(hoverWall){
				moveCorner.start = {'x': hoverWall.getStart().x,'y': hoverWall.getStart().y,'id':hoverWall.getStart().id};
				moveCorner.end   = {'x': hoverWall.getEnd().x,'y': hoverWall.getEnd().y,'id':hoverWall.getEnd().id};
			}
			let door   = floorplan.overlappedItems(mouseX, mouseY,10);
			if(door){
				moveCorner.start = {'x': door.getStart().x,'y': door.getStart().y,'id': door.getStart().id};
				moveCorner.end   = {'x': door.getEnd().x,'y': door.getEnd().y,'id': door.getEnd().id};
			}
			let com = G_Utils.forEach2(floorplan.getRoomCom(),isponitFromRoom)
			if(com){
				moveCorner.start = {'x':com.x,'y':com.y};
			}
		}

		//墙
		if(scope.isDraw && scope.mode != scope.modes.DRAW){
			rightClickCount = 0;
			scope.setMode(scope.modes.DRAW);
		}

		//房间
		if(scope.isDrawRoom  && drawnum === 0){
			if(scope.mode != scope.modes.DRAWROOM)scope.setMode(scope.modes.DRAWROOM);
			rightClickCount = 0;
			startX  = mouseX; 
    		startY  = mouseY; 
		}
		if(scope.isDrawRoom && scope.mode != scope.modes.DRAWROOM){		
			rightClickCount = 0;
    		scope.setMode(scope.modes.DRAWROOM);	
		}
		//分区
		if(scope.isDrawArea && scope.mode != scope.modes.DRAWAREA){
			rightClickCount = 0;
			scope.setMode(scope.modes.DRAWAREA);
		}

		$("body .ctrlDom").remove();		
		mouseDown  = true;
    	lastX = e.clientX;
    	lastY = e.clientY;

	}

	function mousemove(event) {		
	    // 更新移动x,y
	    rawMouseX = event.clientX;
	    rawMouseY = event.clientY;

	    mouseX    = countXy(rawMouseX,rawMouseY).x;
	    mouseY    = countXy(rawMouseX,rawMouseY).y;
	    // 一、移动时画图-第一种情况
	    if (scope.mode == scope.modes.DRAW || (scope.mode == scope.modes.MOVE && mouseDown) || (scope.mode == scope.modes.DRAWROOM && scope.isDrawRoom) || (scope.mode == scope.modes.DRAWAREA && scope.isDrawArea)) {       	
			  updateTarget();
	    }
	    //二、不在绘制状态的移动-->找到目标的圆角和墙面 
	    if (!mouseDown  && !scope.isDraw && !scope.addItemState && !scope.isDrawArea) {  
			
	    	//找到墙角传入坐标、吸附值，标记
	      	var hoverCorner = floorplan.overlappedCorner(mouseX, mouseY,15);     

	      	//找到墙面
	      	var hoverWall   = floorplan.overlappedWall(mouseX, mouseY,10);
	      	//找到门窗
	      	var hoverItem   = floorplan.overlappedItems(mouseX, mouseY,10);
	
	      	let draw 		= false;
	    	// console.log(hoverWall,"hoverWall")
	      	//1.找到门窗,如果找到门窗就不继续找墙角和墙了
	      	if(hoverItem){
	      		scope.activeDoor = hoverItem;
	      		draw = true;
	      	}else{
	      		scope.activeDoor = null;
	      	}

	      	// //如果找到了角点就不再去找墙体
	      	if(scope.activeCorner != hoverCorner) {
	      		//处理可能会找到墙的角点和门窗的角点
	      		// console.log(hoverCorner)
	      		if(scope.findDoor && hoverCorner && hoverCorner.length>1){

	      			hoverCorner = hoverCorner.filter(function(item){
	      				if(item.cornerType == "doorw")return item;
	      			});
	      			if(G_Utils.arrOrObj(hoverCorner)=="arr"){
	      				hoverCorner = hoverCorner[0];
	      			}
	      		}
	      		scope.activeCorner =  hoverCorner;
	      		draw = true;  
	      	}
	      	//如果没有找到Corner的时候再查看又没有找到Wall,如果是共同的墙这里可能是个数组
	      	if(!scope.activeDoor && scope.activeCorner == null){	 
		        if(hoverWall != scope.activeWall) {
		        	// console.log(hoverWall,"hoverWal")  
		           scope.activeWall   = hoverWall;
		           draw = true;
		        }      	
	      	}else{
	        	scope.activeWall = null;
	      	} 		
		  
	     	//绘制
	        if (draw){
	            view.draw();
	        }
	        return;
	    }

	    /*
	    添加门窗结构部件、scope.addItemState为true
	    1.type类型大于=16的属于结构部件
	    2.type类型小于16的属于门窗系列
	    3.如果是门窗类型找到墙就吸附，如果是结构部件按下鼠标时再判断是不是放在房间里
	    */
	    if(scope.addItemState){
	    	if(scope.itemData.type<15){
	    		scope.itemWalls = floorplan.overlappedWall(mouseX, mouseY,40);	
	    	}else if(scope.itemData.type == 17 || scope.itemData.type== 18){
				scope.itemWalls = floorplan.overlappedWall(mouseX, mouseY,20);	
			}
	    	updateTarget();  		    	
	    }
	    //拖拽平移
	    if (mouseDown && !scope.activeCorner && !scope.activeWall && !scope.findDoor && !scope.activeRoomCom) {
	      	scope.originX += (lastX - rawMouseX);
	      	scope.originY += (lastY - rawMouseY);
	      	lastX = rawMouseX;
	      	lastY = rawMouseY;
	      	view.draw();
	      	return;
	    }
	    /*
		拖拽物体移动
		1.墙角
		2.墙体
		3.门窗
		4.房间结构部件
	    */
	    if (scope.mode == scope.modes.MOVE && mouseDown) {
	    	let dx = (rawMouseX - lastX) * cmPerPixel;
	        let dy = (rawMouseY - lastY) * cmPerPixel;
	      	if(scope.activeCorner){
				  //物体移动碰撞检测
	      		if(scope.findDoor && (scope.findDoor.getStart() == scope.activeCorner || scope.findDoor.getEnd() == scope.activeCorner)){
	      			let point = floorplan.moveCheck(scope.findDoor.inWall, mouseX, mouseY);
	      			mouseX = point.x;
					mouseY = point.y;      		
	      		}
	      		moveObj = 1;
	        	scope.activeCorner.move(mouseX, mouseY,snapTolerance,scope.activeCorner.cornerType);
	        	scope.activeCorner.snapToAxis(snapTolerance);
			} 
			//移动墙体时需要
	      	if(scope.activeWall && !scope.activeRoomCom){    //!scope.activeRoomCom如果房间结构在墙上就不能移动墙体
				moveObj = 2;	 				
	        	scope.activeWall.relativeMove(dx,dy); 		//移动距离
	        	scope.activeWall.snapToAxis(snapTolerance); //移动偏差
	      	}
	      	if(scope.findDoor && !scope.activeCorner){
	      		moveObj = 3
	      		let start = scope.findDoor.getStart();
	    		let end   = scope.findDoor.getEnd();
	      		start.relativeMove2(dx,dy);
	      		end.relativeMove2(dx,dy);
	      	}
	      	if(scope.activeRoomCom){
	      		let room = floorplan.isponitFromRoom(mouseX,mouseY);
	      		if(room)scope.activeRoomCom.inRoom = room;
	      		moveObj = 4;
	    		scope.activeRoomCom.relativeMove(dx,dy);
	    	}
      	  	lastX = rawMouseX;
        	lastY = rawMouseY;
	      	view.draw();
	      	return;
	    }
  	}
  	
  	/*
  		鼠标抬起分3种状态
		1.是否在画门窗的状态：
			（1）如果是并且找到墙，在墙上添加门窗。
			（2）如果是房间在房间里添加其他品类。
		2.正在绘制时：
			（1）绘制墙体
			（2）绘制房间
		3.识别空间、墙体、墙角
		4.如果选中门窗取消选中并删除被选中的corner
	  */

  	function mouseup(e) {

  		if(e.button == 2)return;
  		if(scope.findDoor){
  			scope.findDoor = null;
  		}
  		if(scope.activeRoomCom){
  			scope.activeRoomCom = null;
  		}
  		scope.updateCanvasPage(0,false);
	   	mouseDown   = false;
	 	let ponit   = {'x':mouseX,'y':mouseY};
	    //1.控制门窗的状态e.button == 2右击 取消添加门窗
	    if(scope.addItemState && e.button == 2){
	    	scope.setItemMode(0,true);
	    	return; 
	    }
		if(scope.activeCorner && moveObj != 0)setOperationalStorage(); //设置保存撤销路劲;
	    
	    //2.没有在绘制状态并且右击
	    if(!scope.addItemState && !scope.isDraw && !scope.isDrawRoom && !scope.isDrawArea && e.button == 2)return;
	    //画分区时先判断点是不是在房间中
	    if(scope.mode == scope.modes.DRAWAREA){
	    	let room   = G_Utils.forEach2(floorplan.getRooms(),isponitFromRoom);
	    	if(room){
	    		if(scope.activeRoom){
	    			if(room != scope.activeRoom)return;
	    		}else{
	    			scope.activeRoom = room;
	    		}
	    	}else{
	    		return;
	    	}
	    }  
	    /*
			3.如果在画墙的状态或者画分区
		    //这里生成新的墙体并且判断墙角是不是在其他的墙上，corner->结束的墙角,scope.lastNode -> 开始的墙角	
		    //检测点击落点是不是在已有的分区上
	    */
	    if(scope.mode == scope.modes.DRAW  || scope.mode == scope.modes.DRAWAREA && e.type != "contextmenu") {
	    	if(scope.isDrawArea && floorplan.isRoomAreaCoincidence(ponit))return;  	
	    	let tol 	= 0;
	        let corner  = floorplan.newCorner(scope.targetX, scope.targetY);   
	        corner.cornerType  = 'wall';
	        if(scope.lastNode != null) {

	        	if(scope.isDraw){ 
					 //判断线段是否重叠
	        		if(floorplan.isLineOverLap(scope.lastNode, corner)){
	        			G_Utils.removeValue(floorplan.getCorners(),corner);
	        			return;
	        		}
	        		let w    = floorplan.newWall(scope.lastNode, corner);
	        		G_Utils.operationalStorage("wall",{'my':w});
	        	}

	        	if(scope.isDrawArea){
	        		corner.cornerType  			 = 'wallarea';
	        		scope.lastNode.cornerType    = 'wallarea';
	        		tol = 5;
	        		if(floorplan.isLineInter(scope.lastNode,corner))return;
	        		let w = floorplan.newAreaWall(scope.lastNode, corner);
	        		G_Utils.operationalStorage("addAreaWall",{'my':w});
	        	}	
	        }
	        if(corner.mergeWithIntersected(tol) && scope.lastNode != null) {
        		console.log("绘制完毕");
	    		floorplan.update2(); //更新分区信息
	    		scope.activeRoom = null;
	        	scope.setMode(scope.modes.MOVE);  	
	        }  
	  	  	scope.lastNode  =  corner;
	    }
	    //4.如果在绘制房间
	    if(scope.isDrawRoom && scope.mode == scope.modes.DRAWROOM){ 
	    	drawnum++;
	    	if(drawnum == 1){
				scope.lastNode = floorplan.newCorner(startX,startY);
				scope.lastNode.cornerType = 'wall';
				scope.lastNode.mergeWithIntersected(); 
	    	}
	    	if(drawnum == 2){
	    		drawnum = 0;
	    		let c2 = floorplan.newCorner(scope.targetX, startY);
	    		let c3 = floorplan.newCorner(scope.targetX, scope.targetY);
				let c4 = floorplan.newCorner(startX, scope.targetY);
				c2.cornerType = 'wall';
	    		c3.cornerType = 'wall';
	    		c4.cornerType = 'wall';
				c2.mergeWithIntersected();
				c3.mergeWithIntersected();
				c4.mergeWithIntersected();
	    		let w1 = floorplan.newWall(scope.lastNode, c2);
	    		let w2 = floorplan.newWall(c2, c3);
	    		let w3 = floorplan.newWall(c3, c4);
				let w4 = floorplan.newWall(c4, scope.lastNode); 
	    		scope.setMode(scope.modes.MOVE);
	    		G_Utils.operationalStorage("drawroom",{ 'wall':[w1,w2,w3,w4] });
	    	}	
	    }
	   	
	   	/*5:不在画门窗状态的点击事件 移除所有的房间颜色 4,5不能更换位置 并且scope.findDoor必须为false的时候才能进，防止冲突
			先查看又没有房间结构部件再查找房间
			在没有任何状态下的点击抬起鼠标的操作
			（1）先找房间结构部件
			（2）如果房间结构部件没找到，那就找房间
			（3）先找房间结构部件
			 (4) 找到墙可能有2个以上墙的对象
	   	*/
	   	removeColor();
   	  	if(!scope.addItemState && !scope.isDraw && !scope.isDrawRoom && !scope.isDrawArea && e.button != 2 && !scope.findDoor){	
   	  		scope.activeRoomCom = G_Utils.forEach2(floorplan.getRoomCom(),isponitFromRoom) || null;	
   	  		if(scope.activeRoomCom){
				scope.activeRoomCom.count();
				if( (scope.activeRoomCom.type == 17 || scope.activeRoomCom.type == 18) && scope.activeWall)scope.activeWall = null; //这里如果在墙上的话会选中墙体所以要置为空;
				if(!scope.activeRoomCom.inRoom){
					scope.findRoom   = floorplan.isponitFromRoom(mouseX,mouseY);
					scope.activeRoomCom.inRoom = scope.findRoom;
				}
				scope.activeRoomCom.isSelected = true;
				// scope.activeRoomCom.init();
   	  			G_ctrlDom.init('roomCom',scope.activeRoomCom,scope,floorplan,view);
   	  			view.draw();
   	  			return;
   	  		}

   	  		scope.activeRoomArea = G_Utils.forEach2(floorplan.getRoomArea(),isponitFromRoom) || null;
   	  		if(scope.activeRoomArea){
   	  			scope.activeRoomArea.areaColor = true;
   	  			G_ctrlDom.init('roomarea',scope.activeRoomArea,scope,floorplan,view);
   	  			view.draw();
   	  			return;
   	  		}
   	  	
		    if(scope.activeDoor){
		    	scope.findDoor = scope.activeDoor;
		    	G_ctrlDom.init('door',scope.findDoor,scope,floorplan,view);
		    	view.draw();
		    	return;
		    }else{
		    	scope.findDoor =  null;
		    }	
			
		    if(scope.activeWall){
		    	console.log(scope.activeWall,"选择的墙");
		    	scope.changeWalls = floorplan.findAloneWall(scope.activeWall);
		    	G_ctrlDom.createInput(scope.changeWalls,scope);
	
   	  			if(scope.activeWall.constructor === Array){
   	  				scope.activeWall[0].clickAddColor = true;
    				scope.activeWall[1].clickAddColor = true;			
   	  			}else{
					scope.activeWall.clickAddColor = true;
   	  			}  			
    			scope.findWall = scope.activeWall; 
    			G_ctrlDom.init('wall',scope.findWall,scope,floorplan,view);
    			view.draw();
    			return;
    		}	
   			
   	  		if(floorplan.getRooms() && floorplan.getRooms().length>0){
   	  			scope.findRoom   = floorplan.isponitFromRoom(mouseX,mouseY);
   	  			if(scope.findRoom){
	   	  			scope.findRoom.areaColor = true;
					G_ctrlDom.init('room',scope.findRoom,scope,floorplan,view);	
					view.draw();
					return;
	   	  		}   
   	  		}
   	  	}

   	  	/*
			6.添加门窗，房间结构部件
			找到墙时再添加墙上的类
			找到房间时添加房间类
   	  	*/
   	   	
	   	if(scope.addItemState){	
	   		let p 	  = scope.itemData;
	   		if(scope.itemWalls){	
		    	if(p.type == 10 || p.type == 3 || p.type == 4 || p.type == 5 || p.type == 6 || p.type == 7 ||  p.type == 14){

		    		if(floorplan.isItemsCoincidence(p.start) || floorplan.isItemsCoincidence(p.end) && floorplan.isItemsCoincidence(ponit))return;
		    		let start = floorplan.newCorner(p.start.x,p.start.y);
		    		let end   = floorplan.newCorner(p.end.x,p.end.y);		  
		    		start.cornerType = 'doorw';
		    		end.cornerType   = 'doorw';
		    		let door    = floorplan.newDoorWindow(p.type,start,end,p.thickness,p.edg);
		    		door.inWall = scope.itemWalls;
		    		scope.itemWalls.setDoorWindow(door);
					G_Utils.operationalStorage("addDoor",{ 'my':door, 'wall': scope.itemWalls});
					
		    	}else if(p.type == 17 || p.type == 18){
					let item 	  = G_Utils.getTypeItem(p.type); 
					let roomCom   = floorplan.newRoomcom(p.type,scope.targetX,scope.targetY,item.length,item.width,item.height,180);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
					roomCom.inRoom = scope.itemWalls; 
					G_Utils.operationalStorage("addRoomcom",{ 'my':roomCom} ); 
				}
	   		}else{	
	   			if(floorplan.getRooms() && floorplan.getRooms().length>0){
	   	  			scope.findRoom  = floorplan.isponitFromRoom(mouseX,mouseY);
	   	  		}
	   		}

	   		if(scope.findRoom && p.type >= 15){
	   			let item 	  = G_Utils.getTypeItem(p.type); 
				let roomCom   = floorplan.newRoomcom(p.type,scope.targetX,scope.targetY,item.length,item.width,item.height,180);  
		        scope.findRoom.setRoomComs(roomCom); 
		        G_Utils.operationalStorage("addRoomcom",{ 'my':roomCom} ); 
	   		}
   			scope.setItemMode(0,true);	    	
    		view.draw();	   	
	   	}   
	}

	function cancelEvent(e) {	
		//console.log(scope.findRoom,"room")
		e.preventDefault(); //取消默认事件
		if((scope.isDraw || scope.isDrawRoom || scope.isDrawArea) && !floorplan.isAloneCorner(scope.lastNode)){
			G_Utils.removeValue(floorplan.getCorners(),scope.lastNode);
		}

		console.log(floorplan.getCorners(),"所有的corner");
		console.log(floorplan.getWalls(),"所有的墙体");
		console.log(floorplan.getRooms(),"所有的房间");
		console.log(floorplan.getItems(),"所有的门窗");
		console.log(floorplan.getRoomCom(),"所有的结构部件");
		console.log(floorplan.getRoomArea(),"所有的房间分区");
		console.log(floorplan.getAreaWalls(),"所有的房间分区线段");
		console.log(G_undoRedo.getUndo(),"所有的撤销");
		console.log(G_undoRedo.getStack(),"所有的恢復");

		//必要条件，正在绘制时isDraw = true；右键置为false;
		if(scope.isDraw || scope.isDrawArea || scope.isDrawRoom || scope.addItemState){
			rightClickCount++;
		}	
		//如果右击2次就全部取消
		if(rightClickCount >= 2){
			if(scope.isDraw)scope.isDraw         = false;
			if(scope.isDrawArea)scope.isDrawArea = false;
			if(scope.isDrawRoom)scope.isDrawRoom = false;
			if(scope.addItemState)scope.addItemState = false;
			scope.setMode(scope.modes.MOVE);
			rightClickCount = 0;
			$("#J_ctrlcanvas .draw").removeClass("active");
			document.getElementById('floorplanner-canvas').style.cursor = 'auto';
		}

		if(scope.isDraw || scope.isDrawArea || scope.isDrawRoom){
			drawnum  = 0;
			scope.setMode(scope.modes.MOVE);
		}	
	}

	function mouseleave(){
		mouseDown = false;
    	scope.setMode(scope.modes.MOVE);
	}

    function resetOrigin() {	  
	    var centerX   		= canvasElement.innerWidth() / 2.0;
	    var centerY   		= canvasElement.innerHeight() / 2.0;
	    scope.originX 		= centerFloorplan.x * cmPerPixel - centerX;
	    scope.originY 		= centerFloorplan.z * cmPerPixel - centerY;   
	}

    this.reset = function(obj,flag) {
	    resetOrigin();
	    if(flag && obj){
	    	//导入但空间模板
	    	scope.clearFloorplan();
	    	loadJsonRender2(obj);
	    }else if(obj){
	    	//导入json
	    	scope.clearFloorplan();
	    	loadJsonRender(obj);
	    }else{
	    	//保存之后的读取
	    	let houseObj =  localStorage.getItem("house");
				loadJsonRender2(JSON.parse(houseObj));
	    }
	    view.draw();
	}
	this.resetDraw = function(){
		view.draw();
	}
	this.convertX = function(x) {
    	// 从三坐标转换到画布坐标
    	return (x - scope.originX + 320 * cmPerPixel);
  	}

  	this.convertY = function(y) {
   	   // 从三坐标转换到画布坐标
    	return (y - scope.originY  * cmPerPixel);
  	}

  	this.updateCanvasPage = function(flag,draw){
  		if(flag == 0 || flag == 1){
  			if($("#J_ctrlcanvas .tab2").hasClass("active")){
	  			$("#J_ctrlcanvas .tab1").addClass("active");
				$("#J_ctrlcanvas .tab2").removeClass("active");
				$(".popup-content").html("");
	  		}
	  		if($("#J_dialog").display == 'none'){
	  			$("#J_dialog").show();
	  		}else{
	  			$("#J_dialog").hide();
	  		}
  		}
  		if(draw){
  			view.draw();
  		}
  	}

  	//处理房间，墙，墙角
  	function loadJsonRender2(houseObj){

  		if(!houseObj || JSON.stringify(houseObj) == '{}')return;
  		let corners    = {};
	    for(var id in houseObj.corners) {
	       let corner  = houseObj.corners[id];
	       corners[id] = floorplan.newCorner(corner.x, corner.y, id);
	       corners[id].cornerType = corner.cornerType;
	    }
	    G_Utils.forEach(houseObj.walls, function(wall) {
	        let newWall = floorplan.newWall( corners[wall.corner1], corners[wall.corner2] );
	        newWall["type"] 		  = wall.type;
	        newWall["backgroundType"] = wall.backgroundType;
	        newWall["thickness"]      = wall.thickness;
	    });
	    G_Utils.forEach(houseObj.areaWall, function(area) {
	        floorplan.newAreaWall( corners[area.corner1], corners[area.corner2] );
	    });
	    G_Utils.forEach(houseObj.doorWindow,function(door){
	    	let size 		 =  door.size.split(",");
	    	floorplan.newDoorWindow(door.type,corners[door.corner1],corners[door.corner2],size[1],door.edg);
	    });   
	    G_Utils.forEach(houseObj.roomcom,function(com){
	    	let w = Number(com.width);
	    	let l = Number(com.length);
	    	let h = Number(com.height); 
	    	let x = Number(com.x);
			let y = Number(com.y);
			// if(com.type == 15){
			// 	console.log(com,"com")
			// 	x = Number(com.getCenterP().x);
			// 	y = Number(com.getCenterP().y);
			// }
			let newCom   = floorplan.newRoomcom(com.type,x,y,l,w,h,com.edg,com.shape);
	
	    });  
	    floorplan.update();    
	    floorplan.update2();    
  	}

 //  	function loadJsonRender(roomJson){
  		
 //  		var rooms = roomJson.houseUnit.rooms;
 //  		var len = rooms.length;
	// 	for(var i = 0;i<len;i++){
	// 		let arr  = rooms[i].entity;
	// 		//var room = floorplan.newRoom(rooms[i]); 
	// 		for(var j = 0;j<arr.length;j++){
	// 				let startxy 	= G_Utils.stringShear(arr[j].startPoint);
	// 				let endxy   	= G_Utils.stringShear(arr[j].endPoint);
	// 				startxy         = countXy2(startxy.x,startxy.y);
	// 				endxy           = countXy2(endxy.x,endxy.y);
	// 				let startCorner = floorplan.newCorner(startxy.x,startxy.y);
	// 				let endCorner   = floorplan.newCorner(endxy.x,endxy.y);
	// 			if(arr[j].type == 0 || arr[j].type == 21){							
	// 				//开始的墙角坐标，结束的墙角坐标和，墙体的JSON
	// 				startCorner.cornerType = 'wall';
	// 				endCorner.cornerType   = 'wall';
	// 				let wall = floorplan.newWall(startCorner, endCorner,arr[j]);
	// 				// wall.setStart(startCorner)
	// 				// wall.setEnd(endCorner)
	// 				//room.createWalls(wall);
	// 			}else{
	// 				let width       = G_Utils.stringShear(arr[j].size).y;
	// 				let edg         = G_Utils.stringShear(arr[j].rotate).y;
	// 				startCorner.cornerType = 'doorw';
	// 				endCorner.cornerType = 'doorw';
	// 				//开始的墙角坐标，结束的墙角坐标和，墙体的JSON
	// 				floorplan.newDoorWindow(arr[j].id,startCorner,endCorner,width,edg,arr[j]);
	// 			}
	// 			//room.pushCorner(startCorner);
	// 			//room.pushCorner(endCorner);
	// 		}
	// 	}
	// 	floorplan.update(); 
	// }
	function recursionSort(obj,arr,tempObj){
		let start = obj.startPoint;
		let end   = obj.endPoint;
		for(var i = 0;i<arr.length;i++){
			let st = arr[i].startPoint;
			let en = arr[i].endPoint;

			if(end == st && start != en){ //结束点 = 开始点

				return  arr[i];		
			}
			if(start == end && end != en){ //开始= 结束

				return arr[i];
			}
			if(end == en && start != st){ //结束== 结束
	
				return arr[i];
			}
			if(start == st && end != en){ //开始= 开始
				
				return  arr[i];

			}
		
		}
	}
	function backPoint(obj){
		let startxy 	=  G_Utils.stringShear(obj.startPoint);
		let endxy   	=  G_Utils.stringShear(obj.endPoint);
		startxy         =  countXy2(startxy.x,startxy.y);
		endxy           =  countXy2(endxy.x,endxy.y);
		return {'startxy': startxy,'endxy': endxy};
	}
  	function loadJsonRender(houseObj){
  		if(!houseObj || JSON.stringify(houseObj) == '{}')return;
  		var rooms = houseObj.houseUnit.rooms;
  		var len   = rooms.length;
  		var i 	  = 0;
  	
  		for(;i<len;i++){	
  			let room   = rooms[i];	
  			let entity = room.entity;

  			let tempObj    = [entity[0]]; //
  			let lastCorner = null;
  			let nowCorner  = null;
  			let point      = null;
  			let tempCorners = []; //临时的corners

  			for(var x  = 0;x<tempObj.length;x++){
  				
  				let obj = recursionSort(tempObj[x],entity,tempObj);
  				if(G_Utils.arrOrObj(obj) == 'arr'){
  					obj = obj[0];
  				}
  				// if( !obj || (obj.startPoint == tempObj[0].startPoint && obj.endPoint == tempObj[0].endPoint))continue;
  				if(tempObj.length == entity.length)break;
  				tempObj.push(obj);
  			}
  			console.log(tempObj,"tempObj"+i);
  		// 	for(var j = 0;j<tempObj.length;j++){
				// if(j == 0){
				// 	point 	    = backPoint(tempObj[j]);
				// 	nowCorner   = floorplan.newCorner(point.startxy.x,point.startxy.y);
				// 	lastCorner  = floorplan.newCorner(point.endxy.x,point.endxy.y);
				// 	tempCorners.push(nowCorner);
				// }else{
				// 	point 	    = backPoint(tempObj[j]);
				// 	nowCorner   = tempCorners[tempCorners.length-1];
				// 	if(point.endxy.x == tempCorners[0].x && point.endxy.y == tempCorners[0].y){
				// 		lastCorner  = tempCorners[0];
				// 	}else{
				// 		lastCorner  = floorplan.newCorner(point.endxy.x, point.endxy.y);
				// 	}	
				// }
				// nowCorner.cornerType 	= 'wall';
				// lastCorner.cornerType   = 'wall';

				// tempCorners.push(lastCorner);
				// let wall = floorplan.newWall(nowCorner, lastCorner);

				// // if(newArr[j].type == 0 || newArr[j].type == 21){							
				// // 	//开始的墙角坐标，结束的墙角坐标和，墙体的JSON
				// // 	startCorner.cornerType = 'wall';
				// // 	endCorner.cornerType   = 'wall';
				// // 	let wall = floorplan.newWall(startCorner, endCorner,newArr[j]);
				// // }

  		// 	}
  		}
  		floorplan.update();
	}

	this.clearFloorplan = function(){
		localStorage.clear();
		floorplan.reset();
		scope.resetState();
		scope.setMode(scope.modes.MOVE);
		scope.setItemMode(-1,true);	
	}
    function init() {
	   	scope.setMode(scope.modes.MOVE);
	    canvasElement.mousedown(mousedown);
	    canvasElement.mousemove(mousemove);
	    canvasElement.mouseup(mouseup);
	    canvasElement.bind("contextmenu",cancelEvent);
	    canvasElement.mouseleave(mouseleave);
	    scope.reset();
	}
	init();
}




