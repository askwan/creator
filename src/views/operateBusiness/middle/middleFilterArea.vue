<script>
export default {
  props:{
      sortData:Object,
      checkText: String,
      isMine: Boolean
  },
  data() {
    return {
     isMy:this.isMine,
     lists: ["全部","测绘行业","测绘行业","测绘行业","测绘行业","测绘行业","测绘行业","测绘行业","测绘行业","测绘行业","测绘行业"],
     currentText:"",
     inDownShow: false,
     searchInputActive: false,
     startSearch:""
    };
  },
  components:{

  },
  mounted(){
    this.sortData.current=this.sortData.sortList[0];
    this.currentText = this.lists[0];
  },
  methods:{
    clickSortFn(data){
      if(  this.sortData.current.id == data.id ){
        this.sortData.direction =  this.sortData.direction?0:1;
      }else{
        this.sortData.current = data;
        this.sortData.direction = 0;
      }
      this.$emit("clickSortFn",data)
    },
    clickCheckFn(){
       this.isMy = !this.isMy;
      // this.isQuality = data
       this.$emit("clickCheckFn", this.isMy);
    },
    clickDownAFn(txt){
      this.currentText = txt;
      this.inDownShow = false;
    },
    searchBlurFn(){
      this.searchInputActive = false;
    },
    searchFocusFn(){
      this.searchInputActive = true;
    },
    startSearchFn(){
      this.$emit("startSearch",this.searchTxt)
    },
    clearFileterFn(){//清除筛选
      this.isMy = false;
      this.sortData.current=this.sortData.sortList[0];
      this.sortData.direction = 0;
      this.currentText = this.lists[0];
      this.inDownShow = false;
      this.$emit("clearFileterFn");
    },
    searchTitClickFn(){
      this.$refs.searchInput.focus();
    }
  }
};
</script>
<template>
  <div class="filter-box cle">
    <div class="filter-m-box cle">
      <common-sort  v-for="sort in sortData.sortList" :checked-status="sortData.current.id" :checked-direction="sortData.direction" :sort-data="sort"  :key="sort.id" @clickSortFn="clickSortFn" class="filter-sort"/>
      <div class="quality-box">
          <common-checkbox v-model="isMy" :check-text="checkText" @clickCheckFn="clickCheckFn"/>
      </div>
      <!-- <div class="industry-box">
        <a href="javascript:;" @click="inDownShow = !inDownShow" class="in-tit"><strong>行业：</strong><span>{{currentText}}</span><i class="iconfont icon-icon1" :class="{'active':inDownShow}"></i></a>
      </div>
      <div class="crear-filter-box">
        <a href="javascript:;" class="cle" @click="clearFileterFn"><i class="iconfont icon-cuowu"></i><span>清除筛选</span></a>
      </div>   -->
      <div class="search-box cle" :class="{'active':searchInputActive}">
      <!-- <common-search-bar @startSearch="startSearch"/> -->
      <div class="search-input">
        <input 
        type="text" 
        @blur="searchBlurFn" 
        @focus="searchFocusFn" 
        @keyup.enter="startSearchFn"
        v-model="startSearch"
        ref="searchInput"
        >
        </div>
      <div class="iconfont icon-sousuo search-ico" @click="startSearchFn"></div>
    </div>
    </div>
    <transition name="slide-fade">
      <div class="in-down" v-if="inDownShow">
        <a href="javascript:;" @click="clickDownAFn(list)" v-for="(list,index) in lists" :key="index">{{list}}</a>
      </div>
    </transition>
    
  </div>
</template>
<style lang="less" scoped>

a.add-business {
    position: absolute;
    top: 0;
    right: 0;
    background: #176de6;
    border-radius: 3px;
    display: block;
    width: 80px;
    height: 38px;
    line-height: 38px;
    color: #fff;
    text-indent: 30px;
    transition: all .2s ease;
    &:hover {
        background: #176de6e3;
    }
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 13px;
      left: 17px;
      width: 2px;
      height: 12px;
      background: #fff;
    }
    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 18px;
      left: 12px;
      width: 12px;
      height: 2px;
      background: #fff;
    }
  }
  .search-box {
    float: right;
    padding: 0 45px 0 0;
    position: relative;
    border-left: 1px solid #ebeced;
    background: #fff;
    &.active {
      .search-input {
        width: 236px;
      }
      .search-ico {
        background: #176de6;
        color: #fff;
      }
      .search-fl {
        color: #333;
      }
    }
    .search-fl {
      float: left;
      color: #afb0b2;
      line-height: 36px;
      margin: 0 13px;
      transition: all .2s ease;
    }
    .search-input {
      float: left;
      width: 140px;
      transition: all .2s ease;
      input {
        width: 100%;
        height: 36px;
        line-height: 36px;
        border: none;
        padding: 0;
        outline: none;
        text-indent: 15px;
      }
    }
    .search-ico {
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      color: #e3e4e6;
      width: 40px;
      transition: all .2s ease;
      border-radius: 0 3px 3px 0;
      cursor: pointer;
      &:before {
        position: absolute;
        top: 6px;
        left: 13px;
      }
    }
  }
  .slide-fade-enter-active {
    transition: all .1s ease;
  }
  .slide-fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter {
    transform: translateY(-20px);
    opacity: 0;
  }
   .slide-fade-leave-to {
    transform: translateY(0px);
    opacity: 0;
  }
  .industry-box {
    position: relative;
    float: left;
    .in-tit {
      line-height: 36px;
      float: left;
      padding: 0 30px 0 20px;
      color: #666;
      border-right: 1px solid #ebeced;
      position: relative;
      strong {
        color: #666;
        font-weight: normal;
      }
      span {
        color: #176de6;
      }
      i {
        color: #666;
        position: absolute;
        top: 9px;
        right: 10px;
        line-height: 20px;
        transition: all .2s ease;
        &.active {
          transform: rotate(-180deg);
        }
      }
    }
  }
  .in-down {
      position: absolute;
      top: 36px;
      left: 0;
      right: 0;
      z-index: 11;
      background: #fff;
      box-shadow: 0 0 11px 2px #e3e2e2;
      border-radius: 0 0 3px 3px;
      padding-bottom: 10px;
      a {
        margin: 10px 0 0 10px;
        display: block;
        float: left;
        color: #333;
        padding: 0 9px;
        line-height: 23px;
        &:hover {
          background: #176de6;
          color: #fff;
        }
      }
    }
  .crear-filter-box {
    line-height: 36px;
    a {
      color: #b3b3b3;
      display: block;
      float: left;
      padding: 0 20px;
      &:hover {
        color: #e54545;
      }
      i {
        line-height: 20px;
        float: left;
        margin: 9px 3px 0 0;
      }
      span {
        float: left;
      }
    }
  }
  .filter-m-box {
    border: 1px solid #ebeced;
    background: #fafbfc;
    border-radius: 3px;
    margin: 0 96px 0 0;
    transition: all .2s ease;
  }
  .filter-box {
    margin: 0 30px;
    position: relative;
    &.active {
      .filter-m-box {
        margin: 0 0 0 0;
      }
      .add-business {
        transform: scale(0);
      }
    }
    .filter-sort {
      margin: 0 15px 0 0;
    }
    .quality-box {
      float: left;
      padding: 0 20px;
      line-height: 34px;
      border-left: 1px solid #ebeced;
      border-right: 1px solid #ebeced;
    }
  }

</style>
