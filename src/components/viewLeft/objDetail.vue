<template>
  <div class='detail-content pd-small' v-loading='loading'>
    <div class="detail-name align-center font-16 text-ellipsis mg-bottom-mini">
      {{sobject.name|formateName}}
    </div>
    <div class="property-box mg-bottom-small" v-if="attrs.length>0">
      <div class="property-title font-14 mg-bottom-mini">属性</div>
      <ul class="property-table">
        <li class="property-row flex" v-for="(item,key) in attrs" :key="key">
          <div class="e-name pd-mini font-12 text-ellipsis">{{item.caption}}：</div>
          <div class="e-value pd-mini font-12 text-ellipsis">{{item.value}}</div>
        </li>
      </ul>
    </div>
    <div class="relation-box" v-if="sobject.network">
      <div class="font-14" v-if="sobject.network.nodes&&sobject.network.nodes.length>0">关系</div>
      <ul class="relation-list mg-bottom-mini">
        <li class="relation-el flex-center" v-for="(node,i) in sobject.network.nodes" :key="i">
          <span class="r-obj font-12 text-ellipsis">{{sobject.name|formateName}}</span>
          <div class="r-connector flex-column">
            <span class="r-name text-ellipsis">{{node.edge.relation.name|formateName}}</span>
            <div class="r-center flex-center">
              <span class="underline"></span>
              <i class="iconfont icon-zuojiantou"></i>
            </div>
          </div>
          <span class="r-obj font-12 text-ellipsis">{{node.label|formateName}}</span>
        </li>
      </ul>
    </div>
    <div class="source-box property-box" v-if="dobject.id">
      <div class="font-14">来源</div>
      <ul class="property-table">
        <li class="property-row flex">
          <div class="e-name pd-mini font-12 text-ellipsis">文件名：</div>
          <div class="e-value pd-mini font-12 text-ellipsis">{{dobject.name}}</div>
        </li>
        <li class="property-row flex" v-for="(item,key) in dobject.attributes" :key="key">
          <div class="e-name pd-mini font-12 text-ellipsis">{{item.name}}：</div>
          <div class="e-value pd-mini font-12 text-ellipsis">{{item.value}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import psde from '@/script/editor/psde';
  import {otypeServer,dobjectServer} from '@/script/server';
  export default {
    data(){
      return {
        attrs:[],
        dobject:{}
      }
    },
    props:{
      sobject:{
        type:Object,
        default:()=>{return {}}
      },
      loading:{
        type:Boolean,
        default:false
      }
    },
    filters:{
      formateName(str){
        return str?str:'default'
      }
    },
    watch:{
      'sobject.id'(id){
        if(id){
          this.getAttrs();
          this.getDobject();
        }
      }
    },
    components:{},
    computed:{

    },
    mounted(){
      this.getAttrs();
      this.getDobject();
    },
    methods:{
      getAttrs(){
        this.attrs = [];
          otypeServer.query({ids:this.sobject.otype.id}).then(res=>{
            let arr = res.list[0].fields.fields;  
            arr.forEach(el=>{
              let obj = {};
              obj.name = el.name;
              obj.caption = el.caption;
              obj.value = '';

              this.attrs.push(obj);
            })
            this.sobject.attributes.forEach(attr=>{
              let field = this.attrs.find(el=>el.name==attr.name);
              if(field) {
                field.value = attr.value;
              }else{
                attr.caption = attr.name;
                this.attrs.push(attr);
              }
            })
          })
      },
      getDobject(){
        this.dobject = {};
        dobjectServer.query({fromIds:this.sobject.from,uids:''}).then(res=>{
          if(res.list[0]){
            this.dobject = res.list[0];
          }
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  $border: 1px solid #ccc;
  .detail-content{
    background-color: #fff;
    .property-box{
      .property-table{
        border: $border;
        border-bottom: none;
        .property-row{
          .e-name{
            width: 100px;
            flex-shrink: 0;
            border-right: $border;
            border-bottom: $border;
          }
          .e-value{
            flex-grow: 1;
            border-bottom: $border;
          }
        }
      }
    }
    .relation-box{
      .relation-list{
        .relation-el{
          .r-obj{
            width: 40px;
          }
          height: 40px;
          .r-connector{
            .r-name{
              display: inline-block;
              margin-bottom: -5px;
            }
            .r-center{
              margin: -10px 10px 0px; 
              .underline{
                display: inline-block;
                width: 150px;
                border: 0.5px solid #333;
              }
              i{
                margin-left: -5px;
                padding-top: 1px;
              }
            }
          }
        }

      }
    }
  }
</style>