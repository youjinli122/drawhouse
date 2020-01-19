//撤销重做函数
function UndoAndRedo() {

    let scope = this;//范围

    let undoStack = [];//撤销的栈 点击撤销时把 撤销掉的数据 放进重做

    let redoStack = [];//重做的栈 点击重做时把 重做里的数据放进撤销

    let undoNum   = 15;//撤销的步数 15

    this.enabled  = true;//工具的启用和禁用

    this.Commands = {};//命令集合

    this.addCommand = function (obj) {
        undoStack.push(obj);//添加命令
        if (undoStack.length > undoNum) {//撤退次数大于准许撤退步数，则从撤销的栈中删除第一个数据
            undoStack.splice(0, 1);
        }
        redoStack.splice(0, redoStack.length);//每次添加时清空重做数组，每当撤销时，撤销的数据添加到重做数组
        // console.log(undoStack,"撤销里的数剧有多少")

    }
    this.executeCommand = function (cfg) {//执行命令

        scope.Commands[cfg.class][cfg.cmd].execute(cfg.data);//执行

        scope.addCommand(cfg);//添加
    }
    this.undo = function () {//撤销

        if (!scope.enabled) return;//启动状态下才执行撤销

        if (undoStack.length <= 0) return;

        let cfg = undoStack.pop();//删除最后一个，且获得最后一位的值
 
        scope.Commands[cfg.class][cfg.cmd].undo(cfg.data);//撤销命令

        redoStack.push(cfg);//添加命令
        // console.log(redoStack,"重做里的数剧")
    }

    this.redo = function () {//重做

        if (!scope.enabled) return;//启动状态下才执行重做

        if (redoStack.length <= 0) return;

        let cfg = redoStack.pop();//删除最后一个，且获得最后一位的值

        scope.Commands[cfg.class][cfg.cmd].execute(cfg.data);//重做命令

        undoStack.push(cfg);//添加命令

    }
    this.getStack = function(){
    	return redoStack;
    }
    this.getUndo = function(){
        return undoStack;
    }

}
var G_undoRedo = new UndoAndRedo();
