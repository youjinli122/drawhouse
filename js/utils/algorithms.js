const $agr = {

    /**
     * 浮点精确计算-------------------------------------------------------------------------------------------------------
     */

    num: {
        accAdd(num1, num2) {
            num1 = Number(num1);
            num2 = Number(num2);
            let dec1, dec2, times;
            let Num = $agr.num;
            try { dec1 = Num.countDecimals(num1) + 1; } catch (e) { dec1 = 0; }
            try { dec2 = Num.countDecimals(num2) + 1; } catch (e) { dec2 = 0; }
            times = Math.pow(10, Math.max(dec1, dec2));
            // let result = (num1 * times + num2 * times) / times;
            let result = (Num.accMul(num1, times) + Num.accMul(num2, times)) / times;
            return Num.getCorrectResult("add", num1, num2, result);
            // return result;
        },

        accSub(num1, num2) {
            num1 = Number(num1);
            num2 = Number(num2);
            let dec1, dec2, times;
            let Num = $agr.num;
            try { dec1 = Num.countDecimals(num1) + 1; } catch (e) { dec1 = 0; }
            try { dec2 = Num.countDecimals(num2) + 1; } catch (e) { dec2 = 0; }
            times = Math.pow(10, Math.max(dec1, dec2));
            // let result = Number(((num1 * times - num2 * times) / times);
            let result = Number((Num.accMul(num1, times) - Num.accMul(num2, times)) / times);
            return Num.getCorrectResult("sub", num1, num2, result);
            // return result;
        },

        accDiv(num1, num2) {
            num1 = Number(num1);
            num2 = Number(num2);
            let t1 = 0, t2 = 0, dec1, dec2;
            let Num = $agr.num;
            try { t1 = Num.countDecimals(num1); } catch (e) { }
            try { t2 = Num.countDecimals(num2); } catch (e) { }
            dec1 = Num.convertToInt(num1);
            dec2 = Num.convertToInt(num2);
            let result = Num.accMul((dec1 / dec2), Math.pow(10, t2 - t1));
            return Num.getCorrectResult("div", num1, num2, result);
            // return result;
        },

        accMul(num1, num2) {
            num1 = Number(num1);
            num2 = Number(num2);
            let Num = $agr.num;
            let times = 0, s1 = num1.toString(), s2 = num2.toString();
            try { times += Num.countDecimals(s1); } catch (e) { }
            try { times += Num.countDecimals(s2); } catch (e) { }
            let result = Num.convertToInt(s1) * Num.convertToInt(s2) / Math.pow(10, times);
            return Num.getCorrectResult("mul", num1, num2, result);
            // return result;
        },

        countDecimals(num) {
            let len = 0;
            try {
                num = Number(num);
                let str = num.toString().toUpperCase();
                if (str.split('E').length === 2) { // scientific notation
                    let isDecimal = false;
                    if (str.split('.').length === 2) {
                        str = str.split('.')[1];
                        if (parseInt(str.split('E')[0]) !== 0) {
                            isDecimal = true;
                        }
                    }
                    let x = str.split('E');
                    if (isDecimal) {
                        len = x[0].length;
                    }
                    len -= parseInt(x[1]);
                } else if (str.split('.').length === 2) { // decimal
                    if (parseInt(str.split('.')[1]) !== 0) {
                        len = str.split('.')[1].length;
                    }
                }
            } catch (e) {
                throw e;
            } finally {
                if (isNaN(len) || len < 0) {
                    len = 0;
                }
                return len;
            }
        },

        convertToInt(num) {
            num = Number(num);
            let newNum = num;
            let times = $agr.num.countDecimals(num);
            let temp_num = num.toString().toUpperCase();
            if (temp_num.split('E').length === 2) {
                newNum = Math.round(num * Math.pow(10, times));
            } else {
                newNum = Number(temp_num.replace(".", ""));
            }
            return newNum;
        },

        getCorrectResult(type, num1, num2, result) {
            let temp_result = 0;
            switch (type) {
                case "add":
                    temp_result = num1 + num2;
                    break;
                case "sub":
                    temp_result = num1 - num2;
                    break;
                case "div":
                    temp_result = num1 / num2;
                    break;
                case "mul":
                    temp_result = num1 * num2;
                    break;
            }
            if (Math.abs(result - temp_result) > 1) {
                return temp_result;
            }
            return result;
        },

        // 判断两个浮点值是否相等
        is_equal(val1, val2, epsilon){
            let diff   = val1 - val2;
            let bequal = ((-epsilon <= diff) && (diff <= epsilon));
            return bequal;
        }
    },


    /**
     * 点----------------------------------------------------------------------------------------------------------------
     */

    point: {

        /** 判断点的坐标是否相同
         * @param { x: num, y: num } a 线段端点坐标 
         * @param { x: num, y: num } b 线段端点坐标
         * @returns bool true为真，false为假 
         */
        isEqual(a, b) {
            return a.x == b.x && a.y == b.y;
        },
        // 判断一个点是否在一个线段上
        is_In_Segremt_with_delta(x1, y1, x2, y2, x3, y3, delta) {
            if ($agr.point.collinear(x1, y1, x2, y2, x3, y3)) {
                if (($agr.num.is_equal(x1, x3, delta) && $agr.num.is_equal(y1, y3, delta)) || ($agr.num.is_equal(x2, x3, delta) && $agr.num.is_equal(y2, y3, delta))) {
                    return 2;
                } else {
                    let nx  = 0.0;
                    let ny  = 0.0;
                    let nxy = $agr.L_segm.normalize(x3, y3, x1, y1);
                    nx = nxy.x;
                    ny = nxy.y;

                    let nx1  = 0.0;
                    let ny1  = 0.0;
                    let nxy1 = $agr.L_segm.normalize(x3, y3, x2, y2);
                    nx1      = nxy1.x;
                    ny1      = nxy1.y;
                    if (($agr.num.is_equal(nx + nx1, 0.0, 0.01)) && ($agr.num.is_equal(ny + ny1, 0.0, 0.01))) return 1;
                }
            }
            return 0;
        },
        /** 
         *  判断一个点是否在线段内
         *  @param { x: num, y: num } p  测试点坐标 
         *  @param { x: num, y: num } a 线段端点坐标 
         *  @param { x: num, y: num } b 线段端点坐标  
         *  @returns bool true为真，false为假 
         */
        inSegm(p, a, b) {//pointInSegment

            if ((p.x - a.x) * (b.y - a.y) == (b.x - a.x) * (p.y - a.y)  //叉乘 
                //保证p点坐标在a,b之间 
                && Math.min(a.x, b.x) <= p.x && p.x <= Math.max(a.x, b.x)
                && Math.min(a.y, b.y) <= p.y && p.y <= Math.max(a.y, b.y))
                return true;
            return false;
            
            // let maxx,minx,maxy,miny;
               
            // maxx = p1.x >p2.x ?p1.x :p2.x ;    //矩形的右边长
            // minx = p1.x >p2.x ?p2.x :p1.x ;     //矩形的左边长
            // maxy = p1.y >p2.y ?p1.y :p2.y ;    //矩形的上边长
            // miny = p1.y >p2.y ?p2.y :p1.y ;     //矩形的下边长
            // if( ((q.x -p1.x )*(p2.y -p1.y) == (p2.x -p1.x) *(q.y -p1.y)) && ( q.x >= minx && q.x <= maxx ) && ( q.y >= miny && q.y <= maxy))
            // return true;
            // return false;
        },

        /** 
         *  判断一个点是否在直线内
         *  @param { x: num, y: num } p 测试点坐标 
         *  @param { x: num, y: num } a 线段端点坐标 
         *  @param { x: num, y: num } b 线段端点坐标  
         *  @returns bool true为真，false为假 
         */
        inStra(p, a, b) {//pointStraightLine
            return Math.abs((p.x - a.x) * (b.y - a.y) - (b.x - a.x) * (p.y - a.y)) < 0.000001
        },

        /** 
         *  判断一个点是否在圆的内部 
         *  @param { x: num, y: num } p  测试点坐标 
         *  @param { x: num, y: num } c 圆心坐标 
         *  @param num r 圆半径 
         *  @returns bool true为真，false为假 
         */
        inCirc(p, c, r) {//pointInsideCircle
            if (r === 0) return false;
            let dx = c.x - p.x;
            let dy = c.y - p.y;
            return dx * dx + dy * dy <= r * r;
        },

        /** 
         *  判断一个点是否在多边形内部 
         *  @param { x: num, y: num } p 测试点坐标 
         *  @param {obj} ps 多边形坐标集合 
         *  @returns bool true为真，false为假 
         */
        inPoly(p, ps) {//insidePolygon  
            let x = p.x, y = p.y;
            let inside = false;
            for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) {
                let xi = ps[i].x, yi = ps[i].y;
                let xj = ps[j].x, yj = ps[j].y;

                let intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        },
        //判断点到线段的最短距离，和交点坐标
        PointToLineDistance (xx, yy, x1, y1, x2, y2) {  
            xx = Number(xx.toFixed(3));
            yy = Number(yy.toFixed(3));
            x1 = Number(x1.toFixed(3));
            y1 = Number(y1.toFixed(3));
            x2 = Number(x2.toFixed(3));
            y2 = Number(y2.toFixed(3));
            let ang1, ang2, ang, m;          
            let result = 0;          
            // 分别计算三条边的长度
            const a = Math.sqrt((x1 - xx) * (x1 - xx) + (y1 - yy) * (y1 - yy));
                              
            if (a === 0) {
                return [0, { x: x1, y: y1 }];
            }
            
            const b = Math.sqrt((x2 - xx) * (x2 - xx) + (y2 - yy) * (y2 - yy));
            
            if (b === 0) {     
                return [0, { x: x2,y: y2 }];
            }
            
            const c = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            
            // 如果线段是一个点则退出函数并返回距离
            if (c === 0) {
                result = a; 
                return [result, { x: x1, y: y1 }];
            }
            
            // 如果点(xx,yy到点x1,y1)这条边短
            
            if (a < b) {     
                // 如果直线段AB是水平线。得到直线段AB的弧度
                if (y1 === y2) { 
                    if (x1 < x2) {
                        ang1 = 0;
                    } else {       
                    ang1 = Math.PI;        
                    }
                } else {
            
                    m = (x2 - x1) / c;
                
                    if (m - 1 > 0.00001) {
                        m = 1;
                    }
                
                    ang1 = Math.acos(m);
                
                    if (y1 > y2) {      
                        ang1 = Math.PI * 2 - ang1;
                    }// 直线(x1,y1)-(x2,y2)与折X轴正向夹角的弧度          
                }
            
                m = (xx - x1) / a;
            
                if (m - 1 > 0.00001) {    
                    m = 1;     
                }
            
                ang2 = Math.acos(m);
                
                if (y1 > yy) {
                
                    ang2 = Math.PI * 2 - ang2;
                
                }// 直线(x1,y1)-(xx,yy)与折X轴正向夹角的弧度

                ang = ang2 - ang1;
                
                if (ang < 0) {
                    ang = -ang;
                }

                if (ang > Math.PI) {
                    ang = Math.PI * 2 - ang;       
                }          
                // 如果是钝角则直接返回距离
                if (ang > Math.PI / 2) {     
                    return [a, { x: x1,y: y1 }];
                }

                // 返回距离并且求得当前距离所在线段的坐标
            
                if (x1 === x2) {        
                    return [b * Math.sin(ang), { x: x1,y: yy }];           
                } else if (y1 === y2) {
                    return [b * Math.sin(ang), { x: xx,y: y1 }];  
                }   
                // 直线的斜率存在且不为0的情况下
                let x = 0, 
                y = 0;    
                const k1 = ((y2 - y1) / x2 - x1); 
                const kk = -1 / k1;          
                const bb = yy - xx * kk;          
                const b1 = y2 - x2 * k1;
                x = (b1 - bb) / (kk - k1);     
                y = kk * x + bb;
                return [a * Math.sin(ang), { x, y }]; 
            }
  
            // 如果两个点的纵坐标相同，则直接得到直线斜率的弧度
            if (y1 === y2) {
            
                if (x1 < x2) {
                    ang1 = Math.PI;
                } else {
                    ang1 = 0;    
                }
            } else {   
                m = (x1 - x2) / c;          
                if (m - 1 > 0.00001) {
                    m = 1;
                }
                ang1 = Math.acos(m);
                if (y2 > y1) {
                    ang1 = Math.PI * 2 - ang1;
                }
            }       
            m = (xx - x2) / b;  
            if (m - 1 > 0.00001) {  
                m = 1;
            }
            
            ang2 = Math.acos(m);// 直线(x2-x1)-(xx,yy)斜率的弧度
            
            if (y2 > yy) {
                ang2 = Math.PI * 2 - ang2;
            }    
            ang = ang2 - ang1;
            if (ang < 0) {
                ang = -ang;
            }
            if (ang > Math.PI) {      
                ang = Math.PI * 2 - ang;
            }
            // 交角的大小
            // 如果是对角则直接返回距离
            if (ang > Math.PI / 2) { return [b, { x: x2,y: y2 }];}        
            // 如果是锐角，返回计算得到的距离,并计算出相应的坐标
            if (x1 === x2) {
                return [b * Math.sin(ang), { x: x1,y: yy }];
            } else if (y1 === y2) {
                return [b * Math.sin(ang), { x: xx,y: y1 }];
            }
            
            // 直线的斜率存在且不为0的情况下
            let x = 0,   
            y = 0;             
            const k1 = ((y2 - y1) / x2 - x1);          
            const kk = -1 / k1;            
            const bb = yy - xx * kk;      
            const b1 = y2 - x2 * k1;
            x = (b1 - bb) / (kk - k1);
            y = kk * x + bb;
            return [b * Math.sin(ang), { x, y }];
        },


        /** 
         *  已知点p,直线两点坐标a、b,求点p到直线ab的垂直交点
         *  @param { x: num, y: num } p P坐标 
         *  @param { x: num, y: num } a 直线上坐标 a
         *  @param { x: num, y: num } b 直线上坐标 b
         *  @returns { x: num, y: num } 交点坐标
         */
        vertiP(p, a, b) {//Vertical point
            let se = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);//线段两点距离平方
            let pp = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)); //向量点乘=|a|*|b|*cosA
            let r = pp / se; //r即点到线段的投影长度与线段长度比
            let outx = a.x + r * (b.x - a.x);
            let outy = a.y + r * (b.y - a.y);
            return { x: outx, y: outy };
        },
        /** 
         *  已知点p,线段的端点坐标a、b,求点p到线段ab的距离
         *  @param { x: num, y: num } p P坐标 
         *  @param { x: num, y: num } a 线段上坐标 a
         *  @param { x: num, y: num } b 线段上坐标 b
         *  @returns num 点到线段距离 
         */
        segm_d(p, a, b) {
            let dis = 0;
            let ab, pa, pb;
            ab = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));// 线段的长度
            pa = Math.sqrt(Math.pow(p.x - a.x, 2) + Math.pow(p.y - a.y, 2)); // point1到点的距离
            pb = Math.sqrt(Math.pow(p.x - b.x, 2) + Math.pow(p.y - b.y, 2));//point2到点的距离
            if (pb + pa == ab) {// 点在线段上
                dis = 0;
                return dis;
            }
            if (pb * pb >= ab * ab + pa * pa) { // 组成直角三角形或钝角三角形，投影在point1延长线上，
                dis = pa;
                return dis;
            }
            if (pa * pa >= ab * ab + pb * pb) {// 组成直角三角形或钝角三角形，投影在point2延长线上，
                dis = pb;
                return dis;
            }
            // 组成锐角三角形，则求三角形的高
            let pp = (ab + pa + pb) / 2;// 半周长
            let s = Math.sqrt(pp * (pp - ab) * (pp - pa) * (pp - pb));// 海伦公式求面积
            dis = 2 * s / ab;// 返回点到线的距离（利用三角形面积公式求高）
            return dis;
        },

        /** 
         *  已知点p,直线的端点坐标a、b,求点p到直线ab的距离
         *  @param { x: num, y: num } p P坐标 
         *  @param { x: num, y: num } a 直线上坐标 a
         *  @param { x: num, y: num } b 直线上坐标 b
         *  @returns num 点到直线距离 
         */
        stra_d(p, a, b) {
            return $agr.L_segm.dist($agr.point.vertiP(p, a, b), p);
        },

        /**
         * 已知点p,旋转点o 和 旋转角度a,求旋转后p点的位置
         * @param {x: num, y: num} P 坐标
         * @param {x: num, y: num} O 坐标
         * @param num aor 角度 或者 弧度
         * @param String 类型 angle 或者 rad 
         * @returns {x: num, y: num} 旋转后的坐标点
         */
         //Angle为正时逆时针转动, 单位为弧度Rotate({X : 0,Y : 4},-Math.PI / 4)
        rotate2(Source,Angle){
            var A,R;
            A = Math.atan2(Source.y,Source.x)//atan2自带坐标系识别, 注意X,Y的顺序
            A += Angle//旋转
            R = Math.sqrt(Source.x * Source.x + Source.y * Source.y)//半径

            return {
                x : Math.cos(A) * R,
                y : Math.sin(A) * R
            }
        },
        rotate(p, o, aor,t) {
            let aors = aor || 0;
            let rot = (t == 'angle') ? Math.PI / 180 * aors : aors;
            return {
                x: (p.x - o.x) * Math.cos(rot) - (p.y - o.y) * Math.sin(rot) + o.x,
                y: (p.y - o.y) * Math.cos(rot) + (p.x - o.x) * Math.sin(rot) + o.y
            };
        },
        //已知点a，xy坐标、长度、旋转角度，求旋转后的b点坐标
        rotate3(x,y,length,aor){
            let bx = x+length;
            let by = y;
            let ax = (x-bx)*Math.cos(aor) + (by-by)*Math.sin(aor) + bx;
            let ay = (x-bx)*Math.cos(aor) - (by-by)*Math.sin(aor) + by;
            return {'x':ax,'y':ay};
        },
        rotate_vectors(vector,angle){
            angle = Math.PI* angle / 180;
            let x = vector.x * Math.cos(angle) - vector.y*Math.sin(angle);
            let y = vector.x * Math.sin(angle) + vector.y*Math.cos(angle);
            return {'x':x,'y':y};
        },
        /**
         * 已知点p,和直线ab上的坐标a,b ,判断p点再直线ab的那一侧 
         * @param {*} p 
         * @param {*} a 
         * @param {*} b 
         * @returns [Tmp > 0 在左侧  Tmp = 0 在线上 Tmp < 0 在右侧 ]
         */
        onSide(p, a, b) {
            return (a.y - b.y) * p.x + (b.x - a.x) * p.y + a.x * b.y - b.x * a.y;
        },

        // 判断三点是否在一条线上
	    collinear(x1, y1, x2, y2, px, py) {
            let pt   =  $agr.point.closest_point_on_line(x1,y1,x2,y2,px,py,true);	
            let orin = (x2 - x1) * (pt.m_y - y1) - (pt.m_x - x1) * (y2 - y1);
            if ($agr.num.is_equal(orin, 0.0, 0.01)) 
            {
                let dis = $agr.L_segm.dist({'x': px, 'y': py}, {'x':pt.m_x, 'y': pt.m_y}); 
                if(dis <= 1.0)
                {
                    return true;
                }
            }
            return false;
        },
        closest_point_on_line(linestartx, linestarty, lineendx, lineendy, pointx, pointy, bSegment) {
            let nRet = 1;
            let vx = lineendx - linestartx;
            let vy = lineendy - linestarty;
            let wx = pointx - linestartx;
            let wy = pointy - linestarty;
    
            let c1 = vx * wx + vy * wy;
            let pt = {};
            if (c1 <= 0) {
                nRet = 0;
                if (bSegment) {
                    pt.m_x = linestartx;
                    pt.m_y = linestarty;
                    return pt;
                }
            }
    
            let c2 = vx * vx + vy * vy;
    
            if (c2 <= c1) {
                nRet = 2;
                if (bSegment) {
                    pt.m_x = lineendx;
                    pt.m_y = lineendy;
                    return pt;
                }
            }
    
            let ratio = c1 / c2;
            pt.m_x = linestartx + ratio * vx;
            pt.m_y = linestarty + ratio * vy;
            return pt;
        }

    },


    /**
     * 直线--------------------------------------------------------------------------------------------------------------
     */

    L_stra: {
        /**
         * 已知直线l1上的两点坐标a,b 和 直线l2上的两点坐标c,d 返回交点坐标
         * @param { x: num, y: num } a 
         * @param { x: num, y: num } b 
         * @param { x: num, y: num } c 
         * @param { x: num, y: num } d 
         * @returns { x: num, y: num }
         */
        interP(a, b, c, d) {//straight-line Intersection

            function accSub(arg1, arg2) {
                let r1, r2, m, n;
                try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
                try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
                m = Math.pow(10, Math.max(r1, r2));
                //last modify by deeka
                //动态控制精度长度
                n = (r1 >= r2) ? r1 : r2;
                return ((arg1 * m - arg2 * m) / m).toFixed(n);
            }
            let denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
            //let denominator = accSub((b.y - a.y) * (d.x - c.x), (a.x - b.x) * (c.y - d.y));

            if ((denominator * 1).toFixed(5) == 0) {
                if ((a.x == c.x && a.y == c.y) || (a.x == d.x && a.y == d.y)) return a;
                if ((b.x == c.x && b.y == c.y) || (b.x == d.x && b.y == d.y)) return b;
                //重合或平行
                return false;
            }

            let x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y)
                + (b.y - a.y) * (d.x - c.x) * a.x
                - (d.y - c.y) * (b.x - a.x) * c.x) / denominator;
            let y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x)
                + (b.x - a.x) * (d.y - c.y) * a.y
                - (d.x - c.x) * (b.y - a.y) * c.y) / denominator;

            return { x: x, y: y };
        },
        intersection_point_double(friststartx, friststarty,  fristendx, fristendy,secondstartx, secondstarty, secondendx, secondendy) {
            let newpt = {};
            let dx1 = fristendx - friststartx;
            let dx2 = secondendx - secondstartx;
            let dx3 = friststartx - secondstartx;
    
            let dy1 = fristendy - friststarty;
            let dy2 = friststarty - secondstarty;
            let dy3 = secondendy - secondstarty;
    
            let ratio = dx1 * dy3 - dy1 * dx2;
    
            // 若d!=0，则直线AB与CD有交点，设交点为E(x0,y0);若d=0，则直线AB与CD平行或重合，
            if (ratio != 0.0) 
            {
                ratio = (dy2 * dx2 - dx3 * dy3) / ratio;
                newpt.m_x = (friststartx + ratio * dx1);
                newpt.m_y = (friststarty + ratio * dy1);
                return newpt;
            }
            return false;
        },

        /**
         * 已知直线l1上的两点坐标a,b 和 直线l2上的两点坐标c,d 判断两直线是否重叠
         * @param { x: num, y: num } a 
         * @param { x: num, y: num } b 
         * @param { x: num, y: num } c 
         * @param { x: num, y: num } d 
         * @returns boolean true false
         */
        overlap(a, b, c, d) {//straight-lineOverlapping
            //斜率不存在（平行Y轴），单独考虑
            if (a.x - b.x == 0 && c.x - d.x == 0) {//都不存在斜率
                if (a.x == c.x) {//两直线X轴相等
                    return true;//则重合
                } else {//两直线X轴不等
                    return false;//不重合
                };
            } else if (a.x - b.x == 0 || c.x - d.x == 0) {//仅一个不存在斜率时
                return false;//不重合
            };
            let k1 = (b.y - a.y) / (b.x - a.x);
            let bb1 = b.y - k1 * b.x;

            let k2 = (d.y - c.y) / (d.x - c.x);
            let bb2 = d.y - k2 * d.x;

            if (k1 == k2 && bb1 == bb2) return true;//如果斜率相等，且截距也相等 则重合

            return false//不重合
        },

    },


    /**
     * 射线--------------------------------------------------------------------------------------------------------------
     */

    L_half: {
        //求线段和射线的交点 求线段和射线的交点 1.射线 2.方向 3.线段 4.定义的交点
        intersection_ray_segment_double_point(rayx, rayy, rayvectorx, rayvectory, segbeginx, segbeginy,  segendx,  segendy){
            let intersectpoint = {}; // 交点
            let raybeginpoint  = {}; // 射线的起点
            let rayendpoint = {}; // 射线的临时终点

            raybeginpoint.m_x = rayx;
            raybeginpoint.m_y = rayy;

            rayendpoint.m_x = rayx + 1.0 * rayvectorx;
            rayendpoint.m_y = rayy + 1.0 * rayvectory;

            intersectpoint =  $agr.L_stra.intersection_point_double(raybeginpoint.m_x, raybeginpoint.m_y, rayendpoint.m_x, rayendpoint.m_y, segbeginx,segbeginy, segendx, segendy);

            let vectortempx = intersectpoint.m_x - raybeginpoint.m_x;
            let vectortempy = intersectpoint.m_y - raybeginpoint.m_y;
        
            let v1 = {'x': intersectpoint.m_x, 'y': intersectpoint.m_y};
            let v2 = {'x': raybeginpoint.m_x, 'y': raybeginpoint.m_y};
            let len = $agr.L_segm.dist(v1, v2);

            len = 1 / len;
            vectortempx *= len;
            vectortempy *= len;

            if ($agr.num.is_equal(vectortempx, rayvectorx, 0.1) && $agr.num.is_equal(vectortempy, rayvectory, 0.1)) {
                if ($agr.point.is_In_Segremt_with_delta(segbeginx, segbeginy, segendx, segendy, intersectpoint.m_x,intersectpoint.m_y,0.1) != 0) {
                    return intersectpoint;
                }
            }
            return false;
        },
        /**
         * 已知直线上两点坐标 a、b，和指定长度 length，求a→b方向上指定长度点的坐标
         * @param {x: num, y: num} a 
         * @param {x: num, y: num} b 
         * @param num length 
         * @returns { x: num, y: num }
         */
        distP(a, b, length) {//getSpecifiedLengthPoint
            let x, y;
            let rot = Math.atan2(b.y - a.y, b.x - a.x);//通过2个点的点位求出夹角弧度值
            let z_dis = Math.sin(rot) * (length);
            let x_dis = Math.cos(rot) * (length);
            x = a.x + x_dis;
            y = a.y + z_dis;

            return { x: x, y: y };
        },
        /**
         * 已知坐标p，直线上两点坐标 a、b，和指定长度 length，求p点向a→b方向上指定长度点的坐标
         * @param {x: num, y: num} a 
         * @param {x: num, y: num} a 
         * @param {x: num, y: num} b 
         * @param num length 
         * @returns { x: num, y: num }
         */
        other_distP(p, a, b, length) {//getSpecifiedLengthPoint
            let x, y;
            let rot = Math.atan2(b.y - a.y, b.x - a.x);//通过2个点的点位求出夹角弧度值
            let y_dis = Math.sin(rot) * (length);
            let x_dis = Math.cos(rot) * (length);
            x = p.x + x_dis;
            y = p.y + y_dis;

            return { x: x, y: y };
        },
    },

    /**
     * 线段--------------------------------------------------------------------------------------------------------------
     */

    L_segm: {
        /**
         * 已知线段l1上的两点坐标a,b 和 线段l2上的两点坐标c,d 判断两直线是否重叠
         * @param { x: num, y: num } a 
         * @param { x: num, y: num } b 
         * @param { x: num, y: num } c 
         * @param { x: num, y: num } d 
         * @returns boolean true false
         */
        overlap(a, b, c, d) {//segmentsOverlapping
            if ($agr.L_stra.overlap(a, b, c, d)) {
                if ( ($agr.point.isEqual(a, c) && $agr.point.isEqual(b, d)) || ($agr.point.isEqual(b, c) && $agr.point.isEqual(a, d)) ) return true;
                if (!$agr.point.isEqual(c, a) && !$agr.point.isEqual(c, b) && $agr.point.inSegm(c, a, b)) return true;
                if (!$agr.point.isEqual(d, a) && !$agr.point.isEqual(d, b) && $agr.point.inSegm(d, a, b)) return true;
                if (!$agr.point.isEqual(a, c) && !$agr.point.isEqual(a, d) && $agr.point.inSegm(a, c, d)) return true;
                if (!$agr.point.isEqual(b, c) && !$agr.point.isEqual(b, d) && $agr.point.inSegm(b, c, d)) return true;
            }
            return false;
        },
        //向量
        normalize: function(x1,y1,x2,y2) {
            var len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                len = 1 / len;
            var x   = ((x1 - x2) * len);
            var y   = ((y1 - y2) * len);
            return {'x':x,'y':y};
        },
        //判断2条线是否平行
        isIntersect:function(line1, line2){
            // 转换成一般式: Ax+By = C
            var a1 = line1.endPoint.y - line1.startPoint.y;
            var b1 = line1.startPoint.x - line1.endPoint.x;
            var c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;
            
            //转换成一般式: Ax+By = C
            var a2 = line2.endPoint.y - line2.startPoint.y;
            var b2 = line2.startPoint.x - line2.endPoint.x;
            var c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;
            
            // 计算交点     
            var d = a1*b2 - a2*b1;
            // 当d==0时，两线平行
            if (d == 0)return true;
        },
        /*线段垂直交点
        */
        getDistance: function(vector,angle,offset){
            let sinθ = Math.sin(angle);//正弦
            let cosθ = Math.cos(angle);//余弦
            let o = { x: vector.x - sinθ * offset, y: vector.y + cosθ * offset };
            return o;
        },
        /**
         * 已知线段端点坐标a、b,求线段长度
         * @param {x: num, y: num} a 
         * @param {x: num, y: num} b 
         * @returns num
         */
        dist(a, b) {//segmentsDistance
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        },

        /**
         * 已知线段端点坐标a、b,求线段中心点坐标
         * @param {x: num, y: num} a 
         * @param {x: num, y: num} b 
         * @returns { x: num, y: num }
         */
        midP(a, b) {//segmentsCenter

            let rot = Math.atan2(b.x - a.x, b.y - a.y);//通过2个点的点位求出夹角弧度值

            let diagonal = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

            let x_dis = Math.sin(rot) * (diagonal / 2);//根据厚度推测出2点对应厚度的x距离 由于是求得内线点所以只取了厚度的一半
            let z_dis = Math.cos(rot) * (diagonal / 2);//根据厚度推测出2点对应厚度的z距离 由于是求得内线点所以只取了厚度的一半 

            return { x: b.x - x_dis, y: b.y - z_dis };
        },

        /**
         * 已知线段l1端点坐标a,b 和 线段l2端点坐标c,d 判断是否相交，如果相交返回交点坐标
         * @param { x: num, y: num } a 
         * @param { x: num, y: num } b 
         * @param { x: num, y: num } c 
         * @param { x: num, y: num } d 
         * @returns { x: num, y: num } 、 bool false 不想交 、str overlap 重叠
         */
        inter(a, b, c, d) { //segmentsInter

            //let Num = $agr.num;

            // 三角形abc 面积的2倍 
            let area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
            //let area_abc = Num.accSub((a.x - c.x) * (b.y - c.y), (a.y - c.y) * (b.x - c.x)).toFixed(5) * 1;

            // 三角形abd 面积的2倍 
            let area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
            //let area_abd = Num.accSub((a.x - d.x) * (b.y - d.y), (a.y - d.y) * (b.x - d.x)).toFixed(5) * 1;

            // 三角形cda 面积的2倍 
            let area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
            //let area_cda = Num.accSub((c.x - a.x) * (d.y - a.y), (c.y - a.y) * (d.x - a.x)).toFixed(5) * 1;
            // 三角形cdb 面积的2倍 
            let area_cdb = area_cda + area_abc - area_abd;
            //let area_cdb = Num.accSub(area_cda + area_abc, area_abd).toFixed(5) * 1;// 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出. 

            if (area_cda * area_cdb > 0) return false;//同向直接返回 false

            if (area_abc * area_abd > 0) return false;//同向直接返回 false

            if (area_cda == 0 && area_cdb == 0 && area_abc == 0 && area_abd == 0) return false;//该情况为覆盖

            if (area_cda == 0) return a;
            if (area_cdb == 0) return b;

            if (area_abc == 0) return c;
            if (area_abd == 0) return d;

            //计算交点坐标 
            let t = area_cda / (area_abd - area_abc);//面积比
            let dx = t * (b.x - a.x),
                dy = t * (b.y - a.y);
            return { x: a.x + dx, y: a.y + dy };

        },

        /**
         * 已知两线段ab、ac,交点为a,求夹角∠a(0~180)
         * @param { x: num, y: num} b 
         * @param { x: num, y: num} c 
         * @param { x: num, y: num} a 
         * @returns angle 夹角
         */
        angle(a, b, c) { //Angle of line segment
            let lengthAB = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)),
                lengthAC = Math.sqrt(Math.pow(a.x - c.x, 2) + Math.pow(a.y - c.y, 2)),
                lengthBC = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2));
            let cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) / (2 * lengthAB * lengthAC);
            cosA = Number(cosA.toFixed(5));

            return Math.round(Math.acos(cosA) * 180 / Math.PI);
        },

        /**
         * 已知两线段ab、ac,交点为a,求夹角∠a(0~360)
         * @param { x: num, y: num} b 
         * @param { x: num, y: num} c 
         * @param { x: num, y: num} a 
         * @returns angle 夹角
         */
        angle2(a, b, c) { //Angle of line segment
            let rad = Math.atan2(a.y - c.y, a.x - c.x) - Math.atan2(a.y - b.y, a.x - b.x);
            if (rad < 0) rad = rad + 2 * Math.PI;//当前弧度为负值时，加2Π，使其等于超过180°的弧度
            return rad * 180 / Math.PI;
        },

        /**
         * 已知两线段ab、ac,交点为a,求夹角∠a弧度
         * @param { x: num, y: num} b 
         * @param { x: num, y: num} c 
         * @param { x: num, y: num} a 
         * @returns angle 夹角
         */
        rad(a, b, c) {
            let rad = Math.atan2(a.y - c.y, a.x - c.x) - Math.atan2(a.y - b.y, a.x - b.x);
            if (rad < 0) rad = rad + 2 * Math.PI;//当前弧度为负值时，加2Π，使其等于超过180°的弧度
            return rad;
        },
        radian(v1,v2){
           return Math.atan2(v2.y - v1.y, v2.x - v1.x);
        },

        /**
         * 已知线段l两点a,b,求l与圆的位置关系（暂不考虑圆包含线情况）
         * @param {x:num,y:num} a 直线 a点坐标
         * @param {x:num,y:num} b 直线 b点坐标
         * @param {x:num,y:num} p 圆心 p点坐标
         * @param num r 圆的半径
         */
        circ(a, b, p, r) {

            if (r < $agr.point.segm_d(p, a, b)) {//相离
                return false;
            }

            if ((b.x - a.x).toFixed(5) == 0) {//垂直情况单独考虑

                let rr = r * r;//r^2
                let ax2 = Math.pow(a.x - p.x, 2);//(x-a)^2

                if (rr - ax2 < 0) {//相离
                    return false;
                }
                else if (rr - ax2 == 0) {//相切
                    return [{ x: a.x, y: p.y }];
                } else {//相交
                    let sqrt = Math.sqrt(r * r - Math.pow(a.x - p.x, 2));
                    return [{ x: a.x, y: p.y + sqrt }, { x: a.x, y: p.y - sqrt }];
                }
            }

            let k = (b.y - a.y) / (b.x - a.x);
            let _b = b.y - k * b.x;

            //直线一般式的各项系数
            let A = b.y - a.y;
            let B = a.x - b.x;
            let C = b.x * a.y - a.x * b.y;

            //圆心到直线距离
            let d = Math.abs(A * p.x + B * p.y + C) / Math.sqrt(A * A + B * B);

            //直线与圆联立的各项系数
            let A1 = 1 + k * k;  //x^2系数
            let B1 = 2 * k * (_b - p.y) - 2 * p.x;  //x系数
            let C1 = p.x * p.x + (_b - p.y) * (_b - p.y) - r * r;  //常数项

            if (d > r) {//相离
                return false;
            }
            else if (d == r) {//相切
                let x1 = (-B1 + Math.sqrt(Math.pow(B1, 2) - 4 * A1 * C1)) / (2 * A1);
                let y1 = k * x1 + _b;
                return [{ x: x1, y: y1 }];
            }
            else {  //相交
                x1 = (-B1 + Math.sqrt(Math.pow(B1, 2) - 4 * A1 * C1)) / (2 * A1);
                y1 = k * x1 + _b;
                x2 = (-B1 - Math.sqrt(Math.pow(B1, 2) - 4 * A1 * C1)) / (2 * A1);
                y2 = k * x2 + _b;
                return [{ x: x1, y: y1 }, { x: x2, y: y2 }]
            }

        }


    },

    /**
     * 多边形--------------------------------------------------------------------------------------------------------------
     */

    poly: {
        /**
         * 多边形求面积
         * @param [...] pointArray 
         * @returns num area;
         */
        Area(pointArray) {//computePolygonArea
            let pointNum = pointArray.length;// 查询点的个数
            if (pointNum < 3) {
                return 0.0;
            }
            let area = pointArray[0].y * (pointArray[pointNum - 1].x - pointArray[1].x);
            for (let i = 1; i < pointNum; ++i) {
                area += pointArray[i].y * (pointArray[i - 1].x - pointArray[(i + 1) % pointNum].x);
            }
            return Math.abs(area / 2.0);
        },

        /**
         * 多边形求中心点
         * @param [...] pointArray 
         * @returns { x: num, y: num} ceterPoint;
         */
        centerP(points) {//getPolygonAreaCenter
            let Area = function (p0, p1, p2) {
                let area = 0.0;
                area = p0.x * p1.y + p1.x * p2.y + p2.x * p0.y - p1.x * p0.y - p2.x * p1.y - p0.x * p2.y;
                return area / 2;
            };
            let sum_x = 0;
            let sum_y = 0;
            let sum_area = 0;
            let p0 = points[0];
            let p1 = points[1];
            for (let i = 2, len = points.length; i < len; i++) {
                p2 = points[i];
                area = Area(p0, p1, p2);
                sum_area += area;
                sum_x += (p0.x + p1.x + p2.x) * area;
                sum_y += (p0.y + p1.y + p2.y) * area;
                p1 = p2;
            }
            let xx = sum_x / sum_area / 3;
            let yy = sum_y / sum_area / 3;
            return { x: xx, y: yy }
        },

        /**
        * 多边形求缩放后的点位
        * @param [...] points 
        * @param num drift 偏移量
        * @returns [...] array;
        */
        scale(points, drift) {
            let array = [];
            for (let i = 0, len = points.length; i < len; i++) {
                let lasti = (i == 0) ? len - 1 : i - 1,
                    nexti = (i == len - 1) ? 0 : i + 1;
                array.push($agr.angle.biseP(points[i], points[lasti], points[nexti], drift));
            };
            return array;
        },

        /**
        * 多边形求缩放后的点位
        * @param [...] pointArray 
        * @param num offset 缩放值
        * @returns [...] arg ;
        */
        Zoom(pointArray, offset) { //顺时针排序，offset为正向内偏移，offset是墙厚增量为负反之

            let arg = [];
            for (var i = 0; i < pointArray.length; i++) {
                var current_p = new THREE.Vector2(pointArray[i].x, pointArray[i].y), a, b;
                if (i == 0) {
                    a = new THREE.Vector2(pointArray[pointArray.length - 1].x, pointArray[pointArray.length - 1].y).sub(current_p);
                    b = new THREE.Vector2(pointArray[i + 1].x, pointArray[i + 1].y).sub(current_p);
                } else if (i == pointArray.length - 1) {
                    a = new THREE.Vector2(pointArray[i - 1].x, pointArray[i - 1].y).sub(current_p);
                    b = new THREE.Vector2(pointArray[0].x, pointArray[0].y).sub(current_p);
                } else {
                    a = new THREE.Vector2(pointArray[i - 1].x, pointArray[i - 1].y).sub(current_p);
                    b = new THREE.Vector2(pointArray[i + 1].x, pointArray[i + 1].y).sub(current_p);
                }
                a.normalize();
                b.normalize();
                // console.log(a.angle(),b.angle());
                var director = new THREE.Vector2().addVectors(a, b).normalize();

                // arg.push(current_p.add(director.multiplyScalar(offset / Math.abs(Math.sin((a.angle() - b.angle()) / 2)))))//墙厚
                arg.push(current_p.add(director.multiplyScalar(offset)))

            }

            return arg;
        }
    },

    /**
     * 角--------------------------------------------------------------------------------------------------------------
     */

    angle: {
        /**
         * 一个角，它的平分线偏移指定距离，得到的点
         * @param { x: num, y: num} ceterPoint; p 公共端点
         * @param { x: num, y: num} ceterPoint; a 端点1
         * @param { x: num, y: num} ceterPoint; b 端点2
         * @param num d 平分线偏移距离 （±代表偏移方向）
         * @return { x: num, y: num} driftPoint;
         */
        biseP(p, a, b, d) {
            let dStartAngle = Math.atan2(a.y - p.y, a.x - p.x),
                dEndAngle = Math.atan2(b.y - p.y, b.x - p.x);

            let dWAngle = dEndAngle - dStartAngle;//外角角度
            if (dWAngle < 0) {
                dWAngle += 2 * Math.PI;
            } else if (dWAngle > (2 * Math.PI)) {
                dWAngle -= 2 * Math.PI;
            };
            //let dNAngle = 2 * Math.PI - dWAngle;//夹角  这个角度是比较小的

            // 这里算出来角度都是弧度单位的
            let θ = dWAngle / 2 + dStartAngle;
            ///外角平分线的点
            let panX = d * Math.cos(θ) + p.x,
                panY = d * Math.sin(θ) + p.y;

            ///夹角（内角）平分线的点
            return {
                x: 2 * p.x - panX,
                y: 2 * p.y - panY
            };

        },
    }

};

//解决toFixed丢失精度问题
// toFixed兼容方法
/* Number.prototype.toFixed = function(len){
    if(len>20 || len<0){
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    // .123转为0.123
    var number = Number(this);
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (len) == 'undefined' || len == 0) {
        return (Math.round(number)).toString();
    }
    var result = number.toString(),
        numberArr = result.split('.');
    if(numberArr.length<2){
        //整数的情况
        return padNum(result);
    }
    var intNum = numberArr[0], //整数部分
        deciNum = numberArr[1],//小数部分
        lastNum = deciNum.substr(len, 1);//最后一个数字
    
    if(deciNum.length == len){
        //需要截取的长度等于当前长度
        return result;
    }
    if(deciNum.length < len){
        //需要截取的长度大于当前长度 1.3.toFixed(2)
        return padNum(result)
    }
    //需要截取的长度小于当前长度，需要判断最后一位数字
    result = intNum + '.' + deciNum.substr(0, len);
    if(parseInt(lastNum, 10)>=5){
        //最后一位数字大于5，要进位
        var times = Math.pow(10, len); //需要放大的倍数
        var changedInt = Number(result.replace('.',''));//截取后转为整数
        changedInt++;//整数进位
        changedInt /= times;//整数转为小数，注：有可能还是整数
        result = padNum(changedInt+'');
    }
    return result;
    //对数字末尾加0
    function padNum(num){
        var dotPos = num.indexOf('.');
        if(dotPos === -1){
            //整数的情况
            num += '.';
            for(var i = 0;i<len;i++){
                num += '0';
            }
            return num;
        } else {
            //小数的情况
            var need = len - (num.length - dotPos - 1);
            for(var j = 0;j<need;j++){
                num += '0';
            }
            return num;
        }
    }
} */

// a = [1, 2, 3],b = [2, 4, 5];
// // 并集
// let union = a.concat(b.filter(v => !a.includes(v))) // [1,2,3,4,5]
// // 交集
// let intersection = a.filter(v => b.includes(v)) // [2]
// // 差集
// let difference = a.concat(b).filter(v => a.includes(v) && !b.includes(v)) // [1,3]

//console.log("\n%c%s%c%s%c%s%c%s%c%s%c%s%c%s\n", "background-color: #369;font-size: 12px;", " ", "background-color: #58a;font-size: 12px;", " ", "background-color: #7ac;font-size: 12px;", " ", "background-color: #9ce;color: #fff; font-weight: lighter;font-size: 12px;", "   Algorithms JS   ", "background-color: #7ac;font-size: 12px;", " ", "background-color: #58a;font-size: 12px;", " ", "background-color: #369;font-size: 12px;", " ")
