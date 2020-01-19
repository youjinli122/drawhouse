var UI_popup_room = function(){
	var html = '';
		html += '<div class="room-types-container">';
			html += '<span class="option-item" data-type="500">开间</span>';
			html += '<span class="option-item" data-type="505">客厅</span>';
			html += '<span class="option-item" data-type="506">餐厅</span>';
			html += '<span class="option-item" data-type="507">厨房</span>';
			html += '<span class="option-item" data-type="501">主卧</span>';
			html += '<span class="option-item" data-type="502">次卧</span>';
			html += '<span class="option-item" data-type="503">书房</span>';
			html += '<span class="option-item" data-type="504">儿童房</span>';
			html += '<span class="option-item" data-type="508">主卫</span>';
			html += '<span class="option-item" data-type="509">次卫</span>';
			html += '<span class="option-item" data-type="512">衣帽间</span>';
			html += '<span class="option-item" data-type="513">储物间</span>';
			html += '<span class="option-item" data-type="514">空调</span>';
			html += '<span class="option-item" data-type="515">楼梯</span>';
			html += '<span class="option-item" data-type="516">电梯</span>';
			html += '<span class="option-item" data-type="517">洗衣房</span>';
			html += '<span class="option-item" data-type="518">设备间</span>';
		html += '</div>';
	return html;
}
var UI_popup_area = function(){
	var html = '';
		html += '<div class="room-types-container">';
			html += '<span class="option-item" data-type="0">玄关区</span>';
			html += '<span class="option-item" data-type="1">会客区</span>';
			html += '<span class="option-item" data-type="2">就餐区</span>';
			html += '<span class="option-item" data-type="3">过道区</span>';
			html += '<span class="option-item" data-type="4">楼梯区</span>';
			html += '<span class="option-item" data-type="5">淋浴区</span>';
			html += '<span class="option-item" data-type="6">洗手区</span>';
			html += '<span class="option-item" data-type="7">马桶区</span>';
			html += '<span class="option-item" data-type="8">玩耍区</span>';
			html += '<span class="option-item" data-type="9">厨房区</span>';
			html += '<span class="option-item" data-type="10">睡眠区</span>';
		html += '</div>';
	return html;
}

var UI_popup_floor = function(){
	var html = '';	
	html += '<option class="option-item" data="18">其他</option>';
	html += '<option class="option-item" data="1801">地漏</option>';
	html += '<option class="option-item" data="1802">浴缸地漏</option>';
	html += '<option class="option-item" data="1803">沐浴地漏</option>';
	html += '<option class="option-item" data="1804">洗脸地漏</option>';
	html += '<option class="option-item" data="1805">洗菜盆地漏</option>';
	html += '<option class="option-item" data="1806">马桶地漏</option>';	
	return html;
}

var UI_popup_water = function(){
	var html = '';
	html += '<option  data="17">其他</option>';
	html += '<option  data="1701">热水</option>';
	html += '<option  data="1702">冷水</option>';
	html += '<option  data="1703">中水</option>';

	return html;
}

var UI_siderbar_room = function(flag){
	let name = '房间';
	if(flag == 'area'){
		name = '分区';
	}
	var html = '';
	html += '<div class="sidebar-title weigth-600"><span>'+name+'信息</span><div class="icon j_icon"><img src="image/close.png" alt=""></div></div>';
	html += '<div class="item-content flex-between">';
	html +=		'<div class="item-title">'+name+'类型</div>';
	html +=		'<div class="item-r"><div class="select-content"><div class="select-trigger">未命名</div></div></div>';
	html +=	'</div>';
	html += '<div class="item-messige flex-between"><span>'+name+'面积</span><span class="j_area"></span></div>';
	return html;
}

var UI_siderbar_wall = function(){
	var html = '';
	html += '<div class="sidebar-title weigth-600"><span>墙体</span><div class="icon j_icon"><img src="image/close.png" alt=""></div></div>';
	html += '<div class="item-content">';
	html +=		'<div class="item-title">属性</div>';
	html +=		'<div class="row zdy-row" id="changeWall">';
	html +=				'<div class="col-lg-4 wall-l"  data="0"><p>普通墙</p></div>';
	html +=				'<div class="col-lg-4 wall-l" data="21"><p>承重墙</p></div>';
	html +=			'</div>';
	html +=			'<div class="item">';
	html +=				'<div class="item-title"><p>厚度</p></div>';
	html +=				'<div class="item-val clearfix">'; 
	html +=					'<input type="text" name="thickness" value="" class="range_0 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span>';
	html +=				'</div>';
	html +=			'</div>';
	html +=			'<div style="clear: both;"></div>';  
	html +=			'<div class="item">';
	html +=				'<div class="item-title"><p>长度</p></div>';
	html +=				'<div class="item-val clearfix">'; 
	html +=					'<input type="text" name="length" value="" class="range_1 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span>';
	html +=				'</div>';		
	html +=			'</div>';
	html +=			'<div style="clear: both;"></div>';
	html +=			'<div class="item">';
	html +=				'<div class="item-title"><p>高度</p></div>';
	html +=				'<div class="item-val clearfix" disabled="disabled">';
	html +=					'<input type="text" name="height"  value="" class="range_2 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span>';
	html +=			'</div>';
	html +=			'<div style="clear: both;"></div>';
	html +=			'<div class="item">';
	html +=				'<div class="item-title"><p>墙体功能</p></div>';
	html +=				'<div class="item-val clearfix">'; 
	html +=					'<select class="j_backgroundWall" style="width:65%"><option data="0">空白</option><option data="1">沙发背景墙</option><option data="2">电视背景墙</option><option data="3">餐厅背景墙</option><option data="4">床背景墙</option><select/>';
	html +=				'</div>';		
	html +=			'</div>';    
	html +=	 '</div></div>';
	return html;
}

var UI_siderbar_door = function(type){
	
	let title = G_Utils.getTypeItem(type).name;
	let html = '';
	let str  = '';

	html += '<div class="sidebar-title weigth-600"><span>'+title+'</span><div class="icon j_icon"><img src="image/close.png" alt=""></div></div>';
	html += '<div class="item-content">';
	html +=		'<div class="item-title">属性</div>';
	html +=		'<div class="item"><div class="item-title"><p>长度</p></div>';
	html +=		'<div class="item-val clearfix"><input type="text" name="length" value="" class="range_0 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span></div></div>';
	html +=		'<div style="clear: both;"></div>';  
	html +=    	'<div class="item">';
	html +=			'<div class="item-title"><p>宽度</p></div>';
	html +=			'<div class="item-val clearfix">';
	html +=				'<input type="text" name="width" value="" class="range_1 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span>';
	html +=		'</div></div>';
	html +=     '<div class="item"><div class="item-title"><p>高度</p></div>';
	html +=     '<div class="item-val clearfix"><input type="text" name="height" value="1200" class="range_2 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span></div></div>';
	html +=		'<div style="clear: both;"></div>';
	html +=		'<div class="item">';
	html +=			'<div class="item-title"><p>离地</p></div>';
	html +=			'<div class="item-val clearfix">';
	html +=				'<input type="text" name="lidi" value="900" class="range_3 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span>';
	html +=		'</div></div>';
	html +=	 '</div>';
	return html;
}
var UI_siderbar_roomCom = function(type){
	let title = G_Utils.getTypeItem(type).name;

	let html  = '';
	
	html += '<div class="sidebar-title weigth-600"><span>'+title+'</span><div class="icon j_icon"><img src="image/close.png" alt=""></div></div>';
	html += '<div class="item-content">';
	html +=		'<div class="item-title">属性</div>';
	html +=			'<div class="item">';
	html +=				'<div class="item-title"><p>长度</p></div>';
	html +=				'<div class="item-val clearfix">'; 
	html +=					'<input type="text" name="length" value="" class="range_0 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span>';
	html +=				'</div>';
	html +=			'</div>';
	html +=			'<div class="item temp">';
	html +=				'<div class="item-title"><p>宽度</p></div>';
	html +=				'<div class="item-val clearfix">'; 
	html +=					'<input type="text" name="width" value="" class="range_1 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span>';
	html +=				'</div>';
	html +=			'</div>';
	html +=			'<div style="clear: both;"></div>';  
	html +=			'<div class="item temp">';
	html +=				'<div class="item-title"><p>高度</p></div>';
	html +=				'<div class="item-val clearfix">'; 
	html +=					'<input type="text" name="height" value="1200" class="range_2 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span>';
	html +=				'</div>';		
	html +=			'</div>';
	html +=			'<div style="clear: both;"></div>';
	html +=			'<div class="item temp">';
	html +=				'<div class="item-title"><p>角度</p></div>';
	html +=				'<div class="item-val clearfix">';
	html +=					'<input type="text" name="edg" value="0-360" class="range_3 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px"> °</span>';
	html +=			'</div></div>';
	html +=			'<div class="item diameter" style="display:none">';
	html +=				'<div class="item-title"><p>直径</p></div>';
	html +=				'<div class="item-val clearfix">';
	html +=					'<input type="text" name="diameter" value="" class="range_4 irs-hidden-input" tabindex="-1" readonly=""><span style="font-size:12px">mm</span>';
	html +=			'</div></div>';
	html +=			'<div style="clear: both;"></div>';
	html +=			'<div class="item">';
	html +=				'<div class="item-title"><p>形状</p></div>';
	html +=				'<div class="item-val clearfix">'; 
	html +=					'<select class="j_select_shape" style="width:65%"><option data="1601">长方体</option><option data="1602">圆柱体</option><select/>';
	html +=				'</div>';		
	html +=			'</div>';   
	if(type == 17){
		html +=			'<div style="clear: both;"></div>';
		html +=			'<div class="item">';
		html +=				'<div class="item-title"><p>功能</p></div>';
		html +=				'<div class="item-val clearfix">'; 
		html +=					'<select class="j_select_type" style="width:65%">'+UI_popup_water()+'<select/>';
		html +=				'</div>';		
		html +=			'</div>';   
	}else if(type == 18){
		html +=			'<div style="clear: both;"></div>';
		html +=			'<div class="item">';
		html +=				'<div class="item-title"><p>功能</p></div>';
		html +=				'<div class="item-val clearfix">'; 
		html +=					'<select class="j_select_type" style="width:65%">'+UI_popup_floor()+'<select/>';
		html +=				'</div>';		
		html +=			'</div>';   
	}
	html +=	 '</div></div>';
	return html;
}
var UI_hover_popup = function(){
	var html =  '';
		html += '<div class="popup-hover">';
		html += 	'<div class="item-c">';
		html +=    		'<div class="item"><input type="checkbox" checked="checked" /><span>房间名</span></div>';
		html +=    	'<div class="item"><input type="checkbox" checked="checked" /><span>面积</span></div>';
		html += '</div></div>';
	return html;
}
