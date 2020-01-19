function EVENT_EMIT(event){
    try{
        var v = Array.prototype.slice.call(arguments);
        jQuery.event.trigger.apply($(document),v);
        //jQuery.event.trigger.apply(null,v);
    }catch(e){
    }
}

function EVENT_ON(event,func){
    $(document).on(event,function(e){
        try{
            var v = Array.prototype.slice.call(arguments);
            v.splice(0,1);
            func.apply(this,v);
        }catch(e){}
    });
}
//门窗类型默认属性
var G_All_DoorWindow = [
	{'type':0,'name':'直墙','color':'#A9A9A9'},
	{'type':1,'name':'墙角','color':'#ccc'},
	{'type':2,'name':'孤墙','color':'#A9A9A9'},
	{'type':3,'name':'单开门','strokeColor':'#ccc','fillColor':'#fff','length':90,'width':90,'edg':180},
	{'type':4,'name':'双开门','strokeColor':'#ccc','fillColor':'#fff','length':180,'width':90,'edg':180},
	{'type':5,'name':'推拉门','strokeColor':'#000','fillColor':'#fff','length':90,'width':20,'edg':180}, 
	{'type':6,'name':'平开窗','strokeColor':'#000','fillColor':'#fff','length':90,'width':20,'edg':180}, 
	{'type':7,'name':'落地窗','strokeColor':'#000','fillColor':'#fff','length':90,'width':20,'edg':180},
	{'type':8,'name':'地板','color':'#ccc'},
	{'type':9,'name':'天花板','color':'#ccc'},
	{'type':10,'name':'飘窗','strokeColor':'#d1d1d1','fillColor':'#fff','length':100,'width':26,'edg':180}, 
	{'type':14,'name':'垭口','strokeColor':'#000','fillColor':'#fff','length':90,'width':20,'edg':180}, 
	{'type':21,'name':'承重墙','color':'#000'},
	{'type':15,'name':'梁','strokeColor':'#000','fillColor':'rgba(255,255,255,0.4)','length':100,'width':30,'edg':180},
	{'type':16,'name':'柱','strokeColor':'#000','fillColor':'#000','length':40,'width':40,'edg':180},
	{'type':17,'name':'上水口','strokeColor':'#000','fillColor':'#766778','length':12,'width':12,'height':40,'edg':180},
	{'type':18,'name':'下水口','strokeColor':'#000','fillColor':'#778899','length':12,'width':12,'height':40,'edg':180},
	{'type':19,'name':'烟道','strokeColor':'#000','fillColor':'#696969','length':30,'width':30,'height':40,'edg':180}
]

var G_tempHouseObj = {
	'one': {
		'rooms': [{id: ["46d93c1c-01e1-63a3-cbc7-a0db75865e9c", "478ff325-b30f-f315-badc-fc6b043b3d14", "3859ce57-add8-7712-f6d8-65d44c983343", "2a6e086b-1da7-f072-74dc-b72ad0ffecc4"], type: 500}],
		'corners': {
			'46d93c1c-01e1-63a3-cbc7-a0db75865e9c': {x: -493.5, y: -208, cornerType: "wall"},
			'478ff325-b30f-f315-badc-fc6b043b3d14': {x: -93.5, y: -208, cornerType: "wall"},
			'3859ce57-add8-7712-f6d8-65d44c983343': {x: -93.5, y: 156, cornerType: "wall"},
			'2a6e086b-1da7-f072-74dc-b72ad0ffecc4': {x: -493.5, y: 156, cornerType: "wall"}
		},
		'walls': [
			{'corner1': "46d93c1c-01e1-63a3-cbc7-a0db75865e9c", 'corner2': "478ff325-b30f-f315-badc-fc6b043b3d14", type: 0, thickness: 20, backgroundType: 0},
			{'corner1': "478ff325-b30f-f315-badc-fc6b043b3d14", 'corner2': "3859ce57-add8-7712-f6d8-65d44c983343", type: 0, thickness: 20, backgroundType: 0},
			{'corner1': "3859ce57-add8-7712-f6d8-65d44c983343", 'corner2': "2a6e086b-1da7-f072-74dc-b72ad0ffecc4", type: 0, thickness: 20, backgroundType: 0},
			{'corner1': "2a6e086b-1da7-f072-74dc-b72ad0ffecc4", 'corner2': "46d93c1c-01e1-63a3-cbc7-a0db75865e9c", type: 0, thickness: 20, backgroundType: 0}
		]
	},
	'two': {
		'rooms': [{id: [ "2f61f65f-ce6b-5289-1199-ace1e1ade3dd",
						 "203d2139-fc26-4a90-98f2-259dbc66c01c",
						 "95369633-2e83-d13c-0fbc-4a0b72c4e4b9",
						 "a23e4d8d-f2eb-6eff-90f7-eb4e2724e419",
						 "79ba534c-dd33-dd5b-84e1-074360232740",
						 "a18c9e02-e215-89a1-dedb-0907b9ca6d27"
				],type: 500}],
		'corners': {
				'2f61f65f-ce6b-5289-1199-ace1e1ade3dd': {x: -182.5, y: -206, cornerType: "wall"},
				'203d2139-fc26-4a90-98f2-259dbc66c01c': {x: -184.5, y: 223, cornerType: "wall"},
				'95369633-2e83-d13c-0fbc-4a0b72c4e4b9': {x: -730.5, y: 223, cornerType: "wall"},
				'a23e4d8d-f2eb-6eff-90f7-eb4e2724e419': {x: -730.5, y: 9, cornerType: "wall"},
				'79ba534c-dd33-dd5b-84e1-074360232740': {x: -392.5, y: 9, cornerType: "wall"},
				'a18c9e02-e215-89a1-dedb-0907b9ca6d27': {x: -392.5, y: -208, cornerType: "wall"}
		},
		'walls': [ 	{corner1: "a18c9e02-e215-89a1-dedb-0907b9ca6d27", corner2: "2f61f65f-ce6b-5289-1199-ace1e1ade3dd", type: 0, thickness: 20, backgroundType: 0},
				   	{corner1: "2f61f65f-ce6b-5289-1199-ace1e1ade3dd", corner2: "203d2139-fc26-4a90-98f2-259dbc66c01c", type: 0, thickness: 20, backgroundType: 0},
					{corner1: "203d2139-fc26-4a90-98f2-259dbc66c01c", corner2: "95369633-2e83-d13c-0fbc-4a0b72c4e4b9", type: 0, thickness: 20, backgroundType: 0},
					{corner1: "95369633-2e83-d13c-0fbc-4a0b72c4e4b9", corner2: "a23e4d8d-f2eb-6eff-90f7-eb4e2724e419", type: 0, thickness: 20, backgroundType: 0},
					{corner1: "a23e4d8d-f2eb-6eff-90f7-eb4e2724e419", corner2: "79ba534c-dd33-dd5b-84e1-074360232740", type: 0, thickness: 20, backgroundType: 0},
					{corner1: "79ba534c-dd33-dd5b-84e1-074360232740", corner2: "a18c9e02-e215-89a1-dedb-0907b9ca6d27", type: 0, thickness: 20, backgroundType: 0},
		],
	},
	'three': {
		'rooms': [{id: [
					    "5cfb1069-b0bf-b9d4-412b-59cf2cccd7a7",
						"a28b62be-2b1a-c2fd-961f-3aa296cd4180",
						"2558289b-b561-7eff-d89b-82803100fc83",
						"2ab0d6a9-d91f-cf39-06d3-9ac06e3fa4c7",
						"31084fd2-e88d-fe10-91b5-fd3286a4af90",
						"519275bf-29ec-f713-0d9d-1cff0af7cb6e",
						"80114122-cd82-f45a-7512-59c649ce95dc",
						"91c52bd4-1813-a18f-1aec-052e30ff2e17"
		],type: 500}],
		'corners': {
			'5cfb1069-b0bf-b9d4-412b-59cf2cccd7a7': {x: -257.5, y: -189, cornerType: "wall"},
			'a28b62be-2b1a-c2fd-961f-3aa296cd4180': {x: -257.5, y: -69, cornerType: "wall"},
			'2558289b-b561-7eff-d89b-82803100fc83': {x: -50.5, y: -69, cornerType: "wall"},
			'2ab0d6a9-d91f-cf39-06d3-9ac06e3fa4c7': {x: -50.5, y: 188, cornerType: "wall"},
			'31084fd2-e88d-fe10-91b5-fd3286a4af90': {x: -552.5, y: 188, cornerType: "wall"},
			'519275bf-29ec-f713-0d9d-1cff0af7cb6e': {x: -552.5, y: -69, cornerType: "wall"},
			'80114122-cd82-f45a-7512-59c649ce95dc': {x: -388.5, y: -69, cornerType: "wall"},
			'91c52bd4-1813-a18f-1aec-052e30ff2e17': {x: -388.5, y: -189, cornerType: "wall"}
		},
		'walls': [
			{corner1: "91c52bd4-1813-a18f-1aec-052e30ff2e17", corner2: "5cfb1069-b0bf-b9d4-412b-59cf2cccd7a7", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "5cfb1069-b0bf-b9d4-412b-59cf2cccd7a7", corner2: "a28b62be-2b1a-c2fd-961f-3aa296cd4180", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "a28b62be-2b1a-c2fd-961f-3aa296cd4180", corner2: "2558289b-b561-7eff-d89b-82803100fc83", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "2558289b-b561-7eff-d89b-82803100fc83", corner2: "2ab0d6a9-d91f-cf39-06d3-9ac06e3fa4c7", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "2ab0d6a9-d91f-cf39-06d3-9ac06e3fa4c7", corner2: "31084fd2-e88d-fe10-91b5-fd3286a4af90", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "31084fd2-e88d-fe10-91b5-fd3286a4af90", corner2: "519275bf-29ec-f713-0d9d-1cff0af7cb6e", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "519275bf-29ec-f713-0d9d-1cff0af7cb6e", corner2: "80114122-cd82-f45a-7512-59c649ce95dc", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "80114122-cd82-f45a-7512-59c649ce95dc", corner2: "91c52bd4-1813-a18f-1aec-052e30ff2e17", type: 0, thickness: 20, backgroundType: 0}
		]
	},
	'four': {
		'rooms': [{id: [
					"2f443b61-1054-c967-0612-af77f902aacf",
					"30f27184-14b9-4303-bdce-64cb397e35f6",
					"8ea23434-56a7-ad78-ef85-e7fa5ab20d32",
					"1ecb0058-740e-67ce-9c36-ecfbf11756fa",
				 	"2c50ae78-f344-536a-2c77-5286a4f90268",
					"dd83966a-a555-f74d-1d06-b2b7e12580a7",
					"0b03d7a9-406a-ae38-ec8d-90158b3e1c3c",
					"a62fcfbd-b258-40af-435c-ce7fab6cf689"
			],type: 500}],
		'corners': {
			'2f443b61-1054-c967-0612-af77f902aacf': {x: -23.5, y: -172, cornerType: "wall"},
			'30f27184-14b9-4303-bdce-64cb397e35f6': {x: -23.5, y: 193, cornerType: "wall"},
			'8ea23434-56a7-ad78-ef85-e7fa5ab20d32': {x: -569.5, y: 193, cornerType: "wall"},
			'1ecb0058-740e-67ce-9c36-ecfbf11756fa': {x: -569.5, y: -166, cornerType: "wall"},
			'2c50ae78-f344-536a-2c77-5286a4f90268': {x: -449.5, y: -166, cornerType: "wall"},
			'dd83966a-a555-f74d-1d06-b2b7e12580a7': {x: -449.5, y: -2, cornerType: "wall"},
			'0b03d7a9-406a-ae38-ec8d-90158b3e1c3c': {x: -143.5, y: -2, cornerType: "wall"},
			'a62fcfbd-b258-40af-435c-ce7fab6cf689': {x: -143.5, y: -172, cornerType: "wall"},
		},
		'walls': [
			{corner1: "a62fcfbd-b258-40af-435c-ce7fab6cf689", corner2: "2f443b61-1054-c967-0612-af77f902aacf", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "2f443b61-1054-c967-0612-af77f902aacf", corner2: "30f27184-14b9-4303-bdce-64cb397e35f6", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "30f27184-14b9-4303-bdce-64cb397e35f6", corner2: "8ea23434-56a7-ad78-ef85-e7fa5ab20d32", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "8ea23434-56a7-ad78-ef85-e7fa5ab20d32", corner2: "1ecb0058-740e-67ce-9c36-ecfbf11756fa", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "1ecb0058-740e-67ce-9c36-ecfbf11756fa", corner2: "2c50ae78-f344-536a-2c77-5286a4f90268", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "2c50ae78-f344-536a-2c77-5286a4f90268", corner2: "dd83966a-a555-f74d-1d06-b2b7e12580a7", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "dd83966a-a555-f74d-1d06-b2b7e12580a7", corner2: "0b03d7a9-406a-ae38-ec8d-90158b3e1c3c", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "0b03d7a9-406a-ae38-ec8d-90158b3e1c3c", corner2: "a62fcfbd-b258-40af-435c-ce7fab6cf689", type: 0, thickness: 20, backgroundType: 0}
		]
	},
	'five': {
		'rooms': {
			'id': [
				"a31cc84c-dadc-744c-1a9e-2f8936adc20d",
				"d258e75b-fc6d-1ae3-f151-9341c87d681b",
				"3aca5358-8526-a4b7-2aed-e3bd57ae8724",
				"3f3a054f-86ca-5777-bc1f-634c61309b7a",
				"7eb15f94-5a15-e1a5-c00f-3dd79cf15662",
				"51cc4904-8d21-8e84-8850-26f7fe545372",
				"83f31704-6879-04f0-22ac-6c023109bbd2",
				"7edf8626-b501-e885-c421-992f072c50b1"
			],
			'type': 500
		},
		'corners': {
			'a31cc84c-dadc-744c-1a9e-2f8936adc20d': {x: -139.5, y: -223, cornerType: "wall"},
			'd258e75b-fc6d-1ae3-f151-9341c87d681b': {x: -139.5, y: -15, cornerType: "wall"},
			'3aca5358-8526-a4b7-2aed-e3bd57ae8724': {x: 84.5, y: -15, cornerType: "wall"},
			'3f3a054f-86ca-5777-bc1f-634c61309b7a': {x: 84.5, y: 213, cornerType: "wall"},
			'7eb15f94-5a15-e1a5-c00f-3dd79cf15662': {x: -329.5, y: 213, cornerType: "wall"},
			'51cc4904-8d21-8e84-8850-26f7fe545372': {x: -329.5, y: -11, cornerType: "wall"},
			'83f31704-6879-04f0-22ac-6c023109bbd2': {x: -472.5, y: -11, cornerType: "wall"},
			'7edf8626-b501-e885-c421-992f072c50b1': {x: -472.5, y: -223, cornerType: "wall"}
		},
		'walls': [
			{corner1: "7edf8626-b501-e885-c421-992f072c50b1", corner2: "a31cc84c-dadc-744c-1a9e-2f8936adc20d", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "a31cc84c-dadc-744c-1a9e-2f8936adc20d", corner2: "d258e75b-fc6d-1ae3-f151-9341c87d681b", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "d258e75b-fc6d-1ae3-f151-9341c87d681b", corner2: "3aca5358-8526-a4b7-2aed-e3bd57ae8724", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "3aca5358-8526-a4b7-2aed-e3bd57ae8724", corner2: "3f3a054f-86ca-5777-bc1f-634c61309b7a", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "3f3a054f-86ca-5777-bc1f-634c61309b7a", corner2: "7eb15f94-5a15-e1a5-c00f-3dd79cf15662", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "7eb15f94-5a15-e1a5-c00f-3dd79cf15662", corner2: "51cc4904-8d21-8e84-8850-26f7fe545372", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "51cc4904-8d21-8e84-8850-26f7fe545372", corner2: "83f31704-6879-04f0-22ac-6c023109bbd2", type: 0, thickness: 20, backgroundType: 0},
			{corner1: "83f31704-6879-04f0-22ac-6c023109bbd2", corner2: "7edf8626-b501-e885-c421-992f072c50b1", type: 0, thickness: 20, backgroundType: 0}
		]
	}
}




