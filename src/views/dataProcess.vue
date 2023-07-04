<template>
    <el-container style="height: 100%">
        <el-aside width="15%">
            <el-tree :data="fileTree" :props="defaultProps" node-key="id" show-checkbox
                     @check-change="handleCheckChange"
                     ref="tree"></el-tree>
            <el-button
                style="margin-left: 10px;text-align: left"
                type="primary"
                @click="importData"
                size="mini"

            >导入数据
            </el-button>
        </el-aside>
        <el-main style="padding: 0;">
            <div style="margin-top: 20px; ">
                <el-tag type="warning" class="table_header" effect="dark">数据源</el-tag>
                <el-table
                    v-loading="source_loading"
                    highlight-current-row
                    element-loading-text="加载数据中"
                    :data="sourceTable.slice((source_current_page-1) * 12, source_current_page * 12)"
                    ref="sourceTable"
                    @row-click="handleRowClick"
                    style="width: 100%">
                    <el-table-column
                        prop="tableName"
                        align="center"
                        label="数据源名称"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="rowNumber"
                        align="center"
                        label="行数"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="carNumber"
                        align="center"
                        label="车辆数"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="lastModifyTime"
                        align="center"
                        label="上次修改时间"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="firstPointTime"
                        align="center"
                        label="第一个点时间"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="lastPointTime"
                        align="center"
                        label="最后一个点时间"
                    >
                    </el-table-column>
                </el-table>
                <el-pagination
                    :current-page="source_current_page"
                    :total='sourceTable.length'
                    layout="prev, pager, next"
                    @current-change="handleSOURCEpageChange"
                    :page-size="12"
                >
                </el-pagination>
            </div>
            <el-form ref="tra" :model="tra" label-width="150px"
                     style="margin-top: 20px; width:700px;margin-left: 5px" v-show="showForm">
                <el-tag type="success" class="table_header" effect="dark">数据源生成轨迹文件表单</el-tag>
                <el-form-item style="margin-top: 15px;text-align: left;" label="数据源名称">
                    <el-input v-model="tra.tableName" :disabled="true" style="width: 350px;"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span=6>
                        <el-form-item label="过滤车牌号" >
                            <el-checkbox v-model="filterCarNumber" @change="handleCarNumberCheck"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span=18 style="text-align: left;">
                        <el-select
                            v-model="tra.carNumber"
                            multiple
                            :disabled="!filterCarNumber"
                            style="margin-left: 5px"
                            collapse-tags
                            placeholder="请选择">
                            <el-option
                                v-for="item in carNumberOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=6>
                        <el-form-item label="过滤车牌类型">
                            <el-checkbox v-model="filterCarType" @change="handleCarTypeCheck"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span=18 style="text-align: left;">
                        <el-select
                            v-model="tra.carType"
                            multiple
                            :disabled="!filterCarType"
                            collapse-tags
                            style="margin-left: 5px"
                            placeholder="请选择">
                            <el-option
                                v-for="item in carTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=6>
                        <el-form-item label="过滤轨迹范围">
                            <el-checkbox v-model="tra.filterTraRange" @change="handleTraRangeCheck"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span=18 style="text-align: left;">
                        <el-select
                            v-model="tra.traRange"
                            multiple
                            :disabled="!tra.filterTraRange"
                            collapse-tags
                            style="margin-left: 5px"
                            placeholder="请选择">
                            <el-option
                                v-for="item in traRangeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=6>
                        <el-form-item label="过滤轨迹中点数量" >
                            <el-checkbox v-model="filterPointNumber" @change="handlePointNumberCheck"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span=18 style="text-align: left;">
                        <el-input v-model="tra.pointNumber" type="number" style="width: 223px;margin-left: 5px" :disabled="!filterPointNumber">
                            <template slot="append">个</template>
                        </el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=6>
                        <el-form-item label="过滤轨迹长度" >
                            <el-checkbox v-model="filterTraLength" @change="handleTraLengthCheck"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span=18 style="text-align: left;">
                        <el-input v-model="tra.traLength" type="number" style="width: 223px;margin-left: 5px" :disabled="!filterPointNumber">
                            <template slot="append">m</template>
                        </el-input>
                    </el-col>
                </el-row>

                <el-form-item label="轨迹切分阈值" style="text-align: left;">
                    <el-input v-model="tra.traCut" type="number" style="width: 350px;">
                        <template slot="append">min</template>
                    </el-input>
                </el-form-item>
                <el-form-item style="text-align: left;">
                    <el-button type="primary" @click="onSubmit">导出轨迹</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
import {Loading} from 'element-ui';

export default {
    name: "dataProcess",
    components: {},
    data() {
        return {
            filterCarType: false,
            filterCarNumber: false,
            filterPointNumber: false,
            filterTraLength: false,

            showForm: false,
            tra: {
                tableName: null,
                carNumber: [],
                carType: [],
                traCut: null,
                pointNumber: null,
                traLength: null,
                filterTraRange: false,
                traRange: []
            },
            carNumberOptions: [
                {
                    value: '山东省济南市内',
                    label: '山东省济南市内'
                },
                {
                    value: '山东省济南市外',
                    label: '山东省济南市外'
                },
                {
                    value: '其他省份',
                    label: '其他省份'
                }
            ],
            traRangeOptions: [
                {
                    value: '济南市主城区',
                    label: '济南市主城区'
                },
                {
                    value: '其他地区',
                    label: '其他地区'
                }
            ],
            carTypeOptions: [
                {
                    value: '小型汽车号牌',
                    label: '小型汽车号牌'
                },
                {
                    value: '大型汽车号牌',
                    label: '大型汽车号牌'
                },
                {
                    value: '小型新能源汽车号牌',
                    label: '小型新能源汽车号牌'
                }
            ],
            source_loading: false,
            sourceTable: [],
            source_current_page: 1,
            fileTree: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1'
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1'
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    methods: {
        onSubmit() {
            let loading = Loading.service({fullscreen: true, text: 'Loading'});
            this.axios.post("/camTra/generateTra", this.tra).then(res => {
                setTimeout(() => {
                    loading.close();
                }, 1000);
                console.log(res.data.msg)
            })
        },
        handleRowClick(row) {
            this.showForm = true
            this.tra.tableName = row.tableName
            console.log(row)
        },
        importData() {
            let loading = Loading.service({fullscreen: true, text: 'Loading'});
            let leafNode = this.$refs.tree.getCheckedNodes(true, false)
            let arrLabel = []
            leafNode.forEach((item) => {
                arrLabel.push(this.findIndexArray(this.fileTree, item.id, []).join("/"))
            })
            if (arrLabel.length) {
                this.axios.post("/camTra/importData", arrLabel).then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                    this.getSourceNames()
                    alert('导入数据成功：数据源名称[' + res.data.msg + ']')
                })
            } else {
                alert("请先选择要导入的文件")
            }
            console.log(arrLabel)
        },
        handleSOURCEpageChange(val) {
            this.source_current_page = val
        },
        handleCheckChange(data, checked, indeterminate) {
        },
        handleCarNumberCheck(val) {
            if(!val){
                this.tra.carNumber = []
            }
        },
        handleCarTypeCheck(val) {
            if(!val){
                this.tra.carType = []
            }
        },
        handlePointNumberCheck(val) {
            if(!val){
                this.tra.pointNumber = null
            }
        },
        handleTraLengthCheck(val) {
            if(!val){
                this.tra.traLength = null
            }
        },
        handleTraRangeCheck(val) {
            if(!val){
                this.tra.traRange = []
            }
        },
        findIndexArray(data, id, indexArray) {
            let arr = Array.from(indexArray)
            for (let i = 0, len = data.length; i < len; i++) {
                arr.push(data[i].label)
                if (data[i].id === id) {
                    return arr
                }
                let children = data[i].children
                if (children && children.length) {
                    let result = this.findIndexArray(children, id, arr)
                    if (result) return result
                }
                arr.pop()
            }
            return false
        },
        getSourceNames() {
            this.sourceTable = []
            this.axios.get("/camTra/getTables").then(res => {

                res.data.msg.forEach(item => {
                    this.sourceTable.push(
                        {
                            tableName: item.tableName,
                            rowNumber: item.rowNumber,
                            carNumber: item.carNumber,
                            lastModifyTime: item.lastModifyTime,
                            firstPointTime: item.firstPointTime,
                            lastPointTime: item.lastPointTime,
                        })
                })
            })
        },
        getCarTypes() {
            this.carTypeOptions = []
            this.axios.get("/camTra/getCarTypes").then(res => {

                res.data.msg.forEach(item => {
                    this.carTypeOptions.push({label: item, value: item})
                })
            })
        }

    },
    beforeMount() {
        this.axios.get("/camTra/getDirectoryStructure").then(res => {
            this.fileTree = [res.data.msg]
        })
        this.getSourceNames()
        this.getCarTypes()
    },
    created() {
    },
    watch: {}
}
</script>

<style scoped>
.el-header {
    padding: 0;
}

.switchButton {
    float: left;
    margin-top: 0px;
    margin-left: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
}

.table_header {
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    font-family: "Microsoft YaHei";
    width: 100%;
}
</style>