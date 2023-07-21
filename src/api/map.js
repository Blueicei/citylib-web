

import request from '@/utils/request'

// 获取全部卡口点信息
export function getAllCamInfo() {
  return request({
    url: '/camTra/getAllCamInfo',
    method: 'post'
  })
}

// 轨迹查询
export function searchCarTrajectory(data){
  return request({
    url: '/camTra/searchCarTrajectory',
    method: 'post',
    data: data,
  })
}

// 车辆次数统计包含以下两个方法
export function vehicleCamStats(data){
  return request({
    url: '/camTra/vehicleCamStats',
    method: 'post',
    data: data,
  })
}

export function listByCarNumberOrderInTimeRange(data){
  return request({
    url: '/camTra/listByCarNumberOrderInTimeRange',
    method: 'post',
    data: data,
  })
}

//车辆出现统计
export function vehicleAppearanceByCarStats(data){
  return request({
    url: '/camTra/vehicleAppearanceByCarStats',
    method: 'post',
    data: data,
  })
}

//城市流量分析
export function cityFlowStats(data){
  return request({
    url: '/camTra/cityFlowStats',
    method: 'post',
    data: data,
  })
}

export function foreignVehiclesStats(data){
  return request({
    url:'/camTra/foreignVehiclesStats',
    method: 'post',
    data: data,
  })
}

export function camCountByCar(data){
  return request({
    url: '/camTra/camCountByCar',
    method: 'post',
    data: data,
  })
}

export function compareVehiclesStats(data){
  return request({
    url: '/camTra/compareVehiclesStats',
    method: 'post',
    data: data,
  })
}

//获取全局信息
export function listAllInfo(){
  return request({
    url: '/camTra/listAllInfo',
    method: 'post',
  })
}
// 获得全部车牌号
export function getAllCarNumber(){
  return request({
    url: '/camTra/getAllCarNumber',
    method: 'post',
  })
}

// 获得全部车牌号和全部类型()
export function listAllCarNumberAndCarTypeByCount(){
  return request({
    url: '/camTra/listAllCarNumberAndCarTypeByCount',
    method: 'post',
  })
}

//获得热力图信息
export function getHeatMapData(data){
  return request({
    url:'/camTra/getHotMapInfoByTime',
    method: 'post',
    data: data,
  })
}

export function getLocalHeatMapData(data){
  return request({
    url:'/camTra/getLocalHotMapInfoByTime',
    method: 'post',
    data: data,
  })
}

export function getForeignHeatMapData(data){
  return request({
    url:'/camTra/getForeignHotMapInfoByTime',
    method: 'post',
    data: data,
  })
}

export function getHeatMapDataList(data){
  return request({
    url:'/camTra/getHotMapByCutTime',
    method: 'post',
    data: data,
  })
}

export function getLocalHeatMapDataList(data){
  return request({
    url:'/camTra/getLocalHotMapByCutTime',
    method: 'post',
    data: data,
  })
}

export function getForeignHeatMapDataList(data){
  return request({
    url:'/camTra/getHotMapByCutTime',
    method: 'post',
    data: data,
  })
}

export function getAllFlowStats(){
  return request({
    url:'/camTra/getAllFlowStats',
    method: 'post',
  })
}




export function getHeatMapByCar(data){
  return request({
    url:'/camTra/getHeatMapByCarNumber',
    method: 'post',
    data: data,
  })
}

export function POISearch(data){
  return request({
    url:'/camTra/POISearch?carNumber='+data,
    method: 'post',
  })
}

export function gridFlowCount(data){
  return request({
    url: '/camTra/gridFlowCount',
    method: 'post',
    data: data,
  })
}

//method


//method
