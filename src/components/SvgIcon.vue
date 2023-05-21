<template>
    <svg :style="{ color: color }" class="icon" :class="svgSize" aria-hidden="true">
        <use :xlink:href="'#' + name" :fill="color"></use>
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    color?: string
    size?: string
    name?: string
}

//设置默认值的 父传子
const props = withDefaults(defineProps<Props>(), {
    color: '#8e9199',
    size: 'small',
    name: 'test'
})

//计算属性 拼字符串
const svgSize = computed(() => 'icon-' + props.size)
</script>

<style lang="scss" scoped>
.icon {
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;

    &-small {
        width: 1em;
        height: 1em;
    }

    &-middle {
        width: 1.5em;
        height: 1.5em;
    }

    &-large {
        width: 2em;
        height: 2em;
    }
}
</style>
