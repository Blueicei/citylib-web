<template>
    <div id="app">
        <transition name="el-fade-in-linear">
            <router-view/>
        </transition>
    </div>
</template>

<script>

export default {
    name: 'App',
}
</script>

<style>
html,body,#app{
    height: 100%;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin: -8px -8px auto;
}
</style>