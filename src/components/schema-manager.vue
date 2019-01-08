<template>
  <div class="schema-manager">
    <div v-if="!isNew && !isDetail">
      <a-button class="schema-btn-special">New Schema</a-button>
      <template v-for="(item, index) of schemas">
        <div :key="index"><a-button class="schema-btn" @click="handleClickSchema(index)">{{capitalize(item.schemaName)}}</a-button></div>
      </template>
    </div>
    <div v-if="isDetail">
      <a-button class="schema-btn-special">Back</a-button>
      <a-form @submit="handleClickSubmit" :form="schemaForm" layout="vertical">
        <a-form-item label="schema" required>
          <a-input
            v-decorator="['schemaName', { initialValue: defaultSchemaForm.schemaName }]"
          />
        </a-form-item>
        <a-form-item label="table" required>
          <a-input
            v-decorator="['tableName', { initialValue: defaultSchemaForm.tableName }]"
          />
        </a-form-item>
        <a-divider orientation="left">columns</a-divider>
        <template v-for="(item, index) of defaultSchemaForm.items">
          <div class="schema-column" :key="index">
            <a-collapse >
              <a-collapse-panel :header="item.name">
                <a-form-item label="name" required>
                  <a-input
                  v-decorator="['items[index][name]', { initialValue: defaultSchemaForm.items[index].name }]"
                  />
                </a-form-item>
                <a-form-item v-if="item.alias" label="alias">
                  <a-input
                  v-decorator="['items[index][alias]', { initialValue: defaultSchemaForm.items[index].alias }]"
                  />
                </a-form-item>
                <a-form-item v-if="item.foreign" label="foreign">
                  <a-input
                  v-decorator="['items[index][foreign]', { initialValue: defaultSchemaForm.items[index].foreign }]"
                  />
                </a-form-item>
                <a-form-item v-if="item.type" label="type">
                  <a-input
                  v-decorator="['items[index][type]', { initialValue: defaultSchemaForm.items[index].type }]"
                  />
                </a-form-item>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </template>
      </a-form>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
import { capitalize } from 'lodash'

export default {
  name: 'schema-manager',
  props: {
    schemas: Array,
  },
  data() {
    return {
      isNew: false,
      isDetail: false,

      defaultSchemaForm: {
        schemaName: '',
        tableName: '',
        items: [],
      }
    }
  },
  computed: {
  },
  methods: {
    capitalize,

    handleClickSchema(index) {
      this.defaultSchemaForm = this.demodelize(this.schemas[index])
      this.showDetail()
    },

    handleClickSubmit() {

    },

    showDetail() {
      this.isNew = false
      this.isDetail = true
    },

    demodelize(model) {
      const items = model.columns.items.map((item) => {
        return {
          name: item.name,
          alias: item.alias,
          foreign: item.foreign,
          type: item.type,
        }
      })
      return {
        schemaName: model.schemaName,
        tableName: model.tableName,
        items,
      }
    }
  },
  beforeCreate() {
    this.schemaForm = this.$form.createForm(this, {
      props: {
        schemaName: String,
        schemaTable: String,
        items: Array,
      },
      // onValuesChange: () => {
      //   this.handleChangeForm()
      // }
    })
  },
  mounted() {
    console.log(this.schemas)
  },
}
</script>

<style lang="less">
.schema-manager {
  .ant-form-item {
    margin-bottom: 8px;
  }
  .schema-btn-special {
    margin: 10px 0 50px 0;
    width: 120px;
    color: whitesmoke;
    background-color: #666;
  }
  .schema-btn {
    margin: 20px 0;
    width: 120px;
    color: whitesmoke;
    background-color: #666;
  }
  .schema-column {
    margin-bottom: 10px;
  }
}
</style>


