<template>
  <div class="content-swagger">
    <template v-for="(tag, tindex) of swagger.tags">
      <div :key="tindex">
        <a-divider orientation="left">
          {{ tag.name }}
        </a-divider>
        <a-collapse :accordion="isAccordion">
          <template v-for="(pathName, pindex) of Object.keys(swagger.paths)">
            <template v-for="(funcName, findex) of funcMap">
              <a-collapse-panel
                :key="`${pindex}_${findex}`"
                v-if="swagger.paths[pathName][funcName] && swagger.paths[pathName][funcName].tags.includes(tag.name)"
              >
                <div slot="header">
                  <span>{{ funcName.toUpperCase() }}: </span>
                  <span>{{ pathName }}</span>
                </div>
                <a-collapse :accordion="isAccordion">
                  <a-collapse-panel>
                    <div slot="header">
                      <span>operationId: </span>
                      <span>{{ swagger.paths[pathName][funcName].operationId }}</span>
                    </div>
                    <p>text......</p>
                  </a-collapse-panel>
                </a-collapse>
              </a-collapse-panel>
            </template>
          </template>
        </a-collapse>
      </div>
    </template>
  </div>
</template>

<script>
import swagger from '../../../swagger/swagger'

const funcMap = ['get', 'post', 'patch', 'delete']

export default {
  data() {
    return {
      swagger,
      funcMap,

      isAccordion: false,
    }
  },
}
</script>
