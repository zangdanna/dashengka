<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
/* @import "./assets/css/style.scss"; */
#app {
    height: 100%;
    min-height: 900px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
}
/* ��ҳ���޸�ʧЧԭ��el-popover�Ǻ�appͬ��
el-popover����ʽclassҲ��el-popover��el-popover���ɵ�div���ڵ�ǰ���֮�ڣ���App.vue�����divƽ����
������Ҫ����ȫ��style�� */
/* �����˵��ļ�ͷ��ɰ�ɫ */
/* .el-popper[x-placement^=bottom] .popper__arrow::after {
    border-bottom-color: #ffffff;
} */
/* �����˵�������ɰ�ɫ */
/* .el-select-dropdown__list {
  background-color: #ffffff;
} */
/* .el-autocomplete-suggestion {
    background-color: #ffffff;
}
.el-autocomplete-suggestion li {
    color: #7a7a7a;
}
.el-autocomplete-suggestion li.highlighted, .el-autocomplete-suggestion li:hover {
    background-color: #b5b4b478;
}
.el-input-group__prepend {
    border-color: solid #e2e2e2;
} */
</style>
