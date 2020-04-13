<template>
  <div class>
    <div v-if="isReady">
      <FaqClientPage :height="height" :column-width="columnWidth" />
    </div>
  </div>
</template>

<script lang="ts">
import * as scrollUtil from "./FaqClientPage/scrollUtil";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { navigationStoreModule } from "./FaqClientPage/store/navigationStore";
import FaqClientPage from "./FaqClientPage/FaqClientPage.vue";
import ResourceList from "./FaqClientPage/columns/ResourceList.vue";
import { DataResource } from "./FaqClientPage/dataResource";
import {
  getViewSections,
  openByResource
} from "./FaqClientPage/resourceNavigationUtil";
import base64url from "base64url";
@Component({
  components: { FaqClientPage, ResourceList }
  // components: { TaggedInput, ColumnNavigation, VerticalNavigation, Breadcrumbs },
})
export default class Wrapper extends Vue {
  dataResource: DataResource = new DataResource();
  get sections() {
    return getViewSections(navigationStoreModule.Route);
  }
  isReady: boolean = false;
  @Prop()
  public scriptPackage: any;
  @Prop()
  eventHub: any;
  @Prop()
  height: any;
  @Prop({ type: Number, default: 300 })
  columnWidth: any;
  @Watch("navigationStoreModule.Routes")
  onRouteChanged() {
    this.$nextTick(() => {
      const target = document.querySelector(".vue-andy-kurage-active");
      if (target) {
        scrollUtil.scrollIntoViewY(target);
      }
    });
  }
  @Watch("scriptPackage")
  initDataResource() {
    console.log("scriptPackage");
    if (this.scriptPackage) {
      navigationStoreModule.setDataResource(this.scriptPackage);
      setTimeout(() => {
        this.isReady = true;
      }, 100);
    }
  }
  mounted() {
    if (this.scriptPackage) {
      navigationStoreModule.setDataResource(this.scriptPackage);

      setTimeout(() => {
        this.isReady = true;
      }, 100);
    }
    this.eventOn();
  }
  private async selectScenarioItem(
    talkScriptId: string,
    stepIdList: string[] = []
  ) {
    const stepIds = stepIdList;
    const talkScript = await this.dataResource.getItem({
      resourceName: "talkScript",
      talkScriptId
    });
    const SearchObject = {
      talkScript: talkScript,
      scenarios:
        stepIds &&
        (await Promise.all(
          stepIds.map((stepId: string) =>
            this.dataResource.getItem({
              resourceName: "scenario",
              scenarioId: talkScript.scenarioId,
              stepId
            })
          )
        ))
    };
    openByResource(navigationStoreModule, SearchObject);
  }
  private async selectScenarioItemByStepEncoded(
    talkScriptId: string,
    stepEncoded: string
  ) {
    const stepIds =
      (stepEncoded && JSON.parse(base64url.decode(stepEncoded))) || [];
    const talkScript = await this.dataResource.getItem({
      resourceName: "talkScript",
      talkScriptId
    });
    const SearchObject = {
      talkScript: talkScript,
      scenarios:
        stepIds &&
        (await Promise.all(
          stepIds.map((stepId: string) =>
            this.dataResource.getItem({
              resourceName: "scenario",
              scenarioId: talkScript.scenarioId,
              stepId
            })
          )
        ))
    };
    openByResource(navigationStoreModule, SearchObject);
  }
  private selectScriptItem(id: string) {
    this.dataResource.setDataResource(this.scriptPackage);
    if (id === "#") {
      navigationStoreModule.setRoutes(this.dataResource.getTopItem());
      return;
    }
    const routes = this.dataResource.getRoutesById(id);
    navigationStoreModule.setRoutes(routes);
  }
  private setRoutes(routes: Array<any>) {
    navigationStoreModule.setRoutes(routes);
  }
  private setIndex(index: number) {
    navigationStoreModule.movePositionTo(index);
  }
  @Watch("eventHub")
  private eventOn() {
    if (this.eventHub) {
      this.eventHub.$on("selectScriptItem", this.selectScriptItem);
      this.eventHub.$on("selectScenarioItem", this.selectScenarioItem);
      this.eventHub.$on(
        "selectScenarioItemByStepEncoded",
        this.selectScenarioItemByStepEncoded
      );
      this.eventHub.$on("setRoutes", this.setRoutes);
      this.eventHub.$on("setIndex", this.setIndex);
      navigationStoreModule.setEventHub(this.eventHub);
    }
  }
  private eventOff() {
    if (this.eventHub) {
      this.eventHub.$off("selectScriptItem", this.selectScriptItem);
      this.eventHub.$off("setRoutes", this.setRoutes);
      this.eventHub.$off("setIndex", this.setIndex);
      this.eventHub.$off("selectScenarioItem", this.selectScenarioItem);
      this.eventHub.$off(
        "selectScenarioItemByStepEncoded",
        this.selectScenarioItemByStepEncoded
      );
    }
  }
  private destroyed() {
    this.eventOff();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
