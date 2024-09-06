import { ref } from 'vue'
import { defineStore } from 'pinia'
import { RuleGrid, type Vec2d } from "../../../../ParametricGrid"

export const useRulesStore = defineStore('rules', () => {

  const ruleGridMap = ref(new Map<string, RuleGrid<any>>);
  let outOfBounds: Vec2d = [-1, -1];
  const mouseLocation = ref(outOfBounds)

  function setRule(id: string, pgrid: RuleGrid<any>) {
    ruleGridMap.value.set(id, pgrid)
    console.log(ruleGridMap.value)
  }

  function getRule(id: string) {
    const rg = ruleGridMap.value.get(id)
    console.log(rg)
    return rg
  }

  function serialize(): string {
    // let ruleStringMap = new Map<string, string>();
    // ruleGridMap.value.forEach((rule, id) => {
    //   ruleStringMap.set(id, JSON.stringify(rule))
    //   //console.log(id,":", JSON.stringify(rule))
    // });
    return serializeRules();
  }

  function serializeRules() {
    // let ruleStringMap = new Map<string, string>();
    // ruleGridMap.value.forEach((rule, id) => {
    //   ruleStringMap.set(id, JSON.stringify(rule))
    // });
    const obj = Object.fromEntries(ruleGridMap.value);
    return JSON.stringify(obj);
    //return ruleStringMap;
  }



  function deserialize(jsonText: string) {

  }

  function getMouseLocation() {
    return mouseLocation;
  }

  function setMouseLocation(newLoc: Vec2d) {
    mouseLocation.value = newLoc;
    //console.log(newLoc)
  }

  function getAllRuleIds() {
    let ids: string[] = []
    const obj = Object.fromEntries(ruleGridMap.value);
    let ruleKeys = Array.from(ruleGridMap.value.keys());


    return ruleKeys;
  }

  function getAllMatches() {
    let ruleKeys = getAllRuleIds();
    let mainGrid = ruleGridMap.value.get("MAIN");
    let matchMap = new Map<string, Map<string, any[]>>();
    ruleKeys.forEach(key => {
      if (key != "MAIN") {
        let rule = ruleGridMap.value.get(key)
        let matchesForRule = mainGrid.simpleMatchAllTransforms(rule)
        matchMap.set(key, matchesForRule);
      }
    });
    return matchMap;
  }

  return { ruleGridMap, setRule, getRule, serialize, getMouseLocation, setMouseLocation, getAllRuleIds, getAllMatches }
})
