import { ref } from 'vue'
import { defineStore } from 'pinia'
import { PixelReactor, RuleGrid, type Vec2d } from "../../PixelReactor"

export const useRulesStore = defineStore('rules', () => {

  // const ruleGridMap = ref(new Map<string, RuleGrid<any>>);
  let outOfBounds: Vec2d = [-1, -1];
  const mouseLocation = ref(outOfBounds);

  function getMouseLocation() {
    return mouseLocation;
  }

  function setMouseLocation(newLoc: Vec2d) {
    mouseLocation.value = newLoc;
    //console.log(newLoc)
  }

  const _pixelReactor = ref()
  function setPixelReactor(pixelReactor: PixelReactor<any>) {
    _pixelReactor.value = pixelReactor;
  }

  function getPixelReactor() {
    return _pixelReactor;
  }

  return { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor }
})
