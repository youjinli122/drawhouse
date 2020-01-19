

// originStart =  start;
// originEnd   =  end;
// 直墙	0
// 指两段相交叉的墙的交叉部分	1
// 弧墙	2
// 单开门	3
// 双开门	4
// 推拉门	5
// 平开窗	6
// 三面飘窗	7
// 地板	8
// 天花板	9
// 直角飘窗	10
// 垭口	14
var FloorplannerView = function(floorplan, floorplanner, canvas) {
	var scope     		= this;
  	var floorplan 		= floorplan;
  	var floorplanner 	= floorplanner;
	var canvas    		= canvas;
  	var canvasElement 	= document.getElementById(canvas);
	var context       	= canvasElement.getContext('2d');
  	var canvaswidth     = 0;
	var canvasHeight 	= 0;
  	// 网格参数
	var gridSpacing = 20; // pixels
	var gridWidth   = 1;
	var gridColor   = '#d1d1d1';
	  // 房间填充颜色
	var roomColor   = "#f9f9f9";

	// 围墙参数
	this.wallWidth     = 16;
	var wallColor      = '#A9A9A9';
	var wallColorHover = "rgba(100,149,237,0.5)";
	var drawColor      = "rgba(100,149,237,0.7)";
	var edgeColor      = "#000";
	var edgeColorHover = "#008cba";
	var edgeWidth      = 1;

	var deleteColor    = "#ff0000";
	var cornerColor    = "#3b78e7";
	var cornerColor2   = "#808080";

	this.draw = function (){

		context.clearRect(0, 0, canvasElement.width, canvasElement.height);
   		drawGrid();
   		utils.forEach(floorplan.getRooms(), drawRoom);
   		utils.forEach(floorplan.getWalls(), drawWall);
   		utils.forEach(floorplan.getAreaWalls(), drawAreaLine);
   		//画线
   		if (floorplanner.mode == floorplanner.modes.DRAW) {
         	drawTarget(floorplanner.targetX, floorplanner.targetY, floorplanner.lastNode);
    	}
    	//画房间
    	if(floorplanner.mode == floorplanner.modes.DRAWROOM){
    		drawTargetRoom(floorplanner.lastNode,floorplanner.targetX, floorplanner.targetY);
    	}
    	//画分区
    	if (floorplanner.mode == floorplanner.modes.DRAWAREA) {
         	drawTargetArea(floorplanner.targetX, floorplanner.targetY, floorplanner.lastNode);
    	}
    	/*
    	画门窗,结构部件
    	1.如果找到门窗就吸附否则就直接画
    	2.如果找到地面可以放置
    	3.否则的话画所有的
    	*/
    	if(floorplanner.addItemState){
			if(floorplanner.itemWalls){	
				floorplanner.drawDoorWindow(floorplanner.itemWalls,floorplanner.itemData.type);
			}else{
				drawDoorWindowMove(floorplanner.itemData.type,floorplanner.convertX(floorplanner.targetX),floorplanner.convertY(floorplanner.targetY))
			}		
    	}
    	//画标注线
    	drawWallLabels();
    	//画门窗结构部件
    	showDoorWindows();
    	utils.forEach(floorplan.getRoomArea(), drawRoomArea);
		utils.forEach(floorplan.getCorners(), drawCorner);
		
    	if(floorplanner.findDoor){
    		let p     = floorplanner.findDoor;
    		let start = p.getStart();
    		let end   = p.getEnd(); 
    		let cornerArr = [];
    		cornerArr.push(start);
    		cornerArr.push(end);
    		utils.forEach(cornerArr, drawCornerOfter);
		}
	}
	//画门窗的角点
	function drawCornerOfter(corner){
		drawCircle(
	      floorplanner.convertX(corner.x), 
	      floorplanner.convertY(corner.y), 
	      true,
	    );
	}
	function showDoorWindows(){		
		
		var items    = floorplan.getItems();
		var roomComs = floorplan.getRoomCom();

		if(items){
			items     = utils.ique(items);
			let color = '';
			for(var i = 0;i<items.length;i++){
				let item = items[i];
				let type = items[i].roomObj ? items[i].roomObj.type : items[i].id;	
				item === floorplanner.activeDoor ? color = '#C71585' : color = '';
				scope.drawItems(type,item.getStart(),item.getEnd(),item.thickness,item.edg,color);
			}
		}
		
		if(roomComs && roomComs.length>0){
			for(var i = 0;i<roomComs.length;i++){
				let item    = roomComs[i];
				drawRoomCom(item.type,item.getStart(),item.getEnd(),item.width,item.edg,item.shape,item);
				if(item.isSelected){
					addRoomComLine(item);
				}
			}
		}
	}
	//添加房间结构部件的标注线
	function addRoomComLine(com){
			
		let t = com.getRoomComTagLines();
		t.forEach(function(item){		
			let p   = $agr.L_segm.midP({'x':item.start.x,'y':item.start.y}, {'x': item.end.x,'y': item.end.y});
			let obj = {'length': item.dist * 10,'x': floorplanner.convertX(p.x),'y': floorplanner.convertY(p.y)};

			drawLine(
				floorplanner.convertX(item.start.x),
				floorplanner.convertY(item.start.y),
				floorplanner.convertX(item.end.x),
				floorplanner.convertY(item.end.y),
				1,
				'#000',
				true,
				obj
			);
		});
	}
	//初始化门窗画法
	function drawDoorWindowMove(type,x,y){
		
		let item = G_All_DoorWindow.filter(function(t){
			return type == t.type;
		});
		if(G_Utils.arrOrObj(item) == 'arr')item = item[0];
		
		let o_len = item.length;
		let o_wid = item.width;

		let o_len_2 = o_len / 2;
		let o_wid_2 = o_wid / 2;

		context.save();
		context.beginPath();
		context.strokeStyle = item.strokeColor;
		context.fillStyle   = item.fillColor;
		
		if(type == 3){
			context.lineWidth = 2;
	        context.moveTo(x - o_len_2, y); //鼠标坐标移动到中心点
			context.arc(x - o_len_2, y, o_len,1.5*Math.PI,0*Math.PI,false);
		}

		if(type == 4){

			context.moveTo(x, y); 
	        context.arc(x, y, item.width,1.5*Math.PI,0*Math.PI,false);  

	        context.moveTo(x+item.width*2, y); 
	        context.arc(x+item.width*2, y, item.width,1.5*Math.PI,1*Math.PI,true);

		}

		if(type == 5){

			let w1 = o_len*0.33;
		    let w2 = o_len*0.66;
			x -= o_len_2  //鼠标坐标移动到中心点
		    context.moveTo(x+w1, y);
		    context.lineTo(x+w1, y+o_wid);

		    context.moveTo(x+w2, y);
		    context.lineTo(x+w2, y+o_wid);

		    context.moveTo(x, y);
		    context.lineTo(x+o_len, y);
		    context.lineTo(x+o_len, y+o_wid);
			context.lineTo(x, y+o_wid);
			
		}

		if(type == 6){
			x -= o_len_2  //鼠标坐标移动到中心点
			context.moveTo(x, y+o_wid_2);
			context.lineTo(x+o_len, y+o_wid_2);	
		    context.moveTo(x, y);
		    context.lineTo(x+o_len, y);
		    context.lineTo(x+o_len, y+o_wid);
		    context.lineTo(x, y+o_wid);
		}

		if(type == 7){
			x -= o_len_2  //鼠标坐标移动到中心点
			context.moveTo(x, y+o_wid_2-2);
			context.lineTo(x+o_len, y+o_wid_2-2);
			context.moveTo(x, y+o_wid_2);
			context.lineTo(x+o_len, y+o_wid_2);
			context.moveTo(x, y+o_wid_2+2);
			context.lineTo(x+o_len, y+o_wid_2+2);
			
		    context.moveTo(x, y);
		    context.lineTo(x+o_len, y);
		    context.lineTo(x+o_len, y+o_wid);
		    context.lineTo(x, y+o_wid);
		}

		if(type == 10){
			x -= o_len_2; //鼠标坐标移动到中心点
			context.beginPath();
		    context.moveTo(x, y);
		    context.lineTo(x+o_len, y);
		    context.lineTo(x+o_len, y+o_wid);
		    context.lineTo(x, y+o_wid);
		    context.strokeStyle = item.strokeColor;
		    context.fillStyle   = item.fillColor;
		    context.fill();
		    context.closePath();
		    context.stroke();

		    context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x-10, y);
			context.lineTo(x-10, y-30);
			context.lineTo(x+o_len+10, y-30);
			context.lineTo(x+o_len+10, y);
		    context.lineTo(x+o_len, y);
		    context.strokeStyle = '#A9A9A9';
		    context.fillStyle   = '#D3D3D3';
		    context.fill();
		    context.closePath();
			context.stroke();

		}

		if(type == 14){
			x -= o_len_2; //鼠标坐标移动到中心点
			context.beginPath();
			context.moveTo(x, y+4);
		    context.lineTo(x+o_len, y+4);
			context.moveTo(x, y);
		    context.lineTo(x+o_len, y);
		    context.lineTo(x+o_len, y+o_wid);
			context.lineTo(x, y+o_wid);
			context.fill();
		    context.closePath();
			context.stroke();
		}

		if(type >= 15){
			let l    = item.length;
			let w    = item.width;
			let l_2  = item.length/2;
			let w_2  = item.width/2
			let nx   = x - l_2;
			let ny   = y - w_2;
			if(type != 19){
				context.rect(nx,ny,l,w);
			}else if(type == 19){
				context.rect(nx+4,ny+4,l-8,w-8);
				context.rect(nx,ny,l,w);
			}
		}

		context.fill();
	    context.closePath();
	    context.stroke();
		context.restore(); 

	}

	function drawStorke(c,color){
		let StorkeColor = color;
		context.save()
		context.beginPath();
		c.forEach(function(item){
			context.lineTo( floorplanner.convertX(item.x), floorplanner.convertY(item.y) );
		});
		context.lineWidth   = 2;
		context.strokeStyle = StorkeColor;
		context.closePath();
		context.stroke();
		context.restore();
	}
	//读取房间结构部件
	function drawRoomCom(type,start,end,width,edg,shape,item){
		
		let items = G_Utils.getTypeItem(type);
		context.save();
		context.beginPath();

		if(shape == 1601){
			context.moveTo(floorplanner.convertX(start.x), floorplanner.convertY(start.y));
			context.lineTo(floorplanner.convertX(end.x), floorplanner.convertY(end.y)); 
			context.lineWidth   = width;
			context.strokeStyle = items.fillColor;
		}else{	
			let t     = item.getCenterP();
			let radius = item.diameter / 2;
			context.strokeStyle = item.getColor();
			context.arc(floorplanner.convertX(t.x), floorplanner.convertY(t.y), radius, 0, 2 * Math.PI);
		}
		context.closePath();
		context.stroke();
		context.restore();

		if(shape == 1601 && item){	
			let color = '#000';
			if(item.isSelected)color = '#C71585';	
			drawStorke(item.getCorners(),color);
		}
	}

	//读取json时画门窗显示
	this.drawItems = function(type,start,end,width,edg,color){

		var edg 	 = edg;
		var length   = $agr.L_segm.dist(start,end);
		var width 	 = Number(width);
		var sx 		 = floorplanner.convertX(start.x);
		var sy 		 = floorplanner.convertY(start.y);
		var ex 		 = floorplanner.convertX(end.x);
		var ey 		 = floorplanner.convertY(end.y);

		let vector   = $agr.L_segm.normalize(start.x,start.y,end.x,end.y);

		context.save();
		if(type ==3){

			let ostart    = $agr.L_segm.getDistance(start,edg*Math.PI/180,-(width/2));
			sx 		 =  floorplanner.convertX(ostart.x);
			sy 		 =  floorplanner.convertY(ostart.y);
			let verP =  $agr.L_segm.getDistance(start,edg*Math.PI/180,width);
			let rot1 =  $agr.L_segm.radian(start,end); 
			let rot2 =  $agr.L_segm.radian(start,verP); 
		
			context.beginPath();
	        context.lineWidth   = 2;
	        context.strokeStyle = color || "#ccc";
	        context.fillStyle   = "#fff";
	        context.moveTo(sx, sy);
	        context.arc(sx, sy, length,rot1,rot2,false);      
	        context.closePath();
	        context.fill();   
			context.stroke();
			
		}
		if(type == 4){
		
			let ostart    = $agr.L_segm.getDistance(start,edg*Math.PI/180,-(width/2));
			let oend      = $agr.L_segm.getDistance(end,edg*Math.PI/180,-(width/2));
			sx 		 =  floorplanner.convertX(ostart.x);
			sy 		 =  floorplanner.convertY(ostart.y);
			ex 		 =  floorplanner.convertX(oend.x);
			ey 		 =  floorplanner.convertY(oend.y);

			let verP  =  $agr.L_segm.getDistance(start,edg*Math.PI/180,width);
			let verP2 =  $agr.L_segm.getDistance(end,edg*Math.PI/180,width);

			let rot1  =  $agr.L_segm.radian(start,end); 
			let rot2  =  $agr.L_segm.radian(start,verP);
			let rot3  =  $agr.L_segm.radian(end,start); 
			let rot4  =  $agr.L_segm.radian(end,verP2);

			context.beginPath();
			context.strokeStyle = "#000";
			context.fillStyle   = "#fff";
			context.moveTo(sx, sy); 
			context.arc(sx, sy, length/2,rot1,rot2,false);  
			context.closePath();
			context.fill();
			context.stroke();

			context.beginPath();
			context.strokeStyle = "#000";
			context.fillStyle   = "#fff";
			context.moveTo(ex, ey); 
			context.arc(ex, ey, length/2,rot3,rot4,true);
			context.closePath();
			context.fill();
			context.stroke();		

		}

		let s1   = $agr.L_segm.getDistance(start,edg*Math.PI/180,(width / 2));
		let s2   = $agr.L_segm.getDistance(start,edg*Math.PI/180,-(width / 2));
		let e1   = $agr.L_segm.getDistance(end,edg*Math.PI/180,(width / 2));
		let e2   = $agr.L_segm.getDistance(end,edg*Math.PI/180,-(width / 2));

		if(type == 5){
	
			let vec1  = $agr.L_segm.normalize(e1.x,e1.y,s1.x,s1.y);
			let vec2  = $agr.L_segm.normalize(e2.x,e2.y,s2.x,s2.y);

			let m3    = {'x': s1.x+vec1.x*length*0.33, 'y': s1.y+vec1.y*length*0.33};
			let d3    = {'x': s2.x+vec2.x*length*0.33, 'y': s2.y+vec2.y*length*0.33};
			let m6    = {'x': s1.x+vec1.x*length*0.66, 'y': s1.y+vec1.y*length*0.66};
			let d6    = {'x': s2.x+vec1.x*length*0.66, 'y': s2.y+vec1.y*length*0.66};
					
			context.lineWidth   = 1;
		    context.strokeStyle = "#000";
			context.fillStyle   = "#fff";
		
			context.beginPath();
			context.moveTo( floorplanner.convertX(s1.x), floorplanner.convertY(s1.y));
			context.lineTo( floorplanner.convertX(s2.x), floorplanner.convertY(s2.y));
			context.lineTo( floorplanner.convertX(e2.x), floorplanner.convertY(e2.y));
			context.lineTo( floorplanner.convertX(e1.x), floorplanner.convertY(e1.y));
			context.closePath();
			context.fill();
			context.stroke();	

			context.beginPath();
			context.moveTo(floorplanner.convertX(m3.x), floorplanner.convertY(m3.y));
			context.lineTo(floorplanner.convertX(d3.x), floorplanner.convertY(d3.y));
			context.closePath();
			context.fill();
			context.stroke();	

			context.beginPath();
			context.moveTo(floorplanner.convertX(m6.x), floorplanner.convertY(m6.y));
			context.lineTo(floorplanner.convertX(d6.x), floorplanner.convertY(d6.y));
			context.closePath();
			context.fill();
			context.stroke();	

		}

		if(type == 6){

			context.lineWidth   = 1;
		    context.strokeStyle = "#000";
			context.fillStyle   = "#fff";

			context.beginPath();
			context.moveTo( floorplanner.convertX(s1.x), floorplanner.convertY(s1.y));
			context.lineTo( floorplanner.convertX(s2.x), floorplanner.convertY(s2.y));
			context.lineTo( floorplanner.convertX(e2.x), floorplanner.convertY(e2.y));
			context.lineTo( floorplanner.convertX(e1.x), floorplanner.convertY(e1.y));
			context.closePath();
			context.fill();
			context.stroke();	

			context.beginPath();
			context.moveTo(sx, sy);
			context.lineTo(ex, ey);
			context.closePath();
			context.fill();
			context.stroke();	
		}

		if(type == 7){

			context.lineWidth   = 1;
		    context.strokeStyle = "#000";
			context.fillStyle   = "#fff";

			context.beginPath();
			context.moveTo( floorplanner.convertX(s1.x), floorplanner.convertY(s1.y));
			context.lineTo( floorplanner.convertX(s2.x), floorplanner.convertY(s2.y));
			context.lineTo( floorplanner.convertX(e2.x), floorplanner.convertY(e2.y));
			context.lineTo( floorplanner.convertX(e1.x), floorplanner.convertY(e1.y));
			context.closePath();
			context.fill();
			context.stroke();	

			context.beginPath();
			context.moveTo(sx, sy);
			context.lineTo(ex, ey);
			context.closePath();
			context.fill();
			context.stroke();	
			
			context.beginPath();
			context.lineWidth   = 4;
		    context.strokeStyle = "#000";
			context.fillStyle   = "#fff";
			context.moveTo(sx, sy);
			context.lineTo(ex, ey);
			context.closePath();
			context.fill();
			context.stroke();	

		}

		if(type == 10){

			let vec1  = $agr.L_segm.normalize(s2.x,s2.y,e2.x,e2.y);
			let p1    = {'x': s2.x + vec1.x * 15, 'y':  s2.y + vec1.y * 15};
			let p2    = {'x': e2.x - vec1.x * 15, 'y':  e2.y - vec1.y * 15};
			let p3    = $agr.L_segm.getDistance(p1,edg*Math.PI/180,-20);
			let p4    = $agr.L_segm.getDistance(p2,edg*Math.PI/180,-20);

			context.lineWidth   = 1;
		    context.strokeStyle = "#000";
			context.fillStyle   = "#fff";

			context.beginPath();
			context.moveTo( floorplanner.convertX(s1.x), floorplanner.convertY(s1.y));
			context.lineTo( floorplanner.convertX(s2.x), floorplanner.convertY(s2.y));
			context.lineTo( floorplanner.convertX(e2.x), floorplanner.convertY(e2.y));
			context.lineTo( floorplanner.convertX(e1.x), floorplanner.convertY(e1.y));
			context.closePath();
			context.fill();
			context.stroke();	

			context.beginPath();
			context.lineWidth   = 1;
		    context.strokeStyle = "#000";
			context.fillStyle   = "#D3D3D3";
			context.moveTo( floorplanner.convertX(p1.x), floorplanner.convertY(p1.y));
			context.lineTo( floorplanner.convertX(p3.x), floorplanner.convertY(p3.y));
			context.lineTo( floorplanner.convertX(p4.x), floorplanner.convertY(p4.y));
			context.lineTo( floorplanner.convertX(p2.x), floorplanner.convertY(p2.y));
			context.closePath();
			context.fill();
			context.stroke();	

		}
		if(type == 14){
	
			let s3centers4 = $agr.L_segm.midP(s1,e1);

			context.beginPath();
			context.lineWidth   = 1;
		    context.strokeStyle = "#000";
			context.fillStyle   = "#fff";
			context.moveTo( floorplanner.convertX(s1.x), floorplanner.convertY(s1.y));
			context.lineTo( floorplanner.convertX(s2.x), floorplanner.convertY(s2.y));
			context.lineTo( floorplanner.convertX(e2.x), floorplanner.convertY(e2.y));
			context.lineTo( floorplanner.convertX(e1.x), floorplanner.convertY(e1.y));
			context.closePath();
			context.fill();
			context.stroke();	

			context.beginPath();
			context.moveTo( floorplanner.convertX(s2.x), floorplanner.convertY(s2.y));
			context.quadraticCurveTo(floorplanner.convertX(s3centers4.x), floorplanner.convertY(s3centers4.y), floorplanner.convertX(e2.x), floorplanner.convertY(e2.y));
			context.stroke();	

		}
		if(type == 17 || type == 18){
			drawRoomCom(type,start,end,width,edg,1601)
		}
		context.restore();
	}

	//添加标注信息
	function drawWallLabels(){
		var wallArr = floorplan.getWalls();
		if(wallArr){
			for(var i = 0,len = wallArr.length; i < len; i++){
				var s1 = {x: floorplanner.convertX(wallArr[i].getStartX()),y: floorplanner.convertY(wallArr[i].getStartY())}
				var s2 = {x: floorplanner.convertX(wallArr[i].getEndX()),y: floorplanner.convertY(wallArr[i].getEndY())}
				drawTagging(s1,s2,wallArr[i].thickness);
			}
		}
	}

	function calculateGridOffset(n) {	
	    if (n >= 0) {
	      return (n + gridSpacing/2.0) % gridSpacing - gridSpacing/2.0;
	    } else {
	      return (n - gridSpacing/2.0) % gridSpacing + gridSpacing/2.0;  
	    }
	}
	//画分区
	function drawTargetArea(x,y,lastNode){
		if (lastNode) {
	    	//划线
	      	drawLine(
		        floorplanner.convertX(lastNode.x),
		        floorplanner.convertY(lastNode.y),
		        floorplanner.convertX(x),
		        floorplanner.convertY(y),
		        1,
		       	'#990088',
	      	);
	    }
	}
	//画墙
	function drawTarget(x, y, lastNode) {

	    if (floorplanner.lastNode) {
	    	//划线
	      	drawLine(
		        floorplanner.convertX(lastNode.x),
		        floorplanner.convertY(lastNode.y),
		        floorplanner.convertX(x),
		        floorplanner.convertY(y),
		        scope.wallWidth,
		       	drawColor,
	      	);
	      	//画标注线
	      	var s1 = {x: floorplanner.convertX(lastNode.x),y: floorplanner.convertY(lastNode.y)}
	    	var s2 = {x: floorplanner.convertX(x),y: floorplanner.convertY(y)} 
	    	drawTagging(s1,s2);
	    }	    	
	}

	function drawTargetRoom(lastNode,ex,ey){
		if(lastNode){
			var w = floorplanner.convertX(ex) - floorplanner.convertX(lastNode.x);
			var h = floorplanner.convertY(ey) - floorplanner.convertY(lastNode.y);
			context.strokeStyle = "rgba(100,149,237,0.5)";
	    	context.lineWidth   = 16;
	    	context.strokeRect(floorplanner.convertX(lastNode.x),floorplanner.convertY(lastNode.y),w,h);
		}			    	    	
	}

	function drawTagging(s1,s2,thickness){
		let w2 = Number(thickness) / 2;
		var rulerData = utils.getDistancePoleData(s1,s2,w2);

    	context.beginPath();	    	
    	context.moveTo(rulerData.point[0].x,rulerData.point[0].y);
    	context.lineTo(rulerData.point[1].x,rulerData.point[1].y);

    	// context.moveTo(rulerData.point[2].x,rulerData.point[2].y);
    	// context.lineTo(rulerData.point[3].x,rulerData.point[3].y);

    	// context.moveTo(rulerData.point[4].x,rulerData.point[4].y);
    	// context.lineTo(rulerData.point[5].x,rulerData.point[5].y);

    	context.font      = "14px serif";
    	context.textAlign = "center";
    	context.fillStyle = "#000000";
		context.fillText(rulerData.distance,rulerData.center.x, rulerData.center.y);

	    context.lineWidth   = 1;
	    context.closePath();
	    context.strokeStyle = '#000000';
	    context.stroke();
	}

	//墙角标记
	function drawCircle(centerX, centerY,hover,hover2) {
		var color = '#909090';
		let diam  = 6;
		if(hover){
			diam  = 7;
			color = '#3e82f7';
		}
		// if(hover){
		// 	color = cornerColor;
		// }else if(hover2){
		// 	color = '#C71585';
		// }
	    context.beginPath();
	    context.arc(centerX, centerY, diam, 0, 2 * Math.PI, false);
	    context.fillStyle = color;
	    context.closePath();
	    context.fill();
	}

	function drawWallCorner(sx,sy,diam,color){
		let x = floorplanner.convertX(sx);
		let y = floorplanner.convertY(sy);
		context.beginPath();
	    context.arc(x, y, 6, 0, 2 * Math.PI, false);
	    context.fillStyle = color;
	    context.closePath();
	    context.fill();
	}

	function drawLine(startX, startY, endX, endY, width, color,flag,textObj) {
			context.save();
	  		context.beginPath();
		    context.moveTo(startX, startY);
			context.lineTo(endX, endY); 
			if(textObj){
				context.font      = "14px serif";
				context.textAlign = "center";
				context.fillStyle = "#000000";
				context.fillText(parseInt(textObj.length), textObj.x, textObj.y);	
			}
			context.lineWidth   = width;
		    context.strokeStyle = color;
		    context.closePath();
			context.stroke();
			context.restore();
		    //墙中线
	    if(flag){
			context.save();
		    context.beginPath();
		    context.moveTo(startX, startY);
		    context.lineTo(endX, endY); 
		    context.lineWidth   = 1;
		    context.strokeStyle = "#998800";
		    context.closePath();
			context.stroke();
			context.restore();
	    }
	}

	//画房间边框线和填充房间
	function drawPolygon(xArr,yArr,fill,fillColor,stroke, strokeColor, strokeWidth){
		var fill   = fill   || false;
		var stroke = stroke || false;
		context.beginPath();
		for(var i = 0; i < xArr.length;i++){
			context.lineTo(xArr[i], yArr[i]);
		}
		context.closePath();
		if(fill){
			context.fillStyle = fillColor;
			context.fill();
		}
		if(stroke){
			context.lineWidth   = strokeWidth;
     		context.strokeStyle = strokeColor;
     		context.stroke();
		}
	}

	function drawPolygon2(xArr,yArr,fillColor,areaCenter,area,roomName){
		let centerX = areaCenter.x -20;
		let centerY = areaCenter.y;
		context.beginPath();
		for(var i = 0; i < xArr.length;i++){
			context.lineTo(xArr[i], yArr[i]);
		}
		context.closePath();
		context.fillStyle = fillColor;
		context.fill();
		context.font      = "14px serif";
    	context.fillStyle = "#000000";
    	context.fillText(roomName,centerX,centerY - 20);
		context.fillText(area,centerX,centerY);

			// context.lineWidth   = 1;
   //   		context.strokeStyle = '#000';
   //   		context.stroke();
	}


	function drawGrid(){
		var offsetX = calculateGridOffset(-100);
	    var offsetY = calculateGridOffset(-100);
	 
	    var width   = canvasElement.width;
	    var height  = canvasElement.height;
	    for (var x=0; x <= (width / gridSpacing); x++) {
	      drawLine(gridSpacing * x + offsetX, 0, gridSpacing*x + offsetX, height, gridWidth, gridColor);
	    }
	    for (var y=0; y <= (height / gridSpacing); y++) {
	      drawLine(0, gridSpacing * y + offsetY, width, gridSpacing*y + offsetY, gridWidth, gridColor);
	    }
	  	//init();
	}

	function drawEdge(edge,hover){
		var corners = edge.corners();
		var x,y;
		x = G_Utils.map(corners,function(corner){
			return floorplanner.convertX(corner.x)
		});
		y = G_Utils.map(corners,function(corner){
			return floorplanner.convertY(corner.y);
		});
		drawPolygon(x,y,false,null,true,edgeColor,edgeWidth)
	}

	/*
		墙角有三种情况
		1.单独的墙角
		2.连接点有多个墙角
		3.选中门窗时显示门窗的两边墙角
	*/ 
	function drawCorner(corner) {

	    var hover   = false;
	    var hover2  = false;

	    if(corner.cornerType  == 'wall'){
	    	if(floorplanner.activeCorner === corner){
	    		hover = true;
	    	}
	    	drawCircle(
		      floorplanner.convertX(corner.x), 
		      floorplanner.convertY(corner.y), 
		      hover,
		      hover2 
		    );
	    }

	}
	function drawRoomArea(roomarea){

		let cor = roomarea.getCorners();
		let cx,cy,roomColor;
		cx =  G_Utils.map(cor,function(corner){
			return floorplanner.convertX(corner.x)
		});

		cy =  G_Utils.map(cor,function(corner){
			return floorplanner.convertY(corner.y)
		});

		if(roomarea.areaColor){
			roomColor = '#45a5fa';
		}else{
			roomColor = '#ccc';
		}

		let roomName 	= roomarea.type ? G_Utils.getRoomArea(roomarea.type) : '未命名';
		let centerX 	= floorplanner.convertX(roomarea.areaCenter.x);
		let centerY 	= floorplanner.convertY(roomarea.areaCenter.y);
		let areaCenter  = {'x': centerX,'y': centerY};
		drawPolygon2(cx,cy,roomColor,areaCenter,roomarea.area,roomName);

	}
	//分区
	function drawAreaLine(arealine){
		let sx = floorplanner.convertX(arealine.getStart().x);
		let sy = floorplanner.convertY(arealine.getStart().y);
		let ex = floorplanner.convertX(arealine.getEnd().x);
		let ey = floorplanner.convertY(arealine.getEnd().y);
		drawLine(sx,sy,ex,ey,1,'#C71585');
	}
	/*
		画墙：这里有4种情况
		1.如果类型是21承重墙
		2.如果移动时找到这个墙
		3.如果点击找到这个墙
		4.如果是普通墙包括
	*/
	function drawWall(wall){
	
		var hover = false;
		if(floorplanner.activeWall && floorplanner.activeWall.constructor === Array){
			hover = wall === floorplanner.activeWall[0];
		}else{
			hover = wall === floorplanner.activeWall;
		}
		
		var flag  = true;
		var sx,sy,ex,ey,color;
		sx = floorplanner.convertX(wall.getStartX());
		sy = floorplanner.convertY(wall.getStartY());
		
		ex = floorplanner.convertX(wall.getEndX());
		ey = floorplanner.convertY(wall.getEndY());
		//默认颜色
		if(wall.type == 0 || wall.type == 2){
			color = '#A9A9A9';
		}else if(wall.type == 21){
			color = '#000000';
		}

		if(floorplanner.activeWall){
			if(wall === floorplanner.activeWall || wall === floorplanner.activeWall[0]){
				color = 'rgba(100,149,237,0.5)';
			}
		}
		if(wall.clickAddColor){
				color = '#4169E1';
		}

		drawLine(sx,sy,ex,ey,wall.thickness,color,true);

		if(!hover && wall.frontEdge){
			drawEdge(wall.frontEdge, hover);
		}else if(!hover && wall.backEdge){
			drawEdge(wall.backEdge, hover);
		}
	} 

	//画房间 room =  房间信息
	function drawRoom(room){
		
		var pointsArr = [];	
		var cor = room.getCorners();
		for(var i = 0,len=cor.length;i<len;i++){
			var v1  = floorplanner.convertX(cor[i].getX());
			var v2  = floorplanner.convertY(cor[i].getY());
			var obj = {x:v1 ,y:v2};
			pointsArr.push(obj);
		}	
		var area 		= ($agr.poly.Area(pointsArr) * 10 * 0.00001).toFixed(2) + 'm²';
		var areaCenter  = $agr.poly.centerP(pointsArr);
		var cx,cy;

		cx =  G_Utils.map(cor,function(corner){
			return floorplanner.convertX(corner.x)
		});

		cy =  G_Utils.map(cor,function(corner){
			return floorplanner.convertY(corner.y)
		});

		if(room.areaColor){
			roomColor = '#45a5fa';
		}else{
			roomColor = '#f9f9f9';
		}
		var roomName = room.type ? G_Utils.getRoomType(room.type) : '未命名';

		drawPolygon2(cx,cy,roomColor,areaCenter,area,roomName);
	}

	function init(){	
		canvaswidth  = document.body.offsetWidth;
		canvasHeight = document.body.offsetHeight;
		canvasElement.width  = canvaswidth;
		canvasElement.height = canvasHeight;
		scope.draw()
	}
	init()
	
}