<template>
    <div class="h-6" />
    <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
    >
        <el-menu-item index="0">CT去噪</el-menu-item>
        <el-menu-item index="1">影像报告</el-menu-item>
        <!-- <div class="flex-grow" /> -->
        <el-sub-menu index="2">
            <template #title>Users</template>
            <el-menu-item index="2-1">视频帮助</el-menu-item>
            <el-menu-item index="2-2">设置</el-menu-item>
            <el-menu-item index="2-3">帮助</el-menu-item>
            <el-menu-item index="2-4">退出</el-menu-item>
        </el-sub-menu>
    </el-menu>

    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo2"
        mode="horizontal"
        @select="handleSelect"
    >
        <el-menu-item index="1">全部影像</el-menu-item>
        <el-menu-item index="2">我的任务</el-menu-item>
        <el-sub-menu index="3">
            <template #title>快捷查询</template>
            <el-menu-item index="3-1">item one</el-menu-item>
            <el-menu-item index="3-2">item two</el-menu-item>
            <el-menu-item index="3-3">item three</el-menu-item>
        </el-sub-menu>
        <!-- <div class="flex-grow" /> -->
        <el-menu-item index="4">
            <div class="mt-4">
                <el-input
                    v-model="input3"
                    placeholder="Please input"
                    class="input-with-select"
                    style="vertical-align: middle"
                >
                    <template #prepend>
                        <el-select v-model="select" placeholder="姓名" style="width: 115px">
                            <el-option label="姓名" value="1" />
                            <el-option label="ID" value="2" />
                            <el-option label="检查号" value="3" />
                        </el-select>
                    </template>
                    <template #append>
                        <el-button :icon="Search" />
                    </template>
                </el-input>
            </div>
        </el-menu-item>
    </el-menu>

    <div style="height: 60px">
        <span
            style="
                display: inline-block;
                height: 60px;
                line-height: 60px;
                padding-left: 15px;
                font-size: 14px;
            "
            >共0条</span
        >
        <span class="flex" style="margin-left: 30px">
            <el-button type="primary" style="width: 80px; border-radius: 20px">
                上传<el-icon class="el-icon--right"><Upload /></el-icon>
            </el-button>
        </span>
        <span class="flex" style="margin-left: 15px">
            <el-button type="primary" style="width: 80px; border-radius: 20px">
                刷新<el-icon class="el-icon--right"><Refresh /></el-icon>
            </el-button>
        </span>
        <div style="height: 60px; float: right; margin: 20px 30px">
            <el-checkbox-group v-model="checkList">
                <el-checkbox label="检查部位" />
                <el-checkbox label="检查项目" />
                <el-checkbox label="机构名称" />
                <el-checkbox label="上传时间" />
                <el-checkbox label="指派对象" />
            </el-checkbox-group>
        </div>
    </div>

    <!-- <el-button @click="resetDateFilter">reset date filter</el-button> -->
    <el-button @click="clearFilter">重置筛选</el-button>
    <el-table ref="tableRef" row-key="date" :data="tableData" style="width: 100% height: 50px;">
        <el-table-column fixed prop="id" label="ID" width="180" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="sex" label="性别" width="120" />
        <el-table-column
            prop="date"
            label="检查日期"
            sortable
            width="180"
            column-key="date"
            :filters="[
                { text: '2016-05-01', value: '2016-05-01' },
                { text: '2016-05-02', value: '2016-05-02' },
                { text: '2016-05-03', value: '2016-05-03' },
                { text: '2016-05-04', value: '2016-05-04' }
            ]"
            :filter-method="filterHandler"
        />

        <el-table-column prop="situation" label="状态" :formatter="formatter" />

        <el-table-column
            prop="tag"
            label="设备类型"
            width="100"
            :filters="[
                { text: 'CT', value: 'CT' },
                { text: 'DX', value: 'DX' },
                { text: 'DR', value: 'DR' }
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
        >
            <template #default="scope">
                <el-tag :type="scope.row.tag === 'CT' ? '' : 'success'" disable-transitions>{{
                    scope.row.tag
                }}</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { Upload } from '@element-plus/icons-vue'
import { Refresh } from '@element-plus/icons-vue'
import type { TableColumnCtx, TableInstance } from 'element-plus'

interface User {
    id: string
    sex: string
    date: string
    name: string
    situation: string
    tag: string
}
const activeIndex = ref('1')
const activeIndex2 = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const input3 = ref('')
const select = ref('')
const checkList = ref(['selected and disabled', 'Option A'])

const tableRef = ref<TableInstance>()

const resetDateFilter = () => {
    tableRef.value!.clearFilter(['date'])
}
// TODO: improvement typing when refactor table
const clearFilter = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    tableRef.value!.clearFilter()
}
const formatter = (row: User, column: TableColumnCtx<User>) => {
    return row.situation
}
const filterTag = (value: string, row: User) => {
    return row.tag === value
}
const filterHandler = (value: string, row: User, column: TableColumnCtx<User>) => {
    const property = column['property']
    return row[property] === value
}

const tableData: User[] = [
    {
        id: '1',
        sex: '男',
        date: '2016-05-03',
        name: 'Tom',
        situation: '...',
        tag: 'CT'
    },
    {
        id: '2',
        sex: '男',
        date: '2016-05-02',
        name: 'Tom',
        situation: '...',
        tag: 'DX'
    },
    {
        id: '3',
        sex: '男',
        date: '2016-05-04',
        name: 'Tom',
        situation: '...',
        tag: 'CT'
    },
    {
        id: '4',
        sex: '男',
        date: '2016-05-01',
        name: 'Tom',
        situation: '...',
        tag: 'DR'
    }
]
</script>

<style>
.flex-grow {
    flex-grow: 1;
}
.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}
.el-menu-demo2 {
    height: 60px;
}
</style>
