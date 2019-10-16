<template>
  <div class="VerticalNavigation">
    <div class="navigationContentWrapper">
      <div ref="navigationContent" class="navigationContent">
        <div
          class="page clearfix"
          v-for="(route, routeIndex) in routes"
          :key="routeIndex"
        >
          <component
            :is="route.componentName"
            :index="routeIndex"
            :currentValue="route"
            :prevValue="
              navigationStore.state.routes[baseIndex + routeIndex - 1]
            "
            :nextValue="
              navigationStore.state.routes[baseIndex + routeIndex + 1]
            "
            :currentLocal="locals[routeIndex]"
            :prevLocal="locals[routeIndex - 1]"
            :nextLocal="locals[routeIndex + 1]"
            :localActive="routeIndex === localIndex"
            :active="baseIndex + routeIndex === navigationStore.state.index"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Component, { mixins } from 'vue-class-component';
import NavigationMixin from '../mixins/NavigationMixin';

@Component
export default class VerticalNavigation extends mixins(NavigationMixin) {}
</script>
<style lang="scss" scoped>
%bottomTriangle {
  content: '';
  position: absolute;
  right: 50px;
  bottom: -40px;
  left: 50px;
  display: inline-block;
  width: 0;
  height: 0;
  margin: auto;
  border: 20px solid;
  border-color: #0a69d8 transparent transparent;
}

.VerticalNavigation {
  box-sizing: border-box;
  height: 100%;
}
.navigationContentWrapper {
  box-sizing: border-box;
  width: 100%;
  padding: 0 30px;
  overflow: hidden;
  .hasScenario & {
    padding-right: 20px;
    padding-left: 20px;
  }
}
.navigationContent {
  width: 100%;
}
.page {
  box-sizing: border-box;
  margin-bottom: 30px;
  padding-bottom: 30px;
  &:not(:last-child) {
    position: relative;
    border-bottom: 2px solid #0a69d8;
    &:before {
      @extend %bottomTriangle;
    }
  }
  .resultContent & {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .scenario__section:not(:last-child) &:last-child {
    position: relative;
    border-bottom: 2px solid #0a69d8;
    &:before {
      @extend %bottomTriangle;
    }
  }
}

.ancester {
  font-size: 14px;
}
</style>
