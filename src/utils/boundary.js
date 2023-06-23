/**
 * 墨卡托坐标转百度坐标
 * @param {} coordinate
 * @return {}
 */
export function coordinateToPoints (map, coordinate) {
    const points = [];
    if (coordinate) {
        const arr = coordinate.split(";");
        if(arr){
            for(var i = 0; i < arr.length; i++){
                var coord = arr[i].split(",");
                if(coord && coord.length === 2){
                    var mctXY = new BMap.Pixel(coord[0], coord[1]);
                    var project = map.getMapType().getProjection();
                    var point = project.pointToLngLat(mctXY);
                    points.push(new BMap.Point(point.lng, point.lat));
                }
            }
        }
    }
    return points;
};
/**
 * 墨卡托坐标解析
 * @param {} mocator
 * @return {}
 */
export function parseGeo (mocator){
    if(typeof mocator != 'string'){
        return {};
    }
    var t = mocator.split("|");
    var n = parseInt(t[0]);
    var i = t[1];
    var r = t[2];
    var o = r.split(";");
    if(n === 4){
        for (var a = [], s = 0; s < o.length - 1; s++){
            "1" === o[s].split("-")[0] && a.push(o[s].split("-")[1]);
        }
        o = a;
        o.push("");
    }
    var u = [];
    switch(n){
        case 1:
            u.push(o[0]);
            break;
        case 2:
        case 3:
        case 4:
            for (var s = 0; s < o.length - 1; s++) {
                var l = o[s];
                if (l.length > 100){
                    l = l.replace(/(-?[1-9]\d*\.\d*|-?0\.\d*[1-9]\d*|-?0?\.0+|0|-?[1-9]\d*),(-?[1-9]\d*\.\d*|-?0\.\d*[1-9]\d*|-?0?\.0+|0|-?[1-9]\d*)(,)/g,
                        "$1,$2;");
                    u.push(l);
                } else {
                    for (var c = [], d = l.split(","), f = 0; f < d.length; f += 2) {
                        var p = d[f];
                        var h = d[f + 1];
                        c.push(p + "," + h);
                    }
                    u.push(c.join(";"))
                }
            }
            break;
        default:
            break;
    }

    if(u.length <= 1){
        u = u.toString();
    }
    var result = {
        type : n,
        bound : i,
        points : u
    };
    return result;
};