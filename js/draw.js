
(function(g){
	var opts = {
		floorplannerElement: 'floorplanner-canvas',
	}
	g.blueprint = new Blueprint3d(opts);		
})(window);

window.onload = function(){

	var g_plan    =   window.blueprint;
	var mouseDown = false;
	var g_flag    = null;
	//选择房间分区
	EVENT_ON("createdEvent",function(targ){	
		g_flag = targ;
		//改变墙的属性
		if(targ === 'wall'){
			$("#changeWall .wall-l").on("click",function(){
				$(this).addClass("active").siblings().removeClass("active");
				g_plan.floorplanner.findWall.update('type',$(this).attr("data"));
			});
			//选择背景墙
			$("#J_ctrlsiderbar .j_backgroundWall").on("change",function(){
				let data = $(this).find("option:selected").attr("data");
				g_plan.floorplanner.findWall.update('backType',data);
			});
		}

		if(targ === 'roomCom'){
			$("#J_ctrlsiderbar .j_select_shape").on("change",function(){
				let obj  = g_plan.floorplanner.activeRoomCom;
				let data = $(this).find("option:selected").attr("data");	
				obj.resetShape(data);
			});
			$("#J_ctrlsiderbar .j_select_type").on("change",function(){
				let obj  = g_plan.floorplanner.activeRoomCom;
				let data = $(this).find("option:selected").attr("data");	
				obj.resetType(data);
			});
		}
		if(targ === 'room' || targ === 'roomarea'){
			//选择房间的类型
		 	$("#J_ctrlsiderbar .select-trigger").on("click",function(e){
				var width = e.target.offsetWidth;
				var left  = e.pageX-e.offsetX;
				var top   = e.pageY-e.offsetY+22;
				$(this).toggleClass("open-popup");
				if($(this).hasClass("open-popup")){
					if(targ  == 'room'){
						$(".popup-content").html(UI_popup_room);
					}else if(targ == 'roomarea'){
						$(".popup-content").html(UI_popup_area);
					}
					
					$(".h5-wrapping-popup").css({
						"width":width+"px",
						"left":left+"px",
						"top":top+"px"
					});
					var data = $(".select-trigger").attr("data-type");
					$('.room-types-container .option-item[data-type="'+data+'"]').addClass("selected");
					EVENT_EMIT("open_popup_room",targ);
				}else{
					$(".popup-content").html("");
					$(".select-trigger").removeClass("open-popup");
				}
			});
		}
		
		$("#J_ctrlsiderbar .j_icon").on("click",function(){
			$("#J_ctrlcanvas .tab1").addClass("active");
			$("#J_ctrlcanvas .tab2").removeClass("active");
		});	
	 });

		function backObj(flag){
			let obj = null;
			switch(g_flag){
				case 'wall' : 
					obj = g_plan.floorplanner.findWall;
					if(flag == 0){
						G_Utils.operationalStorage("removeWall",{'my':obj});
					}
				break;
				case 'room' : 
					obj = g_plan.floorplanner.findRoom;
					G_Utils.operationalStorage("removeRoom",{'my':obj,'corner': obj.getNoPublicCorner(),'wall': obj.getNoPublicWall(),'coms':obj.getRoomComs(),'roomarea': obj.getRoomArea()});
				break;
				case 'roomarea' :
					obj = g_plan.floorplanner.activeRoomArea;
					G_Utils.operationalStorage("removeRoomArea",{'my':obj,'wall': obj.getWalls(),'corner': obj.getCorners()});
				break;
				case 'roomCom' : 
					obj = g_plan.floorplanner.activeRoomCom;
					G_Utils.operationalStorage("removeRoomcom",{'my':obj});	
				break;
				case 'door' : 
					obj = g_plan.floorplanner.findDoor;

					if(flag == 0){
						G_Utils.operationalStorage("removeDoor",{'my':obj});
					}
					
				break;
				default :
				break;
			}
			return obj;
		}

		$("#J_dialog .j_item").on("click",function(){
			let flag   = $(this).attr("data"); // 0删除，1分割，2，旋转
			let obj    = backObj(flag);
			if(flag == 0){
				obj.remove();

			}else if(flag == 1){		

				let centerPoint   = $agr.L_segm.midP(obj.getStart(),obj.getEnd());
				g_plan.floorplanner.createNewCorner(centerPoint,obj);
			
			}else if(flag == 2){

				obj.updateRotate(obj.edg);

			}
			g_plan.floorplanner.updateCanvasPage(flag,true);
		});


	EVENT_ON("open_popup_room",function(flag){
	
		$(".room-types-container .option-item").on("click",function(){
			let text = $(this).text();
			let data = $(this).attr("data-type");

			if(flag == 'room'){
				g_plan.floorplanner.findRoom.type = data;
			}else{
				g_plan.floorplanner.activeRoomArea.update(data);
			}
	
			$(this).addClass("selected").siblings().removeClass("selected");
			$(".select-trigger").text(text).attr("data-type",data);
			$(".popup-content").html("");
			$(".select-trigger").removeClass("open-popup");
		})
	});

	function changeDoor(inp){
		var name = $(inp).attr("name");
		var val  = Number($(inp).attr("value")) / 10;	
		if(name == 'length'){
			g_plan.floorplanner.selectDoors.width = val;
			g_plan.floorplan.update();
			g_plan.floorplanner.resetDraw();
		}
	}


	function viewerFloorplanner(){
		this.b3d  =  window.blueprint;
		var scope = this

		$("#J_ctrlcanvas .draw").on("click",function(){
			let flag = $(this).attr("data");
			if(flag == 0){
				scope.b3d.floorplanner.setMode(scope.b3d.floorplanner.modes.DRAW);	
				scope.b3d.floorplanner.isDraw       = true;
				scope.b3d.floorplanner.isDrawRoom   = false;
				scope.b3d.floorplanner.addItemState = false;
				scope.b3d.floorplanner.isDrawArea = false;
				document.getElementById('floorplanner-canvas').style.cursor = 'crosshair';
			}else if(flag == 1){
				scope.b3d.floorplanner.setMode(scope.b3d.floorplanner.modes.DRAWROOM);	
				scope.b3d.floorplanner.isDrawRoom   = true;
				scope.b3d.floorplanner.isDraw       = false;
				scope.b3d.floorplanner.addItemState = false;
				scope.b3d.floorplanner.isDrawArea = false;
				document.getElementById('floorplanner-canvas').style.cursor = 'crosshair';
			}else if(flag == 2){	
				scope.b3d.floorplanner.setMode(scope.b3d.floorplanner.modes.DRAWAREA);			
				scope.b3d.floorplanner.isDrawArea = true;
				scope.b3d.floorplanner.isDraw       = false;
				scope.b3d.floorplanner.isDrawRoom   = false;
				scope.b3d.floorplanner.addItemState = false;
				document.getElementById('floorplanner-canvas').style.cursor = 'crosshair';
			}else if(flag >=3){			
				scope.b3d.floorplanner.addItemState = true;
				scope.b3d.floorplanner.isDraw       = false;
				scope.b3d.floorplanner.isDrawRoom   = false;
				scope.b3d.floorplanner.setItemMode(flag);
				document.getElementById('floorplanner-canvas').style.cursor = 'auto';
			}
			$("#J_ctrlcanvas .draw").removeClass("active");
			$(this).addClass("active");
		});
	}
	viewerFloorplanner();

	$(".header-body .clear").on("click",function(){
		g_plan.floorplanner.clearFloorplan();
	});
	$(".header-body .sava").on("click",function(){
		g_plan.floorplan.savaFloorplan2();
	});

	var mDown = false;

	$("#J_export").on("click",function(){
		g_plan.floorplan.setOrigin(g_plan.floorplanner.originX,g_plan.floorplanner.originY);
		let data    = g_plan.floorplan.savaFloorplan();
        let content = JSON.stringify(data);
        let blob    = new Blob([content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "save.json");
	});
	$("#importJson").on("click",function(){
		$("#files").trigger('change');
	});
	$("#files").on("change",function(){
		let dd 	   = document.getElementById('files').files[0];
		if( dd ){
			let reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
        	reader.readAsText(dd);//读取文件的内容
	        reader.onload = function(){
	            let json = JSON.parse(this.result);
	            g_plan.floorplanner.reset(json);
	          	console.log("读取结果：",json);//当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
	        };
		}
	});

	//点击撤销
	$("#J_undo").on("click",function(){
		G_undoRedo.undo();
	});	
	//点击重写
	$("#J_redo").on("click",function(){
		G_undoRedo.redo();
	});	
	/*
		选择单空间start
	*/
	$(".dialog .col-md-4").on("click",function(){
		let data = $(this).attr("data");
		$(".dialog").hide();
		$(".musk").hide();
		g_plan.floorplanner.reset(G_tempHouseObj[data],true);
	});
	$(".open-dialog").on("click",function(){
		$(".musk").show();
		$(".dialog").show();
	});
	$(".musk").on("click",function(){
		$(this).hide();
		$(".dialog").hide();
	});
	$(".dialog .close-dialog").on("click",function(){
		$(".dialog").hide();
		$(".musk").hide();
	});
		/*
			选择但空间end
		*/

		/*
			指南针事件start
		*/
		$(".apartment-layout-compass").mousedown(function(event){
			mDown = true;        
		});
		$(".apartment-layout-compass").mousemove(function(event){
			if(!mDown)return;
			let beginPointX = 370; 
			let beginPointY = 60;
			let bgCenterX   = 370;
			let bgCenterY   = 90;

			var x1 = (beginPointX - bgCenterX);       
			var y1 = (beginPointY - bgCenterY);            
			//得到 向量2
			 // 鼠标移动的点 - 图片中心点  
            var x2 = (event.pageX - bgCenterX);         
            var y2 = (event.pageY - bgCenterY);            
          
            var cos =( x1 * x2 + y1 * y2) / ( Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) * Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)) );            
            var radina = Math.acos(cos);            
            var angle =  180 / (Math.PI / radina);     //如果在中线左边 就需要加 180度
   
            if(event.pageX <370){
                angle = (180 + (180 - angle));   
            }   
            angle = Number(angle.toFixed(3));         
    
            $(this).css({'transform':'rotate(' + angle + 'deg)'}); 
		});

		$(".apartment-layout-compass").mouseup(function(event){
			mDown = false;
		});

		$(".apartment-layout-compass").mouseenter(function(){
			$(".compass-img").hide();
		    $(".compass-active-img").show();
		});
		$(".apartment-layout-compass").mouseleave(function(){
		    $(".compass-active-img").hide();
		    $(".compass-img").show();
		});
		
		function listendown(e){
		    if(e.keyCode == 13){
		       let val = e.currentTarget.value;
		       let targetId = $(this).parent().attr("data-id");
		       g_plan.floorplan.changeWallsLength(g_plan.floorplanner.changeWalls,Number(val),targetId);
		       g_plan.floorplanner.resetDraw();
		    }
		}
		// 回车搜索
		$(".span-input-container").delegate("input","keydown", listendown);
		/*
			指南针事件end
		*/
		//执行撤销，重写的命令
		var G_addObj      = G_undoRedo.Commands;
		G_addObj.roomTool = {
			"drawroom": {
				 execute:function(data){
		            console.log("执行重写:",data);
		            data.wall.forEach(function(item){
		            	item.setStart(item.getStart());
		            	item.setEnd(item.getEnd());
		            	g_plan.floorplan.setWalls(item);
		            });
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            data.wall.forEach(function(item){
		            	item.remove();
		            });
		            g_plan.floorplanner.resetDraw();
		        },
			},
		    "wall":{
		        execute:function(data){
		            console.log("执行重写:",data);
		            data.my.setStart(data.my.getStart());
		            data.my.setEnd(data.my.getEnd());
		            g_plan.floorplan.setWalls(data.my);
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            data.my.remove();
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		    "addDoor": {
		    	execute:function(data){
		            console.log("执行重写:",data);
		            g_plan.floorplan.setDoors(data.my);
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            data.my.remove();
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		    "addRoomcom": {
		    	execute:function(data){
		            console.log("执行重写:",data);
		            g_plan.floorplan.setRoomcoms(data.my);
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            data.my.remove();
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		    "addAreaWall": {
		    	execute:function(data){
		            console.log("执行重写:",data);
		            data.my.setStart(data.my.getStart());
		            data.my.setEnd(data.my.getEnd());
		            g_plan.floorplan.setAreaWalls(data.my);
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            data.my.remove();
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		    "removeWall": {
		    	execute:function(data){
		            console.log("执行重写:",data);
		            data.my.remove();
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:");
		            g_plan.floorplan.setDoors(data.my.getDoorWindows());
		            data.my.setStart(data.my.getStart());
		            data.my.setEnd(data.my.getEnd());
		            data.my.clickAddColor = false;
		            g_plan.floorplan.setWalls(data.my);
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		    "removeDoor": {
		    	execute:function(data){
		            console.log("执行重写:",data);
		            data.my.remove();
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            g_plan.floorplan.setDoors(data.my);
		            g_plan.floorplanner.resetDraw(); 
		        },
		    },
		    "removeRoom": {
		    	execute:function(data){
		            console.log("执行重写:",data);
		            data.my.remove();
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            g_plan.floorplan.setRooms(data);
		            g_plan.floorplanner.resetDraw(); 
		        },
		    },
		    "removeRoomcom":{
		    	execute:function(data){
		            console.log("执行重写:",data);
		            data.my.remove();
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            g_plan.floorplan.setRoomcoms(data.my);
		            g_plan.floorplanner.resetDraw(); 
		        },
		    },
		    "removeRoomArea":{
		    	execute:function(data){
		    		console.log("执行重写:",data);
		            data.my.remove();
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            g_plan.floorplan.setRoomArea(data);
		            g_plan.floorplanner.resetDraw(); 
		        },
		    },
		    "cutWall": {
		    	execute:function(data){
		            console.log("执行重写:",data);
		            data.my.remove();

		            data.w1.setStart(data.w1.getStart());
		            data.w1.setEnd(data.w1.getEnd());
		            data.w2.setStart(data.w2.getStart());
		            data.w2.setEnd(data.w2.getEnd());

		            g_plan.floorplan.setWalls(data.w1);
		            g_plan.floorplan.setWalls(data.w2);
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            data.w1.remove();
		            data.w2.remove();
		            data.my.clickAddColor = false;
		            data.my.setStart(data.my.getStart());
		            data.my.setEnd(data.my.getEnd());
		            g_plan.floorplan.setWalls(data.my);
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		    "moveCorner":{
		    	execute:function(data){
		            console.log("执行重写:",data);
		            let p = JSON.parse( data.originObj );
		            g_plan.floorplan.changeCorner(p.x, p.y,p.id);
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            let p = JSON.parse( data.originObj );
		            g_plan.floorplan.changeCorner(p.x, p.y,p.id);
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		    "moveWall":{
				execute:function(data){
		            console.log("执行重写:",data);
		            let p = JSON.parse( data.originObj );
		            g_plan.floorplan.changeCorner(p.x, p.y,p.id);
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            let p = JSON.parse( data.originObj );
		            g_plan.floorplan.changeCorner(p.start.x, p.start.y,p.start.id);
		            g_plan.floorplan.changeCorner(p.end.x, p.end.y,p.end.id);
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		    "moveDoor": {
		    	execute:function(data){
		            console.log("执行重写:",data);
		            let p = JSON.parse( data.originObj );
		            g_plan.floorplan.changeCorner(p.x, p.y,p.id);
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            let p = JSON.parse( data.originObj );
		            g_plan.floorplan.changeCorner(p.start.x, p.start.y,p.start.id);
		            g_plan.floorplan.changeCorner(p.end.x, p.end.y,p.end.id);
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		    "moveCom":{
		    	execute:function(data){
		            console.log("执行重写:",data);
		            let p = JSON.parse( data.originObj );
		            g_plan.floorplan.changeCorner(p.x, p.y,p.id);
		            g_plan.floorplanner.resetDraw();
		        },
		        undo:function(data){
		            console.log("撤销:",data);
		            let p = JSON.parse( data.originObj );
		            data.my.x = p.start.x;
		            data.my.y = p.start.y;
		            // g_plan.floorplan.changeCorner(p.start.x, p.start.y,p.start.id);
		            // g_plan.floorplan.changeCorner(p.end.x, p.end.y,p.end.id);
		            g_plan.floorplanner.resetDraw();
		        },
		    },
		}; 
}

	
